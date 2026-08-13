import { type Character, type Talent, characters, talents } from '@remake/data'
import { type RNG, type WeightItem, pick, pickWeight } from '@remake/vitex'

export type UniqueChara = Omit<Character, 'id' | 'name'>
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
    return { property, talent: Array.from(picked) } satisfies UniqueChara
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
export function pullCharacter(
    opt: PullCharaOpt,
    tms: PullCharaTms,
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
