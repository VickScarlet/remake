import ages from '@remake/data/age'
import { propsEffect } from '@/state'
import { enableMapSet, produce } from 'immer'
enableMapSet()

export type * as achievement from '@/achievement'
export type * as event from '@/event'
export type * as talent from '@/talent'
export type * as state from '@/state'
import type { GameState, ProfileState } from '@/state'
export type { GameState, ProfileState }
export interface TriggerResult<T> {
    state: GameState
    triggers: T[]
}

export { pull } from '@/talent'
// export { summary, nextProfile } from '@/state'

import { replacement, additionalPoints } from '@/talent'
import type { ReplacementResult, AdditionalPoints } from '@/talent'

export interface TalentsPickedResult {
    talents: ReplacementResult
    additionalPoints: AdditionalPoints
}
export function talentsPicked(talents: Iterable<Talent['id']>) {
    const r = replacement(talents)
    const ap = additionalPoints(r.talents)
    return { talents: r, additionalPoints: ap }
}

import { createState } from '@/state'

export interface StartResult {
    state: GameState
    achievements: Achievement['id'][]
}
export function start(
    profile: ProfileState,
    ...args: Parameters<typeof createState>
): StartResult {
    const state = createState(...args)
    const ar = achievementTrigger('START', state, profile)
    return { state: ar.state, achievements: ar.triggers }
}

import type { Achievement } from '@remake/data/achievement'
import type { Event } from '@remake/data/event'
import type { Talent } from '@remake/data/talent'
import { trigger as achievementTrigger } from '@/achievement'
import { trigger as eventTrigger } from '@/event'
import { trigger as talentTrigger } from '@/talent'
import { check as eventCheck } from '@/event'
import { pickWeight } from '@remake/vitex'

export interface NextResult {
    state: GameState
    age: number
    achievements: Achievement['id'][]
    events: Event['id'][]
    talents: Talent['id'][]
    end: boolean
}

export function next(state: GameState, profile: ProfileState): NextResult {
    let s = produce(state, draft => {
        draft.props = propsEffect(state.props, { age: 1 })
    })
    const age = s.props.current.age
    const tr = talentTrigger(s, profile)
    const events = ages
        .get(age)!
        .event.filter(([e]) => eventCheck(e, tr.state, profile))
    const event = pickWeight(events)!
    const er = eventTrigger(event, tr.state, profile)
    const ar = achievementTrigger('TRAJECTORY', er.state, profile)
    const end = ar.state.life < 1
    return {
        state: ar.state,
        age,
        achievements: ar.triggers,
        events: er.triggers,
        talents: tr.triggers,
        end,
    }
}

import { summary as stateSummary } from '@/state'

export interface SummaryResult {
    state: GameState
    summary: number
    achievements: Achievement['id'][]
}
export function summary(
    state: GameState,
    profile: ProfileState,
): SummaryResult {
    const ar = achievementTrigger('SUMMARY', state, profile)
    const s = stateSummary(ar.state)
    return { state: ar.state, summary: s, achievements: ar.triggers }
}

import { nextProfile } from '@/state'
export interface EndResult {
    profile: ProfileState
    achievements: Achievement['id'][]
}

export function end(
    state: GameState,
    profile: ProfileState,
    lockedTalent?: Talent['id'],
) {
    const ar = achievementTrigger('END', state, profile)
    const p = nextProfile(profile, ar.state, lockedTalent)
    return { profile: p, achievements: ar.triggers }
}
