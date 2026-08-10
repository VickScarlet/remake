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
