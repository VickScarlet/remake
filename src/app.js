import './ui/laya.patch.js'
import './ui/runtime.js'
import './ui/pluginFunction.js'
import './ui/promisesLaya.js'
import './ui/layaUI.max.all.js'
import UIManager from './ui/uiManager.js'
import * as utils from './functions/util.js'

globalThis.UIManager = globalThis.UI = UIManager

globalThis.$_ = utils

globalThis.goto = async tag => {
    let url
    switch (tag) {
        case 'github': url = 'https://github.com/VickScarlet/lifeRestart'; break
        case 'discord': url = 'https://discord.gg/U3qrf49NMQ'; break
        case 'sponsor_afd': url = 'https://afdian.com/a/LifeRestart'; break
        case 'sponsor_ddf': url = 'https://dun.mianbaoduo.com/@vickscarlet'; break
    }
    try {
        if (Laya.Browser.onIOS) {
            window.location.href = url
        } else {
            window.open(url, '_blank')
        }
    } catch (error) {
        console.error(error)
    }
}
class App {
    name = 'lifeRestart'
    version = '2.1.0'
    constructor() {
        console.log(`${this.name} ${this.version}`)
    }

    #language
    static languages = {
        'zh-cn': 'zh-cn',
        'en-us': 'en-us',
    }

    #initLaya() {
        /**
         *...特殊的字符，如泰文，必须重新实现这个类
         */
        //class laya.webgl.text.CharSegment
        class CharSegment {
            _sourceStr = null
            constructor() {}
            textToSpit(str) {
                this._sourceStr = str
                const texLen = str.length
                let idx = -1
                this._words = []
                while (++idx < texLen) {
                    const character = str.charAt(idx)
                    const code = str.codePointAt(idx)
                    if (code >= 0xd800 && code <= 0xdbff) {
                        this._words.push(character + str.charAt(++idx))
                    } else {
                        this._words.push(character)
                    }
                }
            }
            getChar(i) {
                return this._words
            }
            getCharCode(i) {
                return this._words[i].codePointAt(0)
            }
            length() {
                return this._words.length
            }
        }
        Laya.class(CharSegment, 'laya.webgl.text.CharSegment')
        Laya.imps(CharSegment.prototype, { 'laya.webgl.text.ICharSegment': true })

        // Laya.init(1125, 2436, Laya.WebGL);
        Laya.Config.isAntialias = true
        Laya.init(...this.#fitScreen, Laya.WebGL)

        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER

        Laya.stage.scaleMode = 'showall'
        Laya.stage.bgColor = '#000000'
        window.onresize = () => Laya.stage.size(...this.#fitScreen)
    }

    get #fitScreen() {
        const designWidth = 1125
        const designHeight = 2436
        const maxWidth = (designHeight * 3) / 4
        const maxHeight = (designWidth * 24) / 9
        const designRatio = designWidth / designHeight

        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const screenRatio = screenWidth / screenHeight
        if (screenRatio > designRatio) {
            return [
                Math.min((screenWidth * designHeight) / screenHeight, maxWidth),
                designHeight,
            ]
        } else {
            return [
                designWidth,
                Math.min((screenHeight * designWidth) / screenWidth, maxHeight),
            ]
        }
    }

    async setLanguage(language) {
        return this.#setLanguage(language)
    }

    async #setLanguage(language) {
        switch (language) {
            case App.languages['en-us']:
            case App.languages['zh-cn']:
                this.#language = language
                break
            default:
                this.#language = App.languages['zh-cn']
                break
        }
        globalThis.$lang =
        Laya.Text.langPacks =
            (await import(`./i18n/${this.#language}.js`)).default
    }

    resigterEvent() {
        $$on('achievement', achievement => {
            $ui.popup(UI.popups.ACHIEVEMENT, { achievement })
        })
        $$on('message', ([message, ...args]) => {
            if (Array.isArray(message)) {
                message = message.map(([m, ...a]) => $_.format($lang[m], ...a)).join('\n')
            } else {
                message = $_.format($lang[message], ...args)
            }
            $ui.popup(UI.popups.MESSAGE, { message })
        })
    }

    async start(
        { language = App.languages['zh-cn'], theme = 'default' },
        features = [],
    ) {
        this.resigterEvent()
        this.#initLaya()
        globalThis.$ui = UIManager.getInstance()

        if (theme == 'default') {
            theme = localStorage.getItem('theme') || 'default'
        }

        $ui.theme = theme
        await this.#setLanguage(language)
        await $ui.setLoading(UI.pages.LOADING)
        await $ui.switchView(UI.pages.LOADING)
        await core.initial(
            dataSet => Laya.promises.loader.load(`data/${this.#language}/${dataSet}.json`, null, Laya.Loader.JSON),
            dataSet => Laya.promises.loader.load(`data/${dataSet}.json`, null, Laya.Loader.JSON),
        )
        await $ui.switchView(UI.pages.MAIN)
        for (const { feature, options } of features) {
            const f = await import(`./features/${feature}.js`)
            await f.default(options)
        }
    }
}

export default App
