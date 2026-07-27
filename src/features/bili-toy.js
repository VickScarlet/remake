async function loadSDK(sdk) {
    const script = document.createElement('script')
    script.src = sdk
    script.async = true
    document.body.appendChild(script)
    return new Promise((resolve, reject) => {
        script.onload = () => {
            resolve()
        }
        script.onerror = () => {
            reject(new Error('Failed to load SDK'))
        }
    })
}

export default async function init(options) {
    try {
        await loadSDK(options.sdk)
    } catch (error) {
        console.error('Failed to load Bili Toy SDK:', error)
        return
    }
    if (!(await toy.isSupport('getCloudStorage'))) return
    if (!(await toy.isSupport('setCloudStorage'))) return
    if (!(await toy.isSupport('removeCloudStorage'))) return
    syncUnique()
    syncProps()
}

async function syncUnique() {
    if (core.sync('unique')) return
    const data = await toy.getCloudStorage(['unique'])
    if (data?.unique) {
        core.sync('unique', data?.unique)
    } else {
        $$on('syncUnique', unique => toy.setCloudStorage({ unique }))
    }
}

async function syncProps() {
    const sync = async () => {
        const changed = core.sync('props')
        if (!changed) return
        const cloudData = await toy.getCloudStorage(['props'])
        const props = core.sync('props', cloudData?.props ?? '{}')
        await toy.setCloudStorage({ props })
    }
    await sync()
    setInterval(sync, 10000)
}
