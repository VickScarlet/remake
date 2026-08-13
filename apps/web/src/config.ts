import type { Config } from '@remake/hooks'
export const dev = {} as Record<string, any>
if (import.meta.env.MODE === 'development') {
    new URLSearchParams(window.location.search)
        .entries()
        .forEach(([key, value]) => {
            if (key !== 'locked') return (dev[key] = Number(value))
            dev[key] = value.split(',').map(v => Number(v))
        })
}

// 自动模式自动点击间隔
export const AutoInterval = dev.interval ?? 500
// 可锁定的天赋数量
export const LockLimit = dev.lock ?? 1
// 名人模式重开次数限制
export const ModeLimit = dev.mode ?? 10
// 天赋选择数量限制
export const PickMax = dev.max ?? 3
// 天赋选择最少数量限制
export const PickMin = dev.min ?? 3
// 基础属性点
export const BasePoints = dev.points ?? 20
// 单项属性点最大限制
export const AllocLimit = dev.allocate ?? 10
// 默认初始快乐
export const DefaultSpirit = dev.spirit ?? 5
// 天赋抽取个数
export const PullCount = dev.pull ?? 10
// 名人模式抽取个数
export const CharacterPullCount = dev.chara ?? 3
// 名人模式抽取权重切线
export const CharacterWeightKnife = dev.knife ?? 10

// 天赋抽取基础概率
export const PullRateBase: Config['pull']['rate']['base'] = new Map([
    [0, 889],
    [1, 100],
    [2, 10],
    [3, 1],
])
// 属性评级线
export const JudgeLineMap = {
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
// 可评级属性
export type Judges = keyof typeof JudgeLineMap
// 获取属性评级
export function judge(key: Judges, value: number) {
    const arr = JudgeLineMap[key]
    for (let i = arr.length - 1; i >= 0; i--) {
        if (value >= arr[i]!) return i
    }
    return 0
}
// 属性稀有度等级线
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
// 获取属性稀有度
export function judgeGrade(key: Judges, level: number) {
    const arr = JudgeGradeMap[key]
    for (let i = arr.length - 1; i >= 0; i--) {
        if (level >= arr[i]!) return i
    }
    return 0
}
// 根据属性值获取属性稀有度
export function judgeGradeByValue(key: Judges, value: number) {
    const level = judge(key, value)
    return judgeGrade(key, level)
}

// 天赋抽取概率加成
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
    lock: LockLimit,
    mode: ModeLimit,
    max: PickMax,
    min: PickMin,
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
    chara: {
        count: CharacterPullCount,
        knife: CharacterWeightKnife,
    },
}

export default config
