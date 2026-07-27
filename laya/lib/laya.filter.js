
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Browser=laya.utils.Browser,Color=laya.utils.Color,ColorFilterAction=laya.filters.ColorFilterAction;
	var ColorFilterActionGL=laya.filters.webgl.ColorFilterActionGL,Filter=laya.filters.Filter,FilterActionGL=laya.filters.webgl.FilterActionGL;
	var Matrix=laya.maths.Matrix,Rectangle=laya.maths.Rectangle,Render=laya.renders.Render,RenderContext=laya.renders.RenderContext;
	var RenderTarget2D=laya.webgl.resource.RenderTarget2D,RunDriver=laya.utils.RunDriver,ShaderDefines2D=laya.webgl.shader.d2.ShaderDefines2D;
	var Sprite=laya.display.Sprite,Texture=laya.resource.Texture,Value2D=laya.webgl.shader.d2.value.Value2D;
/**
*默认的FILTER,什么都不做
*@private
*/
//class laya.filters.FilterAction
var FilterAction=(function(){
	function FilterAction(){
		this.data=null;
	}

	__class(FilterAction,'laya.filters.FilterAction');
	var __proto=FilterAction.prototype;
	Laya.imps(__proto,{"laya.filters.IFilterAction":true})
	__proto.apply=function(data){
		return null;
	}

	return FilterAction;
})()


/**
*@private
*/
//class laya.filters.WebGLFilter
var WebGLFilter=(function(){
	function WebGLFilter(){}
	__class(WebGLFilter,'laya.filters.WebGLFilter');
	WebGLFilter.enable=function(){
		if (WebGLFilter.isInit)return;
		WebGLFilter.isInit=true;
		if (!Render.isWebGL)return;
		RunDriver.createFilterAction=function (type){
			var action;
			switch (type){
				case /*laya.filters.Filter.COLOR*/0x20:
					action=new ColorFilterActionGL();
					break ;
				case /*laya.filters.Filter.BLUR*/0x10:
					action=new BlurFilterActionGL();
					break ;
				case /*laya.filters.Filter.GLOW*/0x08:
					action=new GlowFilterActionGL();
					break ;
				}
			return action;
		}
	}

	WebGLFilter.isInit=false;
	WebGLFilter.__init$=function(){
		BlurFilterActionGL;
		ColorFilterActionGL;
		GlowFilterActionGL;
		Render;
		RunDriver;{
			RunDriver.createFilterAction=function (type){
				var action;
				switch (type){
					case /*laya.filters.Filter.BLUR*/0x10:
						action=new FilterAction();
						break ;
					case /*laya.filters.Filter.GLOW*/0x08:
						action=new FilterAction();
						break ;
					case /*laya.filters.Filter.COLOR*/0x20:
						action=new ColorFilterAction();
						break ;
					}
				return action;
			}
		}
	}

	return WebGLFilter;
})()


/**
*模糊滤镜
*/
//class laya.filters.BlurFilter extends laya.filters.Filter
var BlurFilter=(function(_super){
	function BlurFilter(strength){
		/**模糊滤镜的强度(值越大，越不清晰 */
		this.strength=NaN;
		this.strength_sig2_2sig2_gauss1=[];
		BlurFilter.__super.call(this);
		(strength===void 0)&& (strength=4);
		if (Render.isWebGL)WebGLFilter.enable();
		this.strength=strength;
		this._action=RunDriver.createFilterAction(0x10);
		this._action.data=this;
	}

	__class(BlurFilter,'laya.filters.BlurFilter',_super);
	var __proto=BlurFilter.prototype;
	/**
	*@private 通知微端
	*/
	__proto.callNative=function(sp){
		sp.conchModel &&sp.conchModel.blurFilter&&sp.conchModel.blurFilter(this.strength);
	}

	/**
	*@private
	*当前滤镜对应的操作器
	*/
	__getset(0,__proto,'action',function(){
		return this._action;
	});

	/**
	*@private
	*当前滤镜的类型
	*/
	__getset(0,__proto,'type',function(){
		return 0x10;
	});

	return BlurFilter;
})(Filter)


/**
*发光滤镜(也可以当成阴影滤使用）
*/
//class laya.filters.GlowFilter extends laya.filters.Filter
var GlowFilter=(function(_super){
	function GlowFilter(color,blur,offX,offY){
		/**滤镜的颜色*/
		this._color=null;
		GlowFilter.__super.call(this);
		this._elements=new Float32Array(9);
		(blur===void 0)&& (blur=4);
		(offX===void 0)&& (offX=6);
		(offY===void 0)&& (offY=6);
		if (Render.isWebGL){
			WebGLFilter.enable();
		}
		this._color=new Color(color);
		this.blur=Math.min(blur,20);
		this.offX=offX;
		this.offY=offY;
		this._action=RunDriver.createFilterAction(0x08);
		this._action.data=this;
	}

	__class(GlowFilter,'laya.filters.GlowFilter',_super);
	var __proto=GlowFilter.prototype;
	/**@private */
	__proto.getColor=function(){
		return this._color._color;
	}

	/**
	*@private 通知微端
	*/
	__proto.callNative=function(sp){
		sp.conchModel &&sp.conchModel.glowFilter&&sp.conchModel.glowFilter(this._color.strColor,this._elements[4],this._elements[5],this._elements[6]);
	}

	/**
	*@private
	*滤镜类型
	*/
	__getset(0,__proto,'type',function(){
		return 0x08;
	});

	/**@private */
	__getset(0,__proto,'action',function(){
		return this._action;
	});

	/**@private */
	/**@private */
	__getset(0,__proto,'offY',function(){
		return this._elements[6];
		},function(value){
		this._elements[6]=value;
	});

	/**@private */
	/**@private */
	__getset(0,__proto,'offX',function(){
		return this._elements[5];
		},function(value){
		this._elements[5]=value;
	});

	/**@private */
	/**@private */
	__getset(0,__proto,'blur',function(){
		return this._elements[4];
		},function(value){
		this._elements[4]=value;
	});

	return GlowFilter;
})(Filter)


/**
*@private
*/
//class laya.filters.webgl.BlurFilterActionGL extends laya.filters.webgl.FilterActionGL
var BlurFilterActionGL=(function(_super){
	function BlurFilterActionGL(){
		this.data=null;
		BlurFilterActionGL.__super.call(this);
	}

	__class(BlurFilterActionGL,'laya.filters.webgl.BlurFilterActionGL',_super);
	var __proto=BlurFilterActionGL.prototype;
	__proto.setValueMix=function(shader){
		shader.defines.add(this.data.type);
		var o=shader;
	}

	__proto.apply3d=function(scope,sprite,context,x,y){
		var b=scope.getValue("bounds");
		var shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
		shaderValue.setFilters([this.data]);
		var tMatrix=Matrix.EMPTY;
		tMatrix.identity();
		context.ctx.drawTarget(scope,0,0,b.width,b.height,Matrix.EMPTY,"src",shaderValue);
		shaderValue.setFilters(null);
	}

	__proto.setValue=function(shader){
		shader.strength=this.data.strength;
		var sigma=this.data.strength/3.0;
		var sigma2=sigma*sigma;
		this.data.strength_sig2_2sig2_gauss1[0]=this.data.strength;
		this.data.strength_sig2_2sig2_gauss1[1]=sigma2;
		this.data.strength_sig2_2sig2_gauss1[2]=2.0*sigma2;
		this.data.strength_sig2_2sig2_gauss1[3]=1.0/(2.0*Math.PI*sigma2);
		shader.strength_sig2_2sig2_gauss1=this.data.strength_sig2_2sig2_gauss1;
	}

	__getset(0,__proto,'typeMix',function(){return /*laya.filters.Filter.BLUR*/0x10;});
	return BlurFilterActionGL;
})(FilterActionGL)


/**
*@private
*/
//class laya.filters.webgl.GlowFilterActionGL extends laya.filters.webgl.FilterActionGL
var GlowFilterActionGL=(function(_super){
	function GlowFilterActionGL(){
		this.data=null;
		this._initKey=false;
		this._textureWidth=0;
		this._textureHeight=0;
		GlowFilterActionGL.__super.call(this);
	}

	__class(GlowFilterActionGL,'laya.filters.webgl.GlowFilterActionGL',_super);
	var __proto=GlowFilterActionGL.prototype;
	Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
	__proto.setValueMix=function(shader){}
	__proto.apply3d=function(scope,sprite,context,x,y){
		var b=scope.getValue("bounds");
		scope.addValue("color",this.data.getColor());
		var w=b.width,h=b.height;
		this._textureWidth=w;
		this._textureHeight=h;
		var shaderValue;
		var mat=Matrix.TEMP;
		mat.identity();
		shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
		shaderValue.setFilters([this.data]);
		context.ctx.drawTarget(scope,0,0,this._textureWidth,this._textureHeight,mat,"src",shaderValue,null);
		shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
		context.ctx.drawTarget(scope,0,0,this._textureWidth,this._textureHeight,mat,"src",shaderValue);
		return null;
	}

	__proto.setSpriteWH=function(sprite){
		this._textureWidth=sprite.width;
		this._textureHeight=sprite.height;
	}

	__proto.setValue=function(shader){
		shader.u_offsetX=this.data.offX;
		shader.u_offsetY=-this.data.offY;
		shader.u_strength=1.0;
		shader.u_blurX=this.data.blur;
		shader.u_blurY=this.data.blur;
		shader.u_textW=this._textureWidth;
		shader.u_textH=this._textureHeight;
		shader.u_color=this.data.getColor();
	}

	__getset(0,__proto,'typeMix',function(){return /*laya.filters.Filter.GLOW*/0x08;});
	GlowFilterActionGL.tmpTarget=function(scope,sprite,context,x,y){
		var b=scope.getValue("bounds");
		var out=scope.getValue("out");
		out.end();
		var tmpTarget=RenderTarget2D.create(b.width,b.height);
		tmpTarget.start();
		var color=scope.getValue("color");
		if (color){
			tmpTarget.clear(color[0],color[1],color[2],0);
		}
		scope.addValue("tmpTarget",tmpTarget);
	}

	GlowFilterActionGL.startOut=function(scope,sprite,context,x,y){
		var tmpTarget=scope.getValue("tmpTarget");
		tmpTarget.end();
		var out=scope.getValue("out");
		out.start();
		var color=scope.getValue("color");
		if (color){
			out.clear(color[0],color[1],color[2],0);
		}
	}

	GlowFilterActionGL.recycleTarget=function(scope,sprite,context,x,y){
		var src=scope.getValue("src");
		var tmpTarget=scope.getValue("tmpTarget");
		tmpTarget.recycle();
	}

	return GlowFilterActionGL;
})(FilterActionGL)


	Laya.__init([WebGLFilter]);
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