export type Grade = 0 | 1 | 2 | 3

export type Effect = {
    MNY?: number
    STR?: number
    INT?: number
    CHR?: number
    SPR?: number
    LIF?: number
}

export type Event = {
    /** ID */
    readonly id: number
    /** 事件列表 */
    readonly event: string
    readonly postEvent?: string
    readonly grade?: number
    readonly effect?: Effect
    readonly branch?: string[]
    readonly NoRandom?: boolean
    readonly include?: string
    readonly exclude?: string
}
// @vt-types-end

export const transformers = {
    id: Number,
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
