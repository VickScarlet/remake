export type Grade = 0 | 1 | 2 | 3

export type Effect = {
    MNY?: number
    STR?: number
    INT?: number
    CHR?: number
    SPR?: number
}

export type Talent = {
    readonly id: number
    readonly name: string
    readonly description: string
    readonly grade: number
    readonly effect?: Effect
    readonly exclude?: number[]
}
// @vt-types-end

export const transformers = {
    id: Number,
    grade: Number,
    exclude: (val: (string | number)[] | undefined) => val?.map(Number),
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
