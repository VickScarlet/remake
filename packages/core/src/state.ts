import type { Talent } from '@remake/data/talent'
import type { Event } from '@remake/data/event'
import type { Achievement } from '@remake/data/achievement'
import { produce, enableMapSet } from 'immer'
import { sum } from '@remake/vitex'

enableMapSet()

/** 基础的属性 */
export interface Properties {
    age: number
    charm: number
    intelligence: number
    strength: number
    money: number
    spirit: number
}

export type Allocation = Omit<Properties, 'age' | 'spirit'>

export interface GameState {
    properties: Properties // 本局属性
    highest: Properties // 本局最高属性
    lowest: Properties // 本局最低属性
    life: number // 本局生命值
    talents: Set<Talent['id']> // 本局拥有的天赋
    events: Set<Event['id']> // 本局触发过的事件
    achievements: Set<Achievement['id']> // 本局达成的成就
}

/** 持久化存储的数据 */
export interface ProfileState {
    times: number // 游戏次数
    external?: Talent['id'] // 继承的天赋
    talents: Set<Talent['id']> // 拥有过的天赋
    events: Set<Event['id']> // 触发过的事件
    achievements: Set<Achievement['id']> // 达成的成就
    highest?: Properties // 历史最高属性
    lowest?: Properties // 历史最低属性
}

export function createState(
    allocation: Allocation,
    talents?: Iterable<Talent['id']>,
): GameState {
    const properties = { ...allocation, age: -1, spirit: 0 }
    return {
        properties,
        highest: { ...properties },
        lowest: { ...properties },
        life: 1,
        talents: new Set(talents),
        events: new Set(),
        achievements: new Set(),
    }
}
export interface FlatState {
    AGE: GameState['properties']['age']
    CHR: GameState['properties']['charm']
    INT: GameState['properties']['intelligence']
    STR: GameState['properties']['strength']
    MNY: GameState['properties']['money']
    SPR: GameState['properties']['spirit']
    LIF: GameState['life']
    TLT: GameState['talents']
    EVT: GameState['events']
    LAGE: GameState['lowest']['age']
    HAGE: GameState['highest']['age']
    LCHR: GameState['lowest']['charm']
    HCHR: GameState['highest']['charm']
    LINT: GameState['lowest']['intelligence']
    HINT: GameState['highest']['intelligence']
    LSTR: GameState['lowest']['strength']
    HSTR: GameState['highest']['strength']
    LMNY: GameState['lowest']['money']
    HMNY: GameState['highest']['money']
    LSPR: GameState['lowest']['spirit']
    HSPR: GameState['highest']['spirit']

    TMS: ProfileState['times']
    AEVT: ProfileState['events']
    ATLT: ProfileState['talents']
    AACH: ProfileState['achievements']

    SUM: number
}

interface FlatPropertiesTarget {
    game: GameState
    profile: ProfileState
}

type FlatMapper<Key extends keyof FlatState> = (
    state: FlatPropertiesTarget,
) => FlatState[Key]

const FlatMappers = {
    AGE: state => state.game.properties.age,
    CHR: state => state.game.properties.charm,
    INT: state => state.game.properties.intelligence,
    STR: state => state.game.properties.strength,
    MNY: state => state.game.properties.money,
    SPR: state => state.game.properties.spirit,
    LIF: state => state.game.life,
    TLT: state => state.game.talents,
    EVT: state => state.game.events,
    LAGE: state => state.game.lowest.age,
    HAGE: state => state.game.highest.age,
    LCHR: state => state.game.lowest.charm,
    HCHR: state => state.game.highest.charm,
    LINT: state => state.game.lowest.intelligence,
    HINT: state => state.game.highest.intelligence,
    LSTR: state => state.game.lowest.strength,
    HSTR: state => state.game.highest.strength,
    LMNY: state => state.game.lowest.money,
    HMNY: state => state.game.highest.money,
    LSPR: state => state.game.lowest.spirit,
    HSPR: state => state.game.highest.spirit,
    TMS: state => state.profile.times,
    AEVT: state => state.profile.events,
    ATLT: state => state.profile.talents,
    AACH: state => state.profile.achievements,
    SUM: state => {
        const { age, ...others } = state.game.highest
        const s = sum(Object.values(others))
        return Math.floor(s * 2 + age / 2)
    },
} as Record<keyof FlatState, FlatMapper<keyof FlatState>>

const flatPropertiesHandle = {
    get(target: FlatPropertiesTarget, prop: keyof FlatState) {
        return FlatMappers[prop]?.(target)
    },
    set: () => true,
}

export function createFlatState(game: GameState, profile: ProfileState) {
    return new Proxy(
        { game, profile },
        flatPropertiesHandle,
    ) as unknown as FlatState
}

export interface Effect {
    properties?: Partial<Properties>
    life?: number
    talents?: Iterable<Talent['id']>
    events?: Iterable<Event['id']>
    achievements?: Iterable<Achievement['id']>
}

export function stateEffect(state: GameState, effect: Effect) {
    return produce(state, draft => {
        for (const key in effect.properties) {
            const prop = key as keyof Properties
            const value = effect.properties[prop]!
            draft.properties[prop] += value
            draft.highest[prop] = Math.max(
                draft.highest[prop],
                draft.properties[prop],
            )
            draft.lowest[prop] = Math.min(
                draft.lowest[prop],
                draft.properties[prop],
            )
        }
        if (effect.life) draft.life += effect.life
        if (effect.talents)
            draft.talents = new Set([...draft.talents, ...effect.talents])
        if (effect.events)
            draft.events = new Set([...draft.events, ...effect.events])
        if (effect.achievements)
            draft.achievements = new Set([
                ...draft.achievements,
                ...effect.achievements,
            ])
    })
}

function highestProperties(a: Properties, b?: Properties): Properties {
    if (!b) return { ...a }
    const result = {} as Properties
    for (const key of Object.keys(a) as (keyof Properties)[]) {
        result[key] = Math.max(a[key], b[key])
    }
    return result
}

function lowestProperties(a: Properties, b?: Properties): Properties {
    if (!b) return { ...a }
    const result = {} as Properties
    for (const key of Object.keys(a) as (keyof Properties)[]) {
        result[key] = Math.min(a[key], b[key])
    }
    return result
}

export function nextProfile(
    profile: ProfileState,
    state: GameState,
    external?: Talent['id'],
) {
    return {
        times: profile.times + 1,
        talents: profile.talents.union(state.talents),
        events: profile.events.union(state.events),
        achievements: profile.achievements.union(state.achievements),
        highest: highestProperties(state.highest, profile.highest),
        lowest: lowestProperties(state.lowest, profile.lowest),
        external: external ?? profile.external,
    }
}
