import { expect, test, describe } from 'bun:test'
import { createState } from './state'
import { trigger } from './achievement'
import { AchievementOpportunity } from '@remake/data'
import { enableMapSet } from 'immer'
enableMapSet()

describe('Achievement', () => {
    const profile = {
        times: 0,
        talents: new Set([]),
        achievements: new Set([]),
        events: new Set([]),
    }
    const allocation = {
        charm: 5,
        intelligence: 5,
        strength: 5,
        money: 5,
        spirit: 5,
    }

    test('trigger [times:500]', () => {
        const p = { ...profile, times: 500 }
        const result = trigger(
            AchievementOpportunity.End,
            createState(allocation, []),
            p,
        )
        expect(result.state.achievements).toContain(101) // 既视感
        expect(result.state.achievements).toContain(102) // 孟婆愁
        expect(result.state.achievements).toContain(103) // 所有人都是我
        expect(result.state.achievements).toContain(104) // Rewrite
        expect(result.triggers).toContain(101)
        expect(result.triggers).toContain(102)
        expect(result.triggers).toContain(103)
        expect(result.triggers).toContain(104)
    })
})
