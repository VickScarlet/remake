import type { Achievement, Event, Talent, Character } from '@remake/data'
import { produce } from 'immer'
import { sum, keys } from '@remake/vitex'

/** 基础的属性 */
export interface Properties {
    age: number
    charm: number
    intelligence: number
    strength: number
    money: number
    spirit: number
}

export interface HLProperties {
    current: Properties // 当前属性
    highest: Properties // 历史最高属性
    lowest: Properties // 历史最低属性
}

export type Allocation = Omit<Properties, 'age'>
export function createProperties(allocation: Allocation) {
    return { ...allocation, age: -1 }
}

export function createHLProperties(allocation: Allocation) {
    const current = createProperties(allocation)
    return { current, highest: { ...current }, lowest: { ...current } }
}

export interface GameState {
    props: HLProperties // 本局属性
    life: number // 本局生命值
    talents: Set<Talent['id']> // 本局拥有的天赋
    events: Set<Event['id']> // 本局触发过的事件
    achievements: Set<Achievement['id']> // 本局达成的成就
    talentTriggers: Map<Talent['id'], number> // 本局天赋触发次数
}

/** 唯一角色 */
export type UniqueCharacter = Omit<Character, 'id' | 'name'>

/** 持久化存储的数据 */
export interface ProfileState {
    times: number // 游戏次数
    locked?: Talent['id'][] // 锁定的天赋
    talents: Set<Talent['id']> // 拥有过的天赋
    events: Set<Event['id']> // 触发过的事件
    achievements: Set<Achievement['id']> // 达成的成就
    highest?: Properties // 历史最高属性
    lowest?: Properties // 历史最低属性
    unique?: UniqueCharacter // 唯一角色属性
}

export function createState(
    allocation: Allocation,
    talents?: Iterable<Talent['id']>,
): GameState {
    return {
        props: createHLProperties(allocation),
        life: 1,
        talents: new Set(talents),
        events: new Set(),
        achievements: new Set(),
        talentTriggers: new Map(),
    }
}

export function summary({ props }: GameState) {
    const { age, ...others } = props.highest
    const s = sum(Object.values(others))
    return Math.floor(s * 2 + age / 2)
}

export interface FlatState {
    AGE: GameState['props']['current']['age']
    CHR: GameState['props']['current']['charm']
    INT: GameState['props']['current']['intelligence']
    STR: GameState['props']['current']['strength']
    MNY: GameState['props']['current']['money']
    SPR: GameState['props']['current']['spirit']
    HAGE: GameState['props']['highest']['age']
    HCHR: GameState['props']['highest']['charm']
    HINT: GameState['props']['highest']['intelligence']
    HSTR: GameState['props']['highest']['strength']
    HMNY: GameState['props']['highest']['money']
    HSPR: GameState['props']['highest']['spirit']
    LAGE: GameState['props']['lowest']['age']
    LCHR: GameState['props']['lowest']['charm']
    LINT: GameState['props']['lowest']['intelligence']
    LSTR: GameState['props']['lowest']['strength']
    LMNY: GameState['props']['lowest']['money']
    LSPR: GameState['props']['lowest']['spirit']
    LIF: GameState['life']
    TLT: GameState['talents']
    EVT: GameState['events']

    TMS: ProfileState['times']
    AEVT: ProfileState['events']
    ATLT: ProfileState['talents']
    AACH: ProfileState['achievements']

    SUM: number
}

type FlatStateKey = keyof FlatState

interface FlatTarget {
    game: GameState
    profile: ProfileState
}

type FlatMapper<Key extends FlatStateKey> = (
    state: FlatTarget,
) => FlatState[Key]

const FlatMappers: { [Key in FlatStateKey]: FlatMapper<Key> } = {
    AGE: state => state.game.props.current.age,
    CHR: state => state.game.props.current.charm,
    INT: state => state.game.props.current.intelligence,
    STR: state => state.game.props.current.strength,
    MNY: state => state.game.props.current.money,
    SPR: state => state.game.props.current.spirit,
    HAGE: state => state.game.props.highest.age,
    HCHR: state => state.game.props.highest.charm,
    HINT: state => state.game.props.highest.intelligence,
    HSTR: state => state.game.props.highest.strength,
    HMNY: state => state.game.props.highest.money,
    HSPR: state => state.game.props.highest.spirit,
    LAGE: state => state.game.props.lowest.age,
    LCHR: state => state.game.props.lowest.charm,
    LINT: state => state.game.props.lowest.intelligence,
    LSTR: state => state.game.props.lowest.strength,
    LMNY: state => state.game.props.lowest.money,
    LSPR: state => state.game.props.lowest.spirit,
    LIF: state => state.game.life,
    TLT: state => state.game.talents,
    EVT: state => state.game.events,
    TMS: state => state.profile.times,
    AEVT: state => state.profile.events,
    ATLT: state => state.profile.talents,
    AACH: state => state.profile.achievements,
    SUM: ({ game }) => summary(game),
}

export const SupportedFlatStateKeys = new Set(keys(FlatMappers))

const flatStateHandle = {
    get<Key extends FlatStateKey>(target: FlatTarget, prop: Key) {
        return FlatMappers[prop]?.(target)
    },
    set: () => true,
}

export function createFlatState(game: GameState, profile: ProfileState) {
    return new Proxy({ game, profile }, flatStateHandle) as unknown as FlatState
}

export function propsEffect(hlp: HLProperties, effect: Partial<Properties>) {
    return produce(hlp, draft => {
        for (const key in effect) {
            const prop = key as keyof Properties
            const value = effect[prop]!
            draft.current[prop] += value
            draft.highest[prop] = Math.max(
                draft.highest[prop],
                draft.current[prop],
            )
            draft.lowest[prop] = Math.min(
                draft.lowest[prop],
                draft.current[prop],
            )
        }
    })
}

export function highestProperties(a: Properties, b?: Properties): Properties {
    if (!b) return { ...a }
    const result = {} as Properties
    for (const key of keys(a)) {
        result[key] = Math.max(a[key], b[key])
    }
    return result
}

export function lowestProperties(a: Properties, b?: Properties): Properties {
    if (!b) return { ...a }
    const result = {} as Properties
    for (const key of keys(a)) {
        result[key] = Math.min(a[key], b[key])
    }
    return result
}

export function nextProfile(
    profile: ProfileState,
    state: GameState,
    locked?: Talent['id'][],
) {
    return {
        times: profile.times + 1,
        talents: profile.talents.union(state.talents),
        events: profile.events.union(state.events),
        achievements: profile.achievements.union(state.achievements),
        highest: highestProperties(state.props.highest, profile.highest),
        lowest: lowestProperties(state.props.lowest, profile.lowest),
        locked,
    }
}
