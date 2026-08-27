export type RNG = (max?: number, min?: number) => number
export function random(max: number = 1, min: number = 0, rng?: RNG): number {
    if (rng) return rng(max, min)
    if (max < min) [max, min] = [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min
}
export function pick<T>(items: T[], rng?: RNG) {
    if (items.length === 0) return null
    return items[random(items.length - 1, 0, rng)] ?? null
}
export type WeightItem<T> = readonly [T, number]
export function pickWeight<T>(items: WeightItem<T>[], rng?: RNG) {
    if (items.length === 0) return null
    // Find minimum positive weight to determine scaling factor
    let minWeight = Infinity
    for (const [, w] of items) {
        if (w > 0 && w < minWeight) minWeight = w
    }
    // If all weights are integers or no positive weights, use original logic
    if (minWeight === Infinity || Number.isInteger(minWeight)) {
        const totalWeight = items.reduce((sum, [, weight]) => sum + weight, 0)
        let mark = random(totalWeight - 1, 0, rng)
        for (const [item, weight] of items) {
            if (mark < weight) return item
            mark -= weight
        }
        return null
    }
    // Scale weights to integers based on decimal places of minWeight
    const decimals = Math.max(0, -Math.floor(Math.log10(minWeight))) + 1
    const scale = 10 ** decimals
    const scaledItems: WeightItem<T>[] = items.map(([item, weight]) => [item, Math.round(weight * scale)])
    const totalWeight = scaledItems.reduce((sum, [, weight]) => sum + weight, 0)
    let mark = random(totalWeight - 1, 0, rng)
    for (const [item, weight] of scaledItems) {
        if (mark < weight) return item
        mark -= weight
    }
    return null
}

export function sum(arr: number[]) {
    return arr.reduce((sum, v) => sum + v, 0)
}

export function shuffle<T>(array: T[], rng?: RNG): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
        const j = random(i, 0, rng)
        const temp = result[i]
        result[i] = result[j]!
        result[j] = temp!
    }
    return result
}

export function keys<T extends object, K extends keyof T = never>(
    obj: T,
    filter?: K[],
): Exclude<keyof T, K>[] {
    const allKeys = Object.keys(obj) as (keyof T)[]
    if (!filter || filter.length === 0) return allKeys as Exclude<keyof T, K>[]
    const filterSet = new Set<keyof T>(filter)
    return allKeys.filter(key => !filterSet.has(key)) as Exclude<keyof T, K>[]
}
// 定义获取字段值的方法签名
export type GetValueFn = (
    fieldName: string,
) => string | number | boolean | null | undefined
export function format(str: string, getValueFn: GetValueFn): string {
    if (!str) return ''
    return str.replace(
        /\{([^}]+)\}/g,
        (match: string, fieldName: string): string => {
            const value = getValueFn(fieldName)
            if (value === undefined || value === null) return match
            return String(value)
        },
    )
}

export function zoneFit(value: number, zone: [number, number]) {
    const max = Math.max(zone[0], zone[1])
    if (value > max) return max
    const min = Math.min(zone[0], zone[1])
    if (value < min) return min
    return value
}
