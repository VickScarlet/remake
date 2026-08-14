import type { Character, CharacterProperty, Talent } from '@remake/data'
import { characters, talents } from '@remake/data'
import { type RNG, type WeightItem, pick, pickWeight } from '@remake/vitex'
import type { Allocation } from './state'

export type BaseChara = Omit<Character, 'id' | 'name'>
export type BaseAlloc = Omit<Allocation, 'spirit'>
export interface UniqueGenCfg {
    prop: WeightItem<number>[]
    talent: WeightItem<number>[]
}
export function uniqueGenerate(config: UniqueGenCfg, rng?: RNG) {
    const CHR = pickWeight(config.prop, rng) ?? 0
    const INT = pickWeight(config.prop, rng) ?? 0
    const STR = pickWeight(config.prop, rng) ?? 0
    const MNY = pickWeight(config.prop, rng) ?? 0
    let count = pickWeight(config.talent, rng) ?? 0
    const property = { CHR, INT, STR, MNY }
    const ids = Array.from(talents.keys())
    const picked = new Set<Talent['id']>()
    while (count > 0) {
        const t = pick(ids, rng)!
        if (picked.has(t)) continue
        if (talents.get(t)!.exclusive) continue
        picked.add(t)
        count--
    }
    return { property, talent: Array.from(picked) } satisfies BaseChara
}

export interface PullCharaOpt {
    count: number
    knife: number
}
export interface PullCharaTms {
    times: number
    drawns: Map<Character['id'], number>
}
export interface PullCharaRet {
    characters: Character['id'][]
    times: PullCharaTms
}
export function pullChara(
    opt: PullCharaOpt,
    tms: PullCharaTms = { times: 0, drawns: new Map() },
    rng?: RNG,
): PullCharaRet {
    const { count, knife } = opt
    const drawns = new Map(tms.drawns)
    const picked = new Set<Character['id']>()
    for (let i = 0; i < count; i++) {
        const weightMap = deriveWeightMap(tms.times + i, knife, drawns)
        picked.forEach(id => weightMap.delete(id))
        const id = pickWeight(Array.from(weightMap.entries()), rng)!
        picked.add(id)
        drawns.set(id, (drawns.get(id) ?? 0) + 1)
    }
    return {
        characters: Array.from(picked),
        times: { times: tms.times + count, drawns },
    }
}

function deriveWeightMap(
    times: number,
    knife: number,
    drawns: PullCharaTms['drawns'],
): Map<Character['id'], number> {
    const max = Math.max(0, ...drawns.values())
    const base = times - knife * Math.floor((times - max) / (knife || 1)) || 1
    return new Map(
        Array.from(characters.keys(), id => [id, base - (drawns.get(id) ?? 0)]),
    )
}

export function charaPropToBaseAlloc(props: CharacterProperty): BaseAlloc {
    return {
        charm: props.CHR,
        intelligence: props.INT,
        strength: props.STR,
        money: props.MNY,
    }
}

function charaPropToAlloc(
    props: CharacterProperty,
    spirit: number,
): Allocation {
    return { ...charaPropToBaseAlloc(props), spirit }
}

function convert(chara: BaseChara, spirit: number) {
    return {
        allocation: charaPropToAlloc(chara.property, spirit),
        talents: chara.talent,
    }
}

export function startChara(id: Character['id'], spirit: number) {
    return convert(characters.get(id)!, spirit)
}

export function startUnique(chara: BaseChara, spirit: number) {
    return convert(chara, spirit)
}
