export type Grade = 0 | 1 | 2 | 3
export type Opportunity =
    | 'START' // 分配完成点数，点击开始新人生后
    | 'TRAJECTORY' // 每一年的人生经历中
    | 'SUMMARY' // 人生结束，点击人生总结后
    | 'END' // 游戏完成，点击重开 重开次数在这之后才会+1
export type Achievement = {
    /** 序号 */
    readonly id: number
    /** 成就名 */
    readonly name: string
    /** 成就文案 */
    readonly description: string
    /** 稀有度 */
    readonly grade: Grade
    /** 触发条件 */
    readonly condition: string
    /** 是否隐藏成就 */
    readonly hide: boolean
    /** 触发时机 */
    readonly opportunity: Opportunity
}
