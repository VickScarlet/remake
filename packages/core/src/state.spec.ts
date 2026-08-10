import { expect, test, describe } from 'bun:test'
import { parse, type ConditionNode } from '@remake/condition'

import { achievements, events, talents } from '@remake/data'
import type { GameState, ProfileState, Properties } from './state'
import { createFlatState, createHLProperties, propsEffect } from './state'
import { SupportedFlatStateKeys } from './state'
import { enableMapSet } from 'immer'
enableMapSet()

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

describe('State', () => {
    test('flat cover event(include, exclude, branch)', () => {
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
                    if (!SupportedFlatStateKeys.has(key)) {
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

    test('flat cover talent(condition)', () => {
        const unmappedKeys = new Set<string>()
        const allTalentItems = talents.values()

        for (const item of allTalentItems) {
            const conditionStr = item.condition
            if (!conditionStr) continue

            const usedProperties = getPropertiesFromCondition(conditionStr)
            for (const key of usedProperties) {
                if (!SupportedFlatStateKeys.has(key)) {
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

    test('flat cover achievement(condition)', () => {
        const unmappedKeys = new Set<string>()
        const allAchievementItems = achievements.values()

        for (const item of allAchievementItems) {
            const conditionStr = item.condition
            if (!conditionStr) continue

            const usedProperties = getPropertiesFromCondition(conditionStr)
            for (const key of usedProperties) {
                if (!SupportedFlatStateKeys.has(key)) {
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

    test('flat get', () => {
        const game = {
            props: {
                lowest: {
                    age: 1,
                    charm: 2,
                    intelligence: 3,
                    strength: 4,
                    money: 5,
                    spirit: 6,
                },
                current: {
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
            },
            life: 31,
            talents: new Set([33]),
            events: new Set([34, 35]),
            achievements: new Set([36]),
        } as GameState

        const profile = {
            times: 41,
            external: 42,
            talents: new Set([43]),
            achievements: new Set([44]),
            events: new Set([45, 46]),
        } as ProfileState

        const flatState = createFlatState(game, profile)
        expect(flatState['AGE']).toBe(game.props.current.age)
        expect(flatState['CHR']).toBe(game.props.current.charm)
        expect(flatState['INT']).toBe(game.props.current.intelligence)
        expect(flatState['STR']).toBe(game.props.current.strength)
        expect(flatState['MNY']).toBe(game.props.current.money)
        expect(flatState['SPR']).toBe(game.props.current.spirit)
        expect(flatState['HAGE']).toBe(game.props.highest.age)
        expect(flatState['HCHR']).toBe(game.props.highest.charm)
        expect(flatState['HINT']).toBe(game.props.highest.intelligence)
        expect(flatState['HSTR']).toBe(game.props.highest.strength)
        expect(flatState['HMNY']).toBe(game.props.highest.money)
        expect(flatState['HSPR']).toBe(game.props.highest.spirit)
        expect(flatState['LAGE']).toBe(game.props.lowest.age)
        expect(flatState['LCHR']).toBe(game.props.lowest.charm)
        expect(flatState['LINT']).toBe(game.props.lowest.intelligence)
        expect(flatState['LSTR']).toBe(game.props.lowest.strength)
        expect(flatState['LMNY']).toBe(game.props.lowest.money)
        expect(flatState['LSPR']).toBe(game.props.lowest.spirit)
        expect(flatState['LIF']).toBe(game.life)
        expect(flatState['TLT']).toEqual(game.talents)
        expect(flatState['EVT']).toEqual(game.events)
        expect(flatState['TMS']).toBe(profile.times)
        expect(flatState['AEVT']).toEqual(profile.events)
        expect(flatState['ATLT']).toEqual(profile.talents)
        expect(flatState['AACH']).toEqual(profile.achievements)
        expect(flatState['SUM']).toBe(
            Math.floor((22 + 23 + 24 + 25 + 26) * 2 + 21 / 2),
        )
    })

    const allocation = { charm: 5, intelligence: 5, strength: 5, money: 5 }
    test('createHLProperties', () => {
        const props = createHLProperties(allocation)
        expect(props.current.charm).toBe(allocation.charm)
        expect(props.current.intelligence).toBe(allocation.intelligence)
        expect(props.current.strength).toBe(allocation.strength)
        expect(props.current.money).toBe(allocation.money)
        expect(props.current.age).toBe(-1)
        expect(props.current.spirit).toBe(0)
    })

    test('propsEffect', () => {
        const props = createHLProperties(allocation)
        const effect = {
            age: 6,
            charm: -2,
            intelligence: 3,
            strength: 4,
            money: -5,
            spirit: 7,
        }
        const effected = propsEffect(props, effect)
        for (const key in effect) {
            const k = key as keyof Properties
            const c = props.current[k]
            const be = c + effect[k]
            expect(effected.current[k]).toBe(be)
            expect(effected.highest[k]).toBe(Math.max(c, be))
            expect(effected.lowest[k]).toBe(Math.min(c, be))
        }
    })
})
