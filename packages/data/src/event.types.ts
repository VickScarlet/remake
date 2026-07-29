/** 事件稀有度 */
export type EventGrade = 0 | 1 | 2 | 3

/** 事件效果 */
export type EventEffect = {
    /** 颜值变化 */
    readonly CHR?: number
    /** 智力变化 */
    readonly INT?: number
    /** 体质变化 */
    readonly STR?: number
    /** 家境变化 */
    readonly MNY?: number
    /** 快乐变化 */
    readonly SPR?: number
    /** 寿命变化 */
    readonly LIF?: number
    /** 年龄变化 */
    readonly AGE?: number
}

/** 事件 */
export type Event = {
    /** ID */
    readonly id: number
    /** 事件内容 */
    readonly event: string
    /** 事件稀有度 */
    readonly grade: EventGrade
    /** 追加事件内容 */
    readonly postEvent?: string
    /** 事件效果 */
    readonly effect?: EventEffect
    /** 非随机事件 */
    readonly NoRandom?: boolean
    /** 有某事件时才能被随机到 */
    readonly include?: string
    /** 有某事件时一定随机不到 */
    readonly exclude?: string
    /** 分支路线 */
    readonly branch?: string[]
}
// @vt-types-end

export const transformers = {
    id: Number,
    // 默认稀有度为0
    grade: (val: any) => Number(val) || 0,
    effect: (val: any) => {
        if (!val) return
        for (const key in val) {
            val[key] = Number(val[key])
            if (isNaN(val[key]))
                throw new Error(`Invalid property value: ${key}=${val[key]}`)
        }
        return val
    },
}
