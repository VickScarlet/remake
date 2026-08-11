if (localStorage.getItem('version') !== '3.0.0') {
    const times = parseInt(localStorage.getItem('times') || '0')
    if (times) {
        const achievements = (
            JSON.parse(localStorage.getItem('ACHV') || '[]') as [
                number,
                number,
            ][]
        )
            .sort((a, b) => a[1] - b[1])
            .map(([id]) => id)
        const events = JSON.parse(localStorage.getItem('AEVT') || '[]')
        const talents = JSON.parse(localStorage.getItem('ATLT') || '[]')
        const profile = { times, achievements, events, talents } as any
        const lockedTalents = JSON.parse(
            localStorage.getItem('extendTalent') || 'null',
        )
        if (lockedTalents) profile.lockedTalent = lockedTalents
        const unique = JSON.parse(
            localStorage.getItem('uniqueWaTaShi') || 'null',
        )
        if (unique) profile.unique = unique
        localStorage.setItem('profile', JSON.stringify(profile))
        localStorage.removeItem('times')
        localStorage.removeItem('ACHV')
        localStorage.removeItem('AEVT')
        localStorage.removeItem('ATLT')
        localStorage.removeItem('extendTalent')
        localStorage.removeItem('uniqueWaTaShi')
    }
    localStorage.setItem('version', '3.0.0')
}
export async function get<Key extends string>(keys: Key[]) {
    return Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])) as {
        [K in Key]: string | null
    }
}

export async function set<Key extends string>(data: Record<Key, string>) {
    for (const key in data) {
        localStorage.setItem(key, data[key])
    }
    return true
}
