import { useCallback, useRef, useState } from 'react'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
import { useConfig, useProfile, useReplaced, useAlloc } from '.'
import { useTalentReset, useAllocReset } from '.'
import { start, next, summary, end } from '@remake/core'
import type { GameState, Properties, NextResult } from '@remake/core'
import type { Talent } from '@remake/data'

export enum Step {
    Idle = 'idle',
    Mode = 'mode',
    Chara = 'chara',
    Pick = 'pick',
    Alloc = 'alloc',
    Play = 'play',
    Summary = 'summary',
}

export enum Mode {
    Classic = 'classic',
    Celebrity = 'celebrity',
}

export type Log = Omit<NextResult, 'state'> & {
    props: Omit<Properties, 'age'>
}

export const modeAtom = atom<Mode>(Mode.Classic)
export const stepAtom = atom<Step>(Step.Idle)
export const gameStateAtom = atom<GameState | null>(null)
export const logsAtom = atom<Log[]>([])
export const summaryAtom = atom(0)

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
export const useSetGameState = () => useSetAtom(gameStateAtom)
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

export const useModeChoose = () => {
    const setMode = useSetAtom(modeAtom)
    const setStep = useSetAtom(stepAtom)
    const choose = useCallback(
        (mode: Mode) => {
            setMode(mode)
            /* prettier-ignore */
            switch (mode) {
                case Mode.Classic: return setStep(Step.Pick)
                case Mode.Celebrity: return setStep(Step.Chara)
            }
        },
        [setStep],
    )
    return [Mode, choose] as const
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
    }, [state, profile, setState, setLogs])
    return [{ logs, ended }, nexter] as const
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
    const { lock } = useConfig()
    const [profile, setProfile] = useProfile()
    const setStep = useSetAtom(stepAtom)
    const state = useAtomValue(gameStateAtom)
    const reset = useGameReset()
    const [locked, setLocked] = useState<Set<Talent['id']>>(new Set())
    const picker = useCallback(
        (talent: Talent['id']) => {
            setLocked(prev => {
                if (prev.has(talent)) {
                    const next = new Set(prev)
                    next.delete(talent)
                    return next
                }
                if (lock == 1) return new Set([talent])
                const next = new Set(prev)
                if (next.size >= lock) return prev
                next.add(talent)
                return next
            })
        },
        [lock, setLocked],
    )
    const ender = useCallback(() => {
        if (!state)
            throw new Error('Game state is not available or already ended.')
        const l = locked.size > 0 ? Array.from(locked) : undefined
        const result = end(state, profile, l)
        setStep(Step.Idle)
        setProfile(result.profile)
        reset()
        return result.achievements
    }, [state, profile, locked, setStep, setProfile, reset])
    return [locked, picker, ender] as const
}
