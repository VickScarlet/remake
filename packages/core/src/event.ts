import { type Event, events } from '@remake/data'
import type { Properties, GameState, ProfileState } from './state'
import { propsEffect, createFlatState } from './state'
import { check as checkCondition } from '@remake/condition'
import type { TriggerResult } from './game'
import { produce } from 'immer'

export function check(
    event: Event['id'],
    state: GameState,
    profile: ProfileState,
) {
    const { include, exclude, NoRandom } = events.get(event)!
    if (NoRandom) return false
    const flatState = createFlatState(state, profile)
    if (exclude && checkCondition(flatState, exclude)) return false
    if (include) return checkCondition(flatState, include)
    return true
}

export function trigger(
    eventId: number,
    state: GameState,
    profile: ProfileState,
): TriggerResult<Event['id']> {
    const { effect, branch } = events.get(eventId)!
    const newState = produce(state, draft => {
        draft.events.add(eventId)
        if (!effect) return
        if (effect.LIF) draft.life += effect.LIF
        const pe: Partial<Properties> = {}
        if (effect.CHR) pe.charm = effect.CHR
        if (effect.INT) pe.intelligence = effect.INT
        if (effect.STR) pe.strength = effect.STR
        if (effect.MNY) pe.money = effect.MNY
        if (effect.SPR) pe.spirit = effect.SPR
        draft.props = propsEffect(draft.props, pe)
    })
    const flatState = createFlatState(newState, profile)
    if (branch) {
        for (const { condition, event } of branch) {
            if (checkCondition(flatState, condition)) {
                const result = trigger(event, newState, profile)
                return {
                    state: result.state,
                    triggers: [eventId, ...result.triggers],
                }
            }
        }
    }
    return { state: newState, triggers: [eventId] }
}
