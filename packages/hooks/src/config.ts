import { useCallback } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import type { PullOptions } from '@remake/core'

export interface Config {
    pick: number
    pull: PullOptions
    points: number
    allocate: number
    mode: number
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
