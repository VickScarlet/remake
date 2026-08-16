(function attachToyCloudSaveCore(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    debugger
    root.ToyCloudSaveCore = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildToyCloudSaveCore() {
  'use strict';

  const CHUNK_CHARS = 960;
  const MAX_CHUNKS = 48;
  const EVENT_LIMIT = 60;
  const BANKS = ['a', 'b'];
  const CRC32_TABLE = buildCrc32Table();

  function buildCrc32Table() {
    const table = new Uint32Array(256);
    for (let index = 0; index < table.length; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) {
        value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
      }
      table[index] = value >>> 0;
    }
    return table;
  }

  function utf8Encode(value) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(value);
    }
    if (typeof Buffer !== 'undefined') {
      return Uint8Array.from(Buffer.from(value, 'utf8'));
    }

    const binary = unescape(encodeURIComponent(value));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function utf8Decode(bytes) {
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    }
    if (typeof Buffer !== 'undefined') {
      const value = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('utf8');
      if (!sameBytes(utf8Encode(value), bytes)) {
        throw new Error('Invalid UTF-8');
      }
      return value;
    }

    let binary = '';
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return decodeURIComponent(escape(binary));
  }

  function sameBytes(left, right) {
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) return false;
    }
    return true;
  }

  function toBytes(input) {
    if (typeof input === 'string') return utf8Encode(input);
    if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
      return new Uint8Array(input);
    }
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(input)) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    throw new TypeError('crc32Hex expects a string, ArrayBuffer, or typed array');
  }

  function crc32Hex(input) {
    const bytes = toBytes(input);
    let crc = 0xffffffff;
    for (let index = 0; index < bytes.length; index += 1) {
      crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    }
    return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
  }

  function bytesToBase64(bytes) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
    }
    if (typeof btoa !== 'function') {
      throw new Error('Base64 encoding is unavailable');
    }

    let binary = '';
    const batch = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += batch) {
      const slice = bytes.subarray(offset, offset + batch);
      for (let index = 0; index < slice.length; index += 1) {
        binary += String.fromCharCode(slice[index]);
      }
    }
    return btoa(binary);
  }

  function base64ToBytes(value) {
    if (!isCanonicalBase64(value)) throw new Error('Invalid Base64');
    if (typeof Buffer !== 'undefined') {
      return Uint8Array.from(Buffer.from(value, 'base64'));
    }
    if (typeof atob !== 'function') {
      throw new Error('Base64 decoding is unavailable');
    }

    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function isCanonicalBase64(value) {
    if (value === '') return true;
    if (value.length % 4 !== 0) return false;
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
  }

  function preparePayload(json) {
    if (typeof json !== 'string') {
      throw new TypeError('Cloud save payload must be a JSON string');
    }
    try {
      JSON.parse(json);
    } catch (parseError) {
      const error = new SyntaxError('Cloud save payload must contain valid JSON');
      error.code = 'INVALID_JSON';
      throw error;
    }

    const bytes = utf8Encode(json);
    const base64 = bytesToBase64(bytes);
    const chunks = [];
    if (base64.length === 0) {
      chunks.push('');
    } else {
      for (let offset = 0; offset < base64.length; offset += CHUNK_CHARS) {
        chunks.push(base64.slice(offset, offset + CHUNK_CHARS));
      }
    }

    return {
      json,
      bytes: bytes.length,
      base64Chars: base64.length,
      chunks,
      checksum: crc32Hex(bytes),
    };
  }

  function inspectPayload(json) {
    const payload = preparePayload(json);
    return {
      json: payload.json,
      bytes: payload.bytes,
      base64Chars: payload.base64Chars,
      chunkCount: payload.chunks.length,
      checksum: payload.checksum,
      exceedsLimit: payload.chunks.length > MAX_CHUNKS,
      chunks: payload.chunks.map((value, index) => ({
        index,
        chars: value.length,
        preview: value.length > 24 ? `${value.slice(0, 24)}…` : value,
      })),
    };
  }

  function createCloudSave(options) {
    const config = options || {};
    const storage = config.storage;
    const prefix = config.prefix;
    const onEvent = config.onEvent;

    if (!storage || typeof storage.get !== 'function' || typeof storage.set !== 'function') {
      throw new TypeError('storage must provide async get(keys) and set(record, context) methods');
    }
    if (typeof prefix !== 'string' || prefix.length === 0) {
      throw new TypeError('prefix must be a non-empty string');
    }
    if (onEvent !== undefined && typeof onEvent !== 'function') {
      throw new TypeError('onEvent must be a function');
    }

    const keys = {
      head: `${prefix}_head`,
      meta(bank) {
        return `${prefix}_${bank}_meta`;
      },
      chunk(bank, index) {
        return `${prefix}_${bank}_${String(index).padStart(3, '0')}`;
      },
    };
    const state = {
      pendingSaves: 0,
      activeSave: false,
      head: null,
      banks: { a: null, b: null },
      lastSave: null,
      lastLoad: null,
      events: [],
    };
    let saveTail = Promise.resolve();

    function emit(type, details) {
      const allowed = [
        'bank', 'generation', 'bytes', 'chunks', 'checksum', 'phase',
        'source', 'fallback', 'recovered', 'pending', 'code', 'found',
      ];
      const event = { type, at: Date.now() };
      const source = details || {};
      for (const key of allowed) {
        if (source[key] !== undefined) event[key] = source[key];
      }
      const frozen = Object.freeze(event);
      state.events.push({ ...event });
      if (state.events.length > EVENT_LIMIT) state.events.shift();
      if (onEvent) {
        try {
          const result = onEvent(frozen);
          if (result && typeof result.catch === 'function') result.catch(function ignoreEventError() {});
        } catch (error) {
          // Observers cannot affect persistence.
        }
      }
    }

    async function getRecord(requestedKeys) {
      const record = await storage.get(requestedKeys);
      return record && typeof record === 'object' ? record : {};
    }

    function own(record, key) {
      return Object.prototype.hasOwnProperty.call(record, key);
    }

    function parseObject(value) {
      if (value && typeof value === 'object' && !Array.isArray(value)) return value;
      if (typeof value !== 'string') return null;
      try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
      } catch (error) {
        return null;
      }
    }

    function parseHead(value) {
      const head = parseObject(value);
      if (!head || head.v !== 1 || !BANKS.includes(head.bank)) return null;
      if (!Number.isSafeInteger(head.generation) || head.generation < 1) return null;
      return { v: 1, bank: head.bank, generation: head.generation };
    }

    function parseMeta(value) {
      const meta = parseObject(value);
      if (!meta || meta.v !== 1) return null;
      if (!Number.isSafeInteger(meta.generation) || meta.generation < 1) return null;
      if (!Number.isSafeInteger(meta.chunks) || meta.chunks < 1 || meta.chunks > MAX_CHUNKS) return null;
      if (!Number.isSafeInteger(meta.bytes) || meta.bytes < 0) return null;
      if (typeof meta.checksum !== 'string' || !/^[0-9a-f]{8}$/.test(meta.checksum)) return null;
      return {
        v: 1,
        generation: meta.generation,
        chunks: meta.chunks,
        bytes: meta.bytes,
        checksum: meta.checksum,
      };
    }

    function summary(bank, meta) {
      return {
        bank,
        generation: meta.generation,
        bytes: meta.bytes,
        chunks: meta.chunks,
        checksum: meta.checksum,
      };
    }

    function invalidBank(bank, status) {
      state.banks[bank] = { bank, valid: false, status };
      return { valid: false, bank, status };
    }

    function validateBankRecord(bank, record, expectedGeneration) {
      const metaKey = keys.meta(bank);
      const meta = own(record, metaKey) ? parseMeta(record[metaKey]) : null;
      if (!meta) return invalidBank(bank, own(record, metaKey) ? 'invalid' : 'missing');
      if (expectedGeneration !== undefined && meta.generation !== expectedGeneration) {
        return invalidBank(bank, 'generation-mismatch');
      }

      const chunks = [];
      for (let index = 0; index < meta.chunks; index += 1) {
        const key = keys.chunk(bank, index);
        const value = record[key];
        if (typeof value !== 'string' || value.length > CHUNK_CHARS) {
          return invalidBank(bank, 'invalid-chunk');
        }
        if (index < meta.chunks - 1 && value.length !== CHUNK_CHARS) {
          return invalidBank(bank, 'invalid-chunk');
        }
        chunks.push(value);
      }

      try {
        const bytes = base64ToBytes(chunks.join(''));
        if (bytes.length !== meta.bytes || crc32Hex(bytes) !== meta.checksum) {
          return invalidBank(bank, 'checksum-mismatch');
        }
        const json = utf8Decode(bytes);
        try {
          JSON.parse(json);
        } catch (parseError) {
          return invalidBank(bank, 'invalid-json');
        }
        const result = { valid: true, bank, json, meta, summary: summary(bank, meta) };
        state.banks[bank] = { ...result.summary, valid: true };
        return result;
      } catch (error) {
        return invalidBank(bank, 'decode-failed');
      }
    }

    async function readHead() {
      const record = await getRecord([keys.head]);
      const head = own(record, keys.head) ? parseHead(record[keys.head]) : null;
      state.head = head
        ? { bank: head.bank, generation: head.generation, valid: true }
        : { valid: false, status: own(record, keys.head) ? 'invalid' : 'missing' };
      return head;
    }

    async function readBank(bank, expectedGeneration) {
      const metaKey = keys.meta(bank);
      const metaRecord = await getRecord([metaKey]);
      const meta = own(metaRecord, metaKey) ? parseMeta(metaRecord[metaKey]) : null;
      if (!meta) return invalidBank(bank, own(metaRecord, metaKey) ? 'invalid' : 'missing');
      if (expectedGeneration !== undefined && meta.generation !== expectedGeneration) {
        return invalidBank(bank, 'generation-mismatch');
      }

      const chunkKeys = [];
      for (let index = 0; index < meta.chunks; index += 1) {
        chunkKeys.push(keys.chunk(bank, index));
      }
      const chunkRecord = await getRecord(chunkKeys);
      return validateBankRecord(bank, { ...metaRecord, ...chunkRecord }, expectedGeneration);
    }

    function otherBank(bank) {
      return bank === 'a' ? 'b' : 'a';
    }

    function newestValid(results) {
      return results
        .filter((result) => result.valid)
        .sort((left, right) => right.meta.generation - left.meta.generation)[0] || null;
    }

    async function chooseSaveTarget() {
      const head = await readHead();
      let first;
      let second;
      let base = null;

      if (head) {
        first = await readBank(head.bank, head.generation);
        second = await readBank(otherBank(head.bank));
        base = first.valid ? first : (second.valid ? second : null);
      } else {
        first = await readBank('a');
        second = await readBank('b');
        base = newestValid([first, second]);
      }

      const highestGeneration = Math.max(
        head ? head.generation : 0,
        first.valid ? first.meta.generation : 0,
        second.valid ? second.meta.generation : 0,
      );
      return {
        bank: base ? otherBank(base.bank) : (head ? otherBank(head.bank) : 'a'),
        generation: highestGeneration + 1,
      };
    }

    function makeError(message, code, ErrorType) {
      const error = new (ErrorType || Error)(message);
      error.code = code;
      return error;
    }

    async function savePrepared(payload) {
      state.activeSave = true;
      let transaction;
      try {
        transaction = await chooseSaveTarget();
        const bank = transaction.bank;
        const generation = transaction.generation;
        const meta = {
          v: 1,
          generation,
          chunks: payload.chunks.length,
          bytes: payload.bytes,
          checksum: payload.checksum,
        };
        const savedSummary = summary(bank, meta);
        const context = { bank, generation };
        emit('save:start', savedSummary);

        const chunkRecord = {};
        for (let index = 0; index < payload.chunks.length; index += 1) {
          chunkRecord[keys.chunk(bank, index)] = payload.chunks[index];
        }
        await storage.set(chunkRecord, { ...context, phase: 'chunks' });
        emit('save:phase', { ...savedSummary, phase: 'chunks' });

        await storage.set({ [keys.meta(bank)]: JSON.stringify(meta) }, { ...context, phase: 'meta' });
        emit('save:phase', { ...savedSummary, phase: 'meta' });

        const verifyKeys = [keys.meta(bank), ...Object.keys(chunkRecord)];
        const readback = await getRecord(verifyKeys);
        const verified = validateBankRecord(bank, readback, generation);
        if (
          !verified.valid
          || verified.json !== payload.json
          || verified.meta.bytes !== meta.bytes
          || verified.meta.chunks !== meta.chunks
          || verified.meta.checksum !== meta.checksum
        ) {
          throw makeError('Cloud save readback verification failed', 'VERIFICATION_FAILED');
        }
        emit('save:verified', { ...savedSummary, phase: 'verify' });

        const head = { v: 1, bank, generation };
        await storage.set({ [keys.head]: JSON.stringify(head) }, { ...context, phase: 'head' });
        state.head = { bank, generation, valid: true };
        state.lastSave = { ...savedSummary };
        emit('save:success', savedSummary);
        return savedSummary;
      } catch (error) {
        emit('save:error', {
          bank: transaction && transaction.bank,
          generation: transaction && transaction.generation,
          code: error && error.code ? error.code : 'STORAGE_ERROR',
        });
        throw error;
      } finally {
        state.activeSave = false;
      }
    }

    function save(json) {
      let payload;
      try {
        payload = preparePayload(json);
        if (payload.chunks.length > MAX_CHUNKS) {
          throw makeError(
            `Cloud save payload needs ${payload.chunks.length} chunks; maximum is ${MAX_CHUNKS}`,
            'PAYLOAD_TOO_LARGE',
            RangeError,
          );
        }
      } catch (error) {
        emit('save:rejected', {
          bytes: payload && payload.bytes,
          chunks: payload && payload.chunks.length,
          code: error && error.code ? error.code : 'INVALID_PAYLOAD',
        });
        return Promise.reject(error);
      }

      state.pendingSaves += 1;
      emit('save:queued', {
        bytes: payload.bytes,
        chunks: payload.chunks.length,
        checksum: payload.checksum,
        pending: state.pendingSaves,
      });
      const operation = saveTail.then(function runQueuedSave() {
        return savePrepared(payload);
      });
      const completed = operation.finally(function finishQueuedSave() {
        state.pendingSaves -= 1;
      });
      saveTail = completed.catch(function keepQueueAlive() {});
      return completed;
    }

    function finishLoad(result, flags) {
      const loadSummary = {
        ...result.summary,
        fallback: Boolean(flags.fallback),
        recovered: Boolean(flags.recovered),
        source: flags.recovered ? 'scan' : (flags.fallback ? 'fallback' : 'head'),
      };
      state.lastLoad = loadSummary;
      emit('load:success', loadSummary);
      return result.json;
    }

    async function load() {
      const savesQueuedBeforeLoad = saveTail;
      emit('load:start');
      await savesQueuedBeforeLoad;
      const head = await readHead();
      if (head) {
        const active = await readBank(head.bank, head.generation);
        if (active.valid) return finishLoad(active, { fallback: false, recovered: false });

        const fallback = await readBank(otherBank(head.bank));
        if (fallback.valid && fallback.meta.generation < head.generation) {
          return finishLoad(fallback, { fallback: true, recovered: false });
        }
        if (fallback.valid) {
          state.banks[fallback.bank] = {
            ...fallback.summary,
            valid: false,
            status: 'uncommitted',
          };
        }

        state.lastLoad = { found: false, fallback: true, recovered: false };
        emit('load:empty', state.lastLoad);
        return null;
      }

      const bankA = await readBank('a');
      const bankB = await readBank('b');
      const recovered = newestValid([bankA, bankB]);
      if (recovered) return finishLoad(recovered, { fallback: false, recovered: true });

      state.lastLoad = { found: false, fallback: false, recovered: true };
      emit('load:empty', state.lastLoad);
      return null;
    }

    function getDebugState() {
      return JSON.parse(JSON.stringify({
        prefix,
        pendingSaves: state.pendingSaves,
        activeSave: state.activeSave,
        head: state.head,
        banks: state.banks,
        lastSave: state.lastSave,
        lastLoad: state.lastLoad,
        events: state.events,
      }));
    }

    return Object.freeze({ save, load, getDebugState });
  }

  return Object.freeze({
    createCloudSave,
    inspectPayload,
    crc32Hex,
    CHUNK_CHARS,
    MAX_CHUNKS,
  });
}));
