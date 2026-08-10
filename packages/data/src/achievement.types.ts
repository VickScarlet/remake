/** 成就稀有度 */
export enum AchievementGrade {
    White = 0,
    Blue = 1,
    Purple = 2,
    Orange = 3,
}

/** 成就触发时机 */
export enum AchievementOpportunity {
    Start = 'START', // 分配完成点数，点击开始新人生后
    Trajectory = 'TRAJECTORY', // 每一年的人生经历中
    Summary = 'SUMMARY', // 人生结束，点击人生总结后
    End = 'END', // 游戏完成，点击重开 重开次数在这之后才会+1
}

/** 成就 */
export type Achievement = {
    /** 序号 */
    readonly id: number
    /** 成就名 */
    readonly name: string
    /** 成就文案 */
    readonly description: string
    /** 稀有度 */
    readonly grade: AchievementGrade
    /** 触发条件 */
    readonly condition: string
    /** 是否隐藏成就 */
    readonly hide: boolean
    /** 触发时机 */
    readonly opportunity: AchievementOpportunity
}
// @vt-types-end

export const transformers = {
    id: Number,
    grade: (val: any) => Number(val) || 0,
}
