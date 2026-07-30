import { expect, test, describe } from 'bun:test'
import { parse, type ConditionNode } from '@remake/condition'

import achievements from '@remake/data/achievement'
import events from '@remake/data/event'
import talents from '@remake/data/talent'

import { createFlatState } from './state'

const A = ['AGE', 'CHR', 'INT', 'STR', 'MNY', 'SPR', 'LIF', 'TLT', 'EVT', 'TMS']
const B = ['HAGE', 'HCHR', 'HINT', 'HSTR', 'HMNY', 'HSPR']
const C = ['LAGE', 'LCHR', 'LINT', 'LSTR', 'LMNY', 'LSPR']
const D = ['AEVT', 'ATLT', 'SUM']
const FlatProperties = new Set([...A, ...B, ...C, ...D])

/**
 * 核心递归辅助函数：从多维语法树节点中提取所有属性名
 */
function extractKeysFromNode(node: ConditionNode, properties: Set<string>) {
    if (Array.isArray(node)) {
        for (const subNode of node) {
            extractKeysFromNode(subNode, properties)
        }
    } else {
        if (node === '&' || node === '|') return

        // 匹配操作符（><!?=）前面的属性名部分
        const match = node.match(/^([^><!?=]+)/)
        if (match && match) {
            properties.add(match[1]!.trim())
        }
    }
}

/**
 * 从条件字符串中提取所有使用到的属性键名
 */
function getPropertiesFromCondition(condition: string): Set<string> {
    const parsedConditions = parse(condition)
    const properties = new Set<string>()
    extractKeysFromNode(parsedConditions, properties)
    return properties
}

describe('FlatState', () => {
    test('[Cover] event(include, exclude, branch)', () => {
        const unmappedKeys = new Set<string>()
        for (const item of events.values()) {
            const conditionsToTrack: { label: string; text: string }[] = []
            if (item.include) {
                conditionsToTrack.push({ label: 'include', text: item.include })
            }
            if (item.exclude) {
                conditionsToTrack.push({ label: 'exclude', text: item.exclude })
            }

            if (item.branch && Array.isArray(item.branch)) {
                item.branch.forEach((branchObj, index) => {
                    if (branchObj && branchObj.condition) {
                        conditionsToTrack.push({
                            label: `branch[${index}].condition (目标事件ID: ${branchObj.event})`,
                            text: branchObj.condition,
                        })
                    }
                })
            }

            for (const { label, text } of conditionsToTrack) {
                const usedProperties = getPropertiesFromCondition(text)
                for (const key of usedProperties) {
                    if (!FlatProperties.has(key)) {
                        unmappedKeys.add(
                            `[事件 ID: ${item.id}] 的 "${label}" 字段使用了未定义的键名: "${key}" (完整条件: "${text}")`,
                        )
                    }
                }
            }
        }

        if (unmappedKeys.size > 0) {
            console.error('\n❌ 发现事件配置表存在未定义的 Property 键名：')
            unmappedKeys.forEach(msg => console.error(msg))
        }

        expect(unmappedKeys.size).toBe(0)
    })

    test('[Cover] talent(condition)', () => {
        const unmappedKeys = new Set<string>()
        const allTalentItems = talents.values()

        for (const item of allTalentItems) {
            const conditionStr = item.condition
            if (!conditionStr) continue

            const usedProperties = getPropertiesFromCondition(conditionStr)
            for (const key of usedProperties) {
                if (!FlatProperties.has(key)) {
                    unmappedKeys.add(
                        `[天赋 ID: ${item.id}] 使用了未定义的键名: "${key}" (完整条件: "${conditionStr}")`,
                    )
                }
            }
        }

        if (unmappedKeys.size > 0) {
            console.error('\n❌ 发现天赋配置表存在未定义的 Property 键名：')
            unmappedKeys.forEach(msg => console.error(msg))
        }

        expect(unmappedKeys.size).toBe(0)
    })

    test('[Cover] achievement(condition)', () => {
        const unmappedKeys = new Set<string>()
        const allAchievementItems = achievements.values()

        for (const item of allAchievementItems) {
            const conditionStr = item.condition
            if (!conditionStr) continue

            const usedProperties = getPropertiesFromCondition(conditionStr)
            for (const key of usedProperties) {
                if (!FlatProperties.has(key)) {
                    unmappedKeys.add(
                        `[成就 ID: ${item.id}] 使用了未定义的键名: "${key}" (完整条件: "${conditionStr}")`,
                    )
                }
            }
        }

        if (unmappedKeys.size > 0) {
            console.error('\n❌ 发现成就配置表存在未定义的 Property 键名：')
            unmappedKeys.forEach(msg => console.error(msg))
        }

        expect(unmappedKeys.size).toBe(0)
    })

    test('get', () => {
        const game = {
            lowest: {
                age: 1,
                charm: 2,
                intelligence: 3,
                strength: 4,
                money: 5,
                spirit: 6,
            },
            properties: {
                age: 11,
                charm: 12,
                intelligence: 13,
                strength: 14,
                money: 15,
                spirit: 16,
            },
            highest: {
                age: 21,
                charm: 22,
                intelligence: 23,
                strength: 24,
                money: 25,
                spirit: 26,
            },
            life: 31,
            talents: new Set([33]),
            events: new Set([34, 35]),
            achievements: new Set([36]),
        }

        const profile = {
            times: 41,
            external: 42,
            talents: new Set([43]),
            achievements: new Set([44]),
            events: new Set([45, 46]),
        }

        const flatState = createFlatState(game, profile)
        expect(flatState['AGE']).toBe(game.properties.age)
        expect(flatState['CHR']).toBe(game.properties.charm)
        expect(flatState['INT']).toBe(game.properties.intelligence)
        expect(flatState['STR']).toBe(game.properties.strength)
        expect(flatState['MNY']).toBe(game.properties.money)
        expect(flatState['SPR']).toBe(game.properties.spirit)
        expect(flatState['LIF']).toBe(game.life)
        expect(flatState['TLT']).toEqual(game.talents)
        expect(flatState['EVT']).toEqual(game.events)
        expect(flatState['LAGE']).toBe(game.lowest.age)
        expect(flatState['HAGE']).toBe(game.highest.age)
        expect(flatState['LCHR']).toBe(game.lowest.charm)
        expect(flatState['HCHR']).toBe(game.highest.charm)
        expect(flatState['LINT']).toBe(game.lowest.intelligence)
        expect(flatState['HINT']).toBe(game.highest.intelligence)
        expect(flatState['LSTR']).toBe(game.lowest.strength)
        expect(flatState['HSTR']).toBe(game.highest.strength)
        expect(flatState['LMNY']).toBe(game.lowest.money)
        expect(flatState['HMNY']).toBe(game.highest.money)
        expect(flatState['LSPR']).toBe(game.lowest.spirit)
        expect(flatState['HSPR']).toBe(game.highest.spirit)
        expect(flatState['TMS']).toBe(profile.times)
        expect(flatState['AEVT']).toEqual(profile.events)
        expect(flatState['ATLT']).toEqual(profile.talents)
        expect(flatState['AACH']).toEqual(profile.achievements)
        expect(flatState['SUM']).toBe(
            Math.floor((22 + 23 + 24 + 25 + 26) * 2 + 21 / 2),
        )
    })
})
