import { useCallback, useTransition } from 'react'
import { atom, useAtom } from 'jotai'
import { useConfigInject, useProfile, useProfileInject } from '@remake/hooks'
import { get, set } from '@/storage'
import { config } from '@/config'

const initedAtom = atom(false)

export const useInit = () => {
    const configInject = useConfigInject()
    const profileInject = useProfileInject()
    const [inited, setInited] = useAtom(initedAtom)
    const [_, startTransition] = useTransition()
    const loader = useCallback(() => {
        configInject(config)
        startTransition(async () => {
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
        })
    }, [])
    return [inited, loader] as const
}

export const useSaver = () => {
    const [profile] = useProfile()
    const saver = useCallback(() => {
        const str = JSON.stringify({
            times: profile.times,
            achievements: Array.from(profile.achievements),
            events: Array.from(profile.events),
            talents: Array.from(profile.talents),
        })
        set({ profile: str })
    }, [profile])
    return saver
}
