import { useTransition, useCallback } from 'react'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
import { useConfig } from './config'
import { useProfile } from './profile'
import { end } from '@remake/core'
import type { GameState } from '@remake/core'
import type { Talent } from '@remake/data/talent'

export enum Step {
    Idle = 'idle',
    Mode = 'mode',
    Pick = 'pick',
    Alloc = 'alloc',
    Play = 'play',
    Summary = 'summary',
}

const stepAtom = atom<Step>(Step.Idle)
const gameStateAtom = atom<GameState | null>(null)

export const useStep = () => useAtomValue(stepAtom)
export const useSetStep = () => useSetAtom(stepAtom)

export const useRemake = () => {
    const config = useConfig()
    const [profile] = useProfile()
    const setStep = useSetAtom(stepAtom)
    return useCallback(() => {
        const step = profile.times < config.mode ? Step.Pick : Step.Mode
        setStep(step)
    }, [config, profile, setStep])
}

export const useEnd = () => {
    const [profile, setProfile] = useProfile()
    const [step, setStep] = useAtom(stepAtom)
    const [state, setState] = useAtom(gameStateAtom)
    const [pending, startTransition] = useTransition()
    const ender = useCallback(
        (talent?: Talent['id']) => {
            startTransition(async () => {
                if (!state || step === Step.Summary)
                    throw new Error(
                        'Game state is not available or already ended.',
                    )
                const { profile: next, achievements } = end(
                    state,
                    profile,
                    talent,
                )
                setStep(Step.Idle)
                setState(null)
                setProfile(next)
            })
        },
        [state, step, profile, setStep, setState, setProfile],
    )
    return [pending, ender] as const
}
