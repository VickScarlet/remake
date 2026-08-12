import { useCallback } from 'react'
import { atom, useAtom, useSetAtom } from 'jotai'
import type { ProfileState } from '@remake/core'

export const profileAtom = atom<ProfileState | null>(null)

export const useRawProfile = () => useAtom(profileAtom)

export const useProfile = () => {
    const [profile, setProfile] = useAtom(profileAtom)
    if (!profile) throw new Error('Profile is not loaded')
    return [profile, setProfile] as const
}

export const useProfileInject = () => {
    const setProfile = useSetAtom(profileAtom)
    return useCallback(
        (profile: ProfileState) => setProfile(profile),
        [setProfile],
    )
}
