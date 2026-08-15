import { useCallback } from 'react'
import { events, talents, achievements } from '@remake/data'
import { useProfile, useSetStep, Step } from '.'

const TotalEvents = events.size
const TotalTalents = talents.size

export const useAchv = () => {
    const [profile] = useProfile()
    const o = new Map(Array.from(profile.achievements, (id, i) => [id, i]))
    const sorted = Array.from(achievements.keys())
        .sort((a, b) => {
            if (o.has(a) && o.has(b)) return o.get(b)! - o.get(a)!
            if (o.has(a)) return -1
            if (o.has(b)) return 1
            const { hide: ha, grade: ga } = achievements.get(a)!
            const { hide: hb, grade: gb } = achievements.get(b)!
            if (ha == hb) return gb - ga
            return ha ? 1 : -1
        })
        .map(id => ({ id, colled: o.has(id) }))
    const stats = {
        times: profile.times,
        achv: profile.achievements.size,
        event: (profile.events.size / TotalEvents) * 100,
        talent: (profile.talents.size / TotalTalents) * 100,
    }
    return [stats, sorted] as const
}

export const useGoAchv = () => {
    const setStep = useSetStep()
    return useCallback(() => setStep(Step.Achv), [setStep])
}
