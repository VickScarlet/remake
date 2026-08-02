import { expect, test, describe } from 'bun:test'
import { createState } from './state'
import { trigger } from './event'
import { enableMapSet } from 'immer'
enableMapSet()

describe('Event', () => {
    const profile = {
        times: 0,
        talents: new Set([]),
        achievements: new Set([]),
        events: new Set([]),
    }
    const allocation = {
        charm: 10,
        intelligence: 10,
        strength: 0,
        money: 0,
    }

    test('branch 10003:0 [玉佩]', () => {
        const result = trigger(
            10003,
            createState(allocation, [1001, 1002, 1003]),
            profile,
        )
        expect(result.state.life).toBe(1)
        expect(result.state.events).toEqual(new Set([10003, 10004]))
        expect(result.triggers).toEqual([10003, 10004])
    })

    test('branch 10003:1 [死了]', () => {
        const result = trigger(10003, createState(allocation, []), profile)
        expect(result.state.life).toBe(0)
        expect(result.state.events).toEqual(new Set([10003, 10000]))
        expect(result.triggers).toEqual([10003, 10000])
    })
})
