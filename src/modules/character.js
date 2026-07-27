class Character {
    constructor(system) {
        this.#system = system
    }

    #system
    #characters
    #characterPullCount
    #rateableKnife
    #rate
    #pipe = []
    #uniqueWaTaShi
    #propertyWeight
    #talentWeight

    initial({ characters }) {
        this.#characters = characters
        const uniqueWaTaShi = localStorage.getItem('uniqueWaTaShi')
        if (uniqueWaTaShi != null || uniqueWaTaShi != 'undefined')
            this.#uniqueWaTaShi = JSON.parse(uniqueWaTaShi)
        return this.count
    }

    get count() {
        return Object.keys(this.#characters).length
    }

    config({
        characterPullCount = 3,
        rateableKnife = 10,
        propertyWeight,
        talentWeight,
    } = {}) {
        this.#characterPullCount = characterPullCount
        this.#rateableKnife = rateableKnife
        this.#propertyWeight = propertyWeight
        this.#talentWeight = talentWeight
    }

    sync(data) {
        if (!data) return JSON.stringify(this.#uniqueWaTaShi)
        localStorage.setItem('uniqueWaTaShi', data)
        this.#uniqueWaTaShi = JSON.parse(data)
    }

    get #unique() {
        if (this.#uniqueWaTaShi) {
            return this.#system.clone(this.#uniqueWaTaShi)
        }

        const now = Date.now()
        this.#pipe.push(now)
        if (this.#pipe.length < 10) return null
        const time = this.#pipe.shift()
        if (now - time > 10000) return null
        return { unique: true, generate: false }
    }

    set #unique(data) {
        this.#uniqueWaTaShi = this.#system.clone(data)
        this.#uniqueWaTaShi.unique = true
        this.#uniqueWaTaShi.generate = true
        const json = JSON.stringify(this.#uniqueWaTaShi)
        localStorage.setItem('uniqueWaTaShi', json)
    }

    get #weightRandom() {
        return this.#system.function(this.#system.Function.UTIL).weightRandom
    }

    generateUnique() {
        if (this.#uniqueWaTaShi) return this.#unique
        const weightRandom = this.#weightRandom
        const { CHR, INT, STR, MNY } = this.#system.PropertyTypes

        this.#unique = {
            property: {
                [CHR]: weightRandom(this.#propertyWeight),
                [INT]: weightRandom(this.#propertyWeight),
                [STR]: weightRandom(this.#propertyWeight),
                [MNY]: weightRandom(this.#propertyWeight),
            },
            talent: this.#system
                .request(this.#system.Module.TALENT)
                .random(weightRandom(this.#talentWeight)),
        }

        return this.#unique
    }

    random() {
        return {
            unique: this.#unique,
            normal: this.#rateable(),
        }
    }

    #rateable() {
        if (!this.#rate) {
            this.#rate = {}
            for (const id in this.#characters) {
                this.#rate[id] = 1
            }
        }

        const r = []
        const weightRandom = this.#weightRandom
        new Array(this.#characterPullCount).fill(0).forEach(() => {
            r.push(
                weightRandom(
                    Object.keys(this.#rate)
                        .filter(id => !r.includes(id))
                        .map(id => [id, this.#rate[id]]),
                ),
            )
        })

        let min = Infinity
        for (const id in this.#rate) {
            if (r.includes(id)) {
                min = Math.min(min, this.#rate[id])
                continue
            }
            min = Math.min(min, ++this.#rate[id])
        }
        if (min > this.#rateableKnife) {
            for (const id in this.#rate) {
                this.#rate[id] -= this.#rateableKnife
            }
        }
        return r.map(id => this.#system.clone(this.#characters[id]))
    }
}

export default Character
