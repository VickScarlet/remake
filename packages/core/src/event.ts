import type { Event } from '@remake/data/event'
import events from '@remake/data/event'
import type { Properties } from '@/state'
import type { GameState, ProfileState } from '@/state'
import { propsEffect, createFlatState } from '@/state'
import { check } from '@remake/condition'
import { produce } from 'immer'

export interface TriggerResult {
    state: GameState
    events: Event['id'][]
}

export function trigger(
    eventId: number,
    state: GameState,
    profile: ProfileState,
): TriggerResult {
    const { effect, branch } = events.get(eventId)!
    const newState = produce(state, draft => {
        draft.events.add(eventId)
        if (!effect) return
        if (effect.LIF) draft.life += effect.LIF
        const pe = {} as Partial<Properties>
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
            if (check(flatState, condition)) {
                const result = trigger(event, newState, profile)
                return {
                    state: result.state,
                    events: [eventId, ...result.events],
                }
            }
        }
    }
    return { state: newState, events: [eventId] }
}
