import { useCallback } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import type { PullOptions, PullCharaOpt, UniqueGenCfg } from '@remake/core'
export interface Config {
    /** 游戏锁定天赋数量 */
    lock: number
    /** 游戏可选天赋数量 */
    max: number
    /** 游戏最少选择天赋数量 */
    min: number
    /** 初始属性点 */
    points: number
    /** 单项属性点最大限制 */
    allocate: number
    /** 初始快乐 */
    spirit: number
    /** 模式选择限制 */
    mode: number
    /** 天赋抽取个数 */
    pull: PullOptions
    /** 名人模式配置 */
    chara: PullCharaOpt
    /** 唯一角色限制 */
    unique: {
        limit: number
        config: UniqueGenCfg
    }
}

export const configAtom = atom<Config | null>(null)

export const useConfigInject = () => {
    const setConfig = useSetAtom(configAtom)
    return useCallback((config: Config) => setConfig(config), [setConfig])
}

export const useConfig = () => {
    const config = useAtomValue(configAtom)
    if (!config) throw new Error('Game config is not set')
    return config
}
