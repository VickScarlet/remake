import { useState, useCallback } from 'react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useConfig } from './config'
import { useProfile } from './profile'
import { useSetStep, Step } from './play'
import { pull, exclude, talentsPicked } from '@remake/core'
import type { TalentsPickedResult, RNG } from '@remake/core'
import type { Talent } from '@remake/data/talent'

const pickedAtom = atom(new Set<Talent['id']>())
const replacedAtom = atom<TalentsPickedResult | null>(null)

export const useTalentReset = () => {
    const setPicked = useSetAtom(pickedAtom)
    const setReplaced = useSetAtom(replacedAtom)
    return useCallback(() => {
        setPicked(new Set())
        setReplaced(null)
    }, [setPicked, setReplaced])
}

export const usePicked = () => {
    const picked = useAtomValue(pickedAtom)
    if (!picked) throw new Error('No talents picked')
    return picked
}
export const useReplaced = () => {
    const replaced = useAtomValue(replacedAtom)
    if (!replaced) throw new Error('No talents replaced')
    return replaced
}

export const useTalentPuller = () => {
    const { pull: p } = useConfig()
    const [profile] = useProfile()
    const [pulled, setPulled] = useState<Talent['id'][] | null>(null)
    const puller = useCallback(
        (rng?: RNG) => setPulled(pull(p, profile, rng)),
        [p, profile, setPulled],
    )
    return [pulled, puller] as const
}

export type TalentPickerResult =
    | {
          type: 'ok'
          talent?: never
      }
    | {
          type: 'not-enough'
          talent?: never
      }
    | {
          type: 'exclude'
          talent: Talent['id']
      }

export const useTalentPicker = () => {
    const { max } = useConfig()
    const [picked, setPicked] = useAtom(pickedAtom)
    const picker = useCallback(
        (talent: Talent['id']): TalentPickerResult => {
            if (!picked) {
                setPicked(new Set([talent]))
                return { type: 'ok' }
            }
            if (picked.has(talent)) {
                const next = new Set(picked)
                next.delete(talent)
                setPicked(next)
                return { type: 'ok' }
            }
            if (picked.size >= max) return { type: 'not-enough' }
            const e = exclude(talent, picked)
            if (e) return { type: 'exclude', talent: e }
            const next = new Set([...picked, talent])
            setPicked(next)
            return { type: 'ok' }
        },
        [max, picked, setPicked],
    )
    return [picked, picker] as const
}

export const useSubmitIsEnable = () => {
    const { max, min } = useConfig()
    const picked = useAtomValue(pickedAtom)
    const enabled = picked.size >= min && picked.size <= max
    return { min, max, enabled } as const
}

export const useTalentSubmit = () => {
    const picked = useAtomValue(pickedAtom)
    const setReplaced = useSetAtom(replacedAtom)
    const { enabled } = useSubmitIsEnable()
    const next = useSetStep()
    return useCallback(
        (rng?: RNG) => {
            if (!enabled) throw new Error('Not enough talents picked')
            setReplaced(talentsPicked(picked, rng))
            next(Step.Alloc)
        },
        [enabled, picked, setReplaced, next],
    )
}
