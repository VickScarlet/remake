import { useCallback } from 'react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useConfig, useReplaced } from '.'
import type { Allocation } from '@remake/core'
import { keys, shuffle, random as frandom, type RNG } from '@remake/vitex'

export type UserAllocation = Omit<Allocation, 'spirit'>
const init: UserAllocation = {
    charm: 0,
    intelligence: 0,
    strength: 0,
    money: 0,
}
export const allocAtom = atom<UserAllocation>({ ...init })

const alloced = (alloc: UserAllocation) =>
    Object.values(alloc).reduce((a, b) => a + b, 0)

export const useAllocReset = () => {
    const setAlloc = useSetAtom(allocAtom)
    return useCallback(() => setAlloc({ ...init }), [setAlloc])
}
export const useAlloc = () => useAtomValue(allocAtom)
export const usePoints = () => {
    const { points } = useConfig()
    const { additionalPoints } = useReplaced()
    return Math.max(points + additionalPoints.points, 0)
}

export const useLeftPoints = () => {
    const points = usePoints()
    const alloc = useAtomValue(allocAtom)
    return points - alloced(alloc)
}

export const useAllocator = () => {
    const { allocate } = useConfig()
    const total = usePoints()
    const [alloc, setAlloc] = useAtom(allocAtom)
    const allocator = useCallback(
        (key: keyof UserAllocation, value: number) => {
            setAlloc(prev => {
                const left = total - alloced(prev) + prev[key]
                const max = Math.min(left, allocate)
                const final = Math.max(Math.min(max, value), 0)
                if (prev[key] === final) return prev
                return { ...prev, [key]: final }
            })
        },
        [allocate, total],
    )
    return [alloc, allocator] as const
}

export const usePointRandomizer = () => {
    const { allocate } = useConfig()
    const total = usePoints()
    const setAlloc = useSetAtom(allocAtom)
    return useCallback(
        (rng?: RNG) => {
            const suffled = shuffle(keys(init), rng)
            let left = total
            const alloc = { ...init }
            while (suffled.length) {
                const key = suffled.pop()!
                const max = Math.min(allocate, left)
                const min = Math.max(0, left - suffled.length * allocate)
                const value = frandom(max, min, rng)
                alloc[key] = value
                left -= value
            }
            setAlloc(alloc)
        },
        [allocate, total],
    )
}

export const useAllocSubmit = () => {}
