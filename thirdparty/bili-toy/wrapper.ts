const PREFIX = 'bili-toy-remake'
const storage = {
    get: async (keys: string[]) => {
        const result = await toy.getCloudStorage(keys)
        if (result && result.data && typeof result.data === 'object') {
            return result.data
        }
        return result || {}
    },
    set: async (record: Record<string, string>) => {
        await toy.setCloudStorage(record)
    },
}
const cloudMap = new Map<string, ToyCloudSaveCoreSDK.IToyCloudSaveInstance>()
export async function init() {
    try {
        /* @ts-ignore @vite-ignore */
        await import('//s1.hdslb.com/bfs/seed/toy/app/sdk/toy-sdk.js')
        /* @ts-ignore */
        const coreModule = await import('./lib/cloud-save-core.js')
        window.ToyCloudSaveCore =
            coreModule.ToyCloudSaveCore || coreModule.default || coreModule
    } catch (error) {
        throw new Error('Failed to load Bili Toy SDK', { cause: error })
    }
}

function getCloudInstance(key: string) {
    if (!cloudMap.has(key)) {
        const cloud = ToyCloudSaveCore.createCloudSave({ storage, prefix: key })
        cloudMap.set(key, cloud)
    }
    return cloudMap.get(key) || null
}

export async function get(key: string): Promise<string | null> {
    const localKey = `${PREFIX}-${key}`
    const localData = localStorage.getItem(localKey)

    const cloud = getCloudInstance(key)
    if (!cloud) return localData
    try {
        const cloudData = await cloud.load()

        if (cloudData !== null) {
            localStorage.setItem(localKey, cloudData)
            return cloudData
        }
    } catch (error) {
        console.error(
            `[Bili Storage] 业务 Key '${key}' 云端拉取失败，降级使用本地档:`,
            error,
        )
    }
    return localData
}

export async function set(key: string, value: string): Promise<boolean> {
    const localKey = `${PREFIX}-${key}`

    try {
        localStorage.setItem(localKey, value)
    } catch (localError) {
        console.error(
            `[Bili Storage] 本地 LocalStorage 写入崩溃（可能满 5MB 额度）:`,
            localError,
        )
    }

    const cloud = getCloudInstance(key)
    if (!cloud) return true

    try {
        await cloud.save(value)
    } catch (cloudError) {
        console.error(
            `[Bili Storage] 业务 Key '${key}' 本地已保存，但同步至 B 站云端失败:`,
            cloudError,
        )
    }
    return true
}
