export type Group = 1 | 2
export type SpecialThanks = {
    readonly group: Group
    readonly name: string
    readonly comment?: string
    readonly color?: string
}
// @vt-types-end

export const transformers = {
    group: Number,
}
