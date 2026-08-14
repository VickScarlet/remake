import { useCallback, useState } from 'react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useConfig, useProfile, useSetStep, useSetGameState, Step } from '.'
import { uniqueGenerate, startUnique, startChara } from '@remake/core'
import { pullChara, start, pick } from '@remake/core'
import type { BaseChara, PullCharaTms } from '@remake/core'
import type { Character } from '@remake/data'
import type { RNG } from '@remake/vitex'

export const uniqueAtom = atom<BaseChara | null>(null)
export const timesAtom = atom<PullCharaTms | undefined>(undefined)

export const useUnique = () => useAtomValue(uniqueAtom)
export const useUniqueInject = () => {
    const setUnique = useSetAtom(uniqueAtom)
    return useCallback((unique: BaseChara) => setUnique(unique), [setUnique])
}

export const useUniqueGenerator = () => {
    const { config } = useConfig().unique
    const [unique, setUnique] = useAtom(uniqueAtom)
    const generator = useCallback(
        (rng?: RNG) => {
            if (unique) return unique
            const generated = uniqueGenerate(config, rng)
            setUnique(generated)
            return generated
        },
        [config, unique, setUnique],
    )
    return [unique, generator] as const
}

export interface PullCharaResult {
    characters: Character['id'][]
    unique: boolean
}
export const useCharaPuller = (rng?: RNG) => {
    const { unique: u, chara } = useConfig()
    const [unique] = useAtom(uniqueAtom)
    const [times, setTimes] = useAtom(timesAtom)
    const [pulled, setPulled] = useState<PullCharaResult>({
        characters: pullChara(chara, times, rng).characters,
        unique: !!unique,
    })
    const puller = useCallback(() => {
        const result = pullChara(chara, times, rng)
        setTimes(result.times)
        setPulled({
            characters: result.characters,
            unique: !!unique || result.times?.times >= u.limit * chara.count,
        })
    }, [u, chara, unique, times, setTimes, rng])
    return [pulled, puller] as const
}

export type PickUnique = { type: 'unique'; id?: never }
export type PickCharacter = {
    type: 'character'
    id: Character['id']
}
export type CharaPick = PickUnique | PickCharacter
export const useCharaPicker = () => {
    const [picked, setPicked] = useState<CharaPick | null>(null)
    const chara = useCallback(
        (id: Character['id']) => setPicked({ type: 'character', id }),
        [setPicked],
    )
    const uni = useCallback(() => setPicked({ type: 'unique' }), [setPicked])
    return [picked, { chara, unique: uni }] as const
}

export const useCharaStart = () => {
    const { spirit } = useConfig()
    const [profile] = useProfile()
    const unique = useAtomValue(uniqueAtom)
    const setStep = useSetStep()
    const setState = useSetGameState()
    return useCallback(
        (picked: CharaPick, rng?: RNG) => {
            let result
            if (picked.type === 'unique') {
                if (!unique)
                    throw new Error('Unique character not generated yet')
                result = startUnique(unique, spirit)
            } else {
                result = startChara(picked.id, spirit)
            }
            const { talents, additionalPoints } = pick(result.talents, rng)
            // TODO: additionalPoints
            const { state, achievements } = start(
                profile,
                result.allocation,
                talents.talents,
            )
            setState(state)
            setStep(Step.Play)
            return achievements
        },
        [spirit, profile, unique, setStep, setState],
    )
}

export { charaPropToBaseAlloc as convertProps } from '@remake/core'
