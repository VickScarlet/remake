const SDK = '//s1.hdslb.com/bfs/seed/toy/app/sdk/toy-sdk.js'
const CHUNK_SIZE = 1024
const PRELOAD_CHUNKS_LIMIT = 20

let inited = false

export async function loadSDK() {
    const script = document.createElement('script')
    script.src = SDK
    script.async = true
    document.body.appendChild(script)
    return new Promise((resolve, reject) => {
        script.onload = () => {
            resolve(window.toy)
        }
        script.onerror = () => {
            reject(new Error('Failed to load SDK'))
        }
    })
}

export async function init() {
    try {
        await loadSDK()
        inited = true
    } catch (error) {
        console.error('Failed to load Bili Toy SDK:', error)
        return
    }

    await Promise.all([
        checkAbility('getCloudStorage'),
        checkAbility('setCloudStorage'),
        checkAbility('removeCloudStorage'),
    ])
}

async function checkAbility(ability: toy.Ability) {
    if (!(await toy.isSupport(ability)))
        throw new Error(
            `Bili Toy SDK does not support ${ability}. Please check the SDK version.`,
        )
}

interface ChunkMeta {
    total: number
    size: number
}

function splitIntoChunks(
    str: string,
    chunkSize: number = CHUNK_SIZE,
): string[] {
    const base64Str = new TextEncoder().encode(str).toBase64()
    const chunks: string[] = []
    let offset = 0
    while (offset < base64Str.length) {
        chunks.push(base64Str.substring(offset, offset + chunkSize))
        offset += chunkSize
    }
    return chunks
}

function mergeChunks(chunks: string[]): string {
    const combinedBase64 = chunks.join('')
    return new TextDecoder().decode(Uint8Array.from(combinedBase64))
}

export async function getCloudStore<K extends string[]>(
    keys: [...K],
): Promise<Record<K[number], string | undefined>> {
    if (!inited)
        throw new Error('Bili Toy SDK not initialized. Call init() first.')
    if (!keys.length) return {} as any
    const firstBatchKeys: string[] = []
    keys.forEach(key => {
        firstBatchKeys.push(`${key}.meta`)
        for (let i = 0; i < PRELOAD_CHUNKS_LIMIT; i++) {
            firstBatchKeys.push(`${key}.chunk.${i}`)
        }
    })
    const rawKV = await toy.getCloudStorage(firstBatchKeys)
    const result = {} as Record<K[number], string | undefined>
    await Promise.all(
        keys.map(async key => {
            const metaStr = rawKV[`${key}.meta`]
            if (!metaStr) {
                result[key as K[number]] = undefined
                return
            }

            const meta: ChunkMeta = JSON.parse(metaStr)
            const collectedChunks: string[] = []
            for (let i = 0; i < meta.total; i++) {
                const chunkVal = rawKV[`${key}.chunk.${i}`]
                if (chunkVal !== undefined && chunkVal !== null) {
                    collectedChunks[i] = chunkVal
                }
            }
            if (meta.total > PRELOAD_CHUNKS_LIMIT) {
                const missingChunkKeys: string[] = []
                for (let i = PRELOAD_CHUNKS_LIMIT; i < meta.total; i++) {
                    missingChunkKeys.push(`${key}.chunk.${i}`)
                }
                const secondaryKV = await toy.getCloudStorage(missingChunkKeys)
                for (let i = PRELOAD_CHUNKS_LIMIT; i < meta.total; i++) {
                    collectedChunks[i] = secondaryKV[`${key}.chunk.${i}`]!
                }
            }
            if (collectedChunks.filter(Boolean).length !== meta.total) {
                console.warn(
                    `⚠️ [vTransform Storage] 检测到数据键 [${key}] 的云端切片发生残缺丢失，已自动放弃合并。`,
                )
                result[key as K[number]] = undefined
                return
            }
            result[key as K[number]] = mergeChunks(collectedChunks)
        }),
    )
    return result
}

export async function setCloudStore(
    items: Record<string, string>,
): Promise<void> {
    if (!inited)
        throw new Error('Bili Toy SDK not initialized. Call init() first.')
    const payloadKV: Record<string, string> = {}
    for (const key in items) {
        const originalValue = items[key]
        if (originalValue === null || originalValue === undefined) continue
        const chunkList = splitIntoChunks(originalValue, CHUNK_SIZE)
        const meta: ChunkMeta = {
            total: chunkList.length,
            size: originalValue.length,
        }
        payloadKV[`${key}.meta`] = JSON.stringify(meta)
        chunkList.forEach((chunkContent, index) => {
            payloadKV[`${key}.chunk.${index}`] = chunkContent
        })
    }
    return await toy.setCloudStorage(payloadKV)
}

export async function removeCloudStore(keys: string[]): Promise<void> {
    if (!inited)
        throw new Error('Bili Toy SDK not initialized. Call init() first.')
    if (!keys.length) return

    const metaKeys = keys.map(k => `${k}.meta`)
    const rawMetaKV = await toy.getCloudStorage(metaKeys)
    const deleteKeysList: string[] = []

    keys.forEach(key => {
        deleteKeysList.push(`${key}.meta`)
        const metaStr = rawMetaKV[`${key}.meta`]

        if (metaStr) {
            const meta: ChunkMeta = JSON.parse(metaStr)
            for (let i = 0; i < meta.total; i++) {
                deleteKeysList.push(`${key}.chunk.${i}`)
            }
        }
    })
    return await toy.removeCloudStorage(deleteKeysList)
}
