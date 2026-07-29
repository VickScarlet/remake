/** 天赋稀有度 */
export type TalentGrade = 0 | 1 | 2 | 3

/** 天赋效果 */
export type TalentEffect = {
    /** 额外家境 */
    readonly MNY?: number
    /** 额外体质 */
    readonly STR?: number
    /** 额外智力 */
    readonly INT?: number
    /** 额外颜值 */
    readonly CHR?: number
    /** 额外快乐 */
    readonly SPR?: number
    /** 额外随机属性 */
    readonly RND?: number
}

/** 权重天赋 */
export type TalentWithWeight = [number, number]

/** 天赋盲盒 */
export type TalentReplacement = {
    /** 指定列表盲盒 */
    talent?: TalentWithWeight[]
    /** 指定稀有度盲盒 */
    grade?: TalentGrade[]
}

/** 天赋 */
export type Talent = {
    /** 序号 */
    readonly id: number
    /** 天赋名 */
    readonly name: string
    /** 天赋描述 */
    readonly description: string
    /** 天赋触发条件 */
    readonly condition?: string
    /** 天赋稀有度 */
    readonly grade: TalentGrade
    /** 天赋效果 */
    readonly effect?: TalentEffect
    /** 专属天赋 */
    readonly exclusive?: boolean
    /** 初始可用属性点调整 */
    readonly status?: number
    /** 互斥天赋 */
    readonly exclude?: number[]
    /** 天赋盲盒 */
    readonly replacement?: TalentReplacement
}
// @vt-types-end

export const transformers = {
    id: Number,
    grade: (val: any) => Number(val) || 0,
    exclude: (val: (string | number)[] | undefined) => val?.map(Number),
    effect: (val: any) => {
        if (!val) return
        for (const key in val) {
            val[key] = Number(val[key])
            if (isNaN(val[key]))
                throw new Error(`Invalid property value: ${key}=${val[key]}`)
        }
        return val
    },
    replacement: (val: any) => {
        if (!val) return
        if (val.talent)
            val.talent = val.talent.map((v: string | number) => {
                if (typeof v === 'number') return [v, 1]
                const [talent, weight] = v.split('*').map(Number)
                if (talent == null || isNaN(talent))
                    throw new Error(`Invalid talent value: ${v}`)
                if (weight != null && isNaN(weight))
                    throw new Error(
                        `Invalid weight value: ${v} ${JSON.stringify({ talent, weight })}`,
                    )
                return [talent, weight ?? 1]
            })
        if (val.grade) val.grade = val.grade.map(Number)
        return val
    },
}
