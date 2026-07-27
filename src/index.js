import App from './app.js'
import Life from './modules/life.js'

if (!globalThis.$channel) globalThis.$channel = {}
globalThis.$$eventMap = new Map()
globalThis.$$event = (tag, data) => {
    const listener = $$eventMap.get(tag)
    if (listener) listener.forEach(fn => fn(data))
}
globalThis.$$on = (tag, fn) => {
    let listener = $$eventMap.get(tag)
    if (!listener) {
        listener = new Set()
        $$eventMap.set(tag, listener)
    }
    listener.add(fn)
}
globalThis.$$off = (tag, fn) => {
    const listener = $$eventMap.get(tag)
    if (listener) listener.delete(fn)
}

globalThis.$$copy = async text => {
    const result = await navigator.permissions.query({ name: 'clipboard-write' })
    if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard.writeText(text)
        return true
    }
    return false
}

globalThis.$$read = async () => {
    const result = await navigator.permissions.query({ name: 'clipboard-read' })
    if (result.state == 'granted' || result.state == 'prompt') {
        return await navigator.clipboard.readText()
    }
    return null
}

const core = new Life()
const game = new App()
globalThis.core = core
globalThis.game = game

const query = {}
location.search
    .substring(1)
    .split('&')
    .forEach(item => {
        const parts = item.split('=')
        query[parts[0]] = parts[1]
    })

core.config({
    celebrityLimit: 10,
    defaultPropertyPoints: 20, // default number of points for a property
    talentSelectLimit: 3, // max number of talents that can be selected
    propertyAllocateLimit: [0, 10], // scoop of properties that can be allocated,
    defaultPropertys: { SPR: 5 }, // default properties
    talentConfig: {
        // config for talent
        talentPullCount: 10, // number of talents to pull from the talent pool
        talentRate: { 1: 100, 2: 10, 3: 1, total: 1000 }, // rate of talent pull
        additions: {
            TMS: [
                [ 10, { 2: 1 }],
                [ 30, { 2: 2 }],
                [ 50, { 2: 3 }],
                [ 70, { 2: 4 }],
                [100, { 2: 5 }],
            ],
            CACHV: [
                [ 10, { 2: 1 }],
                [ 30, { 2: 2 }],
                [ 50, { 2: 3 }],
                [ 70, { 2: 4 }],
                [100, { 2: 5 }],
            ],
        },
    },
    propertyConfig: { // config for property
        judge: {
            // type: [min, grade, judge]
            RTLT: [
                [0,   0],
                [0.3, 1],
                [0.6, 2],
                [0.9, 3],
            ],
            REVT: [
                [0,   0],
                [0.2, 1],
                [0.4, 2],
                [0.6, 3],
            ],
            TMS: [
                [  0, 0, 'UI_Remake_Times_Judge_Level_0'],
                [ 10, 1, 'UI_Remake_Times_Judge_Level_1'],
                [ 30, 1, 'UI_Remake_Times_Judge_Level_2'],
                [ 50, 2, 'UI_Remake_Times_Judge_Level_3'],
                [ 70, 2, 'UI_Remake_Times_Judge_Level_4'],
                [100, 3, 'UI_Remake_Times_Judge_Level_5'],
            ],
            CACHV: [
                [  0, 0, 'UI_Achievement_Count_Judge_Level_0'],
                [ 10, 1, 'UI_Achievement_Count_Judge_Level_1'],
                [ 30, 1, 'UI_Achievement_Count_Judge_Level_2'],
                [ 50, 2, 'UI_Achievement_Count_Judge_Level_3'],
                [ 70, 2, 'UI_Achievement_Count_Judge_Level_4'],
                [100, 3, 'UI_Achievement_Count_Judge_Level_5'],
            ],
            HCHR: [
                [ 0, 0, 'UI_Judge_Level_0'],
                [ 1, 0, 'UI_Judge_Level_1'],
                [ 2, 0, 'UI_Judge_Level_2'],
                [ 4, 0, 'UI_Judge_Level_3'],
                [ 7, 1, 'UI_Judge_Level_4'],
                [ 9, 2, 'UI_Judge_Level_5'],
                [11, 3, 'UI_Judge_Level_6'],
            ],
            HMNY: [
                [ 0, 0, 'UI_Judge_Level_0'],
                [ 1, 0, 'UI_Judge_Level_1'],
                [ 2, 0, 'UI_Judge_Level_2'],
                [ 4, 0, 'UI_Judge_Level_3'],
                [ 7, 1, 'UI_Judge_Level_4'],
                [ 9, 2, 'UI_Judge_Level_5'],
                [11, 3, 'UI_Judge_Level_6'],
            ],
            HSPR: [
                [ 0, 0, 'UI_Spirit_Judge_Level_0'],
                [ 1, 0, 'UI_Spirit_Judge_Level_1'],
                [ 2, 0, 'UI_Spirit_Judge_Level_2'],
                [ 4, 0, 'UI_Spirit_Judge_Level_3'],
                [ 7, 1, 'UI_Spirit_Judge_Level_4'],
                [ 9, 2, 'UI_Spirit_Judge_Level_5'],
                [11, 3, 'UI_Spirit_Judge_Level_6'],
            ],
            HINT: [
                [  0, 0, 'UI_Judge_Level_0'],
                [  1, 0, 'UI_Judge_Level_1'],
                [  2, 0, 'UI_Judge_Level_2'],
                [  4, 0, 'UI_Judge_Level_3'],
                [  7, 1, 'UI_Judge_Level_4'],
                [  9, 2, 'UI_Judge_Level_5'],
                [ 11, 3, 'UI_Judge_Level_6'],
                [ 21, 3, 'UI_Intelligence_Judge_Level_7'],
                [131, 3, 'UI_Intelligence_Judge_Level_8'],
                [501, 3, 'UI_Intelligence_Judge_Level_9'],
            ],
            HSTR: [
                [   0, 0, 'UI_Judge_Level_0'],
                [   1, 0, 'UI_Judge_Level_1'],
                [   2, 0, 'UI_Judge_Level_2'],
                [   4, 0, 'UI_Judge_Level_3'],
                [   7, 1, 'UI_Judge_Level_4'],
                [   9, 2, 'UI_Judge_Level_5'],
                [  11, 3, 'UI_Judge_Level_6'],
                [  21, 3, 'UI_Strength_Judge_Level_7'],
                [ 101, 3, 'UI_Strength_Judge_Level_8'],
                [ 401, 3, 'UI_Strength_Judge_Level_9'],
                [1001, 3, 'UI_Strength_Judge_Level_10'],
                [2001, 3, 'UI_Strength_Judge_Level_11'],
            ],
            HAGE: [
                [  0, 0, 'UI_AGE_Judge_Level_0'],
                [  1, 0, 'UI_AGE_Judge_Level_1'],
                [ 10, 0, 'UI_AGE_Judge_Level_2'],
                [ 18, 0, 'UI_AGE_Judge_Level_3'],
                [ 40, 0, 'UI_AGE_Judge_Level_4'],
                [ 60, 1, 'UI_AGE_Judge_Level_5'],
                [ 70, 1, 'UI_AGE_Judge_Level_6'],
                [ 80, 2, 'UI_AGE_Judge_Level_7'],
                [ 90, 2, 'UI_AGE_Judge_Level_8'],
                [ 95, 3, 'UI_AGE_Judge_Level_9'],
                [100, 3, 'UI_AGE_Judge_Level_10'],
                [500, 3, 'UI_AGE_Judge_Level_11'],
            ],
            SUM: [
                [  0, 0, 'UI_Judge_Level_0'],
                [ 41, 0, 'UI_Judge_Level_1'],
                [ 50, 0, 'UI_Judge_Level_2'],
                [ 60, 0, 'UI_Judge_Level_3'],
                [ 80, 1, 'UI_Judge_Level_4'],
                [100, 2, 'UI_Judge_Level_5'],
                [110, 3, 'UI_Judge_Level_6'],
                [120, 3, 'UI_Judge_Level_7'],
            ],
        },
    },
    characterConfig: { // config for character
        characterPullCount: 3,
        rateableKnife: 10,
        propertyWeight: [
            [ 0, 1],
            [ 1, 2],
            [ 2, 3],
            [ 3, 4],
            [ 4, 5],
            [ 5, 6],
            [ 6, 5],
            [ 7, 4],
            [ 8, 3],
            [ 9, 2],
            [10, 1],
        ],
        talentWeight: [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 2],
            [5, 1],
        ],
    },
})
game.start(query, globalThis.$channel.features ?? [])
