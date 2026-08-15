/** 特别鸣谢分组 */
export enum SpecialThanksGroup {
    G1 = 1,
    G2 = 2,
}

/** 特别鸣谢 */
export type SpecialThanks = {
    /** 特别鸣谢分组 */
    readonly group: SpecialThanksGroup
    /** 名字 */
    readonly name: string
    /** 喊话 */
    readonly comment?: string
    /** 颜色 */
    readonly color?: string
}
// @vt-types-end

export const transformers = {
    group: Number,
}
