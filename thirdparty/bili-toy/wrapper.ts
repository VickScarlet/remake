const storage = {
    get: async (keys: string[]) => {
        var result = await toy.getCloudStorage(keys)
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
        console.error('Failed to load Bili Toy SDK:', error)
    }
}

export async function get(key: string) {
    if (!cloudMap.has(key)) {
        const cloud = ToyCloudSaveCore.createCloudSave({ storage, prefix: key })
        cloudMap.set(key, cloud)
    }
    return await cloudMap.get(key)!.load()
}

export async function set(key: string, value: string) {
    if (!cloudMap.has(key)) {
        const cloud = ToyCloudSaveCore.createCloudSave({ storage, prefix: key })
        cloudMap.set(key, cloud)
    }
    await cloudMap.get(key)!.save(value)
    return true
}
