import { test, expect, describe } from 'vitest'
import { talents, achievements, events } from '@remake/data'

describe('Bili Toy Cloud Save Core', () => {
    test('maxSizeProfile should pass ToyCloudSaveCore constraints', () => {
        const json = JSON.stringify({
            times: 999999,
            locked: Array.from(talents.keys()),
            talents: Array.from(talents.keys()),
            achievements: Array.from(achievements.keys()),
            events: Array.from(events.keys()),
        })
        expect(json.length).toBeLessThan((48 * 960 * 3) / 4)
    })
})
