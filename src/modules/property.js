class Property {
    constructor(system) {
        this.#system = system
    }

    TYPES = {
        // 本局
        AGE: 'AGE', // 年龄 age AGE
        CHR: 'CHR', // 颜值 charm CHR
        INT: 'INT', // 智力 intelligence INT
        STR: 'STR', // 体质 strength STR
        MNY: 'MNY', // 家境 money MNY
        SPR: 'SPR', // 快乐 spirit SPR
        LIF: 'LIF', // 生命 life LIFE
        TLT: 'TLT', // 天赋 talent TLT
        EVT: 'EVT', // 事件 event EVT
        TMS: 'TMS', // 次数 times TMS

        // Auto calc
        LAGE: 'LAGE', // 最低年龄 Low Age
        HAGE: 'HAGE', // 最高年龄 High Age
        LCHR: 'LCHR', // 最低颜值 Low Charm
        HCHR: 'HCHR', // 最高颜值 High Charm
        LINT: 'LINT', // 最低智力 Low Intelligence
        HINT: 'HINT', // 最高智力 High Intelligence
        LSTR: 'LSTR', // 最低体质 Low Strength
        HSTR: 'HSTR', // 最高体质 High Strength
        LMNY: 'LMNY', // 最低家境 Low Money
        HMNY: 'HMNY', // 最高家境 High Money
        LSPR: 'LSPR', // 最低快乐 Low Spirit
        HSPR: 'HSPR', // 最高快乐 High Spirit

        SUM: 'SUM', // 总评 summary SUM

        EXT: 'EXT', // 继承天赋

        // 总计
        // Achievement Total
        ATLT: 'ATLT', // 拥有过的天赋 Achieve Talent
        AEVT: 'AEVT', // 触发过的事件 Achieve Event
        ACHV: 'ACHV', // 达成的成就 Achievement

        CTLT: 'CTLT', // 天赋选择数 Count Talent
        CEVT: 'CEVT', // 事件收集数 Count Event
        CACHV: 'CACHV', // 成就达成数 Count Achievement

        // 总数
        TTLT: 'TTLT', // 总天赋数 Total Talent
        TEVT: 'TEVT', // 总事件数 Total Event
        TACHV: 'TACHV', // 总成就数 Total Achievement

        // 比率
        REVT: 'REVT', // 事件收集率 Rate Event
        RTLT: 'RTLT', // 天赋选择率 Rate Talent
        RACHV: 'RACHV', // 成就达成率 Rate Achievement

        // SPECIAL
        RDM: 'RDM', // 随机属性 random RDM
    }

    // 特殊类型
    SPECIAL = {
        RDM: [
            // 随机属性 random RDM
            this.TYPES.CHR,
            this.TYPES.INT,
            this.TYPES.STR,
            this.TYPES.MNY,
            this.TYPES.SPR,
        ],
    }

    #system
    #ageData
    #data = {}
    #total
    #judge
    #sync = new Set()

    get #util() {
        return this.#system.function(this.#system.Function.UTIL)
    }

    initial({ age, total }) {
        this.#ageData = age
        for (const a in age) {
            let { event, talent } = age[a]
            if (!Array.isArray(event)) event = event?.split(',') || []

            event = event.map(v => {
                const value = `${v}`.split('*').map(Number)
                if (value.length == 1) value.push(1)
                return value
            })

            if (!Array.isArray(talent)) talent = talent?.split(',') || []
            talent = talent.map(Number)
            age[a] = { event, talent }
        }
        this.#total = total
    }

    config({ judge = {} }) {
        this.#judge = judge
    }

    restart(data) {
        this.#data = {
            [this.TYPES.AGE]: -1,

            [this.TYPES.CHR]: 0,
            [this.TYPES.INT]: 0,
            [this.TYPES.STR]: 0,
            [this.TYPES.MNY]: 0,
            [this.TYPES.SPR]: 0,

            [this.TYPES.LIF]: 1,

            [this.TYPES.TLT]: [],
            [this.TYPES.EVT]: [],

            [this.TYPES.LAGE]: Infinity,
            [this.TYPES.LCHR]: Infinity,
            [this.TYPES.LINT]: Infinity,
            [this.TYPES.LSTR]: Infinity,
            [this.TYPES.LSPR]: Infinity,
            [this.TYPES.LMNY]: Infinity,

            [this.TYPES.HAGE]: -Infinity,
            [this.TYPES.HCHR]: -Infinity,
            [this.TYPES.HINT]: -Infinity,
            [this.TYPES.HSTR]: -Infinity,
            [this.TYPES.HMNY]: -Infinity,
            [this.TYPES.HSPR]: -Infinity,
        }
        for (const key in data) this.change(key, data[key])
    }

    restartLastStep() {
        this.#data[this.TYPES.LAGE] = this.get(this.TYPES.AGE)
        this.#data[this.TYPES.LCHR] = this.get(this.TYPES.CHR)
        this.#data[this.TYPES.LINT] = this.get(this.TYPES.INT)
        this.#data[this.TYPES.LSTR] = this.get(this.TYPES.STR)
        this.#data[this.TYPES.LSPR] = this.get(this.TYPES.SPR)
        this.#data[this.TYPES.LMNY] = this.get(this.TYPES.MNY)
        this.#data[this.TYPES.HAGE] = this.get(this.TYPES.AGE)
        this.#data[this.TYPES.HCHR] = this.get(this.TYPES.CHR)
        this.#data[this.TYPES.HINT] = this.get(this.TYPES.INT)
        this.#data[this.TYPES.HSTR] = this.get(this.TYPES.STR)
        this.#data[this.TYPES.HMNY] = this.get(this.TYPES.MNY)
        this.#data[this.TYPES.HSPR] = this.get(this.TYPES.SPR)
    }

    get(prop) {
        const util = this.#util
        switch (prop) {
            case this.TYPES.AGE:
            case this.TYPES.CHR:
            case this.TYPES.INT:
            case this.TYPES.STR:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                return util.clone(this.#data[prop])
            case this.TYPES.LAGE:
            case this.TYPES.LCHR:
            case this.TYPES.LINT:
            case this.TYPES.LSTR:
            case this.TYPES.LMNY:
            case this.TYPES.LSPR:
                return util.min(this.#data[prop], this.get(this.fallback(prop)))
            case this.TYPES.HAGE:
            case this.TYPES.HCHR:
            case this.TYPES.HINT:
            case this.TYPES.HSTR:
            case this.TYPES.HMNY:
            case this.TYPES.HSPR:
                return util.max(this.#data[prop], this.get(this.fallback(prop)))
            case this.TYPES.SUM: {
                const HAGE = this.get(this.TYPES.HAGE)
                const HCHR = this.get(this.TYPES.HCHR)
                const HINT = this.get(this.TYPES.HINT)
                const HSTR = this.get(this.TYPES.HSTR)
                const HMNY = this.get(this.TYPES.HMNY)
                const HSPR = this.get(this.TYPES.HSPR)
                return Math.floor(util.sum(HCHR, HINT, HSTR, HMNY, HSPR) * 2 + HAGE / 2)
            }
            case this.TYPES.TMS:
                return this.lsget('times') || 0
            case this.TYPES.EXT:
                return this.lsget('extendTalent') || null
            case this.TYPES.ATLT:
            case this.TYPES.AEVT:
            case this.TYPES.ACHV:
                return this.lsget(prop) || []
            case this.TYPES.CTLT:
            case this.TYPES.CEVT:
            case this.TYPES.CACHV:
                return this.get(this.fallback(prop)).length
            case this.TYPES.TTLT:
            case this.TYPES.TEVT:
            case this.TYPES.TACHV:
                return this.#total[prop]
            case this.TYPES.RTLT:
            case this.TYPES.REVT:
            case this.TYPES.RACHV: {
                const fb = this.fallback(prop)
                return this.get(fb[0]) / this.get(fb[1])
            }
            default: return 0
        }
    }

    fallback(prop) {
        switch (prop) {
            case this.TYPES.LAGE:
            case this.TYPES.HAGE: return this.TYPES.AGE
            case this.TYPES.LCHR:
            case this.TYPES.HCHR: return this.TYPES.CHR
            case this.TYPES.LINT:
            case this.TYPES.HINT: return this.TYPES.INT
            case this.TYPES.LSTR:
            case this.TYPES.HSTR: return this.TYPES.STR
            case this.TYPES.LMNY:
            case this.TYPES.HMNY: return this.TYPES.MNY
            case this.TYPES.LSPR:
            case this.TYPES.HSPR: return this.TYPES.SPR
            case this.TYPES.CTLT: return this.TYPES.ATLT
            case this.TYPES.CEVT: return this.TYPES.AEVT
            case this.TYPES.CACHV: return this.TYPES.ACHV
            case this.TYPES.LIF: return this.TYPES.LIF
            case this.TYPES.RTLT: return [this.TYPES.CTLT, this.TYPES.TTLT]
            case this.TYPES.REVT: return [this.TYPES.CEVT, this.TYPES.TEVT]
            case this.TYPES.RACHV: return [this.TYPES.CACHV, this.TYPES.TACHV]
            default: return
        }
    }

    set(prop, value) {
        switch (prop) {
            case this.TYPES.AGE:
            case this.TYPES.CHR:
            case this.TYPES.INT:
            case this.TYPES.STR:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                this.#data[prop] = this.#system.clone(value)
                this.hl(prop, this.#data[prop])
                this.achieve(prop, value)
                return
            case this.TYPES.TMS:
                this.lsset('times', Number.parseInt(value) || 0)
                return
            case this.TYPES.EXT:
                this.lsset('extendTalent', value)
                return
            default: return
        }
    }

    getPropertys() {
        return this.#system.clone({
            [this.TYPES.AGE]: this.get(this.TYPES.AGE),
            [this.TYPES.CHR]: this.get(this.TYPES.CHR),
            [this.TYPES.INT]: this.get(this.TYPES.INT),
            [this.TYPES.STR]: this.get(this.TYPES.STR),
            [this.TYPES.MNY]: this.get(this.TYPES.MNY),
            [this.TYPES.SPR]: this.get(this.TYPES.SPR),
        })
    }

    change(prop, value) {
        if (Array.isArray(value)) {
            for (const v of value) this.change(prop, Number(v))
            return
        }
        switch (prop) {
            case this.TYPES.AGE:
            case this.TYPES.CHR:
            case this.TYPES.INT:
            case this.TYPES.STR:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
                this.#data[prop] += Number(value)
                this.hl(prop, this.#data[prop])
                return
            case this.TYPES.TLT:
            case this.TYPES.EVT: {
                const v = this.#data[prop]
                if (value < 0) {
                    const index = v.indexOf(value)
                    if (index != -1) v.splice(index, 1)
                }
                if (!v.includes(value)) v.push(value)
                this.achieve(prop, value)
                return
            }
            case this.TYPES.TMS:
                this.set(prop, this.get(prop) + Number.parseInt(value))
                return
            default: return
        }
    }

    hookSpecial(prop) {
        if (prop === this.TYPES.RDM)
            return this.#util.listRandom(this.SPECIAL.RDM)
        return prop
    }

    effect(effects) {
        for (let prop in effects)
            this.change(this.hookSpecial(prop), Number(effects[prop]))
    }

    judge(prop) {
        const value = this.get(prop)

        const d = this.#judge[prop]
        let length = d.length

        const progress = () => Math.max(Math.min(value, 10), 0) / 10

        while (length--) {
            const [min, grade, judge] = d[length]
            if (!length || min == void 0 || value >= min)
                return { prop, value, judge, grade, progress: progress() }
        }
    }

    isEnd() {
        return this.get(this.TYPES.LIF) < 1
    }

    ageNext() {
        this.change(this.TYPES.AGE, 1)
        const age = this.get(this.TYPES.AGE)
        const { event, talent } = this.getAgeData(age)
        return { age, event, talent }
    }

    getAgeData(age) {
        return this.#system.clone(this.#ageData[age])
    }

    hl(prop, value) {
        let keys
        switch (prop) {
            case this.TYPES.AGE: keys = [this.TYPES.LAGE, this.TYPES.HAGE]; break
            case this.TYPES.CHR: keys = [this.TYPES.LCHR, this.TYPES.HCHR]; break
            case this.TYPES.INT: keys = [this.TYPES.LINT, this.TYPES.HINT]; break
            case this.TYPES.STR: keys = [this.TYPES.LSTR, this.TYPES.HSTR]; break
            case this.TYPES.MNY: keys = [this.TYPES.LMNY, this.TYPES.HMNY]; break
            case this.TYPES.SPR: keys = [this.TYPES.LSPR, this.TYPES.HSPR]; break
            default: return
        }
        const [l, h] = keys
        this.#data[l] = this.#util.min(this.#data[l], value)
        this.#data[h] = this.#util.max(this.#data[h], value)
    }

    achieve(prop, newData) {
        let key
        switch (prop) {
            case this.TYPES.ACHV: {
                const lastData = this.lsget(prop)
                this.lsset(
                    prop,
                    (lastData || []).concat([[newData, Date.now()]]),
                )
                return
            }
            case this.TYPES.TLT: key = this.TYPES.ATLT; break
            case this.TYPES.EVT: key = this.TYPES.AEVT; break
            default: return
        }
        const lastData = this.lsget(key) || []
        this.lsset(key, Array.from(new Set(lastData.concat(newData || []).flat())))
    }

    #syncMerge(key, cloud) {
        const local = this.lsget(key)
        if (!cloud) return local
        if (!local) {
            localStorage.setItem(key, JSON.stringify(cloud))
            return cloud
        }
        if (Array.isArray(cloud)) {
            const merged = Array.from(new Set(cloud.concat(local)))
            localStorage.setItem(key, JSON.stringify(merged))
            return merged
        }
        if (typeof cloud === 'number') {
            const merged = Math.max(cloud, local)
            localStorage.setItem(key, JSON.stringify(merged))
            return merged
        }
        return local
    }

    sync(cloudData) {
        if (!cloudData) return this.#sync.size > 0
        cloudData = JSON.parse(cloudData)
        const syncData = Object.fromEntries(
            Array.from(
                this.#sync.union(new Set(Object.keys(cloudData))),
                key => [key, this.#syncMerge(key, cloudData[key])],
            ),
        )
        this.#sync.clear()
        return JSON.stringify(syncData)
    }

    lsget(key) {
        const data = localStorage.getItem(key)
        if (data === null || data === 'undefined') return
        return JSON.parse(data)
    }

    lsset(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
        this.#sync.add(key)
    }
}

export default Property
