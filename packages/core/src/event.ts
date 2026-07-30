import type { EventEffect, Event } from '@remake/data/event'
import events from '@remake/data/event'
import type { Properties, Effect } from '@/state'
import type { GameState, ProfileState } from '@/state'
import { stateEffect, createFlatState } from '@/state'
import { check } from '@remake/condition'

export function convertEffect(effect: EventEffect): Effect {
    const converted = {} as Effect
    const properties = [] as [keyof Properties, number][]
    if (effect.CHR) properties.push(['charm', effect.CHR])
    if (effect.INT) properties.push(['intelligence', effect.INT])
    if (effect.STR) properties.push(['strength', effect.STR])
    if (effect.MNY) properties.push(['money', effect.MNY])
    if (effect.SPR) properties.push(['spirit', effect.SPR])
    if (properties.length > 0)
        converted.properties = Object.fromEntries(properties)
    if (effect.LIF) converted.life = effect.LIF
    return converted
}

export interface TriggerResult {
    state: GameState
    events: Event['id'][]
}

export function trigger(
    eventId: number,
    state: GameState,
    profile: ProfileState,
): TriggerResult {
    const event = events.get(eventId)
    if (!event)
        throw new Error(`[@remake/core][event] id:${eventId} not found.`)
    const effect = event.effect ? convertEffect(event.effect) : {}
    effect.events = [eventId]
    const newState = stateEffect(state, effect)
    const flatState = createFlatState(newState, profile)
    if (event.branch) {
        for (const branch of event.branch) {
            if (check(flatState, branch.condition)) {
                const result = trigger(branch.event, newState, profile)
                return {
                    state: result.state,
                    events: [eventId, ...result.events],
                }
            }
        }
    }
    return { state: newState, events: [eventId] }
}
