import type { Config } from '@remake/hooks'

export const AutoInterval = 500
export const ModeLimit = 10
export const PickLimit = 3
export const BasePoints = 20
export const AllocLimit = 10
export const DefaultSpirit = 5
export const PullCount = 10
export const PullRateBase: Config['pull']['rate']['base'] = new Map([
    [0, 889],
    [1, 100],
    [2, 10],
    [3, 1],
])

export const JudgeMap = {
    age: [0, 1, 10, 18, 40, 60, 70, 80, 90, 95, 100, 500],
    summary: [0, 41, 50, 60, 80, 100, 110, 120],
    times: [0, 10, 30, 50, 70, 100],
    achievements: [0, 10, 30, 50, 70, 100],
    charm: [0, 1, 2, 4, 7, 9, 11],
    money: [0, 1, 2, 4, 7, 9, 11],
    spirit: [0, 1, 2, 4, 7, 9, 11],
    intelligence: [0, 1, 2, 4, 7, 9, 11, 21, 131, 501],
    strength: [0, 1, 2, 4, 7, 9, 11, 21, 101, 401, 1001, 2001],
    talent: [0, 0.3, 0.6, 0.9],
    event: [0, 0.2, 0.4, 0.6],
}
export type Judges = keyof typeof JudgeMap
export function judge(key: Judges, value: number) {
    const arr = JudgeMap[key]
    for (let i = arr.length - 1; i >= 0; i--) {
        if (value >= arr[i]!) return i
    }
    return 0
}

export const JudgeGradeMap = {
    age: [0, 5, 7, 9],
    summary: [0, 4, 5, 6],
    times: [0, 1, 3, 5],
    achievements: [0, 1, 3, 5],
    charm: [0, 4, 5, 6],
    money: [0, 4, 5, 6],
    spirit: [0, 4, 5, 6],
    intelligence: [0, 4, 5, 6],
    strength: [0, 4, 5, 6],
    talent: [0, 1, 2, 3],
    event: [0, 1, 2, 3],
}
export function judgeGrade(key: Judges, level: number) {
    const arr = JudgeGradeMap[key]
    for (let i = arr.length - 1; i >= 0; i--) {
        if (level >= arr[i]!) return i
    }
    return 0
}

export const PullRateAdditions: Config['pull']['rate']['additions'] = {
    times: value => {
        const level = judge('times', value)
        return new Map([[2, { mode: 'multiply', value: level + 1 } as const]])
    },
    achievements: value => {
        const level = judge('achievements', value.size)
        return new Map([[3, { mode: 'multiply', value: level + 1 } as const]])
    },
}

export const config: Config = {
    mode: ModeLimit,
    pick: PickLimit,
    points: BasePoints,
    allocate: AllocLimit,
    spirit: DefaultSpirit,
    pull: {
        count: PullCount,
        rate: {
            base: PullRateBase,
            additions: PullRateAdditions,
        },
    },
}

export default config
