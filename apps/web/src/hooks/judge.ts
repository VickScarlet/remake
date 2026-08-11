import { useMemo } from 'react'
import { useSummary, useGameState } from '@remake/hooks'
import type { Properties } from '@remake/hooks'
import { judge, judgeGrade } from '@/config'
import { keys } from '@remake/vitex'

export interface Judge {
    value: number
    level: number
    grade: number
}
export type JudgePropKeys = keyof Properties
export type JudgeKeys = 'summary' | JudgePropKeys
export type Judges = [JudgeKeys, Judge][]
export const useJudge = () => {
    const summary = useSummary()
    const state = useGameState()
    if (!state) throw new Error('Game state is not set')
    return useMemo(() => {
        const props = { ...state.props.highest, summary }
        const judges: Judges = []
        for (const key of keys(props)) {
            const value = props[key]
            const level = judge(key, value)
            const grade = judgeGrade(key, level)
            judges.push([key, { value, level, grade }])
        }
        return judges
    }, [state.props.highest, summary])
}
