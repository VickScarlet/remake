import type { Achievement, Event, Talent } from '@remake/data'
import { ages, AchievementOpportunity as Ao } from '@remake/data'
import type { Allocation, GameState, ProfileState } from './state'
import type { Properties } from './state'
import { createState, nextProfile, propsEffect } from './state'
import { summary as stateSummary } from './state'
import type { PullOptions, ReplacementResult } from './talent'
import type { AdditionalPoint, AdditionalPoints } from './talent'
import { pull, exclude, replacement, additionalPoints } from './talent'
import { trigger as ttr } from './talent'
import { trigger as atr } from './achievement'
import { trigger as etr, check as ec } from './event'
import type { RNG } from '@remake/vitex'
import { pickWeight } from '@remake/vitex'
import { produce, enableMapSet } from 'immer'
enableMapSet()

export interface TriggerResult<T> {
    state: GameState
    triggers: T[]
}
export interface TalentsPickedResult {
    talents: ReplacementResult
    additionalPoints: AdditionalPoints
}
export function talentsPicked(
    talents: Iterable<Talent['id']>,
    rng?: RNG,
): TalentsPickedResult {
    const r = replacement(talents, rng)
    const ap = additionalPoints(r.talents)
    return { talents: r, additionalPoints: ap }
}

export interface StartResult {
    state: GameState
    achievements: Achievement['id'][]
}
export function start(
    profile: ProfileState,
    ...args: Parameters<typeof createState>
): StartResult {
    const state = createState(...args)
    const ar = atr(Ao.Start, state, profile)
    return { state: ar.state, achievements: ar.triggers }
}
export interface NextResult {
    state: GameState
    age: number
    achievements: Achievement['id'][]
    events: Event['id'][]
    talents: Talent['id'][]
    end: boolean
}

export function next(
    state: GameState,
    profile: ProfileState,
    rng?: RNG,
): NextResult {
    let s = produce(state, draft => {
        draft.props = propsEffect(state.props, { age: 1 })
    })
    const age = s.props.current.age
    const tr = ttr(s, profile, rng)
    const events = ages
        .get(age)!
        .event.filter(([e]) => ec(e, tr.state, profile))
    const event = pickWeight(events, rng)!
    const er = etr(event, tr.state, profile)
    const ar = atr(Ao.Trajectory, er.state, profile)
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

export interface SummaryResult {
    state: GameState
    summary: number
    achievements: Achievement['id'][]
}
export function summary(
    state: GameState,
    profile: ProfileState,
): SummaryResult {
    const ar = atr(Ao.Summary, state, profile)
    const s = stateSummary(ar.state)
    return { state: ar.state, summary: s, achievements: ar.triggers }
}

export interface EndResult {
    profile: ProfileState
    achievements: Achievement['id'][]
}

export function end(
    state: GameState,
    profile: ProfileState,
    locked?: Talent['id'][],
) {
    const ar = atr(Ao.End, state, profile)
    const p = nextProfile(profile, ar.state, locked)
    return { profile: p, achievements: ar.triggers }
}

export { pull, exclude }
export type { GameState, ProfileState, Properties, RNG }
export type { PullOptions, ReplacementResult, Allocation }
export type { AdditionalPoint, AdditionalPoints }
