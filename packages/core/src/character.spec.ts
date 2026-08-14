import { expect, test, describe } from 'bun:test'
import { pullChara, uniqueGenerate } from './character'
import { enableMapSet } from 'immer'
enableMapSet()

describe('Character', () => {
    const sum = (map: Map<any, number>) =>
        Array.from(map.values()).reduce((acc, val) => acc + val, 0)
    test('pull', () => {
        let result = pullChara(
            { count: 10, knife: 10 },
            { times: 0, drawns: new Map() },
        )
        expect(result.characters).not.toContainValue(null)
        expect(result.characters.length).toBe(10)
        expect(result.times.times).toBe(10)
        expect(result.times.drawns.size).toBe(10)
        result = pullChara({ count: 3, knife: 10 }, result.times)
        expect(result.characters).not.toContainValue(null)
        expect(result.characters.length).toBe(3)
        expect(result.times.times).toBe(13)
        expect(sum(result.times.drawns)).toBe(13)
        result = pullChara({ count: 3, knife: 10 }, result.times)
        expect(result.characters).not.toContainValue(null)
        expect(result.characters.length).toBe(3)
        expect(result.times.times).toBe(16)
        expect(sum(result.times.drawns)).toBe(16)
        result = pullChara({ count: 20, knife: 1 }, result.times)
        expect(result.characters).not.toContainValue(null)
        expect(result.characters.length).toBe(20)
        expect(result.times.times).toBe(36)
        expect(sum(result.times.drawns)).toBe(36)
    })

    const wr = (s: number, e: number) => {
        const length = e - s + 1
        return Array.from(
            { length },
            (_, i) => [s + i, Math.min(i + 1, length - i)] as const,
        )
    }

    test('unique', () => {
        const unique = uniqueGenerate({ prop: wr(0, 10), talent: wr(1, 5) })
        expect(unique.property).toHaveProperty('CHR')
        expect(unique.property).toHaveProperty('INT')
        expect(unique.property).toHaveProperty('STR')
        expect(unique.property).toHaveProperty('MNY')
        expect(unique.property.CHR).toBeGreaterThanOrEqual(0)
        expect(unique.property.INT).toBeGreaterThanOrEqual(0)
        expect(unique.property.STR).toBeGreaterThanOrEqual(0)
        expect(unique.property.MNY).toBeGreaterThanOrEqual(0)
        expect(unique.talent.length).toBeGreaterThanOrEqual(0)
        expect(unique.property.CHR).toBeLessThanOrEqual(10)
        expect(unique.property.INT).toBeLessThanOrEqual(10)
        expect(unique.property.STR).toBeLessThanOrEqual(10)
        expect(unique.property.MNY).toBeLessThanOrEqual(10)
        expect(unique.talent.length).toBeLessThanOrEqual(5)
    })
})
