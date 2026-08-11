import { useCallback, useRef, useState } from 'react'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
import { useConfig } from './config'
import { useProfile } from './profile'
import { useReplaced, useTalentReset } from './talent'
import { useAlloc, useAllocReset } from './alloc'
import { start, next, summary, end } from '@remake/core'
import type { GameState, Properties, NextResult } from '@remake/core'
import type { Talent } from '@remake/data/talent'

export enum Step {
    Idle = 'idle',
    Mode = 'mode',
    Pick = 'pick',
    Alloc = 'alloc',
    Play = 'play',
    Summary = 'summary',
}

export type Log = Omit<NextResult, 'state'> & {
    props: Omit<Properties, 'age'>
}

const stepAtom = atom<Step>(Step.Idle)
const gameStateAtom = atom<GameState | null>(null)
const logsAtom = atom<Log[]>([])
const summaryAtom = atom(0)

export const useStateReset = () => {
    const setGameState = useSetAtom(gameStateAtom)
    return useCallback(() => setGameState(null), [setGameState])
}
export const useLogsReset = () => {
    const setLogs = useSetAtom(logsAtom)
    return useCallback(() => setLogs([]), [setLogs])
}
export const useGameReset = () => {
    const resetTalent = useTalentReset()
    const resetAlloc = useAllocReset()
    const resetState = useStateReset()
    const resetLogs = useLogsReset()
    return useCallback(() => {
        resetTalent()
        resetAlloc()
        resetState()
        resetLogs()
    }, [resetTalent, resetAlloc, resetState, resetLogs])
}

export const useStep = () => useAtomValue(stepAtom)
export const useSetStep = () => useSetAtom(stepAtom)
export const useGameState = () => useAtomValue(gameStateAtom)
export const useSummary = () => useAtomValue(summaryAtom)
export const useLogs = () => useAtomValue(logsAtom)

export const useRemake = () => {
    const { mode } = useConfig()
    const [{ times }] = useProfile()
    const setStep = useSetAtom(stepAtom)
    const reset = useGameReset()
    return useCallback(() => {
        reset()
        setStep(times < mode ? Step.Pick : Step.Mode)
    }, [mode, times, setStep, reset])
}

export const useStart = () => {
    const { spirit } = useConfig()
    const [profile] = useProfile()
    const setStep = useSetAtom(stepAtom)
    const setState = useSetAtom(gameStateAtom)
    const allocate = useAlloc()
    const { talents: tr } = useReplaced()
    return useCallback(() => {
        const alloc = { ...allocate, spirit }
        const result = start(profile, alloc, tr.talents)
        setState(result.state)
        setStep(Step.Play)
        return result.achievements
    }, [profile, allocate, spirit, tr, setStep, setState])
}

export const useNext = () => {
    const [profile] = useProfile()
    const [state, setState] = useAtom(gameStateAtom)
    const [logs, setLogs] = useAtom(logsAtom)
    const endRef = useRef(false)
    const [ended, setEnded] = useState(false)
    if (!state) throw new Error('Game state is not available.')
    const nexter = useCallback(() => {
        if (!state) throw new Error('Game state is not available.')
        if (endRef.current) throw new Error('Game state is already ended.')
        const { state: s, ...result } = next(state, profile)
        setState(s)
        const { age, ...props } = s.props.current
        const log = { ...result, props }
        setLogs(prev => [...prev, log])
        if (s.life <= 0) {
            endRef.current = true
            setEnded(true)
        }
        return result.achievements
    }, [state, profile, setState])
    return [{ state, logs, ended }, nexter] as const
}

export const useGotoSummary = () => {
    const [profile] = useProfile()
    const [state, setState] = useAtom(gameStateAtom)
    const setStep = useSetAtom(stepAtom)
    const setSummary = useSetAtom(summaryAtom)
    return useCallback(() => {
        if (!state) throw new Error('Game state is not available.')
        const result = summary(state, profile)
        setSummary(result.summary)
        setState(result.state)
        setStep(Step.Summary)
        return result.achievements
    }, [state, profile, setStep, setState, setSummary])
}

export const useEnd = () => {
    const [profile, setProfile] = useProfile()
    const [step, setStep] = useAtom(stepAtom)
    const state = useAtomValue(gameStateAtom)
    const reset = useGameReset()
    return useCallback(
        (talent?: Talent['id']) => {
            if (!state)
                throw new Error('Game state is not available or already ended.')
            const result = end(state, profile, talent)
            setStep(Step.Idle)
            setProfile(result.profile)
            reset()
            return result.achievements
        },
        [state, step, profile, setStep, setProfile, reset],
    )
}
