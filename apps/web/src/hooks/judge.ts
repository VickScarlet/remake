import { useMemo } from 'react'
import { useSummary, useGameState } from '@remake/hooks'
import { judge, judgeGrade } from '@/config'
import type { Judges } from '@/config'
import { keys } from '@remake/vitex'

export interface Judge {
    value: number
    level: number
    grade: number
}
function judges<T extends Judges, K extends keyof Record<T, number> = never>(
    props: Record<T, number>,
    filter?: K[],
) {
    const judges: [Exclude<T, K>, Judge][] = []
    for (const key of keys(props, filter)) {
        const value = props[key]
        const level = judge(key, value)
        const grade = judgeGrade(key, level)
        judges.push([key, { value, level, grade }])
    }
    return judges
}

export const useJudge = () => {
    const state = useGameState()
    if (!state) throw new Error('Game state is not set')
    const current = state.props.current
    return useMemo(() => {
        const result = judges(current, ['age'])
        return result
    }, [current])
}

export const useEndJudge = () => {
    const summary = useSummary()
    const state = useGameState()
    if (!state) throw new Error('Game state is not set')
    const highest = state.props.highest
    return useMemo(() => {
        const props = { ...highest, summary }
        const result = judges(props)
        return result
    }, [highest, summary])
}
