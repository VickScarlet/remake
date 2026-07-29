export type Property = {
    readonly CHR: number
    readonly INT: number
    readonly STR: number
    readonly MNY: number
}
export type Character = {
    /** ID */
    readonly id: number
    /** 事件列表 */
    readonly name: string
    readonly property: Property
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
