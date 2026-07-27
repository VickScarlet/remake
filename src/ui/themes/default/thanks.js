export default class Thanks extends ui.view.DefaultTheme.ThanksUI {
    constructor() {
        super();
        this.btnBack.on(Laya.Event.CLICK, this, ()=>$ui.switchView(UI.pages.MAIN));
        this.listSupports.renderHandler = Laya.Handler.create(this, this.renderSupport, null, false);
        this.panelTopSupports.vScrollBar.elasticDistance = 150;
        this.listSupports.scrollBar.elasticDistance = 150;
        if (globalThis.$channel?.disabled?.sponsor) {
            this.btnAFD.on(Laya.Event.CLICK, this, $$event, ['message', ['M_SponsorThanks']]);
        } else {
            this.btnAFD.on(Laya.Event.CLICK, this, goto, ['sponsor_afd']);
            // this.btnDDF.on(Laya.Event.CLICK, this, goto, ['sponsor_ddf']);
        }
        this.btnDDF.on(Laya.Event.CLICK, this, $$event, ['message', ['M_SponsorThanks']]);
    }

    static #createComponent = Laya.plugin.extractComponents(Thanks.uiView, ['boxTopSupport']);
    #createTopSupportItem() {
        const item = Thanks.#createComponent('boxTopSupport');
        item.name = item.getChildByName('name');
        item.comment = item.getChildByName('comment');
        $_.deepMapSet(item, $ui.common.topSupportItem);
        return item;
    }

    #topSupports;

    init() {
        const supports = [];
        this.#topSupports = [];
        core.specialThanks
            .sort(()=>0.5-Math.random())
            .forEach(({group, name, comment, color})=>
                group == 2
                    ? supports.push({name, color})
                    : this.renderTopSupport(name, comment, color)
            );
        this.listSupports.array = supports;
    }

    renderTopSupport(name, comment, color) {
        const item = this.#createTopSupportItem();
        item.name.text = name;
        item.comment.text = comment;
        item.name.color = color || '#000000';
        this.vboxTopSupports.addChild(item);
        this.#topSupports.push(item);
        this.#topSupports.forEach((item, index) => item.y = index);
    }

    renderSupport(label) {
        const {name, color} = label.dataSource;
        label.text = name;
        label.color = color || $ui.common.defaultFontColor;
    }

    close() {
        this.#topSupports.forEach(item => {
            item.removeSelf();
            item.destroy();
        });
        this.#topSupports = null;
    }
}