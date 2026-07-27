export default class SaveLoad extends ui.view.SaveLoadUI {
    constructor() {
        super()
        this.btnClose.on(Laya.Event.CLICK, this, async () => {
            await this.close()
            $ui.switchView(UI.pages.MAIN)
        })
        this.btnRead.on(Laya.Event.CLICK, this, async () => {
            this.input.text = this.data
            const result = await $$copy(this.data)
            $$event('message', [result ? 'UI_CopySuccess' : 'UI_CopyFailed'])
        })
        this.btnWrite.on(Laya.Event.CLICK, this, async () => {
            const text = await $$read()
            if (text == null) {
                this.data = [
                    this.input.text,
                    'UI_PasteFailedDecodeSuccess',
                    'UI_PasteFailedDecodeFailed',
                ]
            } else {
                this.input.text = text
                this.data = [
                    text,
                    'UI_PasteSuccessDecodeSuccess',
                    'UI_PasteSuccessDecodeFailed',
                ]
            }
        })

        this.btnSave.on(Laya.Event.CLICK, this, () => {
            let blob = new Blob([this.data], { type: 'application/json' })
            const slice = blob.slice || blob.webkitSlice || blob.mozSlice
            blob = slice.call(blob, 0, blob.size, 'application/octet-stream')
            const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            a.href = URL.createObjectURL(blob)
            a.download = `Remake_save_${new Date().toISOString().replace(':', '.')}.json`

            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(a.href)
        })
        this.btnLoad.on(Laya.Event.CLICK, this, () => {
            const file = document.createElement('input')
            file.setAttribute('type', 'file')
            file.setAttribute('name', 'file')
            file.setAttribute('accept', 'application/json')
            file.setAttribute('style', 'display: none;')
            document.body.appendChild(file)
            file.click()
            file.onchange = async e => {
                const f = e.target.files[0]
                if (!f) return
                this.data = [await f.text()]
                file.remove()
            }
        })
        this.input.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.input.setSelection(0, this.input.text.length)
        })

        this.btnBackup.on(Laya.Event.CLICK, this, () => {
            const board = document.createElement('div')
            document.body.appendChild(board)
            board.style = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.95`

            const bg = document.createElement('div')
            bg.style = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #fff;
                opacity: 0.95`
            document.body.appendChild(board)
            board.appendChild(bg)
            const textarea = document.createElement('textarea')
            textarea.style = `position: absolute; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
            textarea.value = JSON.stringify(JSON.parse(this.data), null, 4)
            board.appendChild(textarea)
            const close = document.createElement('div')
            close.style = `
                position: absolute;
                top: 0;
                right: 0;
                width: 100px;
                height: 100px;
                background: red;
                font-size:100px;
                padding: 0;
                line-height: 100px;
                color: white;
                opacity: 0.7`
            close.innerHTML = '×'
            board.appendChild(close)
            close.onclick = () => board.remove()

            const load = document.createElement('div')
            load.style = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 100px;
                height: 100px;
                background: limegreen;
                font-size: 35px;
                padding: 0;
                line-height: 50px;
                color: white;
                opacity: 0.7`
            load.innerHTML = 'LOAD<br>读取'
            board.appendChild(load)
            load.onclick = () => (this.data = [textarea.value, '成功/success', '失败/failed', true])
        })
    }

    static load() {
        return ['images/atlas/images/radio.atlas']
    }

    init() {
        this.input.text = this.data
    }

    get data() {
        const data = {}
        Object.keys(localStorage)
            .filter(v => !v.startsWith('goog'))
            .forEach(key => (data[key] = localStorage[key]))
        return JSON.stringify(data)
    }

    set data([v, success = 'UI_LoadSuccess', failed = 'UI_LoadFailed', altMsg]) {
        try {
            const data = JSON.parse(v)
            for (const key in data) localStorage.setItem(key, data[key])
            if (altMsg) alert(success)
            else $$event('message', [success])
            $ui.theme = $ui.theme ?? null
            this.btnClose.event(Laya.Event.CLICK)
        } catch (e) {
            console.error(e)
            if (altMsg) alert(`${failed}\n${e}`)
            else $$event('message', [failed])
        }
    }
}
