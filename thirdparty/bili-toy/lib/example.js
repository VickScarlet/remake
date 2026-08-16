(function () {
  'use strict';

  var PREFIX = 'your_game_save_v1';
  var LOCAL_KEY = PREFIX + '_local';

  function ToyStorageAdapter(toySdk) {
    if (
      !toySdk ||
      typeof toySdk.getCloudStorage !== 'function' ||
      typeof toySdk.setCloudStorage !== 'function'
    ) {
      throw new Error('Toy 云存储 SDK 不可用');
    }
    this.toy = toySdk;
  }

  ToyStorageAdapter.prototype.get = async function (keys) {
    var result = await this.toy.getCloudStorage(keys);
    if (result && result.data && typeof result.data === 'object') {
      return result.data;
    }
    return result || {};
  };

  ToyStorageAdapter.prototype.set = async function (record) {
    await this.toy.setCloudStorage(record);
  };

  function createExampleState() {
    return {
      schemaVersion: 1,
      updatedAt: Date.now(),
      progress: { stage: 1, score: 120 },
      settings: { music: true, language: 'zh-CN' },
    };
  }

  function summarizeError(error) {
    var message = error && error.message ? error.message : String(error || '未知错误');
    return message.slice(0, 160);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var editor = document.getElementById('save-json');
    var status = document.getElementById('status');
    var saveButton = document.getElementById('save');
    var loadButton = document.getElementById('load');
    var exampleButton = document.getElementById('make-example');
    var cloudSave = null;

    function setStatus(message) {
      status.textContent = message;
    }

    function applyLoadedState(json) {
      // 替换点：把 JSON 交给项目原有的存档应用逻辑。
      JSON.parse(json);
      editor.value = json;
    }

    function loadLocalFirst() {
      var localJson = localStorage.getItem(LOCAL_KEY);
      if (!localJson) {
        editor.value = JSON.stringify(createExampleState(), null, 2);
        return false;
      }
      try {
        applyLoadedState(localJson);
        return true;
      } catch (error) {
        localStorage.removeItem(LOCAL_KEY);
        editor.value = JSON.stringify(createExampleState(), null, 2);
        return false;
      }
    }

    function parseEditor() {
      var value = editor.value.trim();
      JSON.parse(value);
      return value;
    }

    function setBusy(isBusy) {
      saveButton.disabled = isBusy;
      loadButton.disabled = isBusy;
    }

    var hadLocalSave = loadLocalFirst();

    try {
      if (!window.ToyCloudSaveCore) {
        throw new Error('cloud-save-core.js 未加载');
      }
      var storage = new ToyStorageAdapter(window.toy || window.Toy);
      cloudSave = window.ToyCloudSaveCore.createCloudSave({
        storage: storage,
        prefix: 'your_game_save_v1',
        onEvent: function (event) {
          // 只记录阶段摘要，禁止在这里打印完整 JSON。
          if (event && event.phase) {
            status.dataset.phase = event.phase;
          }
        },
      });
      setStatus(hadLocalSave ? '已加载本地档；可读取云端进行校验。' : '云存档已就绪。');
    } catch (error) {
      setStatus('当前仅使用本地存档：' + summarizeError(error));
    }

    exampleButton.addEventListener('click', function () {
      editor.value = JSON.stringify(createExampleState(), null, 2);
      setStatus('已生成小型示例，尚未保存。');
    });

    saveButton.addEventListener('click', async function () {
      var json;
      try {
        json = parseEditor();
      } catch (error) {
        setStatus('JSON 无效，请修正后再保存：' + summarizeError(error));
        return;
      }

      localStorage.setItem(LOCAL_KEY, json);
      if (!cloudSave) {
        setStatus('本地保存成功；当前环境无法写入 Toy 云端。');
        return;
      }

      setBusy(true);
      setStatus('本地保存成功，正在提交云端…');
      try {
        var result = await cloudSave.save(json);
        setStatus('云保存成功：Bank ' + result.bank.toUpperCase() + '，' + result.chunks + ' 片。');
      } catch (error) {
        setStatus('本地已保存，但云保存失败：' + summarizeError(error));
      } finally {
        setBusy(false);
      }
    });

    loadButton.addEventListener('click', async function () {
      var localFound = loadLocalFirst();
      if (!cloudSave) {
        setStatus(localFound ? '已读取本地档；当前环境无法读取 Toy 云端。' : '本地和云端均无可用存档。');
        return;
      }

      setBusy(true);
      setStatus(localFound ? '已应用本地档，正在校验云端…' : '正在读取云端…');
      try {
        var cloudJson = await cloudSave.load();
        if (cloudJson === null) {
          setStatus(localFound ? '云端为空，继续使用本地档。' : '云端和本地均为空。');
        } else {
          applyLoadedState(cloudJson);
          localStorage.setItem(LOCAL_KEY, cloudJson);
          setStatus('云档校验通过并已同步到本地。');
        }
      } catch (error) {
        setStatus((localFound ? '继续使用本地档；' : '') + '云读取失败：' + summarizeError(error));
      } finally {
        setBusy(false);
      }
    });
  });
})();
