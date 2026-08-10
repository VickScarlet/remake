import { useCallback } from 'react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useConfig } from './config'
import { useReplaced } from './talent'
import type { Allocation } from '@remake/core'
import type { RNG } from '@remake/vitex'
import { keys, shuffle, random as frandom } from '@remake/vitex'

const init: Allocation = { charm: 0, intelligence: 0, strength: 0, money: 0 }
const allocAtom = atom<Allocation>(init)

const alloced = (alloc: Allocation) =>
    Object.values(alloc).reduce((a, b) => a + b, 0)

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
        (key: keyof Allocation, value: number) => {
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
