import { expect, test, describe } from 'bun:test'
import type { ProfileState } from './state'
import type { PullOptions } from './talent'
import { pull, exclude, additionalPoints, replacement } from './talent'
import { createState } from './state'
import talents from '@remake/data/talent'
import { produce } from 'immer'
import { enableMapSet } from 'immer'
enableMapSet()

describe('Talent', () => {
    const profile = {
        times: 0,
        talents: new Set([]),
        achievements: new Set([]),
        events: new Set([]),
    } as ProfileState

    const options = {
        count: 10,
        rate: {
            base: new Map([
                [0, 1000 - 111],
                [1, 100],
                [2, 10],
                [3, 1],
            ]),
            additions: {},
        },
    } as PullOptions

    test('pull external', () => {
        const p = produce(profile, draft => {
            draft.lockedTalent = 1001
        })
        const result = pull(options, p)
        expect(result.length).toBe(options.count)
        expect(result).toContain(p.lockedTalent!)
    })

    test('pull rate', () => {
        const opts = produce(options, draft => {
            draft.rate.additions = {
                times: () =>
                    new Map([
                        [0, { mode: 'multiply', value: 0 }],
                        [1, { mode: 'multiply', value: 0 }],
                        [2, { mode: 'multiply', value: 0 }],
                        [3, { mode: 'multiply', value: 1 }],
                    ]),
            }
        })
        const result = pull(opts, profile)
        expect(result.some(id => talents.get(id)?.grade === 3)).toBe(true)
    })

    test('exclude', () => {
        expect(exclude(1003, [1004])).toBe(1004)
        expect(exclude(1004, [1003])).toBe(1003)
        expect(exclude(1001, [1002, 1003])).toBe(null)
    })

    test('additionalPoints', () => {
        const result = additionalPoints([1001, 1002, 1003, 1007, 1019])
        expect(result).toEqual({
            source: [
                { talent: 1007, points: 2 },
                { talent: 1019, points: 4 },
            ],
            points: 6,
        })
    })

    test('replacement talent [阴间福袋]', () => {
        const talent = 1145
        const result = replacement([talent])
        expect(result.talents.size).toBeGreaterThan(1)
        expect(result.chains.get(talent)).toBeDefined()
        const source = talents.get(talent)!.replacement!.talent!
        const replaced = result.chains.get(talent)!.at(0)!
        expect(source.map(t => t[0])).toContain(replaced)
    })

    test('replacement grade [橙色转盘]', () => {
        const talent = 1144
        const result = replacement([talent])
        expect(result.talents.size).toBeGreaterThan(1)
        expect(result.chains.get(talent)).toBeDefined()
        const source = talents.get(talent)!.replacement!.grade!
        const replaced = result.chains.get(talent)!.at(0)!
        expect(talents.get(replaced)?.grade).toBe(source)
    })
})
