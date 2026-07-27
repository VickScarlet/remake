const runtime =
Laya.runtime = {};

runtime.ColorFilterItem =
class ColorFilterItem extends Laya.Image {
    #hexToRgba = (hex) => {
        const rgba = [];
        hex = hex.replace('#', '');
        hex = hex.match(/(.{2})(.{2})(.{2})(.{2})/i);
        hex.forEach((item, index) => {
            rgba[index] = Number.parseInt(item, 16);
        });
        rgba.shift();
        return rgba;
    }

    #rgbaToMatrix = (rgba) => {
        let matrix = [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        matrix[0] = rgba[0] / 255;
        matrix[6] = rgba[1] / 255;
        matrix[12] = rgba[2] / 255;
        matrix[18] = rgba[3] / 255;
        return matrix;
    }

    get colorFilter() {
        return this._colorFilter;
    }
    set colorFilter(value) {
        this._colorFilter = value;
        if(value) {
            const rgba = this.#hexToRgba(this.colorFilter);
            const matrix = this.#rgbaToMatrix(rgba);
            const colorFilter = new Laya.ColorFilter(matrix);
            this.filters = [colorFilter];
        } else {
            this.filters = [];
        }
    }
}
runtime.UIBase = class UIBase extends Laya.View {}
runtime.ViewBase = class ViewBase extends runtime.UIBase {}
runtime.DialogBase = class DialogBase extends runtime.UIBase {}

runtime.ScaleButton =
class ScaleButton extends Laya.Button {
    constructor() {
        super();
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouse, [Laya.Event.MOUSE_DOWN]);
        this.on(Laya.Event.MOUSE_OUT, this, this.onMouse, [Laya.Event.MOUSE_OUT]);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouse, [Laya.Event.MOUSE_UP]);
    }

    onMouse(type) {
        Laya.Tween.clearAll(this);
        switch (type) {
            case Laya.Event.MOUSE_DOWN:
                Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 100);
                break;
            case Laya.Event.MOUSE_OUT:
            case Laya.Event.MOUSE_UP:
                Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 100);
                break;
            default:
                break;
        }
    }
}

runtime.RGBAItem =
class RGBAItem {
    constructor(config={}) {
        for(const key in config)
            switch(key) {
                case 'r':
                case 'g':
                case 'b':
                case 'a':
                case 'hex':
                case 'hexa':
                case 'rgb':
                case 'rgba':
                    this[key] = config[key];
                    break;
                case 'on':
                    this.on(config[key]);
                    break;
                default:
                    break;
            }
    }

    #r;
    #g;
    #b;
    #a;
    #on = new Set();

    on(fn) {
        this.#on.add(fn);
    }

    off(fn) {
        this.#on.delete(fn);
    }

    clear() {
        this.#on.clear();
    }

    #event() {
        this.#on.forEach(fn => fn(this));
    }

    #rgb(v) {
        return [
            this.#dec(v.slice(1, 3)),
            this.#dec(v.slice(3, 5)),
            this.#dec(v.slice(5, 7)),
        ];
    }

    #rgba(v) {
        return [
            this.#dec(v.slice(1, 3)),
            this.#dec(v.slice(3, 5)),
            this.#dec(v.slice(5, 7)),
            this.#dec(v.slice(7, 9)),
        ];
    }

    #hex(v) {
        v = Number.parseInt(v).toString(16);
        return v.length == 1 ? '0' + v : v;
    }

    #dec(v) {
        return Number.parseInt(v, 16);
    }

    get hex() {
        return `#${
            this.#hex(this.r)
        }${
            this.#hex(this.g)
        }${
            this.#hex(this.b)
        }`;
    }
    set hex(v) {
        [this.#r, this.#g, this.#b] = this.#rgb(v);
        this.#event();
    }

    get hexa() {
        return `#${
            this.#hex(this.r)
        }${
            this.#hex(this.g)
        }${
            this.#hex(this.b)
        }${
            this.#hex(this.a)
        }`;
    }
    set hexa(v) {
        [this.#r, this.#g, this.#b] = this.#rgba(v);
        this.#event();
    }

    get rgb() {
        return [this.r, this.g, this.b];
    }
    set rgb(v) {
        [this.#r, this.#g, this.#b] = v;
        this.#event();
    }

    get rgba() {
        return [this.r, this.g, this.b, this.a];
    }
    set rgba(v) {
        [this.#r, this.#g, this.#b, this.#a] = v;
        this.#event();
    }


    get r() {
        return this.#r||0;
    }
    set r(value) {
        this.#r = value;
        this.#event();
    }
    get g() {
        return this.#g||0;
    }
    set g(value) {
        this.#g = value;
        this.#event();
    }
    get b() {
        return this.#b||0;
    }
    set b(value) {
        this.#b = value;
        this.#event();
    }
    get a() {
        return this.#a||0;
    }
    set a(value) {
        this.#a = value;
        this.#event();
    }

    cRgb(hex) {
        const [r, g, b] = this.#rgb(hex);
        return {r, g, b};
    }

    cRgba(hexa) {
        const [r, g, b, a] = this.#rgba(hexa);
        return {r, g, b, a};
    }

    distance(left, right) {
        const [lr, lg, lb] = this.#rgb(left);
        const [rr, rg, rb] = this.#rgb(right);
        const {r, g, b} = this;

        const ddr = Math.abs(r - lr);
        const ddg = Math.abs(g - lg);
        const ddb = Math.abs(b - lb);

        const result = (d, a, b) => ((d / Math.abs(b - a)) || 0);

        switch(Math.max(ddr, ddg, ddb)) {
            case ddr: return result(ddr, lr, rr);
            case ddg: return result(ddg, lg, rg);
            case ddb: return result(ddb, lb, rb);
            default: return 1;
        }
    }
}
runtime.ColorfulBox =
class ColorfulBox extends Laya.Box {
    constructor() {
        super();
        this.on(Laya.Event.MOUSE_OVER, this, this.onMouse, [Laya.Event.MOUSE_DOWN]);
        // this.on(Laya.Event.MOUSE_DOWN, this, this.onMouse, [Laya.Event.MOUSE_DOWN]);
        this.on(Laya.Event.MOUSE_OUT, this, this.onMouse, [Laya.Event.MOUSE_OUT]);
        // this.on(Laya.Event.MOUSE_UP, this, this.onMouse, [Laya.Event.MOUSE_UP]);
        this.#draw();
    }

    #defaultColor = '#ffffff';
    #hoverColor = '#ffffff';
    #defaultStroke = '#ffffff';
    #hoverStroke = '#ffffff';
    #defaultLabel = '#000000';
    #hoverLabel = '#000000';
    #color = new runtime.RGBAItem({hex: this.#defaultColor, on: ()=>this.#draw()});
    #stroke = new runtime.RGBAItem({hex: this.#defaultStroke, on: ()=>this.#draw()});
    #label = new runtime.RGBAItem({hex: this.#defaultLabel, on: ({hex})=>{
        const label = this.getChildByName('label');
        if (!label) return;
        label.color = hex;
    }});
    #lineWidth = 0;
    #radius = 0;
    #animationTime = 200;
    #state = 1;

    onMouse(type) {
        const label = this.getChildByName('label');
        const tween = (colorItem, target, last) => {
            Laya.Tween.clearAll(colorItem);
            const distance = colorItem.distance(target, last);
            if(!Number.isFinite(distance)) {
                colorItem.hex = target;
                return;
            }
            Laya.Tween.to(colorItem, colorItem.cRgb(target), colorItem.distance(target, last) * this.#animationTime);
        }
        switch (type) {
            case Laya.Event.MOUSE_OVER:
            case Laya.Event.MOUSE_DOWN:
                if(this.#state == 2) return;
                this.#state = 2;
                tween(this.#color, this.#hoverColor, this.#defaultColor);
                tween(this.#stroke, this.#hoverStroke, this.#defaultStroke);
                if(label) tween(this.#label, this.#hoverLabel, this.#defaultLabel);
                break;
            case Laya.Event.MOUSE_OUT:
            case Laya.Event.MOUSE_UP:
                if(this.#state == 1) return;
                this.#state = 1;
                tween(this.#color, this.#defaultColor, this.#hoverColor);
                tween(this.#stroke, this.#defaultStroke, this.#hoverStroke);
                if(label) tween(this.#label, this.#defaultLabel, this.#hoverLabel);
                break;
            default:
                break;
        }
    }

    #draw() {
        this.graphics.clear();
        const w = this.width;
        const h = this.height;
        const r = Math.min(this.#radius, w / 2, h / 2);
        const fillStyle = this.#color.hex;
        const strokeStyle = this.#stroke.hex;
        const lineWidth = this.lineWidth;

        if(r <= 0) {
            this.graphics.drawRect(0, 0, w, h, fillStyle, strokeStyle, lineWidth);
            return;
        }

        const a = w + lineWidth;
        const b = h + lineWidth;
        const c = r + lineWidth;
        const d = a - r;
        const e = b - r;
        const f = -lineWidth;

        this.graphics.drawPath(0, 0, [
            ["moveTo", c, f],
            ["arcTo",  a, f, a, c, c],
            ["arcTo",  a, b, d, b, c],
            ["arcTo",  f, b, f, e, c],
            ["arcTo",  f, f, c, f, c],
            ["closePath"],
        ], { fillStyle: strokeStyle });

        const x = w - r;
        const y = h - r;
        this.graphics.drawPath(0, 0, [
            ["moveTo", r, 0],
            ["arcTo",  w, 0, w, r, r],
            ["arcTo",  w, h, x, h, r],
            ["arcTo",  0, h, 0, y, r],
            ["arcTo",  0, 0, r, 0, r],
            ["closePath"],
        ], { fillStyle });
    }

    get width() {
        return super.width;
    }
    set width(value) {
        super.width = value;
        this.#draw();
    }
    get height() {
        return super.height;
    }
    set height(value) {
        super.height = value;
        this.#draw();
    }

    get defaultColor() {
        return this.#defaultColor;
    }
    set defaultColor(value) {
        this.#defaultColor = value;
        Laya.Tween.clearAll(this.#color);
        Laya.Tween.clearAll(this.#stroke);
        Laya.Tween.clearAll(this.#label);
        this.#color.hex = value;
    }

    get hoverColor() {
        return this.#hoverColor;
    }
    set hoverColor(value) {
        this.#hoverColor = value;
    }

    get defaultStroke() {
        return this.#defaultStroke;
    }
    set defaultStroke(value) {
        this.#defaultStroke = value;
        Laya.Tween.clearAll(this.#color);
        Laya.Tween.clearAll(this.#stroke);
        Laya.Tween.clearAll(this.#label);
        this.#stroke.hex = value;
    }

    get hoverStroke() {
        return this.#hoverStroke;
    }
    set hoverStroke(value) {
        this.#hoverStroke = value;
    }

    get defaultLabel() {
        return this.#defaultLabel;
    }
    set defaultLabel(value) {
        this.#defaultLabel = value;
        const label = this.getChildByName('label');
        if (!label) return;
        Laya.Tween.clearAll(this.#color);
        Laya.Tween.clearAll(this.#stroke);
        Laya.Tween.clearAll(this.#label);
        label.color = value;
    }

    get hoverLabel() {
        return this.#hoverLabel;
    }
    set hoverLabel(value) {
        this.#hoverLabel = value;
    }

    get animationTime() {
        return this.#animationTime;
    }
    set animationTime(value) {
        this.#animationTime = value;
    }

    get radius() {
        return this.#radius||0;
    }
    set radius(value) {
        this.#radius = value;
        this.#draw();
    }

    get lineWidth() {
        return this.#lineWidth||0;
    }
    set lineWidth(value) {
        this.#lineWidth = value;
        this.#draw();
    }
    get label() {
        return this.getChildByName('label')?.text;
    }
    set label(value) {
        const label = this.getChildByName('label');
        if (!label) return;
        label.text = value;
    }

    get cacheAs() {return super.cacheAs;}
    set cacheAs(value) {
        if(value=='bitmap') debugger;
        super.cacheAs = value;
    }

}

runtime.BlankBox =
class BlankBox extends Laya.Box {
    constructor() {
        super();
        this.mask = new Laya.Sprite();
        this.#blank = new Laya.Sprite();
        this.addChild(this.#blank);
    }

    #blank;
    #timeLine;
    #pause = true;

    #draw() {
        this.mask.graphics.clear();
        this.#blank.graphics.clear();
        this.mask.graphics.drawRect(0, 0, this.width, this.height, '#000000');
        this.#blank.graphics.drawRect(0, 0, this.width, this.height, '#000000');
        if(this.#timeLine) this.#timeLine.destroy();
        this.#timeLine = new Laya.TimeLine()
            .to(this.#blank, { x: this.width }, 2000)
            .to(this.#blank, { x: -this.width }, 0);
        this.#timeLine.play(0, true);
        if(this.#pause) this.#timeLine.pause();
    }
    get pause() {
        return this.#pause;
    }
    set pause(value) {
        if(this.#pause == value) return;
        this.#pause = value;
        this.#blank.visible = !value;
        if(value) this.#timeLine.pause();
        else this.#timeLine.resume();
    }

    destroy(destroyChild) {
        this.#timeLine.destroy(true);
        super.destroy(destroyChild);
    }

    get width() {
        return super.width;
    }
    set width(value) {
        super.width = value;
        this.#blank.x = -this.width;
        this.#draw();
    }

    get height() {
        return super.height;
    }
    set height(value) {
        super.height = value;
        this.#draw();
    }
}

runtime.ColorAgentLabel =
class ColorAgentLabel extends Laya.Label {
    get #brothers() {
        const brothers = [];
        if(!this.parent) return brothers;
        const deepFind = p => {
            if(!p._childs) return;
            for(const c of p._childs) {
                if(c == this) continue;
                if(c instanceof Laya.Label) brothers.push(c);
                deepFind(c);
            }
        }
        deepFind(this.parent);
        return brothers;
    }

    get color() {return this.super.color;}
    set color(c) {
        super.color = c;
        this.#brothers.forEach(b=>b.color=c);
    }
}