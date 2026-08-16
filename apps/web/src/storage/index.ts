import * as biliToy from '@remake/thirdparty-bili-toy'
import * as local from './local'

interface Storage {
    init(): Promise<void>
    get(key: string): Promise<string | null>
    set(key: string, value: string): Promise<boolean>
}
const storage = {} as Storage

if (import.meta.env.VITE_CHANNEL === 'bili') {
    storage.init = biliToy.init
    storage.get = biliToy.get
    storage.set = biliToy.set
} else {
    storage.init = async () => {}
    storage.get = local.get
    storage.set = local.set
}

export const init = storage.init
export const get = storage.get
export const set = storage.set
