/** 人物属性 */
export type CharacterProperty = {
    /** 颜值 */
    readonly CHR: number
    /** 智力 */
    readonly INT: number
    /** 体质 */
    readonly STR: number
    /** 家境 */
    readonly MNY: number
}

/** 人物 */
export type Character = {
    /** 序号 */
    readonly id: number
    /** 人名 */
    readonly name: string
    /** 属性 */
    readonly property: CharacterProperty
    /** 天赋 */
    readonly talent: number[]
}
// @vt-types-end

export const transformers = {
    id: Number,
    talent: (val: (string | number)[]) => val.map(Number),
    property: (val: any) => {
        if (val === null || val === undefined)
            throw new Error(`Invalid property value: ${JSON.stringify(val)}`)
        for (const key of ['CHR', 'INT', 'STR', 'MNY']) {
            val[key] = Number(val[key])
            if (isNaN(val[key]))
                throw new Error(`Invalid property value: ${key}=${val[key]}`)
        }
        return val
    },
}
