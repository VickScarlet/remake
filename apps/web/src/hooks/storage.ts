import { useEffect, useCallback, useTransition } from 'react'
import { atom, useAtom } from 'jotai'
import { useConfigInject, useProfileInject, useRawProfile } from '@remake/hooks'
import { useUniqueInject, useUnique } from '@remake/hooks'
import { get, set } from '@/storage'
import { config } from '@/config'

const initedAtom = atom(false)

export const useInit = () => {
    const configInject = useConfigInject()
    const profileInject = useProfileInject()
    const uniqueInject = useUniqueInject()
    const [inited, setInited] = useAtom(initedAtom)
    const loader = useCallback(async () => {
        if (inited) return
        configInject(config)
        const { profile, unique } = await get(['profile', 'unique'])
        const parsed = profile ? JSON.parse(profile) || {} : {}
        profileInject({
            ...parsed,
            times: parsed.times || 0,
            achievements: new Set(parsed.achievements || []),
            events: new Set(parsed.events || []),
            talents: new Set(parsed.talents || []),
        })
        if (unique) uniqueInject(JSON.parse(unique))
        setInited(true)
    }, [inited, configInject, profileInject, uniqueInject, setInited])
    return [inited, loader] as const
}

export const useWatcher = () => {
    const [profile] = useRawProfile()
    const unique = useUnique()
    const [inited] = useAtom(initedAtom)
    const [p, saveProfile] = useTransition()
    const [u, saveUnique] = useTransition()
    useEffect(() => {
        if (!inited || !profile) return
        const str = JSON.stringify({
            ...profile,
            times: profile.times,
            achievements: Array.from(profile.achievements),
            events: Array.from(profile.events),
            talents: Array.from(profile.talents),
        })
        saveProfile(async () => {
            await set({ profile: str })
        })
    }, [inited, profile, saveProfile])
    useEffect(() => {
        if (!inited || !unique) return
        const str = JSON.stringify(unique)
        saveUnique(async () => {
            await set({ unique: str })
        })
    }, [inited, unique, saveUnique])

    return p || u
}
