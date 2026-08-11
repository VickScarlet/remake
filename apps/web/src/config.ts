import type { Config } from '@remake/hooks'
import type { TalentGrade } from '@remake/data/talent'

function gadm(grade: TalentGrade, value: number) {
    return new Map([[grade, { mode: 'multiply', value }]])
}

export const AdditonMap = {
    times: [
        { value: 0, additions: new Map() },
        { value: 10, additions: gadm(2, 2) },
        { value: 30, additions: gadm(2, 3) },
        { value: 50, additions: gadm(2, 4) },
        { value: 70, additions: gadm(2, 5) },
        { value: 100, additions: gadm(2, 6) },
    ],
    achievements: [
        { value: 0, additions: new Map() },
        { value: 10, additions: gadm(3, 2) },
        { value: 30, additions: gadm(3, 3) },
        { value: 50, additions: gadm(3, 4) },
        { value: 70, additions: gadm(3, 5) },
        { value: 100, additions: gadm(3, 6) },
    ],
}

export const BasePoints = 20

export const config: Config = {
    mode: 10,
    pick: 3,
    points: BasePoints,
    allocate: 10,
    spirit: 5,
    pull: {
        count: 10,
        rate: {
            base: new Map([
                [0, 889],
                [1, 100],
                [2, 10],
                [3, 1],
            ]),
            additions: {
                times: value => {
                    for (const item of AdditonMap.times.reverse())
                        if (value >= item.value) return item.additions
                    return new Map()
                },
                achievements: value => {
                    const size = value.size
                    for (const item of AdditonMap.achievements.reverse())
                        if (size >= item.value) return item.additions
                    return new Map()
                },
            },
        },
    },
}

export default config
