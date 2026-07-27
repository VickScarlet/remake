// 滚动条太灵敏
const SCROLL_START_DISTANCE = 30;
Laya.ScrollBar.prototype.loop=function(){
    let mouseY=Laya.stage.mouseY;
    let mouseX=Laya.stage.mouseX;
    this._lastOffset=this.isVertical ? (mouseY-this._lastPoint.y):(mouseX-this._lastPoint.x);
    if (this._clickOnly){
        if (Math.abs(this._lastOffset *(this.isVertical ? Laya.stage._canvasTransform.getScaleY():Laya.stage._canvasTransform.getScaleX()))> SCROLL_START_DISTANCE){
            this._clickOnly=false;
            this._offsets || (this._offsets=[]);
            this._offsets.length=0;
            this._target.mouseEnabled=false;
            if (!this.hide && this.autoHide){
                this.alpha=1;
                this.visible=true;
            }
            this.event(/*laya.events.Event.START*/"start");
        }else return;
    }
    this._offsets.push(this._lastOffset);
    this._lastPoint.x=mouseX;
    this._lastPoint.y=mouseY;
    if (this._lastOffset===0)return;
    if (!this._checkElastic){
        if (this.elasticDistance > 0){
            if (!this._checkElastic && this._lastOffset !=0){
                if ((this._lastOffset > 0 && this._value <=this.min)|| (this._lastOffset < 0 && this._value >=this.max)){
                    this._isElastic=true;
                    this._checkElastic=true;
                    }else {
                    this._isElastic=false;
                }
            }
            }else {
            this._checkElastic=true;
        }
    }
    if (this._isElastic){
        if (this._value <=this.min){
            this.value-=this._lastOffset *Math.max(0,(1-((this.min-this._value)/ this.elasticDistance)));
            }else if (this._value >=this.max){
            this.value-=this._lastOffset *Math.max(0,(1-((this._value-this.max)/ this.elasticDistance)));
        }
        }else {
        this.value-=this._lastOffset;
    }
}
