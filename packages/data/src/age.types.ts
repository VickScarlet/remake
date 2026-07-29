export type EventWithWeight = [number, number]
export type Age = {
    /** 年龄 */
    readonly age: number
    /** 事件列表 */
    readonly event: EventWithWeight[]
}
// @vt-types-end

export const transformers = {
    event: (val: any) => {
        if (val === null || val === undefined)
            throw new Error(`Invalid event value: ${val}`)
        if (Array.isArray(val))
            return val.map(v => {
                switch (typeof v) {
                    case 'number':
                        return [v, 1]
                    case 'string':
                        const [event, weight] = v.split('*').map(Number)
                        if (event == null || isNaN(event))
                            throw new Error(`Invalid event value: ${v}`)
                        if (weight != null && isNaN(weight))
                            throw new Error(
                                `Invalid weight value: ${v} ${JSON.stringify({ event, weight })}`,
                            )
                        return [event, weight ?? 1]
                    default:
                        throw new Error(`Invalid event value: ${v}`)
                }
            })
    },
}
