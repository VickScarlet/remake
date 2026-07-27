
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Animation=laya.display.Animation,Browser=laya.utils.Browser,ClassUtils=laya.utils.ClassUtils,ColorFilter=laya.filters.ColorFilter;
	var Ease=laya.utils.Ease,Event=laya.events.Event,EventDispatcher=laya.events.EventDispatcher,Font=laya.display.css.Font;
	var FrameAnimation=laya.display.FrameAnimation,Graphics=laya.display.Graphics,Handler=laya.utils.Handler;
	var HttpRequest=laya.net.HttpRequest,Input=laya.display.Input,Loader=laya.net.Loader,LocalStorage=laya.net.LocalStorage;
	var Node=laya.display.Node,Point=laya.maths.Point,Rectangle=laya.maths.Rectangle,Render=laya.renders.Render;
	var Sprite=laya.display.Sprite,Stage=laya.display.Stage,Text=laya.display.Text,Texture=laya.resource.Texture;
	var TimeLine=laya.utils.TimeLine,Tween=laya.utils.Tween,Utils=laya.utils.Utils,WeakObject=laya.utils.WeakObject;
Laya.interface('laya.ui.IItem');
Laya.interface('laya.ui.ISelect');
Laya.interface('laya.ui.IRender');
Laya.interface('laya.ui.IComponent');
Laya.interface('laya.ui.IBox','IComponent');
/**
*<code>LayoutStyle</code> 是一个布局样式类。
*/
//class laya.ui.LayoutStyle
var LayoutStyle=(function(){
	function LayoutStyle(){
		/**一个布尔值，表示是否有效。*/
		this.enable=false;
		this.top=NaN;
		this.bottom=NaN;
		this.left=NaN;
		this.right=NaN;
		this.centerX=NaN;
		this.centerY=NaN;
		this.anchorX=NaN;
		this.anchorY=NaN;
	}

	__class(LayoutStyle,'laya.ui.LayoutStyle');
	__static(LayoutStyle,
	['EMPTY',function(){return this.EMPTY=new LayoutStyle();}
	]);
	return LayoutStyle;
})()


/**
*<code>Styles</code> 定义了组件常用的样式属性。
*/
//class laya.ui.Styles
var Styles=(function(){
	function Styles(){}
	__class(Styles,'laya.ui.Styles');
	Styles.labelColor="#000000";
	Styles.buttonStateNum=3;
	Styles.scrollBarMinNum=15;
	Styles.scrollBarDelayTime=500;
	__static(Styles,
	['defaultSizeGrid',function(){return this.defaultSizeGrid=[4,4,4,4,0];},'labelPadding',function(){return this.labelPadding=[2,2,2,2];},'inputLabelPadding',function(){return this.inputLabelPadding=[1,1,1,3];},'buttonLabelColors',function(){return this.buttonLabelColors=["#32556b","#32cc6b","#ff0000","#C0C0C0"];},'comboBoxItemColors',function(){return this.comboBoxItemColors=["#5e95b6","#ffffff","#000000","#8fa4b1","#ffffff"];}
	]);
	return Styles;
})()


/**
*<code>UIUtils</code> 是文本工具集。
*/
//class laya.ui.UIUtils
var UIUtils=(function(){
	function UIUtils(){}
	__class(UIUtils,'laya.ui.UIUtils');
	UIUtils.fillArray=function(arr,str,type){
		var temp=arr.concat();
		if (str){
			var a=str.split(",");
			for (var i=0,n=Math.min(temp.length,a.length);i < n;i++){
				var value=a[i];
				temp[i]=(value=="true" ? true :(value=="false" ? false :value));
				if (type !=null)temp[i]=type(value);
			}
		}
		return temp;
	}

	UIUtils.toColor=function(color){
		return Utils.toHexColor(color);
	}

	UIUtils.gray=function(traget,isGray){
		(isGray===void 0)&& (isGray=true);
		if (isGray){
			UIUtils.addFilter(traget,UIUtils.grayFilter);
			}else {
			UIUtils.clearFilter(traget,ColorFilter);
		}
	}

	UIUtils.addFilter=function(target,filter){
		var filters=target.filters || [];
		filters.push(filter);
		target.filters=filters;
	}

	UIUtils.clearFilter=function(target,filterType){
		var filters=target.filters;
		if (filters !=null && filters.length > 0){
			for (var i=filters.length-1;i >-1;i--){
				var filter=filters[i];
				if (Laya.__typeof(filter,filterType))filters.splice(i,1);
			}
			target.filters=filters;
		}
	}

	UIUtils._getReplaceStr=function(word){
		return UIUtils.escapeSequence[word];
	}

	UIUtils.adptString=function(str){
		return str.replace(/\\(\w)/g,UIUtils._getReplaceStr);
	}

	UIUtils.getBindFun=function(value){
		var fun=UIUtils._funMap.get(value);
		if (fun==null){
			var temp="\""+value+"\"";
			temp=temp.replace(/^"\${|}"$/g,"").replace(/\${/g,"\"+").replace(/}/g,"+\"");
			var str="(function(data){if(data==null)return;with(data){try{\nreturn "+temp+"\n}catch(e){}}})";
			fun=Laya._runScript(str);
			UIUtils._funMap.set(value,fun);
		}
		return fun;
	}

	__static(UIUtils,
	['grayFilter',function(){return this.grayFilter=new ColorFilter([0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0,0,0,1,0]);},'escapeSequence',function(){return this.escapeSequence={"\\n":"\n","\\t":"\t"};},'_funMap',function(){return this._funMap=new WeakObject();}
	]);
	return UIUtils;
})()


/**全局配置*/
//class UIConfig
var UIConfig=(function(){
	function UIConfig(){}
	__class(UIConfig,'UIConfig');
	UIConfig.touchScrollEnable=true;
	UIConfig.mouseWheelEnable=true;
	UIConfig.showButtons=true;
	UIConfig.popupBgColor="#000000";
	UIConfig.popupBgAlpha=0.5;
	UIConfig.closeDialogOnSide=true;
	return UIConfig;
})()


/**
*<code>AutoBitmap</code> 类是用于表示位图图像或绘制图形的显示对象。
*<p>封装了位置，宽高及九宫格的处理，供UI组件使用。</p>
*/
//class laya.ui.AutoBitmap extends laya.display.Graphics
var AutoBitmap=(function(_super){
	function AutoBitmap(){
		/**@private 是否自动缓存命令*/
		this.autoCacheCmd=true;
		/**@private 宽度*/
		this._width=0;
		/**@private 高度*/
		this._height=0;
		/**@private 源数据*/
		this._source=null;
		/**@private 网格数据*/
		this._sizeGrid=null;
		/**@private */
		this._isChanged=false;
		/**@private */
		this._offset=null;
		AutoBitmap.__super.call(this);
	}

	__class(AutoBitmap,'laya.ui.AutoBitmap',_super);
	var __proto=AutoBitmap.prototype;
	/**@inheritDoc */
	__proto.destroy=function(){
		_super.prototype.destroy.call(this);
		this._source=null;
		this._sizeGrid=null;
		this._offset=null;
	}

	/**@private */
	__proto._setChanged=function(){
		if (!this._isChanged){
			this._isChanged=true;
			Laya.timer.callLater(this,this.changeSource);
		}
	}

	/**
	*@private
	*修改纹理资源。
	*/
	__proto.changeSource=function(){
		this._isChanged=false;
		var source=this._source;
		if (!source || !source.bitmap)return;
		var width=this.width;
		var height=this.height;
		var sizeGrid=this._sizeGrid;
		var sw=source.sourceWidth;
		var sh=source.sourceHeight;
		if (!sizeGrid || (sw===width && sh===height)){
			this.clear();
			this.drawTexture(source,this._offset ? this._offset[0] :0,this._offset ? this._offset[1] :0,width,height);
			}else {
			source.$_GID || (source.$_GID=Utils.getGID());
			var key=source.$_GID+"."+width+"."+height+"."+sizeGrid.join(".");
			if (Utils.isOKCmdList(WeakObject.I.get(key))){
				this.cmds=WeakObject.I.get(key);
				return;
			}
			this.clear();
			var top=sizeGrid[0];
			var right=sizeGrid[1];
			var bottom=sizeGrid[2];
			var left=sizeGrid[3];
			var repeat=sizeGrid[4];
			var needClip=false;
			if (width==sw){
				left=right=0;
			}
			if (height==sh){
				top=bottom=0;
			}
			if (left+right > width){
				var clipWidth=width;
				needClip=true;
				width=left+right;
				this.save();
				this.clipRect(0,0,clipWidth,height);
			}
			left && top && this.drawTexture(AutoBitmap.getTexture(source,0,0,left,top),0,0,left,top);
			right && top && this.drawTexture(AutoBitmap.getTexture(source,sw-right,0,right,top),width-right,0,right,top);
			left && bottom && this.drawTexture(AutoBitmap.getTexture(source,0,sh-bottom,left,bottom),0,height-bottom,left,bottom);
			right && bottom && this.drawTexture(AutoBitmap.getTexture(source,sw-right,sh-bottom,right,bottom),width-right,height-bottom,right,bottom);
			top && this.drawBitmap(repeat,AutoBitmap.getTexture(source,left,0,sw-left-right,top),left,0,width-left-right,top);
			bottom && this.drawBitmap(repeat,AutoBitmap.getTexture(source,left,sh-bottom,sw-left-right,bottom),left,height-bottom,width-left-right,bottom);
			left && this.drawBitmap(repeat,AutoBitmap.getTexture(source,0,top,left,sh-top-bottom),0,top,left,height-top-bottom);
			right && this.drawBitmap(repeat,AutoBitmap.getTexture(source,sw-right,top,right,sh-top-bottom),width-right,top,right,height-top-bottom);
			this.drawBitmap(repeat,AutoBitmap.getTexture(source,left,top,sw-left-right,sh-top-bottom),left,top,width-left-right,height-top-bottom);
			if (needClip)this.restore();
			if (this.autoCacheCmd && !Render.isConchApp)WeakObject.I.set(key,this.cmds);
		}
		this._repaint();
	}

	__proto.drawBitmap=function(repeat,tex,x,y,width,height){
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		if (width < 0.1 || height < 0.1)return;
		if (repeat && (tex.width !=width || tex.height !=height))this.fillTexture(tex,x,y,width,height);
		else this.drawTexture(tex,x,y,width,height);
	}

	__proto.clear=function(recoverCmds){
		(recoverCmds===void 0)&& (recoverCmds=true);
		_super.prototype.clear.call(this,false);
	}

	/**
	*当前实例的有效缩放网格数据。
	*<p>如果设置为null,则在应用任何缩放转换时，将正常缩放整个显示对象。</p>
	*<p>数据格式：[上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)]。
	*<ul><li>例如：[4,4,4,4,1]</li></ul></p>
	*<p> <code>sizeGrid</code> 的值如下所示：
	*<ol>
	*<li>上边距</li>
	*<li>右边距</li>
	*<li>下边距</li>
	*<li>左边距</li>
	*<li>是否重复填充(值为0：不重复填充，1：重复填充)</li>
	*</ol></p>
	*<p>当定义 <code>sizeGrid</code> 属性时，该显示对象被分割到以 <code>sizeGrid</code> 数据中的"上边距,右边距,下边距,左边距" 组成的矩形为基础的具有九个区域的网格中，该矩形定义网格的中心区域。网格的其它八个区域如下所示：
	*<ul>
	*<li>矩形上方的区域</li>
	*<li>矩形外的右上角</li>
	*<li>矩形左侧的区域</li>
	*<li>矩形右侧的区域</li>
	*<li>矩形外的左下角</li>
	*<li>矩形下方的区域</li>
	*<li>矩形外的右下角</li>
	*<li>矩形外的左上角</li>
	*</ul>
	*同时也支持3宫格，比如0,4,0,4,1为水平3宫格，4,0,4,0,1为垂直3宫格，3宫格性能比9宫格高。
	*</p>
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._sizeGrid;
		},function(value){
		this._sizeGrid=value;
		this._setChanged();
	});

	/**
	*表示显示对象的宽度，以像素为单位。
	*/
	__getset(0,__proto,'width',function(){
		if (this._width)return this._width;
		if (this._source)return this._source.sourceWidth;
		return 0;
		},function(value){
		if (this._width !=value){
			this._width=value;
			this._setChanged();
		}
	});

	/**
	*表示显示对象的高度，以像素为单位。
	*/
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		if (this._source)return this._source.sourceHeight;
		return 0;
		},function(value){
		if (this._height !=value){
			this._height=value;
			this._setChanged();
		}
	});

	/**
	*对象的纹理资源。
	*@see laya.resource.Texture
	*/
	__getset(0,__proto,'source',function(){
		return this._source;
		},function(value){
		if (value){
			this._source=value
			this._setChanged();
			}else {
			this._source=null;
			this.clear();
		}
	});

	AutoBitmap.getTexture=function(tex,x,y,width,height){
		if (width <=0)width=1;
		if (height <=0)height=1;
		tex.$_GID || (tex.$_GID=Utils.getGID())
		var key=tex.$_GID+"."+x+"."+y+"."+width+"."+height;
		var texture=WeakObject.I.get(key);
		if (!texture || !texture.source){
			texture=Texture.createFromTexture(tex,x,y,width,height);
			WeakObject.I.set(key,texture);
		}
		return texture;
	}

	return AutoBitmap;
})(Graphics)


/**
*<code>UIEvent</code> 类用来定义UI组件类的事件类型。
*/
//class laya.ui.UIEvent extends laya.events.Event
var UIEvent=(function(_super){
	function UIEvent(){
		UIEvent.__super.call(this);;
	}

	__class(UIEvent,'laya.ui.UIEvent',_super);
	UIEvent.SHOW_TIP="showtip";
	UIEvent.HIDE_TIP="hidetip";
	return UIEvent;
})(Event)


/**
*<code>Component</code> 是ui控件类的基类。
*<p>生命周期：preinitialize > createChildren > initialize > 组件构造函数</p>
*/
//class laya.ui.Component extends laya.display.Sprite
var Component=(function(_super){
	function Component(){
		this._comXml=null;
		/**@private 控件的元数据。 */
		this._dataSource=null;
		/**@private 鼠标悬停提示 */
		this._toolTip=null;
		/**@private 标签 */
		this._tag=null;
		/**@private 禁用 */
		this._disabled=false;
		/**@private 变灰*/
		this._gray=false;
		/**
		*是否启用相对布局
		*/
		this.layoutEnabled=true;
		Component.__super.call(this);
		this._layout=LayoutStyle.EMPTY;
		this.preinitialize();
		this.createChildren();
		this.initialize();
	}

	__class(Component,'laya.ui.Component',_super);
	var __proto=Component.prototype;
	Laya.imps(__proto,{"laya.ui.IComponent":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._dataSource=this._layout=null;
		this._tag=null;
		this._toolTip=null;
	}

	/**
	*<p>预初始化。</p>
	*@internal 子类可在此函数内设置、修改属性默认值
	*/
	__proto.preinitialize=function(){}
	/**
	*<p>创建并添加控件子节点。</p>
	*@internal 子类可在此函数内创建并添加子节点。
	*/
	__proto.createChildren=function(){}
	/**
	*<p>控件初始化。</p>
	*@internal 在此子对象已被创建，可以对子对象进行修改。
	*/
	__proto.initialize=function(){}
	/**
	*<p>延迟运行指定的函数。</p>
	*<p>在控件被显示在屏幕之前调用，一般用于延迟计算数据。</p>
	*@param method 要执行的函数的名称。例如，functionName。
	*@param args 传递给 <code>method</code> 函数的可选参数列表。
	*
	*@see #runCallLater()
	*/
	__proto.callLater=function(method,args){
		Laya.timer.callLater(this,method,args);
	}

	/**
	*<p>如果有需要延迟调用的函数（通过 <code>callLater</code> 函数设置），则立即执行延迟调用函数。</p>
	*@param method 要执行的函数名称。例如，functionName。
	*@see #callLater()
	*/
	__proto.runCallLater=function(method){
		Laya.timer.runCallLater(this,method);
	}

	/**
	*<p>立即执行影响宽高度量的延迟调用函数。</p>
	*@internal <p>使用 <code>runCallLater</code> 函数，立即执行影响宽高度量的延迟运行函数(使用 <code>callLater</code> 设置延迟执行函数)。</p>
	*@see #callLater()
	*@see #runCallLater()
	*/
	__proto.commitMeasure=function(){}
	/**
	*<p>重新调整对象的大小。</p>
	*/
	__proto.changeSize=function(){
		this.event(/*laya.events.Event.RESIZE*/"resize");
		if (this._layout.enable){
			this.resetLayoutX();
			this.resetLayoutY();
		}
	}

	/**
	*@private
	*<p>获取对象的布局样式。</p>
	*/
	__proto.getLayout=function(){
		this._layout===LayoutStyle.EMPTY && (this._layout=new LayoutStyle());
		return this._layout;
	}

	/**
	*@private
	*<p>指定对象是否可使用布局。</p>
	*<p>如果值为true,则此对象可以使用布局样式，否则不使用布局样式。</p>
	*@param value 一个 Boolean 值，指定对象是否可使用布局。
	*/
	__proto._setLayoutEnabled=function(value){
		if (this._layout && this._layout.enable !=value){
			this._layout.enable=value;
			this.on(/*laya.events.Event.ADDED*/"added",this,this.onAdded);
			this.on(/*laya.events.Event.REMOVED*/"removed",this,this.onRemoved);
			if (this.parent){
				this.onAdded();
			}
		}
	}

	/**
	*对象从显示列表移除的事件侦听处理函数。
	*/
	__proto.onRemoved=function(){
		this.parent.off(/*laya.events.Event.RESIZE*/"resize",this,this.onCompResize);
	}

	/**
	*对象被添加到显示列表的事件侦听处理函数。
	*/
	__proto.onAdded=function(){
		this.parent.on(/*laya.events.Event.RESIZE*/"resize",this,this.onCompResize);
		this.resetLayoutX();
		this.resetLayoutY();
	}

	/**
	*父容器的 <code>Event.RESIZE</code> 事件侦听处理函数。
	*/
	__proto.onCompResize=function(){
		if (this._layout && this._layout.enable){
			this.resetLayoutX();
			this.resetLayoutY();
		}
	}

	/**
	*<p>重置对象的 <code>X</code> 轴（水平方向）布局。</p>
	*/
	__proto.resetLayoutX=function(){
		var layout=this._layout;
		if (!isNaN(layout.anchorX))this.pivotX=layout.anchorX *this.width;
		if (!this.layoutEnabled)return;
		var parent=this.parent;
		if (parent){
			if (!isNaN(layout.centerX)){
				this.x=Math.round((parent.width-this.displayWidth)*0.5+layout.centerX+this.pivotX *this.scaleX);
				}else if (!isNaN(layout.left)){
				this.x=Math.round(layout.left+this.pivotX *this.scaleX);
				if (!isNaN(layout.right)){
					this.width=(parent._width-layout.left-layout.right)/ (this.scaleX || 0.01);
				}
				}else if (!isNaN(layout.right)){
				this.x=Math.round(parent.width-this.displayWidth-layout.right+this.pivotX *this.scaleX);
			}
		}
	}

	/**
	*<p>重置对象的 <code>Y</code> 轴（垂直方向）布局。</p>
	*/
	__proto.resetLayoutY=function(){
		var layout=this._layout;
		if (!isNaN(layout.anchorY))this.pivotY=layout.anchorY *this.height;
		if (!this.layoutEnabled)return;
		var parent=this.parent;
		if (parent){
			if (!isNaN(layout.centerY)){
				this.y=Math.round((parent.height-this.displayHeight)*0.5+layout.centerY+this.pivotY *this.scaleY);
				}else if (!isNaN(layout.top)){
				this.y=Math.round(layout.top+this.pivotY *this.scaleY);
				if (!isNaN(layout.bottom)){
					this.height=(parent._height-layout.top-layout.bottom)/ (this.scaleY || 0.01);
				}
				}else if (!isNaN(layout.bottom)){
				this.y=Math.round(parent.height-this.displayHeight-layout.bottom+this.pivotY *this.scaleY);
			}
		}
	}

	/**
	*对象的 <code>Event.MOUSE_OVER</code> 事件侦听处理函数。
	*/
	__proto.onMouseOver=function(e){
		Laya.stage.event(/*laya.ui.UIEvent.SHOW_TIP*/"showtip",this._toolTip);
	}

	/**
	*对象的 <code>Event.MOUSE_OUT</code> 事件侦听处理函数。
	*/
	__proto.onMouseOut=function(e){
		Laya.stage.event(/*laya.ui.UIEvent.HIDE_TIP*/"hidetip",this._toolTip);
	}

	__proto._childChanged=function(child){
		this.callLater(this.changeSize);
		_super.prototype._childChanged.call(this,child);
	}

	/**
	*<p>对象的显示宽度（以像素为单位）。</p>
	*/
	__getset(0,__proto,'displayWidth',function(){
		return this.width *this.scaleX;
	});

	/**
	*<p>表示显示对象的宽度，以像素为单位。</p>
	*<p><b>注：</b>当值为0时，宽度为自适应大小。</p>
	*/
	__getset(0,__proto,'width',function(){
		if (this._width)return this._width;
		return this.measureWidth;
		},function(value){
		if (this._width !=value){
			this._width=value;
			this.conchModel && this.conchModel.size(this._width,this._height);
			this.callLater(this.changeSize);
			if (this._layout.enable && (!isNaN(this._layout.centerX)|| !isNaN(this._layout.right)|| !isNaN(this._layout.anchorX)))this.resetLayoutX();
		}
	});

	/**
	*<p>显示对象的实际显示区域宽度（以像素为单位）。</p>
	*/
	__getset(0,__proto,'measureWidth',function(){
		var max=0;
		this.commitMeasure();
		for (var i=this.numChildren-1;i >-1;i--){
			var comp=this.getChildAt(i);
			if (comp.visible){
				max=Math.max(comp.x+comp.width *comp.scaleX,max);
			}
		}
		return max;
	});

	/**
	*<p>对象的显示高度（以像素为单位）。</p>
	*/
	__getset(0,__proto,'displayHeight',function(){
		return this.height *this.scaleY;
	});

	/**
	*<p>表示显示对象的高度，以像素为单位。</p>
	*<p><b>注：</b>当值为0时，高度为自适应大小。</p>
	*/
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		return this.measureHeight;
		},function(value){
		if (this._height !=value){
			this._height=value;
			this.conchModel && this.conchModel.size(this._width,this._height);
			this.callLater(this.changeSize);
			if (this._layout.enable && (!isNaN(this._layout.centerY)|| !isNaN(this._layout.bottom)|| !isNaN(this._layout.anchorY)))this.resetLayoutY();
		}
	});

	/**
	*<p>数据赋值，通过对UI赋值来控制UI显示逻辑。</p>
	*<p>简单赋值会更改组件的默认属性，使用大括号可以指定组件的任意属性进行赋值。</p>
	*@example
	//默认属性赋值
	dataSource={label1:"改变了label",checkbox1:true};//(更改了label1的text属性值，更改checkbox1的selected属性)。
	//任意属性赋值
	dataSource={label2:{text:"改变了label",size:14},checkbox2:{selected:true,x:10}};
	*/
	__getset(0,__proto,'dataSource',function(){
		return this._dataSource;
		},function(value){
		this._dataSource=value;
		for (var prop in this._dataSource){
			if (this.hasOwnProperty(prop)&& !((typeof (this[prop])=='function'))){
				this[prop]=this._dataSource[prop];
			}
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'scaleY',_super.prototype._$get_scaleY,function(value){
		if (Laya.superGet(Sprite,this,'scaleY')!=value){
			Laya.superSet(Sprite,this,'scaleY',value);
			this.callLater(this.changeSize);
			this._layout.enable && this.resetLayoutY();
		}
	});

	/**
	*<p>显示对象的实际显示区域高度（以像素为单位）。</p>
	*/
	__getset(0,__proto,'measureHeight',function(){
		var max=0;
		this.commitMeasure();
		for (var i=this.numChildren-1;i >-1;i--){
			var comp=this.getChildAt(i);
			if (comp.visible){
				max=Math.max(comp.y+comp.height *comp.scaleY,max);
			}
		}
		return max;
	});

	/**@inheritDoc */
	__getset(0,__proto,'scaleX',_super.prototype._$get_scaleX,function(value){
		if (Laya.superGet(Sprite,this,'scaleX')!=value){
			Laya.superSet(Sprite,this,'scaleX',value);
			this.callLater(this.changeSize);
			this._layout.enable && this.resetLayoutX();
		}
	});

	/**
	*<p>从组件顶边到其内容区域顶边之间的垂直距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'top',function(){
		return this._layout.top;
		},function(value){
		if (value !=this._layout.top){
			this.getLayout().top=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutY();
	});

	/**
	*<p>从组件底边到其内容区域底边之间的垂直距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'bottom',function(){
		return this._layout.bottom;
		},function(value){
		if (value !=this._layout.bottom){
			this.getLayout().bottom=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutY();
	});

	/**
	*<p>从组件左边到其内容区域左边之间的水平距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'left',function(){
		return this._layout.left;
		},function(value){
		if (value !=this._layout.left){
			this.getLayout().left=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutX();
	});

	/**
	*<p>从组件右边到其内容区域右边之间的水平距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'right',function(){
		return this._layout.right;
		},function(value){
		if (value !=this._layout.right){
			this.getLayout().right=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutX();
	});

	/**
	*<p>在父容器中，此对象的水平方向中轴线与父容器的水平方向中心线的距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'centerX',function(){
		return this._layout.centerX;
		},function(value){
		if (value !=this._layout.centerX){
			this.getLayout().centerX=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutX();
	});

	/**
	*<p>在父容器中，此对象的垂直方向中轴线与父容器的垂直方向中心线的距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'centerY',function(){
		return this._layout.centerY;
		},function(value){
		if (value !=this._layout.centerY){
			this.getLayout().centerY=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutY();
	});

	/**X轴锚点，值为0-1*/
	__getset(0,__proto,'anchorX',function(){
		return this._layout.anchorX;
		},function(value){
		if (value !=this._layout.anchorX){
			this.getLayout().anchorX=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutX();
	});

	/**Y轴锚点，值为0-1*/
	__getset(0,__proto,'anchorY',function(){
		return this._layout.anchorY;
		},function(value){
		if (value !=this._layout.anchorY){
			this.getLayout().anchorY=value;
			this._setLayoutEnabled(true);
		}
		this.resetLayoutY();
	});

	/**
	*<p>对象的标签。</p>
	*@internal 冗余字段，可以用来储存数据。
	*/
	__getset(0,__proto,'tag',function(){
		return this._tag;
		},function(value){
		this._tag=value;
	});

	/**
	*<p>鼠标悬停提示。</p>
	*<p>可以赋值为文本 <code>String</code> 或函数 <code>Handler</code> ，用来实现自定义样式的鼠标提示和参数携带等。</p>
	*@example
	*private var _testTips:TestTipsUI=new TestTipsUI();
	*private function testTips():void {
		//简单鼠标提示
		*btn2.toolTip="这里是鼠标提示&lt;b&gt;粗体&lt;/b&gt;&lt;br&gt;换行";
		//自定义的鼠标提示
		*btn1.toolTip=showTips1;
		//带参数的自定义鼠标提示
		*clip.toolTip=new Handler(this,showTips2,["clip"]);
		*}
	*private function showTips1():void {
		*_testTips.label.text="这里是按钮["+btn1.label+"]";
		*tip.addChild(_testTips);
		*}
	*private function showTips2(name:String):void {
		*_testTips.label.text="这里是"+name;
		*tip.addChild(_testTips);
		*}
	*/
	__getset(0,__proto,'toolTip',function(){
		return this._toolTip;
		},function(value){
		if (this._toolTip !=value){
			this._toolTip=value;
			if (value !=null){
				this.on(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouseOver);
				this.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouseOut);
				}else {
				this.off(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouseOver);
				this.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouseOut);
			}
		}
	});

	/**
	*XML 数据。
	*/
	__getset(0,__proto,'comXml',function(){
		return this._comXml;
		},function(value){
		this._comXml=value;
	});

	/**是否变灰。*/
	__getset(0,__proto,'gray',function(){
		return this._gray;
		},function(value){
		if (value!==this._gray){
			this._gray=value;
			UIUtils.gray(this,value);
		}
	});

	/**是否禁用页面，设置为true后，会变灰并且禁用鼠标。*/
	__getset(0,__proto,'disabled',function(){
		return this._disabled;
		},function(value){
		if (value!==this._disabled){
			this.gray=this._disabled=value;
			this.mouseEnabled=!value;
		}
	});

	return Component;
})(Sprite)


/**
*<code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
*任意对话框打开和关闭，都会出发管理类的open和close事件
*可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
*通过设置对话框的zOrder属性，可以更改弹出的层次
*/
//class laya.ui.DialogManager extends laya.display.Sprite
var DialogManager=(function(_super){
	function DialogManager(){
		/**锁屏层*/
		this.lockLayer=null;
		/**@private 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，如果不想有任何效果，可以赋值为null*/
		this.popupEffect=function(dialog){
			dialog.scale(1,1);
			Tween.from(dialog,{x:Laya.stage.width / 2,y:Laya.stage.height / 2,scaleX:0,scaleY:0},300,Ease.backOut,Handler.create(this,this.doOpen,[dialog]));
		}
		/**@private 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，如果不想有任何效果，可以赋值为null*/
		this.closeEffect=function(dialog,type){
			Tween.to(dialog,{x:Laya.stage.width / 2,y:Laya.stage.height / 2,scaleX:0,scaleY:0},300,Ease.strongOut,Handler.create(this,this.doClose,[dialog,type]));
		}
		DialogManager.__super.call(this);
		this.maskLayer=new Sprite();
		this.popupEffectHandler=new Handler(this,this.popupEffect);
		this.closeEffectHandler=new Handler(this,this.closeEffect);
		this.mouseEnabled=this.maskLayer.mouseEnabled=true;
		this.zOrder=1000;
		Laya.stage.addChild(this);
		Laya.stage.on(/*laya.events.Event.RESIZE*/"resize",this,this._onResize);
		if (UIConfig.closeDialogOnSide)this.maskLayer.on("click",this,this._closeOnSide);
		this._onResize(null);
	}

	__class(DialogManager,'laya.ui.DialogManager',_super);
	var __proto=DialogManager.prototype;
	__proto._closeOnSide=function(){
		var dialog=this.getChildAt(this.numChildren-1);
		if ((dialog instanceof laya.ui.Dialog ))dialog.close("side");
	}

	/**设置锁定界面，如果为空则什么都不显示*/
	__proto.setLockView=function(value){
		if (!this.lockLayer){
			this.lockLayer=new Box();
			this.lockLayer.mouseEnabled=true;
			this.lockLayer.size(Laya.stage.width,Laya.stage.height);
		}
		this.lockLayer.removeChildren();
		if (value){
			value.centerX=value.centerY=0;
			this.lockLayer.addChild(value);
		}
	}

	/**@private */
	__proto._onResize=function(e){
		var width=this.maskLayer.width=Laya.stage.width;
		var height=this.maskLayer.height=Laya.stage.height;
		if (this.lockLayer)this.lockLayer.size(width,height);
		this.maskLayer.graphics.clear();
		this.maskLayer.graphics.drawRect(0,0,width,height,UIConfig.popupBgColor);
		this.maskLayer.alpha=UIConfig.popupBgAlpha;
		for (var i=this.numChildren-1;i >-1;i--){
			var item=this.getChildAt(i);
			if (item.popupCenter)this._centerDialog(item);
		}
	}

	__proto._centerDialog=function(dialog){
		dialog.x=Math.round(((Laya.stage.width-dialog.width)>> 1)+dialog.pivotX);
		dialog.y=Math.round(((Laya.stage.height-dialog.height)>> 1)+dialog.pivotY);
	}

	/**
	*显示对话框(非模式窗口类型)。
	*@param dialog 需要显示的对象框 <code>Dialog</code> 实例。
	*@param closeOther 是否关闭其它对话框，若值为ture，则关闭其它的对话框。
	*@param showEffect 是否显示弹出效果
	*/
	__proto.open=function(dialog,closeOther,showEffect){
		(closeOther===void 0)&& (closeOther=false);
		(showEffect===void 0)&& (showEffect=false);
		if (closeOther)this._closeAll();
		if (dialog.popupCenter)this._centerDialog(dialog);
		this.addChild(dialog);
		if (dialog.isModal || this._$P["hasZorder"])this.timer.callLater(this,this._checkMask);
		if (showEffect && dialog.popupEffect !=null)dialog.popupEffect.runWith(dialog);
		else this.doOpen(dialog);
		this.event(/*laya.events.Event.OPEN*/"open");
	}

	/**
	*执行打开对话框。
	*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
	*@param type 关闭的类型，默认为空
	*/
	__proto.doOpen=function(dialog){
		dialog.onOpened();
	}

	/**
	*锁定所有层，显示加载条信息，防止双击
	*/
	__proto.lock=function(value){
		if (this.lockLayer){
			if (value)this.addChild(this.lockLayer);
			else this.lockLayer.removeSelf();
		}
	}

	/**
	*关闭对话框。
	*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
	*@param type 关闭的类型，默认为空
	*@param showEffect 是否显示弹出效果
	*/
	__proto.close=function(dialog,type,showEffect){
		(showEffect===void 0)&& (showEffect=false);
		if (showEffect && dialog.closeEffect !=null)dialog.closeEffect.runWith([dialog,type]);
		else this.doClose(dialog,type);
		this.event(/*laya.events.Event.CLOSE*/"close");
	}

	/**
	*执行关闭对话框。
	*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
	*@param type 关闭的类型，默认为空
	*/
	__proto.doClose=function(dialog,type){
		dialog.removeSelf();
		dialog.isModal && this._checkMask();
		dialog.closeHandler && dialog.closeHandler.runWith(type);
		dialog.onClosed(type);
	}

	/**
	*关闭所有的对话框。
	*/
	__proto.closeAll=function(){
		this._closeAll();
		this.event(/*laya.events.Event.CLOSE*/"close");
	}

	/**@private */
	__proto._closeAll=function(){
		for (var i=this.numChildren-1;i >-1;i--){
			var item=this.getChildAt(i);
			if (item && item.close !=null){
				this.doClose(item);
			}
		}
	}

	/**
	*根据组获取所有对话框
	*@param group 组名称
	*@return 对话框数组
	*/
	__proto.getDialogsByGroup=function(group){
		var arr=[];
		for (var i=this.numChildren-1;i >-1;i--){
			var item=this.getChildAt(i);
			if (item && item.group===group){
				arr.push(item);
			}
		}
		return arr;
	}

	/**
	*根据组关闭所有弹出框
	*@param group 需要关闭的组名称
	*@return 需要关闭的对话框数组
	*/
	__proto.closeByGroup=function(group){
		var arr=[];
		for (var i=this.numChildren-1;i >-1;i--){
			var item=this.getChildAt(i);
			if (item && item.group===group){
				item.close();
				arr.push(item);
			}
		}
		return arr;
	}

	/**@private 发生层次改变后，重新检查遮罩层是否正确*/
	__proto._checkMask=function(){
		this.maskLayer.removeSelf();
		for (var i=this.numChildren-1;i >-1;i--){
			var dialog=this.getChildAt(i);
			if (dialog && dialog.isModal){
				this.addChildAt(this.maskLayer,i);
				return;
			}
		}
	}

	return DialogManager;
})(Sprite)


/**
*<code>Image</code> 类是用于表示位图图像或绘制图形的显示对象。
*Image和Clip组件是唯一支持异步加载的两个组件，比如img.skin="abc/xxx.png"，其他UI组件均不支持异步加载。
*
*@example <caption>以下示例代码，创建了一个新的 <code>Image</code> 实例，设置了它的皮肤、位置信息，并添加到舞台上。</caption>
*package
*{
	*import laya.ui.Image;
	*public class Image_Example
	*{
		*public function Image_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*var bg:Image=new Image("resource/ui/bg.png");//创建一个 Image 类的实例对象 bg ,并传入它的皮肤。
			*bg.x=100;//设置 bg 对象的属性 x 的值，用于控制 bg 对象的显示位置。
			*bg.y=100;//设置 bg 对象的属性 y 的值，用于控制 bg 对象的显示位置。
			*bg.sizeGrid="40,10,5,10";//设置 bg 对象的网格信息。
			*bg.width=150;//设置 bg 对象的宽度。
			*bg.height=250;//设置 bg 对象的高度。
			*Laya.stage.addChild(bg);//将此 bg 对象添加到显示列表。
			*var image:Image=new Image("resource/ui/image.png");//创建一个 Image 类的实例对象 image ,并传入它的皮肤。
			*image.x=100;//设置 image 对象的属性 x 的值，用于控制 image 对象的显示位置。
			*image.y=100;//设置 image 对象的属性 y 的值，用于控制 image 对象的显示位置。
			*Laya.stage.addChild(image);//将此 image 对象添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*onInit();
*function onInit(){
	*var bg=new laya.ui.Image("resource/ui/bg.png");//创建一个 Image 类的实例对象 bg ,并传入它的皮肤。
	*bg.x=100;//设置 bg 对象的属性 x 的值，用于控制 bg 对象的显示位置。
	*bg.y=100;//设置 bg 对象的属性 y 的值，用于控制 bg 对象的显示位置。
	*bg.sizeGrid="40,10,5,10";//设置 bg 对象的网格信息。
	*bg.width=150;//设置 bg 对象的宽度。
	*bg.height=250;//设置 bg 对象的高度。
	*Laya.stage.addChild(bg);//将此 bg 对象添加到显示列表。
	*var image=new laya.ui.Image("resource/ui/image.png");//创建一个 Image 类的实例对象 image ,并传入它的皮肤。
	*image.x=100;//设置 image 对象的属性 x 的值，用于控制 image 对象的显示位置。
	*image.y=100;//设置 image 对象的属性 y 的值，用于控制 image 对象的显示位置。
	*Laya.stage.addChild(image);//将此 image 对象添加到显示列表。
	*}
*@example
*class Image_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*var bg:laya.ui.Image=new laya.ui.Image("resource/ui/bg.png");//创建一个 Image 类的实例对象 bg ,并传入它的皮肤。
		*bg.x=100;//设置 bg 对象的属性 x 的值，用于控制 bg 对象的显示位置。
		*bg.y=100;//设置 bg 对象的属性 y 的值，用于控制 bg 对象的显示位置。
		*bg.sizeGrid="40,10,5,10";//设置 bg 对象的网格信息。
		*bg.width=150;//设置 bg 对象的宽度。
		*bg.height=250;//设置 bg 对象的高度。
		*Laya.stage.addChild(bg);//将此 bg 对象添加到显示列表。
		*var image:laya.ui.Image=new laya.ui.Image("resource/ui/image.png");//创建一个 Image 类的实例对象 image ,并传入它的皮肤。
		*image.x=100;//设置 image 对象的属性 x 的值，用于控制 image 对象的显示位置。
		*image.y=100;//设置 image 对象的属性 y 的值，用于控制 image 对象的显示位置。
		*Laya.stage.addChild(image);//将此 image 对象添加到显示列表。
		*}
	*}
*@see laya.ui.AutoBitmap
*/
//class laya.ui.Image extends laya.ui.Component
var Image=(function(_super){
	function Image(skin){
		/**@private */
		this._bitmap=null;
		/**@private */
		this._skin=null;
		/**@private */
		this._group=null;
		Image.__super.call(this);
		this.skin=skin;
	}

	__class(Image,'laya.ui.Image',_super);
	var __proto=Image.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,true);
		this._bitmap && this._bitmap.destroy();
		this._bitmap=null;
	}

	/**
	*销毁对象并释放加载的皮肤资源。
	*/
	__proto.dispose=function(){
		this.destroy(true);
		Laya.loader.clearRes(this._skin);
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.graphics=this._bitmap=new AutoBitmap();
		this._bitmap.autoCacheCmd=false;
	}

	/**
	*@private
	*设置皮肤资源。
	*/
	__proto.setSource=function(url,img){
		if (url===this._skin && img){
			this.source=img
			this.onCompResize();
		}
	}

	/**
	*@copy laya.ui.AutoBitmap#source
	*/
	__getset(0,__proto,'source',function(){
		return this._bitmap.source;
		},function(value){
		if (!this._bitmap)return;
		this._bitmap.source=value;
		this.event(/*laya.events.Event.LOADED*/"loaded");
		this.repaint();
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='string'))this.skin=value;
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureHeight',function(){
		return this._bitmap.height;
	});

	/**
	*<p>对象的皮肤地址，以字符串表示。</p>
	*<p>如果资源未加载，则先加载资源，加载完成后应用于此对象。</p>
	*<b>注意：</b>资源加载完成后，会自动缓存至资源库中。
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (value){
				var source=Loader.getRes(value);
				if (source){
					this.source=source;
					this.onCompResize();
				}else Laya.loader.load(this._skin,Handler.create(this,this.setSource,[this._skin]),null,/*laya.net.Loader.IMAGE*/"image",1,true,this._group);
				}else {
				this.source=null;
			}
		}
	});

	/**
	*资源分组。
	*/
	__getset(0,__proto,'group',function(){
		return this._group;
		},function(value){
		if (value && this._skin)Loader.setGroup(this._skin,value);
		this._group=value;
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"。</li></ul></p>
	*@see laya.ui.AutoBitmap#sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
		return null;
		},function(value){
		this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureWidth',function(){
		return this._bitmap.width;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Component,this,'width',value);
		this._bitmap.width=value==0 ? 0.0000001 :value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Component,this,'height',value);
		this._bitmap.height=value==0 ? 0.0000001 :value;
	});

	return Image;
})(Component)


/**
*<code>Box</code> 类是一个控件容器类。
*/
//class laya.ui.Box extends laya.ui.Component
var Box=(function(_super){
	function Box(){
		Box.__super.call(this);;
	}

	__class(Box,'laya.ui.Box',_super);
	var __proto=Box.prototype;
	Laya.imps(__proto,{"laya.ui.IBox":true})
	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		for (var name in value){
			var comp=this.getChildByName(name);
			if (comp)comp.dataSource=value[name];
			else if (this.hasOwnProperty(name)&& !((typeof (this[name])=='function')))this[name]=value[name];
		}
	});

	return Box;
})(Component)


/**
*<code>Button</code> 组件用来表示常用的多态按钮。 <code>Button</code> 组件可显示文本标签、图标或同时显示两者。 *
*<p>可以是单态，两态和三态，默认三态(up,over,down)。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>Button</code> 实例。</caption>
*package
*{
	*import laya.ui.Button;
	*import laya.utils.Handler;
	*public class Button_Example
	*{
		*public function Button_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/button.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var button:Button=new Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,并传入它的皮肤。
			*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
			*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
			*button.clickHandler=new Handler(this,onClickButton,[button]);//设置 button 的点击事件处理器。
			*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
			*}
		*private function onClickButton(button:Button):void
		*{
			*trace("按钮button被点击了！");
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete()
*{
	*console.log("资源加载完成！");
	*var button=new laya.ui.Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,传入它的皮肤skin和标签label。
	*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
	*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
	*button.clickHandler=laya.utils.Handler.create(this,onClickButton,[button],false);//设置 button 的点击事件处理函数。
	*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
	*}
*function onClickButton(button)
*{
	*console.log("按钮被点击了。",button);
	*}
*@example
*import Button=laya.ui.Button;
*import Handler=laya.utils.Handler;
*class Button_Example{
	*constructor()
	*{
		*Laya.init(640,800);
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete()
	*{
		*var button:Button=new Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,并传入它的皮肤。
		*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
		*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
		*button.clickHandler=new Handler(this,this.onClickButton,[button]);//设置 button 的点击事件处理器。
		*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
		*}
	*private onClickButton(button:Button):void
	*{
		*console.log("按钮button被点击了！")
		*}
	*}
*/
//class laya.ui.Button extends laya.ui.Component
var Button=(function(_super){
	function Button(skin,label){
		/**
		*指定按钮按下时是否是切换按钮的显示状态。
		*
		*@example 以下示例代码，创建了一个 <code>Button</code> 实例，并设置为切换按钮。
		*@example
		*package
		*{
			*import laya.ui.Button;
			*import laya.utils.Handler;
			*public class Button_toggle
			*{
				*public function Button_toggle()
				*{
					*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
					*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
					*Laya.loader.load("resource/ui/button.png",Handler.create(this,onLoadComplete));
					*}
				*private function onLoadComplete():void
				*{
					*trace("资源加载完成！");
					*var button:Button=new Button("resource/ui/button.png","label");//创建一个 Button 实例对象 button ,传入它的皮肤skin和标签label。
					*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
					*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
					*button.toggle=true;//设置 button 对象为切换按钮。
					*button.clickHandler=new Handler(this,onClickButton,[button]);//设置 button 的点击事件处理器。
					*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
					*}
				*private function onClickButton(button:Button):void
				*{
					*trace("button.selected = "+button.selected);
					*}
				*}
			*}
		*@example
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,loadComplete));//加载资源
		*function loadComplete()
		*{
			*console.log("资源加载完成！");
			*var button=new laya.ui.Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,传入它的皮肤skin和标签label。
			*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
			*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
			*button.toggle=true;//设置 button 对象为切换按钮。
			*button.clickHandler=laya.utils.Handler.create(this,onClickButton,[button],false);//设置 button 的点击事件处理器。
			*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
			*}
		*function onClickButton(button)
		*{
			*console.log("button.selected = ",button.selected);
			*}
		*@example
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("button.png",null,null,null,null,null);//加载资源
		*function loadComplete(){
			*console.log("资源加载完成！");
			*var button:laya.ui.Button=new laya.ui.Button("button.png","label");//创建一个 Button 类的实例对象 button ,传入它的皮肤skin和标签label。
			*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
			*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
			*button.toggle=true;//设置 button 对象为切换按钮。
			*button.clickHandler=laya.utils.Handler.create(this,onClickButton,[button],false);//设置 button 的点击事件处理器。
			*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
			*}
		*function onClickButton(button){
			*console.log("button.selected = ",button.selected);
			*}
		*/
		this.toggle=false;
		/**
		*@private
		*/
		this._bitmap=null;
		/**
		*@private
		*按钮上的文本。
		*/
		this._text=null;
		/**
		*@private
		*按钮文本标签描边的颜色值。
		*/
		this._strokeColors=null;
		/**
		*@private
		*按钮的状态值。
		*/
		this._state=0;
		/**
		*@private
		*表示按钮的选中状态。
		*/
		this._selected=false;
		/**
		*@private
		*按钮的皮肤资源。
		*/
		this._skin=null;
		/**
		*@private
		*指定此显示对象是否自动计算并改变大小等属性。
		*/
		this._autoSize=true;
		/**
		*@private
		*源数据。
		*/
		this._sources=null;
		/**
		*@private
		*按钮的点击事件函数。
		*/
		this._clickHandler=null;
		/**
		*@private
		*/
		this._stateChanged=false;
		Button.__super.call(this);
		this._labelColors=Styles.buttonLabelColors;
		this._stateNum=Styles.buttonStateNum;
		(label===void 0)&& (label="");
		this.skin=skin;
		this.label=label;
	}

	__class(Button,'laya.ui.Button',_super);
	var __proto=Button.prototype;
	Laya.imps(__proto,{"laya.ui.ISelect":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bitmap && this._bitmap.destroy();
		this._text && this._text.destroy(destroyChild);
		this._bitmap=null;
		this._text=null;
		this._clickHandler=null;
		this._labelColors=this._sources=this._strokeColors=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.graphics=this._bitmap=new AutoBitmap();
	}

	/**@private */
	__proto.createText=function(){
		if (!this._text){
			this._text=new Text();
			this._text.overflow=Text.HIDDEN;
			this._text.align="center";
			this._text.valign="middle";
			this._text.width=this._width;
			this._text.height=this._height;
		}
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		if (this._mouseEnableState!==1){
			this.mouseEnabled=true;
			this._setBit(/*laya.display.Node.MOUSEENABLE*/0x2,true);
		}
		this._createListener(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.CLICK*/"click",this,this.onMouse,null,false,false);
	}

	/**
	*对象的 <code>Event.MOUSE_OVER、Event.MOUSE_OUT、Event.MOUSE_DOWN、Event.MOUSE_UP、Event.CLICK</code> 事件侦听处理函数。
	*@param e Event 对象。
	*/
	__proto.onMouse=function(e){
		if (this.toggle===false && this._selected)return;
		if (e.type===/*laya.events.Event.CLICK*/"click"){
			this.toggle && (this.selected=!this._selected);
			this._clickHandler && this._clickHandler.run();
			return;
		}
		!this._selected && (this.state=Button.stateMap[e.type]);
	}

	/**
	*@private
	*对象的资源切片发生改变。
	*/
	__proto.changeClips=function(){
		var img=Loader.getRes(this._skin);
		if (!img){
			console.log("lose skin",this._skin);
			return;
		};
		var width=img.sourceWidth;
		var height=img.sourceHeight / this._stateNum;
		img.$_GID || (img.$_GID=Utils.getGID());
		var key=img.$_GID+"-"+this._stateNum;
		var clips=WeakObject.I.get(key);
		if (!Utils.isOkTextureList(clips)){
			clips=null;
		}
		if (clips)this._sources=clips;
		else {
			this._sources=[];
			if (this._stateNum===1){
				this._sources.push(img);
				}else {
				for (var i=0;i < this._stateNum;i++){
					this._sources.push(Texture.createFromTexture(img,0,height *i,width,height));
				}
			}
			WeakObject.I.set(key,this._sources);
		}
		if (this._autoSize){
			this._bitmap.width=this._width || width;
			this._bitmap.height=this._height || height;
			if (this._text){
				this._text.width=this._bitmap.width;
				this._text.height=this._bitmap.height;
			}
			}else {
			this._text && (this._text.x=width);
		}
	}

	/**
	*@private
	*改变对象的状态。
	*/
	__proto.changeState=function(){
		this._stateChanged=false;
		this.runCallLater(this.changeClips);
		var index=this._state < this._stateNum ? this._state :this._stateNum-1;
		this._sources && (this._bitmap.source=this._sources[index]);
		if (this.label){
			this._text.color=this._labelColors[index];
			if (this._strokeColors)this._text.strokeColor=this._strokeColors[index];
		}
	}

	/**@private */
	__proto._setStateChanged=function(){
		if (!this._stateChanged){
			this._stateChanged=true;
			this.callLater(this.changeState);
		}
	}

	/**
	*<p>描边颜色，以字符串表示。</p>
	*默认值为 "#000000"（黑色）;
	*@see laya.display.Text.strokeColor()
	*/
	__getset(0,__proto,'labelStrokeColor',function(){
		this.createText();
		return this._text.strokeColor;
		},function(value){
		this.createText();
		this._text.strokeColor=value
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'measureHeight',function(){
		this.runCallLater(this.changeClips);
		return this._text ? Math.max(this._bitmap.height,this._text.height):this._bitmap.height;
	});

	/**
	*<p>对象的皮肤资源地址。</p>
	*支持单态，两态和三态，用 <code>stateNum</code> 属性设置
	*<p>对象的皮肤地址，以字符串表示。</p>
	*@see #stateNum
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			this.callLater(this.changeClips);
			this._setStateChanged();
		}
	});

	/**
	*对象的状态值。
	*@see #stateMap
	*/
	__getset(0,__proto,'state',function(){
		return this._state;
		},function(value){
		if (this._state !=value){
			this._state=value;
			this._setStateChanged();
		}
	});

	/**
	*按钮文本标签 <code>Text</code> 控件。
	*/
	__getset(0,__proto,'text',function(){
		this.createText();
		return this._text;
	});

	/**
	*<p>指定对象的状态值，以数字表示。</p>
	*<p>默认值为3。此值决定皮肤资源图片的切割方式。</p>
	*<p><b>取值：</b>
	*<li>1：单态。图片不做切割，按钮的皮肤状态只有一种。</li>
	*<li>2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为
	*弹起状态皮肤、
	*按下和经过及选中状态皮肤。</li>
	*<li>3：三态。图片将以竖直方向被等比切割为3部分，从上向下，依次为
	*弹起状态皮肤、
	*经过状态皮肤、
	*按下和选中状态皮肤</li>
	*</p>
	*/
	__getset(0,__proto,'stateNum',function(){
		return this._stateNum;
		},function(value){
		if ((typeof value=='string')){
			value=parseInt(value);
		}
		if (this._stateNum !=value){
			this._stateNum=value < 1 ? 1 :value > 3 ? 3 :value;
			this.callLater(this.changeClips);
		}
	});

	/**
	*表示按钮各个状态下的描边颜色。
	*<p><b>格式:</b> "upColor,overColor,downColor,disableColor"。</p>
	*/
	__getset(0,__proto,'strokeColors',function(){
		return this._strokeColors ? this._strokeColors.join(","):"";
		},function(value){
		this._strokeColors=UIUtils.fillArray(Styles.buttonLabelColors,value,String);
		this._setStateChanged();
	});

	/**
	*表示按钮各个状态下的文本颜色。
	*<p><b>格式:</b> "upColor,overColor,downColor,disableColor"。</p>
	*/
	__getset(0,__proto,'labelColors',function(){
		return this._labelColors.join(",");
		},function(value){
		this._labelColors=UIUtils.fillArray(Styles.buttonLabelColors,value,String);
		this._setStateChanged();
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'measureWidth',function(){
		this.runCallLater(this.changeClips);
		if (this._autoSize)return this._bitmap.width;
		this.runCallLater(this.changeState);
		return this._bitmap.width+(this._text ? this._text.width :0);
	});

	/**
	*按钮的文本内容。
	*/
	__getset(0,__proto,'label',function(){
		return this._text ? this._text.text :null;
		},function(value){
		if (!this._text && !value)return;
		this.createText();
		if (this._text.text !=value){
			value && !this._text.parent && this.addChild(this._text);
			this._text.text=(value+"").replace(/\\n/g,"\n");
			this._setStateChanged();
		}
	});

	/**
	*表示按钮的选中状态。
	*<p>如果值为true，表示该对象处于选中状态。否则该对象处于未选中状态。</p>
	*/
	__getset(0,__proto,'selected',function(){
		return this._selected;
		},function(value){
		if (this._selected !=value){
			this._selected=value;
			this.state=this._selected ? 2 :0;
			this.event(/*laya.events.Event.CHANGE*/"change");
		}
	});

	/**
	*表示按钮文本标签的边距。
	*<p><b>格式：</b>"上边距,右边距,下边距,左边距"。</p>
	*/
	__getset(0,__proto,'labelPadding',function(){
		this.createText();
		return this._text.padding.join(",");
		},function(value){
		this.createText();
		this._text.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
	});

	/**
	*表示按钮文本标签的字体大小。
	*@see laya.display.Text.fontSize()
	*/
	__getset(0,__proto,'labelSize',function(){
		this.createText();
		return this._text.fontSize;
		},function(value){
		this.createText();
		this._text.fontSize=value
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*默认值0，表示不描边。
	*@see laya.display.Text.stroke()
	*/
	__getset(0,__proto,'labelStroke',function(){
		this.createText();
		return this._text.stroke;
		},function(value){
		this.createText();
		this._text.stroke=value
	});

	/**
	*表示按钮文本标签是否为粗体字。
	*@see laya.display.Text.bold()
	*/
	__getset(0,__proto,'labelBold',function(){
		this.createText();
		return this._text.bold;
		},function(value){
		this.createText();
		this._text.bold=value;
	});

	/**
	*表示按钮文本标签的字体名称，以字符串形式表示。
	*@see laya.display.Text.font()
	*/
	__getset(0,__proto,'labelFont',function(){
		this.createText();
		return this._text.font;
		},function(value){
		this.createText();
		this._text.font=value;
	});

	/**标签对齐模式，默认为居中对齐。*/
	__getset(0,__proto,'labelAlign',function(){
		this.createText()
		return this._text.align;
		},function(value){
		this.createText()
		this._text.align=value;
	});

	/**
	*对象的点击事件处理器函数（无默认参数）。
	*/
	__getset(0,__proto,'clickHandler',function(){
		return this._clickHandler;
		},function(value){
		this._clickHandler=value;
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
		return null;
		},function(value){
		this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Component,this,'width',value);
		if (this._autoSize){
			this._bitmap.width=value;
			this._text && (this._text.width=value);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Component,this,'height',value);
		if (this._autoSize){
			this._bitmap.height=value;
			this._text && (this._text.height=value);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.label=value+"";
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**图标x,y偏移，格式：100,100*/
	__getset(0,__proto,'iconOffset',function(){
		return this._bitmap._offset ? this._bitmap._offset.join(","):null;
		},function(value){
		if (value)this._bitmap._offset=UIUtils.fillArray([1,1],value,Number);
		else this._bitmap._offset=[];
	});

	__static(Button,
	['stateMap',function(){return this.stateMap={"mouseup":0,"mouseover":1,"mousedown":2,"mouseout":0};}
	]);
	return Button;
})(Component)


/**
*<p> <code>Clip</code> 类是位图切片动画。</p>
*<p> <code>Clip</code> 可将一张图片，按横向分割数量 <code>clipX</code> 、竖向分割数量 <code>clipY</code> ，
*或横向分割每个切片的宽度 <code>clipWidth</code> 、竖向分割每个切片的高度 <code>clipHeight</code> ，
*从左向右，从上到下，分割组合为一个切片动画。</p>
*Image和Clip组件是唯一支持异步加载的两个组件，比如clip.skin="abc/xxx.png"，其他UI组件均不支持异步加载。
*
*@example <caption>以下示例代码，创建了一个 <code>Clip</code> 实例。</caption>
*package
*{
	*import laya.ui.Clip;
	*public class Clip_Example
	*{
		*private var clip:Clip;
		*public function Clip_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*clip=new Clip("resource/ui/clip_num.png",10,1);//创建一个 Clip 类的实例对象 clip ,传入它的皮肤skin和横向分割数量、竖向分割数量。
			*clip.autoPlay=true;//设置 clip 动画自动播放。
			*clip.interval=100;//设置 clip 动画的播放时间间隔。
			*clip.x=100;//设置 clip 对象的属性 x 的值，用于控制 clip 对象的显示位置。
			*clip.y=100;//设置 clip 对象的属性 y 的值，用于控制 clip 对象的显示位置。
			*clip.on(Event.CLICK,this,onClick);//给 clip 添加点击事件函数侦听。
			*Laya.stage.addChild(clip);//将此 clip 对象添加到显示列表。
			*}
		*private function onClick():void
		*{
			*trace("clip 的点击事件侦听处理函数。clip.total="+clip.total);
			*if (clip.isPlaying==true)
			*{
				*clip.stop();//停止动画。
				*}else {
				*clip.play();//播放动画。
				*}
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var clip;
*Laya.loader.load("resource/ui/clip_num.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete(){
	*console.log("资源加载完成！");
	*clip=new laya.ui.Clip("resource/ui/clip_num.png",10,1);//创建一个 Clip 类的实例对象 clip ,传入它的皮肤skin和横向分割数量、竖向分割数量。
	*clip.autoPlay=true;//设置 clip 动画自动播放。
	*clip.interval=100;//设置 clip 动画的播放时间间隔。
	*clip.x=100;//设置 clip 对象的属性 x 的值，用于控制 clip 对象的显示位置。
	*clip.y=100;//设置 clip 对象的属性 y 的值，用于控制 clip 对象的显示位置。
	*clip.on(Event.CLICK,this,onClick);//给 clip 添加点击事件函数侦听。
	*Laya.stage.addChild(clip);//将此 clip 对象添加到显示列表。
	*}
*function onClick()
*{
	*console.log("clip 的点击事件侦听处理函数。");
	*if(clip.isPlaying==true)
	*{
		*clip.stop();
		*}else {
		*clip.play();
		*}
	*}
*@example
*import Clip=laya.ui.Clip;
*import Handler=laya.utils.Handler;
*class Clip_Example {
	*private clip:Clip;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*this.clip=new Clip("resource/ui/clip_num.png",10,1);//创建一个 Clip 类的实例对象 clip ,传入它的皮肤skin和横向分割数量、竖向分割数量。
		*this.clip.autoPlay=true;//设置 clip 动画自动播放。
		*this.clip.interval=100;//设置 clip 动画的播放时间间隔。
		*this.clip.x=100;//设置 clip 对象的属性 x 的值，用于控制 clip 对象的显示位置。
		*this.clip.y=100;//设置 clip 对象的属性 y 的值，用于控制 clip 对象的显示位置。
		*this.clip.on(laya.events.Event.CLICK,this,this.onClick);//给 clip 添加点击事件函数侦听。
		*Laya.stage.addChild(this.clip);//将此 clip 对象添加到显示列表。
		*}
	*private onClick():void {
		*console.log("clip 的点击事件侦听处理函数。clip.total="+this.clip.total);
		*if (this.clip.isPlaying==true){
			*this.clip.stop();//停止动画。
			*}else {
			*this.clip.play();//播放动画。
			*}
		*}
	*}
*
*/
//class laya.ui.Clip extends laya.ui.Component
var Clip=(function(_super){
	function Clip(url,clipX,clipY){
		/**@private */
		this._sources=null;
		/**@private */
		this._bitmap=null;
		/**@private */
		this._skin=null;
		/**@private */
		this._clipX=1;
		/**@private */
		this._clipY=1;
		/**@private */
		this._clipWidth=0;
		/**@private */
		this._clipHeight=0;
		/**@private */
		this._autoPlay=false;
		/**@private */
		this._interval=50;
		/**@private */
		this._complete=null;
		/**@private */
		this._isPlaying=false;
		/**@private */
		this._index=0;
		/**@private */
		this._clipChanged=false;
		/**@private */
		this._group=null;
		/**@private */
		this._toIndex=-1;
		Clip.__super.call(this);
		(clipX===void 0)&& (clipX=1);
		(clipY===void 0)&& (clipY=1);
		this._clipX=clipX;
		this._clipY=clipY;
		this.skin=url;
	}

	__class(Clip,'laya.ui.Clip',_super);
	var __proto=Clip.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,true);
		this._bitmap && this._bitmap.destroy();
		this._bitmap=null;
		this._sources=null;
	}

	/**
	*销毁对象并释放加载的皮肤资源。
	*/
	__proto.dispose=function(){
		this.destroy(true);
		Laya.loader.clearRes(this._skin);
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.graphics=this._bitmap=new AutoBitmap();
	}

	/**@private */
	__proto._onDisplay=function(e){
		if (this._isPlaying){
			if (this._displayedInStage)this.play();
			else this.stop();
			}else if (this._autoPlay){
			this.play();
		}
	}

	/**
	*@private
	*改变切片的资源、切片的大小。
	*/
	__proto.changeClip=function(){
		this._clipChanged=false;
		if (!this._skin)return;
		var img=Loader.getRes(this._skin);
		if (img){
			this.loadComplete(this._skin,img);
			}else {
			Laya.loader.load(this._skin,Handler.create(this,this.loadComplete,[this._skin]));
		}
	}

	/**
	*@private
	*加载切片图片资源完成函数。
	*@param url 资源地址。
	*@param img 纹理。
	*/
	__proto.loadComplete=function(url,img){
		if (url===this._skin && img){
			var w=this._clipWidth || Math.ceil(img.sourceWidth / this._clipX);
			var h=this._clipHeight || Math.ceil(img.sourceHeight / this._clipY);
			var key=this._skin+w+h;
			var clips=WeakObject.I.get(key);
			if (!Utils.isOkTextureList(clips)){
				clips=null;
			}
			if (clips)this._sources=clips;
			else {
				this._sources=[];
				for (var i=0;i < this._clipY;i++){
					for (var j=0;j < this._clipX;j++){
						this._sources.push(Texture.createFromTexture(img,w *j,h *i,w,h));
					}
				}
				WeakObject.I.set(key,this._sources);
			}
			this.index=this._index;
			this.event(/*laya.events.Event.LOADED*/"loaded");
			this.onCompResize();
		}
	}

	/**
	*播放动画。
	*@param from 开始索引
	*@param to 结束索引，-1为不限制
	*/
	__proto.play=function(from,to){
		(from===void 0)&& (from=0);
		(to===void 0)&& (to=-1);
		this._isPlaying=true;
		this.index=from;
		this._toIndex=to;
		this._index++;
		Laya.timer.loop(this.interval,this,this._loop);
		this.on(/*laya.events.Event.DISPLAY*/"display",this,this._onDisplay);
		this.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._onDisplay);
	}

	/**
	*@private
	*/
	__proto._loop=function(){
		if (this._style.visible && this._sources){
			this._index++;
			if (this._toIndex >-1 && this._index >=this._toIndex)this.stop();
			else if (this._index >=this._sources.length)this._index=0;
			this.index=this._index;
		}
	}

	/**
	*停止动画。
	*/
	__proto.stop=function(){
		this._isPlaying=false;
		Laya.timer.clear(this,this._loop);
		this.event(/*laya.events.Event.COMPLETE*/"complete");
	}

	/**@private */
	__proto._setClipChanged=function(){
		if (!this._clipChanged){
			this._clipChanged=true;
			this.callLater(this.changeClip);
		}
	}

	/**
	*表示动画播放间隔时间(以毫秒为单位)。
	*/
	__getset(0,__proto,'interval',function(){
		return this._interval;
		},function(value){
		if (this._interval !=value){
			this._interval=value;
			if (this._isPlaying)this.play();
		}
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (value){
				this._setClipChanged()
				}else {
				this._bitmap.source=null;
			}
		}
	});

	/**
	*源数据。
	*/
	__getset(0,__proto,'sources',function(){
		return this._sources;
		},function(value){
		this._sources=value;
		this.index=this._index;
		this.event(/*laya.events.Event.LOADED*/"loaded");
	});

	/**X轴（横向）切片数量。*/
	__getset(0,__proto,'clipX',function(){
		return this._clipX;
		},function(value){
		this._clipX=value || 1;
		this._setClipChanged()
	});

	/**Y轴(竖向)切片数量。*/
	__getset(0,__proto,'clipY',function(){
		return this._clipY;
		},function(value){
		this._clipY=value || 1;
		this._setClipChanged()
	});

	/**
	*切片动画的总帧数。
	*/
	__getset(0,__proto,'total',function(){
		this.runCallLater(this.changeClip);
		return this._sources ? this._sources.length :0;
	});

	/**
	*横向分割时每个切片的宽度，与 <code>clipX</code> 同时设置时优先级高于 <code>clipX</code> 。
	*/
	__getset(0,__proto,'clipWidth',function(){
		return this._clipWidth;
		},function(value){
		this._clipWidth=value;
		this._setClipChanged()
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
		return null;
		},function(value){
		this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
	});

	/**
	*资源分组。
	*/
	__getset(0,__proto,'group',function(){
		return this._group;
		},function(value){
		if (value && this._skin)Loader.setGroup(this._skin,value);
		this._group=value;
	});

	/**
	*竖向分割时每个切片的高度，与 <code>clipY</code> 同时设置时优先级高于 <code>clipY</code> 。
	*/
	__getset(0,__proto,'clipHeight',function(){
		return this._clipHeight;
		},function(value){
		this._clipHeight=value;
		this._setClipChanged()
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Component,this,'width',value);
		this._bitmap.width=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Component,this,'height',value);
		this._bitmap.height=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureWidth',function(){
		this.runCallLater(this.changeClip);
		return this._bitmap.width;
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureHeight',function(){
		this.runCallLater(this.changeClip);
		return this._bitmap.height;
	});

	/**
	*当前帧索引。
	*/
	__getset(0,__proto,'index',function(){
		return this._index;
		},function(value){
		this._index=value;
		this._bitmap && this._sources && (this._bitmap.source=this._sources[value]);
		this.event(/*laya.events.Event.CHANGE*/"change");
	});

	/**
	*表示是否自动播放动画，若自动播放值为true,否则值为false;
	*<p>可控制切片动画的播放、停止。</p>
	*/
	__getset(0,__proto,'autoPlay',function(){
		return this._autoPlay;
		},function(value){
		if (this._autoPlay !=value){
			this._autoPlay=value;
			value ? this.play():this.stop();
		}
	});

	/**
	*表示动画的当前播放状态。
	*如果动画正在播放中，则为true，否则为flash。
	*/
	__getset(0,__proto,'isPlaying',function(){
		return this._isPlaying;
		},function(value){
		this._isPlaying=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.index=parseInt(value);
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**
	*<code>AutoBitmap</code> 位图实例。
	*/
	__getset(0,__proto,'bitmap',function(){
		return this._bitmap;
	});

	return Clip;
})(Component)


/**
*<code>ColorPicker</code> 组件将显示包含多个颜色样本的列表，用户可以从中选择颜色。
*
*@example <caption>以下示例代码，创建了一个 <code>ColorPicker</code> 实例。</caption>
*package
*{
	*import laya.ui.ColorPicker;
	*import laya.utils.Handler;
	*public class ColorPicker_Example
	*{
		*public function ColorPicker_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/color.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var colorPicket:ColorPicker=new ColorPicker();//创建一个 ColorPicker 类的实例对象 colorPicket 。
			*colorPicket.skin="resource/ui/color.png";//设置 colorPicket 的皮肤。
			*colorPicket.x=100;//设置 colorPicket 对象的属性 x 的值，用于控制 colorPicket 对象的显示位置。
			*colorPicket.y=100;//设置 colorPicket 对象的属性 y 的值，用于控制 colorPicket 对象的显示位置。
			*colorPicket.changeHandler=new Handler(this,onChangeColor,[colorPicket]);//设置 colorPicket 的颜色改变回调函数。
			*Laya.stage.addChild(colorPicket);//将此 colorPicket 对象添加到显示列表。
			*}
		*private function onChangeColor(colorPicket:ColorPicker):void
		*{
			*trace("当前选择的颜色： "+colorPicket.selectedColor);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load("resource/ui/color.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete()
*{
	*console.log("资源加载完成！");
	*var colorPicket=new laya.ui.ColorPicker();//创建一个 ColorPicker 类的实例对象 colorPicket 。
	*colorPicket.skin="resource/ui/color.png";//设置 colorPicket 的皮肤。
	*colorPicket.x=100;//设置 colorPicket 对象的属性 x 的值，用于控制 colorPicket 对象的显示位置。
	*colorPicket.y=100;//设置 colorPicket 对象的属性 y 的值，用于控制 colorPicket 对象的显示位置。
	*colorPicket.changeHandler=laya.utils.Handler.create(this,onChangeColor,[colorPicket],false);//设置 colorPicket 的颜色改变回调函数。
	*Laya.stage.addChild(colorPicket);//将此 colorPicket 对象添加到显示列表。
	*}
*function onChangeColor(colorPicket)
*{
	*console.log("当前选择的颜色： "+colorPicket.selectedColor);
	*}
*@example
*import ColorPicker=laya.ui.ColorPicker;
*import Handler=laya.utils.Handler;
*class ColorPicker_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/color.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*console.log("资源加载完成！");
		*var colorPicket:ColorPicker=new ColorPicker();//创建一个 ColorPicker 类的实例对象 colorPicket 。
		*colorPicket.skin="resource/ui/color.png";//设置 colorPicket 的皮肤。
		*colorPicket.x=100;//设置 colorPicket 对象的属性 x 的值，用于控制 colorPicket 对象的显示位置。
		*colorPicket.y=100;//设置 colorPicket 对象的属性 y 的值，用于控制 colorPicket 对象的显示位置。
		*colorPicket.changeHandler=new Handler(this,this.onChangeColor,[colorPicket]);//设置 colorPicket 的颜色改变回调函数。
		*Laya.stage.addChild(colorPicket);//将此 colorPicket 对象添加到显示列表。
		*}
	*private onChangeColor(colorPicket:ColorPicker):void {
		*console.log("当前选择的颜色： "+colorPicket.selectedColor);
		*}
	*}
*/
//class laya.ui.ColorPicker extends laya.ui.Component
var ColorPicker=(function(_super){
	function ColorPicker(){
		/**
		*当颜色发生改变时执行的函数处理器。
		*默认返回参数color：颜色值字符串。
		*/
		this.changeHandler=null;
		/**
		*@private
		*指定每个正方形的颜色小格子的宽高（以像素为单位）。
		*/
		this._gridSize=11;
		/**
		*@private
		*表示颜色样本列表面板的背景颜色值。
		*/
		this._bgColor="#ffffff";
		/**
		*@private
		*表示颜色样本列表面板的边框颜色值。
		*/
		this._borderColor="#000000";
		/**
		*@private
		*表示颜色样本列表面板选择或输入的颜色值。
		*/
		this._inputColor="#000000";
		/**
		*@private
		*表示颜色输入框的背景颜色值。
		*/
		this._inputBgColor="#efefef";
		/**
		*@private
		*表示颜色样本列表面板。
		*/
		this._colorPanel=null;
		/**
		*@private
		*表示颜色网格。
		*/
		this._colorTiles=null;
		/**
		*@private
		*表示颜色块显示对象。
		*/
		this._colorBlock=null;
		/**
		*@private
		*表示颜色输入框控件 <code>Input</code> 。
		*/
		this._colorInput=null;
		/**
		*@private
		*表示点击后显示颜色样本列表面板的按钮控件 <code>Button</code> 。
		*/
		this._colorButton=null;
		/**
		*@private
		*表示颜色值列表。
		*/
		this._colors=[];
		/**
		*@private
		*表示选择的颜色值。
		*/
		this._selectedColor="#000000";
		/**@private */
		this._panelChanged=false;
		ColorPicker.__super.call(this);
	}

	__class(ColorPicker,'laya.ui.ColorPicker',_super);
	var __proto=ColorPicker.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._colorPanel && this._colorPanel.destroy(destroyChild);
		this._colorButton && this._colorButton.destroy(destroyChild);
		this._colorPanel=null;
		this._colorTiles=null;
		this._colorBlock=null;
		this._colorInput=null;
		this._colorButton=null;
		this._colors=null;
		this.changeHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._colorButton=new Button());
		this._colorPanel=new Box();
		this._colorPanel.size(230,166);
		this._colorPanel.addChild(this._colorTiles=new Sprite());
		this._colorPanel.addChild(this._colorBlock=new Sprite());
		this._colorPanel.addChild(this._colorInput=new Input());
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this._colorButton.on(/*laya.events.Event.CLICK*/"click",this,this.onColorButtonClick);
		this._colorBlock.pos(5,5);
		this._colorInput.pos(60,5);
		this._colorInput.size(60,20);
		this._colorInput.on(/*laya.events.Event.CHANGE*/"change",this,this.onColorInputChange);
		this._colorInput.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this.onColorFieldKeyDown);
		this._colorTiles.pos(5,30);
		this._colorTiles.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.onColorTilesMouseMove);
		this._colorTiles.on(/*laya.events.Event.CLICK*/"click",this,this.onColorTilesClick);
		this._colorTiles.size(20 *this._gridSize,12 *this._gridSize);
		this._colorPanel.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onPanelMouseDown);
		this.bgColor=this._bgColor;
	}

	__proto.onPanelMouseDown=function(e){
		e.stopPropagation();
	}

	/**
	*改变颜色样本列表面板。
	*/
	__proto.changePanel=function(){
		this._panelChanged=false;
		var g=this._colorPanel.graphics;
		g.clear();
		g.drawRect(0,0,230,166,this._bgColor,this._borderColor);
		this.drawBlock(this._selectedColor);
		this._colorInput.borderColor=this._borderColor;
		this._colorInput.bgColor=this._inputBgColor;
		this._colorInput.color=this._inputColor;
		g=this._colorTiles.graphics;
		g.clear();
		var mainColors=[0x000000,0x333333,0x666666,0x999999,0xCCCCCC,0xFFFFFF,0xFF0000,0x00FF00,0x0000FF,0xFFFF00,0x00FFFF,0xFF00FF];
		for (var i=0;i < 12;i++){
			for (var j=0;j < 20;j++){
				var color=0;
				if (j===0)color=mainColors[i];
				else if (j===1)color=0x000000;
				else color=(((i *3+j / 6)% 3 << 0)+((i / 6)<< 0)*3)*0x33 << 16 | j % 6 *0x33 << 8 | (i << 0)% 6 *0x33;
				var strColor=UIUtils.toColor(color);
				this._colors.push(strColor);
				var x=j *this._gridSize;
				var y=i *this._gridSize;
				g.drawRect(x,y,this._gridSize,this._gridSize,strColor,"#000000");
			}
		}
	}

	/**
	*颜色样本列表面板的显示按钮的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onColorButtonClick=function(e){
		if (this._colorPanel.parent)this.close();
		else this.open();
	}

	/**
	*打开颜色样本列表面板。
	*/
	__proto.open=function(){
		var p=this.localToGlobal(new Point());
		var px=p.x+this._colorPanel.width <=Laya.stage.width ? p.x :Laya.stage.width-this._colorPanel.width;
		var py=p.y+this._colorButton.height;
		py=py+this._colorPanel.height <=Laya.stage.height ? py :p.y-this._colorPanel.height;
		this._colorPanel.pos(px,py);
		this._colorPanel.zOrder=1001;
		Laya._currentStage.addChild(this._colorPanel);
		Laya.stage.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeColorBox);
	}

	/**
	*关闭颜色样本列表面板。
	*/
	__proto.close=function(){
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeColorBox);
		this._colorPanel.removeSelf();
	}

	/**
	*舞台的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.removeColorBox=function(e){
		this.close();
	}

	/**
	*小格子色块的 <code>Event.KEY_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onColorFieldKeyDown=function(e){
		if (e.keyCode==13){
			if (this._colorInput.text)this.selectedColor=this._colorInput.text;
			else this.selectedColor=null;
			this.close();
			e.stopPropagation();
		}
	}

	/**
	*颜色值输入框 <code>Event.CHANGE</code> 事件侦听处理函数。
	*/
	__proto.onColorInputChange=function(e){
		if (this._colorInput.text)this.drawBlock(this._colorInput.text);
		else this.drawBlock("#FFFFFF");
	}

	/**
	*小格子色块的 <code>Event.CLICK</code> 事件侦听处理函数。
	*/
	__proto.onColorTilesClick=function(e){
		this.selectedColor=this.getColorByMouse();
		this.close();
	}

	/**
	*@private
	*小格子色块的 <code>Event.MOUSE_MOVE</code> 事件侦听处理函数。
	*/
	__proto.onColorTilesMouseMove=function(e){
		this._colorInput.focus=false;
		var color=this.getColorByMouse();
		this._colorInput.text=color;
		this.drawBlock(color);
	}

	/**
	*通过鼠标位置取对应的颜色块的颜色值。
	*/
	__proto.getColorByMouse=function(){
		var point=this._colorTiles.getMousePoint();
		var x=Math.floor(point.x / this._gridSize);
		var y=Math.floor(point.y / this._gridSize);
		return this._colors[y *20+x];
	}

	/**
	*绘制颜色块。
	*@param color 需要绘制的颜色块的颜色值。
	*/
	__proto.drawBlock=function(color){
		var g=this._colorBlock.graphics;
		g.clear();
		var showColor=color ? color :"#ffffff";
		g.drawRect(0,0,50,20,showColor,this._borderColor);
		color || g.drawLine(0,0,50,20,"#ff0000");
	}

	/**
	*改变颜色。
	*/
	__proto.changeColor=function(){
		var g=this.graphics;
		g.clear();
		var showColor=this._selectedColor || "#000000";
		g.drawRect(0,0,this._colorButton.width,this._colorButton.height,showColor);
	}

	/**@private */
	__proto._setPanelChanged=function(){
		if (!this._panelChanged){
			this._panelChanged=true;
			this.callLater(this.changePanel);
		}
	}

	/**
	*表示颜色输入框的背景颜色值。
	*/
	__getset(0,__proto,'inputBgColor',function(){
		return this._inputBgColor;
		},function(value){
		this._inputBgColor=value;
		this._setPanelChanged();
	});

	/**
	*表示选择的颜色值。
	*/
	__getset(0,__proto,'selectedColor',function(){
		return this._selectedColor;
		},function(value){
		if (this._selectedColor !=value){
			this._selectedColor=this._colorInput.text=value;
			this.drawBlock(value);
			this.changeColor();
			this.changeHandler && this.changeHandler.runWith(this._selectedColor);
			this.event(/*laya.events.Event.CHANGE*/"change",Event.EMPTY.setTo(/*laya.events.Event.CHANGE*/"change",this,this));
		}
	});

	/**
	*@copy laya.ui.Button#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._colorButton.skin;
		},function(value){
		this._colorButton.skin=value;
		this.changeColor();
	});

	/**
	*表示颜色样本列表面板的背景颜色值。
	*/
	__getset(0,__proto,'bgColor',function(){
		return this._bgColor;
		},function(value){
		this._bgColor=value;
		this._setPanelChanged();
	});

	/**
	*表示颜色样本列表面板的边框颜色值。
	*/
	__getset(0,__proto,'borderColor',function(){
		return this._borderColor;
		},function(value){
		this._borderColor=value;
		this._setPanelChanged();
	});

	/**
	*表示颜色样本列表面板选择或输入的颜色值。
	*/
	__getset(0,__proto,'inputColor',function(){
		return this._inputColor;
		},function(value){
		this._inputColor=value;
		this._setPanelChanged();
	});

	return ColorPicker;
})(Component)


/**
*<code>ComboBox</code> 组件包含一个下拉列表，用户可以从该列表中选择单个值。
*
*@example <caption>以下示例代码，创建了一个 <code>ComboBox</code> 实例。</caption>
*package
*{
	*import laya.ui.ComboBox;
	*import laya.utils.Handler;
	*public class ComboBox_Example
	*{
		*public function ComboBox_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/button.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var comboBox:ComboBox=new ComboBox("resource/ui/button.png","item0,item1,item2,item3,item4,item5");//创建一个 ComboBox 类的实例对象 comboBox ,传入它的皮肤和标签集。
			*comboBox.x=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
			*comboBox.y=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
			*comboBox.selectHandler=new Handler(this,onSelect);//设置 comboBox 选择项改变时执行的处理器。
			*Laya.stage.addChild(comboBox);//将此 comboBox 对象添加到显示列表。
			*}
		*private function onSelect(index:int):void
		*{
			*trace("当前选中的项对象索引： ",index);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高。
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete(){
	*console.log("资源加载完成！");
	*var comboBox=new laya.ui.ComboBox("resource/ui/button.png","item0,item1,item2,item3,item4,item5");//创建一个 ComboBox 类的实例对象 comboBox ,传入它的皮肤和标签集。
	*comboBox.x=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
	*comboBox.y=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
	*comboBox.selectHandler=new laya.utils.Handler(this,onSelect);//设置 comboBox 选择项改变时执行的处理器。
	*Laya.stage.addChild(comboBox);//将此 comboBox 对象添加到显示列表。
	*}
*function onSelect(index)
*{
	*console.log("当前选中的项对象索引： ",index);
	*}
*@example
*import ComboBox=laya.ui.ComboBox;
*import Handler=laya.utils.Handler;
*class ComboBox_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/button.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*console.log("资源加载完成！");
		*var comboBox:ComboBox=new ComboBox("resource/ui/button.png","item0,item1,item2,item3,item4,item5");//创建一个 ComboBox 类的实例对象 comboBox ,传入它的皮肤和标签集。
		*comboBox.x=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
		*comboBox.y=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
		*comboBox.selectHandler=new Handler(this,this.onSelect);//设置 comboBox 选择项改变时执行的处理器。
		*Laya.stage.addChild(comboBox);//将此 comboBox 对象添加到显示列表。
		*}
	*private onSelect(index:number):void {
		*console.log("当前选中的项对象索引： ",index);
		*}
	*}
*
*/
//class laya.ui.ComboBox extends laya.ui.Component
var ComboBox=(function(_super){
	function ComboBox(skin,labels){
		/**@private */
		this._visibleNum=6;
		/**
		*@private
		*/
		this._button=null;
		/**
		*@private
		*/
		this._list=null;
		/**
		*@private
		*/
		this._isOpen=false;
		/**
		*@private
		*/
		this._itemSize=12;
		/**
		*@private
		*/
		this._labels=[];
		/**
		*@private
		*/
		this._selectedIndex=-1;
		/**
		*@private
		*/
		this._selectHandler=null;
		/**
		*@private
		*/
		this._itemHeight=NaN;
		/**
		*@private
		*/
		this._listHeight=NaN;
		/**
		*@private
		*/
		this._listChanged=false;
		/**
		*@private
		*/
		this._itemChanged=false;
		/**
		*@private
		*/
		this._scrollBarSkin=null;
		/**
		*@private
		*/
		this._isCustomList=false;
		/**
		*渲染项，用来显示下拉列表展示对象
		*/
		this.itemRender=null;
		ComboBox.__super.call(this);
		this._itemColors=Styles.comboBoxItemColors;
		this.skin=skin;
		this.labels=labels;
	}

	__class(ComboBox,'laya.ui.ComboBox',_super);
	var __proto=ComboBox.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._button && this._button.destroy(destroyChild);
		this._list && this._list.destroy(destroyChild);
		this._button=null;
		this._list=null;
		this._itemColors=null;
		this._labels=null;
		this._selectHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._button=new Button());
		this._button.text.align="left";
		this._button.labelPadding="0,0,0,5";
		this._button.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onButtonMouseDown);
	}

	__proto._createList=function(){
		this._list=new List();
		if (this._scrollBarSkin)this._list.vScrollBarSkin=this._scrollBarSkin;
		this._setListEvent(this._list);
	}

	__proto._setListEvent=function(list){
		this._list.selectEnable=true;
		this._list.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onListDown);
		this._list.mouseHandler=Handler.create(this,this.onlistItemMouse,null,false);
		if (this._list.scrollBar)this._list.scrollBar.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onScrollBarDown);
	}

	/**
	*@private
	*/
	__proto.onListDown=function(e){
		e.stopPropagation();
	}

	__proto.onScrollBarDown=function(e){
		e.stopPropagation();
	}

	__proto.onButtonMouseDown=function(e){
		this.callLater(this.switchTo,[!this._isOpen]);
	}

	/**
	*@private
	*/
	__proto.changeList=function(){
		this._listChanged=false;
		var labelWidth=this.width-2;
		var labelColor=this._itemColors[2];
		this._itemHeight=this._itemSize+6;
		this._list.itemRender=this.itemRender || {type:"Box",child:[{type:"Label",props:{name:"label",x:1,padding:"3,3,3,3",width:labelWidth,height:this._itemHeight,fontSize:this._itemSize,color:labelColor}}]};
		this._list.repeatY=this._visibleNum;
		this._list.refresh();
	}

	/**
	*@private
	*下拉列表的鼠标事件响应函数。
	*/
	__proto.onlistItemMouse=function(e,index){
		var type=e.type;
		if (type===/*laya.events.Event.MOUSE_OVER*/"mouseover" || type===/*laya.events.Event.MOUSE_OUT*/"mouseout"){
			if (this._isCustomList)return;
			var box=this._list.getCell(index);
			if (!box)return;
			var label=box.getChildByName("label");
			if (label){
				if (type===/*laya.events.Event.ROLL_OVER*/"mouseover"){
					label.bgColor=this._itemColors[0];
					label.color=this._itemColors[1];
					}else {
					label.bgColor=null;
					label.color=this._itemColors[2];
				}
			}
			}else if (type===/*laya.events.Event.CLICK*/"click"){
			this.selectedIndex=index;
			this.isOpen=false;
		}
	}

	/**
	*@private
	*/
	__proto.switchTo=function(value){
		this.isOpen=value;
	}

	/**
	*更改下拉列表的打开状态。
	*/
	__proto.changeOpen=function(){
		this.isOpen=!this._isOpen;
	}

	/**
	*更改下拉列表。
	*/
	__proto.changeItem=function(){
		this._itemChanged=false;
		this._listHeight=this._labels.length > 0 ? Math.min(this._visibleNum,this._labels.length)*this._itemHeight :this._itemHeight;
		if (!this._isCustomList){
			var g=this._list.graphics;
			g.clear();
			g.drawRect(0,0,this.width-1,this._listHeight,this._itemColors[4],this._itemColors[3]);
		};
		var a=this._list.array || [];
		a.length=0;
		for (var i=0,n=this._labels.length;i < n;i++){
			a.push({label:this._labels[i]});
		}
		this._list.height=this._listHeight;
		this._list.array=a;
	}

	__proto.changeSelected=function(){
		this._button.label=this.selectedLabel;
	}

	__proto._onStageMouseWheel=function(e){
		if(!this._list||this._list.contains(e.target))return;
		this.removeList(null);
	}

	/**
	*关闭下拉列表。
	*/
	__proto.removeList=function(e){
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeList);
		Laya.stage.off(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this,this._onStageMouseWheel);
		this.isOpen=false;
	}

	/**
	*表示选择的下拉列表项的索引。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this._selectedIndex=value;
			if (this._labels.length > 0)this.changeSelected();
			else this.callLater(this.changeSelected);
			this.event(/*laya.events.Event.CHANGE*/"change",[Event.EMPTY.setTo(/*laya.events.Event.CHANGE*/"change",this,this)]);
			this._selectHandler && this._selectHandler.runWith(this._selectedIndex);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureHeight',function(){
		return this._button.height;
	});

	/**
	*@copy laya.ui.Button#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._button.skin;
		},function(value){
		if (this._button.skin !=value){
			this._button.skin=value;
			this._listChanged=true;
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureWidth',function(){
		return this._button.width;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Component,this,'width',value);
		this._button.width=this._width;
		this._itemChanged=true;
		this._listChanged=true;
	});

	/**
	*表示选择的下拉列表项的的标签。
	*/
	__getset(0,__proto,'selectedLabel',function(){
		return this._selectedIndex >-1 && this._selectedIndex < this._labels.length ? this._labels[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._labels.indexOf(value);
	});

	/**
	*标签集合字符串。
	*/
	__getset(0,__proto,'labels',function(){
		return this._labels.join(",");
		},function(value){
		if (this._labels.length > 0)this.selectedIndex=-1;
		if (value)this._labels=value.split(",");
		else this._labels.length=0;
		this._itemChanged=true;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Component,this,'height',value);
		this._button.height=this._height;
	});

	/**
	*改变下拉列表的选择项时执行的处理器(默认返回参数index:int)。
	*/
	__getset(0,__proto,'selectHandler',function(){
		return this._selectHandler;
		},function(value){
		this._selectHandler=value;
	});

	/**
	*获取或设置没有滚动条的下拉列表中可显示的最大行数。
	*/
	__getset(0,__proto,'visibleNum',function(){
		return this._visibleNum;
		},function(value){
		this._visibleNum=value;
		this._listChanged=true;
	});

	/**
	*表示按钮文本标签是否为粗体字。
	*@see laya.display.Text#bold
	*/
	__getset(0,__proto,'labelBold',function(){
		return this._button.text.bold;
		},function(value){
		this._button.text.bold=value
	});

	/**
	*下拉列表项颜色。
	*<p><b>格式：</b>"悬停或被选中时背景颜色,悬停或被选中时标签颜色,标签颜色,边框颜色,背景颜色"</p>
	*/
	__getset(0,__proto,'itemColors',function(){
		return String(this._itemColors)
		},function(value){
		this._itemColors=UIUtils.fillArray(this._itemColors,value,String);
		this._listChanged=true;
	});

	/**
	*下拉列表项标签的字体大小。
	*/
	__getset(0,__proto,'itemSize',function(){
		return this._itemSize;
		},function(value){
		this._itemSize=value;
		this._listChanged=true;
	});

	/**
	*获取对 <code>ComboBox</code> 组件所包含的 <code>VScrollBar</code> 滚动条组件的引用。
	*/
	__getset(0,__proto,'scrollBar',function(){
		return this.list.scrollBar;
	});

	/**
	*表示下拉列表的打开状态。
	*/
	__getset(0,__proto,'isOpen',function(){
		return this._isOpen;
		},function(value){
		if (this._isOpen !=value){
			this._isOpen=value;
			this._button.selected=this._isOpen;
			if (this._isOpen){
				this._list || this._createList();
				this._listChanged && !this._isCustomList && this.changeList();
				this._itemChanged && this.changeItem();
				var p=this.localToGlobal(Point.TEMP.setTo(0,0));
				var py=p.y+this._button.height;
				py=py+this._listHeight <=Laya.stage.height ? py :p.y-this._listHeight;
				this._list.pos(p.x,py);
				this._list.zOrder=1001;
				Laya._currentStage.addChild(this._list);
				Laya.stage.once(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeList);
				Laya.stage.on(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this,this._onStageMouseWheel);
				this._list.selectedIndex=this._selectedIndex;
				}else {
				this._list && this._list.removeSelf();
			}
		}
	});

	/**
	*滚动条皮肤。
	*/
	__getset(0,__proto,'scrollBarSkin',function(){
		return this._scrollBarSkin;
		},function(value){
		this._scrollBarSkin=value;
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._button.sizeGrid;
		},function(value){
		this._button.sizeGrid=value;
	});

	/**
	*获取对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的引用。
	*/
	__getset(0,__proto,'button',function(){
		return this._button;
	});

	/**
	*获取对 <code>ComboBox</code> 组件所包含的 <code>List</code> 列表组件的引用。
	*/
	__getset(0,__proto,'list',function(){
		this._list || this._createList();
		return this._list;
		},function(value){
		if (value){
			value.removeSelf();
			this._isCustomList=true;
			this._list=value;
			this._setListEvent(value);
			this._itemHeight=value.getCell(0).height+value.spaceY;
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
		else if ((value instanceof Array))this.labels=(value).join(",");
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**
	*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的文本标签颜色。
	*<p><b>格式：</b>upColor,overColor,downColor,disableColor</p>
	*/
	__getset(0,__proto,'labelColors',function(){
		return this._button.labelColors;
		},function(value){
		if (this._button.labelColors !=value){
			this._button.labelColors=value;
		}
	});

	/**
	*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的文本边距。
	*<p><b>格式：</b>上边距,右边距,下边距,左边距</p>
	*/
	__getset(0,__proto,'labelPadding',function(){
		return this._button.text.padding.join(",");
		},function(value){
		this._button.text.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
	});

	/**
	*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的标签字体大小。
	*/
	__getset(0,__proto,'labelSize',function(){
		return this._button.text.fontSize;
		},function(value){
		this._button.text.fontSize=value
	});

	/**
	*表示按钮文本标签的字体名称，以字符串形式表示。
	*@see laya.display.Text#font
	*/
	__getset(0,__proto,'labelFont',function(){
		return this._button.text.font;
		},function(value){
		this._button.text.font=value
	});

	/**
	*表示按钮的状态值。
	*@see laya.ui.Button#stateNum
	*/
	__getset(0,__proto,'stateNum',function(){
		return this._button.stateNum;
		},function(value){
		this._button.stateNum=value
	});

	return ComboBox;
})(Component)


/**
*<code>ScrollBar</code> 组件是一个滚动条组件。
*<p>当数据太多以至于显示区域无法容纳时，最终用户可以使用 <code>ScrollBar</code> 组件控制所显示的数据部分。</p>
*<p> 滚动条由四部分组成：两个箭头按钮、一个轨道和一个滑块。 </p> *
*
*@see laya.ui.VScrollBar
*@see laya.ui.HScrollBar
*/
//class laya.ui.ScrollBar extends laya.ui.Component
var ScrollBar=(function(_super){
	function ScrollBar(skin){
		/**滚动衰减系数*/
		this.rollRatio=0.95;
		/**滚动变化时回调，回传value参数。*/
		this.changeHandler=null;
		/**是否缩放滑动条，默认值为true。 */
		this.scaleBar=true;
		/**一个布尔值，指定是否自动隐藏滚动条(无需滚动时)，默认值为false。*/
		this.autoHide=false;
		/**橡皮筋效果极限距离，0为没有橡皮筋效果。*/
		this.elasticDistance=0;
		/**橡皮筋回弹时间，单位为毫秒。*/
		this.elasticBackTime=500;
		/**上按钮 */
		this.upButton=null;
		/**下按钮 */
		this.downButton=null;
		/**滑条 */
		this.slider=null;
		/**@private */
		this._scrollSize=1;
		/**@private */
		this._skin=null;
		/**@private */
		this._thumbPercent=1;
		/**@private */
		this._target=null;
		/**@private */
		this._lastPoint=null;
		/**@private */
		this._lastOffset=0;
		/**@private */
		this._checkElastic=false;
		/**@private */
		this._isElastic=false;
		/**@private */
		this._value=NaN;
		/**@private */
		this._hide=false;
		/**@private */
		this._clickOnly=true;
		/**@private */
		this._offsets=null;
		ScrollBar.__super.call(this);
		this._showButtons=UIConfig.showButtons;
		this._touchScrollEnable=UIConfig.touchScrollEnable;
		this._mouseWheelEnable=UIConfig.mouseWheelEnable;
		this.skin=skin;
		this.max=1;
	}

	__class(ScrollBar,'laya.ui.ScrollBar',_super);
	var __proto=ScrollBar.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.stopScroll();
		this.target=null;
		_super.prototype.destroy.call(this,destroyChild);
		this.upButton && this.upButton.destroy(destroyChild);
		this.downButton && this.downButton.destroy(destroyChild);
		this.slider && this.slider.destroy(destroyChild);
		this.upButton=this.downButton=null;
		this.slider=null;
		this.changeHandler=null;
		this._offsets=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this.slider=new Slider());
		this.addChild(this.upButton=new Button());
		this.addChild(this.downButton=new Button());
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this.slider.showLabel=false;
		this.slider.on(/*laya.events.Event.CHANGE*/"change",this,this.onSliderChange);
		this.slider.setSlider(0,0,0);
		this.upButton.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onButtonMouseDown);
		this.downButton.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onButtonMouseDown);
	}

	/**
	*@private
	*滑块位置发生改变的处理函数。
	*/
	__proto.onSliderChange=function(){
		if(this._value !=this.slider.value)this.value=this.slider.value;
	}

	/**
	*@private
	*向上和向下按钮的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onButtonMouseDown=function(e){
		var isUp=e.currentTarget===this.upButton;
		this.slide(isUp);
		Laya.timer.once(Styles.scrollBarDelayTime,this,this.startLoop,[isUp]);
		Laya.stage.once(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
	}

	/**@private */
	__proto.startLoop=function(isUp){
		Laya.timer.frameLoop(1,this,this.slide,[isUp]);
	}

	/**@private */
	__proto.slide=function(isUp){
		if (isUp)this.value-=this._scrollSize;
		else this.value+=this._scrollSize;
	}

	/**
	*@private
	*舞台的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onStageMouseUp=function(e){
		Laya.timer.clear(this,this.startLoop);
		Laya.timer.clear(this,this.slide);
	}

	/**
	*@private
	*更改对象的皮肤及位置。
	*/
	__proto.changeScrollBar=function(){
		this.upButton.visible=this._showButtons;
		this.downButton.visible=this._showButtons;
		if (this._showButtons){
			this.upButton.skin=this._skin.replace(".png","$up.png");
			this.downButton.skin=this._skin.replace(".png","$down.png");
		}
		if (this.slider.isVertical)this.slider.y=this._showButtons ? this.upButton.height :0;
		else this.slider.x=this._showButtons ? this.upButton.width :0;
		this.resetPositions();
		this.repaint();
	}

	/**@inheritDoc */
	__proto.changeSize=function(){
		_super.prototype.changeSize.call(this);
		this.repaint();
		this.resetPositions();
		this.event(/*laya.events.Event.CHANGE*/"change");
		this.changeHandler && this.changeHandler.runWith(this.value);
	}

	/**@private */
	__proto.resetPositions=function(){
		if (this.slider.isVertical)this.slider.height=this.height-(this._showButtons ? (this.upButton.height+this.downButton.height):0);
		else this.slider.width=this.width-(this._showButtons ? (this.upButton.width+this.downButton.width):0);
		this.resetButtonPosition();
	}

	/**@private */
	__proto.resetButtonPosition=function(){
		if (this.slider.isVertical)this.downButton.y=this.slider.y+this.slider.height;
		else this.downButton.x=this.slider.x+this.slider.width;
	}

	/**
	*设置滚动条信息。
	*@param min 滚动条最小位置值。
	*@param max 滚动条最大位置值。
	*@param value 滚动条当前位置值。
	*/
	__proto.setScroll=function(min,max,value){
		this.runCallLater(this.changeSize);
		this.slider.setSlider(min,max,value);
		this.slider.bar.visible=max > 0;
		if (!this._hide && this.autoHide)this.visible=false;
	}

	/**@private */
	__proto.onTargetMouseWheel=function(e){
		this.value-=e.delta *this._scrollSize;
		this.target=this._target;
	}

	/**@private */
	__proto.onTargetMouseDown=function(e){
		this._clickOnly=true;
		this._lastOffset=0;
		this._checkElastic=false;
		this._lastPoint || (this._lastPoint=new Point());
		this._lastPoint.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
		Laya.timer.clear(this,this.tweenMove);
		Tween.clearTween(this);
		Laya.stage.once(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp2);
		Laya.stage.once(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp2);
		Laya.timer.frameLoop(1,this,this.loop);
	}

	/**@private */
	__proto.loop=function(){
		var mouseY=Laya.stage.mouseY;
		var mouseX=Laya.stage.mouseX;
		this._lastOffset=this.isVertical ? (mouseY-this._lastPoint.y):(mouseX-this._lastPoint.x);
		if (this._clickOnly){
			if (Math.abs(this._lastOffset *(this.isVertical ? Laya.stage._canvasTransform.getScaleY():Laya.stage._canvasTransform.getScaleX()))> 1){
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

	/**@private */
	__proto.onStageMouseUp2=function(e){
		Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp2);
		Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp2);
		Laya.timer.clear(this,this.loop);
		if (this._clickOnly){
			if(this._value>=this.min&&this._value<=this.max)
				return;
		}
		this._target.mouseEnabled=true;
		if (this._isElastic){
			if (this._value < this.min){
				Tween.to(this,{value:this.min},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
				}else if (this._value > this.max){
				Tween.to(this,{value:this.max},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
			}
			}else {
			if (!this._offsets)return;
			if (this._offsets.length < 1){
				this._offsets[0]=this.isVertical ? Laya.stage.mouseY-this._lastPoint.y :Laya.stage.mouseX-this._lastPoint.x;
			};
			var offset=0;
			var n=Math.min(this._offsets.length,3);
			for (var i=0;i < n;i++){
				offset+=this._offsets[this._offsets.length-1-i];
			}
			this._lastOffset=offset / n;
			offset=Math.abs(this._lastOffset);
			if (offset < 2){
				this.event(/*laya.events.Event.END*/"end");
				return;
			}
			if (offset > 60)this._lastOffset=this._lastOffset > 0 ? 60 :-60;
			var dis=Math.round(Math.abs(this.elasticDistance *(this._lastOffset / 240)));
			Laya.timer.frameLoop(1,this,this.tweenMove,[dis]);
		}
	}

	/**@private */
	__proto.elasticOver=function(){
		this._isElastic=false;
		if (!this.hide && this.autoHide){
			Tween.to(this,{alpha:0},500);
		}
		this.event(/*laya.events.Event.END*/"end");
	}

	/**@private */
	__proto.tweenMove=function(maxDistance){
		this._lastOffset *=this.rollRatio;
		var tarSpeed=NaN;
		if (maxDistance > 0){
			if (this._lastOffset > 0 && this.value <=this.min){
				this._isElastic=true;
				tarSpeed=-(this.min-maxDistance-this.value)*0.5;
				if (this._lastOffset > tarSpeed)this._lastOffset=tarSpeed;
				}else if (this._lastOffset < 0 && this.value >=this.max){
				this._isElastic=true;
				tarSpeed=-(this.max+maxDistance-this.value)*0.5;
				if (this._lastOffset < tarSpeed)this._lastOffset=tarSpeed;
			}
		}
		this.value-=this._lastOffset;
		if (Math.abs(this._lastOffset)< 1){
			Laya.timer.clear(this,this.tweenMove);
			if (this._isElastic){
				if (this._value < this.min){
					Tween.to(this,{value:this.min},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
					}else if (this._value > this.max){
					Tween.to(this,{value:this.max},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
					}else {
					this.elasticOver();
				}
				return;
			}
			this.event(/*laya.events.Event.END*/"end");
			if (!this.hide && this.autoHide){
				Tween.to(this,{alpha:0},500);
			}
		}
	}

	/**
	*停止滑动。
	*/
	__proto.stopScroll=function(){
		this.onStageMouseUp2(null);
		Laya.timer.clear(this,this.tweenMove);
		Tween.clearTween(this);
	}

	/**@inheritDoc */
	__getset(0,__proto,'measureHeight',function(){
		if (this.slider.isVertical)return 100;
		return this.slider.height;
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			this.slider.skin=this._skin;
			this.callLater(this.changeScrollBar);
		}
	});

	/**
	*获取或设置表示最高滚动位置的数字。
	*/
	__getset(0,__proto,'max',function(){
		return this.slider.max;
		},function(value){
		this.slider.max=value;
	});

	/**一个布尔值，指定是否显示向上、向下按钮，默认值为true。*/
	__getset(0,__proto,'showButtons',function(){
		return this._showButtons;
		},function(value){
		this._showButtons=value;
		this.callLater(this.changeScrollBar);
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureWidth',function(){
		if (this.slider.isVertical)return this.slider.width;
		return 100;
	});

	/**
	*获取或设置表示最低滚动位置的数字。
	*/
	__getset(0,__proto,'min',function(){
		return this.slider.min;
		},function(value){
		this.slider.min=value;
	});

	/**
	*获取或设置表示当前滚动位置的数字。
	*/
	__getset(0,__proto,'value',function(){
		return this._value;
		},function(v){
		if (v!==this._value){
			this._value=v;
			if (!this._isElastic){
				if (this.slider._value !=v){
					this.slider._value=v;
					this.slider.changeValue();
				}
				this._value=this.slider._value;
			}
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.changeHandler && this.changeHandler.runWith(this._value);
		}
	});

	/**
	*一个布尔值，指示滚动条是否为垂直滚动。如果值为true，则为垂直滚动，否则为水平滚动。
	*<p>默认值为：true。</p>
	*/
	__getset(0,__proto,'isVertical',function(){
		return this.slider.isVertical;
		},function(value){
		this.slider.isVertical=value;
	});

	/**
	*<p>当前实例的 <code>Slider</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this.slider.sizeGrid;
		},function(value){
		this.slider.sizeGrid=value;
	});

	/**获取或设置一个值，该值表示按下滚动条轨道时页面滚动的增量。 */
	__getset(0,__proto,'scrollSize',function(){
		return this._scrollSize;
		},function(value){
		this._scrollSize=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**获取或设置一个值，该值表示滑条长度比例，值为：（0-1）。 */
	__getset(0,__proto,'thumbPercent',function(){
		return this._thumbPercent;
		},function(value){
		this.runCallLater(this.changeScrollBar);
		this.runCallLater(this.changeSize);
		value=value >=1 ? 0.99 :value;
		this._thumbPercent=value;
		if (this.scaleBar){
			if (this.slider.isVertical)this.slider.bar.height=Math.max(this.slider.height *value,Styles.scrollBarMinNum);
			else this.slider.bar.width=Math.max(this.slider.width *value,Styles.scrollBarMinNum);
		}
	});

	/**
	*设置滚动对象。
	*@see laya.ui.TouchScroll#target
	*/
	__getset(0,__proto,'target',function(){
		return this._target;
		},function(value){
		if (this._target){
			this._target.off(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this,this.onTargetMouseWheel);
			this._target.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onTargetMouseDown);
		}
		this._target=value;
		if (value){
			this._mouseWheelEnable && this._target.on(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this,this.onTargetMouseWheel);
			this._touchScrollEnable && this._target.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onTargetMouseDown);
		}
	});

	/**是否隐藏滚动条，不显示滚动条，但是可以正常滚动，默认为false。*/
	__getset(0,__proto,'hide',function(){
		return this._hide;
		},function(value){
		this._hide=value;
		this.visible=!value;
	});

	/**一个布尔值，指定是否开启触摸，默认值为true。*/
	__getset(0,__proto,'touchScrollEnable',function(){
		return this._touchScrollEnable;
		},function(value){
		this._touchScrollEnable=value;
		this.target=this._target;
	});

	/**一个布尔值，指定是否滑轮滚动，默认值为true。*/
	__getset(0,__proto,'mouseWheelEnable',function(){
		return this._mouseWheelEnable;
		},function(value){
		this._mouseWheelEnable=value;
		this.target=this._target;
	});

	/**
	*滚动的刻度值，滑动数值为tick的整数倍。默认值为1。
	*/
	__getset(0,__proto,'tick',function(){
		return this.slider.tick;
		},function(value){
		this.slider.tick=value;
	});

	return ScrollBar;
})(Component)


/**
*使用 <code>Slider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
*<p>滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。</p>
*<p>滑块允许最小值和最大值之间特定间隔内的值。滑块还可以使用数据提示显示其当前值。</p>
*
*@see laya.ui.HSlider
*@see laya.ui.VSlider
*/
//class laya.ui.Slider extends laya.ui.Component
var Slider=(function(_super){
	function Slider(skin){
		/**
		*数据变化处理器。
		*<p>默认回调参数为滑块位置属性 <code>value</code>属性值：Number 。</p>
		*/
		this.changeHandler=null;
		/**
		*一个布尔值，指示是否为垂直滚动。如果值为true，则为垂直方向，否则为水平方向。
		*<p>默认值为：true。</p>
		*@default true
		*/
		this.isVertical=true;
		/**
		*一个布尔值，指示是否显示标签。
		*@default true
		*/
		this.showLabel=true;
		/**@private */
		this._allowClickBack=false;
		/**@private */
		this._max=100;
		/**@private */
		this._min=0;
		/**@private */
		this._tick=1;
		/**@private */
		this._value=0;
		/**@private */
		this._skin=null;
		/**@private */
		this._bg=null;
		/**@private */
		this._progress=null;
		/**@private */
		this._bar=null;
		/**@private */
		this._tx=NaN;
		/**@private */
		this._ty=NaN;
		/**@private */
		this._maxMove=NaN;
		/**@private */
		this._globalSacle=null;
		Slider.__super.call(this);
		this.skin=skin;
	}

	__class(Slider,'laya.ui.Slider',_super);
	var __proto=Slider.prototype;
	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bg && this._bg.destroy(destroyChild);
		this._bar && this._bar.destroy(destroyChild);
		this._progress && this._progress.destroy(destroyChild);
		this._bg=null;
		this._bar=null;
		this._progress=null;
		this.changeHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._bg=new Image());
		this.addChild(this._bar=new Button());
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this._bar.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onBarMouseDown);
		this._bg.sizeGrid=this._bar.sizeGrid="4,4,4,4,0";
		if (this._progress)this._progress.sizeGrid=this._bar.sizeGrid;
		this.allowClickBack=true;
	}

	/**
	*@private
	*滑块的的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onBarMouseDown=function(e){
		this._globalSacle || (this._globalSacle=new Point());
		this._globalSacle.setTo(this.globalScaleX || 0.01,this.globalScaleY || 0.01);
		this._maxMove=this.isVertical ? (this.height-this._bar.height):(this.width-this._bar.width);
		this._tx=Laya.stage.mouseX;
		this._ty=Laya.stage.mouseY;
		Laya.stage.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.mouseMove);
		Laya.stage.once(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.mouseUp);
		Laya.stage.once(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.mouseUp);
		this.showValueText();
	}

	/**
	*@private
	*显示标签。
	*/
	__proto.showValueText=function(){
		if (this.showLabel){
			var label=laya.ui.Slider.label;
			this.addChild(label);
			label.textField.changeText(this._value+"");
			if (this.isVertical){
				label.x=this._bar.x+20;
				label.y=(this._bar.height-label.height)*0.5+this._bar.y;
				}else {
				label.y=this._bar.y-20;
				label.x=(this._bar.width-label.width)*0.5+this._bar.x;
			}
		}
	}

	/**
	*@private
	*隐藏标签。
	*/
	__proto.hideValueText=function(){
		laya.ui.Slider.label && laya.ui.Slider.label.removeSelf();
	}

	/**
	*@private
	*/
	__proto.mouseUp=function(e){
		Laya.stage.off(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.mouseMove);
		Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.mouseUp);
		Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.mouseUp);
		this.sendChangeEvent(/*laya.events.Event.CHANGED*/"changed");
		this.hideValueText();
	}

	/**
	*@private
	*/
	__proto.mouseMove=function(e){
		var oldValue=this._value;
		if (this.isVertical){
			this._bar.y+=(Laya.stage.mouseY-this._ty)/ this._globalSacle.y;
			if (this._bar.y > this._maxMove)this._bar.y=this._maxMove;
			else if (this._bar.y < 0)this._bar.y=0;
			this._value=this._bar.y / this._maxMove *(this._max-this._min)+this._min;
			if(this._progress)this._progress.height=this._bar.y+0.5*this._bar.height;
			}else {
			this._bar.x+=(Laya.stage.mouseX-this._tx)/ this._globalSacle.x;
			if (this._bar.x > this._maxMove)this._bar.x=this._maxMove;
			else if (this._bar.x < 0)this._bar.x=0;
			this._value=this._bar.x / this._maxMove *(this._max-this._min)+this._min;
			if(this._progress)this._progress.width=this._bar.x+0.5*this._bar.width;
		}
		this._tx=Laya.stage.mouseX;
		this._ty=Laya.stage.mouseY;
		var pow=Math.pow(10,(this._tick+"").length-1);
		this._value=Math.round(Math.round(this._value / this._tick)*this._tick *pow)/ pow;
		if (this._value !=oldValue){
			this.sendChangeEvent();
		}
		this.showValueText();
	}

	/**
	*@private
	*/
	__proto.sendChangeEvent=function(type){
		(type===void 0)&& (type=/*laya.events.Event.CHANGE*/"change");
		this.event(type);
		this.changeHandler && this.changeHandler.runWith(this._value);
	}

	/**
	*@private
	*设置滑块的位置信息。
	*/
	__proto.setBarPoint=function(){
		if (this.isVertical)this._bar.x=Math.round((this._bg.width-this._bar.width)*0.5);
		else this._bar.y=Math.round((this._bg.height-this._bar.height)*0.5);
	}

	/**@inheritDoc */
	__proto.changeSize=function(){
		_super.prototype.changeSize.call(this);
		if (this.isVertical)this._bg.height=this.height;
		else this._bg.width=this.width;
		this.setBarPoint();
		this.changeValue();
	}

	/**
	*设置滑动条的信息。
	*@param min 滑块的最小值。
	*@param max 滑块的最小值。
	*@param value 滑块的当前值。
	*/
	__proto.setSlider=function(min,max,value){
		this._value=-1;
		this._min=min;
		this._max=max > min ? max :min;
		this.value=value < min ? min :value > max ? max :value;
	}

	/**
	*@private
	*改变滑块的位置值。
	*/
	__proto.changeValue=function(){
		var pow=Math.pow(10,(this._tick+"").length-1);
		this._value=Math.round(Math.round(this._value / this._tick)*this._tick *pow)/ pow;
		this._value=this._value > this._max ? this._max :this._value < this._min ? this._min :this._value;
		var num=this._max-this._min;
		if (num===0)num=1;
		if (this.isVertical){
			this._bar.y=(this._value-this._min)/ num *(this.height-this._bar.height);
			if(this._progress)this._progress.height=this._bar.y+0.5*this._bar.height;
		}
		else{
			this._bar.x=(this._value-this._min)/ num *(this.width-this._bar.width);
			if(this._progress)this._progress.width=this._bar.x+0.5*this._bar.width;
		}
	}

	/**
	*@private
	*滑动条的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onBgMouseDown=function(e){
		var point=this._bg.getMousePoint();
		if (this.isVertical)this.value=point.y / (this.height-this._bar.height)*(this._max-this._min)+this._min;
		else this.value=point.x / (this.width-this._bar.width)*(this._max-this._min)+this._min;
	}

	/**@inheritDoc */
	__getset(0,__proto,'measureHeight',function(){
		return Math.max(this._bg.height,this._bar.height);
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			this._bg.skin=this._skin;
			this._bar.skin=this._skin.replace(".png","$bar.png");
			var progressSkin=this._skin.replace(".png","$progress.png");
			if (Loader.getRes(progressSkin)){
				if (!this._progress){
					this.addChild(this._progress=new Image());
					this._progress.sizeGrid=this._bar.sizeGrid;
					this.setChildIndex(this._progress,1);
				}
				this._progress.skin=progressSkin;
			}
			this.setBarPoint();
			this.callLater(this.changeValue);
		}
	});

	/**
	*一个布尔值，指定是否允许通过点击滑动条改变 <code>Slider</code> 的 <code>value</code> 属性值。
	*/
	__getset(0,__proto,'allowClickBack',function(){
		return this._allowClickBack;
		},function(value){
		if (this._allowClickBack !=value){
			this._allowClickBack=value;
			if (value)this._bg.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onBgMouseDown);
			else this._bg.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onBgMouseDown);
		}
	});

	/**
	*获取或设置表示最高位置的数字。 默认值为100。
	*/
	__getset(0,__proto,'max',function(){
		return this._max;
		},function(value){
		if (this._max !=value){
			this._max=value;
			this.callLater(this.changeValue);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureWidth',function(){
		return Math.max(this._bg.width,this._bar.width);
	});

	/**
	*滑动的刻度值，滑动数值为tick的整数倍。默认值为1。
	*/
	__getset(0,__proto,'tick',function(){
		return this._tick;
		},function(value){
		if (this._tick !=value){
			this._tick=value;
			this.callLater(this.changeValue);
		}
	});

	/**
	*<p>当前实例的背景图（ <code>Image</code> ）和滑块按钮（ <code>Button</code> ）实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._bg.sizeGrid;
		},function(value){
		this._bg.sizeGrid=value;
		this._bar.sizeGrid=value;
		if (this._progress)this._progress.sizeGrid=this._bar.sizeGrid;
	});

	/**
	*获取或设置表示最低位置的数字。 默认值为0。
	*/
	__getset(0,__proto,'min',function(){
		return this._min;
		},function(value){
		if (this._min !=value){
			this._min=value;
			this.callLater(this.changeValue);
		}
	});

	/**
	*获取或设置表示当前滑块位置的数字。
	*/
	__getset(0,__proto,'value',function(){
		return this._value;
		},function(num){
		if (this._value !=num){
			var oldValue=this._value;
			this._value=num;
			this.changeValue();
			if (this._value !=oldValue){
				this.sendChangeEvent();
			}
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**
	*表示滑块按钮的引用。
	*/
	__getset(0,__proto,'bar',function(){
		return this._bar;
	});

	__static(Slider,
	['label',function(){return this.label=new Label();}
	]);
	return Slider;
})(Component)


/**
*<p> <code>Label</code> 类用于创建显示对象以显示文本。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>Label</code> 实例。</caption>
*package
*{
	*import laya.ui.Label;
	*public class Label_Example
	*{
		*public function Label_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*var label:Label=new Label();//创建一个 Label 类的实例对象 label 。
			*label.font="Arial";//设置 label 的字体。
			*label.bold=true;//设置 label 显示为粗体。
			*label.leading=4;//设置 label 的行间距。
			*label.wordWrap=true;//设置 label 自动换行。
			*label.padding="10,10,10,10";//设置 label 的边距。
			*label.color="#ff00ff";//设置 label 的颜色。
			*label.text="Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
			*label.x=100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
			*label.y=100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
			*label.width=300;//设置 label 的宽度。
			*label.height=200;//设置 label 的高度。
			*Laya.stage.addChild(label);//将 label 添加到显示列表。
			*var passwordLabel:Label=new Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
			*passwordLabel.asPassword=true;//设置 passwordLabel 的显示反式为密码显示。
			*passwordLabel.x=100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
			*passwordLabel.y=350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
			*passwordLabel.width=300;//设置 passwordLabel 的宽度。
			*passwordLabel.color="#000000";//设置 passwordLabel 的文本颜色。
			*passwordLabel.bgColor="#ccffff";//设置 passwordLabel 的背景颜色。
			*passwordLabel.fontSize=20;//设置 passwordLabel 的文本字体大小。
			*Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*onInit();
*function onInit(){
	*var label=new laya.ui.Label();//创建一个 Label 类的实例对象 label 。
	*label.font="Arial";//设置 label 的字体。
	*label.bold=true;//设置 label 显示为粗体。
	*label.leading=4;//设置 label 的行间距。
	*label.wordWrap=true;//设置 label 自动换行。
	*label.padding="10,10,10,10";//设置 label 的边距。
	*label.color="#ff00ff";//设置 label 的颜色。
	*label.text="Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
	*label.x=100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
	*label.y=100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
	*label.width=300;//设置 label 的宽度。
	*label.height=200;//设置 label 的高度。
	*Laya.stage.addChild(label);//将 label 添加到显示列表。
	*var passwordLabel=new laya.ui.Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
	*passwordLabel.asPassword=true;//设置 passwordLabel 的显示反式为密码显示。
	*passwordLabel.x=100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
	*passwordLabel.y=350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
	*passwordLabel.width=300;//设置 passwordLabel 的宽度。
	*passwordLabel.color="#000000";//设置 passwordLabel 的文本颜色。
	*passwordLabel.bgColor="#ccffff";//设置 passwordLabel 的背景颜色。
	*passwordLabel.fontSize=20;//设置 passwordLabel 的文本字体大小。
	*Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
	*}
*@example
*import Label=laya.ui.Label;
*class Label_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*var label:Label=new Label();//创建一个 Label 类的实例对象 label 。
		*label.font="Arial";//设置 label 的字体。
		*label.bold=true;//设置 label 显示为粗体。
		*label.leading=4;//设置 label 的行间距。
		*label.wordWrap=true;//设置 label 自动换行。
		*label.padding="10,10,10,10";//设置 label 的边距。
		*label.color="#ff00ff";//设置 label 的颜色。
		*label.text="Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
		*label.x=100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
		*label.y=100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
		*label.width=300;//设置 label 的宽度。
		*label.height=200;//设置 label 的高度。
		*Laya.stage.addChild(label);//将 label 添加到显示列表。
		*var passwordLabel:Label=new Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
		*passwordLabel.asPassword=true;//设置 passwordLabel 的显示反式为密码显示。
		*passwordLabel.x=100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
		*passwordLabel.y=350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
		*passwordLabel.width=300;//设置 passwordLabel 的宽度。
		*passwordLabel.color="#000000";//设置 passwordLabel 的文本颜色。
		*passwordLabel.bgColor="#ccffff";//设置 passwordLabel 的背景颜色。
		*passwordLabel.fontSize=20;//设置 passwordLabel 的文本字体大小。
		*Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
		*}
	*}
*@see laya.display.Text
*/
//class laya.ui.Label extends laya.ui.Component
var Label=(function(_super){
	function Label(text){
		/**
		*@private
		*文本 <code>Text</code> 实例。
		*/
		this._tf=null;
		Label.__super.call(this);
		(text===void 0)&& (text="");
		Font.defaultColor=Styles.labelColor;
		this.text=text;
	}

	__class(Label,'laya.ui.Label',_super);
	var __proto=Label.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._tf=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._tf=new Text());
	}

	/**@copy laya.display.Text#changeText()
	**/
	__proto.changeText=function(text){
		this._tf.changeText(text);
	}

	/**
	*<p>边距信息</p>
	*<p>"上边距，右边距，下边距 , 左边距（边距以像素为单位）"</p>
	*@see laya.display.Text.padding
	*/
	__getset(0,__proto,'padding',function(){
		return this._tf.padding.join(",");
		},function(value){
		this._tf.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
	});

	/**
	*@copy laya.display.Text#bold
	*/
	__getset(0,__proto,'bold',function(){
		return this._tf.bold;
		},function(value){
		this._tf.bold=value;
	});

	/**
	*@copy laya.display.Text#align
	*/
	__getset(0,__proto,'align',function(){
		return this._tf.align;
		},function(value){
		this._tf.align=value;
	});

	/**
	*当前文本内容字符串。
	*@see laya.display.Text.text
	*/
	__getset(0,__proto,'text',function(){
		return this._tf.text;
		},function(value){
		if (this._tf.text !=value){
			if(value)
				value=UIUtils.adptString(value+"");
			this._tf.text=value;
			this.event(/*laya.events.Event.CHANGE*/"change");
			if (!this._width || !this._height)this.onCompResize();
		}
	});

	/**
	*@copy laya.display.Text#italic
	*/
	__getset(0,__proto,'italic',function(){
		return this._tf.italic;
		},function(value){
		this._tf.italic=value;
	});

	/**
	*@copy laya.display.Text#wordWrap
	*/
	/**
	*@copy laya.display.Text#wordWrap
	*/
	__getset(0,__proto,'wordWrap',function(){
		return this._tf.wordWrap;
		},function(value){
		this._tf.wordWrap=value;
	});

	/**
	*@copy laya.display.Text#font
	*/
	__getset(0,__proto,'font',function(){
		return this._tf.font;
		},function(value){
		this._tf.font=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.text=value+"";
		else Laya.superSet(Component,this,'dataSource',value);
	});

	/**
	*@copy laya.display.Text#color
	*/
	__getset(0,__proto,'color',function(){
		return this._tf.color;
		},function(value){
		this._tf.color=value;
	});

	/**
	*@copy laya.display.Text#valign
	*/
	__getset(0,__proto,'valign',function(){
		return this._tf.valign;
		},function(value){
		this._tf.valign=value;
	});

	/**
	*@copy laya.display.Text#leading
	*/
	__getset(0,__proto,'leading',function(){
		return this._tf.leading;
		},function(value){
		this._tf.leading=value;
	});

	/**
	*@copy laya.display.Text#fontSize
	*/
	__getset(0,__proto,'fontSize',function(){
		return this._tf.fontSize;
		},function(value){
		this._tf.fontSize=value;
	});

	/**
	*@copy laya.display.Text#bgColor
	*/
	__getset(0,__proto,'bgColor',function(){
		return this._tf.bgColor
		},function(value){
		this._tf.bgColor=value;
	});

	/**
	*@copy laya.display.Text#borderColor
	*/
	__getset(0,__proto,'borderColor',function(){
		return this._tf.borderColor
		},function(value){
		this._tf.borderColor=value;
	});

	/**
	*@copy laya.display.Text#stroke
	*/
	__getset(0,__proto,'stroke',function(){
		return this._tf.stroke;
		},function(value){
		this._tf.stroke=value;
	});

	/**
	*@copy laya.display.Text#strokeColor
	*/
	__getset(0,__proto,'strokeColor',function(){
		return this._tf.strokeColor;
		},function(value){
		this._tf.strokeColor=value;
	});

	/**
	*文本控件实体 <code>Text</code> 实例。
	*/
	__getset(0,__proto,'textField',function(){
		return this._tf;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'measureWidth',function(){
		return this._tf.width;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'measureHeight',function(){
		return this._tf.height;
	});

	/**
	*@inheritDoc
	*/
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',function(){
		if (this._width || this._tf.text)return Laya.superGet(Component,this,'width');
		return 0;
		},function(value){
		Laya.superSet(Component,this,'width',value);
		this._tf.width=value;
	});

	/**
	*@inheritDoc
	*/
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'height',function(){
		if (this._height || this._tf.text)return Laya.superGet(Component,this,'height');
		return 0;
		},function(value){
		Laya.superSet(Component,this,'height',value);
		this._tf.height=value;
	});

	/**
	*@copy laya.display.Text#overflow
	*/
	/**
	*@copy laya.display.Text#overflow
	*/
	__getset(0,__proto,'overflow',function(){
		return this._tf.overflow;
		},function(value){
		this._tf.overflow=value;
	});

	/**
	*@copy laya.display.Text#underline
	*/
	/**
	*@copy laya.display.Text#underline
	*/
	__getset(0,__proto,'underline',function(){
		return this._tf.underline;
		},function(value){
		this._tf.underline=value;
	});

	/**
	*@copy laya.display.Text#underlineColor
	*/
	/**
	*@copy laya.display.Text#underlineColor
	*/
	__getset(0,__proto,'underlineColor',function(){
		return this._tf.underlineColor;
		},function(value){
		this._tf.underlineColor=value;
	});

	return Label;
})(Component)


/**
*<code>ProgressBar</code> 组件显示内容的加载进度。
*@example <caption>以下示例代码，创建了一个新的 <code>ProgressBar</code> 实例，设置了它的皮肤、位置、宽高、网格等信息，并添加到舞台上。</caption>
*package
*{
	*import laya.ui.ProgressBar;
	*import laya.utils.Handler;
	*public class ProgressBar_Example
	*{
		*private var progressBar:ProgressBar;
		*public function ProgressBar_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/progress.png","resource/ui/progress$bar.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*progressBar=new ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
			*progressBar.x=100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
			*progressBar.y=100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
			*progressBar.value=0.3;//设置 progressBar 的进度值。
			*progressBar.width=200;//设置 progressBar 的宽度。
			*progressBar.height=50;//设置 progressBar 的高度。
			*progressBar.sizeGrid="5,10,5,10";//设置 progressBar 的网格信息。
			*progressBar.changeHandler=new Handler(this,onChange);//设置 progressBar 的value值改变时执行的处理器。
			*Laya.stage.addChild(progressBar);//将 progressBar 添加到显示列表。
			*Laya.timer.once(3000,this,changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
			*}
		*private function changeValue():void
		*{
			*trace("改变进度条的进度值。");
			*progressBar.value=0.6;
			*}
		*private function onChange(value:Number):void
		*{
			*trace("进度发生改变： value=" ,value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var res=["resource/ui/progress.png","resource/ui/progress$bar.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete()
*{
	*progressBar=new laya.ui.ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
	*progressBar.x=100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
	*progressBar.y=100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
	*progressBar.value=0.3;//设置 progressBar 的进度值。
	*progressBar.width=200;//设置 progressBar 的宽度。
	*progressBar.height=50;//设置 progressBar 的高度。
	*progressBar.sizeGrid="10,5,10,5";//设置 progressBar 的网格信息。
	*progressBar.changeHandler=new laya.utils.Handler(this,onChange);//设置 progressBar 的value值改变时执行的处理器。
	*Laya.stage.addChild(progressBar);//将 progressBar 添加到显示列表。
	*Laya.timer.once(3000,this,changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
	*}
*function changeValue()
*{
	*console.log("改变进度条的进度值。");
	*progressBar.value=0.6;
	*}
*function onChange(value)
*{
	*console.log("进度发生改变： value=" ,value);
	*}
*@example
*import ProgressBar=laya.ui.ProgressBar;
*import Handler=laya.utils.Handler;
*class ProgressBar_Example {
	*private progressBar:ProgressBar;
	*public ProgressBar_Example(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/progress.png","resource/ui/progress$bar.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.progressBar=new ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
		*this.progressBar.x=100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
		*this.progressBar.y=100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
		*this.progressBar.value=0.3;//设置 progressBar 的进度值。
		*this.progressBar.width=200;//设置 progressBar 的宽度。
		*this.progressBar.height=50;//设置 progressBar 的高度。
		*this.progressBar.sizeGrid="5,10,5,10";//设置 progressBar 的网格信息。
		*this.progressBar.changeHandler=new Handler(this,this.onChange);//设置 progressBar 的value值改变时执行的处理器。
		*Laya.stage.addChild(this.progressBar);//将 progressBar 添加到显示列表。
		*Laya.timer.once(3000,this,this.changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
		*}
	*private changeValue():void {
		*console.log("改变进度条的进度值。");
		*this.progressBar.value=0.6;
		*}
	*private onChange(value:number):void {
		*console.log("进度发生改变： value=",value);
		*}
	*}
*/
//class laya.ui.ProgressBar extends laya.ui.Component
var ProgressBar=(function(_super){
	function ProgressBar(skin){
		/**
		*当 <code>ProgressBar</code> 实例的 <code>value</code> 属性发生变化时的函数处理器。
		*<p>默认返回参数<code>value</code> 属性（进度值）。</p>
		*/
		this.changeHandler=null;
		/**@private */
		this._bg=null;
		/**@private */
		this._bar=null;
		/**@private */
		this._skin=null;
		/**@private */
		this._value=0.5;
		ProgressBar.__super.call(this);
		this.skin=skin;
	}

	__class(ProgressBar,'laya.ui.ProgressBar',_super);
	var __proto=ProgressBar.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bg && this._bg.destroy(destroyChild);
		this._bar && this._bar.destroy(destroyChild);
		this._bg=this._bar=null;
		this.changeHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._bg=new Image());
		this.addChild(this._bar=new Image());
		this._bar._bitmap.autoCacheCmd=false;
	}

	/**
	*@private
	*更改进度值的显示。
	*/
	__proto.changeValue=function(){
		if (this.sizeGrid){
			var grid=this.sizeGrid.split(",");
			var left=Number(grid[3]);
			var right=Number(grid[1]);
			var max=this.width-left-right;
			var sw=max *this._value;
			this._bar.width=left+right+sw;
			this._bar.visible=this._bar.width > left+right;
			}else {
			this._bar.width=this.width *this._value;
		}
	}

	/**@inheritDoc */
	__getset(0,__proto,'measureHeight',function(){
		return this._bg.height;
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			this._bg.skin=this._skin;
			this._bar.skin=this._skin.replace(".png","$bar.png");
			this.callLater(this.changeValue);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'measureWidth',function(){
		return this._bg.width;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Component,this,'height',value);
		this._bg.height=this._height;
		this._bar.height=this._height;
	});

	/**
	*获取进度条对象。
	*/
	__getset(0,__proto,'bar',function(){
		return this._bar;
	});

	/**
	*当前的进度量。
	*<p><b>取值：</b>介于0和1之间。</p>
	*/
	__getset(0,__proto,'value',function(){
		return this._value;
		},function(num){
		if (this._value !=num){
			num=num > 1 ? 1 :num < 0 ? 0 :num;
			this._value=num;
			this.callLater(this.changeValue);
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.changeHandler && this.changeHandler.runWith(num);
		}
	});

	/**
	*获取背景条对象。
	*/
	__getset(0,__proto,'bg',function(){
		return this._bg;
	});

	/**
	*<p>当前 <code>ProgressBar</code> 实例的进度条背景位图（ <code>Image</code> 实例）的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._bg.sizeGrid;
		},function(value){
		this._bg.sizeGrid=this._bar.sizeGrid=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Component,this,'width',value);
		this._bg.width=this._width;
		this.callLater(this.changeValue);
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
		else Laya.superSet(Component,this,'dataSource',value);
	});

	return ProgressBar;
})(Component)


/**鼠标提示管理类*/
//class laya.ui.TipManager extends laya.ui.Component
var TipManager=(function(_super){
	function TipManager(){
		this._tipBox=null;
		this._tipText=null;
		this._defaultTipHandler=null;
		TipManager.__super.call(this);
		this._tipBox=new Component();
		this._tipBox.addChild(this._tipText=new Text());
		this._tipText.x=this._tipText.y=5;
		this._tipText.color=TipManager.tipTextColor;
		this._defaultTipHandler=this._showDefaultTip;
		Laya.stage.on(/*laya.ui.UIEvent.SHOW_TIP*/"showtip",this,this._onStageShowTip);
		Laya.stage.on(/*laya.ui.UIEvent.HIDE_TIP*/"hidetip",this,this._onStageHideTip);
		this.zOrder=1100
	}

	__class(TipManager,'laya.ui.TipManager',_super);
	var __proto=TipManager.prototype;
	/**
	*@private
	*/
	__proto._onStageHideTip=function(e){
		Laya.timer.clear(this,this._showTip);
		this.closeAll();
		this.removeSelf();
	}

	/**
	*@private
	*/
	__proto._onStageShowTip=function(data){
		Laya.timer.once(TipManager.tipDelay,this,this._showTip,[data],true);
	}

	/**
	*@private
	*/
	__proto._showTip=function(tip){
		if ((typeof tip=='string')){
			var text=String(tip);
			if (Boolean(text)){
				this._defaultTipHandler(text);
			}
			}else if ((tip instanceof laya.utils.Handler )){
			(tip).run();
			}else if ((typeof tip=='function')){
			(tip).apply();
		}
		if (true){
			Laya.stage.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onStageMouseMove);
			Laya.stage.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onStageMouseDown);
		}
		this._onStageMouseMove(null);
	}

	/**
	*@private
	*/
	__proto._onStageMouseDown=function(e){
		this.closeAll();
	}

	/**
	*@private
	*/
	__proto._onStageMouseMove=function(e){
		this._showToStage(this,TipManager.offsetX,TipManager.offsetY);
	}

	/**
	*@private
	*/
	__proto._showToStage=function(dis,offX,offY){
		(offX===void 0)&& (offX=0);
		(offY===void 0)&& (offY=0);
		var rec=dis.getBounds();
		dis.x=Laya.stage.mouseX+offX;
		dis.y=Laya.stage.mouseY+offY;
		if (dis.x+rec.width > Laya.stage.width){
			dis.x-=rec.width+offX;
		}
		if (dis.y+rec.height > Laya.stage.height){
			dis.y-=rec.height+offY;
		}
	}

	/**关闭所有鼠标提示*/
	__proto.closeAll=function(){
		Laya.timer.clear(this,this._showTip);
		Laya.stage.off(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onStageMouseMove);
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onStageMouseDown);
		this.removeChildren();
	}

	/**
	*显示显示对象类型的tip
	*/
	__proto.showDislayTip=function(tip){
		this.addChild(tip);
		this._showToStage(this);
		Laya._currentStage.addChild(this);
	}

	/**
	*@private
	*/
	__proto._showDefaultTip=function(text){
		this._tipText.text=text;
		var g=this._tipBox.graphics;
		g.clear();
		g.drawRect(0,0,this._tipText.width+10,this._tipText.height+10,TipManager.tipBackColor);
		this.addChild(this._tipBox);
		this._showToStage(this);
		Laya._currentStage.addChild(this);
	}

	/**默认鼠标提示函数*/
	__getset(0,__proto,'defaultTipHandler',function(){
		return this._defaultTipHandler;
		},function(value){
		this._defaultTipHandler=value;
	});

	TipManager.offsetX=10;
	TipManager.offsetY=15;
	TipManager.tipTextColor="#ffffff";
	TipManager.tipBackColor="#111111";
	TipManager.tipDelay=200;
	return TipManager;
})(Component)


/**
*广告插件
*@author 小松
*@date-2018-09-19
*/
//class laya.ui.AdvImage extends laya.ui.Image
var AdvImage=(function(_super){
	function AdvImage(skin){
		/**广告列表数据**/
		this.advsListArr=[];
		/**资源列表请求地址**/
		this.resUrl="https://unioncdn.layabox.com/config/iconlist.json";
		/**广告列表信息**/
		this._data=[];
		/**每6分钟重新请求一次新广告列表**/
		this._resquestTime=360000;
		/**微信跳转appid**/
		this._appid=null;
		/**二维码图片地址**/
		this._appCodeImgStr=null;
		/**播放索引**/
		this._playIndex=0;
		/**轮播间隔时间**/
		this._lunboTime=5000;
		AdvImage.__super.call(this);
		this._http=new Browser.window.XMLHttpRequest();
		this.skin=skin;
		this.init();
		this.size(120,120);
	}

	__class(AdvImage,'laya.ui.AdvImage',_super);
	var __proto=AdvImage.prototype;
	__proto.init=function(){
		if(Browser.onMiniGame && this.isSupportJump){
			Laya.timer.loop(this._resquestTime,this,this.onGetAdvsListData);
			this.onGetAdvsListData();
			this.initEvent();
			}else{
			this.visible=false;
		}
	}

	__proto.initEvent=function(){
		this.on(/*laya.events.Event.CLICK*/"click",this,this.onAdvsImgClick);
	}

	__proto.onAdvsImgClick=function(){
		var currentJumpUrl=this.getCurrentAppidObj();
		if(currentJumpUrl)
			this.jumptoGame();
	}

	__proto.revertAdvsData=function(){
		if(this.advsListArr[this._playIndex]){
			this.visible=true;
			this.skin=this.advsListArr[this._playIndex];
		}
	}

	/**
	*跳转游戏
	*@param callBack Function 回调参数说明：type 0 跳转成功；1跳转失败；2跳转接口调用成功
	*/
	__proto.jumptoGame=function(){
		var _$this=this;
		if(!Browser.onMiniGame)
			return;
		if(this.isSupportJump){
			/*__JS__ */wx.navigateToMiniProgram({
				appId:this._appid,
				path:"",
				extraData:"",
				envVersion:"release",
				success:function success (){
					console.log("-------------跳转成功--------------");
				},
				fail:function fail (){
					console.log("-------------跳转失败--------------");
				},
				complete:function complete (){
					console.log("-------------跳转接口调用成功--------------");
					_$this.updateAdvsInfo();
				}.bind(this)
			});
		}
	}

	__proto.updateAdvsInfo=function(){
		this.visible=false;
		this.onLunbo();
		Laya.timer.loop(this._lunboTime,this,this.onLunbo);
	}

	__proto.onLunbo=function(){
		if(this._playIndex >=this.advsListArr.length-1)
			this._playIndex=0;
		else
		this._playIndex+=1;
		this.visible=true;
		this.revertAdvsData();
	}

	/**获取轮播数据**/
	__proto.getCurrentAppidObj=function(){
		return this.advsListArr[this._playIndex];
	}

	/**
	*获取广告列表数据信息
	*/
	__proto.onGetAdvsListData=function(){
		var _this=this;
		var random=this.randRange(10000,1000000);
		var url=this.resUrl+"?"+random;
		this._http.open("get",url,true);
		this._http.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
		this._http.responseType="text";
		this._http.onerror=function (e){
			_this._onError(e);
		}
		this._http.onload=function (e){
			_this._onLoad(e);
		}
		this._http.send(null);
	}

	/**
	*生成指定范围的随机数
	*@param minNum 最小值
	*@param maxNum 最大值
	*/
	__proto.randRange=function(minNum,maxNum){
		return (Math.floor(Math.random()*(maxNum-minNum+1))+minNum);
	}

	/**
	*@private
	*请求出错侦的听处理函数。
	*@param e 事件对象。
	*/
	__proto._onError=function(e){
		this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText);
	}

	/**
	*@private
	*请求消息返回的侦听处理函数。
	*@param e 事件对象。
	*/
	__proto._onLoad=function(e){
		var http=this._http;
		var status=http.status!==undefined ? http.status :200;
		if (status===200 || status===204 || status===0){
			this.complete();
			}else {
			this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
		}
	}

	/**
	*@private
	*请求错误的处理函数。
	*@param message 错误信息。
	*/
	__proto.error=function(message){
		this.event(/*laya.events.Event.ERROR*/"error",message);
	}

	/**
	*@private
	*请求成功完成的处理函数。
	*/
	__proto.complete=function(){
		var flag=true;
		try {
			this._data=this._http.response || this._http.responseText;
			this._data=JSON.parse(this._data);
			this.advsListArr=this._data.list;
			this._appid=this._data.appid;
			this._appCodeImgStr=this._data.qrcode;
			this.updateAdvsInfo();
			this.revertAdvsData();
			}catch (e){
			flag=false;
			this.error(e.message);
		}
	}

	/**
	*@private
	*清除当前请求。
	*/
	__proto.clear=function(){
		var http=this._http;
		http.onerror=http.onabort=http.onprogress=http.onload=null;
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,true);
		Laya.timer.clear(this,this.onLunbo);
		Laya.timer.clear(this,this.onGetAdvsListData);
		this.clear();
	}

	/**当前小游戏环境是否支持游戏跳转功能**/
	__getset(0,__proto,'isSupportJump',function(){
		if(Browser.onMiniGame){
			var isSupperJump=(typeof /*__JS__ */wx.navigateToMiniProgram=='function');
			return isSupperJump;
		}
		return false;
	});

	return AdvImage;
})(Image)


/**
*<code>View</code> 是一个视图类。
*@internal <p><code>View</code></p>
*/
//class laya.ui.View extends laya.ui.Box
var View=(function(_super){
	var DataWatcher;
	function View(){
		/**@private */
		this._idMap=null;
		/**@private */
		this._aniList=null;
		/**@private */
		this._watchMap={};
		View.__super.call(this);
	}

	__class(View,'laya.ui.View',_super);
	var __proto=View.prototype;
	/**
	*@private
	*通过视图数据创建视图。
	*@param uiView 视图数据信息。
	*/
	__proto.createView=function(uiView){
		if (uiView.animations && !this._idMap)this._idMap={};
		View.createComp(uiView,this,this);
		if (uiView.animations){
			var anilist=[];
			var animations=uiView.animations;
			var i=0,len=animations.length;
			var tAni;
			var tAniO;
			for (i=0;i < len;i++){
				tAni=new FrameAnimation();
				tAniO=animations[i];
				tAni._setUp(this._idMap,tAniO);
				this[tAniO.name]=tAni;
				tAni._setControlNode(this);
				switch (tAniO.action){
					case 1:
						tAni.play(0,false);
						break ;
					case 2:
						tAni.play(0,true);
						break ;
					}
				anilist.push(tAni);
			}
			this._aniList=anilist;
		}
		if (this._width > 0 && uiView.props.hitTestPrior==null && !this.mouseThrough)this.hitTestPrior=true;
	}

	__proto.onEvent=function(type,event){}
	/**
	*@private
	*装载UI视图。用于加载模式。
	*@param path UI资源地址。
	*/
	__proto.loadUI=function(path){
		var uiView=View.uiMap[path];
		uiView && this.createView(uiView);
	}

	/**
	*<p>销毁此对象。</p>
	*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this._aniList)this._aniList.length=0;
		this._idMap=null;
		this._aniList=null;
		this._watchMap=null;
		laya.ui.Component.prototype.destroy.call(this,destroyChild);
	}

	/**@private */
	__proto.changeData=function(key){
		var arr=this._watchMap[key];
		if (!arr)return;
		console.log("change",key);
		for (var i=0,n=arr.length;i < n;i++){
			var watcher=arr[i];
			watcher.exe(this);
		}
	}

	View._regs=function(){
		for (var key in View.uiClassMap){
			ClassUtils.regClass(key,View.uiClassMap[key]);
		}
	}

	View.createComp=function(uiView,comp,view,dataMap){
		comp=comp || View.getCompInstance(uiView);
		if (!comp){
			console.warn("can not create:"+uiView.type);
			return null;
		};
		var child=uiView.child;
		if (child){
			var isList=(comp instanceof laya.ui.List );
			for (var i=0,n=child.length;i < n;i++){
				var node=child[i];
				if (comp.hasOwnProperty("itemRender")&& (node.props.name=="render" || node.props.renderType==="render")){
					(comp).itemRender=node;
					}else if (node.type=="Graphic"){
					ClassUtils.addGraphicsToSprite(node,comp);
					}else if (ClassUtils.isDrawType(node.type)){
					ClassUtils.addGraphicToSprite(node,comp,true);
					}else {
					if (isList){
						var arr=[];
						var tChild=View.createComp(node,null,view,arr);
						if (arr.length)tChild["_$bindData"]=arr;
						}else {
						tChild=View.createComp(node,null,view,dataMap);
					}
					if (node.type=="Script"){
						if ("owner" in tChild){
							tChild["owner"]=comp;
							}else if ("target" in tChild){
							tChild["target"]=comp;
						}
						}else if (node.props.renderType=="mask" || node.props.name=="mask"){
						comp.mask=tChild;
						}else {(
						tChild instanceof laya.display.Sprite )&& comp.addChild(tChild);
					}
				}
			}
		};
		var props=uiView.props;
		for (var prop in props){
			var value=props[prop];
			if (View.eventDic[prop]){
				if (value&&view){
					(comp).on(prop,view,view.onEvent,[value]);
				}
			}else
			View.setCompValue(comp,prop,value,view,dataMap);
		}
		if (Laya.__typeof(comp,'laya.ui.IItem'))(comp).initItems();
		if (uiView.compId && view && view._idMap){
			view._idMap[uiView.compId]=comp;
		}
		return comp;
	}

	View.setCompValue=function(comp,prop,value,view,dataMap){
		if ((typeof value=='string')&& value.indexOf("${")>-1){
			View._sheet || (View._sheet=ClassUtils.getClass("laya.data.Table"));
			if (!View._sheet){
				console.warn("Can not find class Sheet");
				return;
			}
			if (dataMap){
				dataMap.push(comp,prop,value);
				}else if (view){
				if (value.indexOf("].")==-1){
					value=value.replace(".","[0].");
				};
				var watcher=new DataWatcher(comp,prop,value);
				watcher.exe(view);
				var one,temp;
				var str=value.replace(/\[.*?\]\./g,".");
				while ((one=View._parseWatchData.exec(str))!=null){
					var key1=one[1];
					while ((temp=View._parseKeyWord.exec(key1))!=null){
						var key2=temp[0];
						var arr=(view._watchMap[key2] || (view._watchMap[key2]=[]));
						arr.push(watcher);
						View._sheet.I.notifer.on(key2,view,view.changeData,[key2]);
					}
					arr=(view._watchMap[key1] || (view._watchMap[key1]=[]));
					arr.push(watcher);
					View._sheet.I.notifer.on(key1,view,view.changeData,[key1]);
				}
			}
			return;
		}
		if (prop==="var" && view){
			view[value]=comp;
			}else if (prop=="onClick"){
			var fun=Laya._runScript("(function(){"+value+"})");
			comp.on(/*laya.events.Event.CLICK*/"click",view,fun);
			}else {
			comp[prop]=(value==="true" ? true :(value==="false" ? false :value));
		}
	}

	View.getCompInstance=function(json){
		var runtime=json.props ? json.props.runtime :null;
		var compClass;
		compClass=runtime ? (View.viewClassMap[runtime] || View.uiClassMap[runtime]|| Laya["__classmap"][runtime]):View.uiClassMap[json.type];
		if (json.props && json.props.hasOwnProperty("renderType")&& json.props["renderType"]=="instance")return compClass["instance"];
		return compClass ? new compClass():null;
	}

	View.regComponent=function(key,compClass){
		View.uiClassMap[key]=compClass;
		ClassUtils.regClass(key,compClass);
	}

	View.regViewRuntime=function(key,compClass){
		View.viewClassMap[key]=compClass;
	}

	View.uiMap={};
	View.viewClassMap={};
	View._sheet=null;
	__static(View,
	['uiClassMap',function(){return this.uiClassMap={"ViewStack":ViewStack,"LinkButton":Button,"TextArea":TextArea,"ColorPicker":ColorPicker,"Box":Box,"Button":Button,"CheckBox":CheckBox,"Clip":Clip,"ComboBox":ComboBox,"Component":Component,"HScrollBar":HScrollBar,"HSlider":HSlider,"Image":Image,"Label":Label,"List":List,"Panel":Panel,"ProgressBar":ProgressBar,"Radio":Radio,"RadioGroup":RadioGroup,"ScrollBar":ScrollBar,"Slider":Slider,"Tab":Tab,"TextInput":TextInput,"View":View,"VScrollBar":VScrollBar,"VSlider":VSlider,"Tree":Tree,"HBox":HBox,"VBox":VBox,"Sprite":Sprite,"Animation":Animation,"Text":Text,"FontClip":FontClip};},'eventDic',function(){return this.eventDic={"mousedown":true,"mouseup":true,"mousemove":true,"mouseover":true,"mouseout":true,"click":true,"doubleclick":true,"rightmousedown":true,"rightmouseup":true,"rightclick":true };},'_parseWatchData',function(){return this._parseWatchData=/\${(.*?)}/g;},'_parseKeyWord',function(){return this._parseKeyWord=/[a-zA-Z_][a-zA-Z0-9_]*(?:(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)/g;}
	]);
	View.__init$=function(){
		View._regs()
		//class DataWatcher
		DataWatcher=(function(){
			function DataWatcher(comp,prop,value){
				this.comp=null;
				this.prop=null;
				this.value=null;
				this.comp=comp;
				this.prop=prop;
				this.value=value;
			}
			__class(DataWatcher,'');
			var __proto=DataWatcher.prototype;
			__proto.exe=function(view){
				var fun=UIUtils.getBindFun(this.value);
				this.comp[this.prop]=fun.call(this,view);
			}
			return DataWatcher;
		})()
	}

	return View;
})(Box)


/**
*<code>CheckBox</code> 组件显示一个小方框，该方框内可以有选中标记。
*<code>CheckBox</code> 组件还可以显示可选的文本标签，默认该标签位于 CheckBox 右侧。
*<p><code>CheckBox</code> 使用 <code>dataSource</code>赋值时的的默认属性是：<code>selected</code>。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>CheckBox</code> 实例。</caption>
*package
*{
	*import laya.ui.CheckBox;
	*import laya.utils.Handler;
	*public class CheckBox_Example
	*{
		*public function CheckBox_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/check.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var checkBox:CheckBox=new CheckBox("resource/ui/check.png","这个是一个CheckBox组件。");//创建一个 CheckBox 类的实例对象 checkBox ,传入它的皮肤skin和标签label。
			*checkBox.x=100;//设置 checkBox 对象的属性 x 的值，用于控制 checkBox 对象的显示位置。
			*checkBox.y=100;//设置 checkBox 对象的属性 y 的值，用于控制 checkBox 对象的显示位置。
			*checkBox.clickHandler=new Handler(this,onClick,[checkBox]);//设置 checkBox 的点击事件处理器。
			*Laya.stage.addChild(checkBox);//将此 checkBox 对象添加到显示列表。
			*}
		*private function onClick(checkBox:CheckBox):void
		*{
			*trace("输出选中状态: checkBox.selected = "+checkBox.selected);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load("resource/ui/check.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete()
*{
	*console.log("资源加载完成！");
	*var checkBox:laya.ui.CheckBox=new laya.ui.CheckBox("resource/ui/check.png","这个是一个CheckBox组件。");//创建一个 CheckBox 类的类的实例对象 checkBox ,传入它的皮肤skin和标签label。
	*checkBox.x=100;//设置 checkBox 对象的属性 x 的值，用于控制 checkBox 对象的显示位置。
	*checkBox.y=100;//设置 checkBox 对象的属性 y 的值，用于控制 checkBox 对象的显示位置。
	*checkBox.clickHandler=new laya.utils.Handler(this,this.onClick,[checkBox],false);//设置 checkBox 的点击事件处理器。
	*Laya.stage.addChild(checkBox);//将此 checkBox 对象添加到显示列表。
	*}
*function onClick(checkBox)
*{
	*console.log("checkBox.selected = ",checkBox.selected);
	*}
*@example
*import CheckBox=laya.ui.CheckBox;
*import Handler=laya.utils.Handler;
*class CheckBox_Example{
	*constructor()
	*{
		*Laya.init(640,800);
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/check.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete()
	*{
		*var checkBox:CheckBox=new CheckBox("resource/ui/check.png","这个是一个CheckBox组件。");//创建一个 CheckBox 类的实例对象 checkBox ,传入它的皮肤skin和标签label。
		*checkBox.x=100;//设置 checkBox 对象的属性 x 的值，用于控制 checkBox 对象的显示位置。
		*checkBox.y=100;//设置 checkBox 对象的属性 y 的值，用于控制 checkBox 对象的显示位置。
		*checkBox.clickHandler=new Handler(this,this.onClick,[checkBox]);//设置 checkBox 的点击事件处理器。
		*Laya.stage.addChild(checkBox);//将此 checkBox 对象添加到显示列表。
		*}
	*private onClick(checkBox:CheckBox):void
	*{
		*console.log("输出选中状态: checkBox.selected = "+checkBox.selected);
		*}
	*}
*/
//class laya.ui.CheckBox extends laya.ui.Button
var CheckBox=(function(_super){
	/**
	*创建一个新的 <code>CheckBox</code> 组件实例。
	*@param skin 皮肤资源地址。
	*@param label 文本标签的内容。
	*/
	function CheckBox(skin,label){
		(label===void 0)&& (label="");
		CheckBox.__super.call(this,skin,label);
	}

	__class(CheckBox,'laya.ui.CheckBox',_super);
	var __proto=CheckBox.prototype;
	/**@inheritDoc */
	__proto.preinitialize=function(){
		laya.ui.Component.prototype.preinitialize.call(this);
		this.toggle=true;
		this._autoSize=false;
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		_super.prototype.initialize.call(this);
		this.createText();
		this._text.align="left";
		this._text.valign="top";
		this._text.width=0;
	}

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='boolean'))this.selected=value;
		else if ((typeof value=='string'))this.selected=value==="true";
		else Laya.superSet(Button,this,'dataSource',value);
	});

	return CheckBox;
})(Button)


/**
*<code>LayoutBox</code> 是一个布局容器类。
*/
//class laya.ui.LayoutBox extends laya.ui.Box
var LayoutBox=(function(_super){
	function LayoutBox(){
		/**@private */
		this._space=0;
		/**@private */
		this._align="none";
		/**@private */
		this._itemChanged=false;
		LayoutBox.__super.call(this);
	}

	__class(LayoutBox,'laya.ui.LayoutBox',_super);
	var __proto=LayoutBox.prototype;
	/**@inheritDoc */
	__proto.addChild=function(child){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setItemChanged();
		return laya.display.Node.prototype.addChild.call(this,child);
	}

	__proto.onResize=function(e){
		this._setItemChanged();
	}

	/**@inheritDoc */
	__proto.addChildAt=function(child,index){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setItemChanged();
		return laya.display.Node.prototype.addChildAt.call(this,child,index);
	}

	/**@inheritDoc */
	__proto.removeChildAt=function(index){
		this.getChildAt(index).off(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setItemChanged();
		return laya.display.Node.prototype.removeChildAt.call(this,index);
	}

	/**刷新。*/
	__proto.refresh=function(){
		this._setItemChanged();
	}

	/**
	*改变子对象的布局。
	*/
	__proto.changeItems=function(){
		this._itemChanged=false;
	}

	/**
	*排序项目列表。可通过重写改变默认排序规则。
	*@param items 项目列表。
	*/
	__proto.sortItem=function(items){
		if (items)items.sort(function(a,b){return a.y-b.y;});
	}

	__proto._setItemChanged=function(){
		if (!this._itemChanged){
			this._itemChanged=true;
			this.callLater(this.changeItems);
		}
	}

	/**子对象的间隔。*/
	__getset(0,__proto,'space',function(){
		return this._space;
		},function(value){
		this._space=value;
		this._setItemChanged();
	});

	/**子对象对齐方式。*/
	__getset(0,__proto,'align',function(){
		return this._align;
		},function(value){
		this._align=value;
		this._setItemChanged();
	});

	return LayoutBox;
})(Box)


/**
*字体切片，简化版的位图字体，只需设置一个切片图片和文字内容即可使用，效果同位图字体
*使用方式：设置位图字体皮肤skin，设置皮肤对应的字体内容sheet（如果多行，可以使用空格换行），示例：
*fontClip.skin="font1.png";//设置皮肤
*fontClip.sheet="abc123 456";//设置皮肤对应的内容，空格换行。此皮肤为2行5列（显示时skin会被等分为2行5列），第一行对应的文字为"abc123"，第二行为"456"
*fontClip.value="a1326";//显示"a1326"文字
*/
//class laya.ui.FontClip extends laya.ui.Clip
var FontClip=(function(_super){
	function FontClip(skin,sheet){
		/**数值*/
		this._valueArr=null;
		/**文字内容数组**/
		this._indexMap=null;
		/**位图字体内容**/
		this._sheet=null;
		/**@private */
		this._direction="horizontal";
		/**X方向间隙*/
		this._spaceX=0;
		/**Y方向间隙*/
		this._spaceY=0;
		/**@private 水平对齐方式*/
		this._align="left";
		/**@private 显示文字宽*/
		this._wordsW=0;
		/**@private 显示文字高*/
		this._wordsH=0;
		FontClip.__super.call(this);
		if (skin)this.skin=skin;
		if (sheet)this.sheet=sheet;
	}

	__class(FontClip,'laya.ui.FontClip',_super);
	var __proto=FontClip.prototype;
	__proto.createChildren=function(){
		this._bitmap=new AutoBitmap();
		this.on(/*laya.events.Event.LOADED*/"loaded",this,this._onClipLoaded);
	}

	/**
	*资源加载完毕
	*/
	__proto._onClipLoaded=function(){
		this.callLater(this.changeValue);
	}

	/**渲染数值*/
	__proto.changeValue=function(){
		if (!this._sources)return;
		if (!this._valueArr)return;
		this.graphics.clear(true);
		var texture;
		texture=this._sources[0];
		if (!texture)return;
		var isHorizontal=(this._direction==="horizontal");
		if (isHorizontal){
			this._wordsW=this._valueArr.length *(texture.sourceWidth+this.spaceX);
			this._wordsH=texture.sourceHeight;
			}else{
			this._wordsW=texture.sourceWidth;
			this._wordsH=(texture.sourceHeight+this.spaceY)*this._valueArr.length;
		};
		var dX=0;
		if (this._width){
			switch(this._align){
				case "center":
					dX=0.5 *(this._width-this._wordsW);
					break ;
				case "right":
					dX=this._width-this._wordsW;
					break ;
				default :
					dX=0;
				}
		}
		for (var i=0,sz=this._valueArr.length;i < sz;i++){
			var index=this._indexMap[this._valueArr.charAt(i)];
			if (!this.sources[index])continue ;
			texture=this.sources[index];
			if (isHorizontal)this.graphics.drawTexture(texture,dX+i *(texture.sourceWidth+this.spaceX),0,texture.sourceWidth,texture.sourceHeight);
			else this.graphics.drawTexture(texture,0+dX,i *(texture.sourceHeight+this.spaceY),texture.sourceWidth,texture.sourceHeight);
		}
		if (!this._width){
			this.resetLayoutX();
			this.callLater(this.changeSize);
		}
		if (!this._height){
			this.resetLayoutY();
			this.callLater(this.changeSize);
		}
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._valueArr=null;
		this._indexMap=null;
		this.graphics.clear(true);
		this.removeSelf();
		this.off(/*laya.events.Event.LOADED*/"loaded",this,this._onClipLoaded);
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**
	*设置位图字体内容，空格代表换行。比如"abc123 456"，代表第一行对应的文字为"abc123"，第二行为"456"
	*/
	__getset(0,__proto,'sheet',function(){
		return this._sheet;
		},function(value){
		value+="";
		this._sheet=value;
		var arr=value.split(" ");
		this._clipX=String(arr[0]).length;
		this.clipY=arr.length;
		this._indexMap={};
		for (var i=0;i < this._clipY;i++){
			var line=arr[i].split("");
			for (var j=0,n=line.length;j < n;j++){
				this._indexMap[line[j]]=i *this._clipX+j;
			}
		}
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Clip,this,'height',value);
		this.callLater(this.changeValue);
	});

	/**
	*布局方向。
	*<p>默认值为"horizontal"。</p>
	*<p><b>取值：</b>
	*<li>"horizontal"：表示水平布局。</li>
	*<li>"vertical"：表示垂直布局。</li>
	*</p>
	*/
	__getset(0,__proto,'direction',function(){
		return this._direction;
		},function(value){
		this._direction=value;
		this.callLater(this.changeValue);
	});

	/**
	*设置位图字体的显示内容
	*/
	__getset(0,__proto,'value',function(){
		if (!this._valueArr)return "";
		return this._valueArr;
		},function(value){
		value+="";
		this._valueArr=value;
		this.callLater(this.changeValue);
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Clip,this,'width',value);
		this.callLater(this.changeValue);
	});

	/**X方向文字间隙*/
	__getset(0,__proto,'spaceX',function(){
		return this._spaceX;
		},function(value){
		this._spaceX=value;
		if (this._direction==="horizontal")this.callLater(this.changeValue);
	});

	/**Y方向文字间隙*/
	__getset(0,__proto,'spaceY',function(){
		return this._spaceY;
		},function(value){
		this._spaceY=value;
		if (!(this._direction==="horizontal"))this.callLater(this.changeValue);
	});

	/**水平对齐方式*/
	__getset(0,__proto,'align',function(){
		return this._align;
		},function(v){
		this._align=v;
		this.callLater(this.changeValue);
	});

	__getset(0,__proto,'measureWidth',function(){
		return this._wordsW;
	});

	__getset(0,__proto,'measureHeight',function(){
		return this._wordsH;
	});

	return FontClip;
})(Clip)


/**
*<code>List</code> 控件可显示项目列表。默认为垂直方向列表。可通过UI编辑器自定义列表。
*
*@example <caption>以下示例代码，创建了一个 <code>List</code> 实例。</caption>
*package
*{
	*import laya.ui.List;
	*import laya.utils.Handler;
	*public class List_Example
	*{
		*public function List_Example()
		*{
			*Laya.init(640,800,"false");//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,onLoadComplete));
			*}
		*private function onLoadComplete():void
		*{
			*var arr:Array=[];//创建一个数组，用于存贮列表的数据信息。
			*for (var i:int=0;i &lt;20;i++)
			*{
				*arr.push({label:"item"+i});
				*}
			*var list:List=new List();//创建一个 List 类的实例对象 list 。
			*list.itemRender=Item;//设置 list 的单元格渲染器。
			*list.repeatX=1;//设置 list 的水平方向单元格数量。
			*list.repeatY=10;//设置 list 的垂直方向单元格数量。
			*list.vScrollBarSkin="resource/ui/vscroll.png";//设置 list 的垂直方向滚动条皮肤。
			*list.array=arr;//设置 list 的列表数据源。
			*list.pos(100,100);//设置 list 的位置。
			*list.selectEnable=true;//设置 list 可选。
			*list.selectHandler=new Handler(this,onSelect);//设置 list 改变选择项执行的处理器。
			*Laya.stage.addChild(list);//将 list 添加到显示列表。
			*}
		*private function onSelect(index:int):void
		*{
			*trace("当前选择的项目索引： index= ",index);
			*}
		*}
	*}
*import laya.ui.Box;
*import laya.ui.Label;
*class Item extends Box
*{
	*public function Item()
	*{
		*graphics.drawRect(0,0,100,20,null,"#ff0000");
		*var label:Label=new Label();
		*label.text="100000";
		*label.name="label";//设置 label 的name属性值。
		*label.size(100,20);
		*addChild(label);
		*}
	*}
*@example
*(function (_super){
	*function Item(){
		*Item.__super.call(this);//初始化父类
		*this.graphics.drawRect(0,0,100,20,"#ff0000");
		*var label=new laya.ui.Label();//创建一个 Label 类的实例对象 label 。
		*label.text="100000";//设置 label 的文本内容。
		*label.name="label";//设置 label 的name属性值。
		*label.size(100,20);//设置 label 的宽度、高度。
		*this.addChild(label);//将 label 添加到显示列表。
		*};
	*Laya.class(Item,"mypackage.listExample.Item",_super);//注册类 Item 。
	*})(laya.ui.Box);
*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
*var res=["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"];
*Laya.loader.load(res,new laya.utils.Handler(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*var arr=[];//创建一个数组，用于存贮列表的数据信息。
	*for (var i=0;i &lt;20;i++){
		*arr.push({label:"item"+i});
		*}
	*var list=new laya.ui.List();//创建一个 List 类的实例对象 list 。
	*list.itemRender=mypackage.listExample.Item;//设置 list 的单元格渲染器。
	*list.repeatX=1;//设置 list 的水平方向单元格数量。
	*list.repeatY=10;//设置 list 的垂直方向单元格数量。
	*list.vScrollBarSkin="resource/ui/vscroll.png";//设置 list 的垂直方向滚动条皮肤。
	*list.array=arr;//设置 list 的列表数据源。
	*list.pos(100,100);//设置 list 的位置。
	*list.selectEnable=true;//设置 list 可选。
	*list.selectHandler=new laya.utils.Handler(this,onSelect);//设置 list 改变选择项执行的处理器。
	*Laya.stage.addChild(list);//将 list 添加到显示列表。
	*}
*function onSelect(index)
*{
	*console.log("当前选择的项目索引： index= ",index);
	*}
*
*@example
*import List=laya.ui.List;
*import Handler=laya.utils.Handler;
*public class List_Example {
	*public List_Example(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,this.onLoadComplete));
		*}
	*private onLoadComplete():void {
		*var arr=[];//创建一个数组，用于存贮列表的数据信息。
		*for (var i:number=0;i &lt;20;i++)
		*{
			*arr.push({label:"item"+i });
			*}
		*var list:List=new List();//创建一个 List 类的实例对象 list 。
		*list.itemRender=Item;//设置 list 的单元格渲染器。
		*list.repeatX=1;//设置 list 的水平方向单元格数量。
		*list.repeatY=10;//设置 list 的垂直方向单元格数量。
		*list.vScrollBarSkin="resource/ui/vscroll.png";//设置 list 的垂直方向滚动条皮肤。
		*list.array=arr;//设置 list 的列表数据源。
		*list.pos(100,100);//设置 list 的位置。
		*list.selectEnable=true;//设置 list 可选。
		*list.selectHandler=new Handler(this,this.onSelect);//设置 list 改变选择项执行的处理器。
		*Laya.stage.addChild(list);//将 list 添加到显示列表。
		*}
	*private onSelect(index:number):void {
		*console.log("当前选择的项目索引： index= ",index);
		*}
	*}
*import Box=laya.ui.Box;
*import Label=laya.ui.Label;
*class Item extends Box {
	*constructor(){
		*this.graphics.drawRect(0,0,100,20,null,"#ff0000");
		*var label:Label=new Label();
		*label.text="100000";
		*label.name="label";//设置 label 的name属性值。
		*label.size(100,20);
		*this.addChild(label);
		*}
	*}
*/
//class laya.ui.List extends laya.ui.Box
var List=(function(_super){
	function List(){
		/**改变 <code>List</code> 的选择项时执行的处理器，(默认返回参数： 项索引（index:int）)。*/
		this.selectHandler=null;
		/**单元格渲染处理器(默认返回参数cell:Box,index:int)。*/
		this.renderHandler=null;
		/**单元格鼠标事件处理器(默认返回参数e:Event,index:int)。*/
		this.mouseHandler=null;
		/**指定是否可以选择，若值为true则可以选择，否则不可以选择。 @default false*/
		this.selectEnable=false;
		/**最大分页数。*/
		this.totalPage=0;
		/**@private */
		this._content=null;
		/**@private */
		this._scrollBar=null;
		/**@private */
		this._itemRender=null;
		/**@private */
		this._repeatX=0;
		/**@private */
		this._repeatY=0;
		/**@private */
		this._repeatX2=0;
		/**@private */
		this._repeatY2=0;
		/**@private */
		this._spaceX=0;
		/**@private */
		this._spaceY=0;
		/**@private */
		this._array=null;
		/**@private */
		this._startIndex=0;
		/**@private */
		this._selectedIndex=-1;
		/**@private */
		this._page=0;
		/**@private */
		this._isVertical=true;
		/**@private */
		this._cellSize=20;
		/**@private */
		this._cellOffset=0;
		/**@private */
		this._isMoved=false;
		/**是否缓存内容，如果数据源较少，并且list内无动画，设置此属性为true能大大提高性能 */
		this.cacheContent=false;
		/**@private */
		this._createdLine=0;
		/**@private */
		this._cellChanged=false;
		this._cells=[];
		this._offset=new Point();
		List.__super.call(this);
	}

	__class(List,'laya.ui.List',_super);
	var __proto=List.prototype;
	Laya.imps(__proto,{"laya.ui.IRender":true,"laya.ui.IItem":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._content && this._content.destroy(destroyChild);
		this._scrollBar && this._scrollBar.destroy(destroyChild);
		laya.ui.Component.prototype.destroy.call(this,destroyChild);
		this._content=null;
		this._scrollBar=null;
		this._itemRender=null;
		this._cells=null;
		this._array=null;
		this.selectHandler=this.renderHandler=this.mouseHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._content=new Box());
	}

	__proto.onScrollStart=function(){
		this._$P.cacheAs || (this._$P.cacheAs=Laya.superGet(Box,this,'cacheAs'));
		Laya.superSet(Box,this,'cacheAs',"none");
		this._scrollBar.once(/*laya.events.Event.END*/"end",this,this.onScrollEnd);
	}

	__proto.onScrollEnd=function(){
		Laya.superSet(Box,this,'cacheAs',this._$P.cacheAs);
	}

	__proto._removePreScrollBar=function(){
		var preNode=this.removeChildByName("scrollBar");
		if (preNode)preNode.destroy(true);
	}

	/**
	*@private
	*更改单元格的信息。
	*@internal 在此销毁、创建单元格，并设置单元格的位置等属性。相当于此列表内容发送改变时调用此函数。
	*/
	__proto.changeCells=function(){
		this._cellChanged=false;
		if (this._itemRender){
			this.scrollBar=this.getChildByName("scrollBar");
			var cell=this._getOneCell();
			var cellWidth=(cell.width+this._spaceX)|| 1;
			var cellHeight=(cell.height+this._spaceY)|| 1;
			if (this._width > 0)this._repeatX2=this._isVertical ? Math.round(this._width / cellWidth):Math.ceil(this._width / cellWidth);
			if (this._height > 0)this._repeatY2=this._isVertical ? Math.ceil(this._height / cellHeight):Math.round(this._height / cellHeight);
			var listWidth=this._width ? this._width :(cellWidth *this.repeatX-this._spaceX);
			var listHeight=this._height ? this._height :(cellHeight *this.repeatY-this._spaceY);
			this._cellSize=this._isVertical ? cellHeight :cellWidth;
			this._cellOffset=this._isVertical ? (cellHeight *Math.max(this._repeatY2,this._repeatY)-listHeight-this._spaceY):(cellWidth *Math.max(this._repeatX2,this._repeatX)-listWidth-this._spaceX);
			if (this._isVertical && this._scrollBar)this._scrollBar.height=listHeight;
			else if (!this._isVertical && this._scrollBar)this._scrollBar.width=listWidth;
			this.setContentSize(listWidth,listHeight);
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			var numY=(this._isVertical ? this.repeatY :this.repeatX)+(this._scrollBar ? 1 :0);
			this._createItems(0,numX,numY);
			this._createdLine=numY;
			if (this._array){
				this.array=this._array;
				this.runCallLater(this.renderItems);
			}
		}
	}

	__proto._getOneCell=function(){
		if (this._cells.length===0){
			var item=this.createItem();
			this._offset.setTo(item.x,item.y);
			if (this.cacheContent)return item;
			this._cells.push(item);
		}
		return this._cells[0];
	}

	__proto._createItems=function(startY,numX,numY){
		var box=this._content;
		var cell=this._getOneCell();
		var cellWidth=cell.width+this._spaceX;
		var cellHeight=cell.height+this._spaceY;
		if (this.cacheContent){
			var cacheBox=new Box();
			cacheBox.cacheAsBitmap=true;
			cacheBox.pos((this._isVertical ? 0 :startY)*cellWidth,(this._isVertical ? startY :0)*cellHeight);
			this._content.addChild(cacheBox);
			this._content.optimizeScrollRect=true;
			box=cacheBox;
			}else {
			var arr=[];
			for (var i=this._cells.length-1;i >-1;i--){
				var item=this._cells[i];
				item.removeSelf();
				arr.push(item);
			}
			this._cells.length=0;
		}
		for (var k=startY;k < numY;k++){
			for (var l=0;l < numX;l++){
				if (arr && arr.length){
					cell=arr.pop();
					}else {
					cell=this.createItem();
				}
				cell.x=(this._isVertical ? l :k)*cellWidth-box.x;
				cell.y=(this._isVertical ? k :l)*cellHeight-box.y;
				cell.name="item"+(k *numX+l);
				box.addChild(cell);
				this.addCell(cell);
			}
		}
	}

	__proto.createItem=function(){
		var arr=[];
		if ((typeof this._itemRender=='function')){
			var box=new this._itemRender();
			}else {
			box=View.createComp(this._itemRender,null,null,arr)
		}
		if (arr.length==0 && box._watchMap){
			var watchMap=box._watchMap;
			for (var name in watchMap){
				var a=watchMap[name];
				for (var i=0;i < a.length;i++){
					var watcher=a[i];
					arr.push(watcher.comp,watcher.prop,watcher.value)
				}
			}
		}
		if (arr.length)box["_$bindData"]=arr;
		return box;
	}

	/**
	*@private
	*添加单元格。
	*@param cell 需要添加的单元格对象。
	*/
	__proto.addCell=function(cell){
		cell.on(/*laya.events.Event.CLICK*/"click",this,this.onCellMouse);
		cell.on(/*laya.events.Event.RIGHT_CLICK*/"rightclick",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onCellMouse);
		this._cells.push(cell);
	}

	/**
	*初始化单元格信息。
	*/
	__proto.initItems=function(){
		if (!this._itemRender && this.getChildByName("item0")!=null){
			this.repeatX=1;
			var count=0;
			count=0;
			for (var i=0;i < 10000;i++){
				var cell=this.getChildByName("item"+i);
				if (cell){
					this.addCell(cell);
					count++;
					continue ;
				}
				break ;
			}
			this.repeatY=count;
		}
	}

	/**
	*设置可视区域大小。
	*<p>以（0，0，width参数，height参数）组成的矩形区域为可视区域。</p>
	*@param width 可视区域宽度。
	*@param height 可视区域高度。
	*/
	__proto.setContentSize=function(width,height){
		this._content.width=width;
		this._content.height=height;
		if (this._scrollBar || this._offset.x !=0 || this._offset.y !=0){
			this._content.scrollRect || (this._content.scrollRect=new Rectangle());
			this._content.scrollRect.setTo(-this._offset.x,-this._offset.y,width,height);
			this._content.scrollRect=this._content.scrollRect;
		}
		this.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**
	*@private
	*单元格的鼠标事件侦听处理函数。
	*/
	__proto.onCellMouse=function(e){
		if (e.type===/*laya.events.Event.MOUSE_DOWN*/"mousedown")this._isMoved=false;
		var cell=e.currentTarget;
		var index=this._startIndex+this._cells.indexOf(cell);
		if (index < 0)return;
		if (e.type===/*laya.events.Event.CLICK*/"click" || e.type===/*laya.events.Event.RIGHT_CLICK*/"rightclick"){
			if (this.selectEnable && !this._isMoved)this.selectedIndex=index;
			else this.changeCellState(cell,true,0);
			}else if ((e.type===/*laya.events.Event.MOUSE_OVER*/"mouseover" || e.type===/*laya.events.Event.MOUSE_OUT*/"mouseout")&& this._selectedIndex!==index){
			this.changeCellState(cell,e.type===/*laya.events.Event.MOUSE_OVER*/"mouseover",0);
		}
		this.mouseHandler && this.mouseHandler.runWith([e,index]);
	}

	/**
	*@private
	*改变单元格的可视状态。
	*@param cell 单元格对象。
	*@param visable 是否显示。
	*@param index 单元格的属性 <code>index</code> 值。
	*/
	__proto.changeCellState=function(cell,visable,index){
		var selectBox=cell.getChildByName("selectBox");
		if (selectBox){
			this.selectEnable=true;
			selectBox.visible=visable;
			selectBox.index=index;
		}
	}

	/**@inheritDoc */
	__proto.changeSize=function(){
		laya.ui.Component.prototype.changeSize.call(this);
		this.setContentSize(this.width,this.height);
		if (this._scrollBar)this.callLater(this.onScrollBarChange);
	}

	/**
	*@private
	*滚动条的 <code>Event.CHANGE</code> 事件侦听处理函数。
	*/
	__proto.onScrollBarChange=function(e){
		this.runCallLater(this.changeCells);
		var scrollValue=this._scrollBar.value;
		var lineX=(this._isVertical ? this.repeatX :this.repeatY);
		var lineY=(this._isVertical ? this.repeatY :this.repeatX);
		var scrollLine=Math.floor(scrollValue / this._cellSize);
		if (!this.cacheContent){
			var index=scrollLine *lineX;
			var num=0;
			if (index > this._startIndex){
				num=index-this._startIndex;
				var down=true;
				var toIndex=this._startIndex+lineX *(lineY+1);
				this._isMoved=true;
				}else if (index < this._startIndex){
				num=this._startIndex-index;
				down=false;
				toIndex=this._startIndex-1;
				this._isMoved=true;
			}
			for (var i=0;i < num;i++){
				if (down){
					var cell=this._cells.shift();
					this._cells[this._cells.length]=cell;
					var cellIndex=toIndex+i;
					}else {
					cell=this._cells.pop();
					this._cells.unshift(cell);
					cellIndex=toIndex-i;
				};
				var pos=Math.floor(cellIndex / lineX)*this._cellSize;
				this._isVertical ? cell.y=pos :cell.x=pos;
				this.renderItem(cell,cellIndex);
			}
			this._startIndex=index;
			this.changeSelectStatus();
			}else {
			num=(lineY+1);
			if (this._createdLine-scrollLine < num){
				this._createItems(this._createdLine,lineX,this._createdLine+num);
				this.renderItems(this._createdLine *lineX,0);
				this._createdLine+=num;
			}
		};
		var r=this._content.scrollRect;
		if (this._isVertical){
			r.y=scrollValue-this._offset.y;
			r.x=-this._offset.x;
			}else {
			r.y=-this._offset.y;
			r.x=scrollValue-this._offset.x;
		}
		this._content.scrollRect=r;
	}

	__proto.posCell=function(cell,cellIndex){
		if (!this._scrollBar)return;
		var lineX=(this._isVertical ? this.repeatX :this.repeatY);
		var lineY=(this._isVertical ? this.repeatY :this.repeatX);
		var pos=Math.floor(cellIndex / lineX)*this._cellSize;
		this._isVertical ? cell.y=pos :cell.x=pos;
	}

	/**
	*@private
	*改变单元格的选择状态。
	*/
	__proto.changeSelectStatus=function(){
		for (var i=0,n=this._cells.length;i < n;i++){
			this.changeCellState(this._cells[i],this._selectedIndex===this._startIndex+i,1);
		}
	}

	/**
	*@private
	*渲染单元格列表。
	*/
	__proto.renderItems=function(from,to){
		(from===void 0)&& (from=0);
		(to===void 0)&& (to=0);
		for (var i=from,n=to || this._cells.length;i < n;i++){
			this.renderItem(this._cells[i],this._startIndex+i);
		}
		this.changeSelectStatus();
	}

	/**
	*渲染一个单元格。
	*@param cell 需要渲染的单元格对象。
	*@param index 单元格索引。
	*/
	__proto.renderItem=function(cell,index){
		if (this._array && index >=0 && index < this._array.length){
			cell.visible=true;
			if (cell._$bindData){
				cell._dataSource=this._array[index];
				this._bindData(cell,this._array[index]);
			}else cell.dataSource=this._array[index];
			if (!this.cacheContent){
				this.posCell(cell,index);
			}
			if (this.hasListener(/*laya.events.Event.RENDER*/"render"))this.event(/*laya.events.Event.RENDER*/"render",[cell,index]);
			if (this.renderHandler)this.renderHandler.runWith([cell,index]);
			}else {
			cell.visible=false;
			cell.dataSource=null;
		}
	}

	__proto._bindData=function(cell,data){
		var arr=cell._$bindData;
		for (var i=0,n=arr.length;i < n;i++){
			var ele=arr[i++];
			var prop=arr[i++];
			var value=arr[i];
			var fun=UIUtils.getBindFun(value);
			ele[prop]=fun.call(this,data);
		}
	}

	/**
	*刷新列表数据源。
	*/
	__proto.refresh=function(){
		this.array=this._array;
	}

	/**
	*获取单元格数据源。
	*@param index 单元格索引。
	*/
	__proto.getItem=function(index){
		if (index >-1 && index < this._array.length){
			return this._array[index];
		}
		return null;
	}

	/**
	*修改单元格数据源。
	*@param index 单元格索引。
	*@param source 单元格数据源。
	*/
	__proto.changeItem=function(index,source){
		if (index >-1 && index < this._array.length){
			this._array[index]=source;
			if (index >=this._startIndex && index < this._startIndex+this._cells.length){
				this.renderItem(this.getCell(index),index);
			}
		}
	}

	/**
	*设置单元格数据源。
	*@param index 单元格索引。
	*@param source 单元格数据源。
	*/
	__proto.setItem=function(index,source){
		this.changeItem(index,source);
	}

	/**
	*添加单元格数据源。
	*@param souce 数据源。
	*/
	__proto.addItem=function(souce){
		this._array.push(souce);
		this.array=this._array;
	}

	/**
	*添加单元格数据源到对应的数据索引处。
	*@param souce 单元格数据源。
	*@param index 索引。
	*/
	__proto.addItemAt=function(souce,index){
		this._array.splice(index,0,souce);
		this.array=this._array;
	}

	/**
	*通过数据源索引删除单元格数据源。
	*@param index 需要删除的数据源索引值。
	*/
	__proto.deleteItem=function(index){
		this._array.splice(index,1);
		this.array=this._array;
	}

	/**
	*通过可视单元格索引，获取单元格。
	*@param index 可视单元格索引。
	*@return 单元格对象。
	*/
	__proto.getCell=function(index){
		this.runCallLater(this.changeCells);
		if (index >-1 && this._cells){
			return this._cells[(index-this._startIndex)% this._cells.length];
		}
		return null;
	}

	/**
	*<p>滚动列表，以设定的数据索引对应的单元格为当前可视列表的第一项。</p>
	*@param index 单元格在数据列表中的索引。
	*/
	__proto.scrollTo=function(index){
		if (this._scrollBar){
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			this._scrollBar.value=Math.floor(index / numX)*this._cellSize;
			}else {
			this.startIndex=index;
		}
	}

	/**
	*<p>缓动滚动列表，以设定的数据索引对应的单元格为当前可视列表的第一项。</p>
	*@param index 单元格在数据列表中的索引。
	*@param time 缓动时间。
	*@param complete 缓动结束回掉
	*/
	__proto.tweenTo=function(index,time,complete){
		(time===void 0)&& (time=200);
		if (this._scrollBar){
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			Tween.to(this._scrollBar,{value:Math.floor(index / numX)*this._cellSize},time,null,complete,0,true);
			}else {
			this.startIndex=index;
			if (complete)complete.run();
		}
	}

	/**@private */
	__proto._setCellChanged=function(){
		if (!this._cellChanged){
			this._cellChanged=true;
			this.callLater(this.changeCells);
		}
	}

	__proto.commitMeasure=function(){
		this.runCallLater(this.changeCells);
	}

	/**@inheritDoc */
	__getset(0,__proto,'cacheAs',_super.prototype._$get_cacheAs,function(value){
		Laya.superSet(Box,this,'cacheAs',value);
		if (this._scrollBar){
			this._$P.cacheAs=null;
			if (value!=="none")this._scrollBar.on(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			else this._scrollBar.off(/*laya.events.Event.START*/"start",this,this.onScrollStart);
		}
	});

	/**
	*获取对 <code>List</code> 组件所包含的内容容器 <code>Box</code> 组件的引用。
	*/
	__getset(0,__proto,'content',function(){
		return this._content;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		if (value !=this._height){
			Laya.superSet(Box,this,'height',value);
			this._setCellChanged();
		}
	});

	/**
	*单元格渲染器。
	*<p><b>取值：</b>
	*<ol>
	*<li>单元格类对象。</li>
	*<li> UI 的 JSON 描述。</li>
	*</ol></p>
	*/
	__getset(0,__proto,'itemRender',function(){
		return this._itemRender;
		},function(value){
		if (this._itemRender !=value){
			this._itemRender=value;
			for (var i=this._cells.length-1;i >-1;i--){
				this._cells[i].destroy();
			}
			this._cells.length=0;
			this._setCellChanged();
		}
	});

	/**
	*垂直方向滚动条皮肤。
	*/
	__getset(0,__proto,'vScrollBarSkin',function(){
		return this._scrollBar ? this._scrollBar.skin :null;
		},function(value){
		this._removePreScrollBar();
		var scrollBar=new VScrollBar();
		scrollBar.name="scrollBar";
		scrollBar.right=0;
		if (value && value !=" ")
			scrollBar.skin=value;
		this.scrollBar=scrollBar;
		this.addChild(scrollBar);
		this._setCellChanged();
	});

	/**
	*列表的当前页码。
	*/
	__getset(0,__proto,'page',function(){
		return this._page;
		},function(value){
		this._page=value
		if (this._array){
			this._page=value > 0 ? value :0;
			this._page=this._page < this.totalPage ? this._page :this.totalPage-1;
			this.startIndex=this._page *this.repeatX *this.repeatY;
		}
	});

	/**
	*水平方向滚动条皮肤。
	*/
	__getset(0,__proto,'hScrollBarSkin',function(){
		return this._scrollBar ? this._scrollBar.skin :null;
		},function(value){
		this._removePreScrollBar();
		var scrollBar=new HScrollBar();
		scrollBar.name="scrollBar";
		scrollBar.bottom=0;
		if (value && value !=" ")
			scrollBar.skin=value;
		this.scrollBar=scrollBar;
		this.addChild(scrollBar);
		this._setCellChanged();
	});

	/**
	*水平方向显示的单元格数量。
	*/
	__getset(0,__proto,'repeatX',function(){
		return this._repeatX > 0 ? this._repeatX :this._repeatX2 > 0 ? this._repeatX2 :1;
		},function(value){
		this._repeatX=value;
		this._setCellChanged();
	});

	/**
	*获取对 <code>List</code> 组件所包含的滚动条 <code>ScrollBar</code> 组件的引用。
	*/
	__getset(0,__proto,'scrollBar',function(){
		return this._scrollBar;
		},function(value){
		if (this._scrollBar !=value){
			this._scrollBar=value;
			if (value){
				this._isVertical=this._scrollBar.isVertical;
				this.addChild(this._scrollBar);
				this._scrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onScrollBarChange);
			}
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		if (value !=this._width){
			Laya.superSet(Box,this,'width',value);
			this._setCellChanged();
		}
	});

	/**
	*垂直方向显示的单元格数量。
	*/
	__getset(0,__proto,'repeatY',function(){
		return this._repeatY > 0 ? this._repeatY :this._repeatY2 > 0 ? this._repeatY2 :1;
		},function(value){
		this._repeatY=value;
		this._setCellChanged();
	});

	/**
	*水平方向显示的单元格之间的间距（以像素为单位）。
	*/
	__getset(0,__proto,'spaceX',function(){
		return this._spaceX;
		},function(value){
		this._spaceX=value;
		this._setCellChanged();
	});

	/**
	*垂直方向显示的单元格之间的间距（以像素为单位）。
	*/
	__getset(0,__proto,'spaceY',function(){
		return this._spaceY;
		},function(value){
		this._spaceY=value;
		this._setCellChanged();
	});

	/**
	*表示当前选择的项索引。selectedIndex值更改会引起list重新渲染
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this._selectedIndex=value;
			this.changeSelectStatus();
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.selectHandler && this.selectHandler.runWith(value);
			this.startIndex=this._startIndex;
		}
	});

	/**
	*当前选中的单元格数据源。
	*/
	__getset(0,__proto,'selectedItem',function(){
		return this._selectedIndex !=-1 ? this._array[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._array.indexOf(value);
	});

	/**
	*列表的数据总个数。
	*/
	__getset(0,__proto,'length',function(){
		return this._array ? this._array.length :0;
	});

	/**
	*获取或设置当前选择的单元格对象。
	*/
	__getset(0,__proto,'selection',function(){
		return this.getCell(this._selectedIndex);
		},function(value){
		this.selectedIndex=this._startIndex+this._cells.indexOf(value);
	});

	/**
	*当前显示的单元格列表的开始索引。
	*/
	__getset(0,__proto,'startIndex',function(){
		return this._startIndex;
		},function(value){
		this._startIndex=value > 0 ? value :0;
		this.callLater(this.renderItems);
	});

	/**
	*列表数据源。
	*/
	__getset(0,__proto,'array',function(){
		return this._array;
		},function(value){
		this.runCallLater(this.changeCells);
		this._array=value || [];
		var length=this._array.length;
		this.totalPage=Math.ceil(length / (this.repeatX *this.repeatY));
		this._selectedIndex=this._selectedIndex < length ? this._selectedIndex :length-1;
		this.startIndex=this._startIndex;
		if (this._scrollBar){
			this._scrollBar.stopScroll();
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			var numY=this._isVertical ? this.repeatY :this.repeatX;
			var lineCount=Math.ceil(length / numX);
			var total=this._cellOffset > 0 ? this.totalPage+1 :this.totalPage;
			if (total > 1){
				this._scrollBar.scrollSize=this._cellSize;
				this._scrollBar.thumbPercent=numY / lineCount;
				this._scrollBar.setScroll(0,(lineCount-numY)*this._cellSize+this._cellOffset,this._scrollBar.value);
				this._scrollBar.target=this._content;
				}else {
				this._scrollBar.setScroll(0,0,0);
				this._scrollBar.target=this._content;
			}
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
		else if ((value instanceof Array))this.array=value
		else Laya.superSet(Box,this,'dataSource',value);
	});

	/**
	*单元格集合。
	*/
	__getset(0,__proto,'cells',function(){
		this.runCallLater(this.changeCells);
		return this._cells;
	});

	return List;
})(Box)


/**
*使用 <code>HScrollBar</code> （水平 <code>ScrollBar</code> ）控件，可以在因数据太多而不能在显示区域完全显示时控制显示的数据部分。
*@example <caption>以下示例代码，创建了一个 <code>HScrollBar</code> 实例。</caption>
*package
*{
	*import laya.ui.HScrollBar;
	*import laya.utils.Handler;
	*public class HScrollBar_Example
	*{
		*private var hScrollBar:HScrollBar;
		*public function HScrollBar_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/hscroll.png","resource/ui/hscroll$bar.png","resource/ui/hscroll$down.png","resource/ui/hscroll$up.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*hScrollBar=new HScrollBar();//创建一个 HScrollBar 类的实例对象 hScrollBar 。
			*hScrollBar.skin="resource/ui/hscroll.png";//设置 hScrollBar 的皮肤。
			*hScrollBar.x=100;//设置 hScrollBar 对象的属性 x 的值，用于控制 hScrollBar 对象的显示位置。
			*hScrollBar.y=100;//设置 hScrollBar 对象的属性 y 的值，用于控制 hScrollBar 对象的显示位置。
			*hScrollBar.changeHandler=new Handler(this,onChange);//设置 hScrollBar 的滚动变化处理器。
			*Laya.stage.addChild(hScrollBar);//将此 hScrollBar 对象添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滚动条的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var hScrollBar;
*var res=["resource/ui/hscroll.png","resource/ui/hscroll$bar.png","resource/ui/hscroll$down.png","resource/ui/hscroll$up.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*console.log("资源加载完成！");
	*hScrollBar=new laya.ui.HScrollBar();//创建一个 HScrollBar 类的实例对象 hScrollBar 。
	*hScrollBar.skin="resource/ui/hscroll.png";//设置 hScrollBar 的皮肤。
	*hScrollBar.x=100;//设置 hScrollBar 对象的属性 x 的值，用于控制 hScrollBar 对象的显示位置。
	*hScrollBar.y=100;//设置 hScrollBar 对象的属性 y 的值，用于控制 hScrollBar 对象的显示位置。
	*hScrollBar.changeHandler=new laya.utils.Handler(this,onChange);//设置 hScrollBar 的滚动变化处理器。
	*Laya.stage.addChild(hScrollBar);//将此 hScrollBar 对象添加到显示列表。
	*}
*function onChange(value)
*{
	*console.log("滚动条的位置： value="+value);
	*}
*@example
*import HScrollBar=laya.ui.HScrollBar;
*import Handler=laya.utils.Handler;
*class HScrollBar_Example {
	*private hScrollBar:HScrollBar;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/hscroll.png","resource/ui/hscroll$bar.png","resource/ui/hscroll$down.png","resource/ui/hscroll$up.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.hScrollBar=new HScrollBar();//创建一个 HScrollBar 类的实例对象 hScrollBar 。
		*this.hScrollBar.skin="resource/ui/hscroll.png";//设置 hScrollBar 的皮肤。
		*this.hScrollBar.x=100;//设置 hScrollBar 对象的属性 x 的值，用于控制 hScrollBar 对象的显示位置。
		*this.hScrollBar.y=100;//设置 hScrollBar 对象的属性 y 的值，用于控制 hScrollBar 对象的显示位置。
		*this.hScrollBar.changeHandler=new Handler(this,this.onChange);//设置 hScrollBar 的滚动变化处理器。
		*Laya.stage.addChild(this.hScrollBar);//将此 hScrollBar 对象添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滚动条的位置： value="+value);
		*}
	*}
*/
//class laya.ui.HScrollBar extends laya.ui.ScrollBar
var HScrollBar=(function(_super){
	function HScrollBar(){
		HScrollBar.__super.call(this);;
	}

	__class(HScrollBar,'laya.ui.HScrollBar',_super);
	var __proto=HScrollBar.prototype;
	/**@inheritDoc */
	__proto.initialize=function(){
		_super.prototype.initialize.call(this);
		this.slider.isVertical=false;
	}

	return HScrollBar;
})(ScrollBar)


/**
*<code>Panel</code> 是一个面板容器类。
*/
//class laya.ui.Panel extends laya.ui.Box
var Panel=(function(_super){
	function Panel(){
		/**@private */
		this._content=null;
		/**@private */
		this._vScrollBar=null;
		/**@private */
		this._hScrollBar=null;
		/**@private */
		this._scrollChanged=false;
		Panel.__super.call(this);
		this.width=this.height=100;
	}

	__class(Panel,'laya.ui.Panel',_super);
	var __proto=Panel.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.Component.prototype.destroy.call(this,destroyChild);
		this._content && this._content.destroy(destroyChild);
		this._vScrollBar && this._vScrollBar.destroy(destroyChild);
		this._hScrollBar && this._hScrollBar.destroy(destroyChild);
		this._vScrollBar=null;
		this._hScrollBar=null;
		this._content=null;
	}

	/**@inheritDoc */
	__proto.destroyChildren=function(){
		this._content.destroyChildren();
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		laya.display.Node.prototype.addChild.call(this,this._content=new Box());
	}

	/**@inheritDoc */
	__proto.addChild=function(child){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.addChild(child);
	}

	/**
	*@private
	*子对象的 <code>Event.RESIZE</code> 事件侦听处理函数。
	*/
	__proto.onResize=function(){
		this._setScrollChanged();
	}

	/**@inheritDoc */
	__proto.addChildAt=function(child,index){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.addChildAt(child,index);
	}

	/**@inheritDoc */
	__proto.removeChild=function(child){
		child.off(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.removeChild(child);
	}

	/**@inheritDoc */
	__proto.removeChildAt=function(index){
		this.getChildAt(index).off(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.removeChildAt(index);
	}

	/**@inheritDoc */
	__proto.removeChildren=function(beginIndex,endIndex){
		(beginIndex===void 0)&& (beginIndex=0);
		(endIndex===void 0)&& (endIndex=0x7fffffff);
		this._content.removeChildren(beginIndex,endIndex);
		this._setScrollChanged();
		return this;
	}

	/**@inheritDoc */
	__proto.getChildAt=function(index){
		return this._content.getChildAt(index);
	}

	/**@inheritDoc */
	__proto.getChildByName=function(name){
		return this._content.getChildByName(name);
	}

	/**@inheritDoc */
	__proto.getChildIndex=function(child){
		return this._content.getChildIndex(child);
	}

	/**@private */
	__proto.changeScroll=function(){
		this._scrollChanged=false;
		var contentW=this.contentWidth || 1;
		var contentH=this.contentHeight || 1;
		var vscroll=this._vScrollBar;
		var hscroll=this._hScrollBar;
		var vShow=vscroll && contentH > this._height;
		var hShow=hscroll && contentW > this._width;
		var showWidth=vShow ? this._width-vscroll.width :this._width;
		var showHeight=hShow ? this._height-hscroll.height :this._height;
		if (vscroll){
			vscroll.x=this._width-vscroll.width;
			vscroll.y=0;
			vscroll.height=this._height-(hShow ? hscroll.height :0);
			vscroll.scrollSize=Math.max(this._height *0.033,1);
			vscroll.thumbPercent=showHeight / contentH;
			vscroll.setScroll(0,contentH-showHeight,vscroll.value);
		}
		if (hscroll){
			hscroll.x=0;
			hscroll.y=this._height-hscroll.height;
			hscroll.width=this._width-(vShow ? vscroll.width :0);
			hscroll.scrollSize=Math.max(this._width *0.033,1);
			hscroll.thumbPercent=showWidth / contentW;
			hscroll.setScroll(0,contentW-showWidth,hscroll.value);
		}
	}

	/**@inheritDoc */
	__proto.changeSize=function(){
		laya.ui.Component.prototype.changeSize.call(this);
		this.setContentSize(this._width,this._height);
	}

	/**
	*@private
	*设置内容的宽度、高度（以像素为单位）。
	*@param width 宽度。
	*@param height 高度。
	*/
	__proto.setContentSize=function(width,height){
		var content=this._content;
		content.width=width;
		content.height=height;
		content.scrollRect || (content.scrollRect=new Rectangle());
		content.scrollRect.setTo(0,0,width,height);
		content.scrollRect=content.scrollRect;
	}

	/**
	*@private
	*滚动条的<code><code>Event.MOUSE_DOWN</code>事件侦听处理函数。</code>事件侦听处理函数。
	*@param scrollBar 滚动条对象。
	*@param e Event 对象。
	*/
	__proto.onScrollBarChange=function(scrollBar){
		var rect=this._content.scrollRect;
		if (rect){
			var start=Math.round(scrollBar.value);
			scrollBar.isVertical ? rect.y=start :rect.x=start;
			this._content.scrollRect=rect;
		}
	}

	/**
	*<p>滚动内容容器至设定的垂直、水平方向滚动条位置。</p>
	*@param x 水平方向滚动条属性value值。滚动条位置数字。
	*@param y 垂直方向滚动条属性value值。滚动条位置数字。
	*/
	__proto.scrollTo=function(x,y){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		if (this.vScrollBar)this.vScrollBar.value=y;
		if (this.hScrollBar)this.hScrollBar.value=x;
	}

	/**
	*刷新滚动内容。
	*/
	__proto.refresh=function(){
		this.changeScroll();
	}

	__proto.onScrollStart=function(){
		this._$P.cacheAs || (this._$P.cacheAs=Laya.superGet(Box,this,'cacheAs'));
		Laya.superSet(Box,this,'cacheAs',"none");
		this._hScrollBar && this._hScrollBar.once(/*laya.events.Event.END*/"end",this,this.onScrollEnd);
		this._vScrollBar && this._vScrollBar.once(/*laya.events.Event.END*/"end",this,this.onScrollEnd);
	}

	__proto.onScrollEnd=function(){
		Laya.superSet(Box,this,'cacheAs',this._$P.cacheAs);
	}

	/**@private */
	__proto._setScrollChanged=function(){
		if (!this._scrollChanged){
			this._scrollChanged=true;
			this.callLater(this.changeScroll);
		}
	}

	/**@inheritDoc */
	__getset(0,__proto,'numChildren',function(){
		return this._content.numChildren;
	});

	/**
	*水平方向滚动条皮肤。
	*/
	__getset(0,__proto,'hScrollBarSkin',function(){
		return this._hScrollBar ? this._hScrollBar.skin :null;
		},function(value){
		if (this._hScrollBar==null){
			laya.display.Node.prototype.addChild.call(this,this._hScrollBar=new HScrollBar());
			this._hScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onScrollBarChange,[this._hScrollBar]);
			this._hScrollBar.target=this._content;
			this._setScrollChanged();
		}
		this._hScrollBar.skin=value;
	});

	/**
	*@private
	*获取内容宽度（以像素为单位）。
	*/
	__getset(0,__proto,'contentWidth',function(){
		var max=0;
		for (var i=this._content.numChildren-1;i >-1;i--){
			var comp=this._content.getChildAt(i);
			max=Math.max(comp.x+comp.width *comp.scaleX,max);
		}
		return max;
	});

	/**
	*@private
	*获取内容高度（以像素为单位）。
	*/
	__getset(0,__proto,'contentHeight',function(){
		var max=0;
		for (var i=this._content.numChildren-1;i >-1;i--){
			var comp=this._content.getChildAt(i);
			max=Math.max(comp.y+comp.height *comp.scaleY,max);
		}
		return max;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Box,this,'width',value);
		this._setScrollChanged();
	});

	/**
	*水平方向滚动条对象。
	*/
	__getset(0,__proto,'hScrollBar',function(){
		return this._hScrollBar;
	});

	/**
	*获取内容容器对象。
	*/
	__getset(0,__proto,'content',function(){
		return this._content;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Box,this,'height',value);
		this._setScrollChanged();
	});

	/**
	*垂直方向滚动条皮肤。
	*/
	__getset(0,__proto,'vScrollBarSkin',function(){
		return this._vScrollBar ? this._vScrollBar.skin :null;
		},function(value){
		if (this._vScrollBar==null){
			laya.display.Node.prototype.addChild.call(this,this._vScrollBar=new VScrollBar());
			this._vScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onScrollBarChange,[this._vScrollBar]);
			this._vScrollBar.target=this._content;
			this._setScrollChanged();
		}
		this._vScrollBar.skin=value;
	});

	/**
	*垂直方向滚动条对象。
	*/
	__getset(0,__proto,'vScrollBar',function(){
		return this._vScrollBar;
	});

	/**@inheritDoc */
	__getset(0,__proto,'cacheAs',_super.prototype._$get_cacheAs,function(value){
		Laya.superSet(Box,this,'cacheAs',value);
		this._$P.cacheAs=null;
		if (value!=="none"){
			this._hScrollBar && this._hScrollBar.on(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			this._vScrollBar && this._vScrollBar.on(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			}else {
			this._hScrollBar && this._hScrollBar.off(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			this._vScrollBar && this._vScrollBar.off(/*laya.events.Event.START*/"start",this,this.onScrollStart);
		}
	});

	return Panel;
})(Box)


/**
*使用 <code>HSlider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
*<p> <code>HSlider</code> 控件采用水平方向。滑块轨道从左向右扩展，而标签位于轨道的顶部或底部。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>HSlider</code> 实例。</caption>
*package
*{
	*import laya.ui.HSlider;
	*import laya.utils.Handler;
	*public class HSlider_Example
	*{
		*private var hSlider:HSlider;
		*public function HSlider_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/hslider.png","resource/ui/hslider$bar.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*hSlider=new HSlider();//创建一个 HSlider 类的实例对象 hSlider 。
			*hSlider.skin="resource/ui/hslider.png";//设置 hSlider 的皮肤。
			*hSlider.min=0;//设置 hSlider 最低位置值。
			*hSlider.max=10;//设置 hSlider 最高位置值。
			*hSlider.value=2;//设置 hSlider 当前位置值。
			*hSlider.tick=1;//设置 hSlider 刻度值。
			*hSlider.x=100;//设置 hSlider 对象的属性 x 的值，用于控制 hSlider 对象的显示位置。
			*hSlider.y=100;//设置 hSlider 对象的属性 y 的值，用于控制 hSlider 对象的显示位置。
			*hSlider.changeHandler=new Handler(this,onChange);//设置 hSlider 位置变化处理器。
			*Laya.stage.addChild(hSlider);//把 hSlider 添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滑块的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800,"canvas");//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var hSlider;
*var res=["resource/ui/hslider.png","resource/ui/hslider$bar.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));
*function onLoadComplete(){
	*console.log("资源加载完成！");
	*hSlider=new laya.ui.HSlider();//创建一个 HSlider 类的实例对象 hSlider 。
	*hSlider.skin="resource/ui/hslider.png";//设置 hSlider 的皮肤。
	*hSlider.min=0;//设置 hSlider 最低位置值。
	*hSlider.max=10;//设置 hSlider 最高位置值。
	*hSlider.value=2;//设置 hSlider 当前位置值。
	*hSlider.tick=1;//设置 hSlider 刻度值。
	*hSlider.x=100;//设置 hSlider 对象的属性 x 的值，用于控制 hSlider 对象的显示位置。
	*hSlider.y=100;//设置 hSlider 对象的属性 y 的值，用于控制 hSlider 对象的显示位置。
	*hSlider.changeHandler=new laya.utils.Handler(this,onChange);//设置 hSlider 位置变化处理器。
	*Laya.stage.addChild(hSlider);//把 hSlider 添加到显示列表。
	*}
*function onChange(value)
*{
	*console.log("滑块的位置： value="+value);
	*}
*@example
*import Handler=laya.utils.Handler;
*import HSlider=laya.ui.HSlider;
*class HSlider_Example {
	*private hSlider:HSlider;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/hslider.png","resource/ui/hslider$bar.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.hSlider=new HSlider();//创建一个 HSlider 类的实例对象 hSlider 。
		*this.hSlider.skin="resource/ui/hslider.png";//设置 hSlider 的皮肤。
		*this.hSlider.min=0;//设置 hSlider 最低位置值。
		*this.hSlider.max=10;//设置 hSlider 最高位置值。
		*this.hSlider.value=2;//设置 hSlider 当前位置值。
		*this.hSlider.tick=1;//设置 hSlider 刻度值。
		*this.hSlider.x=100;//设置 hSlider 对象的属性 x 的值，用于控制 hSlider 对象的显示位置。
		*this.hSlider.y=100;//设置 hSlider 对象的属性 y 的值，用于控制 hSlider 对象的显示位置。
		*this.hSlider.changeHandler=new Handler(this,this.onChange);//设置 hSlider 位置变化处理器。
		*Laya.stage.addChild(this.hSlider);//把 hSlider 添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滑块的位置： value="+value);
		*}
	*}
*
*@see laya.ui.Slider
*/
//class laya.ui.HSlider extends laya.ui.Slider
var HSlider=(function(_super){
	/**
	*创建一个 <code>HSlider</code> 类实例。
	*@param skin 皮肤。
	*/
	function HSlider(skin){
		HSlider.__super.call(this,skin);
		this.isVertical=false;
	}

	__class(HSlider,'laya.ui.HSlider',_super);
	return HSlider;
})(Slider)


/**
*<code>Group</code> 是一个可以自动布局的项集合控件。
*<p> <code>Group</code> 的默认项对象为 <code>Button</code> 类实例。
*<code>Group</code> 是 <code>Tab</code> 和 <code>RadioGroup</code> 的基类。</p>
*/
//class laya.ui.UIGroup extends laya.ui.Box
var UIGroup=(function(_super){
	function UIGroup(labels,skin){
		/**
		*改变 <code>Group</code> 的选择项时执行的处理器，(默认返回参数： 项索引（index:int）)。
		*/
		this.selectHandler=null;
		/**@private */
		this._items=null;
		/**@private */
		this._selectedIndex=-1;
		/**@private */
		this._skin=null;
		/**@private */
		this._direction="horizontal";
		/**@private */
		this._space=0;
		/**@private */
		this._labels=null;
		/**@private */
		this._labelColors=null;
		/**@private */
		this._labelFont=null;
		/**@private */
		this._labelStrokeColor=null;
		/**@private */
		this._strokeColors=null;
		/**@private */
		this._labelStroke=NaN;
		/**@private */
		this._labelSize=0;
		/**@private */
		this._labelBold=false;
		/**@private */
		this._labelPadding=null;
		/**@private */
		this._labelAlign=null;
		/**@private */
		this._stateNum=0;
		/**@private */
		this._labelChanged=false;
		UIGroup.__super.call(this);
		this.skin=skin;
		this.labels=labels;
	}

	__class(UIGroup,'laya.ui.UIGroup',_super);
	var __proto=UIGroup.prototype;
	Laya.imps(__proto,{"laya.ui.IItem":true})
	/**@inheritDoc */
	__proto.preinitialize=function(){
		this.mouseEnabled=true;
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.Component.prototype.destroy.call(this,destroyChild);
		this._items && (this._items.length=0);
		this._items=null;
		this.selectHandler=null;
	}

	/**
	*添加一个项对象，返回此项对象的索引id。
	*
	*@param item 需要添加的项对象。
	*@param autoLayOut 是否自动布局，如果为true，会根据 <code>direction</code> 和 <code>space</code> 属性计算item的位置。
	*@return
	*/
	__proto.addItem=function(item,autoLayOut){
		(autoLayOut===void 0)&& (autoLayOut=true);
		var display=item;
		var index=this._items.length;
		display.name="item"+index;
		this.addChild(display);
		this.initItems();
		if (autoLayOut && index > 0){
			var preItem=this._items [index-1];
			if (this._direction=="horizontal"){
				display.x=preItem.x+preItem.width+this._space;
				}else {
				display.y=preItem.y+preItem.height+this._space;
			}
			}else {
			if (autoLayOut){
				display.x=0;
				display.y=0;
			}
		}
		return index;
	}

	/**
	*删除一个项对象。
	*@param item 需要删除的项对象。
	*@param autoLayOut 是否自动布局，如果为true，会根据 <code>direction</code> 和 <code>space</code> 属性计算item的位置。
	*/
	__proto.delItem=function(item,autoLayOut){
		(autoLayOut===void 0)&& (autoLayOut=true);
		var index=this._items.indexOf(item);
		if (index !=-1){
			var display=item;
			this.removeChild(display);
			for (var i=index+1,n=this._items.length;i < n;i++){
				var child=this._items [i];
				child.name="item"+(i-1);
				if (autoLayOut){
					if (this._direction=="horizontal"){
						child.x-=display.width+this._space;
						}else {
						child.y-=display.height+this._space;
					}
				}
			}
			this.initItems();
			if (this._selectedIndex >-1){
				var newIndex=0;
				newIndex=this._selectedIndex < this._items.length ? this._selectedIndex :(this._selectedIndex-1);
				this._selectedIndex=-1;
				this.selectedIndex=newIndex;
			}
		}
	}

	/**
	*初始化项对象们。
	*/
	__proto.initItems=function(){
		this._items || (this._items=[]);
		this._items.length=0;
		for (var i=0;i < 10000;i++){
			var item=this.getChildByName("item"+i);
			if (item==null)break ;
			this._items.push(item);
			item.selected=(i===this._selectedIndex);
			item.clickHandler=Handler.create(this,this.itemClick,[i],false);
		}
	}

	/**
	*@private
	*项对象的点击事件侦听处理函数。
	*@param index 项索引。
	*/
	__proto.itemClick=function(index){
		this.selectedIndex=index;
	}

	/**
	*@private
	*通过对象的索引设置项对象的 <code>selected</code> 属性值。
	*@param index 需要设置的项对象的索引。
	*@param selected 表示项对象的选中状态。
	*/
	__proto.setSelect=function(index,selected){
		if (this._items && index >-1 && index < this._items.length)this._items[index].selected=selected;
	}

	/**
	*@private
	*创建一个项显示对象。
	*@param skin 项对象的皮肤。
	*@param label 项对象标签。
	*/
	__proto.createItem=function(skin,label){
		return null;
	}

	/**
	*@private
	*更改项对象的属性值。
	*/
	__proto.changeLabels=function(){
		this._labelChanged=false;
		if (this._items){
			var left=0
			for (var i=0,n=this._items.length;i < n;i++){
				var btn=this._items [i];
				this._skin && (btn.skin=this._skin);
				this._labelColors && (btn.labelColors=this._labelColors);
				this._labelSize && (btn.labelSize=this._labelSize);
				this._labelStroke && (btn.labelStroke=this._labelStroke);
				this._labelStrokeColor && (btn.labelStrokeColor=this._labelStrokeColor);
				this._strokeColors && (btn.strokeColors=this._strokeColors);
				this._labelBold && (btn.labelBold=this._labelBold);
				this._labelPadding && (btn.labelPadding=this._labelPadding);
				this._labelAlign && (btn.labelAlign=this._labelAlign);
				this._stateNum && (btn.stateNum=this._stateNum);
				this._labelFont && (btn.labelFont=this._labelFont);
				if (this._direction==="horizontal"){
					btn.y=0;
					btn.x=left;
					left+=btn.width+this._space;
					}else {
					btn.x=0;
					btn.y=left;
					left+=btn.height+this._space;
				}
			}
		}
		this.changeSize();
	}

	/**@inheritDoc */
	__proto.commitMeasure=function(){
		this.runCallLater(this.changeLabels);
	}

	/**@private */
	__proto._setLabelChanged=function(){
		if (!this._labelChanged){
			this._labelChanged=true;
			this.callLater(this.changeLabels);
		}
	}

	/**
	*<p>描边颜色，以字符串表示。</p>
	*默认值为 "#000000"（黑色）;
	*@see laya.display.Text.strokeColor()
	*/
	__getset(0,__proto,'labelStrokeColor',function(){
		return this._labelStrokeColor;
		},function(value){
		if (this._labelStrokeColor !=value){
			this._labelStrokeColor=value;
			this._setLabelChanged();
		}
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示当前选择的项索引。默认值为-1。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this.setSelect(this._selectedIndex,false);
			this._selectedIndex=value;
			this.setSelect(value,true);
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.selectHandler && this.selectHandler.runWith(this._selectedIndex);
		}
	});

	/**
	*标签集合字符串。以逗号做分割，如"item0,item1,item2,item3,item4,item5"。
	*/
	__getset(0,__proto,'labels',function(){
		return this._labels;
		},function(value){
		if (this._labels !=value){
			this._labels=value;
			this.removeChildren();
			this._setLabelChanged();
			if (this._labels){
				var a=this._labels.split(",");
				for (var i=0,n=a.length;i < n;i++){
					var item=this.createItem(this._skin,a[i]);
					item.name="item"+i;
					this.addChild(item);
				}
			}
			this.initItems();
		}
	});

	/**
	*<p>表示各个状态下的描边颜色。</p>
	*@see laya.display.Text.strokeColor()
	*/
	__getset(0,__proto,'strokeColors',function(){
		return this._strokeColors;
		},function(value){
		if (this._strokeColors !=value){
			this._strokeColors=value;
			this._setLabelChanged();
		}
	});

	/**
	*@copy laya.ui.Button#labelColors()
	*/
	__getset(0,__proto,'labelColors',function(){
		return this._labelColors;
		},function(value){
		if (this._labelColors !=value){
			this._labelColors=value;
			this._setLabelChanged();
		}
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*默认值0，表示不描边。
	*@see laya.display.Text.stroke()
	*/
	__getset(0,__proto,'labelStroke',function(){
		return this._labelStroke;
		},function(value){
		if (this._labelStroke !=value){
			this._labelStroke=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签的字体大小。
	*/
	__getset(0,__proto,'labelSize',function(){
		return this._labelSize;
		},function(value){
		if (this._labelSize !=value){
			this._labelSize=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮的状态值，以数字表示，默认为3态。
	*@see laya.ui.Button#stateNum
	*/
	__getset(0,__proto,'stateNum',function(){
		return this._stateNum;
		},function(value){
		if (this._stateNum !=value){
			this._stateNum=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签是否为粗体字。
	*/
	__getset(0,__proto,'labelBold',function(){
		return this._labelBold;
		},function(value){
		if (this._labelBold !=value){
			this._labelBold=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签的字体名称，以字符串形式表示。
	*@see laya.display.Text.font()
	*/
	__getset(0,__proto,'labelFont',function(){
		return this._labelFont;
		},function(value){
		if (this._labelFont !=value){
			this._labelFont=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签的边距。
	*<p><b>格式：</b>"上边距,右边距,下边距,左边距"。</p>
	*/
	__getset(0,__proto,'labelPadding',function(){
		return this._labelPadding;
		},function(value){
		if (this._labelPadding !=value){
			this._labelPadding=value;
			this._setLabelChanged();
		}
	});

	/**
	*布局方向。
	*<p>默认值为"horizontal"。</p>
	*<p><b>取值：</b>
	*<li>"horizontal"：表示水平布局。</li>
	*<li>"vertical"：表示垂直布局。</li>
	*</p>
	*/
	__getset(0,__proto,'direction',function(){
		return this._direction;
		},function(value){
		this._direction=value;
		this._setLabelChanged();
	});

	/**
	*项对象们之间的间隔（以像素为单位）。
	*/
	__getset(0,__proto,'space',function(){
		return this._space;
		},function(value){
		this._space=value;
		this._setLabelChanged();
	});

	/**
	*项对象们的存放数组。
	*/
	__getset(0,__proto,'items',function(){
		return this._items;
	});

	/**
	*获取或设置当前选择的项对象。
	*/
	__getset(0,__proto,'selection',function(){
		return this._selectedIndex >-1 && this._selectedIndex < this._items.length ? this._items[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._items.indexOf(value);
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
		else if ((value instanceof Array))this.labels=(value).join(",");
		else Laya.superSet(Box,this,'dataSource',value);
	});

	return UIGroup;
})(Box)


/**
*<code>Radio</code> 控件使用户可在一组互相排斥的选择中做出一种选择。
*用户一次只能选择 <code>Radio</code> 组中的一个成员。选择未选中的组成员将取消选择该组中当前所选的 <code>Radio</code> 控件。
*@see laya.ui.RadioGroup
*/
//class laya.ui.Radio extends laya.ui.Button
var Radio=(function(_super){
	function Radio(skin,label){
		/**@private */
		this._value=null;
		(label===void 0)&& (label="");
		Radio.__super.call(this,skin,label);
	}

	__class(Radio,'laya.ui.Radio',_super);
	var __proto=Radio.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._value=null;
	}

	/**@inheritDoc */
	__proto.preinitialize=function(){
		laya.ui.Component.prototype.preinitialize.call(this);
		this.toggle=false;
		this._autoSize=false;
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		_super.prototype.initialize.call(this);
		this.createText();
		this._text.align="left";
		this._text.valign="top";
		this._text.width=0;
		this.on(/*laya.events.Event.CLICK*/"click",this,this.onClick);
	}

	/**
	*@private
	*对象的<code>Event.CLICK</code>事件侦听处理函数。
	*/
	__proto.onClick=function(e){
		this.selected=true;
	}

	/**
	*获取或设置 <code>Radio</code> 关联的可选用户定义值。
	*/
	__getset(0,__proto,'value',function(){
		return this._value !=null ? this._value :this.label;
		},function(obj){
		this._value=obj;
	});

	return Radio;
})(Button)


/**
*<code>Tree</code> 控件使用户可以查看排列为可扩展树的层次结构数据。
*
*@example
*package
*{
	*import laya.ui.Tree;
	*import laya.utils.Browser;
	*import laya.utils.Handler;
	*public class Tree_Example
	*{
		*public function Tree_Example()
		*{
			*Laya.init(640,800);
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png","resource/ui/clip_selectBox.png","resource/ui/clip_tree_folder.png","resource/ui/clip_tree_arrow.png"],Handler.create(this,onLoadComplete));
			*}
		*private function onLoadComplete():void
		*{
			*var xmlString:String;//创建一个xml字符串，用于存储树结构数据。
			*xmlString="&lt;root&gt;&lt;item label='box1'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;abc label='child5'/&gt;&lt;/item&gt;&lt;item label='box2'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;/item&gt;&lt;/root&gt;";
			*var domParser:*=new Browser.window.DOMParser();//创建一个DOMParser实例domParser。
			*var xml:*=domParser.parseFromString(xmlString,"text/xml");//解析xml字符。
			*var tree:Tree=new Tree();//创建一个 Tree 类的实例对象 tree 。
			*tree.scrollBarSkin="resource/ui/vscroll.png";//设置 tree 的皮肤。
			*tree.itemRender=Item;//设置 tree 的项渲染器。
			*tree.xml=xml;//设置 tree 的树结构数据。
			*tree.x=100;//设置 tree 对象的属性 x 的值，用于控制 tree 对象的显示位置。
			*tree.y=100;//设置 tree 对象的属性 y 的值，用于控制 tree 对象的显示位置。
			*tree.width=200;//设置 tree 的宽度。
			*tree.height=100;//设置 tree 的高度。
			*Laya.stage.addChild(tree);//将 tree 添加到显示列表。
			*}
		*}
	*}
*import laya.ui.Box;
*import laya.ui.Clip;
*import laya.ui.Label;
*class Item extends Box
*{
	*public function Item()
	*{
		*this.name="render";
		*this.right=0;
		*this.left=0;
		*var selectBox:Clip=new Clip("resource/ui/clip_selectBox.png",1,2);
		*selectBox.name="selectBox";
		*selectBox.height=24;
		*selectBox.x=13;
		*selectBox.y=0;
		*selectBox.left=12;
		*addChild(selectBox);
		*var folder:Clip=new Clip("resource/ui/clip_tree_folder.png",1,3);
		*folder.name="folder";
		*folder.x=14;
		*folder.y=4;
		*addChild(folder);
		*var label:Label=new Label("treeItem");
		*label.name="label";
		*label.color="#ffff00";
		*label.width=150;
		*label.height=22;
		*label.x=33;
		*label.y=1;
		*label.left=33;
		*label.right=0;
		*addChild(label);
		*var arrow:Clip=new Clip("resource/ui/clip_tree_arrow.png",1,2);
		*arrow.name="arrow";
		*arrow.x=0;
		*arrow.y=5;
		*addChild(arrow);
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var res=["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png","resource/ui/clip_selectBox.png","resource/ui/clip_tree_folder.png","resource/ui/clip_tree_arrow.png"];
*Laya.loader.load(res,new laya.utils.Handler(this,onLoadComplete));
*function onLoadComplete(){
	*var xmlString;//创建一个xml字符串，用于存储树结构数据。
	*xmlString="&lt;root&gt;&lt;item label='box1'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;abc label='child5'/&gt;&lt;/item&gt;&lt;item label='box2'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;/item&gt;&lt;/root&gt;";
	*var domParser=new laya.utils.Browser.window.DOMParser();//创建一个DOMParser实例domParser。
	*var xml=domParser.parseFromString(xmlString,"text/xml");//解析xml字符。
	*var tree=new laya.ui.Tree();//创建一个 Tree 类的实例对象 tree 。
	*tree.scrollBarSkin="resource/ui/vscroll.png";//设置 tree 的皮肤。
	*tree.itemRender=mypackage.treeExample.Item;//设置 tree 的项渲染器。
	*tree.xml=xml;//设置 tree 的树结构数据。
	*tree.x=100;//设置 tree 对象的属性 x 的值，用于控制 tree 对象的显示位置。
	*tree.y=100;//设置 tree 对象的属性 y 的值，用于控制 tree 对象的显示位置。
	*tree.width=200;//设置 tree 的宽度。
	*tree.height=100;//设置 tree 的高度。
	*Laya.stage.addChild(tree);//将 tree 添加到显示列表。
	*}
*(function (_super){
	*function Item(){
		*Item.__super.call(this);//初始化父类。
		*this.right=0;
		*this.left=0;
		*var selectBox=new laya.ui.Clip("resource/ui/clip_selectBox.png",1,2);
		*selectBox.name="selectBox";//设置 selectBox 的name 为“selectBox”时，将被识别为树结构的项的背景。2帧：悬停时背景、选中时背景。
		*selectBox.height=24;
		*selectBox.x=13;
		*selectBox.y=0;
		*selectBox.left=12;
		*this.addChild(selectBox);//需要使用this.访问父类的属性或方法。
		*var folder=new laya.ui.Clip("resource/ui/clip_tree_folder.png",1,3);
		*folder.name="folder";//设置 folder 的name 为“folder”时，将被识别为树结构的文件夹开启状态图表。2帧：折叠状态、打开状态。
		*folder.x=14;
		*folder.y=4;
		*this.addChild(folder);
		*var label=new laya.ui.Label("treeItem");
		*label.name="label";//设置 label 的name 为“label”时，此值将用于树结构数据赋值。
		*label.color="#ffff00";
		*label.width=150;
		*label.height=22;
		*label.x=33;
		*label.y=1;
		*label.left=33;
		*label.right=0;
		*this.addChild(label);
		*var arrow=new laya.ui.Clip("resource/ui/clip_tree_arrow.png",1,2);
		*arrow.name="arrow";//设置 arrow 的name 为“arrow”时，将被识别为树结构的文件夹开启状态图表。2帧：折叠状态、打开状态。
		*arrow.x=0;
		*arrow.y=5;
		*this.addChild(arrow);
		*};
	*Laya.class(Item,"mypackage.treeExample.Item",_super);//注册类 Item 。
	*})(laya.ui.Box);
*@example
*import Tree=laya.ui.Tree;
*import Browser=laya.utils.Browser;
*import Handler=laya.utils.Handler;
*class Tree_Example {
	*constructor(){
		*Laya.init(640,800);
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png","resource/ui/vscroll$up.png","resource/ui/clip_selectBox.png","resource/ui/clip_tree_folder * . * png","resource/ui/clip_tree_arrow.png"],Handler.create(this,this.onLoadComplete));
		*}
	*private onLoadComplete():void {
		*var xmlString:String;//创建一个xml字符串，用于存储树结构数据。
		*xmlString="&lt;root&gt;&lt;item label='box1'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;abc label='child5'/&gt;&lt;/item&gt;&lt;item label='box2'&gt;&lt;abc  * label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;/item&gt;&lt;/root&gt;";
		*var domParser:any=new Browser.window.DOMParser();//创建一个DOMParser实例domParser。
		*var xml:any=domParser.parseFromString(xmlString,"text/xml");//解析xml字符。
		*var tree:Tree=new Tree();//创建一个 Tree 类的实例对象 tree 。
		*tree.scrollBarSkin="resource/ui/vscroll.png";//设置 tree 的皮肤。
		*tree.itemRender=Item;//设置 tree 的项渲染器。
		*tree.xml=xml;//设置 tree 的树结构数据。
		*tree.x=100;//设置 tree 对象的属性 x 的值，用于控制 tree 对象的显示位置。
		*tree.y=100;//设置 tree 对象的属性 y 的值，用于控制 tree 对象的显示位置。
		*tree.width=200;//设置 tree 的宽度。
		*tree.height=100;//设置 tree 的高度。
		*Laya.stage.addChild(tree);//将 tree 添加到显示列表。
		*}
	*}
*import Box=laya.ui.Box;
*import Clip=laya.ui.Clip;
*import Label=laya.ui.Label;
*class Item extends Box {
	*constructor(){
		*super();
		*this.name="render";
		*this.right=0;
		*this.left=0;
		*var selectBox:Clip=new Clip("resource/ui/clip_selectBox.png",1,2);
		*selectBox.name="selectBox";
		*selectBox.height=24;
		*selectBox.x=13;
		*selectBox.y=0;
		*selectBox.left=12;
		*this.addChild(selectBox);
		*var folder:Clip=new Clip("resource/ui/clip_tree_folder.png",1,3);
		*folder.name="folder";
		*folder.x=14;
		*folder.y=4;
		*this.addChild(folder);
		*var label:Label=new Label("treeItem");
		*label.name="label";
		*label.color="#ffff00";
		*label.width=150;
		*label.height=22;
		*label.x=33;
		*label.y=1;
		*label.left=33;
		*label.right=0;
		*this.addChild(label);
		*var arrow:Clip=new Clip("resource/ui/clip_tree_arrow.png",1,2);
		*arrow.name="arrow";
		*arrow.x=0;
		*arrow.y=5;
		*this.addChild(arrow);
		*}
	*}
*/
//class laya.ui.Tree extends laya.ui.Box
var Tree=(function(_super){
	function Tree(){
		/**@private */
		this._list=null;
		/**@private */
		this._source=null;
		/**@private */
		this._renderHandler=null;
		/**@private */
		this._spaceLeft=10;
		/**@private */
		this._spaceBottom=0;
		/**@private */
		this._keepStatus=true;
		Tree.__super.call(this);
		this.width=this.height=200;
	}

	__class(Tree,'laya.ui.Tree',_super);
	var __proto=Tree.prototype;
	Laya.imps(__proto,{"laya.ui.IRender":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.Component.prototype.destroy.call(this,destroyChild);
		this._list && this._list.destroy(destroyChild);
		this._list=null;
		this._source=null;
		this._renderHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._list=new List());
		this._list.renderHandler=Handler.create(this,this.renderItem,null,false);
		this._list.repeatX=1;
		this._list.on(/*laya.events.Event.CHANGE*/"change",this,this.onListChange);
	}

	/**
	*@private
	*此对象包含的<code>List</code>实例的<code>Event.CHANGE</code>事件侦听处理函数。
	*/
	__proto.onListChange=function(e){
		this.event(/*laya.events.Event.CHANGE*/"change");
	}

	/**
	*@private
	*获取数据源集合。
	*/
	__proto.getArray=function(){
		var arr=[];
		var item;
		/*for each*/for(var $each_item in this._source){
			item=this._source[$each_item];
			if (this.getParentOpenStatus(item)){
				item.x=this._spaceLeft *this.getDepth(item);
				arr.push(item);
			}
		}
		return arr;
	}

	/**
	*@private
	*获取项对象的深度。
	*/
	__proto.getDepth=function(item,num){
		(num===void 0)&& (num=0);
		if (item.nodeParent==null)return num;
		else return this.getDepth(item.nodeParent,num+1);
	}

	/**
	*@private
	*获取项对象的上一级的打开状态。
	*/
	__proto.getParentOpenStatus=function(item){
		var parent=item.nodeParent;
		if (parent==null){
			return true;
			}else {
			if (parent.isOpen){
				if (parent.nodeParent !=null)return this.getParentOpenStatus(parent);
				else return true;
				}else {
				return false;
			}
		}
	}

	/**
	*@private
	*渲染一个项对象。
	*@param cell 一个项对象。
	*@param index 项的索引。
	*/
	__proto.renderItem=function(cell,index){
		var item=cell.dataSource;
		if (item){
			cell.left=item.x;
			var arrow=cell.getChildByName("arrow");
			if (arrow){
				if (item.hasChild){
					arrow.visible=true;
					arrow.index=item.isOpen ? 1 :0;
					arrow.tag=index;
					arrow.off(/*laya.events.Event.CLICK*/"click",this,this.onArrowClick);
					arrow.on(/*laya.events.Event.CLICK*/"click",this,this.onArrowClick);
					}else {
					arrow.visible=false;
				}
			};
			var folder=cell.getChildByName("folder");
			if (folder){
				if (folder.clipY==2){
					folder.index=item.isDirectory ? 0 :1;
					}else {
					folder.index=item.isDirectory ? item.isOpen ? 1 :0 :2;
				}
			}
			this._renderHandler && this._renderHandler.runWith([cell,index]);
		}
	}

	/**
	*@private
	*/
	__proto.onArrowClick=function(e){
		var arrow=e.currentTarget;
		var index=arrow.tag;
		this._list.array[index].isOpen=!this._list.array[index].isOpen;
		this.event(/*laya.events.Event.OPEN*/"open");
		this._list.array=this.getArray();
	}

	/**
	*设置指定项索引的项对象的打开状态。
	*@param index 项索引。
	*@param isOpen 是否处于打开状态。
	*/
	__proto.setItemState=function(index,isOpen){
		if (!this._list.array[index])return;
		this._list.array[index].isOpen=isOpen;
		this._list.array=this.getArray();
	}

	/**
	*刷新项列表。
	*/
	__proto.fresh=function(){
		this._list.array=this.getArray();
		this.repaint();
	}

	/**
	*@private
	*解析并处理XML类型的数据源。
	*/
	__proto.parseXml=function(xml,source,nodeParent,isRoot){
		var obj;
		var list=xml.childNodes;
		var childCount=list.length;
		if (!isRoot){
			obj={};
			var list2=xml.attributes;
			var attrs;
			/*for each*/for(var $each_attrs in list2){
				attrs=list2[$each_attrs];
				var prop=attrs.nodeName;
				var value=attrs.nodeValue;
				obj[prop]=value=="true" ? true :value=="false" ? false :value;
			}
			obj.nodeParent=nodeParent;
			if (childCount > 0)obj.isDirectory=true;
			obj.hasChild=childCount > 0;
			source.push(obj);
		}
		for (var i=0;i < childCount;i++){
			var node=list[i];
			this.parseXml(node,source,obj,false);
		}
	}

	/**
	*@private
	*处理数据项的打开状态。
	*/
	__proto.parseOpenStatus=function(oldSource,newSource){
		for (var i=0,n=newSource.length;i < n;i++){
			var newItem=newSource[i];
			if (newItem.isDirectory){
				for (var j=0,m=oldSource.length;j < m;j++){
					var oldItem=oldSource[j];
					if (oldItem.isDirectory && this.isSameParent(oldItem,newItem)&& newItem.label==oldItem.label){
						newItem.isOpen=oldItem.isOpen;
						break ;
					}
				}
			}
		}
	}

	/**
	*@private
	*判断两个项对象在树结构中的父节点是否相同。
	*@param item1 项对象。
	*@param item2 项对象。
	*@return 如果父节点相同值为true，否则值为false。
	*/
	__proto.isSameParent=function(item1,item2){
		if (item1.nodeParent==null && item2.nodeParent==null)return true;
		else if (item1.nodeParent==null || item2.nodeParent==null)return false
		else {
			if (item1.nodeParent.label==item2.nodeParent.label)return this.isSameParent(item1.nodeParent,item2.nodeParent);
			else return false;
		}
	}

	/**
	*更新项列表，显示指定键名的数据项。
	*@param key 键名。
	*/
	__proto.filter=function(key){
		if (Boolean(key)){
			var result=[];
			this.getFilterSource(this._source,result,key);
			this._list.array=result;
			}else {
			this._list.array=this.getArray();
		}
	}

	/**
	*@private
	*获取数据源中指定键名的值。
	*/
	__proto.getFilterSource=function(array,result,key){
		key=key.toLocaleLowerCase();
		var item;
		/*for each*/for(var $each_item in array){
			item=array[$each_item];
			if (!item.isDirectory && String(item.label).toLowerCase().indexOf(key)>-1){
				item.x=0;
				result.push(item);
			}
			if (item.child && item.child.length > 0){
				this.getFilterSource(item.child,result,key);
			}
		}
	}

	/**
	*每一项之间的间隔距离（以像素为单位）。
	*/
	__getset(0,__proto,'spaceBottom',function(){
		return this._list.spaceY;
		},function(value){
		this._list.spaceY=value;
	});

	/**
	*数据源发生变化后，是否保持之前打开状态，默认为true。
	*<p><b>取值：</b>
	*<li>true：保持之前打开状态。</li>
	*<li>false：不保持之前打开状态。</li>
	*</p>
	*/
	__getset(0,__proto,'keepStatus',function(){
		return this._keepStatus;
		},function(value){
		this._keepStatus=value;
	});

	/**
	*此对象包含的<code>List</code>实例的单元格渲染器。
	*<p><b>取值：</b>
	*<ol>
	*<li>单元格类对象。</li>
	*<li> UI 的 JSON 描述。</li>
	*</ol></p>
	*/
	__getset(0,__proto,'itemRender',function(){
		return this._list.itemRender;
		},function(value){
		this._list.itemRender=value;
	});

	/**
	*列表数据源，只包含当前可视节点数据。
	*/
	__getset(0,__proto,'array',function(){
		return this._list.array;
		},function(value){
		if (this._keepStatus && this._list.array && value){
			this.parseOpenStatus(this._list.array,value);
		}
		this._source=value;
		this._list.array=this.getArray();
	});

	/**
	*单元格鼠标事件处理器。
	*<p>默认返回参数（e:Event,index:int）。</p>
	*/
	__getset(0,__proto,'mouseHandler',function(){
		return this._list.mouseHandler;
		},function(value){
		this._list.mouseHandler=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		Laya.superSet(Box,this,'dataSource',value);
	});

	/**
	*数据源，全部节点数据。
	*/
	__getset(0,__proto,'source',function(){
		return this._source;
	});

	/**滚动条*/
	__getset(0,__proto,'scrollBar',function(){
		return this._list.scrollBar;
	});

	/**
	*此对象包含的<code>List</code>实例对象。
	*/
	__getset(0,__proto,'list',function(){
		return this._list;
	});

	/**
	*滚动条皮肤。
	*/
	__getset(0,__proto,'scrollBarSkin',function(){
		return this._list.vScrollBarSkin;
		},function(value){
		this._list.vScrollBarSkin=value;
	});

	/**
	*<code>Tree</code> 实例的渲染处理器。
	*/
	__getset(0,__proto,'renderHandler',function(){
		return this._renderHandler;
		},function(value){
		this._renderHandler=value;
	});

	/**
	*表示当前选择的项索引。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._list.selectedIndex;
		},function(value){
		this._list.selectedIndex=value;
	});

	/**
	*左侧缩进距离（以像素为单位）。
	*/
	__getset(0,__proto,'spaceLeft',function(){
		return this._spaceLeft;
		},function(value){
		this._spaceLeft=value;
	});

	/**
	*当前选中的项对象的数据源。
	*/
	__getset(0,__proto,'selectedItem',function(){
		return this._list.selectedItem;
		},function(value){
		this._list.selectedItem=value;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Box,this,'width',value);
		this._list.width=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Box,this,'height',value);
		this._list.height=value;
	});

	/**
	*xml结构的数据源。
	*/
	__getset(0,__proto,'xml',null,function(value){
		var arr=[];
		this.parseXml(value.childNodes[0],arr,null,true);
		this.array=arr;
	});

	/**
	*表示选择的树节点项的<code>path</code>属性值。
	*/
	__getset(0,__proto,'selectedPath',function(){
		if (this._list.selectedItem){
			return this._list.selectedItem.path;
		}
		return null;
	});

	return Tree;
})(Box)


/**
*<code>ViewStack</code> 类用于视图堆栈类，用于视图的显示等设置处理。
*/
//class laya.ui.ViewStack extends laya.ui.Box
var ViewStack=(function(_super){
	function ViewStack(){
		/**@private */
		this._items=null;
		/**@private */
		this._selectedIndex=0;
		ViewStack.__super.call(this);
		this._setIndexHandler=Handler.create(this,this.setIndex,null,false);
	}

	__class(ViewStack,'laya.ui.ViewStack',_super);
	var __proto=ViewStack.prototype;
	Laya.imps(__proto,{"laya.ui.IItem":true})
	/**
	*批量设置视图对象。
	*@param views 视图对象数组。
	*/
	__proto.setItems=function(views){
		this.removeChildren();
		var index=0;
		for (var i=0,n=views.length;i < n;i++){
			var item=views[i];
			if (item){
				item.name="item"+index;
				this.addChild(item);
				index++;
			}
		}
		this.initItems();
	}

	/**
	*添加视图。
	*@internal 添加视图对象，并设置此视图对象的<code>name</code> 属性。
	*@param view 需要添加的视图对象。
	*/
	__proto.addItem=function(view){
		view.name="item"+this._items.length;
		this.addChild(view);
		this.initItems();
	}

	/**
	*初始化视图对象集合。
	*/
	__proto.initItems=function(){
		this._items=[];
		for (var i=0;i < 10000;i++){
			var item=this.getChildByName("item"+i);
			if (item==null){
				break ;
			}
			this._items.push(item);
			item.visible=(i==this._selectedIndex);
		}
	}

	/**
	*@private
	*通过对象的索引设置项对象的 <code>selected</code> 属性值。
	*@param index 需要设置的对象的索引。
	*@param selected 表示对象的选中状态。
	*/
	__proto.setSelect=function(index,selected){
		if (this._items && index >-1 && index < this._items.length){
			this._items[index].visible=selected;
		}
	}

	/**
	*@private
	*设置属性<code>selectedIndex</code>的值。
	*@param index 选中项索引值。
	*/
	__proto.setIndex=function(index){
		this.selectedIndex=index;
	}

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string')){
			this.selectedIndex=parseInt(value);
			}else {
			for (var prop in this._dataSource){
				if (this.hasOwnProperty(prop)){
					this[prop]=this._dataSource[prop];
				}
			}
		}
	});

	/**
	*表示当前视图索引。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this.setSelect(this._selectedIndex,false);
			this._selectedIndex=value;
			this.setSelect(this._selectedIndex,true);
		}
	});

	/**
	*获取或设置当前选择的项对象。
	*/
	__getset(0,__proto,'selection',function(){
		return this._selectedIndex >-1 && this._selectedIndex < this._items.length ? this._items[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._items.indexOf(value);
	});

	/**
	*视图集合数组。
	*/
	__getset(0,__proto,'items',function(){
		return this._items;
	});

	/**
	*索引设置处理器。
	*<p>默认回调参数：index:int</p>
	*/
	__getset(0,__proto,'setIndexHandler',function(){
		return this._setIndexHandler;
		},function(value){
		this._setIndexHandler=value;
	});

	return ViewStack;
})(Box)


/**
*
*使用 <code>VScrollBar</code> （垂直 <code>ScrollBar</code> ）控件，可以在因数据太多而不能在显示区域完全显示时控制显示的数据部分。
*
*@example <caption>以下示例代码，创建了一个 <code>VScrollBar</code> 实例。</caption>
*package
*{
	*import laya.ui.vScrollBar;
	*import laya.ui.VScrollBar;
	*import laya.utils.Handler;
	*public class VScrollBar_Example
	*{
		*private var vScrollBar:VScrollBar;
		*public function VScrollBar_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,onLoadComplete));
			*}
		*private function onLoadComplete():void
		*{
			*vScrollBar=new VScrollBar();//创建一个 vScrollBar 类的实例对象 hScrollBar 。
			*vScrollBar.skin="resource/ui/vscroll.png";//设置 vScrollBar 的皮肤。
			*vScrollBar.x=100;//设置 vScrollBar 对象的属性 x 的值，用于控制 vScrollBar 对象的显示位置。
			*vScrollBar.y=100;//设置 vScrollBar 对象的属性 y 的值，用于控制 vScrollBar 对象的显示位置。
			*vScrollBar.changeHandler=new Handler(this,onChange);//设置 vScrollBar 的滚动变化处理器。
			*Laya.stage.addChild(vScrollBar);//将此 vScrollBar 对象添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滚动条的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var vScrollBar;
*var res=["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*vScrollBar=new laya.ui.VScrollBar();//创建一个 vScrollBar 类的实例对象 hScrollBar 。
	*vScrollBar.skin="resource/ui/vscroll.png";//设置 vScrollBar 的皮肤。
	*vScrollBar.x=100;//设置 vScrollBar 对象的属性 x 的值，用于控制 vScrollBar 对象的显示位置。
	*vScrollBar.y=100;//设置 vScrollBar 对象的属性 y 的值，用于控制 vScrollBar 对象的显示位置。
	*vScrollBar.changeHandler=new laya.utils.Handler(this,onChange);//设置 vScrollBar 的滚动变化处理器。
	*Laya.stage.addChild(vScrollBar);//将此 vScrollBar 对象添加到显示列表。
	*}
*function onChange(value){
	*console.log("滚动条的位置： value="+value);
	*}
*@example
*import VScrollBar=laya.ui.VScrollBar;
*import Handler=laya.utils.Handler;
*class VScrollBar_Example {
	*private vScrollBar:VScrollBar;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,this.onLoadComplete));
		*}
	*private onLoadComplete():void {
		*this.vScrollBar=new VScrollBar();//创建一个 vScrollBar 类的实例对象 hScrollBar 。
		*this.vScrollBar.skin="resource/ui/vscroll.png";//设置 vScrollBar 的皮肤。
		*this.vScrollBar.x=100;//设置 vScrollBar 对象的属性 x 的值，用于控制 vScrollBar 对象的显示位置。
		*this.vScrollBar.y=100;//设置 vScrollBar 对象的属性 y 的值，用于控制 vScrollBar 对象的显示位置。
		*this.vScrollBar.changeHandler=new Handler(this,this.onChange);//设置 vScrollBar 的滚动变化处理器。
		*Laya.stage.addChild(this.vScrollBar);//将此 vScrollBar 对象添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滚动条的位置： value="+value);
		*}
	*}
*/
//class laya.ui.VScrollBar extends laya.ui.ScrollBar
var VScrollBar=(function(_super){
	function VScrollBar(){
		VScrollBar.__super.call(this);;
	}

	__class(VScrollBar,'laya.ui.VScrollBar',_super);
	return VScrollBar;
})(ScrollBar)


/**
*<code>TextInput</code> 类用于创建显示对象以显示和输入文本。
*
*@example <caption>以下示例代码，创建了一个 <code>TextInput</code> 实例。</caption>
*package
*{
	*import laya.display.Stage;
	*import laya.ui.TextInput;
	*import laya.utils.Handler;
	*public class TextInput_Example
	*{
		*public function TextInput_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*var textInput:TextInput=new TextInput("这是一个TextInput实例。");//创建一个 TextInput 类的实例对象 textInput 。
			*textInput.skin="resource/ui/input.png";//设置 textInput 的皮肤。
			*textInput.sizeGrid="4,4,4,4";//设置 textInput 的网格信息。
			*textInput.color="#008fff";//设置 textInput 的文本颜色。
			*textInput.font="Arial";//设置 textInput 的文本字体。
			*textInput.bold=true;//设置 textInput 的文本显示为粗体。
			*textInput.fontSize=30;//设置 textInput 的字体大小。
			*textInput.wordWrap=true;//设置 textInput 的文本自动换行。
			*textInput.x=100;//设置 textInput 对象的属性 x 的值，用于控制 textInput 对象的显示位置。
			*textInput.y=100;//设置 textInput 对象的属性 y 的值，用于控制 textInput 对象的显示位置。
			*textInput.width=300;//设置 textInput 的宽度。
			*textInput.height=200;//设置 textInput 的高度。
			*Laya.stage.addChild(textInput);//将 textInput 添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load(["resource/ui/input.png"],laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*var textInput=new laya.ui.TextInput("这是一个TextInput实例。");//创建一个 TextInput 类的实例对象 textInput 。
	*textInput.skin="resource/ui/input.png";//设置 textInput 的皮肤。
	*textInput.sizeGrid="4,4,4,4";//设置 textInput 的网格信息。
	*textInput.color="#008fff";//设置 textInput 的文本颜色。
	*textInput.font="Arial";//设置 textInput 的文本字体。
	*textInput.bold=true;//设置 textInput 的文本显示为粗体。
	*textInput.fontSize=30;//设置 textInput 的字体大小。
	*textInput.wordWrap=true;//设置 textInput 的文本自动换行。
	*textInput.x=100;//设置 textInput 对象的属性 x 的值，用于控制 textInput 对象的显示位置。
	*textInput.y=100;//设置 textInput 对象的属性 y 的值，用于控制 textInput 对象的显示位置。
	*textInput.width=300;//设置 textInput 的宽度。
	*textInput.height=200;//设置 textInput 的高度。
	*Laya.stage.addChild(textInput);//将 textInput 添加到显示列表。
	*}
*@example
*import Stage=laya.display.Stage;
*import TextInput=laya.ui.TextInput;
*import Handler=laya.utils.Handler;
*class TextInput_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*var textInput:TextInput=new TextInput("这是一个TextInput实例。");//创建一个 TextInput 类的实例对象 textInput 。
		*textInput.skin="resource/ui/input.png";//设置 textInput 的皮肤。
		*textInput.sizeGrid="4,4,4,4";//设置 textInput 的网格信息。
		*textInput.color="#008fff";//设置 textInput 的文本颜色。
		*textInput.font="Arial";//设置 textInput 的文本字体。
		*textInput.bold=true;//设置 textInput 的文本显示为粗体。
		*textInput.fontSize=30;//设置 textInput 的字体大小。
		*textInput.wordWrap=true;//设置 textInput 的文本自动换行。
		*textInput.x=100;//设置 textInput 对象的属性 x 的值，用于控制 textInput 对象的显示位置。
		*textInput.y=100;//设置 textInput 对象的属性 y 的值，用于控制 textInput 对象的显示位置。
		*textInput.width=300;//设置 textInput 的宽度。
		*textInput.height=200;//设置 textInput 的高度。
		*Laya.stage.addChild(textInput);//将 textInput 添加到显示列表。
		*}
	*}
*/
//class laya.ui.TextInput extends laya.ui.Label
var TextInput=(function(_super){
	function TextInput(text){
		/**@private */
		this._bg=null;
		/**@private */
		this._skin=null;
		TextInput.__super.call(this);
		(text===void 0)&& (text="");
		this.text=text;
		this.skin=this.skin;
	}

	__class(TextInput,'laya.ui.TextInput',_super);
	var __proto=TextInput.prototype;
	/**@inheritDoc */
	__proto.preinitialize=function(){
		this.mouseEnabled=true;
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bg && this._bg.destroy();
		this._bg=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._tf=new Input());
		this._tf.padding=Styles.inputLabelPadding;
		this._tf.on(/*laya.events.Event.INPUT*/"input",this,this._onInput);
		this._tf.on(/*laya.events.Event.ENTER*/"enter",this,this._onEnter);
		this._tf.on(/*laya.events.Event.BLUR*/"blur",this,this._onBlur);
		this._tf.on(/*laya.events.Event.FOCUS*/"focus",this,this._onFocus);
	}

	/**
	*@private
	*/
	__proto._onFocus=function(){
		this.event(/*laya.events.Event.FOCUS*/"focus",this);
	}

	/**
	*@private
	*/
	__proto._onBlur=function(){
		this.event(/*laya.events.Event.BLUR*/"blur",this);
	}

	/**
	*@private
	*/
	__proto._onInput=function(){
		this.event(/*laya.events.Event.INPUT*/"input",this);
	}

	/**
	*@private
	*/
	__proto._onEnter=function(){
		this.event(/*laya.events.Event.ENTER*/"enter",this);
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this.width=128;
		this.height=22;
	}

	/**选中输入框内的文本。*/
	__proto.select=function(){
		(this._tf).select();
	}

	__proto.setSelection=function(startIndex,endIndex){
		(this._tf).setSelection(startIndex,endIndex);
	}

	/**
	*当前文本内容字符串。
	*@see laya.display.Text.text
	*/
	__getset(0,__proto,'text',_super.prototype._$get_text,function(value){
		if (this._tf.text !=value){
			value=value+"";
			this._tf.text=value;
			this.event(/*laya.events.Event.CHANGE*/"change");
		}
	});

	/**
	*表示此对象包含的文本背景 <code>AutoBitmap</code> 组件实例。
	*/
	__getset(0,__proto,'bg',function(){
		return this._bg;
		},function(value){
		this.graphics=this._bg=value;
	});

	/**
	*设置原生input输入框的y坐标偏移。
	*/
	__getset(0,__proto,'inputElementYAdjuster',function(){
		return (this._tf).inputElementYAdjuster;
		},function(value){
		(this._tf).inputElementYAdjuster=value;
	});

	/**
	*<p>指示当前是否是文本域。</p>
	*值为true表示当前是文本域，否则不是文本域。
	*/
	__getset(0,__proto,'multiline',function(){
		return (this._tf).multiline;
		},function(value){
		(this._tf).multiline=value;
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			this._bg || (this.graphics=this._bg=new AutoBitmap());
			this._bg.source=Loader.getRes(this._skin);
			this._width && (this._bg.width=this._width);
			this._height && (this._bg.height=this._height);
		}
	});

	/**
	*<p>当前实例的背景图（ <code>AutoBitmap</code> ）实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._bg && this._bg.sizeGrid ? this._bg.sizeGrid.join(","):null;
		},function(value){
		this._bg || (this.graphics=this._bg=new AutoBitmap());
		this._bg.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
	});

	/**
	*设置原生input输入框的x坐标偏移。
	*/
	__getset(0,__proto,'inputElementXAdjuster',function(){
		return (this._tf).inputElementXAdjuster;
		},function(value){
		(this._tf).inputElementXAdjuster=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Label,this,'width',value);
		this._bg && (this._bg.width=value);
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Label,this,'height',value);
		this._bg && (this._bg.height=value);
	});

	/**
	*设置可编辑状态。
	*/
	__getset(0,__proto,'editable',function(){
		return (this._tf).editable;
		},function(value){
		(this._tf).editable=value;
	});

	/**限制输入的字符。*/
	__getset(0,__proto,'restrict',function(){
		return (this._tf).restrict;
		},function(pattern){
		(this._tf).restrict=pattern;
	});

	/**
	*@copy laya.display.Input#prompt
	*/
	__getset(0,__proto,'prompt',function(){
		return (this._tf).prompt;
		},function(value){
		(this._tf).prompt=value;
	});

	/**
	*@copy laya.display.Input#promptColor
	*/
	__getset(0,__proto,'promptColor',function(){
		return (this._tf).promptColor;
		},function(value){
		(this._tf).promptColor=value;
	});

	/**
	*@copy laya.display.Input#maxChars
	*/
	__getset(0,__proto,'maxChars',function(){
		return (this._tf).maxChars;
		},function(value){
		(this._tf).maxChars=value;
	});

	/**
	*@copy laya.display.Input#focus
	*/
	__getset(0,__proto,'focus',function(){
		return (this._tf).focus;
		},function(value){
		(this._tf).focus=value;
	});

	/**
	*@copy laya.display.Input#type
	*/
	__getset(0,__proto,'type',function(){
		return (this._tf).type;
		},function(value){
		(this._tf).type=value;
	});

	/**
	*@copy laya.display.Input#asPassword
	*/
	__getset(0,__proto,'asPassword',function(){
		return (this._tf).asPassword;
		},function(value){
		(this._tf).asPassword=value;
	});

	return TextInput;
})(Label)


/**
*使用 <code>VSlider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
*<p> <code>VSlider</code> 控件采用垂直方向。滑块轨道从下往上扩展，而标签位于轨道的左右两侧。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>VSlider</code> 实例。</caption>
*package
*{
	*import laya.ui.HSlider;
	*import laya.ui.VSlider;
	*import laya.utils.Handler;
	*public class VSlider_Example
	*{
		*private var vSlider:VSlider;
		*public function VSlider_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vslider.png","resource/ui/vslider$bar.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*vSlider=new VSlider();//创建一个 VSlider 类的实例对象 vSlider 。
			*vSlider.skin="resource/ui/vslider.png";//设置 vSlider 的皮肤。
			*vSlider.min=0;//设置 vSlider 最低位置值。
			*vSlider.max=10;//设置 vSlider 最高位置值。
			*vSlider.value=2;//设置 vSlider 当前位置值。
			*vSlider.tick=1;//设置 vSlider 刻度值。
			*vSlider.x=100;//设置 vSlider 对象的属性 x 的值，用于控制 vSlider 对象的显示位置。
			*vSlider.y=100;//设置 vSlider 对象的属性 y 的值，用于控制 vSlider 对象的显示位置。
			*vSlider.changeHandler=new Handler(this,onChange);//设置 vSlider 位置变化处理器。
			*Laya.stage.addChild(vSlider);//把 vSlider 添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滑块的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var vSlider;
*Laya.loader.load(["resource/ui/vslider.png","resource/ui/vslider$bar.png"],laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*vSlider=new laya.ui.VSlider();//创建一个 VSlider 类的实例对象 vSlider 。
	*vSlider.skin="resource/ui/vslider.png";//设置 vSlider 的皮肤。
	*vSlider.min=0;//设置 vSlider 最低位置值。
	*vSlider.max=10;//设置 vSlider 最高位置值。
	*vSlider.value=2;//设置 vSlider 当前位置值。
	*vSlider.tick=1;//设置 vSlider 刻度值。
	*vSlider.x=100;//设置 vSlider 对象的属性 x 的值，用于控制 vSlider 对象的显示位置。
	*vSlider.y=100;//设置 vSlider 对象的属性 y 的值，用于控制 vSlider 对象的显示位置。
	*vSlider.changeHandler=new laya.utils.Handler(this,onChange);//设置 vSlider 位置变化处理器。
	*Laya.stage.addChild(vSlider);//把 vSlider 添加到显示列表。
	*}
*function onChange(value){
	*console.log("滑块的位置： value="+value);
	*}
*@example
*import HSlider=laya.ui.HSlider;
*import VSlider=laya.ui.VSlider;
*import Handler=laya.utils.Handler;
*class VSlider_Example {
	*private vSlider:VSlider;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vslider.png","resource/ui/vslider$bar.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.vSlider=new VSlider();//创建一个 VSlider 类的实例对象 vSlider 。
		*this.vSlider.skin="resource/ui/vslider.png";//设置 vSlider 的皮肤。
		*this.vSlider.min=0;//设置 vSlider 最低位置值。
		*this.vSlider.max=10;//设置 vSlider 最高位置值。
		*this.vSlider.value=2;//设置 vSlider 当前位置值。
		*this.vSlider.tick=1;//设置 vSlider 刻度值。
		*this.vSlider.x=100;//设置 vSlider 对象的属性 x 的值，用于控制 vSlider 对象的显示位置。
		*this.vSlider.y=100;//设置 vSlider 对象的属性 y 的值，用于控制 vSlider 对象的显示位置。
		*this.vSlider.changeHandler=new Handler(this,this.onChange);//设置 vSlider 位置变化处理器。
		*Laya.stage.addChild(this.vSlider);//把 vSlider 添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滑块的位置： value="+value);
		*}
	*}
*@see laya.ui.Slider
*/
//class laya.ui.VSlider extends laya.ui.Slider
var VSlider=(function(_super){
	function VSlider(){
		VSlider.__super.call(this);;
	}

	__class(VSlider,'laya.ui.VSlider',_super);
	return VSlider;
})(Slider)


/**
*<code>Dialog</code> 组件是一个弹出对话框，实现对话框弹出，拖动，模式窗口功能。
*可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭等
*通过设置zOrder属性，可以更改弹出的层次
*通过设置popupEffect和closeEffect可以设置弹出效果和关闭效果，如果不想有任何弹出关闭效果，可以设置前述属性为空
*
*@example <caption>以下示例代码，创建了一个 <code>Dialog</code> 实例。</caption>
*package
*{
	*import laya.ui.Dialog;
	*import laya.utils.Handler;
	*public class Dialog_Example
	*{
		*private var dialog:Dialog_Instance;
		*public function Dialog_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/btn_close.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*dialog=new Dialog_Instance();//创建一个 Dialog_Instance 类的实例对象 dialog。
			*dialog.dragArea="0,0,150,50";//设置 dialog 的拖拽区域。
			*dialog.show();//显示 dialog。
			*dialog.closeHandler=new Handler(this,onClose);//设置 dialog 的关闭函数处理器。
			*}
		*private function onClose(name:String):void
		*{
			*if (name==Dialog.CLOSE)
			*{
				*trace("通过点击 name 为"+name+"的组件，关闭了dialog。");
				*}
			*}
		*}
	*}
*import laya.ui.Button;
*import laya.ui.Dialog;
*import laya.ui.Image;
*class Dialog_Instance extends Dialog
*{
	*function Dialog_Instance():void
	*{
		*var bg:Image=new Image("resource/ui/bg.png");
		*bg.sizeGrid="40,10,5,10";
		*bg.width=150;
		*bg.height=250;
		*addChild(bg);
		*var image:Image=new Image("resource/ui/image.png");
		*addChild(image);
		*var button:Button=new Button("resource/ui/btn_close.png");
		*button.name=Dialog.CLOSE;//设置button的name属性值。
		*button.x=0;
		*button.y=0;
		*addChild(button);
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var dialog;
*Laya.loader.load("resource/ui/btn_close.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*(function (_super){//新建一个类Dialog_Instance继承自laya.ui.Dialog。
	*function Dialog_Instance(){
		*Dialog_Instance.__super.call(this);//初始化父类
		*var bg=new laya.ui.Image("resource/ui/bg.png");//新建一个 Image 类的实例 bg 。
		*bg.sizeGrid="10,40,10,5";//设置 bg 的网格信息。
		*bg.width=150;//设置 bg 的宽度。
		*bg.height=250;//设置 bg 的高度。
		*this.addChild(bg);//将 bg 添加到显示列表。
		*var image=new laya.ui.Image("resource/ui/image.png");//新建一个 Image 类的实例 image 。
		*this.addChild(image);//将 image 添加到显示列表。
		*var button=new laya.ui.Button("resource/ui/btn_close.png");//新建一个 Button 类的实例 bg 。
		*button.name=laya.ui.Dialog.CLOSE;//设置 button 的 name 属性值。
		*button.x=0;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
		*button.y=0;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
		*this.addChild(button);//将 button 添加到显示列表。
		*};
	*Laya.class(Dialog_Instance,"mypackage.dialogExample.Dialog_Instance",_super);//注册类Dialog_Instance。
	*})(laya.ui.Dialog);
*function loadComplete(){
	*console.log("资源加载完成！");
	*dialog=new mypackage.dialogExample.Dialog_Instance();//创建一个 Dialog_Instance 类的实例对象 dialog。
	*dialog.dragArea="0,0,150,50";//设置 dialog 的拖拽区域。
	*dialog.show();//显示 dialog。
	*dialog.closeHandler=new laya.utils.Handler(this,onClose);//设置 dialog 的关闭函数处理器。
	*}
*function onClose(name){
	*if (name==laya.ui.Dialog.CLOSE){
		*console.log("通过点击 name 为"+name+"的组件，关闭了dialog。");
		*}
	*}
*@example
*import Dialog=laya.ui.Dialog;
*import Handler=laya.utils.Handler;
*class Dialog_Example {
	*private dialog:Dialog_Instance;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/btn_close.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.dialog=new Dialog_Instance();//创建一个 Dialog_Instance 类的实例对象 dialog。
		*this.dialog.dragArea="0,0,150,50";//设置 dialog 的拖拽区域。
		*this.dialog.show();//显示 dialog。
		*this.dialog.closeHandler=new Handler(this,this.onClose);//设置 dialog 的关闭函数处理器。
		*}
	*private onClose(name:string):void {
		*if (name==Dialog.CLOSE){
			*console.log("通过点击 name 为"+name+"的组件，关闭了dialog。");
			*}
		*}
	*}
*import Button=laya.ui.Button;
*class Dialog_Instance extends Dialog {
	*Dialog_Instance():void {
		*var bg:laya.ui.Image=new laya.ui.Image("resource/ui/bg.png");
		*bg.sizeGrid="40,10,5,10";
		*bg.width=150;
		*bg.height=250;
		*this.addChild(bg);
		*var image:laya.ui.Image=new laya.ui.Image("resource/ui/image.png");
		*this.addChild(image);
		*var button:Button=new Button("resource/ui/btn_close.png");
		*button.name=Dialog.CLOSE;//设置button的name属性值。
		*button.x=0;
		*button.y=0;
		*this.addChild(button);
		*}
	*}
*/
//class laya.ui.Dialog extends laya.ui.View
var Dialog=(function(_super){
	function Dialog(){
		/**
		*一个布尔值，指定对话框是否居中弹。
		*<p>如果值为true，则居中弹出，否则，则根据对象坐标显示，默认为true。</p>
		*/
		this.popupCenter=true;
		/**
		*对话框被关闭时会触发的回调函数处理器。
		*<p>回调函数参数为用户点击的按钮名字name:String。</p>
		*/
		this.closeHandler=null;
		/**
		*弹出对话框效果，可以设置一个效果代替默认的弹出效果，如果不想有任何效果，可以赋值为null
		*全局默认弹出效果可以通过manager.popupEffect修改
		*/
		this.popupEffect=null;
		/**
		*关闭对话框效果，可以设置一个效果代替默认的关闭效果，如果不想有任何效果，可以赋值为null
		*全局默认关闭效果可以通过manager.closeEffect修改
		*/
		this.closeEffect=null;
		/**组名称*/
		this.group=null;
		/**是否是模式窗口*/
		this.isModal=false;
		/**@private */
		this._dragArea=null;
		Dialog.__super.call(this);
	}

	__class(Dialog,'laya.ui.Dialog',_super);
	var __proto=Dialog.prototype;
	/**@inheritDoc */
	__proto.initialize=function(){
		this.popupEffect=Dialog.manager.popupEffectHandler;
		this.closeEffect=Dialog.manager.closeEffectHandler;
		this._dealDragArea();
		this.on(/*laya.events.Event.CLICK*/"click",this,this._onClick);
	}

	/**@private */
	__proto._dealDragArea=function(){
		var dragTarget=this.getChildByName("drag");
		if (dragTarget){
			this.dragArea=dragTarget.x+","+dragTarget.y+","+dragTarget.width+","+dragTarget.height;
			dragTarget.removeSelf();
		}
	}

	/**
	*@private (protected)
	*对象的 <code>Event.CLICK</code> 点击事件侦听处理函数。
	*/
	__proto._onClick=function(e){
		var btn=e.target;
		if (btn){
			switch (btn.name){
				case "close":
				case "cancel":
				case "sure":
				case "no":
				case "ok":
				case "yes":
					this.close(btn.name);
					break ;
				}
		}
	}

	/**
	*显示对话框（以非模式窗口方式显示）。
	*@param closeOther 是否关闭其它的对话框。若值为true则关闭其它对话框。
	*@param showEffect 是否显示弹出效果
	*/
	__proto.show=function(closeOther,showEffect){
		(closeOther===void 0)&& (closeOther=false);
		(showEffect===void 0)&& (showEffect=true);
		this._open(false,closeOther,showEffect);
	}

	/**
	*显示对话框（以模式窗口方式显示）。
	*@param closeOther 是否关闭其它的对话框。若值为true则关闭其它对话框。
	*@param showEffect 是否显示弹出效果
	*/
	__proto.popup=function(closeOther,showEffect){
		(closeOther===void 0)&& (closeOther=false);
		(showEffect===void 0)&& (showEffect=true);
		this._open(true,closeOther,showEffect);
	}

	/**@private */
	__proto._open=function(modal,closeOther,showEffect){
		Dialog.manager.lock(false);
		this.isModal=modal;
		Dialog.manager.open(this,closeOther,showEffect);
	}

	/**打开完成后，调用此方法（如果有弹出动画，则在动画完成后执行）*/
	__proto.onOpened=function(){}
	/**
	*关闭对话框。
	*@param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
	*@param showEffect 是否显示关闭效果
	*/
	__proto.close=function(type,showEffect){
		(showEffect===void 0)&& (showEffect=true);
		Dialog.manager.close(this,type,showEffect);
	}

	/**关闭完成后，调用此方法（如果有关闭动画，则在动画完成后执行）
	*@param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
	*/
	__proto.onClosed=function(type){}
	/**@private */
	__proto._onMouseDown=function(e){
		var point=this.getMousePoint();
		if (this._dragArea.contains(point.x,point.y))this.startDrag();
		else this.stopDrag();
	}

	/**
	*用来指定对话框的拖拽区域。默认值为"0,0,0,0"。
	*<p><b>格式：</b>构成一个矩形所需的 x,y,width,heith 值，用逗号连接为字符串。
	*例如："0,0,100,200"。
	*</p>
	*
	*@see #includeExamplesSummary 请参考示例
	*/
	__getset(0,__proto,'dragArea',function(){
		if (this._dragArea)return this._dragArea.toString();
		return null;
		},function(value){
		if (value){
			var a=UIUtils.fillArray([0,0,0,0],value,Number);
			this._dragArea=new Rectangle(a[0],a[1],a[2],a[3]);
			this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
			}else {
			this._dragArea=null;
			this.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
		}
	});

	/**
	*弹出框的显示状态；如果弹框处于显示中，则为true，否则为false;
	*/
	__getset(0,__proto,'isPopup',function(){
		return this.parent !=null;
	});

	__getset(0,__proto,'zOrder',_super.prototype._$get_zOrder,function(value){
		Laya.superSet(View,this,'zOrder',value);
		Dialog.manager._checkMask();
	});

	/**对话框管理容器，所有的对话框都在该容器内，并且受管理器管，可以自定义自己的管理器，来更改窗口管理的流程。
	*任意对话框打开和关闭，都会触发管理类的open和close事件*/
	__getset(1,Dialog,'manager',function(){
		return Dialog._manager=Dialog._manager|| new DialogManager();
		},function(value){
		Dialog._manager=value;
	});

	Dialog.setLockView=function(view){
		Dialog.manager.setLockView(view);
	}

	Dialog.lock=function(value){
		Dialog.manager.lock(value);
	}

	Dialog.closeAll=function(){
		Dialog.manager.closeAll();
	}

	Dialog.getDialogsByGroup=function(group){
		return Dialog.manager.getDialogsByGroup(group);
	}

	Dialog.closeByGroup=function(group){
		return Dialog.manager.closeByGroup(group);
	}

	Dialog.CLOSE="close";
	Dialog.CANCEL="cancel";
	Dialog.SURE="sure";
	Dialog.NO="no";
	Dialog.OK="ok";
	Dialog.YES="yes";
	Dialog._manager=null;
	return Dialog;
})(View)


/**
*<code>HBox</code> 是一个水平布局容器类。
*/
//class laya.ui.HBox extends laya.ui.LayoutBox
var HBox=(function(_super){
	function HBox(){
		HBox.__super.call(this);;
	}

	__class(HBox,'laya.ui.HBox',_super);
	var __proto=HBox.prototype;
	/**@inheritDoc */
	__proto.sortItem=function(items){
		if (items)items.sort(function(a,b){return a.x-b.x;});
	}

	/**@inheritDoc */
	__proto.changeItems=function(){
		this._itemChanged=false;
		var items=[];
		var maxHeight=0;
		for (var i=0,n=this.numChildren;i < n;i++){
			var item=this.getChildAt(i);
			if (item&&item.layoutEnabled){
				items.push(item);
				maxHeight=this._height?this._height:Math.max(maxHeight,item.height *item.scaleY);
			}
		}
		this.sortItem(items);
		var left=0;
		for (i=0,n=items.length;i < n;i++){
			item=items[i];
			item.x=left;
			left+=item.width *item.scaleX+this._space;
			if (this._align=="top"){
				item.y=0;
				}else if (this._align=="middle"){
				item.y=(maxHeight-item.height *item.scaleY)*0.5;
				}else if (this._align=="bottom"){
				item.y=maxHeight-item.height *item.scaleY;
			}
		}
		this.changeSize();
	}

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		if (this._height !=value){
			Laya.superSet(LayoutBox,this,'height',value);
			this.callLater(this.changeItems);
		}
	});

	HBox.NONE="none";
	HBox.TOP="top";
	HBox.MIDDLE="middle";
	HBox.BOTTOM="bottom";
	return HBox;
})(LayoutBox)


/**
*游戏中心插件
*@author xiaosong
*@date 2018-12-26
*/
//class laya.ui.MoreGame extends laya.ui.View
var MoreGame=(function(_super){
	var GameBox,GameItem;
	function MoreGame(type){
		/**是否停止缓动，默认晃动**/
		this.gameStopHD=false;
		/**icon动画**/
		this.iconImgTl=null;
		/**iconImage**/
		this._iconImage=null;
		/**更多游戏容器**/
		this._moreBox=null;
		/**游戏内盒子容器**/
		this._gameBox=null;
		/**屏幕方向,默认0 横屏，1竖屏**/
		this.screenType=0;
		/**更多游戏配置数据**/
		this._moreGameDataUrl="https://abc.layabox.com/public/more/gamelist2.json";
		/**图片尺寸设置信息**/
		this._iconImageObj=null;
		/**图标点击回调**/
		this.clickCallBack=null;
		/**关闭盒子回调**/
		this.closeCallBack=null;
		/**是否在显示中**/
		this.isShow=false;
		/**系统信息**/
		this.dinfo=null;
		/**统计数据地址**/
		this.ErrorUrlHttps="https://elastic.layabox.com/";
		/**统计类型**/
		this.tongjiType="bdm";
		(type===void 0)&& (type=0);
		MoreGame.__super.call(this);
		this.screenType=type;
		this.init();
	}

	__class(MoreGame,'laya.ui.MoreGame',_super);
	var __proto=MoreGame.prototype;
	/**
	*获取字符串时间戳，例如:2018-7-6
	*@param _timestamp
	*@return
	*
	*/
	__proto.getLocalDateString=function(_timestamp){
		(_timestamp===void 0)&& (_timestamp=0);
		var timeStr=this.getDateByTimestamp(_timestamp).toLocaleDateString();
		if(Browser.onLimixiu || Browser.onMiniGame){
			var date=new Date();
			timeStr=MoreGame.toLocaleDateString(date.getTime());
		};
		var reg=new RegExp("/","g");
		timeStr=timeStr.replace(reg,"-");
		return timeStr;
	}

	__proto.getDateByTimestamp=function(_timestamp){
		(_timestamp===void 0)&& (_timestamp=0);
		if (!_timestamp || _timestamp=="")return /*__JS__ */new Date();
		return /*__JS__ */new Date(_timestamp);
	}

	/**
	*发送统计信息
	*@param etype 统计数据类型
	*@param errorInfo 报错信息
	*@param pro 统计扩展数据
	*/
	__proto.reportError=function(etype,errorInfo,pro){
		(errorInfo===void 0)&& (errorInfo="");
		pro=pro || {};
		var now=/*__JS__ */Date.now();
		var date=new Date(now+0);
		pro.date=date.toLocaleString();
		pro.etype=etype;
		if (etype !="error"){
			if (etype !="statistics"){
				etype="statistics";
			}
		}
		pro.version="V0.0.1";
		pro.gameId=10100;
		pro.dinfo=this.dinfo;
		pro.channel=-1000;
		pro.msg=errorInfo;
		pro["@timestamp"]=/*__JS__ */date.toISOString();
		pro.user=this.getUserId();
		pro.openid=this.getOpenId();
		var rdate=MoreGame.getDay(date);
		pro.rdate=rdate;
		pro.day=date.getDate()+"";
		pro.hour=date.getHours()+"";
		pro.minute=date.getMinutes()+"";
		pro.gameurl=/*__JS__ */document.baseURI;
		pro.regTime=0;
		if (etype=="error"){
			this.sendLog(pro,this.tongjiType+"error-"+rdate.substring(0,6)+"/"+etype+"/",etype);
			}else{
			this.sendLog(pro,this.tongjiType+"-"+rdate.substring(0,6)+"/"+etype+"/",etype);
		}
	}

	/**获取用户userid**/
	__proto.getUserId=function(){
		var userid=parseInt(LocalStorage.getItem("layauserid")+"")||-1;
		if(userid==-1){
			userid=this.randRange(0,1000000000);
			LocalStorage.setItem("layauserid",userid+"");
		}
		return userid;
	}

	/**获取用户的openid**/
	__proto.getOpenId=function(){
		var str="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var openId=LocalStorage.getItem("openid");
		if(openId==null || openId==""){
			openId="";
			for(var i=0,sz=32;i<sz;i++){
				var random=this.randRange(0,62);
				openId+=str.charAt(random);
			}
			LocalStorage.setItem("openid",openId);
		}
		return openId;
	}

	__proto.sendLog=function(pro,path,btype){
		var _$this=this;
		var htt=new HttpRequest();
		htt.on(/*laya.events.Event.ERROR*/"error",this,function(p,bt,e){
			if (e && e.indexOf("[404]")!=-1){
				var htt1=new HttpRequest();
				htt1.send(_$this.ErrorUrlHttps+"garbage/"+bt+"/",JSON.stringify(p),"post","text",["Content-Type","application/json"]);
			}
		},[pro,btype]);
		if(Browser.onBDMiniGame){
			pro.gameurl="";
		}
		htt.send(this.ErrorUrlHttps+path,JSON.stringify(pro),"post","text",["Content-Type","application/json"]);
	}

	__proto.initEvent=function(){
		this.on(/*laya.events.Event.CLICK*/"click",this,this.onIconClick);
	}

	__proto.onStageResize=function(){
		var scale=Math.min(Laya.stage.width / Laya.stage.designWidth,Laya.stage.height / Laya.stage.designHeight);
		if(Laya.stage.width < 720)
			scale=0.9;
		if(this._moreBox){
			this._moreBox.scale(scale,scale);
		}
		if(this._gameBox){
			this._gameBox.scale(scale,scale);
		}
	}

	/**
	*晃动效果
	*@param target
	*@param tTime
	*@param sacleNum
	*@param lastSacleNum
	*@return
	*/
	__proto.tada=function(target,tTime,sacleNum,lastSacleNum){
		(sacleNum===void 0)&& (sacleNum=1.1);
		(lastSacleNum===void 0)&& (lastSacleNum=1);
		var tl=new TimeLine();
		tl.reset();
		tl.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:-3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:-3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:-3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:-3},tTime *0.1)
		.to(target,{scaleX:sacleNum,scaleY:sacleNum,rotation:3},tTime *0.1)
		.to(target,{scaleX:lastSacleNum,scaleY:lastSacleNum,rotation:0},tTime *0.1);
		tl.play(0);
		return tl;
	}

	/**销毁插件**/
	__proto.dispose=function(){
		this.removeEvent();
		this.gameStopHD=true;
		MoreGame._moreGameData=null;
		this._iconImageObj=null;
		this.clickCallBack=null;
		this.closeCallBack=null;
		if(this.iconImgTl){
			this.iconImgTl.offAll(/*laya.events.Event.COMPLETE*/"complete");
			this.iconImgTl=null;
		}
		if(this._moreBox){
			this._moreBox.removeChildren();
			this._moreBox=null;
		}
		if(this._gameBox){
			this._gameBox.removeChildren();
			this._gameBox=null;
		}
		if(this._iconImage){
			this._iconImage.removeSelf();
			this._iconImage=null;
		}
	}

	/**
	*设置icon的显示状态
	*@param type
	*/
	__proto.onSetIconType=function(type){
		this.gameStopHD=!type;
		this.visible=type;
	}

	/**检测晃动**/
	__proto.checkIconImgHD=function(){
		if(!this.iconImgTl)
			this.iconImgTl=this.tada(this._iconImage,1200,1.1,0.9);
		else
		this.iconImgTl.play(0);
		this.iconImgTl.on(/*laya.events.Event.COMPLETE*/"complete",this,this.onTlComplete);
	}

	__proto.onTlComplete=function(){
		if(this.parent){
			this._iconImage.scale(0.9,0.9);
			this._iconImage.rotation=0;
			if (this.gameStopHD && this.iconImgTl){
				this.iconImgTl.offAll(/*laya.events.Event.COMPLETE*/"complete");
				this.iconImgTl=null;
				return;
			}
			Laya.timer.once(1000,this,this.onYanChiPlay);
			}else{
			if(this.iconImgTl){
				this.iconImgTl.offAll();
				this.iconImgTl=null;
			}
		}
	}

	__proto.onYanChiPlay=function(){
		if(this.parent && this.iconImgTl){
			this.iconImgTl.play(0);
			}else{
			if(this.iconImgTl){
				this.iconImgTl.offAll(/*laya.events.Event.COMPLETE*/"complete");
				this.iconImgTl=null;
			}
		}
	}

	__proto.removeEvent=function(){
		this.off(/*laya.events.Event.CLICK*/"click",this,this.onIconClick);
	}

	__proto.onIconClick=function(){
		this.isShow=true;
		this.clickCallBack !=null && this.clickCallBack.run();
		var localCurrentTime=LocalStorage.getItem("currentTime");
		var currentTime=this.getLocalDateString();
		if(localCurrentTime !=currentTime){
			LocalStorage.setItem("currentTime",currentTime);
			this.reportError(MoreGame._moreGameData.statid1);
			}else{
			this.reportError(MoreGame._moreGameData.statid2);
		}
		this.onResLoaded();
	}

	__proto.onResLoaded=function(){
		if(!this._moreBox){
			this._moreBox=new Box();
			Laya.stage.addChild(this._moreBox);
			this._moreBox.zOrder=99999;
			this._moreBox.left=this._moreBox.right=this._moreBox.top=this._moreBox.bottom=0;
			var allBgImg=this.onCreateImage(MoreGame.onGetAtlasDanImgUrl("img_white_bg"),this._moreBox);
			allBgImg.top=allBgImg.left=allBgImg.right=allBgImg.bottom=0;
			allBgImg.sizeGrid="1,1,1,1,1";
			var hlineImg=this.onCreateImage(MoreGame.onGetAtlasDanImgUrl("hengfengexian"),this._moreBox);
			hlineImg.left=hlineImg.right=0;
			hlineImg.y=132;
			hlineImg.alpha=0.2;
			var jiantouImg=this.onCreateImage(MoreGame.onGetAtlasDanImgUrl("img_font_jingcai"),this._moreBox);
			jiantouImg.on(/*laya.events.Event.CLICK*/"click",this,this.onJiantouImgClick);
			if(this.isQMP()&& this.screenType){
				jiantouImg.pos(15,70);
				}else{
				jiantouImg.pos(15,45);
			};
			var gamelist=new List();
			this._moreBox.addChild(gamelist);
			gamelist.itemRender=GameBox;
			gamelist.selectEnable=true;
			gamelist.vScrollBarSkin="";
			gamelist.scrollBar.autoHide=true;
			gamelist.scrollBar.elasticDistance=250;
			gamelist.renderHandler=new Handler(this,this.onGameListRender);
			var tempGameListArr=MoreGame._moreGameData.marvellousGame.gameList;
			var gameListArr=[];
			gameListArr.push(tempGameListArr[0]);
			gameListArr.push(tempGameListArr[1]);
			var getRomdomArr=this.RandomNumBoth(gameListArr.length,tempGameListArr.length-gameListArr.length,tempGameListArr.length);
			if(!getRomdomArr){
				this.visible=false;
				return;
			}
			try{
				for(var i=0,sz=getRomdomArr.length;i<sz;i++){
					var index=getRomdomArr[i];
					gameListArr.push(tempGameListArr[index]);
				}
				MoreGame._moreGameData.marvellousGame.gameList=[];
				MoreGame._moreGameData.marvellousGame.gameList=gameListArr;
				gamelist.array=MoreGame._moreGameData.marvellousGame.gameList;
			}
			catch(error){
				gamelist.array=MoreGame._moreGameData.marvellousGame.gameList;
			}
			if(this.screenType){
				gamelist.spaceY=10;
				gamelist.width=690;
				if(this.isQMP()){
					gamelist.height=Laya.stage.height+130;
					}else{
					gamelist.height=1139;
				}
				gamelist.y=139;
				gamelist.centerX=0;
				}else{
			}
			this.onStageResize();
			}else{
			this._moreBox.visible=true;
		}
	}

	/**
	*取出随机数,maxNum为 取出随机数的个数
	*@param minNum 最小值 2
	*@param maxNum 最大数值 14
	*@param maxcount 最大范围 12
	*@return
	*/
	__proto.RandomNumBoth=function(minNum,maxNum,maxcount){
		var arr=[];
		for(var i=minNum;i<maxcount;i++){
			arr.push(i);
		};
		var numArr=[];
		var arrLength=arr.length;
		for(i=0;i<arrLength;i++){
			var Rand=arr.length;
			var number=Math.floor(Math.random()*arr.length);
			numArr.push(arr[number]);
			arr.splice(number,1);
			if(arr.length <=arrLength-maxNum){
				return numArr;
			}
		}
		return null;
	}

	/**
	*是否是全面屏 包括 安卓跟苹果
	*@return
	*/
	__proto.isQMP=function(){
		var isBoo=false;
		var tempBL=0;
		if(Laya.stage.screenMode==/*laya.display.Stage.SCREEN_HORIZONTAL*/"horizontal"){
			tempBL=Browser.height%9;
			}else{
			tempBL=Browser.width%9;
		}
		if(Browser.onAndroid && tempBL==0){
			var tempBL2=0;
			if(Laya.stage.screenMode==/*laya.display.Stage.SCREEN_HORIZONTAL*/"horizontal"){
				tempBL2=Browser.width;
				}else{
				tempBL2=Browser.height;
			}
			if([2280,2160,2244,3120,2248,2340,2310].indexOf(tempBL2)!=-1){
				isBoo=true;
			}
		};
		var onIPhoneX=/iPhone/gi.test(Browser.window.navigator.userAgent)&& (Math.min(Browser.clientHeight,Browser.clientWidth)==375 && Math.max(Browser.clientHeight,Browser.clientWidth)==812);
		var onIPhoneXR=(Math.min(Browser.clientHeight,Browser.clientWidth)==414 && Math.max(Browser.clientHeight,Browser.clientWidth)==896);
		if((((Browser.onMiniGame || Browser.onBDMiniGame)&& !Browser.onAndroid))&&(onIPhoneX || onIPhoneXR)){
			isBoo=true;
		}
		return isBoo;
	}

	/**
	*创建一个圆角矩形
	*@param width
	*@param height
	*@param circleNum
	*@return
	*/
	__proto.onDrawShapes=function(yuanWidth,yuanHeight,circleNum,isTeShu){
		(circleNum===void 0)&& (circleNum=5);
		(isTeShu===void 0)&& (isTeShu=false);
		var isTeShuCircleNum=circleNum;
		if(isTeShu)
			isTeShuCircleNum=0;
		var sprite=new Sprite();
		sprite.graphics.drawPath(0,0,[
		["moveTo",circleNum,0],
		["lineTo",105,0],
		["arcTo",yuanWidth,0,yuanWidth,circleNum,circleNum],
		["lineTo",yuanWidth,yuanHeight],
		["arcTo",yuanWidth,yuanHeight+circleNum,105,yuanHeight+circleNum,isTeShuCircleNum],
		["lineTo",circleNum,yuanHeight+circleNum],
		["arcTo",0,yuanHeight+circleNum,0,yuanHeight,isTeShuCircleNum],
		["lineTo",0,circleNum],
		["arcTo",0,0,circleNum,0,circleNum],
		["closePath"]],{
			fillStyle:"#ff0000"
		});
		return sprite;
	}

	/**
	*创建遮罩的对象
	*@param url
	*@param parent
	*@return
	*/
	__proto.onCreateMaskImg=function(url,parent){
		var kuangImg=this.onCreateImage(MoreGame.onGetAtlasDanImgUrl("dayuan"),parent);
		var iconImg=this.onCreateImage(url,kuangImg);
		iconImg.pos(11,10);
		var sprite=new Sprite();
		sprite.graphics.drawCircle(71,74,68,"#ff0000");
		iconImg.mask=sprite;
		kuangImg.scale(0.7,0.7);
		return kuangImg;
	}

	/**
	*渲染更多游戏列表
	*@param item
	*@param index
	*/
	__proto.onGameListRender=function(item,index){
		var gameList=MoreGame._moreGameData.marvellousGame.gameList;
		if(index < 0 || index > gameList.length-1)
			return;
		var gameObj=gameList[index];
		item.init(gameObj,this.screenType,new Handler(this,this.onItemClickCallBack));
	}

	/**
	*单元点击回调
	*@param itemData
	*/
	__proto.onItemClickCallBack=function(itemData){
		var _$this=this;
		if(!/*__JS__ */swan.navigateToMiniProgram)
			return;
		var appKey=itemData.appKey;
		var path=itemData.path;
		var extendInfo=itemData.extendInfo;
		/*__JS__ */swan.navigateToMiniProgram({
			appKey:appKey,
			path:path,
			extraData:extendInfo,
			success:function success (e){
			},
			fail:function fail (e){
			},
			complete:function complete (e){
				_$this.reportError(itemData.statid);
			}.bind(this)
		});
	}

	/**更多游戏返回按钮点击**/
	__proto.onJiantouImgClick=function(type){
		this.isShow=false;
		if(this._moreBox){
			this._moreBox.visible=false;
		}
		this.closeCallBack !=null && this.closeCallBack.run();
	}

	/**
	*创建文本
	*@param str
	*@param parent
	*@param width
	*@param height
	*@param size
	*@param color
	*@param wordwarp
	*@param align
	*@param leading
	*@return
	*/
	__proto.onCreateLabel=function(str,parent,size,color,wordwarp,align,leading){
		(size===void 0)&& (size=24);
		(color===void 0)&& (color="#000000");
		(wordwarp===void 0)&& (wordwarp=false);
		(align===void 0)&& (align="center");
		(leading===void 0)&& (leading=10);
		var label=new Label();
		label.text=str;
		label.font="Microsoft YaHei";
		label.fontSize=size;
		label.color=color;
		label.bold=true;
		label.leading=leading;
		label.valign="middle";
		label.align=align;
		label.wordWrap=wordwarp;
		parent.addChild(label);
		return label;
	}

	/**
	*创建图片
	*@param url
	*@param parent 图片的父容器
	*@return
	*/
	__proto.onCreateImage=function(url,parent){
		var image=new Image();
		image.skin=url;
		parent.addChild(image);
		return image;
	}

	/**初始化判断当前是否显示插件**/
	__proto.init=function(){
		var userAgent=Browser.window.navigator.userAgent;
		var onBDMiniGame=userAgent.indexOf('SwanGame')>-1;
		this.visible=false;
		if(onBDMiniGame){
			this.dinfo=JSON.stringify(/*__JS__ */laya.bd.mini.BMiniAdapter.systemInfo);
			this.onGetAdvsListData();
		}
	}

	/**
	*生成指定范围的随机数
	*@param minNum 最小值
	*@param maxNum 最大值
	*/
	__proto.randRange=function(minNum,maxNum){
		return (Math.floor(Math.random()*(maxNum-minNum+1))+minNum);
	}

	/**
	*获取广告列表数据信息
	*/
	__proto.onGetAdvsListData=function(){
		var _this=this;
		var random=this.randRange(10000,1000000);
		var url=this._moreGameDataUrl+"?"+random;
		MoreGame._http.open("get",url,true);
		MoreGame._http.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
		MoreGame._http.responseType="text";
		MoreGame._http.onerror=function (e){
			_this._onError(e);
		}
		MoreGame._http.onload=function (e){
			_this._onLoad(e);
		}
		MoreGame._http.send(null);
	}

	/**
	*@private
	*请求出错侦的听处理函数。
	*@param e 事件对象。
	*/
	__proto._onError=function(e){
		this.error("Request failed Status:"+MoreGame._http.status+" text:"+MoreGame._http.statusText);
	}

	/**
	*@private
	*请求消息返回的侦听处理函数。
	*@param e 事件对象。
	*/
	__proto._onLoad=function(e){
		var http=MoreGame._http;
		var status=http.status!==undefined ? http.status :200;
		if (status===200 || status===204 || status===0){
			this.complete();
			}else {
			this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
		}
	}

	/**
	*@private
	*请求错误的处理函数。
	*@param message 错误信息。
	*/
	__proto.error=function(message){
		this.event(/*laya.events.Event.ERROR*/"error",message);
	}

	/**
	*@private
	*请求成功完成的处理函数。
	*/
	__proto.complete=function(){
		var flag=true;
		try {
			var tempData=MoreGame._http.response || MoreGame._http.responseText;
			MoreGame._moreGameData=JSON.parse(tempData);
			this.initUI();
			}catch (e){
			flag=false;
			this.error(e.message);
		}
	}

	/**初始化UI显示**/
	__proto.initUI=function(){
		if(MoreGame._moreGameData.isOpen && this.screenType){
			if(!this._iconImage){
				this._iconImage=new Image();
				this.addChild(this._iconImage);
			}
			this._iconImage.skin=MoreGame.onGetImgSkinUrl(MoreGame._moreGameData.icon);
			if(this._iconImageObj){
				this._iconImage.size(this._iconImageObj.width,this._iconImageObj.height);
				this._iconImage.pivot(this._iconImageObj.width/2,this._iconImageObj.height/2);
				this._iconImage.pos(this._iconImageObj.width/2,this._iconImageObj.height/2);
			}
			this.visible=true;
			this.initEvent();
			this.gameStopHD=false;
			this.checkIconImgHD();
			}else{
			this.visible=false;
		}
	}

	/**
	*设置icon的宽高尺寸
	*@param width
	*@param height
	*/
	__proto.setIconSize=function(w,h){
		if(this._iconImage){
			this._iconImage.size(w,h);
			this._iconImage.pivot(w/2,h/2);
			this._iconImage.pos(w/2,h/2);
		}
		this._iconImageObj={width:w,height:h};
	}

	MoreGame.toLocaleDateString=function(dateNum){
		return MoreGame.getDateFormatStr(dateNum,"/");
	}

	MoreGame.getDateFormatStr=function(stamp,formatStr){
		(formatStr===void 0)&& (formatStr="yynndd");
		var date=new Date(stamp);
		var yy=date.getFullYear();
		var nn=date.getMonth()+1;
		var dd=date.getDate();
		var hh=date.getHours();
		var mm=date.getMinutes();
		var ss=date.getSeconds();
		switch(formatStr){
			case "yynndd":
				return yy.toString()+"年"+nn.toString()+"月"+dd.toString()+"日";
				break ;
			case "/":
				return yy.toString()+"/"+nn.toString()+"/"+dd.toString();
				break ;
			}
		return yy.toString()+"年"+nn.toString()+"月"+dd.toString()+"日"+hh.toString()+"时"+mm.toString()+"分"+ss.toString()+"秒";
	}

	MoreGame.getDay=function(sdate){
		var month=sdate.getMonth()+1;
		var day=sdate.getDate();
		var result=sdate.getFullYear()+""+(month < 10?"0"+month:month)+""+(day < 10?"0"+day:day);
		return result;
	}

	MoreGame.onGetAtlasDanImgUrl=function(url){
		return MoreGame._moreGameData.imgPath+MoreGame._moreGameData.atlas+url+".png";
	}

	MoreGame.onGetImgSkinUrl=function(resUrl){
		return MoreGame._moreGameData.imgPath+resUrl;
	}

	MoreGame.onGetIconImgSkinUrl=function(resUrl){
		return MoreGame._moreGameData.iconPath+resUrl;
	}

	MoreGame._moreGameData=null;
	__static(MoreGame,
	['_http',function(){return this._http=new Browser.window.XMLHttpRequest();}
	]);
	MoreGame.__init$=function(){
		/**
		*有渲染游戏单元
		*@author xiaosong
		*@date-2019-03-26
		*/
		//class GameBox extends laya.ui.Box
		GameBox=(function(_super){
			function GameBox(){
				/**游戏类型**/
				this.titleLabel=null;
				/**游戏列表容器**/
				this.gameListBox=null;
				GameBox.__super.call(this);
			}
			__class(GameBox,'',_super);
			var __proto=GameBox.prototype;
			/**
			*初始化列表数据
			*@param data
			*/
			__proto.init=function(data,screenType,callBack){
				if(!this.titleLabel){
					this.titleLabel=this.onCreateLabel(data.title,this,32,"#3d3939");
					this.titleLabel.pos(8,0);
					this.titleLabel.size(162,50);
					}else{
					this.titleLabel.text=data.title;
				}
				if(!this.gameListBox){
					this.gameListBox=new Box();
					this.addChild(this.gameListBox);
					var tempX=0;
					var tempY=65;
					var tempWidth=175;
					for(var i=0,sz=data.gameList.length;i<sz;i++){
						var gameitem=new GameItem();
						gameitem.init(data.gameList[i],screenType,callBack);
						gameitem.x=tempX+i *tempWidth;
						gameitem.y=tempY;
						this.gameListBox.addChild(gameitem);
					}
					}else{
					for(i=0,sz=this.gameListBox._childs.length;i<sz;i++){
						gameitem=this.gameListBox._childs[i];
						gameitem.init(data.gameList[i],screenType,callBack);
					}
				}
				this.size(695,340);
				this.cacheAs="bitmap";
			}
			/**
			*创建文本
			*@param str
			*@param parent
			*@param width
			*@param height
			*@param size
			*@param color
			*@param wordwarp
			*@return
			*/
			__proto.onCreateLabel=function(str,parent,size,color,bold){
				(size===void 0)&& (size=26);
				(color===void 0)&& (color="#000000");
				(bold===void 0)&& (bold=true);
				var label=new Label();
				label.text=str;
				label.font="Microsoft YaHei";
				label.fontSize=size;
				label.color=color;
				label.bold=bold;
				label.leading=10;
				label.valign="middle";
				label.align="center";
				label.overflow="hidden";
				parent.addChild(label);
				return label;
			}
			return GameBox;
		})(Box)
		/**
		*更多游戏单元
		*@author xiaosong
		*@date 2018-12-26
		*/
		//class GameItem extends laya.ui.Box
		GameItem=(function(_super){
			function GameItem(){
				/**icon框**/
				this.kuangImg=null;
				/**icon名字**/
				this.iconNameLabel=null;
				/**icon图标**/
				this.iconImg=null;
				/**玩一玩按钮**/
				this.playImg=null;
				/**渲染单元数据**/
				this.itemData=null;
				/**回调方法**/
				this.callBackHandler=null;
				GameItem.__super.call(this);
			}
			__class(GameItem,'',_super);
			var __proto=GameItem.prototype;
			__proto.MoveGameItem=function(){}
			/**注册事件监听**/
			__proto.initEvent=function(){
				this.on(/*laya.events.Event.CLICK*/"click",this,this.onItemClick);
			}
			__proto.onItemClick=function(){
				this.callBackHandler !=null && this.callBackHandler.runWith([this.itemData]);
			}
			/**
			*初始化单元数据
			*@param data
			*/
			__proto.init=function(data,screenType,callBack){
				this.itemData=data;
				this.callBackHandler=callBack;
				if(!this.kuangImg)
					this.kuangImg=this.onCreateImage(MoreGame.onGetAtlasDanImgUrl("dayuan"),this);
				else{
					this.kuangImg.skin=MoreGame.onGetAtlasDanImgUrl("dayuan");
				}
				if(!this.iconImg){
					this.iconImg=this.onCreateImage(MoreGame.onGetIconImgSkinUrl(data.icon),this);
					var sprite=new Sprite();
					sprite.graphics.drawCircle(71,74,68,"#ff0000");
					this.iconImg.mask=sprite;
					this.iconImg.pos(13,10);
					}else{
					this.iconImg.skin=MoreGame.onGetIconImgSkinUrl(data.icon);
				}
				if(!this.iconNameLabel){
					this.iconNameLabel=this.onCreateLabel(data.name,this,28,"#3d3939");
					this.iconNameLabel.pos(7,165);
					}else{
					this.iconNameLabel.text=data.name;
				}
				if(!this.playImg){
					this.playImg=this.onCreateImage(MoreGame.onGetAtlasDanImgUrl("img_play"),this);
					this.playImg.pos(12,210);
					}else{
					this.playImg.skin=MoreGame.onGetAtlasDanImgUrl("img_play");
				}
				this.size(165,270);
				this.initEvent();
			}
			/**
			*创建文本
			*@param str
			*@param parent
			*@param width
			*@param height
			*@param size
			*@param color
			*@param wordwarp
			*@return
			*/
			__proto.onCreateLabel=function(str,parent,size,color,bold){
				(size===void 0)&& (size=24);
				(color===void 0)&& (color="#000000");
				(bold===void 0)&& (bold=false);
				var label=new Label();
				label.text=str;
				label.font="Microsoft YaHei";
				label.fontSize=size;
				label.color=color;
				label.bold=bold;
				label.leading=10;
				label.valign="middle";
				label.align="center";
				label.size(152,44);
				label.overflow="hidden";
				parent.addChild(label);
				return label;
			}
			/**
			*创建图片
			*@param url
			*@param parent 图片的父容器
			*@return
			*/
			__proto.onCreateImage=function(url,parent){
				var image=new Image();
				image.skin=url;
				parent.addChild(image);
				return image;
			}
			return GameItem;
		})(Box)
	}

	return MoreGame;
})(View)


/**
*<code>VBox</code> 是一个垂直布局容器类。
*/
//class laya.ui.VBox extends laya.ui.LayoutBox
var VBox=(function(_super){
	function VBox(){
		VBox.__super.call(this);;
	}

	__class(VBox,'laya.ui.VBox',_super);
	var __proto=VBox.prototype;
	/**@inheritDoc */
	__proto.changeItems=function(){
		this._itemChanged=false;
		var items=[];
		var maxWidth=0;
		for (var i=0,n=this.numChildren;i < n;i++){
			var item=this.getChildAt(i);
			if (item&&item.layoutEnabled){
				items.push(item);
				maxWidth=this._width?this._width:Math.max(maxWidth,item.width *item.scaleX);
			}
		}
		this.sortItem(items);
		var top=0;
		for (i=0,n=items.length;i < n;i++){
			item=items[i];
			item.y=top;
			top+=item.height *item.scaleY+this._space;
			if (this._align=="left"){
				item.x=0;
				}else if (this._align=="center"){
				item.x=(maxWidth-item.width *item.scaleX)*0.5;
				}else if (this._align=="right"){
				item.x=maxWidth-item.width *item.scaleX;
			}
		}
		this.changeSize();
	}

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		if (this._width !=value){
			Laya.superSet(LayoutBox,this,'width',value);
			this.callLater(this.changeItems);
		}
	});

	VBox.NONE="none";
	VBox.LEFT="left";
	VBox.CENTER="center";
	VBox.RIGHT="right";
	return VBox;
})(LayoutBox)


/**
*<code>RadioGroup</code> 控件定义一组 <code>Radio</code> 控件，这些控件相互排斥；
*因此，用户每次只能选择一个 <code>Radio</code> 控件。
*
*@example <caption>以下示例代码，创建了一个 <code>RadioGroup</code> 实例。</caption>
*package
*{
	*import laya.ui.Radio;
	*import laya.ui.RadioGroup;
	*import laya.utils.Handler;
	*public class RadioGroup_Example
	*{
		*public function RadioGroup_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/radio.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*var radioGroup:RadioGroup=new RadioGroup();//创建一个 RadioGroup 类的实例对象 radioGroup 。
			*radioGroup.pos(100,100);//设置 radioGroup 的位置信息。
			*radioGroup.labels="item0,item1,item2";//设置 radioGroup 的标签集。
			*radioGroup.skin="resource/ui/radio.png";//设置 radioGroup 的皮肤。
			*radioGroup.space=10;//设置 radioGroup 的项间隔距离。
			*radioGroup.selectHandler=new Handler(this,onSelect);//设置 radioGroup 的选择项发生改变时执行的处理器。
			*Laya.stage.addChild(radioGroup);//将 radioGroup 添加到显示列表。
			*}
		*private function onSelect(index:int):void
		*{
			*trace("当前选择的单选按钮索引: index= ",index);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load(["resource/ui/radio.png"],laya.utils.Handler.create(this,onLoadComplete));
*function onLoadComplete(){
	*var radioGroup=new laya.ui.RadioGroup();//创建一个 RadioGroup 类的实例对象 radioGroup 。
	*radioGroup.pos(100,100);//设置 radioGroup 的位置信息。
	*radioGroup.labels="item0,item1,item2";//设置 radioGroup 的标签集。
	*radioGroup.skin="resource/ui/radio.png";//设置 radioGroup 的皮肤。
	*radioGroup.space=10;//设置 radioGroup 的项间隔距离。
	*radioGroup.selectHandler=new laya.utils.Handler(this,onSelect);//设置 radioGroup 的选择项发生改变时执行的处理器。
	*Laya.stage.addChild(radioGroup);//将 radioGroup 添加到显示列表。
	*}
*function onSelect(index){
	*console.log("当前选择的单选按钮索引: index= ",index);
	*}
*@example
*import Radio=laya.ui.Radio;
*import RadioGroup=laya.ui.RadioGroup;
*import Handler=laya.utils.Handler;
*class RadioGroup_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/radio.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*var radioGroup:RadioGroup=new RadioGroup();//创建一个 RadioGroup 类的实例对象 radioGroup 。
		*radioGroup.pos(100,100);//设置 radioGroup 的位置信息。
		*radioGroup.labels="item0,item1,item2";//设置 radioGroup 的标签集。
		*radioGroup.skin="resource/ui/radio.png";//设置 radioGroup 的皮肤。
		*radioGroup.space=10;//设置 radioGroup 的项间隔距离。
		*radioGroup.selectHandler=new Handler(this,this.onSelect);//设置 radioGroup 的选择项发生改变时执行的处理器。
		*Laya.stage.addChild(radioGroup);//将 radioGroup 添加到显示列表。
		*}
	*private onSelect(index:number):void {
		*console.log("当前选择的单选按钮索引: index= ",index);
		*}
	*}
*/
//class laya.ui.RadioGroup extends laya.ui.UIGroup
var RadioGroup=(function(_super){
	function RadioGroup(){
		RadioGroup.__super.call(this);;
	}

	__class(RadioGroup,'laya.ui.RadioGroup',_super);
	var __proto=RadioGroup.prototype;
	/**@inheritDoc */
	__proto.createItem=function(skin,label){
		return new Radio(skin,label);
	}

	return RadioGroup;
})(UIGroup)


/**
*<code>Tab</code> 组件用来定义选项卡按钮组。 *
*@internal <p>属性：<code>selectedIndex</code> 的默认值为-1。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>Tab</code> 实例。</caption>
*package
*{
	*import laya.ui.Tab;
	*import laya.utils.Handler;
	*public class Tab_Example
	*{
		*public function Tab_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/tab.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*var tab:Tab=new Tab();//创建一个 Tab 类的实例对象 tab 。
			*tab.skin="resource/ui/tab.png";//设置 tab 的皮肤。
			*tab.labels="item0,item1,item2";//设置 tab 的标签集。
			*tab.x=100;//设置 tab 对象的属性 x 的值，用于控制 tab 对象的显示位置。
			*tab.y=100;//设置 tab 对象的属性 y 的值，用于控制 tab 对象的显示位置。
			*tab.selectHandler=new Handler(this,onSelect);//设置 tab 的选择项发生改变时执行的处理器。
			*Laya.stage.addChild(tab);//将 tab 添到显示列表。
			*}
		*private function onSelect(index:int):void
		*{
			*trace("当前选择的表情页索引: index= ",index);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load(["resource/ui/tab.png"],laya.utils.Handler.create(this,onLoadComplete));
*function onLoadComplete(){
	*var tab=new laya.ui.Tab();//创建一个 Tab 类的实例对象 tab 。
	*tab.skin="resource/ui/tab.png";//设置 tab 的皮肤。
	*tab.labels="item0,item1,item2";//设置 tab 的标签集。
	*tab.x=100;//设置 tab 对象的属性 x 的值，用于控制 tab 对象的显示位置。
	*tab.y=100;//设置 tab 对象的属性 y 的值，用于控制 tab 对象的显示位置。
	*tab.selectHandler=new laya.utils.Handler(this,onSelect);//设置 tab 的选择项发生改变时执行的处理器。
	*Laya.stage.addChild(tab);//将 tab 添到显示列表。
	*}
*function onSelect(index){
	*console.log("当前选择的标签页索引: index= ",index);
	*}
*@example
*import Tab=laya.ui.Tab;
*import Handler=laya.utils.Handler;
*class Tab_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/tab.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*var tab:Tab=new Tab();//创建一个 Tab 类的实例对象 tab 。
		*tab.skin="resource/ui/tab.png";//设置 tab 的皮肤。
		*tab.labels="item0,item1,item2";//设置 tab 的标签集。
		*tab.x=100;//设置 tab 对象的属性 x 的值，用于控制 tab 对象的显示位置。
		*tab.y=100;//设置 tab 对象的属性 y 的值，用于控制 tab 对象的显示位置。
		*tab.selectHandler=new Handler(this,this.onSelect);//设置 tab 的选择项发生改变时执行的处理器。
		*Laya.stage.addChild(tab);//将 tab 添到显示列表。
		*}
	*private onSelect(index:number):void {
		*console.log("当前选择的表情页索引: index= ",index);
		*}
	*}
*/
//class laya.ui.Tab extends laya.ui.UIGroup
var Tab=(function(_super){
	function Tab(){
		Tab.__super.call(this);;
	}

	__class(Tab,'laya.ui.Tab',_super);
	var __proto=Tab.prototype;
	/**
	*@private
	*@inheritDoc
	*/
	__proto.createItem=function(skin,label){
		return new Button(skin,label);
	}

	return Tab;
})(UIGroup)


/**
*<code>TextArea</code> 类用于创建显示对象以显示和输入文本。
*@example <caption>以下示例代码，创建了一个 <code>TextArea</code> 实例。</caption>
*package
*{
	*import laya.ui.TextArea;
	*import laya.utils.Handler;
	*public class TextArea_Example
	*{
		*public function TextArea_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*var textArea:TextArea=new TextArea("这个一个TextArea实例。");//创建一个 TextArea 类的实例对象 textArea 。
			*textArea.skin="resource/ui/input.png";//设置 textArea 的皮肤。
			*textArea.sizeGrid="4,4,4,4";//设置 textArea 的网格信息。
			*textArea.color="#008fff";//设置 textArea 的文本颜色。
			*textArea.font="Arial";//设置 textArea 的字体。
			*textArea.bold=true;//设置 textArea 的文本显示为粗体。
			*textArea.fontSize=20;//设置 textArea 的文本字体大小。
			*textArea.wordWrap=true;//设置 textArea 的文本自动换行。
			*textArea.x=100;//设置 textArea 对象的属性 x 的值，用于控制 textArea 对象的显示位置。
			*textArea.y=100;//设置 textArea 对象的属性 y 的值，用于控制 textArea 对象的显示位置。
			*textArea.width=300;//设置 textArea 的宽度。
			*textArea.height=200;//设置 textArea 的高度。
			*Laya.stage.addChild(textArea);//将 textArea 添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load(["resource/ui/input.png"],laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*var textArea=new laya.ui.TextArea("这个一个TextArea实例。");//创建一个 TextArea 类的实例对象 textArea 。
	*textArea.skin="resource/ui/input.png";//设置 textArea 的皮肤。
	*textArea.sizeGrid="4,4,4,4";//设置 textArea 的网格信息。
	*textArea.color="#008fff";//设置 textArea 的文本颜色。
	*textArea.font="Arial";//设置 textArea 的字体。
	*textArea.bold=true;//设置 textArea 的文本显示为粗体。
	*textArea.fontSize=20;//设置 textArea 的文本字体大小。
	*textArea.wordWrap=true;//设置 textArea 的文本自动换行。
	*textArea.x=100;//设置 textArea 对象的属性 x 的值，用于控制 textArea 对象的显示位置。
	*textArea.y=100;//设置 textArea 对象的属性 y 的值，用于控制 textArea 对象的显示位置。
	*textArea.width=300;//设置 textArea 的宽度。
	*textArea.height=200;//设置 textArea 的高度。
	*Laya.stage.addChild(textArea);//将 textArea 添加到显示列表。
	*}
*@example
*import TextArea=laya.ui.TextArea;
*import Handler=laya.utils.Handler;
*class TextArea_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*var textArea:TextArea=new TextArea("这个一个TextArea实例。");//创建一个 TextArea 类的实例对象 textArea 。
		*textArea.skin="resource/ui/input.png";//设置 textArea 的皮肤。
		*textArea.sizeGrid="4,4,4,4";//设置 textArea 的网格信息。
		*textArea.color="#008fff";//设置 textArea 的文本颜色。
		*textArea.font="Arial";//设置 textArea 的字体。
		*textArea.bold=true;//设置 textArea 的文本显示为粗体。
		*textArea.fontSize=20;//设置 textArea 的文本字体大小。
		*textArea.wordWrap=true;//设置 textArea 的文本自动换行。
		*textArea.x=100;//设置 textArea 对象的属性 x 的值，用于控制 textArea 对象的显示位置。
		*textArea.y=100;//设置 textArea 对象的属性 y 的值，用于控制 textArea 对象的显示位置。
		*textArea.width=300;//设置 textArea 的宽度。
		*textArea.height=200;//设置 textArea 的高度。
		*Laya.stage.addChild(textArea);//将 textArea 添加到显示列表。
		*}
	*}
*/
//class laya.ui.TextArea extends laya.ui.TextInput
var TextArea=(function(_super){
	function TextArea(text){
		/**@private */
		this._vScrollBar=null;
		/**@private */
		this._hScrollBar=null;
		(text===void 0)&& (text="");
		TextArea.__super.call(this,text);
	}

	__class(TextArea,'laya.ui.TextArea',_super);
	var __proto=TextArea.prototype;
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._vScrollBar && this._vScrollBar.destroy();
		this._hScrollBar && this._hScrollBar.destroy();
		this._vScrollBar=null;
		this._hScrollBar=null;
	}

	__proto.initialize=function(){
		this.width=180;
		this.height=150;
		this._tf.wordWrap=true;
		this.multiline=true;
	}

	__proto.onVBarChanged=function(e){
		if (this._tf.scrollY !=this._vScrollBar.value){
			this._tf.scrollY=this._vScrollBar.value;
		}
	}

	__proto.onHBarChanged=function(e){
		if (this._tf.scrollX !=this._hScrollBar.value){
			this._tf.scrollX=this._hScrollBar.value;
		}
	}

	__proto.changeScroll=function(){
		var vShow=this._vScrollBar && this._tf.maxScrollY > 0;
		var hShow=this._hScrollBar && this._tf.maxScrollX > 0;
		var showWidth=vShow ? this._width-this._vScrollBar.width :this._width;
		var showHeight=hShow ? this._height-this._hScrollBar.height :this._height;
		var padding=this._tf.padding || Styles.labelPadding;
		this._tf.width=showWidth;
		this._tf.height=showHeight;
		if (this._vScrollBar){
			this._vScrollBar.x=this._width-this._vScrollBar.width-padding[2];
			this._vScrollBar.y=padding[1];
			this._vScrollBar.height=this._height-(hShow ? this._hScrollBar.height :0)-padding[1]-padding[3];
			this._vScrollBar.scrollSize=1;
			this._vScrollBar.thumbPercent=showHeight / Math.max(this._tf.textHeight,showHeight);
			this._vScrollBar.setScroll(1,this._tf.maxScrollY,this._tf.scrollY);
			this._vScrollBar.visible=vShow;
		}
		if (this._hScrollBar){
			this._hScrollBar.x=padding[0];
			this._hScrollBar.y=this._height-this._hScrollBar.height-padding[3];
			this._hScrollBar.width=this._width-(vShow ? this._vScrollBar.width :0)-padding[0]-padding[2];
			this._hScrollBar.scrollSize=Math.max(showWidth *0.033,1);
			this._hScrollBar.thumbPercent=showWidth / Math.max(this._tf.textWidth,showWidth);
			this._hScrollBar.setScroll(0,this.maxScrollX,this.scrollX);
			this._hScrollBar.visible=hShow;
		}
	}

	/**滚动到某个位置*/
	__proto.scrollTo=function(y){
		this.commitMeasure();
		this._tf.scrollY=y;
	}

	/**垂直滚动值*/
	__getset(0,__proto,'scrollY',function(){
		return this._tf.scrollY;
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(TextInput,this,'width',value);
		this.callLater(this.changeScroll);
	});

	/**水平滚动条实体*/
	__getset(0,__proto,'hScrollBar',function(){
		return this._hScrollBar;
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(TextInput,this,'height',value);
		this.callLater(this.changeScroll);
	});

	/**水平滚动最大值*/
	__getset(0,__proto,'maxScrollX',function(){
		return this._tf.maxScrollX;
	});

	/**垂直滚动条皮肤*/
	__getset(0,__proto,'vScrollBarSkin',function(){
		return this._vScrollBar ? this._vScrollBar.skin :null;
		},function(value){
		if (this._vScrollBar==null){
			this.addChild(this._vScrollBar=new VScrollBar());
			this._vScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onVBarChanged);
			this._vScrollBar.target=this._tf;
			this.callLater(this.changeScroll);
		}
		this._vScrollBar.skin=value;
	});

	/**水平滚动条皮肤*/
	__getset(0,__proto,'hScrollBarSkin',function(){
		return this._hScrollBar ? this._hScrollBar.skin :null;
		},function(value){
		if (this._hScrollBar==null){
			this.addChild(this._hScrollBar=new HScrollBar());
			this._hScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onHBarChanged);
			this._hScrollBar.mouseWheelEnable=false;
			this._hScrollBar.target=this._tf;
			this.callLater(this.changeScroll);
		}
		this._hScrollBar.skin=value;
	});

	/**垂直滚动条实体*/
	__getset(0,__proto,'vScrollBar',function(){
		return this._vScrollBar;
	});

	/**垂直滚动最大值*/
	__getset(0,__proto,'maxScrollY',function(){
		return this._tf.maxScrollY;
	});

	/**水平滚动值*/
	__getset(0,__proto,'scrollX',function(){
		return this._tf.scrollX;
	});

	return TextArea;
})(TextInput)


/**
*异步Dialog的生命周期:show或者popup > onCreate(如果没有创建过)> onOpen > onClose > onDestroy(如果销毁)
*onCreate在页面未创建时执行一次，再次打开页面不会再执行，适合写一些只执行一次的逻辑，比如资源加载，节点事件监听
*onOpen在页面每次打开都会执行，适合做一些每次都需要处理的事情，比如消息请求，根据数据初始化页面
*onClose在每次关闭的时候调用，适合关闭时停止动画，网络消息监听等逻辑
*onDestroy在页面被销毁的时候调用，适合置空引用对象
*/
//class laya.ui.AsynDialog extends laya.ui.Dialog
var AsynDialog=(function(_super){
	function AsynDialog(){
		/**@private */
		this._uiView=null;
		/**打开时是否关闭其他页面*/
		this.isCloseOther=false;
		AsynDialog.__super.call(this);
	}

	__class(AsynDialog,'laya.ui.AsynDialog',_super);
	var __proto=AsynDialog.prototype;
	/**@private */
	__proto.createView=function(uiView){
		this._uiView=uiView;
	}

	__proto._open=function(modal,closeOther,showEffect){
		this.isModal=modal;
		this.isCloseOther=closeOther;
		Dialog.manager.lock(true);
		if (this._uiView)this.onCreated();
		else this.onOpen();
	}

	/**
	*在页面未创建时执行一次，再次打开页面不会再执行，适合写一些只执行一次的逻辑，比如资源加载，节点事件监听
	*/
	__proto.onCreated=function(){
		this.createUI();
		this.onOpen();
	}

	/**根据节点数据创建UI*/
	__proto.createUI=function(){
		laya.ui.View.prototype.createView.call(this,this._uiView);
		this._uiView=null;
		this._dealDragArea();
	}

	/**
	*在页面每次打开都会执行，适合做一些每次都需要处理的事情，比如消息请求，根据数据初始化页面
	*/
	__proto.onOpen=function(){
		Dialog.manager.open(this,this.isCloseOther);
		Dialog.manager.lock(false);
	}

	__proto.close=function(type,showEffect){
		(showEffect===void 0)&& (showEffect=true);
		Dialog.manager.close(this);
		this.onClose();
	}

	/**
	*在每次关闭的时候调用，适合关闭时停止动画，网络消息监听等逻辑
	*/
	__proto.onClose=function(){}
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.View.prototype.destroy.call(this,destroyChild);
		this._uiView=null;
		this.onDestroy();
	}

	/**
	*在页面被销毁的时候调用，适合置空引用对象
	*/
	__proto.onDestroy=function(){}
	return AsynDialog;
})(Dialog)


	Laya.__init([View,MoreGame]);
})(window,document,Laya);

if (typeof define === 'function' && define.amd){
	define('laya.core', ['require', "exports"], function(require, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        for (var i in Laya) {
			var o = Laya[i];
            o && o.__isclass && (exports[i] = o);
        }
    });
}