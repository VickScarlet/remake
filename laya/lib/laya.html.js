
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Browser=laya.utils.Browser,CSSStyle=laya.display.css.CSSStyle,ClassUtils=laya.utils.ClassUtils;
	var Event=laya.events.Event,HTMLChar=laya.utils.HTMLChar,Loader=laya.net.Loader,Node=laya.display.Node,Rectangle=laya.maths.Rectangle;
	var Render=laya.renders.Render,RenderContext=laya.renders.RenderContext,RenderSprite=laya.renders.RenderSprite;
	var Sprite=laya.display.Sprite,Stat=laya.utils.Stat,Text=laya.display.Text,Texture=laya.resource.Texture;
	var URL=laya.net.URL,Utils=laya.utils.Utils;
/**
*@private
*/
//class laya.html.utils.HTMLParse
var HTMLParse=(function(){
	function HTMLParse(){}
	__class(HTMLParse,'laya.html.utils.HTMLParse');
	HTMLParse.parse=function(ower,xmlString,url){
		xmlString=xmlString.replace(/<br>/g,"<br/>");
		xmlString="<root>"+xmlString+"</root>";
		xmlString=xmlString.replace(HTMLParse.spacePattern,HTMLParse.char255);
		var xml=Utils.parseXMLFromString(xmlString);
		HTMLParse._parseXML(ower,xml.childNodes[0].childNodes,url);
	}

	HTMLParse._parseXML=function(parent,xml,url,href){
		var i=0,n=0;
		if (xml.join || xml.item){
			for (i=0,n=xml.length;i < n;++i){
				HTMLParse._parseXML(parent,xml[i],url,href);
			}
			}else {
			var node;
			var nodeName;
			if (xml.nodeType==3){
				var txt;
				if ((parent instanceof laya.html.dom.HTMLDivElement )){
					if (xml.nodeName==null){
						xml.nodeName="#text";
					}
					nodeName=xml.nodeName.toLowerCase();
					txt=xml.textContent.replace(/^\s+|\s+$/g,'');
					if (txt.length > 0){
						node=ClassUtils.getInstance(nodeName);
						if (node){
							parent.addChild(node);
							((node).innerTEXT=txt.replace(HTMLParse.char255AndOneSpacePattern," "));
						}
					}
					}else {
					txt=xml.textContent.replace(/^\s+|\s+$/g,'');
					if (txt.length > 0){
						((parent).innerTEXT=txt.replace(HTMLParse.char255AndOneSpacePattern," "));
					}
				}
				return;
				}else {
				nodeName=xml.nodeName.toLowerCase();
				if (nodeName=="#comment")return;
				node=ClassUtils.getInstance(nodeName);
				if (node){
					node=parent.addChild(node);
					(node).URI=url;
					(node).href=href;
					var attributes=xml.attributes;
					if (attributes && attributes.length > 0){
						for (i=0,n=attributes.length;i < n;++i){
							var attribute=attributes[i];
							var attrName=attribute.nodeName;
							var value=attribute.value;
							node._setAttributes(attrName,value);
						}
					}
					HTMLParse._parseXML(node,xml.childNodes,url,(node).href);
					}else {
					HTMLParse._parseXML(parent,xml.childNodes,url,href);
				}
			}
		}
	}

	HTMLParse.char255=String.fromCharCode(255);
	HTMLParse.spacePattern=/&nbsp;|&#160;/g;
	HTMLParse.char255AndOneSpacePattern=new RegExp(String.fromCharCode(255)+"|(\\s+)","g");
	return HTMLParse;
})()


/**
*@private
*HTML的布局类
*对HTML的显示对象进行排版
*/
//class laya.html.utils.Layout
var Layout=(function(){
	function Layout(){}
	__class(Layout,'laya.html.utils.Layout');
	Layout.later=function(element){
		if (Layout._will==null){
			Layout._will=[];
			Laya.stage.frameLoop(1,null,function(){
				if (Layout._will.length < 1)
					return;
				for (var i=0;i < Layout._will.length;i++){
					laya.html.utils.Layout.layout(Layout._will[i]);
				}
				Layout._will.length=0;
			});
		}
		Layout._will.push(element);
	}

	Layout.layout=function(element){
		if (!element || !element._style)return null;
		if ((element._style._type & /*laya.display.css.CSSStyle.ADDLAYOUTED*/0x200)===0)
			return null;
		element.getStyle()._type &=~ /*laya.display.css.CSSStyle.ADDLAYOUTED*/0x200;
		var arr=Layout._multiLineLayout(element);
		if (Render.isConchApp&&element["layaoutCallNative"]){
			(element).layaoutCallNative();
		}
		return arr;
	}

	Layout._multiLineLayout=function(element){
		if (Text.RightToLeft)return Layout._multiLineLayout2(element);
		var elements=new Array;
		element._addChildsToLayout(elements);
		var i=0,n=elements.length,j=0;
		var style=element._getCSSStyle();
		var letterSpacing=style.letterSpacing;
		var leading=style.leading;
		var lineHeight=style.lineHeight;
		var widthAuto=style._widthAuto()|| !style.wordWrap;
		var width=widthAuto ? 999999 :element.width;
		var height=element.height;
		var maxWidth=0;
		var exWidth=style.italic ? style.fontSize / 3 :0;
		var align=style._getAlign();
		var valign=style._getValign();
		var endAdjust=valign!==0 || align!==0 || lineHeight !=0;
		var oneLayout;
		var x=0;
		var y=0;
		var w=0;
		var h=0;
		var tBottom=0;
		var lines=new Array;
		var curStyle;
		var curPadding;
		var curLine=lines[0]=new LayoutLine();
		var newLine=false,nextNewline=false;
		var htmlWord;
		var sprite;
		curLine.h=0;
		if (style.italic)
			width-=style.fontSize / 3;
		var tWordWidth=0;
		var tLineFirstKey=true;
		function addLine (){
			curLine.y=y;
			y+=curLine.h+leading;
			if (curLine.h==0)y+=lineHeight;
			curLine.mWidth=tWordWidth;
			tWordWidth=0;
			curLine=new LayoutLine();
			lines.push(curLine);
			curLine.h=0;
			x=0;
			tLineFirstKey=true;
			newLine=false;
		}
		for (i=0;i < n;i++){
			oneLayout=elements[i];
			if (oneLayout==null){
				if (!tLineFirstKey){
					x+=Layout.DIV_ELEMENT_PADDING;
				}
				curLine.wordStartIndex=curLine.elements.length;
				continue ;
			}
			tLineFirstKey=false;
			if ((oneLayout instanceof laya.html.dom.HTMLBrElement )){
				addLine();
				curLine.y=y;
				continue ;
				}else if (oneLayout._isChar()){
				htmlWord=oneLayout;
				if (!htmlWord.isWord){
					if (lines.length > 0 && (x+w)> width && curLine.wordStartIndex > 0){
						var tLineWord=0;
						tLineWord=curLine.elements.length-curLine.wordStartIndex+1;
						curLine.elements.length=curLine.wordStartIndex;
						i-=tLineWord;
						addLine();
						continue ;
					}
					newLine=false;
					tWordWidth+=htmlWord.width;
					}else {
					newLine=nextNewline || (htmlWord.char==='\n');
					curLine.wordStartIndex=curLine.elements.length;
				}
				w=htmlWord.width+letterSpacing;
				h=htmlWord.height;
				nextNewline=false;
				newLine=newLine || ((x+w)> width);
				newLine && addLine();
				curLine.minTextHeight=Math.min(curLine.minTextHeight,oneLayout.height);
				}else {
				curStyle=oneLayout._getCSSStyle();
				sprite=oneLayout;
				curPadding=curStyle.padding;
				curStyle._getCssFloat()===0 || (endAdjust=true);
				newLine=nextNewline || curStyle.lineElement;
				w=sprite.width *sprite._style._tf.scaleX+curPadding[1]+curPadding[3]+letterSpacing;
				h=sprite.height *sprite._style._tf.scaleY+curPadding[0]+curPadding[2];
				nextNewline=curStyle.lineElement;
				newLine=newLine || ((x+w)> width && curStyle.wordWrap);
				newLine && addLine();
			}
			curLine.elements.push(oneLayout);
			curLine.h=Math.max(curLine.h,h);
			oneLayout.x=x;
			oneLayout.y=y;
			x+=w;
			curLine.w=x-letterSpacing;
			curLine.y=y;
			maxWidth=Math.max(x+exWidth,maxWidth);
		}
		y=curLine.y+curLine.h;
		if (endAdjust){
			var tY=0;
			var tWidth=width;
			if (widthAuto && element.width > 0){
				tWidth=element.width;
			}
			for (i=0,n=lines.length;i < n;i++){
				lines[i].updatePos(0,tWidth,i,tY,align,valign,lineHeight);
				tY+=Math.max(lineHeight,lines[i].h+leading);
			}
			y=tY;
		}
		widthAuto && (element.width=maxWidth);
		(y > element.height)&& (element.height=y);
		return [maxWidth,y];
	}

	Layout._multiLineLayout2=function(element){
		var elements=new Array;
		element._addChildsToLayout(elements);
		var i=0,n=elements.length,j=0;
		var style=element._getCSSStyle();
		var letterSpacing=style.letterSpacing;
		var leading=style.leading;
		var lineHeight=style.lineHeight;
		var widthAuto=style._widthAuto()|| !style.wordWrap;
		var width=widthAuto ? 999999 :element.width;
		var height=element.height;
		var maxWidth=0;
		var exWidth=style.italic ? style.fontSize / 3 :0;
		var align=2-style._getAlign();
		var valign=style._getValign();
		var endAdjust=valign!==0 || align!==0 || lineHeight !=0;
		var oneLayout;
		var x=0;
		var y=0;
		var w=0;
		var h=0;
		var tBottom=0;
		var lines=new Array;
		var curStyle;
		var curPadding;
		var curLine=lines[0]=new LayoutLine();
		var newLine=false,nextNewline=false;
		var htmlWord;
		var sprite;
		curLine.h=0;
		if (style.italic)
			width-=style.fontSize / 3;
		var tWordWidth=0;
		var tLineFirstKey=true;
		function addLine (){
			curLine.y=y;
			y+=curLine.h+leading;
			if (curLine.h==0)y+=lineHeight;
			curLine.mWidth=tWordWidth;
			tWordWidth=0;
			curLine=new LayoutLine();
			lines.push(curLine);
			curLine.h=0;
			x=0;
			tLineFirstKey=true;
			newLine=false;
		}
		for (i=0;i < n;i++){
			oneLayout=elements[i];
			if (oneLayout==null){
				if (!tLineFirstKey){
					x+=Layout.DIV_ELEMENT_PADDING;
				}
				curLine.wordStartIndex=curLine.elements.length;
				continue ;
			}
			tLineFirstKey=false;
			if ((oneLayout instanceof laya.html.dom.HTMLBrElement )){
				addLine();
				curLine.y=y;
				continue ;
				}else if (oneLayout._isChar()){
				htmlWord=oneLayout;
				if (!htmlWord.isWord){
					if (lines.length > 0 && (x+w)> width && curLine.wordStartIndex > 0){
						var tLineWord=0;
						tLineWord=curLine.elements.length-curLine.wordStartIndex+1;
						curLine.elements.length=curLine.wordStartIndex;
						i-=tLineWord;
						addLine();
						continue ;
					}
					newLine=false;
					tWordWidth+=htmlWord.width;
					}else {
					newLine=nextNewline || (htmlWord.char==='\n');
					curLine.wordStartIndex=curLine.elements.length;
				}
				w=htmlWord.width+letterSpacing;
				h=htmlWord.height;
				nextNewline=false;
				newLine=newLine || ((x+w)> width);
				newLine && addLine();
				curLine.minTextHeight=Math.min(curLine.minTextHeight,oneLayout.height);
				}else {
				curStyle=oneLayout._getCSSStyle();
				sprite=oneLayout;
				curPadding=curStyle.padding;
				curStyle._getCssFloat()===0 || (endAdjust=true);
				newLine=nextNewline || curStyle.lineElement;
				w=sprite.width *sprite._style._tf.scaleX+curPadding[1]+curPadding[3]+letterSpacing;
				h=sprite.height *sprite._style._tf.scaleY+curPadding[0]+curPadding[2];
				nextNewline=curStyle.lineElement;
				newLine=newLine || ((x+w)> width && curStyle.wordWrap);
				newLine && addLine();
			}
			curLine.elements.push(oneLayout);
			curLine.h=Math.max(curLine.h,h);
			oneLayout.x=x;
			oneLayout.y=y;
			x+=w;
			curLine.w=x-letterSpacing;
			curLine.y=y;
			maxWidth=Math.max(x+exWidth,maxWidth);
		}
		y=curLine.y+curLine.h;
		if (endAdjust){
			var tY=0;
			var tWidth=width;
			for (i=0,n=lines.length;i < n;i++){
				lines[i].updatePos(0,tWidth,i,tY,align,valign,lineHeight);
				tY+=Math.max(lineHeight,lines[i].h+leading);
			}
			y=tY;
		}
		widthAuto && (element.width=maxWidth);
		(y > element.height)&& (element.height=y);
		for (i=0,n=lines.length;i < n;i++){
			lines[i].revertOrder(width);
		}
		return [maxWidth,y];
	}

	Layout._will=null;
	Layout.DIV_ELEMENT_PADDING=0;
	return Layout;
})()


/**
*@private
*/
//class laya.html.utils.LayoutLine
var LayoutLine=(function(){
	function LayoutLine(){
		this.x=0;
		this.y=0;
		this.w=0;
		this.h=0;
		this.wordStartIndex=0;
		this.minTextHeight=99999;
		this.mWidth=0;
		this.elements=new Array;
	}

	__class(LayoutLine,'laya.html.utils.LayoutLine');
	var __proto=LayoutLine.prototype;
	/**
	*底对齐（默认）
	*@param left
	*@param width
	*@param dy
	*@param align 水平
	*@param valign 垂直
	*@param lineHeight 行高
	*/
	__proto.updatePos=function(left,width,lineNum,dy,align,valign,lineHeight){
		var w=0;
		var one
		if (this.elements.length > 0){
			one=this.elements[this.elements.length-1];
			w=one.x+one.width-this.elements[0].x;
		};
		var dx=0,ddy=NaN;
		align===/*laya.display.css.CSSStyle.ALIGN_CENTER*/1 && (dx=(width-w)/ 2);
		align===/*laya.display.css.CSSStyle.ALIGN_RIGHT*/2 && (dx=(width-w));
		lineHeight===0 || valign !=0 || (valign=1);
		for (var i=0,n=this.elements.length;i < n;i++){
			one=this.elements[i];
			var tCSSStyle=one._getCSSStyle();
			dx!==0 && (one.x+=dx);
			switch (tCSSStyle._getValign()){
				case 0:
					one.y=dy;
					break ;
				case /*laya.display.css.CSSStyle.VALIGN_MIDDLE*/1:;
					var tMinTextHeight=0;
					if (this.minTextHeight !=99999){
						tMinTextHeight=this.minTextHeight;
					};
					var tBottomLineY=(tMinTextHeight+lineHeight)/ 2;
					tBottomLineY=Math.max(tBottomLineY,this.h);
					if ((one instanceof laya.html.dom.HTMLImageElement )){
						ddy=dy+tBottomLineY-one.height;
						}else {
						ddy=dy+tBottomLineY-one.height;
					}
					one.y=ddy;
					break ;
				case /*laya.display.css.CSSStyle.VALIGN_BOTTOM*/2:
					one.y=dy+(lineHeight-one.height);
					break ;
				}
		}
	}

	/**
	*布局反向,目前用于将ltr模式布局转为rtl模式布局
	*/
	__proto.revertOrder=function(width){
		var one
		if (this.elements.length > 0){
			var i=0,len=0;
			len=this.elements.length;
			for (i=0;i < len;i++){
				one=this.elements[i];
				one.x=width-one.x-one.width;
			}
		}
	}

	return LayoutLine;
})()


/**
*@private
*/
//class laya.html.dom.HTMLElement extends laya.display.Sprite
var HTMLElement=(function(_super){
	function HTMLElement(){
		this.URI=null;
		this._href=null;
		HTMLElement.__super.call(this);
		this._text=HTMLElement._EMPTYTEXT;
		this.setStyle(new CSSStyle(this));
		this._getCSSStyle().valign="middle";
		this.mouseEnabled=true;
	}

	__class(HTMLElement,'laya.html.dom.HTMLElement',_super);
	var __proto=HTMLElement.prototype;
	/**
	*@private
	*/
	__proto.layaoutCallNative=function(){
		var n=0;
		if (this._childs &&(n=this._childs.length)> 0){
			for (var i=0;i < n;i++){
				this._childs[i].layaoutCallNative && this._childs[i].layaoutCallNative();
			}
		};
		var word=this._getWords();
		word ? laya.html.dom.HTMLElement.fillWords(this,word,0,0,this.style.font,this.style.color,this.style.underLine,this.style.stroke,this.style.strokeColor):this.graphics.clear();
	}

	__proto.appendChild=function(c){
		return this.addChild(c);
	}

	/**
	*rtl模式的getWords函數
	*/
	__proto._getWords2=function(){
		var txt=this._text.text;
		if (!txt || txt.length===0)
			return null;
		var i=0,n=0;
		var realWords;
		var drawWords;
		if (!this._text.drawWords){
			realWords=txt.split(" ");
			n=realWords.length-1;
			drawWords=[];
			for (i=0;i < n;i++){
				drawWords.push(realWords[i]," ")
			}
			if(n>=0)
				drawWords.push(realWords[n]);
			this._text.drawWords=drawWords;
			}else{
			drawWords=this._text.drawWords;
		};
		var words=this._text.words;
		if (words && words.length===drawWords.length)
			return words;
		words===null && (this._text.words=words=[]);
		words.length=drawWords.length;
		var size;
		var style=this.style;
		var fontStr=style.font;
		for (i=0,n=drawWords.length;i < n;i++){
			size=Utils.measureText(drawWords[i],fontStr);
			var tHTMLChar=words[i]=new HTMLChar(drawWords[i],size.width,size.height || style.fontSize,style);
			if (tHTMLChar.char.length > 1){
				tHTMLChar.charNum=tHTMLChar.char;
			}
			if (this.href){
				var tSprite=new Sprite();
				this.addChild(tSprite);
				tHTMLChar.setSprite(tSprite);
			}
		}
		return words;
	}

	__proto._getWords=function(){
		if (!Text.CharacterCache)return this._getWords2();
		var txt=this._text.text;
		if (!txt || txt.length===0)
			return null;
		var words=this._text.words;
		if (words && words.length===txt.length)
			return words;
		words===null && (this._text.words=words=[]);
		words.length=txt.length;
		var size;
		var style=this.style;
		var fontStr=style.font;
		var startX=0;
		for (var i=0,n=txt.length;i < n;i++){
			size=Utils.measureText(txt.charAt(i),fontStr);
			var tHTMLChar=words[i]=new HTMLChar(txt.charAt(i),size.width,size.height||style.fontSize,style);
			if (this.href){
				var tSprite=new Sprite();
				this.addChild(tSprite);
				tHTMLChar.setSprite(tSprite);
			}
		}
		return words;
	}

	__proto.showLinkSprite=function(){
		var words=this._text.words;
		if (words){
			var tLinkSpriteList=[];
			var tSprite;
			var tHtmlChar;
			for (var i=0;i < words.length;i++){
				tHtmlChar=words[i];
				tSprite=new Sprite();
				tSprite.graphics.drawRect(0,0,tHtmlChar.width,tHtmlChar.height,"#ff0000");
				tSprite.width=tHtmlChar.width;
				tSprite.height=tHtmlChar.height;
				this.addChild(tSprite);
				tLinkSpriteList.push(tSprite);
			}
		}
	}

	__proto._layoutLater=function(){
		var style=this.style;
		if ((style._type & /*laya.display.css.CSSStyle.ADDLAYOUTED*/0x200))return;
		if (style.widthed(this)&& (this._childs.length>0 || this._getWords()!=null)&& style.block){
			Layout.later(this);
			style._type |=/*laya.display.css.CSSStyle.ADDLAYOUTED*/0x200;
		}
		else{
			this.parent && (this.parent)._layoutLater();
		}
	}

	__proto._setAttributes=function(name,value){
		switch (name){
			case 'style':
				this.style.cssText(value);
				return;
			case 'class':
				this.className=value;
				return;
			}
		_super.prototype._setAttributes.call(this,name,value);
	}

	__proto.updateHref=function(){
		if (this._href !=null){
			var words=this._getWords();
			if (words){
				var tHTMLChar;
				var tSprite;
				for (var i=0;i < words.length;i++){
					tHTMLChar=words[i];
					tSprite=tHTMLChar.getSprite();
					if (tSprite){
						tSprite.size(tHTMLChar.width,tHTMLChar.height);
						tSprite.on(/*laya.events.Event.CLICK*/"click",this,this.onLinkHandler);
					}
				}
			}
		}
	}

	__proto.onLinkHandler=function(e){
		switch(e.type){
			case /*laya.events.Event.CLICK*/"click":;
				var target=this;
				while (target){
					target.event(/*laya.events.Event.LINK*/"link",[this.href]);
					target=target.parent;
				}
				break ;
			}
	}

	__proto.formatURL=function(url){
		if (!this.URI)return url;
		return URL.formatURL(url,this.URI ? this.URI.path :null);
	}

	__getset(0,__proto,'href',function(){
		return this._href;
		},function(url){
		this._href=url;
		if (url !=null){
			this._getCSSStyle().underLine=1;
			this.updateHref();
		}
	});

	__getset(0,__proto,'color',null,function(value){
		this.style.color=value;
	});

	__getset(0,__proto,'onClick',null,function(value){
		var fn;
		Laya._runScript("fn=function(event){"+value+";}");
		this.on(/*laya.events.Event.CLICK*/"click",this,fn);
	});

	__getset(0,__proto,'id',null,function(value){
		HTMLDocument.document.setElementById(value,this);
	});

	__getset(0,__proto,'innerTEXT',function(){
		return this._text.text;
		},function(value){
		this.text=value;
	});

	__getset(0,__proto,'style',function(){
		return this._style;
	});

	__getset(0,__proto,'text',function(){
		return this._text.text;
		},function(value){
		if (this._text==HTMLElement._EMPTYTEXT){
			this._text={text:value,words:null};
		}
		else{
			this._text.text=value;
			this._text.words && (this._text.words.length=0);
		}
		Render.isConchApp && this.layaoutCallNative();
		this._renderType |=/*laya.renders.RenderSprite.CHILDS*/0x800;
		this.repaint();
		this.updateHref();
	});

	__getset(0,__proto,'parent',_super.prototype._$get_parent,function(value){
		if ((value instanceof laya.html.dom.HTMLElement )){
			var p=value;
			this.URI || (this.URI=p.URI);
			this.style.inherit(p.style);
		}
		Laya.superSet(Sprite,this,'parent',value);
	});

	__getset(0,__proto,'className',null,function(value){
		this.style.attrs(HTMLDocument.document.styleSheets['.'+value]);
	});

	HTMLElement.fillWords=function(ele,words,x,y,font,color,underLine,stroke,strokeColor){
		ele.graphics.clear();
		for (var i=0,n=words.length;i < n;i++){
			var a=words[i];
			if (stroke > 0){
				ele.graphics.fillBorderText(a.char,a.x+x,a.y+y,font,color,strokeColor,stroke,'left');
			}
			else {
				ele.graphics.fillText(a.char,a.x+x,a.y+y,font,color,'left',underLine);
			}
		}
	}

	HTMLElement._EMPTYTEXT={text:null,words:null};
	return HTMLElement;
})(Sprite)


/**
*@private
*/
//class laya.html.dom.HTMLBrElement extends laya.html.dom.HTMLElement
var HTMLBrElement=(function(_super){
	function HTMLBrElement(){
		HTMLBrElement.__super.call(this);
		this.style.lineElement=true;
		this.style.block=true;
	}

	__class(HTMLBrElement,'laya.html.dom.HTMLBrElement',_super);
	return HTMLBrElement;
})(HTMLElement)


/**
*DIV标签
*/
//class laya.html.dom.HTMLDivElement extends laya.html.dom.HTMLElement
var HTMLDivElement=(function(_super){
	function HTMLDivElement(){
		/**实际内容的高 */
		this.contextHeight=NaN;
		/**实际内容的宽 */
		this.contextWidth=NaN;
		HTMLDivElement.__super.call(this);
		this.style.block=true;
		this.style.lineElement=true;
		this.style.width=200;
		this.style.height=200;
		HTMLStyleElement;
	}

	__class(HTMLDivElement,'laya.html.dom.HTMLDivElement',_super);
	var __proto=HTMLDivElement.prototype;
	/**
	*追加内容，解析并对显示对象排版
	*@param text
	*/
	__proto.appendHTML=function(text){
		HTMLParse.parse(this,text,this.URI);
		this.layout();
	}

	/**
	*@private
	*@param out
	*@return
	*/
	__proto._addChildsToLayout=function(out){
		var words=this._getWords();
		if (words==null && this._childs.length==0)return false;
		words && words.forEach(function(o){
			out.push(o);
		});
		var tFirstKey=true;
		for (var i=0,len=this._childs.length;i < len;i++){
			var o=this._childs[i];
			if (tFirstKey){
				tFirstKey=false;
				}else {
				out.push(null);
			}
			o._addToLayout(out)
		}
		return true;
	}

	/**
	*@private
	*@param out
	*/
	__proto._addToLayout=function(out){
		this.layout();
	}

	/**
	*@private
	*对显示内容进行排版
	*/
	__proto.layout=function(){
		if (!this.style)return;
		this.style._type |=/*laya.display.css.CSSStyle.ADDLAYOUTED*/0x200;
		var tArray=Layout.layout(this);
		if (tArray){
			if (!this._$P.mHtmlBounds)this._set$P("mHtmlBounds",new Rectangle());
			var tRectangle=this._$P.mHtmlBounds;
			tRectangle.x=tRectangle.y=0;
			tRectangle.width=this.contextWidth=tArray[0];
			tRectangle.height=this.contextHeight=tArray[1];
			this.setBounds(tRectangle);
		}
	}

	/**
	*获取对象的高
	*/
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		return this.contextHeight;
	},_super.prototype._$set_height);

	/**
	*设置标签内容
	*/
	__getset(0,__proto,'innerHTML',null,function(text){
		this.destroyChildren();
		this.appendHTML(text);
	});

	/**
	*获取对象的宽
	*/
	__getset(0,__proto,'width',function(){
		if (this._width)return this._width;
		return this.contextWidth;
		},function(value){
		var changed=false;
		if (value===0){
			changed=value !=this._width;
			}else{
			changed=value !=this.width;
		}
		Laya.superSet(HTMLElement,this,'width',value);
		if(changed)
			this.layout();
	});

	return HTMLDivElement;
})(HTMLElement)


/**
*@private
*/
//class laya.html.dom.HTMLDocument extends laya.html.dom.HTMLElement
var HTMLDocument=(function(_super){
	function HTMLDocument(){
		this.all=new Array;
		this.styleSheets=CSSStyle.styleSheets;
		HTMLDocument.__super.call(this);
	}

	__class(HTMLDocument,'laya.html.dom.HTMLDocument',_super);
	var __proto=HTMLDocument.prototype;
	__proto.getElementById=function(id){
		return this.all[id];
	}

	__proto.setElementById=function(id,e){
		this.all[id]=e;
	}

	__static(HTMLDocument,
	['document',function(){return this.document=new HTMLDocument();}
	]);
	return HTMLDocument;
})(HTMLElement)


/**
*@private
*/
//class laya.html.dom.HTMLImageElement extends laya.html.dom.HTMLElement
var HTMLImageElement=(function(_super){
	function HTMLImageElement(){
		this._tex=null;
		this._url=null;
		this._renderArgs=[];
		HTMLImageElement.__super.call(this);
		this.style.block=true;
	}

	__class(HTMLImageElement,'laya.html.dom.HTMLImageElement',_super);
	var __proto=HTMLImageElement.prototype;
	__proto._addToLayout=function(out){
		!this._style.absolute && out.push(this);
	}

	__proto.render=function(context,x,y){
		if (!this._tex || !this._tex.loaded || !this._tex.loaded || this._width < 1 || this._height < 1)return;
		Stat.spriteCount++;
		this._renderArgs[0]=this._tex;
		this._renderArgs[1]=this.x;
		this._renderArgs[2]=this.y;
		this._renderArgs[3]=this.width || this._tex.width;
		this._renderArgs[4]=this.height || this._tex.height;
		context.ctx.drawTexture2(x,y,this.style.translateX,this.style.translateY,this.transform,this.style.alpha,this.style.blendMode,this._renderArgs);
	}

	/**
	*@private
	*/
	__proto.layaoutCallNative=function(){
		var n=0;
		if (this._childs &&(n=this._childs.length)> 0){
			for (var i=0;i < n;i++){
				this._childs[i].layaoutCallNative && this._childs[i].layaoutCallNative();
			}
		}
	}

	__getset(0,__proto,'src',null,function(url){
		var _$this=this;
		url=this.formatURL(url);
		if (this._url==url)return;
		this._url=url;
		var tex=this._tex=Loader.getRes(url);
		if (!tex){
			this._tex=tex=new Texture();
			tex.load(url);
			Loader.cacheRes(url,tex);
		}
		function onloaded (){
			if (!_$this._style)return;
			var style=_$this._style;
			var w=style.widthed(_$this)?-1:_$this._tex.width;
			var h=style.heighted(_$this)?-1:_$this._tex.height;
			if (!style.widthed(_$this)&& _$this._width !=_$this._tex.width){
				_$this.width=_$this._tex.width;
				_$this.parent && (_$this.parent)._layoutLater();
			}
			if (!style.heighted(_$this)&& _$this._height !=_$this._tex.height){
				_$this.height=_$this._tex.height;
				_$this.parent && (_$this.parent)._layoutLater();
			}
			if (Render.isConchApp){
				_$this._renderArgs[0]=_$this._tex;
				_$this._renderArgs[1]=_$this.x;
				_$this._renderArgs[2]=_$this.y;
				_$this._renderArgs[3]=_$this.width || _$this._tex.width;
				_$this._renderArgs[4]=_$this.height || _$this._tex.height;
				_$this.graphics.drawTexture(_$this._tex,0,0,_$this._renderArgs[3],_$this._renderArgs[4]);
			}
			_$this.repaint();
			_$this.parentRepaint();
		}
		tex.loaded?onloaded():tex.on(/*laya.events.Event.LOADED*/"loaded",null,onloaded);
	});

	return HTMLImageElement;
})(HTMLElement)


/**
*@private
*/
//class laya.html.dom.HTMLLinkElement extends laya.html.dom.HTMLElement
var HTMLLinkElement=(function(_super){
	function HTMLLinkElement(){
		this.type=null;
		HTMLLinkElement.__super.call(this);
		this.visible=false;
	}

	__class(HTMLLinkElement,'laya.html.dom.HTMLLinkElement',_super);
	var __proto=HTMLLinkElement.prototype;
	__proto._onload=function(data){
		switch(this.type){
			case 'text/css':
				CSSStyle.parseCSS(data,this.URI);
				break ;
			}
	}

	__getset(0,__proto,'href',_super.prototype._$get_href,function(url){
		var _$this=this;
		url=this.formatURL(url);
		this.URI=new URL(url);
		var l=new Loader();
		l.once(/*laya.events.Event.COMPLETE*/"complete",null,function(data){
			_$this._onload(data);
		});
		l.load(url,/*laya.net.Loader.TEXT*/"text");
	});

	HTMLLinkElement._cuttingStyle=new RegExp("((@keyframes[\\s\\t]+|)(.+))[\\t\\n\\r\\\s]*{","g");
	return HTMLLinkElement;
})(HTMLElement)


/**
*@private
*/
//class laya.html.dom.HTMLStyleElement extends laya.html.dom.HTMLElement
var HTMLStyleElement=(function(_super){
	function HTMLStyleElement(){
		HTMLStyleElement.__super.call(this);
		this.visible=false;
	}

	__class(HTMLStyleElement,'laya.html.dom.HTMLStyleElement',_super);
	var __proto=HTMLStyleElement.prototype;
	/**
	*解析样式
	*/
	__getset(0,__proto,'text',_super.prototype._$get_text,function(value){
		CSSStyle.parseCSS(value,null);
	});

	return HTMLStyleElement;
})(HTMLElement)


/**
*iframe标签类，目前用于加载外并解析数据
*/
//class laya.html.dom.HTMLIframeElement extends laya.html.dom.HTMLDivElement
var HTMLIframeElement=(function(_super){
	function HTMLIframeElement(){
		HTMLIframeElement.__super.call(this);
		this._getCSSStyle().valign="middle";
	}

	__class(HTMLIframeElement,'laya.html.dom.HTMLIframeElement',_super);
	var __proto=HTMLIframeElement.prototype;
	/**
	*加载html文件，并解析数据
	*@param url
	*/
	__getset(0,__proto,'href',_super.prototype._$get_href,function(url){
		var _$this=this;
		url=this.formatURL(url);
		var l=new Loader();
		l.once(/*laya.events.Event.COMPLETE*/"complete",null,function(data){
			var pre=_$this.URI;
			_$this.URI=new URL(url);
			_$this.innerHTML=data;
			!pre || (_$this.URI=pre);
		});
		l.load(url,/*laya.net.Loader.TEXT*/"text");
	});

	return HTMLIframeElement;
})(HTMLDivElement)



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