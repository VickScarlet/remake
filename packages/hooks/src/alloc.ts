import { useCallback } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useConfig, useReplaced, useIsClassic } from '.'
import type { Allocation } from '@remake/core'
import { keys, shuffle, zoneFit, random } from '@remake/vitex'
import type { RNG } from '@remake/vitex'

export type UserAllocation = Omit<Allocation, 'spirit'>
const init: UserAllocation = {
    charm: 0,
    intelligence: 0,
    strength: 0,
    money: 0,
}
export const baseAllocAtom = atom<UserAllocation>({ ...init })
export const allocAtom = atom<UserAllocation>({ ...init })

const alloced = (alloc: UserAllocation) =>
    Object.values(alloc).reduce((a, b) => a + b, 0)

export const useAllocReset = () => {
    const setBaseAlloc = useSetAtom(baseAllocAtom)
    const setAlloc = useSetAtom(allocAtom)
    return useCallback(() => {
        setBaseAlloc({ ...init })
        setAlloc({ ...init })
    }, [setBaseAlloc, setAlloc])
}
export const useBaseAlloc = () => useAtomValue(baseAllocAtom)
export const useAlloc = () => {
    const base = useAtomValue(baseAllocAtom)
    const alloc = useAtomValue(allocAtom)
    const final = {
        charm: base.charm + alloc.charm,
        intelligence: base.intelligence + alloc.intelligence,
        strength: base.strength + alloc.strength,
        money: base.money + alloc.money,
    }
    return { base, alloc, final }
}
export const usePoints = () => {
    const isClassic = useIsClassic()
    const { additionalPoints } = useReplaced()
    const additional = additionalPoints.points
    if (!isClassic) {
        const base = useAtomValue(baseAllocAtom)
        return { base: alloced(base), total: additional, additional }
    }
    const { points } = useConfig()
    return { base: points, total: points + additional, additional }
}

export const useLeftPoints = () => {
    const points = usePoints()
    const alloc = useAtomValue(allocAtom)
    const ca = alloced(alloc)
    const left = points.total - ca
    return { ...points, left, alloced: ca }
}

export const useAllocBefore = () => {
    const { allocate } = useConfig()
    const { total } = usePoints()
    const isClassic = useIsClassic()
    const isPositive = total >= 0
    const limit = isClassic
        ? allocate
        : Math.min(Math.ceil(Math.abs(total) / 2), allocate) *
          (isPositive ? 1 : -1)
    return { total, limit, isPositive, isClassic }
}

export const useAllocator = () => {
    const { total, limit } = useAllocBefore()
    const alloc = useAlloc()
    const setAlloc = useSetAtom(allocAtom)
    const allocator = useCallback(
        (key: keyof UserAllocation, value: number) => {
            setAlloc(prev => {
                const last = prev[key]
                const left = total - alloced(prev) + last
                const max = zoneFit(left, [0, limit])
                const final = zoneFit(value, [0, max])
                if (last === final) return prev
                return { ...prev, [key]: final }
            })
        },
        [limit, total, setAlloc],
    )
    return [alloc, allocator] as const
}

export const usePointRandomizer = () => {
    const { total, limit } = useAllocBefore()
    const setAlloc = useSetAtom(allocAtom)
    return useCallback(
        (rng?: RNG) => {
            const suffled = shuffle(keys(init), rng)
            let left = total
            const alloc = { ...init }
            while (suffled.length) {
                const key = suffled.pop()!
                const n = suffled.length
                const max = zoneFit(limit, [0, left])
                const min = zoneFit(left - n * limit, [0, limit])
                const value = random(max, min, rng)
                alloc[key] = value
                left -= value
            }
            setAlloc(alloc)
        },
        [total, limit, setAlloc],
    )
}

export const useAllocSubmit = () => {}
