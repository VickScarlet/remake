import type { Talent, TalentGrade } from '@remake/data/talent'
import talents from '@remake/data/talent'
import type { Properties } from '@/state'
import type { GameState, ProfileState } from '@/state'
import { propsEffect, createFlatState } from './state'
import { check } from '@remake/condition'
import { pick, pickWeight } from '@remake/vitex'
import { produce } from 'immer'
import type { TriggerResult } from '@/game'

const Grades: TalentGrade[] = [0, 1, 2, 3] as const
const GradeMap = Map.groupBy(
    talents.keys().filter(t => !talents.get(t)!.exclusive),
    t => talents.get(t)!.grade,
)

export const count = talents.size

export function get(talent: number) {
    return talents.get(talent)
}

export type PullRate = Map<TalentGrade, number>
export type PullRateAddition = {
    mode: 'add' | 'multiply'
    value: number
}
export type PullRateAdditions = {
    [key in keyof ProfileState]?: (
        value: ProfileState[key],
    ) => Map<TalentGrade, PullRateAddition>
}
export interface RateOptions {
    base: PullRate
    additions: PullRateAdditions
}
const AddidtionInit = Grades.map(g => [g, 1]) as [TalentGrade, number][]
function talentRateWithAddition(
    { base, additions }: RateOptions,
    profile: ProfileState,
) {
    const rate = new Map(AddidtionInit)
    for (const [key, getAddition] of Object.entries(additions)) {
        const value = profile[key as keyof ProfileState]
        for (const [k, v] of getAddition(value as any).entries()) {
            const current = rate.get(k)!
            if (v.mode === 'add') {
                rate.set(k, current + v.value)
            } else if (v.mode === 'multiply') {
                rate.set(k, current * v.value)
            }
        }
    }
    for (const [g, addition] of rate.entries()) {
        const b = base.get(g)
        if (!b) throw new Error(`talent: base rate for grade ${g} is missing`)
        rate.set(g, Math.max(b * addition, 0))
    }
    return rate
}

export interface PullOptions {
    count: number
    rate: RateOptions
}

export function pull(options: PullOptions, profile: ProfileState) {
    const rate = Array.from(
        talentRateWithAddition(options.rate, profile).entries(),
    )
    const result = []
    if (profile.lockedTalent) result.push(profile.lockedTalent)
    const map = new Map(Grades.map(g => [g, new Set(GradeMap.get(g))]))
    for (let i = options.count - result.length; i > 0; i--) {
        const grade = pickWeight(rate)! ?? 0
        const set = map.get(grade)!
        if (set.size === 0) continue
        const id = pick(Array.from(set))!
        result.push(id)
        set.delete(id)
    }
    return result
}

export function exclude(talent: Talent['id'], list: Iterable<Talent['id']>) {
    const { exclude } = talents.get(talent)!
    for (const t of list) {
        if (exclude) {
            for (const e of exclude) {
                if (t == e) return t
            }
        }
        const excludeReverse = talents.get(t)!.exclude
        if (excludeReverse) {
            for (const e of excludeReverse) {
                if (talent == e) return t
            }
        }
    }
    return null
}

function chainReplace(t: Talent['id'], ts: Set<Talent['id']>) {
    const { replacement: r } = talents.get(t)!
    if (!r) return null
    let picked: Talent['id'] | null = null
    if (r.talent) {
        const filtered = r.talent.filter(([id]) => exclude(id, ts) == null)
        picked = pickWeight(filtered)
    } else if (r.grade) {
        const filtered = GradeMap.get(r.grade)!.filter(
            id => exclude(id, ts) == null,
        )
        picked = pick(filtered)
    }
    if (!picked) return null
    const nts = new Set(ts)
    nts.add(picked)
    const next = chainReplace(picked, nts) as Talent['id'][] | null
    if (next) return [picked, ...next]
    return [picked]
}

export interface ReplacementResult {
    talents: Set<Talent['id']>
    chains: Map<Talent['id'], Talent['id'][]>
}

export function replacement(list: Iterable<Talent['id']>): ReplacementResult {
    const set = new Set(list)
    const chains = new Map() as ReplacementResult['chains']
    for (const talent of list) {
        const chain = chainReplace(talent, set)
        if (!chain) continue
        chains.set(talent, chain)
        chain.forEach(t => set.add(t))
    }
    return { talents: set, chains }
}

export interface AdditionalPoint {
    talent: Talent['id']
    points: number
}

export interface AdditionalPoints {
    source: AdditionalPoint[]
    points: number
}

export function additionalPoints(
    list: Iterable<Talent['id']>,
): AdditionalPoints {
    const source: AdditionalPoint[] = []
    let total = 0
    for (const id of list) {
        const { points } = talents.get(id)!
        if (!points) continue
        source.push({ talent: id, points })
        total += points
    }
    return { source, points: total }
}

const EffectRandomProperties = [
    'money',
    'strength',
    'intelligence',
    'charm',
    'spirit',
] as (keyof Properties)[]

export function trigger(
    state: GameState,
    profile: ProfileState,
): TriggerResult<Talent['id']> {
    const flatState = createFlatState(state, profile)
    const triggers: Talent['id'][] = []
    for (const talent of state.talents) {
        const { condition, max } = talents.get(talent)!
        if (state.talentTriggers.get(talent) ?? 0 >= max) continue
        if (condition && !check(flatState, condition)) continue
        triggers.push(talent)
    }
    if (triggers.length === 0) return { state, triggers }
    const newState = produce(state, draft => {
        for (const talent of triggers) {
            const times = draft.talentTriggers.get(talent) ?? 0
            draft.talentTriggers.set(talent, times + 1)
            const { effect } = talents.get(talent)!
            if (!effect) continue
            const pe = {} as Partial<Properties>
            if (effect.CHR) pe.charm = effect.CHR
            if (effect.INT) pe.intelligence = effect.INT
            if (effect.STR) pe.strength = effect.STR
            if (effect.MNY) pe.money = effect.MNY
            if (effect.SPR) pe.spirit = effect.SPR
            if (effect.RND) {
                const key = pick(EffectRandomProperties)!
                pe[key] = (pe[key] ?? 0) || effect.RND
            }
            draft.props = propsEffect(draft.props, pe)
        }
    })
    return { state: newState, triggers }
}
