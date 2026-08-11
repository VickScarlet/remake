import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import { useConfigInject, useRawProfile, useProfileInject } from '@remake/hooks'
import { get, set } from '@/storage'
import { config } from '@/config'

const initedAtom = atom(false)

export const useInit = () => {
    const configInject = useConfigInject()
    const profileInject = useProfileInject()
    const [inited, setInited] = useAtom(initedAtom)
    const loader = useCallback(async () => {
        if (inited) return
        configInject(config)
        const { profile } = await get(['profile'])
        const parsed = profile ? JSON.parse(profile) || {} : {}
        profileInject({
            ...parsed,
            times: parsed.times || 0,
            achievements: new Set(parsed.achievements || []),
            events: new Set(parsed.events || []),
            talents: new Set(parsed.talents || []),
        })
        setInited(true)
    }, [inited, configInject, profileInject, setInited])
    return [inited, loader] as const
}

export const useSaver = () => {
    const [profile] = useRawProfile()
    const [inited] = useAtom(initedAtom)
    return useCallback(async () => {
        if (!inited || !profile) return
        const str = JSON.stringify({
            ...profile,
            times: profile.times,
            achievements: Array.from(profile.achievements),
            events: Array.from(profile.events),
            talents: Array.from(profile.talents),
        })
        return await set({ profile: str })
    }, [inited, profile])
}
