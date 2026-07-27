export default class Main extends ui.view.DefaultTheme.MainUI {
    constructor() {
        super()
        this.btnRemake.on(Laya.Event.CLICK, this, () => $ui.switchView(UI.pages.MODE))
        this.btnAchievement.on(Laya.Event.CLICK, this, () => $ui.switchView(UI.pages.ACHIEVEMENT))
        this.btnThanks.on(Laya.Event.CLICK, this, () => $ui.switchView(UI.pages.THANKS))
        this.btnGithub.on(Laya.Event.CLICK, this, goto, ['github'])
        this.btnDiscord.on(Laya.Event.CLICK, this, goto, ['discord'])
        this.btnThemes.on(Laya.Event.CLICK, this, () => $ui.showDialog(UI.pages.THEMES))
        this.btnSaveLoad.on(Laya.Event.CLICK, this, () => $ui.showDialog(UI.pages.SAVELOAD))
    }

    static load() {
        return ['images/atlas/images/icons.atlas']
    }

    init() {
        const text = this.labSubTitle.text
        this.labSubTitle.text = ' '
        this.labSubTitle.text = text

        const leastOnce = !!core.times
        this.banner.visible = leastOnce
        this.btnAchievement.visible = leastOnce
        this.btnThanks.visible = leastOnce

        const disabled = globalThis.$channel?.disabled || {}
        this.btnDiscord.visible = leastOnce && !disabled.discord
        this.btnGithub.visible = !disabled.github
        this.btnSaveLoad.visible = !disabled.saveload
    }
}
