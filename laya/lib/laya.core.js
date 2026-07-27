
/***********************************/
/*http://www.layabox.com  2017/12/12*/
/***********************************/
var Laya=window.Laya=(function(window,document){
	var Laya={
		__internals:[],
		__packages:{},
		__classmap:{'Object':Object,'Function':Function,'Array':Array,'String':String},
		__sysClass:{'object':'Object','array':'Array','string':'String','dictionary':'Dictionary'},
		__propun:{writable: true,enumerable: false,configurable: true},
		__presubstr:String.prototype.substr,
		__substr:function(ofs,sz){return arguments.length==1?Laya.__presubstr.call(this,ofs):Laya.__presubstr.call(this,ofs,sz>0?sz:(this.length+sz));},
		__init:function(_classs){_classs.forEach(function(o){o.__init$ && o.__init$();});},
		__isClass:function(o){return o && (o.__isclass || o==Object || o==String || o==Array);},
		__newvec:function(sz,value){
			var d=[];
			d.length=sz;
			for(var i=0;i<sz;i++) d[i]=value;
			return d;
		},
		__extend:function(d,b){
			for (var p in b){
				if (!b.hasOwnProperty(p)) continue;
				var gs=Object.getOwnPropertyDescriptor(b, p);
				var g = gs.get, s = gs.set; 
				if ( g || s ) {
					if ( g && s)
						Object.defineProperty(d,p,gs);
					else{
						g && Object.defineProperty(d, p, g);
						s && Object.defineProperty(d, p, s);
					}
				}
				else d[p] = b[p];
			}
			function __() { Laya.un(this,'constructor',d); }__.prototype=b.prototype;d.prototype=new __();Laya.un(d.prototype,'__imps',Laya.__copy({},b.prototype.__imps));
		},
		__copy:function(dec,src){
			if(!src) return null;
			dec=dec||{};
			for(var i in src) dec[i]=src[i];
			return dec;
		},
		__package:function(name,o){
			if(Laya.__packages[name]) return;
			Laya.__packages[name]=true;
			var p=window,strs=name.split('.');
			if(strs.length>1){
				for(var i=0,sz=strs.length-1;i<sz;i++){
					var c=p[strs[i]];
					p=c?c:(p[strs[i]]={});
				}
			}
			p[strs[strs.length-1]] || (p[strs[strs.length-1]]=o||{});
		},
		__hasOwnProperty:function(name,o){
			o=o ||this;
		    function classHas(name,o){
				if(Object.hasOwnProperty.call(o.prototype,name)) return true;
				var s=o.prototype.__super;
				return s==null?null:classHas(name,s);
			}
			return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
		},
		__typeof:function(o,value){
			if(!o || !value) return false;
			if(value===String) return (typeof o==='string');
			if(value===Number) return (typeof o==='number');
			if(value.__interface__) value=value.__interface__;
			else if(typeof value!='string')  return (o instanceof value);
			return (o.__imps && o.__imps[value]) || (o.__class==value);
		},
		__as:function(value,type){
			return (this.__typeof(value,type))?value:null;
		},
        __int:function(value){
            return value?parseInt(value):0;
        },
		interface:function(name,_super){
			Laya.__package(name,{});
			var ins=Laya.__internals;
			var a=ins[name]=ins[name] || {self:name};
			if(_super)
			{
				var supers=_super.split(',');
				a.extend=[];
				for(var i=0;i<supers.length;i++){
					var nm=supers[i];
					ins[nm]=ins[nm] || {self:nm};
					a.extend.push(ins[nm]);
				}
			}
			var o=window,words=name.split('.');
			for(var i=0;i<words.length-1;i++) o=o[words[i]];
			o[words[words.length-1]]={__interface__:name};
		},
		class:function(o,fullName,_super,miniName){
			_super && Laya.__extend(o,_super);
			if(fullName){
				Laya.__package(fullName,o);
				Laya.__classmap[fullName]=o;
				if(fullName.indexOf('.')>0){
					if(fullName.indexOf('laya.')==0){
						var paths=fullName.split('.');
						miniName=miniName || paths[paths.length-1];
						if(Laya[miniName]) console.log("Warning!,this class["+miniName+"] already exist:",Laya[miniName]);
						Laya[miniName]=o;
					}
				}
				else {
					if(fullName=="Main")
						window.Main=o;
					else{
						if(Laya[fullName]){
							console.log("Error!,this class["+fullName+"] already exist:",Laya[fullName]);
						}
						Laya[fullName]=o;
					}
				}
			}
			var un=Laya.un,p=o.prototype;
			un(p,'hasOwnProperty',Laya.__hasOwnProperty);
			un(p,'__class',o);
			un(p,'__super',_super);
			un(p,'__className',fullName);
			un(o,'__super',_super);
			un(o,'__className',fullName);
			un(o,'__isclass',true);
			un(o,'super',function(o){this.__super.call(o);});
		},
		imps:function(dec,src){
			if(!src) return null;
			var d=dec.__imps|| Laya.un(dec,'__imps',{});
			function __(name){
				var c,exs;
				if(! (c=Laya.__internals[name]) ) return;
				d[name]=true;
				if(!(exs=c.extend)) return;
				for(var i=0;i<exs.length;i++){
					__(exs[i].self);
				}
			}
			for(var i in src) __(i);
		},
        superSet:function(clas,o,prop,value){
            var fun = clas.prototype["_$set_"+prop];
            fun && fun.call(o,value);
        },
        superGet:function(clas,o,prop){
            var fun = clas.prototype["_$get_"+prop];
           	return fun?fun.call(o):null;
        },
		getset:function(isStatic,o,name,getfn,setfn){
			if(!isStatic){
				getfn && Laya.un(o,'_$get_'+name,getfn);
				setfn && Laya.un(o,'_$set_'+name,setfn);
			}
			else{
				getfn && (o['_$GET_'+name]=getfn);
				setfn && (o['_$SET_'+name]=setfn);
			}
			if(getfn && setfn) 
				Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false,configurable:true});
			else{
				getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false,configurable:true});
				setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false,configurable:true});
			}
		},
		static:function(_class,def){
				for(var i=0,sz=def.length;i<sz;i+=2){
					if(def[i]=='length') 
						_class.length=def[i+1].call(_class);
					else{
						function tmp(){
							var name=def[i];
							var getfn=def[i+1];
							Object.defineProperty(_class,name,{
								get:function(){delete this[name];return this[name]=getfn.call(this);},
								set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
						}
						tmp();
					}
				}
		},		
		un:function(obj,name,value){
			value || (value=obj[name]);
			Laya.__propun.value=value;
			Object.defineProperty(obj, name, Laya.__propun);
			return value;
		},
		uns:function(obj,names){
			names.forEach(function(o){Laya.un(obj,o)});
		}
	};

    window.console=window.console || ({log:function(){}});
	window.trace=window.console.log;
	Error.prototype.throwError=function(){throw arguments;};
	//String.prototype.substr=Laya.__substr;
	Object.defineProperty(Array.prototype,'fixed',{enumerable: false});

	return Laya;
})(window,document);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

})(window,document,Laya);


(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
Laya.interface('laya.runtime.IMarket');
Laya.interface('laya.filters.IFilter');
Laya.interface('laya.display.ILayout');
Laya.interface('laya.resource.IDispose');
Laya.interface('laya.runtime.IPlatform');
Laya.interface('laya.resource.IDestroy');
Laya.interface('laya.runtime.IConchNode');
Laya.interface('laya.filters.IFilterAction');
Laya.interface('laya.runtime.ICPlatformClass');
Laya.interface('laya.resource.ICreateResource');
Laya.interface('laya.runtime.IConchRenderObject');
Laya.interface('laya.runtime.IPlatformClass','laya.runtime.IPlatform');
/**
*@private
*/
//class laya.utils.RunDriver
var RunDriver=(function(){
	function RunDriver(){}
	__class(RunDriver,'laya.utils.RunDriver');
	RunDriver.FILTER_ACTIONS=[];
	RunDriver.pixelRatio=-1;
	RunDriver._charSizeTestDiv=null;
	RunDriver.now=function(){
		return /*__JS__ */Date.now();
	}

	RunDriver.getWindow=function(){
		return /*__JS__ */window;
	}

	RunDriver.getPixelRatio=function(){
		if (RunDriver.pixelRatio < 0){
			var ctx=Browser.context;
			var backingStore=ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
			RunDriver.pixelRatio=(Browser.window.devicePixelRatio || 1)/ backingStore;
			if (RunDriver.pixelRatio < 1)RunDriver.pixelRatio=1;
		}
		return RunDriver.pixelRatio;
	}

	RunDriver.getIncludeStr=function(name){
		return null;
	}

	RunDriver.createShaderCondition=function(conditionScript){
		var fn="(function() {return "+conditionScript+";})";
		return Laya._runScript(fn);
	}

	RunDriver.fontMap=[];
	RunDriver.measureText=function(txt,font){
		var isChinese=RunDriver.hanzi.test(txt);
		if (isChinese && RunDriver.fontMap[font]){
			return RunDriver.fontMap[font];
		};
		var ctx=Browser.context;
		ctx.font=font;
		var r=ctx.measureText(txt);
		if (isChinese)RunDriver.fontMap[font]=r;
		return r;
	}

	RunDriver.getWebGLContext=function(canvas){
	};

	RunDriver.beginFlush=function(){
	};

	RunDriver.endFinish=function(){
	};

	RunDriver.addToAtlas=null;
	RunDriver.flashFlushImage=function(atlasWebGLCanvas){
	};

	RunDriver.drawToCanvas=function(sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
		var canvas=HTMLCanvas.create("2D");
		var context=new RenderContext(canvasWidth,canvasHeight,canvas);
		RenderSprite.renders[_renderType]._fun(sprite,context,offsetX,offsetY);
		return canvas;
	}

	RunDriver.createParticleTemplate2D=null;
	RunDriver.createGLTextur=null;
	RunDriver.createWebGLContext2D=null;
	RunDriver.changeWebGLSize=function(w,h){
	};

	RunDriver.createRenderSprite=function(type,next){
		return new RenderSprite(type,next);
	}

	RunDriver.createFilterAction=function(type){
		return new ColorFilterAction();
	}

	RunDriver.createGraphics=function(){
		return new Graphics();
	}

	RunDriver.clear=function(value){
		Render._context.ctx.clear();
	}

	RunDriver.cancelLoadByUrl=function(url){
	};

	RunDriver.clearAtlas=function(value){
	};

	RunDriver.isAtlas=function(bitmap){
		return false;
	}

	RunDriver.addTextureToAtlas=function(value){
	};

	RunDriver.getTexturePixels=function(value,x,y,width,height){
		return null;
	}

	RunDriver.skinAniSprite=function(){
		return null;
	}

	RunDriver.update3DLoop=function(){
	};

	__static(RunDriver,
	['hanzi',function(){return this.hanzi=new RegExp("^[\u4E00-\u9FA5]$");}
	]);
	return RunDriver;
})()


/**
*<code>Laya</code> 是全局对象的引用入口集。
*Laya类引用了一些常用的全局对象，比如Laya.stage：舞台，Laya.timer：时间管理器，Laya.loader：加载管理器，使用时注意大小写。
*/
//class Laya
var ___Laya=(function(){
	//function Laya(){}
	/**
	*表示是否捕获全局错误并弹出提示。默认为false。
	*适用于移动设备等不方便调试的时候，设置为true后，如有未知错误，可以弹窗抛出详细错误堆栈。
	*/
	__getset(1,Laya,'alertGlobalError',null,function(value){
		var erralert=0;
		if (value){
			Browser.window.onerror=function (msg,url,line,column,detail){
				if (erralert++< 5 && detail)
					alert("出错啦，请把此信息截图给研发商\n"+msg+"\n"+detail.stack || detail);
			}
			}else {
			Browser.window.onerror=null;
		}
	});

	Laya.init=function(width,height,__plugins){
		var plugins=[];for(var i=2,sz=arguments.length;i<sz;i++)plugins.push(arguments[i]);
		if (Laya._isinit)return;
		ArrayBuffer.prototype.slice || (ArrayBuffer.prototype.slice=Laya._arrayBufferSlice);
		Laya._isinit=true;
		Browser.__init__();
		Context.__init__();
		Graphics.__init__();
		Laya.timer=new Timer();
		Laya.scaleTimer=new Timer();
		Laya.loader=new LoaderManager();
		WeakObject.__init__();
		for (var i=0,n=plugins.length;i < n;i++){
			if (plugins[i].enable)plugins[i].enable();
		}
		Font.__init__();
		Style.__init__();
		ResourceManager.__init__();
		CacheManager.beginCheck();
		Laya._currentStage=Laya.stage=new Stage();
		Laya.stage.conchModel && Laya.stage.conchModel.setRootNode();
		Laya._getUrlPath();
		Laya.render=new Render(0,0);
		Laya.stage.size(width,height);
		RenderSprite.__init__();
		KeyBoardManager.__init__();
		MouseManager.instance.__init__(Laya.stage,Render.canvas);
		Input.__init__();
		SoundManager.autoStopMusic=true;
		LocalStorage.__init__();
		return Render.canvas;
	}

	Laya._getUrlPath=function(){
		var location=Browser.window.location;
		var pathName=location.pathname;
		pathName=pathName.charAt(2)==':' ? pathName.substring(1):pathName;
		URL.rootPath=URL.basePath=URL.getPath(location.protocol=="file:" ? pathName :location.protocol+"//"+location.host+location.pathname);
	}

	Laya._arrayBufferSlice=function(start,end){
		var arr=/*__JS__ */this;
		var arrU8List=new Uint8Array(arr,start,end-start);
		var newU8List=new Uint8Array(arrU8List.length);
		newU8List.set(arrU8List);
		return newU8List.buffer;
	}

	Laya._runScript=function(script){
		return Browser.window[Laya._evcode](script);
	}

	Laya.stage=null;
	Laya.timer=null;
	Laya.scaleTimer=null;
	Laya.loader=null;
	Laya.version="1.8.14";
	Laya.render=null;
	Laya._currentStage=null;
	Laya._isinit=false;
	Laya.MiniAdpter=/*__JS__ */{init:function(){if (window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf("MiniGame")>-1)console.error("请先引用小游戏适配库laya.wxmini.js,详细教程：https://ldc.layabox.com/doc/?nav=zh-ts-5-0-0")}};
	__static(Laya,
	['conchMarket',function(){return this.conchMarket=/*__JS__ */window.conch?conchMarket:null;},'PlatformClass',function(){return this.PlatformClass=/*__JS__ */window.PlatformClass;},'_evcode',function(){return this._evcode="e"+String.fromCharCode(100+10+8)+"a"+"l";}
	]);
	return Laya;
})()


/**
*Config 用于配置一些全局参数。如需更改，请在初始化引擎之前设置。
*/
//class Config
var Config=(function(){
	function Config(){}
	__class(Config,'Config');
	Config.WebGLTextCacheCount=500;
	Config.atlasEnable=false;
	Config.showCanvasMark=false;
	Config.animationInterval=50;
	Config.isAntialias=false;
	Config.isAlpha=false;
	Config.premultipliedAlpha=true;
	Config.isStencil=true;
	Config.preserveDrawingBuffer=false;
	Config.useRetinalCanvas=false;
	Config.CborderSize=12;
	return Config;
})()


/**
*<code>EventDispatcher</code> 类是可调度事件的所有类的基类。
*/
//class laya.events.EventDispatcher
var EventDispatcher=(function(){
	var EventHandler;
	function EventDispatcher(){
		/**@private */
		this._events=null;
	}

	__class(EventDispatcher,'laya.events.EventDispatcher');
	var __proto=EventDispatcher.prototype;
	/**
	*检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
	*@param type 事件的类型。
	*@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
	*/
	__proto.hasListener=function(type){
		var listener=this._events && this._events[type];
		return !!listener;
	}

	/**
	*派发事件。
	*@param type 事件类型。
	*@param data （可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
	*@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
	*/
	__proto.event=function(type,data){
		if (!this._events || !this._events[type])return false;
		var listeners=this._events[type];
		if (listeners.run){
			if (listeners.once)delete this._events[type];
			data !=null ? listeners.runWith(data):listeners.run();
			}else {
			for (var i=0,n=listeners.length;i < n;i++){
				var listener=listeners[i];
				if (listener){
					(data !=null)? listener.runWith(data):listener.run();
				}
				if (!listener || listener.once){
					listeners.splice(i,1);
					i--;
					n--;
				}
			}
			if (listeners.length===0 && this._events)delete this._events[type];
		}
		return true;
	}

	/**
	*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param args （可选）事件侦听函数的回调参数。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.on=function(type,caller,listener,args){
		return this._createListener(type,caller,listener,args,false);
	}

	/**
	*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param args （可选）事件侦听函数的回调参数。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.once=function(type,caller,listener,args){
		return this._createListener(type,caller,listener,args,true);
	}

	/**@private */
	__proto._createListener=function(type,caller,listener,args,once,offBefore){
		(offBefore===void 0)&& (offBefore=true);
		offBefore && this.off(type,caller,listener,once);
		var handler=EventHandler.create(caller || this,listener,args,once);
		this._events || (this._events={});
		var events=this._events;
		if (!events[type])events[type]=handler;
		else {
			if (!events[type].run)events[type].push(handler);
			else events[type]=[events[type],handler];
		}
		return this;
	}

	/**
	*从 EventDispatcher 对象中删除侦听器。
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param onceOnly （可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (!this._events || !this._events[type])return this;
		var listeners=this._events[type];
		if (listeners !=null){
			if (listeners.run){
				if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
					delete this._events[type];
					listeners.recover();
				}
				}else {
				var count=0;
				for (var i=0,n=listeners.length;i < n;i++){
					var item=listeners[i];
					if (!item){
						count++;
						continue ;
					}
					if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
						count++;
						listeners[i]=null;
						item.recover();
					}
				}
				if (count===n)delete this._events[type];
			}
		}
		return this;
	}

	/**
	*从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
	*@param type （可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.offAll=function(type){
		var events=this._events;
		if (!events)return this;
		if (type){
			this._recoverHandlers(events[type]);
			delete events[type];
			}else {
			for (var name in events){
				this._recoverHandlers(events[name]);
			}
			this._events=null;
		}
		return this;
	}

	__proto._recoverHandlers=function(arr){
		if (!arr)return;
		if (arr.run){
			arr.recover();
			}else {
			for (var i=arr.length-1;i >-1;i--){
				if (arr[i]){
					arr[i].recover();
					arr[i]=null;
				}
			}
		}
	}

	/**
	*检测指定事件类型是否是鼠标事件。
	*@param type 事件的类型。
	*@return 如果是鼠标事件，则值为 true;否则，值为 false。
	*/
	__proto.isMouseEvent=function(type){
		return EventDispatcher.MOUSE_EVENTS[type];
	}

	EventDispatcher.MOUSE_EVENTS={"rightmousedown":true,"rightmouseup":true,"rightclick":true,"mousedown":true,"mouseup":true,"mousemove":true,"mouseover":true,"mouseout":true,"click":true,"doubleclick":true};
	EventDispatcher.__init$=function(){
		Object.defineProperty(laya.events.EventDispatcher.prototype,"_events",{enumerable:false,writable:true});
		/**@private */
		//class EventHandler extends laya.utils.Handler
		EventHandler=(function(_super){
			function EventHandler(caller,method,args,once){
				EventHandler.__super.call(this,caller,method,args,once);
			}
			__class(EventHandler,'',_super);
			var __proto=EventHandler.prototype;
			__proto.recover=function(){
				if (this._id > 0){
					this._id=0;
					EventHandler._pool.push(this.clear());
				}
			}
			EventHandler.create=function(caller,method,args,once){
				(once===void 0)&& (once=true);
				if (EventHandler._pool.length)return EventHandler._pool.pop().setTo(caller,method,args,once);
				return new EventHandler(caller,method,args,once);
			}
			EventHandler._pool=[];
			return EventHandler;
		})(Handler)
	}

	return EventDispatcher;
})()


/**
*<p><code>Handler</code> 是事件处理器类。</p>
*<p>推荐使用 Handler.create()方法从对象池创建，减少对象创建消耗。创建的 Handler 对象不再使用后，可以使用 Handler.recover()将其回收到对象池，回收后不要再使用此对象，否则会导致不可预料的错误。</p>
*<p><b>注意：</b>由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。</p>
*/
//class laya.utils.Handler
var Handler=(function(){
	function Handler(caller,method,args,once){
		/**执行域(this)。*/
		//this.caller=null;
		/**处理方法。*/
		//this.method=null;
		/**参数。*/
		//this.args=null;
		/**表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
		this.once=false;
		/**@private */
		this._id=0;
		(once===void 0)&& (once=false);
		this.setTo(caller,method,args,once);
	}

	__class(Handler,'laya.utils.Handler');
	var __proto=Handler.prototype;
	/**
	*设置此对象的指定属性值。
	*@param caller 执行域(this)。
	*@param method 回调方法。
	*@param args 携带的参数。
	*@param once 是否只执行一次，如果为true，执行后执行recover()进行回收。
	*@return 返回 handler 本身。
	*/
	__proto.setTo=function(caller,method,args,once){
		this._id=Handler._gid++;
		this.caller=caller;
		this.method=method;
		this.args=args;
		this.once=once;
		return this;
	}

	/**
	*执行处理器。
	*/
	__proto.run=function(){
		if (this.method==null)return null;
		var id=this._id;
		var result=this.method.apply(this.caller,this.args);
		this._id===id && this.once && this.recover();
		return result;
	}

	/**
	*执行处理器，携带额外数据。
	*@param data 附加的回调数据，可以是单数据或者Array(作为多参)。
	*/
	__proto.runWith=function(data){
		if (this.method==null)return null;
		var id=this._id;
		if (data==null)
			var result=this.method.apply(this.caller,this.args);
		else if (!this.args && !data.unshift)result=this.method.call(this.caller,data);
		else if (this.args)result=this.method.apply(this.caller,this.args.concat(data));
		else result=this.method.apply(this.caller,data);
		this._id===id && this.once && this.recover();
		return result;
	}

	/**
	*清理对象引用。
	*/
	__proto.clear=function(){
		this.caller=null;
		this.method=null;
		this.args=null;
		return this;
	}

	/**
	*清理并回收到 Handler 对象池内。
	*/
	__proto.recover=function(){
		if (this._id > 0){
			this._id=0;
			Handler._pool.push(this.clear());
		}
	}

	Handler.create=function(caller,method,args,once){
		(once===void 0)&& (once=true);
		if (Handler._pool.length)return Handler._pool.pop().setTo(caller,method,args,once);
		return new Handler(caller,method,args,once);
	}

	Handler._pool=[];
	Handler._gid=1;
	return Handler;
})()


/**
*<code>BitmapFont</code> 是位图字体类，用于定义位图字体信息。
*/
//class laya.display.BitmapFont
var BitmapFont=(function(){
	function BitmapFont(){
		this._texture=null;
		this._fontCharDic={};
		this._fontWidthMap={};
		this._complete=null;
		this._path=null;
		this._maxWidth=0;
		this._spaceWidth=10;
		this._padding=null;
		/**当前位图字体字号。*/
		this.fontSize=12;
		/**表示是否根据实际使用的字体大小缩放位图字体大小。*/
		this.autoScaleSize=false;
		/**字符间距（以像素为单位）。*/
		this.letterSpacing=0;
	}

	__class(BitmapFont,'laya.display.BitmapFont');
	var __proto=BitmapFont.prototype;
	/**
	*通过指定位图字体文件路径，加载位图字体文件，加载完成后会自动解析。
	*@param path 位图字体文件的路径。
	*@param complete 加载并解析完成的回调。如果成功返回this,如果失败返回null
	*/
	__proto.loadFont=function(path,complete){
		this._path=path;
		this._complete=complete;
		Laya.loader.load([{url:this._path,type:/*laya.net.Loader.XML*/"xml"},{url:this._path.replace(".fnt",".png"),type:/*laya.net.Loader.IMAGE*/"image"}],Handler.create(this,this.onLoaded));
	}

	/**
	*@private
	*/
	__proto.onLoaded=function(){
		this.parseFont(Loader.getRes(this._path),Loader.getRes(this._path.replace(".fnt",".png")));
		this._complete && this._complete.runWith(this._texture?this:null);
	}

	/**
	*解析字体文件。
	*@param xml 字体文件XML。
	*@param texture 字体的纹理。
	*/
	__proto.parseFont=function(xml,texture){
		if (xml==null || texture==null)return;
		this._texture=texture;
		var tX=0;
		var tScale=1;
		var tInfo=xml.getElementsByTagName("info");
		if (!tInfo[0].getAttributeNode){
			return this.parseFont2(xml,texture);
		}
		this.fontSize=parseInt(tInfo[0].getAttributeNode("size").nodeValue);
		var tPadding=tInfo[0].getAttributeNode("padding").nodeValue;
		var tPaddingArray=tPadding.split(",");
		this._padding=[parseInt(tPaddingArray[0]),parseInt(tPaddingArray[1]),parseInt(tPaddingArray[2]),parseInt(tPaddingArray[3])];
		var chars;
		chars=xml.getElementsByTagName("char");
		var i=0;
		for (i=0;i < chars.length;i++){
			var tAttribute=chars[i];
			var tId=parseInt(tAttribute.getAttributeNode("id").nodeValue);
			var xOffset=parseInt(tAttribute.getAttributeNode("xoffset").nodeValue)/ tScale;
			var yOffset=parseInt(tAttribute.getAttributeNode("yoffset").nodeValue)/ tScale;
			var xAdvance=parseInt(tAttribute.getAttributeNode("xadvance").nodeValue)/ tScale;
			var region=new Rectangle();
			region.x=parseInt(tAttribute.getAttributeNode("x").nodeValue);
			region.y=parseInt(tAttribute.getAttributeNode("y").nodeValue);
			region.width=parseInt(tAttribute.getAttributeNode("width").nodeValue);
			region.height=parseInt(tAttribute.getAttributeNode("height").nodeValue);
			var tTexture=Texture.create(texture,region.x,region.y,region.width,region.height,xOffset,yOffset);
			this._maxWidth=Math.max(this._maxWidth,xAdvance+this.letterSpacing);
			this._fontCharDic[tId]=tTexture;
			this._fontWidthMap[tId]=xAdvance;
		}
	}

	/**
	*@private
	*解析字体文件。
	*@param xml 字体文件XML。
	*@param texture 字体的纹理。
	*/
	__proto.parseFont2=function(xml,texture){
		if (xml==null || texture==null)return;
		this._texture=texture;
		var tX=0;
		var tScale=1;
		var tInfo=xml.getElementsByTagName("info");
		this.fontSize=parseInt(tInfo[0].attributes["size"].nodeValue);
		var tPadding=tInfo[0].attributes["padding"].nodeValue;
		var tPaddingArray=tPadding.split(",");
		this._padding=[parseInt(tPaddingArray[0]),parseInt(tPaddingArray[1]),parseInt(tPaddingArray[2]),parseInt(tPaddingArray[3])];
		var chars=xml.getElementsByTagName("char");
		var i=0;
		for (i=0;i < chars.length;i++){
			var tAttribute=chars[i].attributes;
			var tId=parseInt(tAttribute["id"].nodeValue);
			var xOffset=parseInt(tAttribute["xoffset"].nodeValue)/ tScale;
			var yOffset=parseInt(tAttribute["yoffset"].nodeValue)/ tScale;
			var xAdvance=parseInt(tAttribute["xadvance"].nodeValue)/ tScale;
			var region=new Rectangle();
			region.x=parseInt(tAttribute["x"].nodeValue);
			region.y=parseInt(tAttribute["y"].nodeValue);
			region.width=parseInt(tAttribute["width"].nodeValue);
			region.height=parseInt(tAttribute["height"].nodeValue);
			var tTexture=Texture.create(texture,region.x,region.y,region.width,region.height,xOffset,yOffset);
			this._maxWidth=Math.max(this._maxWidth,xAdvance+this.letterSpacing);
			this._fontCharDic[tId]=tTexture;
			this._fontWidthMap[tId]=xAdvance;
		}
	}

	/**
	*获取指定字符的字体纹理对象。
	*@param char 字符。
	*@return 指定的字体纹理对象。
	*/
	__proto.getCharTexture=function(char){
		return this._fontCharDic[char.charCodeAt(0)];
	}

	/**
	*销毁位图字体，调用Text.unregisterBitmapFont 时，默认会销毁。
	*/
	__proto.destroy=function(){
		if (this._texture){
			for (var p in this._fontCharDic){
				var tTexture=this._fontCharDic[p];
				if (tTexture)tTexture.destroy();
			}
			this._texture.destroy();
			this._fontCharDic=null;
			this._fontWidthMap=null;
			this._texture=null;
		}
	}

	/**
	*设置空格的宽（如果字体库有空格，这里就可以不用设置了）。
	*@param spaceWidth 宽度，单位为像素。
	*/
	__proto.setSpaceWidth=function(spaceWidth){
		this._spaceWidth=spaceWidth;
	}

	/**
	*获取指定字符的宽度。
	*@param char 字符。
	*@return 宽度。
	*/
	__proto.getCharWidth=function(char){
		var code=char.charCodeAt(0);
		if (this._fontWidthMap[code])return this._fontWidthMap[code]+this.letterSpacing;
		if (char==" ")return this._spaceWidth+this.letterSpacing;
		return 0;
	}

	/**
	*获取指定文本内容的宽度。
	*@param text 文本内容。
	*@return 宽度。
	*/
	__proto.getTextWidth=function(text){
		var tWidth=0;
		for (var i=0,n=text.length;i < n;i++){
			tWidth+=this.getCharWidth(text.charAt(i));
		}
		return tWidth;
	}

	/**
	*获取最大字符宽度。
	*/
	__proto.getMaxWidth=function(){
		return this._maxWidth;
	}

	/**
	*获取最大字符高度。
	*/
	__proto.getMaxHeight=function(){
		return this.fontSize;
	}

	/**
	*@private
	*将指定的文本绘制到指定的显示对象上。
	*/
	__proto.drawText=function(text,sprite,drawX,drawY,align,width){
		var tWidth=this.getTextWidth(text);
		var tTexture;
		var dx=0;
		align==="center" && (dx=(width-tWidth)/ 2);
		align==="right" && (dx=(width-tWidth));
		var tX=0;
		for (var i=0,n=text.length;i < n;i++){
			tTexture=this.getCharTexture(text.charAt(i));
			if (tTexture){
				sprite.graphics.drawTexture(tTexture,drawX+tX+dx,drawY);
				tX+=this.getCharWidth(text.charAt(i));
			}
		}
	}

	return BitmapFont;
})()


/**
*@private
*<code>Style</code> 类是元素样式定义类。
*/
//class laya.display.css.Style
var Style=(function(){
	function Style(){
		/**透明度。*/
		this.alpha=1;
		/**表示是否显示。*/
		this.visible=true;
		/**表示滚动区域。*/
		this.scrollRect=null;
		/**混合模式。*/
		this.blendMode=null;
		/**@private */
		this._type=0;
		this.direction="ltr";
		this._tf=Style._TF_EMPTY;
	}

	__class(Style,'laya.display.css.Style');
	var __proto=Style.prototype;
	__proto.getTransform=function(){
		return this._tf;
	}

	__proto.setTransform=function(value){
		this._tf=value==='none' || !value ? Style._TF_EMPTY :value;
	}

	__proto.setTranslateX=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.translateX=value;
	}

	__proto.setTranslateY=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.translateY=value;
	}

	__proto.setScaleX=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.scaleX=value;
	}

	__proto.setScale=function(x,y){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.scaleX=x;
		this._tf.scaleY=y;
	}

	__proto.setScaleY=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.scaleY=value;
	}

	__proto.setRotate=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.rotate=value;
	}

	__proto.setSkewX=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.skewX=value;
	}

	__proto.setSkewY=function(value){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.skewY=value;
	}

	/**销毁此对象。*/
	__proto.destroy=function(){
		this.scrollRect=null;
	}

	/**@private */
	__proto.render=function(sprite,context,x,y){}
	/**@private */
	__proto.getCSSStyle=function(){
		return CSSStyle.EMPTY;
	}

	/**@private */
	__proto._enableLayout=function(){
		return false;
	}

	/**X 轴缩放值。*/
	__getset(0,__proto,'scaleX',function(){
		return this._tf.scaleX;
		},function(value){
		this.setScaleX(value);
	});

	/**元素应用的 2D 或 3D 转换的值。该属性允许我们对元素进行旋转、缩放、移动或倾斜。*/
	__getset(0,__proto,'transform',function(){
		return this.getTransform();
		},function(value){
		this.setTransform(value);
	});

	/**定义转换，只是用 X 轴的值。*/
	__getset(0,__proto,'translateX',function(){
		return this._tf.translateX;
		},function(value){
		this.setTranslateX(value);
	});

	/**定义转换，只是用 Y 轴的值。*/
	__getset(0,__proto,'translateY',function(){
		return this._tf.translateY;
		},function(value){
		this.setTranslateY(value);
	});

	/**Y 轴缩放值。*/
	__getset(0,__proto,'scaleY',function(){
		return this._tf.scaleY;
		},function(value){
		this.setScaleY(value);
	});

	/**表示元素是否显示为块级元素。*/
	__getset(0,__proto,'block',function(){
		return (this._type & 0x1)!=0;
	});

	/**定义沿着 Y 轴的 2D 倾斜转换。*/
	__getset(0,__proto,'skewY',function(){
		return this._tf.skewY;
		},function(value){
		this.setSkewY(value);
	});

	/**定义旋转角度。*/
	__getset(0,__proto,'rotate',function(){
		return this._tf.rotate;
		},function(value){
		this.setRotate(value);
	});

	/**定义沿着 X 轴的 2D 倾斜转换。*/
	__getset(0,__proto,'skewX',function(){
		return this._tf.skewX;
		},function(value){
		this.setSkewX(value);
	});

	/**表示元素的左内边距。*/
	__getset(0,__proto,'paddingLeft',function(){
		return 0;
	});

	/**表示元素的上内边距。*/
	__getset(0,__proto,'paddingTop',function(){
		return 0;
	});

	/**是否为绝对定位。*/
	__getset(0,__proto,'absolute',function(){
		return true;
	});

	Style.__init__=function(){
		Style._TF_EMPTY=new TransformInfo();
		Style.EMPTY=new Style();
	}

	Style.EMPTY=null;
	Style._TF_EMPTY=null;
	return Style;
})()


/**
*@private
*<code>Font</code> 类是字体显示定义类。
*/
//class laya.display.css.Font
var Font=(function(){
	function Font(src){
		this._type=0;
		this._weight=0;
		this._decoration=null;
		this._text=null;
		/**
		*首行缩进 （以像素为单位）。
		*/
		this.indent=0;
		this._color=Color.create(Font.defaultColor);
		this.family=Font.defaultFamily;
		this.stroke=Font._STROKE;
		this.size=Font.defaultSize;
		src && src!==Font.EMPTY && src.copyTo(this);
	}

	__class(Font,'laya.display.css.Font');
	var __proto=Font.prototype;
	/**
	*字体样式字符串。
	*/
	__proto.set=function(value){
		this._text=null;
		var strs=value.split(' ');
		for (var i=0,n=strs.length;i < n;i++){
			var str=strs[i];
			switch (str){
				case 'italic':
					this.italic=true;
					continue ;
				case 'bold':
					this.bold=true;
					continue ;
				}
			if (str.indexOf('px')> 0){
				this.size=parseInt(str);
				this.family=strs[i+1];
				i++;
				continue ;
			}
		}
	}

	/**
	*返回字体样式字符串。
	*@return 字体样式字符串。
	*/
	__proto.toString=function(){
		this._text=""
		this.italic && (this._text+="italic ");
		this.bold && (this._text+="bold ");
		return this._text+=this.size+"px "+this.family;
	}

	/**
	*将当前的属性值复制到传入的 <code>Font</code> 对象。
	*@param dec 一个 Font 对象。
	*/
	__proto.copyTo=function(dec){
		dec._type=this._type;
		dec._text=this._text;
		dec._weight=this._weight;
		dec._color=this._color;
		dec.family=this.family;
		dec.stroke=this.stroke !=Font._STROKE ? this.stroke.slice():Font._STROKE;
		dec.indent=this.indent;
		dec.size=this.size;
	}

	/**
	*表示是否为密码格式。
	*/
	__getset(0,__proto,'password',function(){
		return (this._type & 0x400)!==0;
		},function(value){
		value ? (this._type |=0x400):(this._type &=~0x400);
	});

	/**
	*表示颜色字符串。
	*/
	__getset(0,__proto,'color',function(){
		return this._color.strColor;
		},function(value){
		this._color=Color.create(value);
	});

	/**
	*表示是否为斜体。
	*/
	__getset(0,__proto,'italic',function(){
		return (this._type & 0x200)!==0;
		},function(value){
		value ? (this._type |=0x200):(this._type &=~0x200);
	});

	/**
	*表示是否为粗体。
	*/
	__getset(0,__proto,'bold',function(){
		return (this._type & 0x800)!==0;
		},function(value){
		value ? (this._type |=0x800):(this._type &=~0x800);
	});

	/**
	*文本的粗细。
	*/
	__getset(0,__proto,'weight',function(){
		return ""+this._weight;
		},function(value){
		var weight=0;
		switch (value){
			case 'normal':
				break ;
			case 'bold':
				this.bold=true;
				weight=700;
				break ;
			case 'bolder':
				weight=800;
				break ;
			case 'lighter':
				weight=100;
				break ;
			default :
				weight=parseInt(value);
			}
		this._weight=weight;
		this._text=null;
	});

	/**
	*规定添加到文本的修饰。
	*/
	__getset(0,__proto,'decoration',function(){
		return this._decoration ? this._decoration.value :null;
		},function(value){
		var strs=value.split(' ');
		this._decoration || (this._decoration={});
		switch (strs[0]){
			case '_':
				this._decoration.type='underline'
				break ;
			case '-':
				this._decoration.type='line-through'
				break ;
			case 'overline':
				this._decoration.type='overline'
				break ;
			default :
				this._decoration.type=strs[0];
			}
		strs[1] && (this._decoration.color=Color.create(strs));
		this._decoration.value=value;
	});

	Font.__init__=function(){
		Font.EMPTY=new Font(null);
	}

	Font.EMPTY=null;
	Font.defaultColor="#000000";
	Font.defaultSize=12;
	Font.defaultFamily="Arial";
	Font.defaultFont="12px Arial";
	Font._STROKE=[0,"#000000"];
	Font._ITALIC=0x200;
	Font._PASSWORD=0x400;
	Font._BOLD=0x800;
	return Font;
})()


/**
*@private
*/
//class laya.display.css.TransformInfo
var TransformInfo=(function(){
	function TransformInfo(){
		this.translateX=0;
		this.translateY=0;
		this.scaleX=1;
		this.scaleY=1;
		this.rotate=0;
		this.skewX=0;
		this.skewY=0;
	}

	__class(TransformInfo,'laya.display.css.TransformInfo');
	return TransformInfo;
})()


/**
*<code>Graphics</code> 类用于创建绘图显示对象。Graphics可以同时绘制多个位图或者矢量图，还可以结合save，restore，transform，scale，rotate，translate，alpha等指令对绘图效果进行变化。
*Graphics以命令流方式存储，可以通过cmds属性访问所有命令流。Graphics是比Sprite更轻量级的对象，合理使用能提高应用性能(比如把大量的节点绘图改为一个节点的Graphics命令集合，能减少大量节点创建消耗)。
*@see laya.display.Sprite#graphics
*/
//class laya.display.Graphics
var Graphics=(function(){
	function Graphics(){
		/**@private */
		//this._sp=null;
		/**@private */
		this._one=null;
		/**@private */
		this._cmds=null;
		/**@private */
		//this._vectorgraphArray=null;
		/**@private */
		//this._graphicBounds=null;
		this._render=this._renderEmpty;
		if (Render.isConchNode){
			var _this_=this;
			_this_._nativeObj=new (window)._conchGraphics();
			_this_.id=_this_._nativeObj.conchID;
		}
	}

	__class(Graphics,'laya.display.Graphics');
	var __proto=Graphics.prototype;
	/**
	*<p>销毁此对象。</p>
	*/
	__proto.destroy=function(){
		this.clear();
		if (this._graphicBounds)this._graphicBounds.destroy();
		this._graphicBounds=null;
		this._vectorgraphArray=null;
		this._sp && (this._sp._renderType=0);
		this._sp=null;
	}

	/**
	*<p>清空绘制命令。</p>
	*@param recoverCmds 是否回收绘图指令
	*/
	__proto.clear=function(recoverCmds){
		(recoverCmds===void 0)&& (recoverCmds=false);
		var i=0,len=0;
		if (recoverCmds){
			var tCmd=this._one;
			if (this._cmds){
				len=this._cmds.length;
				for (i=0;i < len;i++){
					tCmd=this._cmds[i];
					if (tCmd && (tCmd.callee===Render._context._drawTexture || tCmd.callee===Render._context._drawTextureWithTransform)){
						tCmd[0]=null;
						Graphics._cache.push(tCmd);
					}
				}
				this._cmds.length=0;
				}else if (tCmd){
				if (tCmd && (tCmd.callee===Render._context._drawTexture || tCmd.callee===Render._context._drawTextureWithTransform)){
					tCmd[0]=null;
					Graphics._cache.push(tCmd);
				}
			}
			}else {
			this._cmds=null;
		}
		this._one=null;
		this._render=this._renderEmpty;
		this._sp && (this._sp._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01 & ~ /*laya.renders.RenderSprite.GRAPHICS*/0x200);
		this._repaint();
		if (this._vectorgraphArray){
			for (i=0,len=this._vectorgraphArray.length;i < len;i++){
				VectorGraphManager.getInstance().deleteShape(this._vectorgraphArray[i]);
			}
			this._vectorgraphArray.length=0;
		}
	}

	/**@private */
	__proto._clearBoundsCache=function(){
		if (this._graphicBounds)this._graphicBounds.reset();
	}

	/**@private */
	__proto._initGraphicBounds=function(){
		if (!this._graphicBounds){
			this._graphicBounds=new GraphicsBounds();
			this._graphicBounds._graphics=this;
		}
	}

	/**
	*@private
	*重绘此对象。
	*/
	__proto._repaint=function(){
		this._clearBoundsCache();
		this._sp && this._sp.repaint();
	}

	/**@private */
	__proto._isOnlyOne=function(){
		return !this._cmds || this._cmds.length===0;
	}

	/**
	*获取位置及宽高信息矩阵(比较耗CPU，频繁使用会造成卡顿，尽量少用)。
	*@param realSize （可选）使用图片的真实大小，默认为false
	*@return 位置与宽高组成的 一个 Rectangle 对象。
	*/
	__proto.getBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		this._initGraphicBounds();
		return this._graphicBounds.getBounds(realSize);
	}

	/**
	*@private
	*@param realSize （可选）使用图片的真实大小，默认为false
	*获取端点列表。
	*/
	__proto.getBoundPoints=function(realSize){
		(realSize===void 0)&& (realSize=false);
		this._initGraphicBounds();
		return this._graphicBounds.getBoundPoints(realSize);
	}

	__proto._addCmd=function(a){
		this._cmds=this._cmds || [];
		a.callee=a.shift();
		this._cmds.push(a);
	}

	__proto.setFilters=function(fs){
		this._saveToCmd(Render._context._setFilters,fs);
	}

	/**
	*绘制纹理。
	*@param tex 纹理。
	*@param x （可选）X轴偏移量。
	*@param y （可选）Y轴偏移量。
	*@param width （可选）宽度。
	*@param height （可选）高度。
	*@param m （可选）矩阵信息。
	*@param alpha （可选）透明度。
	*/
	__proto.drawTexture=function(tex,x,y,width,height,m,alpha){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		(alpha===void 0)&& (alpha=1);
		if (!tex || alpha < 0.01)return null;
		if (!width)width=tex.sourceWidth;
		if (!height)height=tex.sourceHeight;
		alpha=alpha < 0 ? 0 :(alpha > 1 ? 1 :alpha);
		var offset=(!Render.isWebGL && (Browser.onFirefox || Browser.onEdge||Browser.onIE||Browser.onSafari))? 0.5 :0;
		var wRate=width / tex.sourceWidth;
		var hRate=height / tex.sourceHeight;
		width=tex.width *wRate;
		height=tex.height *hRate;
		if (tex.loaded && (width <=0 || height <=0))return null;
		x+=tex.offsetX *wRate;
		y+=tex.offsetY *hRate;
		this._sp && (this._sp._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x200);
		var args;
		x-=offset;
		y-=offset;
		width+=2 *offset;
		height+=2 *offset;
		if (Graphics._cache.length){
			args=Graphics._cache.pop();
			args[0]=tex;
			args[1]=x;
			args[2]=y;
			args[3]=width;
			args[4]=height;
			args[5]=m;
			args[6]=alpha;
			}else {
			args=[tex,x,y,width,height,m,alpha];
		}
		args.callee=(m || alpha !=1)? Render._context._drawTextureWithTransform :Render._context._drawTexture;
		if (this._one==null && !m && alpha==1){
			this._one=args;
			this._render=this._renderOneImg;
			}else {
			this._saveToCmd(args.callee,args);
		}
		if (!tex.loaded){
			tex.once(/*laya.events.Event.LOADED*/"loaded",this,this._textureLoaded,[tex,args]);
		}
		this._repaint();
		return args;
	}

	/**
	*@private 清理贴图并替换为最新的
	*@param tex
	*/
	__proto.cleanByTexture=function(tex,x,y,width,height){
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		if (!tex)return this.clear();
		if (this._one && this._render===this._renderOneImg){
			if (!width)width=tex.sourceWidth;
			if (!height)height=tex.sourceHeight;
			var wRate=width / tex.sourceWidth;
			var hRate=height / tex.sourceHeight;
			width=tex.width *wRate;
			height=tex.height *hRate;
			x+=tex.offsetX *wRate;
			y+=tex.offsetY *hRate;
			this._one[0]=tex;
			this._one[1]=x;
			this._one[2]=y;
			this._one[3]=width;
			this._one[4]=height;
			this._repaint();
			}else {
			this.clear();
			tex && this.drawTexture(tex,x,y,width,height);
		}
	}

	/**
	*批量绘制同样纹理。
	*@param tex 纹理。
	*@param pos 绘制坐标。
	*/
	__proto.drawTextures=function(tex,pos){
		if (!tex)return;
		this._saveToCmd(Render._context._drawTextures,[tex,pos]);
	}

	/**
	*用texture填充。
	*@param tex 纹理。
	*@param x X轴偏移量。
	*@param y Y轴偏移量。
	*@param width （可选）宽度。
	*@param height （可选）高度。
	*@param type （可选）填充类型 repeat|repeat-x|repeat-y|no-repeat
	*@param offset （可选）贴图纹理偏移
	*/
	__proto.fillTexture=function(tex,x,y,width,height,type,offset){
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		(type===void 0)&& (type="repeat");
		if (!tex)return;
		var args=[tex,x,y,width,height,type,offset || Point.EMPTY,{}];
		if (!tex.loaded){
			tex.once(/*laya.events.Event.LOADED*/"loaded",this,this._textureLoaded,[tex,args]);
		}
		this._saveToCmd(Render._context._fillTexture,args);
	}

	__proto._textureLoaded=function(tex,param){
		param[3]=param[3] || tex.width;
		param[4]=param[4] || tex.height;
		this._repaint();
	}

	/**
	*填充一个圆形。这是一个临时函数，以后会删除，建议用户自己实现。
	*@param x
	*@param y
	*@param tex
	*@param cx 圆心位置。
	*@param cy
	*@param radius
	*@param segNum 分段数，越大越平滑。
	*/
	__proto.fillCircle=function(x,y,tex,cx,cy,radius,segNum){
		tex.bitmap.enableMerageInAtlas=false;
		var verts=new Float32Array((segNum+1)*2);
		var uvs=new Float32Array((segNum+1)*2);
		var indices=new Uint16Array(segNum*3);
		var dang=2 *Math.PI / segNum;
		var cang=0;
		verts[0]=cx;
		verts[1]=cy;
		uvs[0]=cx / tex.width;
		uvs[1]=cy / tex.height;
		var idx=2;
		for (var i=0;i < segNum;i++){
			var px=radius *Math.cos(cang)+cx;
			var py=radius *Math.sin(cang)+cy;
			verts[idx]=px;
			verts[idx+1]=py;
			uvs[idx]=px / tex.width;
			uvs[idx+1]=py / tex.height;
			cang+=dang;
			idx+=2;
		}
		idx=0;
		for (i=0;i < segNum;i++){
			indices[idx++]=0;
			indices[idx++]=i+1;
			indices[idx++]=(i+2 >=segNum+1)?1:(i+2);
		}
		this.drawTriangles(tex,x,y,verts,uvs,indices);
	}

	/**
	*绘制一组三角形
	*@param texture 纹理。
	*@param x X轴偏移量。
	*@param y Y轴偏移量。
	*@param vertices 顶点数组。
	*@param indices 顶点索引。
	*@param uvData UV数据。
	*@param matrix 缩放矩阵。
	*@param alpha alpha
	*@param color 颜色变换
	*@param blendMode blend模式
	*/
	__proto.drawTriangles=function(texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode){
		(alpha===void 0)&& (alpha=1);
		this._saveToCmd(Render._context.drawTriangles,[texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode]);
	}

	/**
	*@private
	*保存到命令流。
	*/
	__proto._saveToCmd=function(fun,args){
		this._sp && (this._sp._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x200);
		if (this._one==null){
			this._one=args;
			this._render=this._renderOne;
			}else {
			this._sp && (this._sp._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01);
			this._render=this._renderAll;
			(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
			this._cmds.push(args);
		}
		args.callee=fun;
		this._repaint();
		return args;
	}

	/**
	*设置剪裁区域，超出剪裁区域的坐标不显示。
	*@param x X 轴偏移量。
	*@param y Y 轴偏移量。
	*@param width 宽度。
	*@param height 高度。
	*/
	__proto.clipRect=function(x,y,width,height){
		this._saveToCmd(Render._context._clipRect,[x,y,width,height]);
	}

	/**
	*在画布上绘制文本。
	*@param text 在画布上输出的文本。
	*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
	*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
	*@param font 定义字号和字体，比如"20px Arial"。
	*@param color 定义文本颜色，比如"#ff0000"。
	*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
	*/
	__proto.fillText=function(text,x,y,font,color,textAlign,underLine){
		(underLine===void 0)&& (underLine=0);
		this._saveToCmd(Render._context._fillText,[text,x,y,font || Font.defaultFont,color,textAlign]);
	}

	/**
	*在画布上绘制“被填充且镶边的”文本。
	*@param text 在画布上输出的文本。
	*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
	*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
	*@param font 定义字体和字号，比如"20px Arial"。
	*@param fillColor 定义文本颜色，比如"#ff0000"。
	*@param borderColor 定义镶边文本颜色。
	*@param lineWidth 镶边线条宽度。
	*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
	*/
	__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
		this._saveToCmd(Render._context._fillBorderText,[text,x,y,font || Font.defaultFont,fillColor,borderColor,lineWidth,textAlign]);
	}

	/**
	*在画布上绘制文本（没有填色）。文本的默认颜色是黑色。
	*@param text 在画布上输出的文本。
	*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
	*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
	*@param font 定义字体和字号，比如"20px Arial"。
	*@param color 定义文本颜色，比如"#ff0000"。
	*@param lineWidth 线条宽度。
	*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
	*/
	__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
		this._saveToCmd(Render._context._strokeText,[text,x,y,font || Font.defaultFont,color,lineWidth,textAlign]);
	}

	/**
	*设置透明度。
	*@param value 透明度。
	*/
	__proto.alpha=function(value){
		value=value < 0 ? 0 :(value > 1 ? 1 :value);
		this._saveToCmd(Render._context._alpha,[value]);
	}

	/**
	*设置当前透明度。
	*@param value 透明度。
	*/
	__proto.setAlpha=function(value){
		value=value < 0 ? 0 :(value > 1 ? 1 :value);
		this._saveToCmd(Render._context._setAlpha,[value]);
	}

	/**
	*替换绘图的当前转换矩阵。
	*@param mat 矩阵。
	*@param pivotX （可选）水平方向轴心点坐标。
	*@param pivotY （可选）垂直方向轴心点坐标。
	*/
	__proto.transform=function(matrix,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		this._saveToCmd(Render._context._transform,[matrix,pivotX,pivotY]);
	}

	/**
	*旋转当前绘图。(推荐使用transform，性能更高)
	*@param angle 旋转角度，以弧度计。
	*@param pivotX （可选）水平方向轴心点坐标。
	*@param pivotY （可选）垂直方向轴心点坐标。
	*/
	__proto.rotate=function(angle,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		this._saveToCmd(Render._context._rotate,[angle,pivotX,pivotY]);
	}

	/**
	*缩放当前绘图至更大或更小。(推荐使用transform，性能更高)
	*@param scaleX 水平方向缩放值。
	*@param scaleY 垂直方向缩放值。
	*@param pivotX （可选）水平方向轴心点坐标。
	*@param pivotY （可选）垂直方向轴心点坐标。
	*/
	__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		this._saveToCmd(Render._context._scale,[scaleX,scaleY,pivotX,pivotY]);
	}

	/**
	*重新映射画布上的 (0,0)位置。
	*@param x 添加到水平坐标（x）上的值。
	*@param y 添加到垂直坐标（y）上的值。
	*/
	__proto.translate=function(x,y){
		this._saveToCmd(Render._context._translate,[x,y]);
	}

	/**
	*保存当前环境的状态。
	*/
	__proto.save=function(){
		this._saveToCmd(Render._context._save,[]);
	}

	/**
	*返回之前保存过的路径状态和属性。
	*/
	__proto.restore=function(){
		this._saveToCmd(Render._context._restore,[]);
	}

	/**
	*@private
	*替换文本内容。
	*@param text 文本内容。
	*@return 替换成功则值为true，否则值为flase。
	*/
	__proto.replaceText=function(text){
		this._repaint();
		var cmds=this._cmds;
		if (!cmds){
			if (this._one && this._isTextCmd(this._one.callee)){
				if (this._one[0].toUpperCase)this._one[0]=text;
				else this._one[0].setText(text);
				return true;
			}
			}else {
			for (var i=cmds.length-1;i >-1;i--){
				if (this._isTextCmd(cmds[i].callee)){
					if (cmds[i][0].toUpperCase)cmds[i][0]=text;
					else cmds[i][0].setText(text);
					return true;
				}
			}
		}
		return false;
	}

	/**@private */
	__proto._isTextCmd=function(fun){
		return fun===Render._context._fillText || fun===Render._context._fillBorderText || fun===Render._context._strokeText;
	}

	/**
	*@private
	*替换文本颜色。
	*@param color 颜色。
	*/
	__proto.replaceTextColor=function(color){
		this._repaint();
		var cmds=this._cmds;
		if (!cmds){
			if (this._one && this._isTextCmd(this._one.callee)){
				this._one[4]=color;
				if (!this._one[0].toUpperCase)this._one[0].changed=true;
			}
			}else {
			for (var i=cmds.length-1;i >-1;i--){
				if (this._isTextCmd(cmds[i].callee)){
					cmds[i][4]=color;
					if (!cmds[i][0].toUpperCase)cmds[i][0].changed=true;
				}
			}
		}
	}

	/**
	*加载并显示一个图片。
	*@param url 图片地址。
	*@param x （可选）显示图片的x位置。
	*@param y （可选）显示图片的y位置。
	*@param width （可选）显示图片的宽度，设置为0表示使用图片默认宽度。
	*@param height （可选）显示图片的高度，设置为0表示使用图片默认高度。
	*@param complete （可选）加载完成回调。
	*/
	__proto.loadImage=function(url,x,y,width,height,complete){
		var _$this=this;
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		var tex=Loader.getRes(url);
		if (tex)onloaded(tex);
		else Laya.loader.load(url,Handler.create(null,onloaded),null,/*laya.net.Loader.IMAGE*/"image");
		function onloaded (tex){
			if (tex){
				_$this.drawTexture(tex,x,y,width,height);
				if (complete !=null)complete.call(_$this._sp,tex);
			}
		}
	}

	/**
	*@private
	*/
	__proto._renderEmpty=function(sprite,context,x,y){}
	/**
	*@private
	*/
	__proto._renderAll=function(sprite,context,x,y){
		var cmds=this._cmds,cmd;
		for (var i=0,n=cmds.length;i < n;i++){
			(cmd=cmds[i]).callee.call(context,x,y,cmd);
		}
	}

	/**
	*@private
	*/
	__proto._renderOne=function(sprite,context,x,y){
		this._one.callee.call(context,x,y,this._one);
	}

	/**
	*@private
	*/
	__proto._renderOneImg=function(sprite,context,x,y){
		this._one.callee.call(context,x,y,this._one);
		if (sprite._renderType!==2305){
			sprite._renderType |=/*laya.renders.RenderSprite.IMAGE*/0x01;
		}
	}

	/**
	*绘制一条线。
	*@param fromX X轴开始位置。
	*@param fromY Y轴开始位置。
	*@param toX X轴结束位置。
	*@param toY Y轴结束位置。
	*@param lineColor 颜色。
	*@param lineWidth （可选）线条宽度。
	*/
	__proto.drawLine=function(fromX,fromY,toX,toY,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		};
		var offset=lineWidth % 2===0 ? 0 :0.5;
		var arr=[fromX+offset,fromY+offset,toX+offset,toY+offset,lineColor,lineWidth,tId];
		this._saveToCmd(Render._context._drawLine,arr);
	}

	/**
	*绘制一系列线段。
	*@param x 开始绘制的X轴位置。
	*@param y 开始绘制的Y轴位置。
	*@param points 线段的点集合。格式:[x1,y1,x2,y2,x3,y3...]。
	*@param lineColor 线段颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）线段宽度。
	*/
	__proto.drawLines=function(x,y,points,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var tId=0;
		if (!points || points.length < 4)return;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		};
		var offset=lineWidth % 2===0 ? 0 :0.5;
		var arr=[x+offset,y+offset,points,lineColor,lineWidth,tId];
		this._saveToCmd(Render._context._drawLines,arr);
	}

	/**
	*绘制一系列曲线。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param points 线段的点集合，格式[startx,starty,ctrx,ctry,startx,starty...]。
	*@param lineColor 线段颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）线段宽度。
	*/
	__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var arr=[x,y,points,lineColor,lineWidth];
		this._saveToCmd(Render._context._drawCurves,arr);
	}

	/**
	*绘制矩形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param width 矩形宽度。
	*@param height 矩形高度。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var offset=lineColor ? lineWidth / 2 :0;
		var lineOffset=lineColor ? lineWidth :0;
		var arr=[x+offset,y+offset,width-lineOffset,height-lineOffset,fillColor,lineColor,lineWidth];
		this._saveToCmd(Render._context._drawRect,arr);
	}

	/**
	*绘制圆形。
	*@param x 圆点X 轴位置。
	*@param y 圆点Y 轴位置。
	*@param radius 半径。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var offset=lineColor ? lineWidth / 2 :0;
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		};
		var arr=[x,y,radius-offset,fillColor,lineColor,lineWidth,tId];
		this._saveToCmd(Render._context._drawCircle,arr);
	}

	/**
	*绘制扇形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param radius 扇形半径。
	*@param startAngle 开始角度。
	*@param endAngle 结束角度。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var offset=lineColor ? lineWidth / 2 :0;
		var lineOffset=lineColor ? lineWidth :0;
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		};
		var arr=[x+offset,y+offset,radius-lineOffset,startAngle,endAngle,fillColor,lineColor,lineWidth,tId];
		arr[3]=Utils.toRadian(startAngle);
		arr[4]=Utils.toRadian(endAngle);
		this._saveToCmd(Render._context._drawPie,arr);
	}

	/**
	*绘制多边形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param points 多边形的点集合。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawPoly=function(x,y,points,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var tId=0;
		var tIsConvexPolygon=false;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
			if (points.length > 6){
				tIsConvexPolygon=false;
				}else {
				tIsConvexPolygon=true;
			}
		};
		var offset=lineColor ? (lineWidth % 2===0 ? 0 :0.5):0;
		var arr=[x+offset,y+offset,points,fillColor,lineColor,lineWidth,tId,tIsConvexPolygon];
		this._saveToCmd(Render._context._drawPoly,arr);
	}

	/**
	*绘制路径。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param paths 路径集合，路径支持以下格式：[["moveTo",x,y],["lineTo",x,y,x,y,x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]。
	*@param brush （可选）刷子定义，支持以下设置{fillStyle}。
	*@param pen （可选）画笔定义，支持以下设置{strokeStyle,lineWidth,lineJoin,lineCap,miterLimit}。
	*/
	__proto.drawPath=function(x,y,paths,brush,pen){
		var arr=[x,y,paths,brush,pen];
		this._saveToCmd(Render._context._drawPath,arr);
	}

	__proto.setDirection=function(dir){}
	/**
	*@private
	*命令流。存储了所有绘制命令。
	*/
	__getset(0,__proto,'cmds',function(){
		return this._cmds;
		},function(value){
		this._sp && (this._sp._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x200);
		this._cmds=value;
		this._render=this._renderAll;
		this._repaint();
	});

	Graphics.__init__=function(){
		if (Render.isConchNode){
			var from=laya.display.Graphics.prototype;
			var to=Browser.window.ConchGraphics.prototype;
			var list=["setDirection","clear","destroy","alpha","rotate","transform","scale","translate","save","restore","clipRect","blendMode","fillText","fillBorderText","_fands","drawRect","drawCircle","drawPie","drawPoly","drawPath","drawImageM","drawLine","drawLines","_drawPs","drawCurves","replaceText","replaceTextColor","_fillImage","fillTexture","setSkinMesh","drawParticle","drawImageS"];
			for (var i=0,len=list.length;i <=len;i++){
				var temp=list[i];
				from[temp]=to[temp];
			}
			from._saveToCmd=null;
			if (to.drawImageS){
				from.drawTextures=function (tex,pos){
					if (!tex)return;
					if (!(tex.loaded && tex.bitmap && tex.source)){
						return;
					};
					var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
					this.drawImageS(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,tex.offsetX,tex.offsetY,tex.width,tex.height,pos);
				}
			}
			from.drawTexture=function (tex,x,y,width,height,m,alpha){
				(x===void 0)&& (x=0);
				(y===void 0)&& (y=0);
				(width===void 0)&& (width=0);
				(height===void 0)&& (height=0);
				(alpha===void 0)&& (alpha=1);
				if (!tex)return;
				if (!tex.loaded){
					tex.once(/*laya.events.Event.LOADED*/"loaded",this,function(){
						this.drawTexture(tex,x,y,width,height,m);
					});
					return;
				}
				if (!(tex.loaded && tex.bitmap && tex.source)){
					return;
				}
				if (!width)width=tex.sourceWidth;
				if (!height)height=tex.sourceHeight;
				alpha=alpha < 0 ? 0 :(alpha > 1 ? 1 :alpha);
				width=width-tex.sourceWidth+tex.width;
				height=height-tex.sourceHeight+tex.height;
				if (width <=0 || height <=0)return;
				x+=tex.offsetX;
				y+=tex.offsetY;
				var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
				if (uv[4] < uv[0] && uv[5] < uv[1]){
					this.drawImageM(tex.bitmap.source,uv[4] *w,uv[5] *h,(uv[0]-uv[4])*w,(uv[1]-uv[5])*h,x,y,width,height,m,alpha);
				}
				else {
					this.drawImageM(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x,y,width,height,m,alpha);
				}
				this._repaint();
			}
			from.fillTexture=function (tex,x,y,width,height,type,offset){
				(width===void 0)&& (width=0);
				(height===void 0)&& (height=0);
				(type===void 0)&& (type="repeat");
				if (!tex)return;
				if (tex.loaded){
					var ctxi=Render._context.ctx;
					var w=tex.bitmap.width,h=tex.bitmap.height,uv=tex.uv;
					var pat;
					if (tex.uv !=Texture.DEF_UV){
						pat=ctxi.createPattern(tex.bitmap.source,type,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h);
						}else {
						pat=ctxi.createPattern(tex.bitmap.source,type);
					};
					var sX=0,sY=0;
					if (offset){
						x+=offset.x % tex.width;
						y+=offset.y % tex.height;
						sX-=offset.x % tex.width;
						sY-=offset.y % tex.height;
					}
					this._fillImage(pat,x,y,sX,sY,width,height);
				}
			}
		}
	}

	Graphics._cache=[];
	return Graphics;
})()


/**
*@private
*Graphic bounds数据类
*/
//class laya.display.GraphicsBounds
var GraphicsBounds=(function(){
	function GraphicsBounds(){
		/**@private */
		//this._temp=null;
		/**@private */
		//this._bounds=null;
		/**@private */
		//this._rstBoundPoints=null;
		/**@private */
		this._cacheBoundsType=false;
		/**@private */
		//this._graphics=null;
	}

	__class(GraphicsBounds,'laya.display.GraphicsBounds');
	var __proto=GraphicsBounds.prototype;
	/**
	*销毁
	*/
	__proto.destroy=function(){
		this._graphics=null;
		this._temp=null;
		this._rstBoundPoints=null;
		this._bounds=null;
	}

	/**
	*重置数据
	*/
	__proto.reset=function(){
		this._temp && (this._temp.length=0);
	}

	/**
	*获取位置及宽高信息矩阵(比较耗CPU，频繁使用会造成卡顿，尽量少用)。
	*@param realSize （可选）使用图片的真实大小，默认为false
	*@return 位置与宽高组成的 一个 Rectangle 对象。
	*/
	__proto.getBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		if (!this._bounds || !this._temp || this._temp.length < 1 || realSize !=this._cacheBoundsType){
			this._bounds=Rectangle._getWrapRec(this.getBoundPoints(realSize),this._bounds)
		}
		this._cacheBoundsType=realSize;
		return this._bounds;
	}

	/**
	*@private
	*@param realSize （可选）使用图片的真实大小，默认为false
	*获取端点列表。
	*/
	__proto.getBoundPoints=function(realSize){
		(realSize===void 0)&& (realSize=false);
		if (!this._temp || this._temp.length < 1 || realSize !=this._cacheBoundsType)
			this._temp=this._getCmdPoints(realSize);
		this._cacheBoundsType=realSize;
		return this._rstBoundPoints=Utils.copyArray(this._rstBoundPoints,this._temp);
	}

	__proto._getCmdPoints=function(realSize){
		(realSize===void 0)&& (realSize=false);
		var context=Render._context;
		var cmds=this._graphics.cmds;
		var rst;
		rst=this._temp || (this._temp=[]);
		rst.length=0;
		if (!cmds && this._graphics._one !=null){
			GraphicsBounds._tempCmds.length=0;
			GraphicsBounds._tempCmds.push(this._graphics._one);
			cmds=GraphicsBounds._tempCmds;
		}
		if (!cmds)
			return rst;
		var matrixs;
		matrixs=GraphicsBounds._tempMatrixArrays;
		matrixs.length=0;
		var tMatrix=GraphicsBounds._initMatrix;
		tMatrix.identity();
		var tempMatrix=GraphicsBounds._tempMatrix;
		var cmd;
		var tex;
		var wRate=NaN;
		var hRate=NaN;
		var oWidth=NaN;
		var oHeight=NaN;
		var offX=NaN;
		var offY=NaN;
		for (var i=0,n=cmds.length;i < n;i++){
			cmd=cmds[i];
			if (!cmd.callee)continue ;
			switch (cmd.callee){
				case context._save:
				case 7:
					matrixs.push(tMatrix);
					tMatrix=tMatrix.clone();
					break ;
				case context._restore:
				case 8:
					tMatrix=matrixs.pop();
					break ;
				case context._scale:
				case 5:
					tempMatrix.identity();
					tempMatrix.translate(-cmd[2],-cmd[3]);
					tempMatrix.scale(cmd[0],cmd[1]);
					tempMatrix.translate(cmd[2],cmd[3]);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case context._rotate:
				case 3:
					tempMatrix.identity();
					tempMatrix.translate(-cmd[1],-cmd[2]);
					tempMatrix.rotate(cmd[0]);
					tempMatrix.translate(cmd[1],cmd[2]);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case context._translate:
				case 6:
					tempMatrix.identity();
					tempMatrix.translate(cmd[0],cmd[1]);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case context._transform:
				case 4:
					tempMatrix.identity();
					tempMatrix.translate(-cmd[1],-cmd[2]);
					tempMatrix.concat(cmd[0]);
					tempMatrix.translate(cmd[1],cmd[2]);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case 16:
				case 24:
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
					break ;
				case 17:
					tMatrix.copyTo(tempMatrix);
					tempMatrix.concat(cmd[4]);
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tempMatrix);
					break ;
				case context._drawTexture:
					tex=cmd[0];
					if (realSize){
						if (cmd[3] && cmd[4]){
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
							}else {
							tex=cmd[0];
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
						}
						}else {
						wRate=(cmd[3] || tex.sourceWidth)/ tex.width;
						hRate=(cmd[4] || tex.sourceHeight)/ tex.height;
						oWidth=wRate *tex.sourceWidth;
						oHeight=hRate *tex.sourceHeight;
						offX=tex.offsetX > 0 ? tex.offsetX :0;
						offY=tex.offsetY > 0 ? tex.offsetY :0;
						offX *=wRate;
						offY *=hRate;
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1]-offX,cmd[2]-offY,oWidth,oHeight),tMatrix);
					}
					break ;
				case context._fillTexture:
					if (cmd[3] && cmd[4]){
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
						}else {
						tex=cmd[0];
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
					}
					break ;
				case context._drawTextureWithTransform:;
					var drawMatrix;
					if (cmd[5]){
						tMatrix.copyTo(tempMatrix);
						tempMatrix.concat(cmd[5]);
						drawMatrix=tempMatrix;
						}else {
						drawMatrix=tMatrix;
					}
					if (realSize){
						if (cmd[3] && cmd[4]){
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),drawMatrix);
							}else {
							tex=cmd[0];
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),drawMatrix);
						}
						}else {
						tex=cmd[0];
						wRate=(cmd[3] || tex.sourceWidth)/ tex.width;
						hRate=(cmd[4] || tex.sourceHeight)/ tex.height;
						oWidth=wRate *tex.sourceWidth;
						oHeight=hRate *tex.sourceHeight;
						offX=tex.offsetX > 0 ? tex.offsetX :0;
						offY=tex.offsetY > 0 ? tex.offsetY :0;
						offX *=wRate;
						offY *=hRate;
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1]-offX,cmd[2]-offY,oWidth,oHeight),drawMatrix);
					}
					break ;
				case context._drawRect:
				case 13:
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
					break ;
				case context._drawCircle:
				case context._fillCircle:
				case 14:
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0]-cmd[2],cmd[1]-cmd[2],cmd[2]+cmd[2],cmd[2]+cmd[2]),tMatrix);
					break ;
				case context._drawLine:
				case 20:
					GraphicsBounds._tempPoints.length=0;
					var lineWidth=NaN;
					lineWidth=cmd[5] *0.5;
					if (cmd[0]==cmd[2]){
						GraphicsBounds._tempPoints.push(cmd[0]+lineWidth,cmd[1],cmd[2]+lineWidth,cmd[3],cmd[0]-lineWidth,cmd[1],cmd[2]-lineWidth,cmd[3]);
						}else if (cmd[1]==cmd[3]){
						GraphicsBounds._tempPoints.push(cmd[0],cmd[1]+lineWidth,cmd[2],cmd[3]+lineWidth,cmd[0],cmd[1]-lineWidth,cmd[2],cmd[3]-lineWidth);
						}else {
						GraphicsBounds._tempPoints.push(cmd[0],cmd[1],cmd[2],cmd[3]);
					}
					GraphicsBounds._addPointArrToRst(rst,GraphicsBounds._tempPoints,tMatrix);
					break ;
				case context._drawCurves:
				case 22:
					GraphicsBounds._addPointArrToRst(rst,Bezier.I.getBezierPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
					break ;
				case context._drawPoly:
				case context._drawLines:
				case 18:
					GraphicsBounds._addPointArrToRst(rst,cmd[2],tMatrix,cmd[0],cmd[1]);
					break ;
				case context._drawPath:
				case 19:
					GraphicsBounds._addPointArrToRst(rst,this._getPathPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
					break ;
				case context._drawPie:
				case 15:
					GraphicsBounds._addPointArrToRst(rst,this._getPiePoints(cmd[0],cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
					break ;
				}
		}
		if (rst.length > 200){
			rst=Utils.copyArray(rst,Rectangle._getWrapRec(rst)._getBoundPoints());
		}else if (rst.length > 8)
		rst=GrahamScan.scanPList(rst);
		return rst;
	}

	__proto._switchMatrix=function(tMatix,tempMatrix){
		tempMatrix.concat(tMatix);
		tempMatrix.copyTo(tMatix);
	}

	__proto._getPiePoints=function(x,y,radius,startAngle,endAngle){
		var rst=GraphicsBounds._tempPoints;
		GraphicsBounds._tempPoints.length=0;
		rst.push(x,y);
		var delta=(endAngle-startAngle)% (2 *Math.PI);
		var segnum=10;
		var step=delta / segnum;
		var i=NaN;
		var angle=startAngle;
		for (i=0;i <=segnum;i++){
			rst.push(x+radius *Math.cos(angle),y+radius *Math.sin(angle));
			angle+=step;
		}
		return rst;
	}

	__proto._getPathPoints=function(paths){
		var i=0,len=0;
		var rst=GraphicsBounds._tempPoints;
		rst.length=0;
		len=paths.length;
		var tCMD;
		for (i=0;i < len;i++){
			tCMD=paths[i];
			if (tCMD.length > 1){
				rst.push(tCMD[1],tCMD[2]);
				if (tCMD.length > 3){
					rst.push(tCMD[3],tCMD[4]);
				}
			}
		}
		return rst;
	}

	GraphicsBounds._addPointArrToRst=function(rst,points,matrix,dx,dy){
		(dx===void 0)&& (dx=0);
		(dy===void 0)&& (dy=0);
		var i=0,len=0;
		len=points.length;
		for (i=0;i < len;i+=2){
			GraphicsBounds._addPointToRst(rst,points[i]+dx,points[i+1]+dy,matrix);
		}
	}

	GraphicsBounds._addPointToRst=function(rst,x,y,matrix){
		var _tempPoint=Point.TEMP;
		_tempPoint.setTo(x ? x :0,y ? y :0);
		matrix.transformPoint(_tempPoint);
		rst.push(_tempPoint.x,_tempPoint.y);
	}

	GraphicsBounds._tempPoints=[];
	GraphicsBounds._tempMatrixArrays=[];
	GraphicsBounds._tempCmds=[];
	__static(GraphicsBounds,
	['_tempMatrix',function(){return this._tempMatrix=new Matrix();},'_initMatrix',function(){return this._initMatrix=new Matrix();}
	]);
	return GraphicsBounds;
})()


/**
*<code>Event</code> 是事件类型的集合。一般当发生事件时，<code>Event</code> 对象将作为参数传递给事件侦听器。
*/
//class laya.events.Event
var Event=(function(){
	function Event(){
		/**事件类型。*/
		//this.type=null;
		/**原生浏览器事件。*/
		//this.nativeEvent=null;
		/**事件目标触发对象。*/
		//this.target=null;
		/**事件当前冒泡对象。*/
		//this.currentTarget=null;
		/**@private */
		//this._stoped=false;
		/**分配给触摸点的唯一标识号（作为 int）。*/
		//this.touchId=0;
		/**键盘值*/
		//this.keyCode=0;
		/**滚轮滑动增量*/
		//this.delta=0;
	}

	__class(Event,'laya.events.Event');
	var __proto=Event.prototype;
	/**
	*设置事件数据。
	*@param type 事件类型。
	*@param currentTarget 事件目标触发对象。
	*@param target 事件当前冒泡对象。
	*@return 返回当前 Event 对象。
	*/
	__proto.setTo=function(type,currentTarget,target){
		this.type=type;
		this.currentTarget=currentTarget;
		this.target=target;
		return this;
	}

	/**
	*阻止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 (currentTarget)中的任何事件侦听器。
	*/
	__proto.stopPropagation=function(){
		this._stoped=true;
	}

	/**鼠标在 Stage 上的 Y 轴坐标*/
	__getset(0,__proto,'stageY',function(){
		return Laya.stage.mouseY;
	});

	/**
	*包含按下或释放的键的字符代码值。字符代码值为英文键盘值。
	*/
	__getset(0,__proto,'charCode',function(){
		return this.nativeEvent.charCode;
	});

	/**
	*触摸点列表。
	*/
	__getset(0,__proto,'touches',function(){
		var arr=this.nativeEvent.touches;
		if (arr){
			var stage=Laya.stage;
			for (var i=0,n=arr.length;i < n;i++){
				var e=arr[i];
				var point=Point.TEMP;
				point.setTo(e.clientX,e.clientY);
				stage._canvasTransform.invertTransformPoint(point);
				stage.transform.invertTransformPoint(point);
				e.stageX=point.x;
				e.stageY=point.y;
			}
		}
		return arr;
	});

	/**
	*表示键在键盘上的位置。这对于区分在键盘上多次出现的键非常有用。<br>
	*例如，您可以根据此属性的值来区分左 Shift 键和右 Shift 键：左 Shift 键的值为 KeyLocation.LEFT，右 Shift 键的值为 KeyLocation.RIGHT。另一个示例是区分标准键盘 (KeyLocation.STANDARD)与数字键盘 (KeyLocation.NUM_PAD)上按下的数字键。
	*/
	__getset(0,__proto,'keyLocation',function(){
		return this.nativeEvent.keyLocation;
	});

	/**
	*表示 Ctrl 键是处于活动状态 (true)还是非活动状态 (false)。
	*/
	__getset(0,__proto,'ctrlKey',function(){
		return this.nativeEvent.ctrlKey;
	});

	/**
	*表示 Alt 键是处于活动状态 (true)还是非活动状态 (false)。
	*/
	__getset(0,__proto,'altKey',function(){
		return this.nativeEvent.altKey;
	});

	/**
	*表示 Shift 键是处于活动状态 (true)还是非活动状态 (false)。
	*/
	__getset(0,__proto,'shiftKey',function(){
		return this.nativeEvent.shiftKey;
	});

	/**鼠标在 Stage 上的 X 轴坐标*/
	__getset(0,__proto,'stageX',function(){
		return Laya.stage.mouseX;
	});

	Event.EMPTY=new Event();
	Event.MOUSE_DOWN="mousedown";
	Event.MOUSE_UP="mouseup";
	Event.CLICK="click";
	Event.RIGHT_MOUSE_DOWN="rightmousedown";
	Event.RIGHT_MOUSE_UP="rightmouseup";
	Event.RIGHT_CLICK="rightclick";
	Event.MOUSE_MOVE="mousemove";
	Event.MOUSE_OVER="mouseover";
	Event.MOUSE_OUT="mouseout";
	Event.MOUSE_WHEEL="mousewheel";
	Event.ROLL_OVER="mouseover";
	Event.ROLL_OUT="mouseout";
	Event.DOUBLE_CLICK="doubleclick";
	Event.CHANGE="change";
	Event.CHANGED="changed";
	Event.RESIZE="resize";
	Event.ADDED="added";
	Event.REMOVED="removed";
	Event.DISPLAY="display";
	Event.UNDISPLAY="undisplay";
	Event.ERROR="error";
	Event.COMPLETE="complete";
	Event.LOADED="loaded";
	Event.PROGRESS="progress";
	Event.INPUT="input";
	Event.RENDER="render";
	Event.OPEN="open";
	Event.MESSAGE="message";
	Event.CLOSE="close";
	Event.KEY_DOWN="keydown";
	Event.KEY_PRESS="keypress";
	Event.KEY_UP="keyup";
	Event.FRAME="enterframe";
	Event.DRAG_START="dragstart";
	Event.DRAG_MOVE="dragmove";
	Event.DRAG_END="dragend";
	Event.ENTER="enter";
	Event.SELECT="select";
	Event.BLUR="blur";
	Event.FOCUS="focus";
	Event.VISIBILITY_CHANGE="visibilitychange";
	Event.FOCUS_CHANGE="focuschange";
	Event.PLAYED="played";
	Event.PAUSED="paused";
	Event.STOPPED="stopped";
	Event.START="start";
	Event.END="end";
	Event.ENABLE_CHANGED="enablechanged";
	Event.ACTIVE_IN_HIERARCHY_CHANGED="activeinhierarchychanged";
	Event.COMPONENT_ADDED="componentadded";
	Event.COMPONENT_REMOVED="componentremoved";
	Event.LAYER_CHANGED="layerchanged";
	Event.HIERARCHY_LOADED="hierarchyloaded";
	Event.RECOVERED="recovered";
	Event.RELEASED="released";
	Event.LINK="link";
	Event.LABEL="label";
	Event.FULL_SCREEN_CHANGE="fullscreenchange";
	Event.DEVICE_LOST="devicelost";
	Event.MESH_CHANGED="meshchanged";
	Event.MATERIAL_CHANGED="materialchanged";
	Event.WORLDMATRIX_NEEDCHANGE="worldmatrixneedchanged";
	Event.ANIMATION_CHANGED="animationchanged";
	Event.TRIGGER_ENTER="triggerenter";
	Event.TRIGGER_STAY="triggerstay";
	Event.TRIGGER_EXIT="triggerexit";
	Event.TRAIL_FILTER_CHANGE="trailfilterchange";
	Event.DOMINO_FILTER_CHANGE="dominofilterchange";
	return Event;
})()


/**
*<code>Keyboard</code> 类的属性是一些常数，这些常数表示控制游戏时最常用的键。
*/
//class laya.events.Keyboard
var Keyboard=(function(){
	function Keyboard(){}
	__class(Keyboard,'laya.events.Keyboard');
	Keyboard.NUMBER_0=48;
	Keyboard.NUMBER_1=49;
	Keyboard.NUMBER_2=50;
	Keyboard.NUMBER_3=51;
	Keyboard.NUMBER_4=52;
	Keyboard.NUMBER_5=53;
	Keyboard.NUMBER_6=54;
	Keyboard.NUMBER_7=55;
	Keyboard.NUMBER_8=56;
	Keyboard.NUMBER_9=57;
	Keyboard.A=65;
	Keyboard.B=66;
	Keyboard.C=67;
	Keyboard.D=68;
	Keyboard.E=69;
	Keyboard.F=70;
	Keyboard.G=71;
	Keyboard.H=72;
	Keyboard.I=73;
	Keyboard.J=74;
	Keyboard.K=75;
	Keyboard.L=76;
	Keyboard.M=77;
	Keyboard.N=78;
	Keyboard.O=79;
	Keyboard.P=80;
	Keyboard.Q=81;
	Keyboard.R=82;
	Keyboard.S=83;
	Keyboard.T=84;
	Keyboard.U=85;
	Keyboard.V=86;
	Keyboard.W=87;
	Keyboard.X=88;
	Keyboard.Y=89;
	Keyboard.Z=90;
	Keyboard.F1=112;
	Keyboard.F2=113;
	Keyboard.F3=114;
	Keyboard.F4=115;
	Keyboard.F5=116;
	Keyboard.F6=117;
	Keyboard.F7=118;
	Keyboard.F8=119;
	Keyboard.F9=120;
	Keyboard.F10=121;
	Keyboard.F11=122;
	Keyboard.F12=123;
	Keyboard.F13=124;
	Keyboard.F14=125;
	Keyboard.F15=126;
	Keyboard.NUMPAD=21;
	Keyboard.NUMPAD_0=96;
	Keyboard.NUMPAD_1=97;
	Keyboard.NUMPAD_2=98;
	Keyboard.NUMPAD_3=99;
	Keyboard.NUMPAD_4=100;
	Keyboard.NUMPAD_5=101;
	Keyboard.NUMPAD_6=102;
	Keyboard.NUMPAD_7=103;
	Keyboard.NUMPAD_8=104;
	Keyboard.NUMPAD_9=105;
	Keyboard.NUMPAD_ADD=107;
	Keyboard.NUMPAD_DECIMAL=110;
	Keyboard.NUMPAD_DIVIDE=111;
	Keyboard.NUMPAD_ENTER=108;
	Keyboard.NUMPAD_MULTIPLY=106;
	Keyboard.NUMPAD_SUBTRACT=109;
	Keyboard.SEMICOLON=186;
	Keyboard.EQUAL=187;
	Keyboard.COMMA=188;
	Keyboard.MINUS=189;
	Keyboard.PERIOD=190;
	Keyboard.SLASH=191;
	Keyboard.BACKQUOTE=192;
	Keyboard.LEFTBRACKET=219;
	Keyboard.BACKSLASH=220;
	Keyboard.RIGHTBRACKET=221;
	Keyboard.QUOTE=222;
	Keyboard.ALTERNATE=18;
	Keyboard.BACKSPACE=8;
	Keyboard.CAPS_LOCK=20;
	Keyboard.COMMAND=15;
	Keyboard.CONTROL=17;
	Keyboard.DELETE=46;
	Keyboard.ENTER=13;
	Keyboard.ESCAPE=27;
	Keyboard.PAGE_UP=33;
	Keyboard.PAGE_DOWN=34;
	Keyboard.END=35;
	Keyboard.HOME=36;
	Keyboard.LEFT=37;
	Keyboard.UP=38;
	Keyboard.RIGHT=39;
	Keyboard.DOWN=40;
	Keyboard.SHIFT=16;
	Keyboard.SPACE=32;
	Keyboard.TAB=9;
	Keyboard.INSERT=45;
	return Keyboard;
})()


/**
*<p><code>KeyBoardManager</code> 是键盘事件管理类。该类从浏览器中接收键盘事件，并派发该事件。</p>
*<p>派发事件时若 Stage.focus 为空则只从 Stage 上派发该事件，否则将从 Stage.focus 对象开始一直冒泡派发该事件。所以在 Laya.stage 上监听键盘事件一定能够收到，如果在其他地方监听，则必须处在Stage.focus的冒泡链上才能收到该事件。</p>
*<p>用户可以通过代码 Laya.stage.focus=someNode 的方式来设置focus对象。</p>
*<p>用户可统一的根据事件对象中 e.keyCode 来判断按键类型，该属性兼容了不同浏览器的实现。</p>
*/
//class laya.events.KeyBoardManager
var KeyBoardManager=(function(){
	function KeyBoardManager(){}
	__class(KeyBoardManager,'laya.events.KeyBoardManager');
	KeyBoardManager.__init__=function(){
		KeyBoardManager._addEvent("keydown");
		KeyBoardManager._addEvent("keypress");
		KeyBoardManager._addEvent("keyup");
	}

	KeyBoardManager._addEvent=function(type){
		Browser.document.addEventListener(type,function(e){
			laya.events.KeyBoardManager._dispatch(e,type);
		},true);
	}

	KeyBoardManager._dispatch=function(e,type){
		if (!KeyBoardManager.enabled)return;
		KeyBoardManager._event._stoped=false;
		KeyBoardManager._event.nativeEvent=e;
		KeyBoardManager._event.keyCode=e.keyCode || e.which || e.charCode;
		if (type==="keydown")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=true;
		else if (type==="keyup")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=null;
		var target=(Laya.stage.focus && (Laya.stage.focus.event !=null)&& Laya.stage.focus.displayedInStage)? Laya.stage.focus :Laya.stage;
		var ct=target;
		while (ct){
			ct.event(type,KeyBoardManager._event.setTo(type,ct,target));
			ct=ct.parent;
		}
	}

	KeyBoardManager.hasKeyDown=function(key){
		return KeyBoardManager._pressKeys[key];
	}

	KeyBoardManager._pressKeys={};
	KeyBoardManager.enabled=true;
	__static(KeyBoardManager,
	['_event',function(){return this._event=new Event();}
	]);
	return KeyBoardManager;
})()


/**
*<p><code>KeyLocation</code> 类包含表示在键盘或类似键盘的输入设备上按键位置的常量。</p>
*<p><code>KeyLocation</code> 常数用在键盘事件对象的 <code>keyLocation </code>属性中。</p>
*/
//class laya.events.KeyLocation
var KeyLocation=(function(){
	function KeyLocation(){}
	__class(KeyLocation,'laya.events.KeyLocation');
	KeyLocation.STANDARD=0;
	KeyLocation.LEFT=1;
	KeyLocation.RIGHT=2;
	KeyLocation.NUM_PAD=3;
	return KeyLocation;
})()


/**
*<p><code>MouseManager</code> 是鼠标、触摸交互管理器。</p>
*<p>鼠标事件流包括捕获阶段、目标阶段、冒泡阶段。<br/>
*捕获阶段：此阶段引擎会从stage开始递归检测stage及其子对象，直到找到命中的目标对象或者未命中任何对象；<br/>
*目标阶段：找到命中的目标对象；<br/>
*冒泡阶段：事件离开目标对象，按节点层级向上逐层通知，直到到达舞台的过程。</p>
*/
//class laya.events.MouseManager
var MouseManager=(function(){
	function MouseManager(){
		/**canvas 上的鼠标X坐标。*/
		this.mouseX=0;
		/**canvas 上的鼠标Y坐标。*/
		this.mouseY=0;
		/**是否禁用除 stage 以外的鼠标事件检测。*/
		this.disableMouseEvent=false;
		/**鼠标按下的时间。单位为毫秒。*/
		this.mouseDownTime=0;
		/**鼠标移动精度。*/
		this.mouseMoveAccuracy=2;
		this._stage=null;
		this._target=null;
		this._lastMoveTimer=0;
		this._isLeftMouse=false;
		this._eventList=[];
		this._touchIDs={};
		this._id=1;
		this._tTouchID=0;
		this._event=new Event();
		this._matrix=new Matrix();
		this._point=new Point();
		this._rect=new Rectangle();
		this._prePoint=new Point();
		this._curTouchID=NaN;
	}

	__class(MouseManager,'laya.events.MouseManager');
	var __proto=MouseManager.prototype;
	/**
	*@private
	*初始化。
	*/
	__proto.__init__=function(stage,canvas){
		var _$this=this;
		this._stage=stage;
		var _this=this;
		var list=this._eventList;
		canvas.oncontextmenu=function (e){
			if (MouseManager.enabled)return false;
		}
		canvas.addEventListener('mousedown',function(e){
			if (MouseManager.enabled){
				if(!Browser.onIE)e.preventDefault();
				list.push(e);
				_this.mouseDownTime=Browser.now();
			}
		});
		canvas.addEventListener('mouseup',function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				list.push(e);
				_this.mouseDownTime=-Browser.now();
			}
		},true);
		canvas.addEventListener('mousemove',function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				var now=Browser.now();
				if (now-_this._lastMoveTimer < 10)return;
				_this._lastMoveTimer=now;
				list.push(e);
			}
		},true);
		canvas.addEventListener("mouseout",function(e){
			if (MouseManager.enabled)list.push(e);
		})
		canvas.addEventListener("mouseover",function(e){
			if (MouseManager.enabled)list.push(e);
		})
		canvas.addEventListener("touchstart",function(e){
			if (MouseManager.enabled){
				list.push(e);
				if (!MouseManager._isFirstTouch&&!Input.isInputting)e.preventDefault();
				_this.mouseDownTime=Browser.now();
			}
		});
		canvas.addEventListener("touchend",function(e){
			if (MouseManager.enabled){
				if (!MouseManager._isFirstTouch&&!Input.isInputting)e.preventDefault();
				MouseManager._isFirstTouch=false;
				list.push(e);
				_this.mouseDownTime=-Browser.now();
				}else {
				_$this._curTouchID=NaN;
			}
		},true);
		canvas.addEventListener("touchmove",function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				list.push(e);
			}
		},true);
		canvas.addEventListener("touchcancel",function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				list.push(e);
				}else {
				_$this._curTouchID=NaN;
			}
		},true);
		canvas.addEventListener('mousewheel',function(e){
			if (MouseManager.enabled)list.push(e);
		});
		canvas.addEventListener('DOMMouseScroll',function(e){
			if (MouseManager.enabled)list.push(e);
		});
	}

	__proto.initEvent=function(e,nativeEvent){
		var _this=this;
		_this._event._stoped=false;
		_this._event.nativeEvent=nativeEvent || e;
		_this._target=null;
		this._point.setTo(e.pageX || e.clientX,e.pageY || e.clientY);
		this._stage._canvasTransform.invertTransformPoint(this._point);
		_this.mouseX=this._point.x;
		_this.mouseY=this._point.y;
		_this._event.touchId=e.identifier || 0;
		this._tTouchID=_this._event.touchId;
		var evt;
		evt=TouchManager.I._event;
		evt._stoped=false;
		evt.nativeEvent=_this._event.nativeEvent;
		evt.touchId=_this._event.touchId;
	}

	__proto.checkMouseWheel=function(e){
		this._event.delta=e.wheelDelta ? e.wheelDelta *0.025 :-e.detail;
		var _lastOvers=TouchManager.I.getLastOvers();
		for (var i=0,n=_lastOvers.length;i < n;i++){
			var ele=_lastOvers[i];
			ele.event(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this._event.setTo(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",ele,this._target));
		}
	}

	// _stage.event(Event.MOUSE_WHEEL,_event.setTo(Event.MOUSE_WHEEL,_stage,_target));
	__proto.onMouseMove=function(ele){
		TouchManager.I.onMouseMove(ele,this._tTouchID);
	}

	__proto.onMouseDown=function(ele){
		if (Input.isInputting && Laya.stage.focus && Laya.stage.focus["focus"] && !Laya.stage.focus.contains(this._target)){
			var pre_input=Laya.stage.focus['_tf'] || Laya.stage.focus;
			var new_input=ele['_tf'] || ele;
			if ((new_input instanceof laya.display.Input )&& new_input.multiline==pre_input.multiline)
				pre_input['_focusOut']();
			else
			pre_input.focus=false;
		}
		TouchManager.I.onMouseDown(ele,this._tTouchID,this._isLeftMouse);
	}

	__proto.onMouseUp=function(ele){
		TouchManager.I.onMouseUp(ele,this._tTouchID,this._isLeftMouse);
	}

	__proto.check=function(sp,mouseX,mouseY,callBack){
		this._point.setTo(mouseX,mouseY);
		sp.fromParentPoint(this._point);
		mouseX=this._point.x;
		mouseY=this._point.y;
		var scrollRect=sp.scrollRect;
		if (scrollRect){
			this._rect.setTo(scrollRect.x,scrollRect.y,scrollRect.width,scrollRect.height);
			if (!this._rect.contains(mouseX,mouseY))return false;
		}
		if (!this.disableMouseEvent){
			if (sp.hitTestPrior && !sp.mouseThrough && !this.hitTest(sp,mouseX,mouseY)){
				return false;
			}
			for (var i=sp._childs.length-1;i >-1;i--){
				var child=sp._childs[i];
				if (!child.destroyed && child.mouseEnabled && child.visible){
					if (this.check(child,mouseX,mouseY,callBack))return true;
				}
			}
		};
		var isHit=(sp.hitTestPrior && !sp.mouseThrough && !this.disableMouseEvent)? true :this.hitTest(sp,mouseX,mouseY);
		if (isHit){
			this._target=sp;
			callBack.call(this,sp);
			}else if (callBack===this.onMouseUp && sp===this._stage){
			this._target=this._stage;
			callBack.call(this,this._target);
		}
		return isHit;
	}

	__proto.hitTest=function(sp,mouseX,mouseY){
		var isHit=false;
		if (sp.scrollRect){
			mouseX-=sp.scrollRect.x;
			mouseY-=sp.scrollRect.y;
		}
		if ((sp.hitArea instanceof laya.utils.HitArea )){
			return sp.hitArea.isHit(mouseX,mouseY);
		}
		if (sp.width > 0 && sp.height > 0 || sp.mouseThrough || sp.hitArea){
			if (!sp.mouseThrough){
				var hitRect=this._rect;
				if (sp.hitArea)hitRect=sp.hitArea;
				else hitRect.setTo(0,0,sp.width,sp.height);
				isHit=hitRect.contains(mouseX,mouseY);
				}else {
				isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
			}
		}
		return isHit;
	}

	/**
	*执行事件处理。
	*/
	__proto.runEvent=function(){
		var len=this._eventList.length;
		if (!len)return;
		var _this=this;
		var i=0,j=0,n=0,touch;
		while (i < len){
			var evt=this._eventList[i];
			if (evt.type!=='mousemove')this._prePoint.x=this._prePoint.y=-1000000;
			switch (evt.type){
				case 'mousedown':
					this._touchIDs[0]=this._id++;
					if (!MouseManager._isTouchRespond){
						_this._isLeftMouse=evt.button===0;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
					}else
					MouseManager._isTouchRespond=false;
					break ;
				case 'mouseup':
					_this._isLeftMouse=evt.button===0;
					_this.initEvent(evt);
					_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
					break ;
				case 'mousemove':
					if ((Math.abs(this._prePoint.x-evt.clientX)+Math.abs(this._prePoint.y-evt.clientY))>=this.mouseMoveAccuracy){
						this._prePoint.x=evt.clientX;
						this._prePoint.y=evt.clientY;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
					}
					break ;
				case "touchstart":
					MouseManager._isTouchRespond=true;
					_this._isLeftMouse=true;
					var touches=evt.changedTouches;
					for (j=0,n=touches.length;j < n;j++){
						touch=touches[j];
						if (MouseManager.multiTouchEnabled || isNaN(this._curTouchID)){
							this._curTouchID=touch.identifier;
							if (this._id % 200===0)this._touchIDs={};
							this._touchIDs[touch.identifier]=this._id++;
							_this.initEvent(touch,evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}
					}
					break ;
				case "touchend":
				case "touchcancel":
					MouseManager._isTouchRespond=true;
					_this._isLeftMouse=true;
					var touchends=evt.changedTouches;
					for (j=0,n=touchends.length;j < n;j++){
						touch=touchends[j];
						if (MouseManager.multiTouchEnabled || touch.identifier==this._curTouchID){
							this._curTouchID=NaN;
							_this.initEvent(touch,evt);
							var isChecked=false;
							isChecked=_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
							if (!isChecked){
								_this.onMouseUp(null);
							}
						}
					}
					break ;
				case "touchmove":;
					var touchemoves=evt.changedTouches;
					for (j=0,n=touchemoves.length;j < n;j++){
						touch=touchemoves[j];
						if (MouseManager.multiTouchEnabled || touch.identifier==this._curTouchID){
							_this.initEvent(touch,evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						}
					}
					break ;
				case "wheel":
				case "mousewheel":
				case "DOMMouseScroll":
					_this.checkMouseWheel(evt);
					break ;
				case "mouseout":
					TouchManager.I.stageMouseOut();
					break ;
				case "mouseover":
					_this._stage.event(/*laya.events.Event.MOUSE_OVER*/"mouseover",_this._event.setTo(/*laya.events.Event.MOUSE_OVER*/"mouseover",_this._stage,_this._stage));
					break ;
				}
			i++;
		}
		this._eventList.length=0;
	}

	MouseManager.enabled=true;
	MouseManager.multiTouchEnabled=true;
	MouseManager._isTouchRespond=false;
	MouseManager._isFirstTouch=true;
	__static(MouseManager,
	['instance',function(){return this.instance=new MouseManager();}
	]);
	return MouseManager;
})()


/**
*@private
*Touch事件管理类，处理多点触控下的鼠标事件
*/
//class laya.events.TouchManager
var TouchManager=(function(){
	function TouchManager(){
		/**
		*当前over的touch表
		*/
		this.preOvers=[];
		/**
		*当前down的touch表
		*/
		this.preDowns=[];
		this.preRightDowns=[];
		/**
		*是否启用
		*/
		this.enable=true;
		this._lastClickTime=0;
		this._event=new Event();
	}

	__class(TouchManager,'laya.events.TouchManager');
	var __proto=TouchManager.prototype;
	__proto._clearTempArrs=function(){
		TouchManager._oldArr.length=0;
		TouchManager._newArr.length=0;
		TouchManager._tEleArr.length=0;
	}

	/**
	*从touch表里查找对应touchID的数据
	*@param touchID touch ID
	*@param arr touch表
	*@return
	*
	*/
	__proto.getTouchFromArr=function(touchID,arr){
		var i=0,len=0;
		len=arr.length;
		var tTouchO;
		for (i=0;i < len;i++){
			tTouchO=arr[i];
			if (tTouchO.id==touchID){
				return tTouchO;
			}
		}
		return null;
	}

	/**
	*从touch表里移除一个元素
	*@param touchID touch ID
	*@param arr touch表
	*
	*/
	__proto.removeTouchFromArr=function(touchID,arr){
		var i=0;
		for (i=arr.length-1;i >=0;i--){
			if (arr[i].id==touchID){
				arr.splice(i,1);
			}
		}
	}

	/**
	*创建一个touch数据
	*@param ele 当前的根节点
	*@param touchID touchID
	*@return
	*
	*/
	__proto.createTouchO=function(ele,touchID){
		var rst;
		rst=Pool.getItem("TouchData")|| {};
		rst.id=touchID;
		rst.tar=ele;
		return rst;
	}

	/**
	*处理touchStart
	*@param ele 根节点
	*@param touchID touchID
	*@param isLeft （可选）是否为左键
	*/
	__proto.onMouseDown=function(ele,touchID,isLeft){
		(isLeft===void 0)&& (isLeft=false);
		if (!this.enable)
			return;
		var preO;
		var tO;
		var arrs;
		preO=this.getTouchFromArr(touchID,this.preOvers);
		arrs=this.getEles(ele,null,TouchManager._tEleArr);
		if (!preO){
			tO=this.createTouchO(ele,touchID);
			this.preOvers.push(tO);
			}else {
			preO.tar=ele;
		}
		if (Browser.onMobile)
			this.sendEvents(arrs,/*laya.events.Event.MOUSE_OVER*/"mouseover");
		var preDowns;
		preDowns=isLeft ? this.preDowns :this.preRightDowns;
		preO=this.getTouchFromArr(touchID,preDowns);
		if (!preO){
			tO=this.createTouchO(ele,touchID);
			preDowns.push(tO);
			}else {
			preO.tar=ele;
		}
		this.sendEvents(arrs,isLeft ? /*laya.events.Event.MOUSE_DOWN*/"mousedown" :/*laya.events.Event.RIGHT_MOUSE_DOWN*/"rightmousedown");
		this._clearTempArrs();
	}

	/**
	*派发事件。
	*@param eles 对象列表。
	*@param type 事件类型。
	*/
	__proto.sendEvents=function(eles,type){
		var i=0,len=0;
		len=eles.length;
		this._event._stoped=false;
		var _target;
		_target=eles[0];
		var tE;
		for (i=0;i < len;i++){
			tE=eles[i];
			if (tE.destroyed)return;
			tE.event(type,this._event.setTo(type,tE,_target));
			if (this._event._stoped)
				break ;
		}
	}

	/**
	*获取对象列表。
	*@param start 起始节点。
	*@param end 结束节点。
	*@param rst 返回值。如果此值不为空，则将其赋值为计算结果，从而避免创建新数组；如果此值为空，则创建新数组返回。
	*@return Array 返回节点列表。
	*/
	__proto.getEles=function(start,end,rst){
		if (!rst){
			rst=[];
			}else {
			rst.length=0;
		}
		while (start && start !=end){
			rst.push(start);
			start=start.parent;
		}
		return rst;
	}

	/**
	*touchMove时处理out事件和over时间。
	*@param eleNew 新的根节点。
	*@param elePre 旧的根节点。
	*@param touchID （可选）touchID，默认为0。
	*/
	__proto.checkMouseOutAndOverOfMove=function(eleNew,elePre,touchID){
		(touchID===void 0)&& (touchID=0);
		if (elePre==eleNew)
			return;
		var tar;
		var arrs;
		var i=0,len=0;
		if (elePre.contains(eleNew)){
			arrs=this.getEles(eleNew,elePre,TouchManager._tEleArr);
			this.sendEvents(arrs,/*laya.events.Event.MOUSE_OVER*/"mouseover");
			}else if (eleNew.contains(elePre)){
			arrs=this.getEles(elePre,eleNew,TouchManager._tEleArr);
			this.sendEvents(arrs,/*laya.events.Event.MOUSE_OUT*/"mouseout");
			}else {
			arrs=TouchManager._tEleArr;
			arrs.length=0;
			var oldArr;
			oldArr=this.getEles(elePre,null,TouchManager._oldArr);
			var newArr;
			newArr=this.getEles(eleNew,null,TouchManager._newArr);
			len=oldArr.length;
			var tIndex=0;
			for (i=0;i < len;i++){
				tar=oldArr[i];
				tIndex=newArr.indexOf(tar);
				if (tIndex >=0){
					newArr.splice(tIndex,newArr.length-tIndex);
					break ;
					}else {
					arrs.push(tar);
				}
			}
			if (arrs.length > 0){
				this.sendEvents(arrs,/*laya.events.Event.MOUSE_OUT*/"mouseout");
			}
			if (newArr.length > 0){
				this.sendEvents(newArr,/*laya.events.Event.MOUSE_OVER*/"mouseover");
			}
		}
	}

	/**
	*处理TouchMove事件
	*@param ele 根节点
	*@param touchID touchID
	*
	*/
	__proto.onMouseMove=function(ele,touchID){
		if (!this.enable)
			return;
		var preO;
		preO=this.getTouchFromArr(touchID,this.preOvers);
		var arrs;
		var tO;
		if (!preO){
			arrs=this.getEles(ele,null,TouchManager._tEleArr);
			this.sendEvents(arrs,/*laya.events.Event.MOUSE_OVER*/"mouseover");
			this.preOvers.push(this.createTouchO(ele,touchID));
			}else {
			this.checkMouseOutAndOverOfMove(ele,preO.tar);
			preO.tar=ele;
			arrs=this.getEles(ele,null,TouchManager._tEleArr);
		}
		this.sendEvents(arrs,/*laya.events.Event.MOUSE_MOVE*/"mousemove");
		this._clearTempArrs();
	}

	__proto.getLastOvers=function(){
		TouchManager._tEleArr.length=0;
		if (this.preOvers.length > 0 && this.preOvers[0].tar){
			return this.getEles(this.preOvers[0].tar,null,TouchManager._tEleArr);
		}
		TouchManager._tEleArr.push(Laya.stage);
		return TouchManager._tEleArr;
	}

	__proto.stageMouseOut=function(){
		var lastOvers;
		lastOvers=this.getLastOvers();
		this.preOvers.length=0;
		this.sendEvents(lastOvers,/*laya.events.Event.MOUSE_OUT*/"mouseout");
	}

	/**
	*处理TouchEnd事件
	*@param ele 根节点
	*@param touchID touchID
	*@param isLeft 是否为左键
	*/
	__proto.onMouseUp=function(ele,touchID,isLeft){
		(isLeft===void 0)&& (isLeft=false);
		if (!this.enable)
			return;
		var preO;
		var tO;
		var arrs;
		var oldArr;
		var i=0,len=0;
		var tar;
		var sendArr;
		var onMobile=Browser.onMobile;
		arrs=this.getEles(ele,null,TouchManager._tEleArr);
		this.sendEvents(arrs,isLeft ? /*laya.events.Event.MOUSE_UP*/"mouseup" :/*laya.events.Event.RIGHT_MOUSE_UP*/"rightmouseup");
		var preDowns;
		preDowns=isLeft ? this.preDowns :this.preRightDowns;
		preO=this.getTouchFromArr(touchID,preDowns);
		if (!preO){
			}else {
			var isDouble=false;
			var now=Browser.now();
			isDouble=now-this._lastClickTime < 300;
			this._lastClickTime=now;
			if (ele==preO.tar){
				sendArr=arrs;
				}else {
				oldArr=this.getEles(preO.tar,null,TouchManager._oldArr);
				sendArr=TouchManager._newArr;
				sendArr.length=0;
				len=oldArr.length;
				for (i=0;i < len;i++){
					tar=oldArr[i];
					if (arrs.indexOf(tar)>=0){
						sendArr.push(tar);
					}
				}
			}
			if (sendArr.length > 0){
				this.sendEvents(sendArr,isLeft ? /*laya.events.Event.CLICK*/"click" :/*laya.events.Event.RIGHT_CLICK*/"rightclick");
			}
			if (isLeft && isDouble){
				this.sendEvents(sendArr,/*laya.events.Event.DOUBLE_CLICK*/"doubleclick");
			}
			this.removeTouchFromArr(touchID,preDowns);
			preO.tar=null;
			Pool.recover("TouchData",preO);
		}
		preO=this.getTouchFromArr(touchID,this.preOvers);
		if (!preO){
			}else {
			if (onMobile){
				sendArr=this.getEles(preO.tar,null,sendArr);
				if (sendArr && sendArr.length > 0){
					this.sendEvents(sendArr,/*laya.events.Event.MOUSE_OUT*/"mouseout");
				}
				this.removeTouchFromArr(touchID,this.preOvers);
				preO.tar=null;
				Pool.recover("TouchData",preO);
			}
		}
		this._clearTempArrs();
	}

	TouchManager._oldArr=[];
	TouchManager._newArr=[];
	TouchManager._tEleArr=[];
	__static(TouchManager,
	['I',function(){return this.I=new TouchManager();}
	]);
	return TouchManager;
})()


/**
*<code>Filter</code> 是滤镜基类。
*/
//class laya.filters.Filter
var Filter=(function(){
	function Filter(){
		/**@private */
		this._action=null;
	}

	__class(Filter,'laya.filters.Filter');
	var __proto=Filter.prototype;
	Laya.imps(__proto,{"laya.filters.IFilter":true})
	/**@private */
	__proto.callNative=function(sp){}
	/**@private 滤镜类型。*/
	__getset(0,__proto,'type',function(){return-1});
	/**@private 滤镜动作。*/
	__getset(0,__proto,'action',function(){return this._action });
	Filter.BLUR=0x10;
	Filter.COLOR=0x20;
	Filter.GLOW=0x08;
	Filter._filterStart=null;
	Filter._filterEnd=null;
	Filter._EndTarget=null;
	Filter._recycleScope=null;
	Filter._filter=null;
	Filter._useSrc=null;
	Filter._endSrc=null;
	Filter._useOut=null;
	Filter._endOut=null;
	return Filter;
})()


/**
*@private
*<code>ColorFilterAction</code> 是一个颜色滤镜应用类。
*/
//class laya.filters.ColorFilterAction
var ColorFilterAction=(function(){
	function ColorFilterAction(){
		this.data=null;
	}

	__class(ColorFilterAction,'laya.filters.ColorFilterAction');
	var __proto=ColorFilterAction.prototype;
	Laya.imps(__proto,{"laya.filters.IFilterAction":true})
	/**
	*给指定的对象应用颜色滤镜。
	*@param srcCanvas 需要应用画布对象。
	*@return 应用了滤镜后的画布对象。
	*/
	__proto.apply=function(srcCanvas){
		var ctx=srcCanvas.ctx.ctx;
		var canvas=srcCanvas.ctx.ctx.canvas;
		if (canvas.width==0 || canvas.height==0)return canvas;
		var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
		var data=imgdata.data;
		var nData;
		for (var i=0,n=data.length;i < n;i+=4){
			nData=this.getColor(data[i],data[i+1],data[i+2],data[i+3]);
			if (data[i+3]==0)continue ;
			data[i]=nData[0];
			data[i+1]=nData[1];
			data[i+2]=nData[2];
			data[i+3]=nData[3];
		}
		ctx.putImageData(imgdata,0,0);
		return srcCanvas;
	}

	__proto.getColor=function(red,green,blue,alpha){
		var rst=[];
		if (this.data._mat && this.data._alpha){
			var mat=this.data._mat;
			var tempAlpha=this.data._alpha;
			rst[0]=mat[0] *red+mat[1] *green+mat[2] *blue+mat[3] *alpha+tempAlpha[0];
			rst[1]=mat[4] *red+mat[5] *green+mat[6] *blue+mat[7] *alpha+tempAlpha[1];
			rst[2]=mat[8] *red+mat[9] *green+mat[10] *blue+mat[11] *alpha+tempAlpha[2];
			rst[3]=mat[12] *red+mat[13] *green+mat[14] *blue+mat[15] *alpha+tempAlpha[3];
		}
		return rst;
	}

	return ColorFilterAction;
})()


/**
*@private
*/
//class laya.maths.Arith
var Arith=(function(){
	function Arith(){}
	__class(Arith,'laya.maths.Arith');
	Arith.formatR=function(r){
		if (r > Math.PI)r-=Math.PI *2;
		if (r <-Math.PI)r+=Math.PI *2;
		return r;
	}

	Arith.isPOT=function(w,h){
		return (w > 0 && (w & (w-1))===0 && h > 0 && (h & (h-1))===0);
	}

	Arith.setMatToArray=function(mat,array){
		mat.a,mat.b,0,0,mat.c,mat.d,0,0,0,0,1,0,mat.tx+20,mat.ty+20,0,1
		array[0]=mat.a;
		array[1]=mat.b;
		array[4]=mat.c;
		array[5]=mat.d;
		array[12]=mat.tx;
		array[13]=mat.ty;
	}

	return Arith;
})()


/**
*@private
*计算贝塞尔曲线的工具类。
*/
//class laya.maths.Bezier
var Bezier=(function(){
	function Bezier(){
		/**@private */
		this._controlPoints=[new Point(),new Point(),new Point()];
		this._calFun=this.getPoint2;
	}

	__class(Bezier,'laya.maths.Bezier');
	var __proto=Bezier.prototype;
	/**@private */
	__proto._switchPoint=function(x,y){
		var tPoint=this._controlPoints.shift();
		tPoint.setTo(x,y);
		this._controlPoints.push(tPoint);
	}

	/**
	*计算二次贝塞尔点。
	*@param t
	*@param rst
	*
	*/
	__proto.getPoint2=function(t,rst){
		var p1=this._controlPoints[0];
		var p2=this._controlPoints[1];
		var p3=this._controlPoints[2];
		var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
		var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
		rst.push(lineX,lineY);
	}

	/**
	*计算三次贝塞尔点
	*@param t
	*@param rst
	*
	*/
	__proto.getPoint3=function(t,rst){
		var p1=this._controlPoints[0];
		var p2=this._controlPoints[1];
		var p3=this._controlPoints[2];
		var p4=this._controlPoints[3];
		var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
		var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
		rst.push(lineX,lineY);
	}

	/**
	*计算贝塞尔点序列
	*@param count
	*@param rst
	*
	*/
	__proto.insertPoints=function(count,rst){
		var i=NaN;
		count=count > 0 ? count :5;
		var dLen=NaN;
		dLen=1 / count;
		for (i=0;i <=1;i+=dLen){
			this._calFun(i,rst);
		}
	}

	/**
	*获取贝塞尔曲线上的点。
	*@param pList 控制点[x0,y0,x1,y1...]
	*@param inSertCount 每次曲线的插值数量
	*@return
	*
	*/
	__proto.getBezierPoints=function(pList,inSertCount,count){
		(inSertCount===void 0)&& (inSertCount=5);
		(count===void 0)&& (count=2);
		var i=0,len=0;
		len=pList.length;
		if (len < (count+1)*2)return [];
		var rst;
		rst=[];
		switch (count){
			case 2:
				this._calFun=this.getPoint2;
				break ;
			case 3:
				this._calFun=this.getPoint3;
				break ;
			default :
				return [];
			}
		while (this._controlPoints.length <=count){
			this._controlPoints.push(new Point());
		}
		for (i=0;i < count *2;i+=2){
			this._switchPoint(pList[i],pList[i+1]);
		}
		for (i=count *2;i < len;i+=2){
			this._switchPoint(pList[i],pList[i+1]);
			if ((i / 2)% count==0)
				this.insertPoints(inSertCount,rst);
		}
		return rst;
	}

	__static(Bezier,
	['I',function(){return this.I=new Bezier();}
	]);
	return Bezier;
})()


/**
*@private
*凸包算法。
*/
//class laya.maths.GrahamScan
var GrahamScan=(function(){
	function GrahamScan(){}
	__class(GrahamScan,'laya.maths.GrahamScan');
	GrahamScan.multiply=function(p1,p2,p0){
		return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
	}

	GrahamScan.dis=function(p1,p2){
		return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
	}

	GrahamScan._getPoints=function(count,tempUse,rst){
		(tempUse===void 0)&& (tempUse=false);
		if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
		while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
		if (!rst)rst=[];
		rst.length=0;
		if (tempUse){
			GrahamScan.getFrom(rst,GrahamScan._mPointList,count);
			}else {
			GrahamScan.getFromR(rst,GrahamScan._mPointList,count);
		}
		return rst;
	}

	GrahamScan.getFrom=function(rst,src,count){
		var i=0;
		for (i=0;i < count;i++){
			rst.push(src[i]);
		}
		return rst;
	}

	GrahamScan.getFromR=function(rst,src,count){
		var i=0;
		for (i=0;i < count;i++){
			rst.push(src.pop());
		}
		return rst;
	}

	GrahamScan.pListToPointList=function(pList,tempUse){
		(tempUse===void 0)&& (tempUse=false);
		var i=0,len=pList.length / 2,rst=GrahamScan._getPoints(len,tempUse,GrahamScan._tempPointList);
		for (i=0;i < len;i++){
			rst[i].setTo(pList[i+i],pList[i+i+1]);
		}
		return rst;
	}

	GrahamScan.pointListToPlist=function(pointList){
		var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
		rst.length=0;
		for (i=0;i < len;i++){
			tPoint=pointList[i];
			rst.push(tPoint.x,tPoint.y);
		}
		return rst;
	}

	GrahamScan.scanPList=function(pList){
		return Utils.copyArray(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
	}

	GrahamScan.scan=function(PointSet){
		var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
		var _tmpDic={};
		var key;
		ch=GrahamScan._temArr;
		ch.length=0;
		n=PointSet.length;
		for (i=n-1;i >=0;i--){
			tmp=PointSet[i];
			key=tmp.x+"_"+tmp.y;
			if (!_tmpDic.hasOwnProperty(key)){
				_tmpDic[key]=true;
				ch.push(tmp);
			}
		}
		n=ch.length;
		Utils.copyArray(PointSet,ch);
		for (i=1;i < n;i++)
		if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
			k=i;
		tmp=PointSet[0];
		PointSet[0]=PointSet[k];
		PointSet[k]=tmp;
		for (i=1;i < n-1;i++){
			k=i;
			for (j=i+1;j < n;j++)
			if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
				k=j;
			tmp=PointSet[i];
			PointSet[i]=PointSet[k];
			PointSet[k]=tmp;
		}
		ch=GrahamScan._temArr;
		ch.length=0;
		if (PointSet.length < 3){
			return Utils.copyArray(ch,PointSet);
		}
		ch.push(PointSet[0],PointSet[1],PointSet[2]);
		for (i=3;i < n;i++){
			while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
			PointSet[i] && ch.push(PointSet[i]);
		}
		return ch;
	}

	GrahamScan._mPointList=null;
	GrahamScan._tempPointList=[];
	GrahamScan._temPList=[];
	GrahamScan._temArr=[];
	return GrahamScan;
})()


/**
*@private
*<code>MathUtil</code> 是一个数据处理工具类。
*/
//class laya.maths.MathUtil
var MathUtil=(function(){
	function MathUtil(){}
	__class(MathUtil,'laya.maths.MathUtil');
	MathUtil.subtractVector3=function(l,r,o){
		o[0]=l[0]-r[0];
		o[1]=l[1]-r[1];
		o[2]=l[2]-r[2];
	}

	MathUtil.lerp=function(left,right,amount){
		return left *(1-amount)+right *amount;
	}

	MathUtil.scaleVector3=function(f,b,e){
		e[0]=f[0] *b;
		e[1]=f[1] *b;
		e[2]=f[2] *b;
	}

	MathUtil.lerpVector3=function(l,r,t,o){
		var ax=l[0],ay=l[1],az=l[2];
		o[0]=ax+t *(r[0]-ax);
		o[1]=ay+t *(r[1]-ay);
		o[2]=az+t *(r[2]-az);
	}

	MathUtil.lerpVector4=function(l,r,t,o){
		var ax=l[0],ay=l[1],az=l[2],aw=l[3];
		o[0]=ax+t *(r[0]-ax);
		o[1]=ay+t *(r[1]-ay);
		o[2]=az+t *(r[2]-az);
		o[3]=aw+t *(r[3]-aw);
	}

	MathUtil.slerpQuaternionArray=function(a,Offset1,b,Offset2,t,out,Offset3){
		var ax=a[Offset1+0],ay=a[Offset1+1],az=a[Offset1+2],aw=a[Offset1+3],bx=b[Offset2+0],by=b[Offset2+1],bz=b[Offset2+2],bw=b[Offset2+3];
		var omega,cosom,sinom,scale0,scale1;
		cosom=ax *bx+ay *by+az *bz+aw *bw;
		if (cosom < 0.0){
			cosom=-cosom;
			bx=-bx;
			by=-by;
			bz=-bz;
			bw=-bw;
		}
		if ((1.0-cosom)> 0.000001){
			omega=Math.acos(cosom);
			sinom=Math.sin(omega);
			scale0=Math.sin((1.0-t)*omega)/ sinom;
			scale1=Math.sin(t *omega)/ sinom;
			}else {
			scale0=1.0-t;
			scale1=t;
		}
		out[Offset3+0]=scale0 *ax+scale1 *bx;
		out[Offset3+1]=scale0 *ay+scale1 *by;
		out[Offset3+2]=scale0 *az+scale1 *bz;
		out[Offset3+3]=scale0 *aw+scale1 *bw;
		return out;
	}

	MathUtil.getRotation=function(x0,y0,x1,y1){
		return Math.atan2(y1-y0,x1-x0)/ Math.PI *180;
	}

	MathUtil.sortBigFirst=function(a,b){
		if (a==b)
			return 0;
		return b > a ? 1 :-1;
	}

	MathUtil.sortSmallFirst=function(a,b){
		if (a==b)
			return 0;
		return b > a ?-1 :1;
	}

	MathUtil.sortNumBigFirst=function(a,b){
		return parseFloat(b)-parseFloat(a);
	}

	MathUtil.sortNumSmallFirst=function(a,b){
		return parseFloat(a)-parseFloat(b);
	}

	MathUtil.sortByKey=function(key,bigFirst,forceNum){
		(bigFirst===void 0)&& (bigFirst=false);
		(forceNum===void 0)&& (forceNum=true);
		var _sortFun;
		if (bigFirst){
			_sortFun=forceNum ? MathUtil.sortNumBigFirst :MathUtil.sortBigFirst;
			}else {
			_sortFun=forceNum ? MathUtil.sortNumSmallFirst :MathUtil.sortSmallFirst;
		}
		return function (a,b){
			return _sortFun(a[key],b[key]);
		}
	}

	return MathUtil;
})()


/**
*<p> <code>Matrix</code> 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。</p>
*<p>您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。</p>
*/
//class laya.maths.Matrix
var Matrix=(function(){
	function Matrix(a,b,c,d,tx,ty){
		/**缩放或旋转图像时影响像素沿 x 轴定位的值。*/
		//this.a=NaN;
		/**旋转或倾斜图像时影响像素沿 y 轴定位的值。*/
		//this.b=NaN;
		/**旋转或倾斜图像时影响像素沿 x 轴定位的值。*/
		//this.c=NaN;
		/**缩放或旋转图像时影响像素沿 y 轴定位的值。*/
		//this.d=NaN;
		/**沿 x 轴平移每个点的距离。*/
		//this.tx=NaN;
		/**沿 y 轴平移每个点的距离。*/
		//this.ty=NaN;
		/**@private 表示此对象是否在对象池中。*/
		this.inPool=false;
		/**@private 是否有改变矩阵的值。*/
		this.bTransform=false;
		(a===void 0)&& (a=1);
		(b===void 0)&& (b=0);
		(c===void 0)&& (c=0);
		(d===void 0)&& (d=1);
		(tx===void 0)&& (tx=0);
		(ty===void 0)&& (ty=0);
		this.a=a;
		this.b=b;
		this.c=c;
		this.d=d;
		this.tx=tx;
		this.ty=ty;
		this._checkTransform();
	}

	__class(Matrix,'laya.maths.Matrix');
	var __proto=Matrix.prototype;
	/**
	*将本矩阵设置为单位矩阵。
	*@return 返回当前矩形。
	*/
	__proto.identity=function(){
		this.a=this.d=1;
		this.b=this.tx=this.ty=this.c=0;
		this.bTransform=false;
		return this;
	}

	/**@private */
	__proto._checkTransform=function(){
		return this.bTransform=(this.a!==1 || this.b!==0 || this.c!==0 || this.d!==1);
	}

	/**
	*设置沿 x 、y 轴平移每个点的距离。
	*@param x 沿 x 轴平移每个点的距离。
	*@param y 沿 y 轴平移每个点的距离。
	*@return 返回对象本身
	*/
	__proto.setTranslate=function(x,y){
		this.tx=x;
		this.ty=y;
		return this;
	}

	/**
	*沿 x 和 y 轴平移矩阵，平移的变化量由 x 和 y 参数指定。
	*@param x 沿 x 轴向右移动的量（以像素为单位）。
	*@param y 沿 y 轴向下移动的量（以像素为单位）。
	*@return 返回此矩形对象。
	*/
	__proto.translate=function(x,y){
		this.tx+=x;
		this.ty+=y;
		return this;
	}

	/**
	*对矩阵应用缩放转换。
	*@param x 用于沿 x 轴缩放对象的乘数。
	*@param y 用于沿 y 轴缩放对象的乘数。
	*/
	__proto.scale=function(x,y){
		this.a *=x;
		this.d *=y;
		this.c *=x;
		this.b *=y;
		this.tx *=x;
		this.ty *=y;
		this.bTransform=true;
	}

	/**
	*对 Matrix 对象应用旋转转换。
	*@param angle 以弧度为单位的旋转角度。
	*/
	__proto.rotate=function(angle){
		var cos=Math.cos(angle);
		var sin=Math.sin(angle);
		var a1=this.a;
		var c1=this.c;
		var tx1=this.tx;
		this.a=a1 *cos-this.b *sin;
		this.b=a1 *sin+this.b *cos;
		this.c=c1 *cos-this.d *sin;
		this.d=c1 *sin+this.d *cos;
		this.tx=tx1 *cos-this.ty *sin;
		this.ty=tx1 *sin+this.ty *cos;
		this.bTransform=true;
	}

	/**
	*对 Matrix 对象应用倾斜转换。
	*@param x 沿着 X 轴的 2D 倾斜弧度。
	*@param y 沿着 Y 轴的 2D 倾斜弧度。
	*@return 当前 Matrix 对象。
	*/
	__proto.skew=function(x,y){
		var tanX=Math.tan(x);
		var tanY=Math.tan(y);
		var a1=this.a;
		var b1=this.b;
		this.a+=tanY *this.c;
		this.b+=tanY *this.d;
		this.c+=tanX *a1;
		this.d+=tanX *b1;
		return this;
	}

	/**
	*对指定的点应用当前矩阵的逆转化并返回此点。
	*@param out 待转化的点 Point 对象。
	*@return 返回out
	*/
	__proto.invertTransformPoint=function(out){
		var a1=this.a;
		var b1=this.b;
		var c1=this.c;
		var d1=this.d;
		var tx1=this.tx;
		var n=a1 *d1-b1 *c1;
		var a2=d1 / n;
		var b2=-b1 / n;
		var c2=-c1 / n;
		var d2=a1 / n;
		var tx2=(c1 *this.ty-d1 *tx1)/ n;
		var ty2=-(a1 *this.ty-b1 *tx1)/ n;
		return out.setTo(a2 *out.x+c2 *out.y+tx2,b2 *out.x+d2 *out.y+ty2);
	}

	/**
	*将 Matrix 对象表示的几何转换应用于指定点。
	*@param out 用来设定输出结果的点。
	*@return 返回out
	*/
	__proto.transformPoint=function(out){
		return out.setTo(this.a *out.x+this.c *out.y+this.tx,this.b *out.x+this.d *out.y+this.ty);
	}

	/**
	*将 Matrix 对象表示的几何转换应用于指定点，忽略tx、ty。
	*@param out 用来设定输出结果的点。
	*@return 返回out
	*/
	__proto.transformPointN=function(out){
		return out.setTo(this.a *out.x+this.c *out.y ,this.b *out.x+this.d *out.y);
	}

	/**
	*@private
	*将 Matrix 对象表示的几何转换应用于指定点。
	*@param data 点集合。
	*@param out 存储应用转化的点的列表。
	*@return 返回out数组
	*/
	__proto.transformPointArray=function(data,out){
		var len=data.length;
		for (var i=0;i < len;i+=2){
			var x=data[i],y=data[i+1];
			out[i]=this.a *x+this.c *y+this.tx;
			out[i+1]=this.b *x+this.d *y+this.ty;
		}
		return out;
	}

	/**
	*@private
	*将 Matrix 对象表示的几何缩放转换应用于指定点。
	*@param data 点集合。
	*@param out 存储应用转化的点的列表。
	*@return 返回out数组
	*/
	__proto.transformPointArrayScale=function(data,out){
		var len=data.length;
		for (var i=0;i < len;i+=2){
			var x=data[i],y=data[i+1];
			out[i]=this.a *x+this.c *y;
			out[i+1]=this.b *x+this.d *y;
		}
		return out;
	}

	/**
	*获取 X 轴缩放值。
	*@return X 轴缩放值。
	*/
	__proto.getScaleX=function(){
		return this.b===0 ? this.a :Math.sqrt(this.a *this.a+this.b *this.b);
	}

	/**
	*获取 Y 轴缩放值。
	*@return Y 轴缩放值。
	*/
	__proto.getScaleY=function(){
		return this.c===0 ? this.d :Math.sqrt(this.c *this.c+this.d *this.d);
	}

	/**
	*执行原始矩阵的逆转换。
	*@return 当前矩阵对象。
	*/
	__proto.invert=function(){
		var a1=this.a;
		var b1=this.b;
		var c1=this.c;
		var d1=this.d;
		var tx1=this.tx;
		var n=a1 *d1-b1 *c1;
		this.a=d1 / n;
		this.b=-b1 / n;
		this.c=-c1 / n;
		this.d=a1 / n;
		this.tx=(c1 *this.ty-d1 *tx1)/ n;
		this.ty=-(a1 *this.ty-b1 *tx1)/ n;
		return this;
	}

	/**
	*将 Matrix 的成员设置为指定值。
	*@param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
	*@param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
	*@param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
	*@param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
	*@param tx 沿 x 轴平移每个点的距离。
	*@param ty 沿 y 轴平移每个点的距离。
	*@return 当前矩阵对象。
	*/
	__proto.setTo=function(a,b,c,d,tx,ty){
		this.a=a,this.b=b,this.c=c,this.d=d,this.tx=tx,this.ty=ty;
		return this;
	}

	/**
	*将指定矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
	*@param matrix 要连接到源矩阵的矩阵。
	*@return 当前矩阵。
	*/
	__proto.concat=function(matrix){
		var a=this.a;
		var c=this.c;
		var tx=this.tx;
		this.a=a *matrix.a+this.b *matrix.c;
		this.b=a *matrix.b+this.b *matrix.d;
		this.c=c *matrix.a+this.d *matrix.c;
		this.d=c *matrix.b+this.d *matrix.d;
		this.tx=tx *matrix.a+this.ty *matrix.c+matrix.tx;
		this.ty=tx *matrix.b+this.ty *matrix.d+matrix.ty;
		return this;
	}

	/**
	*@private
	*对矩阵应用缩放转换。反向相乘
	*@param x 用于沿 x 轴缩放对象的乘数。
	*@param y 用于沿 y 轴缩放对象的乘数。
	*/
	__proto.scaleEx=function(x,y){
		var ba=this.a,bb=this.b,bc=this.c,bd=this.d;
		if (bb!==0 || bc!==0){
			this.a=x *ba;
			this.b=x *bb;
			this.c=y *bc;
			this.d=y *bd;
			}else {
			this.a=x *ba;
			this.b=0 *bd;
			this.c=0 *ba;
			this.d=y *bd;
		}
		this.bTransform=true;
	}

	/**
	*@private
	*对 Matrix 对象应用旋转转换。反向相乘
	*@param angle 以弧度为单位的旋转角度。
	*/
	__proto.rotateEx=function(angle){
		var cos=Math.cos(angle);
		var sin=Math.sin(angle);
		var ba=this.a,bb=this.b,bc=this.c,bd=this.d;
		if (bb!==0 || bc!==0){
			this.a=cos *ba+sin *bc;
			this.b=cos *bb+sin *bd;
			this.c=-sin *ba+cos *bc;
			this.d=-sin *bb+cos *bd;
			}else {
			this.a=cos *ba;
			this.b=sin *bd;
			this.c=-sin *ba;
			this.d=cos *bd;
		}
		this.bTransform=true;
	}

	/**
	*返回此 Matrix 对象的副本。
	*@return 与原始实例具有完全相同的属性的新 Matrix 实例。
	*/
	__proto.clone=function(){
		var dec=Matrix.create();
		dec.a=this.a;
		dec.b=this.b;
		dec.c=this.c;
		dec.d=this.d;
		dec.tx=this.tx;
		dec.ty=this.ty;
		dec.bTransform=this.bTransform;
		return dec;
	}

	/**
	*将当前 Matrix 对象中的所有矩阵数据复制到指定的 Matrix 对象中。
	*@param dec 要复制当前矩阵数据的 Matrix 对象。
	*@return 已复制当前矩阵数据的 Matrix 对象。
	*/
	__proto.copyTo=function(dec){
		dec.a=this.a;
		dec.b=this.b;
		dec.c=this.c;
		dec.d=this.d;
		dec.tx=this.tx;
		dec.ty=this.ty;
		dec.bTransform=this.bTransform;
		return dec;
	}

	/**
	*返回列出该 Matrix 对象属性的文本值。
	*@return 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
	*/
	__proto.toString=function(){
		return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
	}

	/**
	*销毁此对象。
	*/
	__proto.destroy=function(){
		if (this.inPool)return;
		var cache=Matrix._cache;
		this.inPool=true;
		cache._length || (cache._length=0);
		cache[cache._length++]=this;
		this.a=this.d=1;
		this.b=this.c=this.tx=this.ty=0;
		this.bTransform=false;
	}

	Matrix.mul=function(m1,m2,out){
		var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
		var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
		if (bb!==0 || bc!==0){
			out.a=aa *ba+ab *bc;
			out.b=aa *bb+ab *bd;
			out.c=ac *ba+ad *bc;
			out.d=ac *bb+ad *bd;
			out.tx=ba *atx+bc *aty+btx;
			out.ty=bb *atx+bd *aty+bty;
			}else {
			out.a=aa *ba;
			out.b=ab *bd;
			out.c=ac *ba;
			out.d=ad *bd;
			out.tx=ba *atx+btx;
			out.ty=bd *aty+bty;
		}
		return out;
	}

	Matrix.mul16=function(m1,m2,out){
		var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
		var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
		if (bb!==0 || bc!==0){
			out[0]=aa *ba+ab *bc;
			out[1]=aa *bb+ab *bd;
			out[4]=ac *ba+ad *bc;
			out[5]=ac *bb+ad *bd;
			out[12]=ba *atx+bc *aty+btx;
			out[13]=bb *atx+bd *aty+bty;
			}else {
			out[0]=aa *ba;
			out[1]=ab *bd;
			out[4]=ac *ba;
			out[5]=ad *bd;
			out[12]=ba *atx+btx;
			out[13]=bd *aty+bty;
		}
		return out;
	}

	Matrix.mulPre=function(m1,ba,bb,bc,bd,btx,bty,out){
		var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
		if (bb!==0 || bc!==0){
			out.a=aa *ba+ab *bc;
			out.b=aa *bb+ab *bd;
			out.c=ac *ba+ad *bc;
			out.d=ac *bb+ad *bd;
			out.tx=ba *atx+bc *aty+btx;
			out.ty=bb *atx+bd *aty+bty;
			}else {
			out.a=aa *ba;
			out.b=ab *bd;
			out.c=ac *ba;
			out.d=ad *bd;
			out.tx=ba *atx+btx;
			out.ty=bd *aty+bty;
		}
		return out;
	}

	Matrix.mulPos=function(m1,aa,ab,ac,ad,atx,aty,out){
		var ba=m1.a,bb=m1.b,bc=m1.c,bd=m1.d,btx=m1.tx,bty=m1.ty;
		if (bb!==0 || bc!==0){
			out.a=aa *ba+ab *bc;
			out.b=aa *bb+ab *bd;
			out.c=ac *ba+ad *bc;
			out.d=ac *bb+ad *bd;
			out.tx=ba *atx+bc *aty+btx;
			out.ty=bb *atx+bd *aty+bty;
			}else {
			out.a=aa *ba;
			out.b=ab *bd;
			out.c=ac *ba;
			out.d=ad *bd;
			out.tx=ba *atx+btx;
			out.ty=bd *aty+bty;
		}
		return out;
	}

	Matrix.preMul=function(parent,self,out){
		var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
		var na=self.a,nb=self.b,nc=self.c,nd=self.d,ntx=self.tx,nty=self.ty;
		out.a=na *pa;
		out.b=out.c=0;
		out.d=nd *pd;
		out.tx=ntx *pa+parent.tx;
		out.ty=nty *pd+parent.ty;
		if (nb!==0 || nc!==0 || pb!==0 || pc!==0){
			out.a+=nb *pc;
			out.d+=nc *pb;
			out.b+=na *pb+nb *pd;
			out.c+=nc *pa+nd *pc;
			out.tx+=nty *pc;
			out.ty+=ntx *pb;
		}
		return out;
	}

	Matrix.preMulXY=function(parent,x,y,out){
		var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
		out.a=pa;
		out.b=pb;
		out.c=pc;
		out.d=pd;
		out.tx=x *pa+parent.tx+y *pc;
		out.ty=y *pd+parent.ty+x *pb;
		return out;
	}

	Matrix.create=function(){
		var cache=Matrix._cache;
		var mat=!cache._length ? (new Matrix()):cache[--cache._length];
		mat.inPool=false;
		return mat;
	}

	Matrix.EMPTY=new Matrix();
	Matrix.TEMP=new Matrix();
	Matrix._cache=[];
	return Matrix;
})()


/**
*<code>Point</code> 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
*/
//class laya.maths.Point
var Point=(function(){
	function Point(x,y){
		/**该点的水平坐标。*/
		//this.x=NaN;
		/**该点的垂直坐标。*/
		//this.y=NaN;
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		this.x=x;
		this.y=y;
	}

	__class(Point,'laya.maths.Point');
	var __proto=Point.prototype;
	/**
	*将 <code>Point</code> 的成员设置为指定值。
	*@param x 水平坐标。
	*@param y 垂直坐标。
	*@return 当前 Point 对象。
	*/
	__proto.setTo=function(x,y){
		this.x=x;
		this.y=y;
		return this;
	}

	/**
	*计算当前点和目标点(x，y)的距离。
	*@param x 水平坐标。
	*@param y 垂直坐标。
	*@return 返回当前点和目标点之间的距离。
	*/
	__proto.distance=function(x,y){
		return Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y));
	}

	/**返回包含 x 和 y 坐标的值的字符串。*/
	__proto.toString=function(){
		return this.x+","+this.y;
	}

	/**
	*标准化向量。
	*/
	__proto.normalize=function(){
		var d=Math.sqrt(this.x *this.x+this.y *this.y);
		if (d > 0){
			var id=1.0 / d;
			this.x *=id;
			this.y *=id;
		}
	}

	Point.TEMP=new Point();
	Point.EMPTY=new Point();
	return Point;
})()


/**
*<p><code>Rectangle</code> 对象是按其位置（由它左上角的点 (x,y)确定）以及宽度和高度定义的区域。</p>
*<p>Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。</p>
*/
//class laya.maths.Rectangle
var Rectangle=(function(){
	function Rectangle(x,y,width,height){
		/**矩形左上角的 X 轴坐标。*/
		//this.x=NaN;
		/**矩形左上角的 Y 轴坐标。*/
		//this.y=NaN;
		/**矩形的宽度。*/
		//this.width=NaN;
		/**矩形的高度。*/
		//this.height=NaN;
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
	}

	__class(Rectangle,'laya.maths.Rectangle');
	var __proto=Rectangle.prototype;
	/**
	*将 Rectangle 的属性设置为指定值。
	*@param x x 矩形左上角的 X 轴坐标。
	*@param y x 矩形左上角的 Y 轴坐标。
	*@param width 矩形的宽度。
	*@param height 矩形的高。
	*@return 返回属性值修改后的矩形对象本身。
	*/
	__proto.setTo=function(x,y,width,height){
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
		return this;
	}

	/**
	*复制 source 对象的属性值到此矩形对象中。
	*@param sourceRect 源 Rectangle 对象。
	*@return 返回属性值修改后的矩形对象本身。
	*/
	__proto.copyFrom=function(source){
		this.x=source.x;
		this.y=source.y;
		this.width=source.width;
		this.height=source.height;
		return this;
	}

	/**
	*确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
	*@param x 点的 X 轴坐标值（水平位置）。
	*@param y 点的 Y 轴坐标值（垂直位置）。
	*@return 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
	*/
	__proto.contains=function(x,y){
		if (this.width <=0 || this.height <=0)return false;
		if (x >=this.x && x < this.right){
			if (y >=this.y && y < this.bottom){
				return true;
			}
		}
		return false;
	}

	/**
	*确定在 rect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
	*@param rect Rectangle 对象。
	*@return 如果传入的矩形对象与此对象相交，则返回 true 值，否则返回 false。
	*/
	__proto.intersects=function(rect){
		return !(rect.x > (this.x+this.width)|| (rect.x+rect.width)< this.x || rect.y > (this.y+this.height)|| (rect.y+rect.height)< this.y);
	}

	/**
	*如果在 rect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，则此方法返回null。
	*@param rect 待比较的矩形区域。
	*@param out （可选）待输出的矩形区域。如果为空则创建一个新的。建议：尽量复用对象，减少对象创建消耗。
	*@return 返回相交的矩形区域对象。
	*/
	__proto.intersection=function(rect,out){
		if (!this.intersects(rect))return null;
		out || (out=new Rectangle());
		out.x=Math.max(this.x,rect.x);
		out.y=Math.max(this.y,rect.y);
		out.width=Math.min(this.right,rect.right)-out.x;
		out.height=Math.min(this.bottom,rect.bottom)-out.y;
		return out;
	}

	/**
	*<p>矩形联合，通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。</p>
	*<p>注意：union()方法忽略高度或宽度值为 0 的矩形，如：var rect2:Rectangle=new Rectangle(300,300,50,0);</p>
	*@param 要添加到此 Rectangle 对象的 Rectangle 对象。
	*@param out 用于存储输出结果的矩形对象。如果为空，则创建一个新的。建议：尽量复用对象，减少对象创建消耗。Rectangle.TEMP对象用于对象复用。
	*@return 充当两个矩形的联合的新 Rectangle 对象。
	*/
	__proto.union=function(source,out){
		out || (out=new Rectangle());
		this.clone(out);
		if (source.width <=0 || source.height <=0)return out;
		out.addPoint(source.x,source.y);
		out.addPoint(source.right,source.bottom);
		return this;
	}

	/**
	*返回一个 Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
	*@param out （可选）用于存储结果的矩形对象。如果为空，则创建一个新的。建议：尽量复用对象，减少对象创建消耗。。Rectangle.TEMP对象用于对象复用。
	*@return Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
	*/
	__proto.clone=function(out){
		out || (out=new Rectangle());
		out.x=this.x;
		out.y=this.y;
		out.width=this.width;
		out.height=this.height;
		return out;
	}

	/**
	*当前 Rectangle 对象的水平位置 x 和垂直位置 y 以及高度 width 和宽度 height 以逗号连接成的字符串。
	*/
	__proto.toString=function(){
		return this.x+","+this.y+","+this.width+","+this.height;
	}

	/**
	*检测传入的 Rectangle 对象的属性是否与当前 Rectangle 对象的属性 x、y、width、height 属性值都相等。
	*@param rect 待比较的 Rectangle 对象。
	*@return 如果判断的属性都相等，则返回 true ,否则返回 false。
	*/
	__proto.equals=function(rect){
		if (!rect || rect.x!==this.x || rect.y!==this.y || rect.width!==this.width || rect.height!==this.height)return false;
		return true;
	}

	/**
	*<p>为当前矩形对象加一个点，以使当前矩形扩展为包含当前矩形和此点的最小矩形。</p>
	*<p>此方法会修改本对象。</p>
	*@param x 点的 X 坐标。
	*@param y 点的 Y 坐标。
	*@return 返回此 Rectangle 对象。
	*/
	__proto.addPoint=function(x,y){
		this.x > x && (this.width+=this.x-x,this.x=x);
		this.y > y && (this.height+=this.y-y,this.y=y);
		if (this.width < x-this.x)this.width=x-this.x;
		if (this.height < y-this.y)this.height=y-this.y;
		return this;
	}

	/**
	*@private
	*返回代表当前矩形的顶点数据。
	*@return 顶点数据。
	*/
	__proto._getBoundPoints=function(){
		var rst=Rectangle._temB;
		rst.length=0;
		if (this.width==0 || this.height==0)return rst;
		rst.push(this.x,this.y,this.x+this.width,this.y,this.x,this.y+this.height,this.x+this.width,this.y+this.height);
		return rst;
	}

	/**
	*确定此 Rectangle 对象是否为空。
	*@return 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
	*/
	__proto.isEmpty=function(){
		if (this.width <=0 || this.height <=0)return true;
		return false;
	}

	/**此矩形右侧的 X 轴坐标。 x 和 width 属性的和。*/
	__getset(0,__proto,'right',function(){
		return this.x+this.width;
	});

	/**此矩形底端的 Y 轴坐标。y 和 height 属性的和。*/
	__getset(0,__proto,'bottom',function(){
		return this.y+this.height;
	});

	Rectangle._getBoundPointS=function(x,y,width,height){
		var rst=Rectangle._temA;
		rst.length=0;
		if (width==0 || height==0)return rst;
		rst.push(x,y,x+width,y,x,y+height,x+width,y+height);
		return rst;
	}

	Rectangle._getWrapRec=function(pointList,rst){
		if (!pointList || pointList.length < 1)return rst ? rst.setTo(0,0,0,0):Rectangle.TEMP.setTo(0,0,0,0);
		rst=rst ? rst :new Rectangle();
		var i,len=pointList.length,minX,maxX,minY,maxY,tPoint=Point.TEMP;
		minX=minY=99999;
		maxX=maxY=-minX;
		for (i=0;i < len;i+=2){
			tPoint.x=pointList[i];
			tPoint.y=pointList[i+1];
			minX=minX < tPoint.x ? minX :tPoint.x;
			minY=minY < tPoint.y ? minY :tPoint.y;
			maxX=maxX > tPoint.x ? maxX :tPoint.x;
			maxY=maxY > tPoint.y ? maxY :tPoint.y;
		}
		return rst.setTo(minX,minY,maxX-minX,maxY-minY);
	}

	Rectangle.EMPTY=new Rectangle();
	Rectangle.TEMP=new Rectangle();
	Rectangle._temB=[];
	Rectangle._temA=[];
	return Rectangle;
})()


/**
*<code>SoundManager</code> 是一个声音管理类。提供了对背景音乐、音效的播放控制方法。
*引擎默认有两套声音方案：WebAudio和H5Audio
*播放音效，优先使用WebAudio播放声音，如果WebAudio不可用，则用H5Audio播放，H5Audio在部分机器上有兼容问题（比如不能混音，播放有延迟等）。
*播放背景音乐，则使用H5Audio播放（使用WebAudio会增加特别大的内存，并且要等加载完毕后才能播放，有延迟）
*建议背景音乐用mp3类型，音效用wav或者mp3类型（如果打包为app，音效只能用wav格式）。
*详细教程及声音格式请参考：http://ldc.layabox.com/doc/?nav=ch-as-1-7-0
*/
//class laya.media.SoundManager
var SoundManager=(function(){
	function SoundManager(){}
	__class(SoundManager,'laya.media.SoundManager');
	__getset(1,SoundManager,'useAudioMusic',function(){
		return SoundManager._useAudioMusic;
		},function(value){
		SoundManager._useAudioMusic=value;
		if (value){
			SoundManager._musicClass=AudioSound;
			}else{
			SoundManager._musicClass=null;
		}
	});

	/**
	*失去焦点后是否自动停止背景音乐。
	*@param v Boolean 失去焦点后是否自动停止背景音乐。
	*
	*/
	/**
	*失去焦点后是否自动停止背景音乐。
	*/
	__getset(1,SoundManager,'autoStopMusic',function(){
		return SoundManager._autoStopMusic;
		},function(v){
		Laya.stage.off(/*laya.events.Event.BLUR*/"blur",null,SoundManager._stageOnBlur);
		Laya.stage.off(/*laya.events.Event.FOCUS*/"focus",null,SoundManager._stageOnFocus);
		Laya.stage.off(/*laya.events.Event.VISIBILITY_CHANGE*/"visibilitychange",null,SoundManager._visibilityChange);
		SoundManager._autoStopMusic=v;
		if (v){
			Laya.stage.on(/*laya.events.Event.BLUR*/"blur",null,SoundManager._stageOnBlur);
			Laya.stage.on(/*laya.events.Event.FOCUS*/"focus",null,SoundManager._stageOnFocus);
			Laya.stage.on(/*laya.events.Event.VISIBILITY_CHANGE*/"visibilitychange",null,SoundManager._visibilityChange);
		}
	});

	/**
	*背景音乐和所有音效是否静音。
	*/
	__getset(1,SoundManager,'muted',function(){
		return SoundManager._muted;
		},function(value){
		if (value==SoundManager._muted)return;
		if (value){
			SoundManager.stopAllSound();
		}
		SoundManager.musicMuted=value;
		SoundManager._muted=value;
	});

	/**
	*背景音乐（不包括音效）是否静音。
	*/
	__getset(1,SoundManager,'musicMuted',function(){
		return SoundManager._musicMuted;
		},function(value){
		if (value==SoundManager._musicMuted)return;
		if (value){
			if (SoundManager._tMusic){
				if (SoundManager._musicChannel&&!SoundManager._musicChannel.isStopped){
					if (Render.isConchApp){
						/*__JS__ */if (SoundManager._musicChannel._audio)SoundManager._musicChannel._audio.muted=true;;
					}
					else {
						SoundManager._musicChannel.pause();
					}
					}else{
					SoundManager._musicChannel=null;
				}
				}else{
				SoundManager._musicChannel=null;
			}
			SoundManager._musicMuted=value;
			}else {
			SoundManager._musicMuted=value;
			if (SoundManager._tMusic){
				if (SoundManager._musicChannel){
					if (Render.isConchApp){
						/*__JS__ */if (SoundManager._musicChannel._audio)SoundManager._musicChannel._audio.muted=false;;
					}
					else {
						SoundManager._musicChannel.resume();
					}
				}
			}
		}
	});

	/**
	*所有音效（不包括背景音乐）是否静音。
	*/
	__getset(1,SoundManager,'soundMuted',function(){
		return SoundManager._soundMuted;
		},function(value){
		SoundManager._soundMuted=value;
	});

	SoundManager.addChannel=function(channel){
		if (SoundManager._channels.indexOf(channel)>=0)return;
		SoundManager._channels.push(channel);
	}

	SoundManager.removeChannel=function(channel){
		var i=0;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			if (SoundManager._channels[i]==channel){
				SoundManager._channels.splice(i,1);
			}
		}
	}

	SoundManager.disposeSoundIfNotUsed=function(url){
		var i=0;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			if (SoundManager._channels[i].url==url){
				return;
			}
		}
		SoundManager.destroySound(url);
	}

	SoundManager._visibilityChange=function(){
		if (Laya.stage.isVisibility){
			SoundManager._stageOnFocus();
			}else {
			SoundManager._stageOnBlur();
		}
	}

	SoundManager._stageOnBlur=function(){
		SoundManager._isActive=false;
		if (SoundManager._musicChannel){
			if (!SoundManager._musicChannel.isStopped){
				SoundManager._blurPaused=true;
				SoundManager._musicChannel.pause();
			}
		}
		SoundManager.stopAllSound();
		Laya.stage.once(/*laya.events.Event.MOUSE_DOWN*/"mousedown",null,SoundManager._stageOnFocus);
	}

	SoundManager._recoverWebAudio=function(){
		if(WebAudioSound.ctx&&WebAudioSound.ctx.state!="running"&&WebAudioSound.ctx.resume)
			WebAudioSound.ctx.resume();
	}

	SoundManager._stageOnFocus=function(){
		SoundManager._isActive=true;
		SoundManager._recoverWebAudio();
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",null,SoundManager._stageOnFocus);
		if (SoundManager._blurPaused){
			if (SoundManager._musicChannel && SoundManager._musicChannel.isStopped){
				SoundManager._blurPaused=false;
				SoundManager._musicChannel.resume();
			}
		}
	}

	SoundManager.playSound=function(url,loops,complete,soundClass,startTime){
		(loops===void 0)&& (loops=1);
		(startTime===void 0)&& (startTime=0);
		if (!SoundManager._isActive || !url)return null;
		if (SoundManager._muted)return null;
		SoundManager._recoverWebAudio();
		url=URL.formatURL(url);
		if (url==SoundManager._tMusic){
			if (SoundManager._musicMuted)return null;
			}else {
			if (Render.isConchApp){
				var ext=Utils.getFileExtension(url);
				if (ext !="wav" && ext !="ogg"){
					alert("The sound only supports wav or ogg format,for optimal performance reason,please refer to the official website document.");
					return null;
				}
			}
			if (SoundManager._soundMuted)return null;
		};
		var tSound;
		if (!Browser.onMiniGame && !Browser.onAlipayMiniGame && !Browser.onBDMiniGame && !Browser.onVVMiniGame && !Browser.onKGMiniGame && !Browser.onQGMiniGame && !Browser.onTTMiniGame && !Browser.onHWMiniGame && !Browser.onTBMiniGame){
			tSound=Laya.loader.getRes(url);
		}
		if (!soundClass)soundClass=SoundManager._soundClass;
		if (!tSound){
			tSound=new soundClass();
			tSound.load(url);
			if (!Browser.onMiniGame && !Browser.onAlipayMiniGame && !Browser.onBDMiniGame && !Browser.onVVMiniGame && !Browser.onKGMiniGame && !Browser.onQGMiniGame && !Browser.onTTMiniGame && !Browser.onHWMiniGame && !Browser.onTBMiniGame){
				Loader.cacheRes(url,tSound);
			}
		};
		var channel;
		channel=tSound.play(startTime,loops);
		if (!channel)return null;
		channel.url=url;
		channel.volume=(url==SoundManager._tMusic)? SoundManager.musicVolume :SoundManager.soundVolume;
		channel.completeHandler=complete;
		return channel;
	}

	SoundManager.destroySound=function(url){
		var tSound=Laya.loader.getRes(url);
		if (tSound){
			Loader.clearRes(url);
			tSound.dispose();
		}
	}

	SoundManager.playMusic=function(url,loops,complete,startTime){
		(loops===void 0)&& (loops=0);
		(startTime===void 0)&& (startTime=0);
		url=URL.formatURL(url);
		SoundManager._tMusic=url;
		if (SoundManager._musicChannel)SoundManager._musicChannel.stop();
		return SoundManager._musicChannel=SoundManager.playSound(url,loops,complete,SoundManager._musicClass,startTime);
	}

	SoundManager.stopSound=function(url){
		url=URL.formatURL(url);
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			if (channel.url==url){
				channel.stop();
			}
		}
	}

	SoundManager.stopAll=function(){
		SoundManager._tMusic=null;
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			channel.stop();
		}
	}

	SoundManager.stopAllSound=function(){
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			if (channel.url !=SoundManager._tMusic){
				channel.stop();
			}
		}
	}

	SoundManager.stopMusic=function(){
		if (SoundManager._musicChannel)SoundManager._musicChannel.stop();
		SoundManager._tMusic=null;
	}

	SoundManager.setSoundVolume=function(volume,url){
		if (url){
			url=URL.formatURL(url);
			SoundManager._setVolume(url,volume);
			}else {
			SoundManager.soundVolume=volume;
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url !=SoundManager._tMusic){
					channel.volume=volume;
				}
			}
		}
	}

	SoundManager.setMusicVolume=function(volume){
		SoundManager.musicVolume=volume;
		SoundManager._setVolume(SoundManager._tMusic,volume);
	}

	SoundManager._setVolume=function(url,volume){
		url=URL.formatURL(url);
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			if (channel.url==url){
				channel.volume=volume;
			}
		}
	}

	SoundManager.musicVolume=1;
	SoundManager.soundVolume=1;
	SoundManager.playbackRate=1;
	SoundManager._useAudioMusic=true;
	SoundManager._muted=false;
	SoundManager._soundMuted=false;
	SoundManager._musicMuted=false;
	SoundManager._tMusic=null;
	SoundManager._musicChannel=null;
	SoundManager._channels=[];
	SoundManager._autoStopMusic=false;
	SoundManager._blurPaused=false;
	SoundManager._isActive=true;
	SoundManager._soundClass=null;
	SoundManager._musicClass=null;
	SoundManager.autoReleaseSound=true;
	return SoundManager;
})()


/**
*<p> <code>LocalStorage</code> 类用于没有时间限制的数据存储。</p>
*/
//class laya.net.LocalStorage
var LocalStorage=(function(){
	var Storage;
	function LocalStorage(){}
	__class(LocalStorage,'laya.net.LocalStorage');
	LocalStorage.__init__=function(){
		if (!LocalStorage._baseClass){
			LocalStorage._baseClass=Storage;
			Storage.init();
		}
		LocalStorage.items=LocalStorage._baseClass.items;
		LocalStorage.support=LocalStorage._baseClass.support;
	}

	LocalStorage.setItem=function(key,value){
		LocalStorage._baseClass.setItem(key,value);
	}

	LocalStorage.getItem=function(key){
		return LocalStorage._baseClass.getItem(key);
	}

	LocalStorage.setJSON=function(key,value){
		LocalStorage._baseClass.setJSON(key,value);
	}

	LocalStorage.getJSON=function(key){
		return LocalStorage._baseClass.getJSON(key);
	}

	LocalStorage.removeItem=function(key){
		LocalStorage._baseClass.removeItem(key);
	}

	LocalStorage.clear=function(){
		LocalStorage._baseClass.clear();
	}

	LocalStorage._baseClass=null;
	LocalStorage.items=null;
	LocalStorage.support=false;
	LocalStorage.__init$=function(){
		//class Storage
		Storage=(function(){
			function Storage(){}
			__class(Storage,'');
			Storage.init=function(){
				/*__JS__ */try{Storage.support=true;Storage.items=window.localStorage;Storage.setItem('laya','1');Storage.removeItem('laya');}catch(e){Storage.support=false;}if(!Storage.support)console.log('LocalStorage is not supprot or browser is private mode.');
			}
			Storage.setItem=function(key,value){
				try {
					Storage.support && Storage.items.setItem(key,value);
					}catch (e){
					console.warn("set localStorage failed",e);
				}
			}
			Storage.getItem=function(key){
				return Storage.support ? Storage.items.getItem(key):null;
			}
			Storage.setJSON=function(key,value){
				try {
					Storage.support && Storage.items.setItem(key,JSON.stringify(value));
					}catch (e){
					console.warn("set localStorage failed",e);
				}
			}
			Storage.getJSON=function(key){
				return JSON.parse(Storage.support ? Storage.items.getItem(key):null);
			}
			Storage.removeItem=function(key){
				Storage.support && Storage.items.removeItem(key);
			}
			Storage.clear=function(){
				Storage.support && Storage.items.clear();
			}
			Storage.items=null;
			Storage.support=false;
			return Storage;
		})()
	}

	return LocalStorage;
})()


/**
*<p>资源版本的生成由layacmd或IDE完成，使用 <code>ResourceVersion</code> 简化使用过程。</p>
*<p>调用 <code>enable</code> 启用资源版本管理。</p>
*/
//class laya.net.ResourceVersion
var ResourceVersion=(function(){
	function ResourceVersion(){}
	__class(ResourceVersion,'laya.net.ResourceVersion');
	ResourceVersion.enable=function(manifestFile,callback,type){
		(type===void 0)&& (type=2);
		laya.net.ResourceVersion.type=type;
		Laya.loader.load(manifestFile,Handler.create(null,ResourceVersion.onManifestLoaded,[callback]),null,/*laya.net.Loader.JSON*/"json");
	}

	ResourceVersion.onManifestLoaded=function(callback,data){
		URL.customFormat=ResourceVersion.addVersionPrefix;
		ResourceVersion.manifest=data;
		callback.run();
		if (!data){
			console.warn("资源版本清单文件不存在，不使用资源版本管理。忽略ERR_FILE_NOT_FOUND错误。");
		}
	}

	ResourceVersion.addVersionPrefix=function(originURL){
		if (ResourceVersion.manifest && ResourceVersion.manifest[originURL]){
			if (ResourceVersion.type==2)return ResourceVersion.manifest[originURL];
			return ResourceVersion.manifest[originURL]+"/"+originURL;
		}
		return originURL;
	}

	ResourceVersion.FOLDER_VERSION=1;
	ResourceVersion.FILENAME_VERSION=2;
	ResourceVersion.manifest=null;
	ResourceVersion.type=1;
	return ResourceVersion;
})()


/**
*@private
*/
//class laya.net.TTFLoader
var TTFLoader=(function(){
	function TTFLoader(){
		this.fontName=null;
		this.complete=null;
		this.err=null;
		this._fontTxt=null;
		this._url=null;
		this._div=null;
		this._txtWidth=NaN;
		this._http=null;
	}

	__class(TTFLoader,'laya.net.TTFLoader');
	var __proto=TTFLoader.prototype;
	__proto.load=function(fontPath){
		this._url=fontPath;
		var tArr=fontPath.split(".ttf")[0].split("/");
		this.fontName=tArr[tArr.length-1];
		if (Browser.window.conch){
			this._loadConch();
		}else
		if (Browser.window.FontFace){
			this._loadWithFontFace()
		}
		else {
			this._loadWithCSS();
		}
	}

	__proto._loadConch=function(){
		this._http=new HttpRequest();
		this._http.on(/*laya.events.Event.ERROR*/"error",this,this._onErr);
		this._http.on(/*laya.events.Event.COMPLETE*/"complete",this,this._onHttpLoaded);
		this._http.send(this._url,null,"get",/*laya.net.Loader.BUFFER*/"arraybuffer");
	}

	__proto._onHttpLoaded=function(data){
		Browser.window.conch.setFontFaceFromBuffer(this.fontName,data);
		this._clearHttp();
		this._complete();
	}

	__proto._clearHttp=function(){
		if (this._http){
			this._http.off(/*laya.events.Event.ERROR*/"error",this,this._onErr);
			this._http.off(/*laya.events.Event.COMPLETE*/"complete",this,this._onHttpLoaded);
			this._http=null;
		}
	}

	__proto._onErr=function(){
		this._clearHttp();
		if (this.err){
			this.err.runWith("fail:"+this._url);
			this.err=null;
		}
	}

	__proto._complete=function(){
		Laya.timer.clear(this,this._complete);
		Laya.timer.clear(this,this._checkComplete);
		if (this._div && this._div.parentNode){
			this._div.parentNode.removeChild(this._div);
			this._div=null;
		}
		if (this.complete){
			this.complete.runWith(this);
			this.complete=null;
		}
	}

	__proto._checkComplete=function(){
		if (RunDriver.measureText("LayaTTFFont",this._fontTxt).width !=this._txtWidth){
			this._complete();
		}
	}

	__proto._loadWithFontFace=function(){
		var fontFace=new Browser.window.FontFace(this.fontName,"url('"+this._url+"')");
		Browser.window.document.fonts.add(fontFace);
		var self=this;
		fontFace.loaded.then((function(){
			self._complete()
		}));
		fontFace.load();
	}

	__proto._createDiv=function(){
		this._div=Browser.createElement("div");
		this._div.innerHTML="laya";
		var _style=this._div.style;
		_style.fontFamily=this.fontName;
		_style.position="absolute";
		_style.left="-100px";
		_style.top="-100px";
		Browser.document.body.appendChild(this._div);
	}

	__proto._loadWithCSS=function(){
		var _$this=this;
		var fontStyle=Browser.createElement("style");
		fontStyle.type="text/css";
		Browser.document.body.appendChild(fontStyle);
		fontStyle.textContent="@font-face { font-family:'"+this.fontName+"'; src:url('"+this._url+"');}";
		this._fontTxt="40px "+this.fontName;
		this._txtWidth=RunDriver.measureText("LayaTTFFont",this._fontTxt).width;
		var self=this;
		fontStyle.onload=function (){
			Laya.timer.once(10000,self,_$this._complete);
		};
		Laya.timer.loop(20,this,this._checkComplete);
		this._createDiv();
	}

	TTFLoader._testString="LayaTTFFont";
	return TTFLoader;
})()


/**
*<p> <code>URL</code> 类用于定义地址信息。</p>
*/
//class laya.net.URL
var URL=(function(){
	function URL(url){
		/**@private */
		this._url=null;
		/**@private */
		this._path=null;
		this._url=URL.formatURL(url);
		this._path=URL.getPath(url);
	}

	__class(URL,'laya.net.URL');
	var __proto=URL.prototype;
	/**地址的路径。*/
	__getset(0,__proto,'path',function(){
		return this._path;
	});

	/**格式化后的地址。*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	URL.formatURL=function(url,base){
		if (!url)return "null path";
		if (url.indexOf(":")> 0)return url;
		if (URL.customFormat !=null)url=URL.customFormat(url,base);
		var char1=url.charAt(0);
		if (char1==="."){
			return URL.formatRelativePath((base || URL.basePath)+url);
			}else if (char1==='~'){
			return URL.rootPath+url.substring(1);
			}else if (char1==="d"){
			if (url.indexOf("data:image")===0)return url;
			}else if (char1==="/"){
			return url;
		}
		return (base || URL.basePath)+url;
	}

	URL.formatRelativePath=function(value){
		var parts=value.split("/");
		for (var i=0,len=parts.length;i < len;i++){
			if (parts[i]=='..'){
				parts.splice(i-1,2);
				i-=2;
			}
		}
		return parts.join('/');
	}

	URL.isAbsolute=function(url){
		return url.indexOf(":")> 0 || url.charAt(0)=='/';
	}

	URL.getPath=function(url){
		var ofs=url.lastIndexOf('/');
		return ofs > 0 ? url.substr(0,ofs+1):"";
	}

	URL.getFileName=function(url){
		var ofs=url.lastIndexOf('/');
		return ofs > 0 ? url.substr(ofs+1):url;
	}

	URL.version={};
	URL.basePath="";
	URL.rootPath="";
	URL.customFormat=function(url){
		var newUrl=URL.version[url];
		if (!Render.isConchApp && newUrl)url+="?v="+newUrl;
		return url;
	}

	return URL;
})()


/**
*@private
*<code>Render</code> 是渲染管理类。它是一个单例，可以使用 Laya.render 访问。
*/
//class laya.renders.Render
var Render=(function(){
	function Render(width,height){
		/**@private */
		this._timeId=0;
		var style=Render._mainCanvas.source.style;
		style.position='absolute';
		style.top=style.left="0px";
		style.background="#000000";
		Render._mainCanvas.source.id="layaCanvas";
		var isWebGl=laya.renders.Render.isWebGL;
		Render._mainCanvas.source.width=width;
		Render._mainCanvas.source.height=height;
		isWebGl && Render.WebGL.init(Render._mainCanvas,width,height);
		if(!Browser.onKGMiniGame)
			Browser.container.appendChild(Render._mainCanvas.source);
		Render._context=new RenderContext(width,height,isWebGl ? null :Render._mainCanvas);
		Render._context.ctx.setIsMainContext();
		Browser.window.requestAnimationFrame(loop);
		function loop (stamp){
			Laya.stage._loop();
			Browser.window.requestAnimationFrame(loop);
		}
		Laya.stage.on("visibilitychange",this,this._onVisibilitychange);
	}

	__class(Render,'laya.renders.Render');
	var __proto=Render.prototype;
	/**@private */
	__proto._onVisibilitychange=function(){
		if (!Laya.stage.isVisibility){
			this._timeId=Browser.window.setInterval(this._enterFrame,1000);
			}else if (this._timeId !=0){
			Browser.window.clearInterval(this._timeId);
		}
	}

	/**@private */
	__proto._enterFrame=function(e){
		Laya.stage._loop();
	}

	/**目前使用的渲染器。*/
	__getset(1,Render,'context',function(){
		return Render._context;
	});

	/**渲染使用的原生画布引用。 */
	__getset(1,Render,'canvas',function(){
		return Render._mainCanvas.source;
	});

	Render._context=null;
	Render._mainCanvas=null;
	Render.WebGL=null;
	Render.isConchNode=false;
	Render.isConchApp=false;
	Render.isConchWebGL=false;
	Render.isWebGL=false;
	Render.is3DMode=false;
	Render.optimizeTextureMemory=function(url,texture){
		return true;
	}

	Render.__init$=function(){
		/*__JS__ */window.ConchRenderType=window.ConchRenderType||1;
		/*__JS__ */window.ConchRenderType|=(!window.conch?0:0x04);;{
			Render.isConchNode=/*__JS__ */(window.ConchRenderType & 5)==5;
			Render.isConchApp=/*__JS__ */(window.ConchRenderType & 0x04)==0x04;
			Render.isConchWebGL=/*__JS__ */window.ConchRenderType==6;
		};;
	}

	return Render;
})()


/**
*@private
*渲染环境
*/
//class laya.renders.RenderContext
var RenderContext=(function(){
	function RenderContext(width,height,canvas){
		/**全局x坐标 */
		this.x=0;
		/**全局y坐标 */
		this.y=0;
		/**当前使用的画布 */
		//this.canvas=null;
		/**当前使用的画布上下文 */
		//this.ctx=null;
		this._drawTexture=function(x,y,args){
			if (args[0].loaded)this.ctx.drawTexture(args[0],args[1],args[2],args[3],args[4],x,y);
		}
		this._fillTexture=function(x,y,args){
			if (args[0].loaded)this.ctx.fillTexture(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
		}
		this._drawTextureWithTransform=function(x,y,args){
			if (args[0].loaded)this.ctx.drawTextureWithTransform(args[0],args[1],args[2],args[3],args[4],args[5],x,y,args[6]);
		}
		this._fillQuadrangle=function(x,y,args){
			this.ctx.fillQuadrangle(args[0],args[1],args[2],args[3],args[4]);
		}
		this._drawRect=function(x,y,args){
			var ctx=this.ctx;
			if (args[4] !=null){
				ctx.fillStyle=args[4];
				ctx.fillRect(x+args[0],y+args[1],args[2],args[3],null);
			}
			if (args[5] !=null){
				ctx.strokeStyle=args[5];
				ctx.lineWidth=args[6];
				ctx.strokeRect(x+args[0],y+args[1],args[2],args[3],args[6]);
			}
		}
		//矢量方法
		this._drawPie=function(x,y,args){
			var ctx=this.ctx;
			Render.isWebGL && ctx.setPathId(args[8]);
			ctx.beginPath();
			if (Render.isWebGL){
				ctx.movePath(args[0]+x,args[1]+y);
				ctx.moveTo(0,0);
				}else {
				ctx.moveTo(x+args[0],y+args[1]);
			}
			ctx.arc(x+args[0],y+args[1],args[2],args[3],args[4]);
			ctx.closePath();
			this._fillAndStroke(args[5],args[6],args[7],true);
		}
		this._clipRect=function(x,y,args){
			this.ctx.clipRect(x+args[0],y+args[1],args[2],args[3]);
		}
		this._fillRect=function(x,y,args){
			this.ctx.fillRect(x+args[0],y+args[1],args[2],args[3],args[4]);
		}
		this._drawCircle=function(x,y,args){
			var ctx=this.ctx;
			Render.isWebGL && ctx.setPathId(args[6]);
			Stat.drawCall++;
			ctx.beginPath();
			Render.isWebGL && ctx.movePath(args[0]+x,args[1]+y);
			ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
			ctx.closePath();
			this._fillAndStroke(args[3],args[4],args[5],true);
		}
		this._fillCircle=function(x,y,args){
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.fillStyle=args[3];
			ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
			ctx.fill();
		}
		this._setShader=function(x,y,args){
			this.ctx.setShader(args[0]);
		}
		this._drawLine=function(x,y,args){
			var ctx=this.ctx;
			Render.isWebGL && ctx.setPathId(args[6]);
			ctx.beginPath();
			ctx.strokeStyle=args[4];
			ctx.lineWidth=args[5];
			if (Render.isWebGL){
				ctx.movePath(x,y);
				ctx.moveTo(args[0],args[1]);
				ctx.lineTo(args[2],args[3]);
				}else {
				ctx.moveTo(x+args[0],y+args[1]);
				ctx.lineTo(x+args[2],y+args[3]);
			}
			ctx.stroke();
		}
		this._drawLines=function(x,y,args){
			var ctx=this.ctx;
			Render.isWebGL && ctx.setPathId(args[5]);
			ctx.beginPath();
			x+=args[0],y+=args[1];
			Render.isWebGL && ctx.movePath(x,y);
			ctx.strokeStyle=args[3];
			ctx.lineWidth=args[4];
			var points=args[2];
			var i=2,n=points.length;
			if (Render.isWebGL){
				ctx.moveTo(points[0],points[1]);
				while (i < n){
					ctx.lineTo(points[i++],points[i++]);
				}
				}else {
				ctx.moveTo(x+points[0],y+points[1]);
				while (i < n){
					ctx.lineTo(x+points[i++],y+points[i++]);
				}
			}
			ctx.stroke();
		}
		this._drawLinesWebGL=function(x,y,args){
			this.ctx.drawLines(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4]);
		}
		//x:Number,y:Number,points:Array,lineColor:String,lineWidth:Number=1
		this._drawCurves=function(x,y,args){
			this.ctx.drawCurves(x,y,args);
		}
		this._draw=function(x,y,args){
			args[0].call(null,this,x,y);
		}
		this._transformByMatrix=function(x,y,args){
			this.ctx.transformByMatrix(args[0]);
		}
		this._setTransform=function(x,y,args){
			this.ctx.setTransform(args[0],args[1],args[2],args[3],args[4],args[5]);
		}
		this._setTransformByMatrix=function(x,y,args){
			this.ctx.setTransformByMatrix(args[0]);
		}
		this._save=function(x,y,args){
			this.ctx.save();
		}
		this._restore=function(x,y,args){
			this.ctx.restore();
		}
		this._translate=function(x,y,args){
			this.ctx.translate(args[0],args[1]);
		}
		this._transform=function(x,y,args){
			this.ctx.translate(args[1]+x,args[2]+y);
			var mat=args[0];
			this.ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			this.ctx.translate(-x-args[1],-y-args[2]);
		}
		this._rotate=function(x,y,args){
			this.ctx.translate(args[1]+x,args[2]+y);
			this.ctx.rotate(args[0]);
			this.ctx.translate(-x-args[1],-y-args[2]);
		}
		this._scale=function(x,y,args){
			this.ctx.translate(args[2]+x,args[3]+y);
			this.ctx.scale(args[0],args[1]);
			this.ctx.translate(-x-args[2],-y-args[3]);
		}
		this._alpha=function(x,y,args){
			this.ctx.globalAlpha *=args[0];
		}
		this._setAlpha=function(x,y,args){
			this.ctx.globalAlpha=args[0];
		}
		this._fillText=function(x,y,args){
			this.ctx.fillText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5]);
		}
		this._strokeText=function(x,y,args){
			this.ctx.strokeText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6]);
		}
		this._fillBorderText=function(x,y,args){
			this.ctx.fillBorderText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
		}
		this._blendMode=function(x,y,args){
			this.ctx.globalCompositeOperation=args[0];
		}
		this._beginClip=function(x,y,args){
			this.ctx.beginClip && this.ctx.beginClip(x+args[0],y+args[1],args[2],args[3]);
		}
		this._setIBVB=function(x,y,args){
			this.ctx.setIBVB(args[0]+x,args[1]+y,args[2],args[3],args[4],args[5],args[6],args[7]);
		}
		this._fillTrangles=function(x,y,args){
			this.ctx.fillTrangles(args[0],args[1]+x,args[2]+y,args[3],args[4]);
		}
		//x:Number,y:Number,paths:Array,brush:Object=null,pen:Object=null
		this._drawPath=function(x,y,args){
			var ctx=this.ctx;
			Render.isWebGL && ctx.setPathId(-1);
			ctx.beginPath();
			x+=args[0],y+=args[1];
			Render.isWebGL && ctx.movePath(x,y);
			var paths=args[2];
			for (var i=0,n=paths.length;i < n;i++){
				var path=paths[i];
				switch (path[0]){
					case "moveTo":
						Render.isWebGL ? ctx.moveTo(path[1],path[2]):ctx.moveTo(x+path[1],y+path[2]);
						break ;
					case "lineTo":
						Render.isWebGL ? ctx.lineTo(path[1],path[2]):ctx.lineTo(x+path[1],y+path[2]);
						break ;
					case "arcTo":
						Render.isWebGL ? ctx.arcTo(path[1],path[2],path[3],path[4],path[5]):ctx.arcTo(x+path[1],y+path[2],x+path[3],y+path[4],path[5]);
						break ;
					case "closePath":
						ctx.closePath();
						break ;
					}
			};
			var brush=args[3];
			if (brush !=null){
				ctx.fillStyle=brush.fillStyle;
				ctx.fill();
			};
			var pen=args[4];
			if (pen !=null){
				ctx.strokeStyle=pen.strokeStyle;
				ctx.lineWidth=pen.lineWidth || 1;
				ctx.lineJoin=pen.lineJoin;
				ctx.lineCap=pen.lineCap;
				ctx.miterLimit=pen.miterLimit;
				ctx.stroke();
			}
		}
		// polygon(x:Number,y:Number,r:Number,edges:Number,color:uint,borderWidth:int=2,borderColor:uint=0)
		this.drawPoly=function(x,y,args){
			this.ctx.drawPoly(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4],args[5],args[6]);
		}
		//x:Number,y:Number,points:Array,fillColor:String,lineColor:String=null,lineWidth:Number=1
		this._drawPoly=function(x,y,args){
			var ctx=this.ctx;
			var points=args[2];
			var i=2,n=points.length;
			if (Render.isWebGL){
				ctx.setPathId(args[6]);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				ctx.movePath(x,y);
				ctx.moveTo(points[0],points[1]);
				while (i < n){
					ctx.lineTo(points[i++],points[i++]);
				}
				}else {
				ctx.beginPath();
				x+=args[0],y+=args[1];
				ctx.moveTo(x+points[0],y+points[1]);
				while (i < n){
					ctx.lineTo(x+points[i++],y+points[i++]);
				}
			}
			ctx.closePath();
			this._fillAndStroke(args[3],args[4],args[5],args[7]);
		}
		this._drawSkin=function(x,y,args){
			var tSprite=args[0];
			if (tSprite){
				var ctx=this.ctx;
				tSprite.render(ctx,x,y);
			}
		}
		this._drawParticle=function(x,y,args){
			this.ctx.drawParticle(x+this.x,y+this.y,args[0]);
		}
		this._setFilters=function(x,y,args){
			this.ctx.setFilters(args);
		}
		if (canvas){
			this.ctx=canvas.getContext('2d');
			}else {
			canvas=HTMLCanvas.create("3D");
			this.ctx=RunDriver.createWebGLContext2D(canvas);
			canvas._setContext(this.ctx);
		}
		canvas.size(width,height);
		this.canvas=canvas;
	}

	__class(RenderContext,'laya.renders.RenderContext');
	var __proto=RenderContext.prototype;
	/**销毁当前渲染环境*/
	__proto.destroy=function(){
		if (this.canvas){
			this.canvas.destroy();
			this.canvas=null;
			this.ctx=null;
		}
		if (this.ctx){
			this.ctx.destroy();
			this.ctx=null;
		}
	}

	__proto.drawTexture=function(tex,x,y,width,height){
		if (tex.loaded)this.ctx.drawTexture(tex,x,y,width,height,this.x,this.y);
	}

	__proto._drawTextures=function(x,y,args){
		if (args[0].loaded)this.ctx.drawTextures(args[0],args[1],x+this.x,y+this.y);
	}

	__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,alpha){
		if (tex.loaded)this.ctx.drawTextureWithTransform(tex,x,y,width,height,m,this.x,this.y,alpha);
	}

	__proto.fillQuadrangle=function(tex,x,y,point4,m){
		this.ctx.fillQuadrangle(tex,x,y,point4,m);
	}

	__proto.drawCanvas=function(canvas,x,y,width,height){
		this.ctx.drawCanvas(canvas,x+this.x,y+this.y,width,height);
	}

	__proto.drawRect=function(x,y,width,height,color,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var ctx=this.ctx;
		ctx.strokeStyle=color;
		ctx.lineWidth=lineWidth;
		ctx.strokeRect(x+this.x,y+this.y,width,height,lineWidth);
	}

	__proto._fillAndStroke=function(fillColor,strokeColor,lineWidth,isConvexPolygon){
		(isConvexPolygon===void 0)&& (isConvexPolygon=false);
		var ctx=this.ctx;
		if (fillColor !=null){
			ctx.fillStyle=fillColor;
			if (Render.isWebGL){
				ctx.fill(isConvexPolygon);
				}else {
				ctx.fill();
			}
		}
		if (strokeColor !=null && lineWidth > 0){
			ctx.strokeStyle=strokeColor;
			ctx.lineWidth=lineWidth;
			ctx.stroke();
		}
	}

	//ctx.translate(-x-args[0],-y-args[1]);
	__proto.clipRect=function(x,y,width,height){
		this.ctx.clipRect(x+this.x,y+this.y,width,height);
	}

	__proto.fillRect=function(x,y,width,height,fillStyle){
		this.ctx.fillRect(x+this.x,y+this.y,width,height,fillStyle);
	}

	__proto.drawCircle=function(x,y,radius,color,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		Stat.drawCall++;
		var ctx=this.ctx;
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=lineWidth;
		ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
		ctx.stroke();
	}

	/**
	*绘制三角形
	*@param x
	*@param y
	*@param tex
	*@param args [x,y,texture,vertices,indices,uvs,matrix]
	*/
	__proto.drawTriangles=function(x,y,args){
		if (Render.isWebGL){
			this.ctx.drawTriangles(args[0],x+args[1],y+args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9]);
			}else {
			var indices=args[5];
			var i=0,len=indices.length;
			var ctx=this.ctx;
			for (i=0;i < len;i+=3){
				var index0=indices[i] *2;
				var index1=indices[i+1] *2;
				var index2=indices[i+2] *2;
				ctx.drawTriangle(args[0],args[3],args[4],index0,index1,index2,args[6],true);
			}
		}
	}

	__proto.fillCircle=function(x,y,radius,color){
		Stat.drawCall++;
		var ctx=this.ctx;
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
		ctx.fill();
	}

	__proto.setShader=function(shader){
		this.ctx.setShader(shader);
	}

	__proto.drawLine=function(fromX,fromY,toX,toY,color,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var ctx=this.ctx;
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.lineWidth=lineWidth;
		ctx.moveTo(this.x+fromX,this.y+fromY);
		ctx.lineTo(this.x+toX,this.y+toY);
		ctx.stroke();
	}

	__proto.clear=function(){
		this.ctx.clear();
	}

	__proto.transformByMatrix=function(value){
		this.ctx.transformByMatrix(value);
	}

	__proto.setTransform=function(a,b,c,d,tx,ty){
		this.ctx.setTransform(a,b,c,d,tx,ty);
	}

	__proto.setTransformByMatrix=function(value){
		this.ctx.setTransformByMatrix(value);
	}

	__proto.save=function(){
		this.ctx.save();
	}

	__proto.restore=function(){
		this.ctx.restore();
	}

	__proto.translate=function(x,y){
		this.ctx.translate(x,y);
	}

	__proto.transform=function(a,b,c,d,tx,ty){
		this.ctx.transform(a,b,c,d,tx,ty);
	}

	__proto.rotate=function(angle){
		this.ctx.rotate(angle);
	}

	__proto.scale=function(scaleX,scaleY){
		this.ctx.scale(scaleX,scaleY);
	}

	__proto.alpha=function(value){
		this.ctx.globalAlpha *=value;
	}

	__proto.setAlpha=function(value){
		this.ctx.globalAlpha=value;
	}

	__proto.fillWords=function(words,x,y,font,color,underLine){
		(underLine===void 0)&& (underLine=0);
		this.ctx.fillWords(words,x,y,font,color,underLine);
	}

	/***@private */
	__proto.fillBorderWords=function(words,x,y,font,fillColor,borderColor,lineWidth){
		this.ctx.fillBorderWords(words,x,y,font,fillColor,borderColor,lineWidth);
	}

	__proto.fillText=function(text,x,y,font,color,textAlign){
		this.ctx.fillText(text,x+this.x,y+this.y,font,color,textAlign);
	}

	__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
		this.ctx.strokeText(text,x+this.x,y+this.y,font,color,lineWidth,textAlign);
	}

	__proto.blendMode=function(type){
		this.ctx.globalCompositeOperation=type;
	}

	__proto.flush=function(){
		this.ctx.flush && this.ctx.flush();
	}

	__proto.addRenderObject=function(o){
		this.ctx.addRenderObject(o);
	}

	__proto.beginClip=function(x,y,w,h){
		this.ctx.beginClip && this.ctx.beginClip(x,y,w,h);
	}

	__proto.endClip=function(){
		this.ctx.endClip && this.ctx.endClip();
	}

	__proto.fillTrangles=function(x,y,args){
		this.ctx.fillTrangles(args[0],args[1],args[2],args[3],args.length > 4 ? args[4] :null);
	}

	RenderContext.PI2=2 *Math.PI;
	return RenderContext;
})()


/**
*@private
*精灵渲染器
*/
//class laya.renders.RenderSprite
var RenderSprite=(function(){
	function RenderSprite(type,next){
		/**@private */
		//this._next=null;
		/**@private */
		//this._fun=null;
		this._next=next || RenderSprite.NORENDER;
		switch (type){
			case 0:
				this._fun=this._no;
				return;
			case 0x01:
				this._fun=this._image;
				return;
			case 0x02:
				this._fun=this._alpha;
				return;
			case 0x04:
				this._fun=this._transform;
				return;
			case 0x08:
				this._fun=this._blend;
				return;
			case 0x10:
				this._fun=this._canvas;
				return;
			case 0x40:
				this._fun=this._mask;
				return;
			case 0x80:
				this._fun=this._clip;
				return;
			case 0x100:
				this._fun=this._style;
				return;
			case 0x200:
				this._fun=this._graphics;
				return;
			case 0x800:
				this._fun=this._childs;
				return;
			case 0x400:
				this._fun=this._custom;
				return;
			case 0x01 | 0x200:
				this._fun=this._image2;
				return;
			case 0x01 | 0x04 | 0x200:
				this._fun=this._image2;
				return;
			case 0x20:
				this._fun=Filter._filter;
				return;
			case 0x11111:
				this._fun=RenderSprite._initRenderFun;
				return;
			}
		this.onCreate(type);
	}

	__class(RenderSprite,'laya.renders.RenderSprite');
	var __proto=RenderSprite.prototype;
	__proto.onCreate=function(type){}
	__proto._style=function(sprite,context,x,y){
		sprite._style.render(sprite,context,x,y);
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
	}

	__proto._no=function(sprite,context,x,y){}
	__proto._custom=function(sprite,context,x,y){
		sprite.customRender(context,x,y);
		var tf=sprite._style._tf;
		this._next._fun.call(this._next,sprite,context,x-tf.translateX,y-tf.translateY);
	}

	__proto._clip=function(sprite,context,x,y){
		var next=this._next;
		if (next==RenderSprite.NORENDER)return;
		var r=sprite._style.scrollRect;
		context.ctx.save();
		context.ctx.clipRect(x,y,r.width,r.height);
		next._fun.call(next,sprite,context,x-r.x,y-r.y);
		context.ctx.restore();
	}

	__proto._blend=function(sprite,context,x,y){
		var style=sprite._style;
		if (style.blendMode){
			context.ctx.globalCompositeOperation=style.blendMode;
		};
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
		context.ctx.globalCompositeOperation="source-over";
	}

	__proto._mask=function(sprite,context,x,y){
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
		var mask=sprite.mask;
		if (mask){
			context.ctx.globalCompositeOperation="destination-in";
			if (mask.numChildren > 0 || !mask.graphics._isOnlyOne()){
				mask.cacheAsBitmap=true;
			}
			mask.render(context,x-sprite.pivotX,y-sprite.pivotY);
		}
		context.ctx.globalCompositeOperation="source-over";
	}

	__proto._graphics=function(sprite,context,x,y){
		var tf=sprite._style._tf;
		sprite._graphics && sprite._graphics._render(sprite,context,x-tf.translateX,y-tf.translateY);
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
	}

	__proto._image=function(sprite,context,x,y){
		var style=sprite._style;
		context.ctx.drawTexture2(x,y,style._tf.translateX,style._tf.translateY,sprite.transform,style.alpha,style.blendMode,sprite._graphics._one);
	}

	__proto._image2=function(sprite,context,x,y){
		var tf=sprite._style._tf;
		context.ctx.drawTexture2(x,y,tf.translateX,tf.translateY,sprite.transform,1,null,sprite._graphics._one);
	}

	__proto._alpha=function(sprite,context,x,y){
		var style=sprite._style;
		var alpha;
		if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
			var temp=context.ctx.globalAlpha;
			context.ctx.globalAlpha *=alpha;
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			context.ctx.globalAlpha=temp;
		}
	}

	__proto._transform=function(sprite,context,x,y){
		var transform=sprite.transform,_next=this._next;
		if (transform && _next !=RenderSprite.NORENDER){
			context.save();
			context.transform(transform.a,transform.b,transform.c,transform.d,transform.tx+x,transform.ty+y);
			_next._fun.call(_next,sprite,context,0,0);
			context.restore();
		}else
		_next._fun.call(_next,sprite,context,x,y);
	}

	__proto._childs=function(sprite,context,x,y){
		var style=sprite._style;
		var tf=style._tf;
		x=x-tf.translateX+style.paddingLeft;
		y=y-tf.translateY+style.paddingTop;
		if (style._calculation){
			var words=sprite._getWords();
			if (words){
				var tStyle=style;
				if (tStyle){
					if (tStyle.stroke){
						context.fillBorderWords(words,x,y,tStyle.font,tStyle.color,tStyle.strokeColor,tStyle.stroke);
						}else{
						context.fillWords(words,x,y,tStyle.font,tStyle.color,(tStyle.textDecoration!="none"&&tStyle.underLine)?1:0);
					}
				}
			}
		};
		var childs=sprite._childs,n=childs.length,ele;
		if (sprite.viewport || (sprite.optimizeScrollRect && sprite._style.scrollRect)){
			var rect=sprite.viewport || sprite._style.scrollRect;
			var left=rect.x;
			var top=rect.y;
			var right=rect.right;
			var bottom=rect.bottom;
			var _x=NaN,_y=NaN;
			for (i=0;i < n;++i){
				if ((ele=childs [i]).visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top)){
					ele.render(context,x,y);
				}
			}
			}else {
			for (var i=0;i < n;++i)
			(ele=(childs [i]))._style.visible && ele.render(context,x,y);
		}
	}

	//}
	__proto._canvas=function(sprite,context,x,y){
		var _cacheCanvas=sprite._$P.cacheCanvas;
		if (!_cacheCanvas){
			this._next._fun.call(this._next,sprite,context,x,y);
			return;
		}
		_cacheCanvas.type==='bitmap' ? (Stat.canvasBitmap++):(Stat.canvasNormal++);
		var tx=_cacheCanvas.ctx;
		if (sprite._needRepaint()|| !tx){
			this._canvas_repaint(sprite,context,x,y);
		}
		else{
			var tRec=_cacheCanvas._cacheRec;
			context.drawCanvas(tx.canvas,x+tRec.x,y+tRec.y,tRec.width,tRec.height);
		}
	}

	__proto._canvas_repaint=function(sprite,context,x,y){
		var _cacheCanvas=sprite._$P.cacheCanvas;
		var _next=this._next;
		if (!_cacheCanvas){
			_next._fun.call(_next,sprite,tx,x,y);
			return;
		};
		var tx=_cacheCanvas.ctx;
		var _repaint=sprite._needRepaint()|| (!tx);
		var canvas;
		var left;
		var top;
		var tRec;
		var tCacheType=_cacheCanvas.type;
		tCacheType==='bitmap' ? (Stat.canvasBitmap++):(Stat.canvasNormal++);
		if (_repaint){
			if (!_cacheCanvas._cacheRec)
				_cacheCanvas._cacheRec=new Rectangle();
			var w,h;
			if (!Render.isWebGL || tCacheType==="bitmap"){
				tRec=sprite.getSelfBounds();
				tRec.x=tRec.x-sprite.pivotX;
				tRec.y=tRec.y-sprite.pivotY;
				tRec.x=tRec.x-16;
				tRec.y=tRec.y-16;
				tRec.width=tRec.width+32;
				tRec.height=tRec.height+32;
				tRec.x=Math.floor(tRec.x+x)-x;
				tRec.y=Math.floor(tRec.y+y)-y;
				tRec.width=Math.floor(tRec.width);
				tRec.height=Math.floor(tRec.height);
				_cacheCanvas._cacheRec.copyFrom(tRec);
				}else{
				_cacheCanvas._cacheRec.setTo(-sprite.pivotX,-sprite.pivotY,1,1);
			}
			tRec=_cacheCanvas._cacheRec;
			var scaleX=Render.isWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleX;
			var scaleY=Render.isWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleY;
			if (!Render.isWebGL){
				var chainScaleX=1;
				var chainScaleY=1;
				var tar;
				tar=sprite;
				while (tar && tar !=Laya.stage){
					chainScaleX *=tar.scaleX;
					chainScaleY *=tar.scaleY;
					tar=tar.parent;
				}
				if (Render.isWebGL){
					if (chainScaleX < 1)scaleX *=chainScaleX;
					if (chainScaleY < 1)scaleY *=chainScaleY;
					}else {
					if (chainScaleX > 1)scaleX *=chainScaleX;
					if (chainScaleY > 1)scaleY *=chainScaleY;
				}
			}
			if (sprite.scrollRect){
				var scrollRect=sprite.scrollRect;
				tRec.x-=scrollRect.x;
				tRec.y-=scrollRect.y;
			}
			w=tRec.width *scaleX;
			h=tRec.height *scaleY;
			left=tRec.x;
			top=tRec.y;
			if (Render.isWebGL && tCacheType==='bitmap' && (w > 2048 || h > 2048)){
				console.warn("cache bitmap size larger than 2048,cache ignored");
				if (_cacheCanvas.ctx){
					Pool.recover("RenderContext",_cacheCanvas.ctx);
					_cacheCanvas.ctx.canvas.size(0,0);
					_cacheCanvas.ctx=null;
				}
				_next._fun.call(_next,sprite,context,x,y);
				return;
			}
			if (!tx){
				tx=_cacheCanvas.ctx=Pool.getItem("RenderContext")|| new RenderContext(w,h,HTMLCanvas.create(/*laya.resource.HTMLCanvas.TYPEAUTO*/"AUTO"));
			}
			tx.ctx.sprite=sprite;
			canvas=tx.canvas;
			canvas.clear();
			(canvas.width !=w || canvas.height !=h)&& canvas.size(w,h);
			if (tCacheType==='bitmap')canvas.context.asBitmap=true;
			else if(tCacheType==='normal')canvas.context.asBitmap=false;
			var t;
			if (scaleX !=1 || scaleY !=1){
				var ctx=(tx).ctx;
				ctx.save();
				ctx.scale(scaleX,scaleY);
				if (!Render.isConchWebGL && Render.isConchApp){
					t=sprite._$P.cf;
					t && ctx.setFilterMatrix && ctx.setFilterMatrix(t._mat,t._alpha);
				}
				_next._fun.call(_next,sprite,tx,-left,-top);
				ctx.restore();
				if (!Render.isConchApp || Render.isConchWebGL)sprite._applyFilters();
				}else {
				ctx=(tx).ctx;
				if (!Render.isConchWebGL && Render.isConchApp){
					t=sprite._$P.cf;
					t && ctx.setFilterMatrix && ctx.setFilterMatrix(t._mat,t._alpha);
				}
				_next._fun.call(_next,sprite,tx,-left,-top);
				if (!Render.isConchApp || Render.isConchWebGL)sprite._applyFilters();
			}
			if (sprite._$P.staticCache)_cacheCanvas.reCache=false;
			Stat.canvasReCache++;
			}else {
			tRec=_cacheCanvas._cacheRec;
			left=tRec.x;
			top=tRec.y;
			canvas=tx.canvas;
		}
		context.drawCanvas(canvas,x+left,y+top,tRec.width,tRec.height);
	}

	RenderSprite.__init__=function(){
		var i=0,len=0;
		var initRender;
		initRender=RunDriver.createRenderSprite(0x11111,null);
		len=RenderSprite.renders.length=0x800 *2;
		for (i=0;i < len;i++)
		RenderSprite.renders[i]=initRender;
		RenderSprite.renders[0]=RunDriver.createRenderSprite(0,null);
		function _initSame (value,o){
			var n=0;
			for (var i=0;i < value.length;i++){
				n |=value[i];
				RenderSprite.renders[n]=o;
			}
		}
		_initSame([0x01,0x200,0x04,0x02],new RenderSprite(0x01,null));
		RenderSprite.renders[0x01 | 0x200]=RunDriver.createRenderSprite(0x01 | 0x200,null);
		RenderSprite.renders[0x01 | 0x04 | 0x200]=new RenderSprite(0x01 | 0x04 | 0x200,null);
	}

	RenderSprite._initRenderFun=function(sprite,context,x,y){
		var type=sprite._renderType;
		var r=RenderSprite.renders[type]=RenderSprite._getTypeRender(type);
		r._fun(sprite,context,x,y);
	}

	RenderSprite._getTypeRender=function(type){
		var rst=null;
		var tType=0x800;
		while (tType > 1){
			if (tType & type)
				rst=RunDriver.createRenderSprite(tType,rst);
			tType=tType >> 1;
		}
		return rst;
	}

	RenderSprite.IMAGE=0x01;
	RenderSprite.ALPHA=0x02;
	RenderSprite.TRANSFORM=0x04;
	RenderSprite.BLEND=0x08;
	RenderSprite.CANVAS=0x10;
	RenderSprite.FILTERS=0x20;
	RenderSprite.MASK=0x40;
	RenderSprite.CLIP=0x80;
	RenderSprite.STYLE=0x100;
	RenderSprite.GRAPHICS=0x200;
	RenderSprite.CUSTOM=0x400;
	RenderSprite.CHILDS=0x800;
	RenderSprite.INIT=0x11111;
	RenderSprite.renders=[];
	RenderSprite.NORENDER=new RenderSprite(0,null);
	return RenderSprite;
})()


/**
*@private
*Context扩展类
*/
//class laya.resource.Context
var Context=(function(){
	function Context(){
		/***@private */
		//this._canvas=null;
		this._repaint=false;
	}

	__class(Context,'laya.resource.Context');
	var __proto=Context.prototype;
	__proto.replaceReset=function(){
		var i=0,len=0;
		len=Context.replaceKeys.length;
		var key;
		for (i=0;i < len;i++){
			key=Context.replaceKeys[i];
			this[Context.newKeys[i]]=this[key];
		}
	}

	__proto.replaceResotre=function(){
		/*__JS__ */this.__restore();
		/*__JS__ */this.__reset();
	}

	__proto.setIsMainContext=function(){}
	__proto.drawTextures=function(tex,pos,tx,ty){
		Stat.drawCall+=pos.length / 2;
		var w=tex.width;
		var h=tex.height;
		for (var i=0,sz=pos.length;i < sz;i+=2){
			this.drawTexture(tex,pos[i],pos[i+1],w,h,tx,ty);
		}
	}

	/***@private */
	__proto.drawCanvas=function(canvas,x,y,width,height){
		Stat.drawCall++;
		this.drawImage(canvas.source,x,y,width,height);
	}

	/***@private */
	__proto.fillRect=function(x,y,width,height,style){
		Stat.drawCall++;
		style && (this.fillStyle=style);
		/*__JS__ */this.__fillRect(x,y,width,height);
	}

	/***@private */
	__proto.fillText=function(text,x,y,font,color,textAlign){
		Stat.drawCall++;
		if (arguments.length > 3 && (typeof font=='string')){
			this.font=font;
			this.fillStyle=color;
			/*__JS__ */this.textAlign=textAlign;
			this.textBaseline="top";
		}
		if ((typeof font=='number')){
			/*__JS__ */this.__fillText(text,x,y,font);
			}else{
			/*__JS__ */this.__fillText(text,x,y);
		}
	}

	/***@private */
	__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
		Stat.drawCall++;
		this.font=font;
		this.fillStyle=fillColor;
		this.textBaseline="top";
		/*__JS__ */this.strokeStyle=borderColor;
		/*__JS__ */this.lineWidth=lineWidth;
		/*__JS__ */this.textAlign=textAlign;
		/*__JS__ */this.__strokeText(text,x,y);
		/*__JS__ */this.__fillText(text,x,y);
	}

	/***@private */
	__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
		Stat.drawCall++;
		if (arguments.length > 3 && (typeof font=='string')){
			this.font=font;
			/*__JS__ */this.strokeStyle=color;
			/*__JS__ */this.lineWidth=lineWidth;
			/*__JS__ */this.textAlign=textAlign;
			this.textBaseline="top";
		}
		if ((typeof font=='number')){
			/*__JS__ */this.__strokeText(text,x,y,font);
		}else
		/*__JS__ */this.__strokeText(text,x,y);
	}

	/***@private */
	__proto.transformByMatrix=function(value){
		this.transform(value.a,value.b,value.c,value.d,value.tx,value.ty);
	}

	/***@private */
	__proto.setTransformByMatrix=function(value){
		this.setTransform(value.a,value.b,value.c,value.d,value.tx,value.ty);
	}

	/***@private */
	__proto.clipRect=function(x,y,width,height){
		Stat.drawCall++;
		this.beginPath();
		this.rect(x,y,width,height);
		this.clip();
	}

	/***@private */
	__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
		Stat.drawCall++;
		var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
		this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx,y+ty,width,height);
	}

	/***@private */
	__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,tx,ty,alpha){
		Stat.drawCall++;
		var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
		this.save();
		alpha !=1 && (this.globalAlpha *=alpha);
		if (m){
			this.transform(m.a,m.b,m.c,m.d,m.tx+tx,m.ty+ty);
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x ,y,width,height);
			}else {
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx ,y+ty,width,height);
		}
		this.restore();
	}

	/***@private */
	__proto.drawTexture2=function(x,y,pivotX,pivotY,m,alpha,blendMode,args2){
		var tex=args2[0];
		if (!(tex.loaded && tex.bitmap && tex.source)){
			return;
		}
		Stat.drawCall++;
		var alphaChanged=alpha!==1;
		if (alphaChanged){
			var temp=this.globalAlpha;
			this.globalAlpha *=alpha;
		};
		var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
		if (m){
			this.save();
			this.transform(m.a,m.b,m.c,m.d,m.tx+x,m.ty+y);
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX ,args2[2]-pivotY,args2[3],args2[4]);
			this.restore();
			}else {
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+x ,args2[2]-pivotY+y,args2[3],args2[4]);
		}
		if (alphaChanged)this.globalAlpha=temp;
	}

	__proto.fillTexture=function(texture,x,y,width,height,type,offset,other){
		if (!other.pat){
			if (texture.uv !=Texture.DEF_UV){
				var canvas=new HTMLCanvas("2D");
				canvas.getContext('2d');
				canvas.size(texture.width,texture.height);
				canvas.context.drawTexture(texture,0,0,texture.width,texture.height,0,0);
				texture=new Texture(canvas);
			}
			other.pat=this.createPattern(texture.bitmap.source,type);
		};
		var oX=x,oY=y;
		var sX=0,sY=0;
		if (offset){
			oX+=offset.x % texture.width;
			oY+=offset.y % texture.height;
			sX-=offset.x % texture.width;
			sY-=offset.y % texture.height;
		}
		this.translate(oX,oY);
		this.fillRect(sX,sY,width,height,other.pat);
		this.translate(-oX,-oY);
	}

	__proto.drawTriangle=function(texture,vertices,uvs,index0,index1,index2,matrix,canvasPadding){
		var source=texture.bitmap;
		var textureSource=source.source;
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var sourceWidth=source.width;
		var sourceHeight=source.height;
		var u0=uvs[index0] *sourceWidth;
		var u1=uvs[index1] *sourceWidth;
		var u2=uvs[index2] *sourceWidth;
		var v0=uvs[index0+1] *sourceHeight;
		var v1=uvs[index1+1] *sourceHeight;
		var v2=uvs[index2+1] *sourceHeight;
		var x0=vertices[index0];
		var x1=vertices[index1];
		var x2=vertices[index2];
		var y0=vertices[index0+1];
		var y1=vertices[index1+1];
		var y2=vertices[index2+1];
		if (canvasPadding){
			var paddingX=1;
			var paddingY=1;
			var centerX=(x0+x1+x2)/ 3;
			var centerY=(y0+y1+y2)/ 3;
			var normX=x0-centerX;
			var normY=y0-centerY;
			var dist=Math.sqrt((normX *normX)+(normY *normY));
			x0=centerX+((normX / dist)*(dist+paddingX));
			y0=centerY+((normY / dist)*(dist+paddingY));
			normX=x1-centerX;
			normY=y1-centerY;
			dist=Math.sqrt((normX *normX)+(normY *normY));
			x1=centerX+((normX / dist)*(dist+paddingX));
			y1=centerY+((normY / dist)*(dist+paddingY));
			normX=x2-centerX;
			normY=y2-centerY;
			dist=Math.sqrt((normX *normX)+(normY *normY));
			x2=centerX+((normX / dist)*(dist+paddingX));
			y2=centerY+((normY / dist)*(dist+paddingY));
		}
		this.save();
		if (matrix)
			this.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
		this.beginPath();
		this.moveTo(x0,y0);
		this.lineTo(x1,y1);
		this.lineTo(x2,y2);
		this.closePath();
		this.clip();
		var delta=(u0 *v1)+(v0 *u2)+(u1 *v2)-(v1 *u2)-(v0 *u1)-(u0 *v2);
		var dDelta=1 / delta;
		var deltaA=(x0 *v1)+(v0 *x2)+(x1 *v2)-(v1 *x2)-(v0 *x1)-(x0 *v2);
		var deltaB=(u0 *x1)+(x0 *u2)+(u1 *x2)-(x1 *u2)-(x0 *u1)-(u0 *x2);
		var deltaC=(u0 *v1 *x2)+(v0 *x1 *u2)+(x0 *u1 *v2)-(x0 *v1 *u2)-(v0 *u1 *x2)-(u0 *x1 *v2);
		var deltaD=(y0 *v1)+(v0 *y2)+(y1 *v2)-(v1 *y2)-(v0 *y1)-(y0 *v2);
		var deltaE=(u0 *y1)+(y0 *u2)+(u1 *y2)-(y1 *u2)-(y0 *u1)-(u0 *y2);
		var deltaF=(u0 *v1 *y2)+(v0 *y1 *u2)+(y0 *u1 *v2)-(y0 *v1 *u2)-(v0 *u1 *y2)-(u0 *y1 *v2);
		this.transform(deltaA *dDelta,deltaD *dDelta,deltaB *dDelta,deltaE *dDelta,deltaC *dDelta,deltaF *dDelta);
		this.drawImage(textureSource,texture.uv[0] *sourceWidth,texture.uv[1] *sourceHeight,textureWidth,textureHeight,texture.uv[0] *sourceWidth,texture.uv[1] *sourceHeight,textureWidth,textureHeight);
		this.restore();
	}

	/***@private */
	__proto.flush=function(){
		return 0;
	}

	/***@private */
	__proto.fillWords=function(words,x,y,font,color,underLine){
		font && (this.font=font);
		color && (this.fillStyle=color);
		var _this=this;
		this.textBaseline="top";
		/*__JS__ */this.textAlign='left';
		for (var i=0,n=words.length;i < n;i++){
			var a=words[i];
			/*__JS__ */this.__fillText(a.char,a.x+x,a.y+y);
			if (underLine===1){
				var tHeight=a.height;
				var dX=a.style.letterSpacing*0.5;
				if (!dX)dX=0;
				this.beginPath();
				this.strokeStyle=color;
				this.lineWidth=1;
				this.moveTo(x+a.x-dX+0.5,y+a.y+tHeight+0.5);
				this.lineTo(x+a.x+a.width+dX+0.5,y+a.y+tHeight+0.5);
				this.stroke();
			}
		}
	}

	/***@private */
	__proto.fillBorderWords=function(words,x,y,font,color,borderColor,lineWidth){
		font && (this.font=font);
		color && (this.fillStyle=color);
		this.textBaseline="top";
		/*__JS__ */this.lineWidth=lineWidth;
		/*__JS__ */this.textAlign='left';
		/*__JS__ */this.strokeStyle=borderColor;
		for (var i=0,n=words.length;i < n;i++){
			var a=words[i];
			/*__JS__ */this.__strokeText(a.char,a.x+x,a.y+y);
			/*__JS__ */this.__fillText(a.char,a.x+x,a.y+y);
		}
	}

	/***@private */
	__proto.destroy=function(){
		/*__JS__ */this.canvas.width=this.canvas.height=0;
	}

	/***@private */
	__proto.clear=function(){
		this.clearRect(0,0,this._canvas.width,this._canvas.height);
		this._repaint=false;
	}

	__proto.drawCurves=function(x,y,args){
		this.beginPath();
		this.strokeStyle=args[3];
		this.lineWidth=args[4];
		var points=args[2];
		x+=args[0],y+=args[1];
		this.moveTo(x+points[0],y+points[1]);
		var i=2,n=points.length;
		while (i < n){
			this.quadraticCurveTo(x+points[i++],y+points[i++],x+points[i++],y+points[i++]);
		}
		this.stroke();
	}

	Context.__init__=function(to){
		var from=laya.resource.Context.prototype;
		to=to || /*__JS__ */window.CanvasRenderingContext2D.prototype;
		if (to.inited)return;
		to.inited=true;
		to.__fillText=to.fillText;
		to.__fillRect=to.fillRect;
		to.__strokeText=to.strokeText;
		var funs=['drawTextures',"drawTriangle",'fillWords','fillBorderWords','setIsMainContext','fillRect','strokeText','fillTexture','fillText','transformByMatrix','setTransformByMatrix','clipRect','drawTexture','drawTexture2','drawTextureWithTransform','flush','clear','destroy','drawCanvas','fillBorderText','drawCurves'];
		funs.forEach(function(i){
			to[i]=from[i];
		});
	}

	Context.replaceCanvasGetSet=function(tar,key){
		var oldO=/*__JS__ */Object.getOwnPropertyDescriptor(tar,key);
		if (!oldO||!oldO.configurable)return false;
		var newO={};
		var tkey;
		for (tkey in oldO){
			if (tkey !="set"){
				newO[tkey]=oldO[tkey];
			}
		};
		var preFun=oldO["set"];
		newO["set"]=function (v){
			var _self=/*__JS__ */this;
			preFun.call(_self,v);
			var _ct=_self.getContext("2d");
			if (_ct && "__reset" in _ct){
				_ct.__reset();
			}
		}
		/*__JS__ */Object.defineProperty(tar,key,newO);
		return true;
	}

	Context.replaceGetSet=function(tar,key){
		var oldO=/*__JS__ */Object.getOwnPropertyDescriptor(tar,key);
		if (!oldO||!oldO.configurable)return false;
		var newO={};
		var tkey;
		for (tkey in oldO){
			if (tkey !="set"){
				newO[tkey]=oldO[tkey];
			}
		};
		var preFun=oldO["set"];
		var dataKey="___"+key+"__";
		Context.newKeys.push(dataKey);
		newO["set"]=function (v){
			var _self=/*__JS__ */this;
			if (v !=_self[dataKey]){
				_self[dataKey]=v;
				preFun.call(_self,v);
			}
		}
		/*__JS__ */Object.defineProperty(tar,key,newO);
		return true;
	}

	Context._default=new Context();
	Context.newKeys=[];
	__static(Context,
	['replaceKeys',function(){return this.replaceKeys=["font","fillStyle","textBaseline"];}
	]);
	return Context;
})()


/**
*@private
*<code>ResourceManager</code> 是资源管理类。它用于资源的载入、获取、销毁。
*/
//class laya.resource.ResourceManager
var ResourceManager=(function(){
	function ResourceManager(name){
		/**唯一标识ID。*/
		this._id=0;
		/**名字。*/
		this._name=null;
		/**所管理资源。*/
		this._resources=null;
		/**所管理资源的累计内存,以字节为单位。*/
		this._memorySize=0;
		/**垃圾回收比例，范围是0到1。*/
		this._garbageCollectionRate=NaN;
		/**自动释放机制中内存是否溢出。*/
		this._isOverflow=false;
		/**是否启用自动释放机制。*/
		this.autoRelease=false;
		/**自动释放机制的内存触发上限,以字节为单位。*/
		this.autoReleaseMaxSize=0;
		this._id=++ResourceManager._uniqueIDCounter;
		this._name=name ? name :"Content Manager";
		ResourceManager._isResourceManagersSorted=false;
		this._memorySize=0;
		this._isOverflow=false;
		this.autoRelease=false;
		this.autoReleaseMaxSize=1024 *1024 *512;
		this._garbageCollectionRate=0.2;
		ResourceManager._resourceManagers.push(this);
		this._resources=[];
	}

	__class(ResourceManager,'laya.resource.ResourceManager');
	var __proto=ResourceManager.prototype;
	Laya.imps(__proto,{"laya.resource.IDispose":true})
	/**
	*获取指定索引的资源 Resource 对象。
	*@param 索引。
	*@return 资源 Resource 对象。
	*/
	__proto.getResourceByIndex=function(index){
		return this._resources[index];
	}

	/**
	*获取此管理器所管理的资源个数。
	*@return 资源个数。
	*/
	__proto.getResourcesLength=function(){
		return this._resources.length;
	}

	/**
	*添加指定资源。
	*@param resource 需要添加的资源 Resource 对象。
	*@return 是否添加成功。
	*/
	__proto.addResource=function(resource){
		if (resource.resourceManager)
			resource.resourceManager.removeResource(resource);
		var index=this._resources.indexOf(resource);
		if (index===-1){
			resource._resourceManager=this;
			this._resources.push(resource);
			this.addSize(resource.memorySize);
			return true;
		}
		return false;
	}

	/**
	*移除指定资源。
	*@param resource 需要移除的资源 Resource 对象
	*@return 是否移除成功。
	*/
	__proto.removeResource=function(resource){
		var index=this._resources.indexOf(resource);
		if (index!==-1){
			this._resources.splice(index,1);
			resource._resourceManager=null;
			this._memorySize-=resource.memorySize;
			return true;
		}
		return false;
	}

	/**
	*卸载此资源管理器载入的资源。
	*/
	__proto.unload=function(){
		var tempResources=this._resources.slice(0,this._resources.length);
		for (var i=0;i < tempResources.length;i++){
			var resource=tempResources[i];
			resource.destroy();
		}
		tempResources.length=0;
	}

	/**释放资源。*/
	__proto.dispose=function(){
		if (this===ResourceManager._systemResourceManager)
			throw new Error("systemResourceManager不能被释放！");
		ResourceManager._resourceManagers.splice(ResourceManager._resourceManagers.indexOf(this),1);
		ResourceManager._isResourceManagersSorted=false;
		var tempResources=this._resources.slice(0,this._resources.length);
		for (var i=0;i < tempResources.length;i++){
			var resource=tempResources[i];
			resource.resourceManager.removeResource(resource);
			resource.destroy();
		}
		tempResources.length=0;
	}

	/**
	*增加内存。
	*@param add 需要增加的内存大小。
	*/
	__proto.addSize=function(add){
		if (add){
			if (this.autoRelease && add > 0)
				((this._memorySize+add)> this.autoReleaseMaxSize)&& (this.garbageCollection((1-this._garbageCollectionRate)*this.autoReleaseMaxSize));
			this._memorySize+=add;
		}
	}

	/**
	*垃圾回收。
	*@param reserveSize 保留尺寸。
	*/
	__proto.garbageCollection=function(reserveSize){
		var all=this._resources;
		all=all.slice();
		all.sort(function(a,b){
			if (!a || !b)
				throw new Error("a或b不能为空！");
			if (a.released && b.released)
				return 0;
			else if (a.released)
			return 1;
			else if (b.released)
			return-1;
			return a._lastUseFrameCount-b._lastUseFrameCount;
		});
		var currentFrameCount=Stat.loopCount;
		for (var i=0,n=all.length;i < n;i++){
			var resou=all[i];
			if (currentFrameCount-resou._lastUseFrameCount > 1){
				resou.releaseResource();
				}else {
				if (this._memorySize >=reserveSize)
					this._isOverflow=true;
				return;
			}
			if (this._memorySize < reserveSize){
				this._isOverflow=false;
				return;
			}
		}
	}

	/**
	*唯一标识 ID 。
	*/
	__getset(0,__proto,'id',function(){
		return this._id;
	});

	/**
	*名字。
	*/
	__getset(0,__proto,'name',function(){
		return this._name;
		},function(value){
		if ((value || value!=="")&& this._name!==value){
			this._name=value;
			ResourceManager._isResourceManagersSorted=false;
		}
	});

	/**
	*此管理器所管理资源的累计内存，以字节为单位。
	*/
	__getset(0,__proto,'memorySize',function(){
		return this._memorySize;
	});

	/**
	*系统资源管理器。
	*/
	__getset(1,ResourceManager,'systemResourceManager',function(){
		return ResourceManager._systemResourceManager;
	});

	ResourceManager.__init__=function(){
		ResourceManager.currentResourceManager=ResourceManager.systemResourceManager;
	}

	ResourceManager.getLoadedResourceManagerByIndex=function(index){
		return ResourceManager._resourceManagers[index];
	}

	ResourceManager.getLoadedResourceManagersCount=function(){
		return ResourceManager._resourceManagers.length;
	}

	ResourceManager.recreateContentManagers=function(force){
		(force===void 0)&& (force=false);
		var temp=ResourceManager.currentResourceManager;
		for (var i=0;i < ResourceManager._resourceManagers.length;i++){
			ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
			for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
				ResourceManager.currentResourceManager._resources[j].releaseResource(force);
				ResourceManager.currentResourceManager._resources[j].activeResource(force);
			}
		}
		ResourceManager.currentResourceManager=temp;
	}

	ResourceManager.releaseContentManagers=function(force){
		(force===void 0)&& (force=false);
		var temp=ResourceManager.currentResourceManager;
		for (var i=0;i < ResourceManager._resourceManagers.length;i++){
			ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
			for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
				var resource=ResourceManager.currentResourceManager._resources[j];
				(!resource.released)&& (resource.releaseResource(force));
			}
		}
		ResourceManager.currentResourceManager=temp;
	}

	ResourceManager._uniqueIDCounter=0;
	ResourceManager._isResourceManagersSorted=false;
	ResourceManager._resourceManagers=[];
	__static(ResourceManager,
	['_systemResourceManager',function(){return this._systemResourceManager=new ResourceManager("System Resource Manager");},'currentResourceManager',function(){return this.currentResourceManager=ResourceManager._systemResourceManager;}
	]);
	return ResourceManager;
})()


/**
*@private
*/
//class laya.system.System
var System=(function(){
	function System(){}
	__class(System,'laya.system.System');
	System.changeDefinition=function(name,classObj){
		Laya[name]=classObj;
		var str=name+"=classObj";
		Laya._runScript(str);
	}

	System.__init__=function(){
		if (Render.isConchApp){
			/*__JS__ */conch.disableConchResManager();
			/*__JS__ */conch.disableConchAutoRestoreLostedDevice();
		}
	}

	return System;
})()


SoundManager;
/**
*<code>Browser</code> 是浏览器代理类。封装浏览器及原生 js 提供的一些功能。
*/
//class laya.utils.Browser
var Browser=(function(){
	function Browser(){}
	__class(Browser,'laya.utils.Browser');
	/**设备像素比。*/
	__getset(1,Browser,'pixelRatio',function(){
		Browser.__init__();
		if (Browser.userAgent.indexOf("Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)")>-1)return 2;
		return RunDriver.getPixelRatio();
	});

	/**浏览器窗口物理高度，其值等于clientHeight *pixelRatio，并且浏览器发生反转之后，宽高会互换。*/
	__getset(1,Browser,'height',function(){
		Browser.__init__();
		return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientWidth :Browser.clientHeight)*Browser.pixelRatio;
	});

	/**
	*浏览器窗口可视宽度。
	*通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerWidth(包含滚动条宽度)> document.body.clientWidth(不包含滚动条宽度)，如果前者为0或为空，则选择后者。
	*/
	__getset(1,Browser,'clientWidth',function(){
		Browser.__init__();
		return Browser.window.innerWidth || Browser.document.body.clientWidth;
	});

	/**浏览器原生 window 对象的引用。*/
	__getset(1,Browser,'window',function(){
		Browser.__init__();
		return Browser._window;
	});

	/**
	*浏览器窗口可视高度。
	*通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerHeight(包含滚动条高度)> document.body.clientHeight(不包含滚动条高度)> document.documentElement.clientHeight(不包含滚动条高度)，如果前者为0或为空，则选择后者。
	*/
	__getset(1,Browser,'clientHeight',function(){
		Browser.__init__();
		return Browser.window.innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight;
	});

	/**浏览器窗口物理宽度，其值等于clientWidth *pixelRatio，并且浏览器发生反转之后，宽高会互换。*/
	__getset(1,Browser,'width',function(){
		Browser.__init__();
		return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientHeight :Browser.clientWidth)*Browser.pixelRatio;
	});

	/**画布容器，用来盛放画布的容器。方便对画布进行控制*/
	__getset(1,Browser,'container',function(){
		Browser.__init__();
		if (!Browser._container){
			Browser._container=Browser.createElement("div");
			Browser._container.id="layaContainer";
			Browser.document.body.appendChild(Browser._container);
		}
		return Browser._container;
		},function(value){
		Browser._container=value;
	});

	/**浏览器原生 document 对象的引用。*/
	__getset(1,Browser,'document',function(){
		Browser.__init__();
		return Browser._document;
	});

	Browser.__init__=function(){
		SoundManager;
		if (Browser._window)return;
		Browser._window=RunDriver.getWindow();
		Browser._document=Browser.window.document;
		Browser._window.addEventListener('message',function(e){
			laya.utils.Browser._onMessage(e);
		},false);
		/*__JS__ */Browser.document.__createElement=Browser.document.createElement;
		/*__JS__ */window.requestAnimationFrame=window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (c){return window.setTimeout(c,1000 / 60);};;
		/*__JS__ */var $BS=window.document.body.style;$BS['-webkit-user-select']='none';$BS['-webkit-tap-highlight-color']='rgba(200,200,200,0)';;
		Browser.userAgent=/*[SAFE]*/ Browser.window.navigator.userAgent;
		Browser.u=/*[SAFE]*/ Browser.userAgent;
		Browser.onIOS=/*[SAFE]*/ !!Browser.u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
		Browser.onMobile=/*[SAFE]*/ Browser.u.indexOf("Mobile")>-1;
		Browser.onIPhone=/*[SAFE]*/ Browser.u.indexOf("iPhone")>-1;
		Browser.onMac=/*[SAFE]*/ Browser.u.indexOf("Mac OS X")>-1;
		Browser.onIPad=/*[SAFE]*/ Browser.u.indexOf("iPad")>-1;
		Browser.onAndroid=/*[SAFE]*/ Browser.u.indexOf('Android')>-1 || Browser.u.indexOf('Adr')>-1;
		Browser.onWP=/*[SAFE]*/ Browser.u.indexOf("Windows Phone")>-1;
		Browser.onQQBrowser=/*[SAFE]*/ Browser.u.indexOf("QQBrowser")>-1;
		Browser.onMQQBrowser=/*[SAFE]*/ Browser.u.indexOf("MQQBrowser")>-1 || (Browser.u.indexOf("Mobile")>-1 && Browser.u.indexOf("QQ")>-1);
		Browser.onIE=/*[SAFE]*/ !!Browser.window.ActiveXObject || "ActiveXObject" in Browser.window;
		Browser.onWeiXin=/*[SAFE]*/ Browser.u.indexOf('MicroMessenger')>-1;
		Browser.onPC=/*[SAFE]*/ !Browser.onMobile;
		Browser.onSafari=/*[SAFE]*/ Browser.u.indexOf("Safari")>-1;
		Browser.onFirefox=/*[SAFE]*/ Browser.u.indexOf('Firefox')>-1;
		Browser.onEdge=/*[SAFE]*/ Browser.u.indexOf('Edge')>-1;
		Browser.onMiniGame=/*[SAFE]*/ Browser.u.indexOf('MiniGame')>-1;
		Browser.onBDMiniGame=/*[SAFE]*/ Browser.u.indexOf('SwanGame')>-1;
		Browser.onHWMiniGame=/*[SAFE]*/ laya.utils.Browser.window.hasOwnProperty("hbs");
		if(Browser.u.indexOf('OPPO')>-1 && Browser.u.indexOf('MiniGame')>-1){
			Browser.onQGMiniGame=true;
			Browser.onMiniGame=false;
		}
		if (laya.utils.Browser.window.hasOwnProperty("bl")&& Browser.u.indexOf('MiniGame')>-1){
			Browser.onBLMiniGame=true;
			Browser.onMiniGame=false;
		}
		if (laya.utils.Browser.window.hasOwnProperty("qq")&& Browser.u.indexOf('MiniGame')>-1){
			Browser.onQQMiniGame=true;
			Browser.onMiniGame=false;
		}
		if (laya.utils.Browser.window.hasOwnProperty("tt")&& Browser.u.indexOf('MiniGame')>-1){
			Browser.onTTMiniGame=true;
			Browser.onMiniGame=false;
		}
		if(Browser.u.indexOf("VVGame")>-1)
			Browser.onVVMiniGame=true;
		Browser.onKGMiniGame=/*[SAFE]*/ Browser.u.indexOf('QuickGame')>-1;
		Browser.onLimixiu=/*[SAFE]*/ Browser.u.indexOf('limixiu')>-1;
		Browser.onIPhoneX=/iPhone/gi.test(Browser.window.navigator.userAgent)&& (Math.min(Browser.clientHeight,Browser.clientWidth)==375 && Math.max(Browser.clientHeight,Browser.clientWidth)==812);
		Browser.httpProtocol=/*[SAFE]*/ Browser.window.location.protocol=="http:";
		if(Browser.u.indexOf('AlipayMiniGame')>-1){
			Browser.onAlipayMiniGame=true;
			Browser.onMiniGame=false;
		}
		if ((Browser.u.indexOf('TB')>-1 || Browser.u.indexOf('Taobao')>-1 || Browser.u.indexOf('TM/')>-1)&& laya.utils.Browser.window.hasOwnProperty('my')){
			Browser.onTBMiniGame=true;
		}
		if (Browser.onMiniGame && Browser.window.focus==null){
			console.error("请先初始化小游戏适配库，详细教程https://ldc.layabox.com/doc/?nav=zh-ts-5-0-0");
		}
		Browser.webAudioEnabled=/*[SAFE]*/ Browser.window["AudioContext"] || Browser.window["webkitAudioContext"] || Browser.window["mozAudioContext"] ? true :false;
		Browser.soundType=/*[SAFE]*/ Browser.webAudioEnabled ? "WEBAUDIOSOUND" :"AUDIOSOUND";
		/*__JS__ */Sound=Browser.webAudioEnabled?WebAudioSound:AudioSound;;
		/*__JS__ */if (Browser.webAudioEnabled)WebAudioSound.initWebAudio();;
		if (!Browser.onTBMiniGame){
			AudioSound._initMusicAudio();
		}
		/*__JS__ */Browser.enableTouch=(('ontouchstart' in window)|| window.DocumentTouch && document instanceof DocumentTouch);
		/*__JS__ */window.focus();
		/*__JS__ */SoundManager._soundClass=Sound;;
		SoundManager._musicClass=AudioSound;
		Render._mainCanvas=Render._mainCanvas || HTMLCanvas.create('2D');
		if (Browser.canvas)return;
		Browser.canvas=HTMLCanvas.create('2D');
		Browser.context=Browser.canvas.getContext('2d');
	}

	Browser._onMessage=function(e){
		if (!e.data)return;
		if (e.data.name=="size"){
			Browser.window.innerWidth=e.data.width;
			Browser.window.innerHeight=e.data.height;
			Browser.window.__innerHeight=e.data.clientHeight;
			if (!Browser.document.createEvent){
				console.warn("no document.createEvent");
				return;
			};
			var evt=Browser.document.createEvent("HTMLEvents");
			evt.initEvent("resize",false,false);
			Browser.window.dispatchEvent(evt);
			return;
		}
	}

	Browser.createElement=function(type){
		Browser.__init__();
		return Browser.document.__createElement(type);
	}

	Browser.getElementById=function(type){
		Browser.__init__();
		return Browser.document.getElementById(type);
	}

	Browser.removeElement=function(ele){
		if (ele && ele.parentNode)ele.parentNode.removeChild(ele);
	}

	Browser.now=function(){
		return RunDriver.now();
	}

	Browser._window=null;
	Browser._document=null;
	Browser._container=null;
	Browser.userAgent=null;
	Browser.u=null;
	Browser.onIOS=false;
	Browser.onMac=false;
	Browser.onMobile=false;
	Browser.onIPhone=false;
	Browser.onIPad=false;
	Browser.onAndroid=false;
	Browser.onWP=false;
	Browser.onQQBrowser=false;
	Browser.onMQQBrowser=false;
	Browser.onSafari=false;
	Browser.onFirefox=false;
	Browser.onEdge=false;
	Browser.onIE=false;
	Browser.onWeiXin=false;
	Browser.onMiniGame=false;
	Browser.onTTMiniGame=false;
	Browser.onBDMiniGame=false;
	Browser.onKGMiniGame=false;
	Browser.onQGMiniGame=false;
	Browser.onVVMiniGame=false;
	Browser.onQQMiniGame=false;
	Browser.onLimixiu=false;
	Browser.onBLMiniGame=false;
	Browser.onAlipayMiniGame=false;
	Browser.onTTMiniGame=false;
	Browser.onHWMiniGame=false;
	Browser.onTBMiniGame=false;
	Browser.onPC=false;
	Browser.httpProtocol=false;
	Browser.webAudioEnabled=false;
	Browser.soundType=null;
	Browser.enableTouch=false;
	Browser.canvas=null;
	Browser.context=null;
	Browser.onIPhoneX=false;
	Browser.__init$=function(){
		AudioSound;
		WebAudioSound;
	}

	return Browser;
})()


/**
*<p> <code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。</p>
*<p><b>注意：</b> <code>Byte</code> 类适用于需要在字节层访问数据的高级开发人员。</p>
*/
//class laya.utils.Byte
var Byte=(function(){
	function Byte(data){
		/**
		*@private
		*是否为小端数据。
		*/
		this._xd_=true;
		this._allocated_=8;
		/**
		*@private
		*原始数据。
		*/
		//this._d_=null;
		/**
		*@private
		*DataView
		*/
		//this._u8d_=null;
		/**@private */
		this._pos_=0;
		/**@private */
		this._length=0;
		if (data){
			this._u8d_=new Uint8Array(data);
			this._d_=new DataView(this._u8d_.buffer);
			this._length=this._d_.byteLength;
			}else {
			this.___resizeBuffer(this._allocated_);
		}
	}

	__class(Byte,'laya.utils.Byte');
	var __proto=Byte.prototype;
	/**@private */
	__proto.___resizeBuffer=function(len){
		try {
			var newByteView=new Uint8Array(len);
			if (this._u8d_ !=null){
				if (this._u8d_.length <=len)newByteView.set(this._u8d_);
				else newByteView.set(this._u8d_.subarray(0,len));
			}
			this._u8d_=newByteView;
			this._d_=new DataView(newByteView.buffer);
			}catch (err){
			throw "___resizeBuffer err:"+len;
		}
	}

	/**
	*<p>常用于解析固定格式的字节流。</p>
	*<p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串。</p>
	*@return 读取的字符串。
	*/
	__proto.getString=function(){
		return this.rUTF(this.getUint16());
	}

	/**
	*从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
	*@param start 开始位置。
	*@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
	*@return 读取的 Float32Array 对象。
	*/
	__proto.getFloat32Array=function(start,len){
		var end=start+len;
		end=(end > this._length)? this._length :end;
		var v=new Float32Array(this._d_.buffer.slice(start,end));
		this._pos_=end;
		return v;
	}

	/**
	*从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Uint8Array</code> 对象并返回此对象。
	*@param start 开始位置。
	*@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
	*@return 读取的 Uint8Array 对象。
	*/
	__proto.getUint8Array=function(start,len){
		var end=start+len;
		end=(end > this._length)? this._length :end;
		var v=new Uint8Array(this._d_.buffer.slice(start,end));
		this._pos_=end;
		return v;
	}

	/**
	*从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Int16Array</code> 对象并返回此对象。
	*@param start 开始读取的字节偏移量位置。
	*@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
	*@return 读取的 Uint8Array 对象。
	*/
	__proto.getInt16Array=function(start,len){
		var end=start+len;
		end=(end > this._length)? this._length :end;
		var v=new Int16Array(this._d_.buffer.slice(start,end));
		this._pos_=end;
		return v;
	}

	/**
	*从字节流的当前字节偏移位置处读取一个 IEEE 754 单精度（32 位）浮点数。
	*@return 单精度（32 位）浮点数。
	*/
	__proto.getFloat32=function(){
		if (this._pos_+4 > this._length)throw "getFloat32 error - Out of bounds";
		var v=this._d_.getFloat32(this._pos_,this._xd_);
		this._pos_+=4;
		return v;
	}

	/**
	*从字节流的当前字节偏移量位置处读取一个 IEEE 754 双精度（64 位）浮点数。
	*@return 双精度（64 位）浮点数。
	*/
	__proto.getFloat64=function(){
		if (this._pos_+8 > this._length)throw "getFloat64 error - Out of bounds";
		var v=this._d_.getFloat64(this._pos_,this._xd_);
		this._pos_+=8;
		return v;
	}

	/**
	*在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
	*@param value 单精度（32 位）浮点数。
	*/
	__proto.writeFloat32=function(value){
		this.ensureWrite(this._pos_+4);
		this._d_.setFloat32(this._pos_,value,this._xd_);
		this._pos_+=4;
	}

	/**
	*在字节流的当前字节偏移量位置处写入一个 IEEE 754 双精度（64 位）浮点数。
	*@param value 双精度（64 位）浮点数。
	*/
	__proto.writeFloat64=function(value){
		this.ensureWrite(this._pos_+8);
		this._d_.setFloat64(this._pos_,value,this._xd_);
		this._pos_+=8;
	}

	/**
	*从字节流的当前字节偏移量位置处读取一个 Int32 值。
	*@return Int32 值。
	*/
	__proto.getInt32=function(){
		if (this._pos_+4 > this._length)throw "getInt32 error - Out of bounds";
		var float=this._d_.getInt32(this._pos_,this._xd_);
		this._pos_+=4;
		return float;
	}

	/**
	*从字节流的当前字节偏移量位置处读取一个 Uint32 值。
	*@return Uint32 值。
	*/
	__proto.getUint32=function(){
		if (this._pos_+4 > this._length)throw "getUint32 error - Out of bounds";
		var v=this._d_.getUint32(this._pos_,this._xd_);
		this._pos_+=4;
		return v;
	}

	/**
	*在字节流的当前字节偏移量位置处写入指定的 Int32 值。
	*@param value 需要写入的 Int32 值。
	*/
	__proto.writeInt32=function(value){
		this.ensureWrite(this._pos_+4);
		this._d_.setInt32(this._pos_,value,this._xd_);
		this._pos_+=4;
	}

	/**
	*在字节流的当前字节偏移量位置处写入 Uint32 值。
	*@param value 需要写入的 Uint32 值。
	*/
	__proto.writeUint32=function(value){
		this.ensureWrite(this._pos_+4);
		this._d_.setUint32(this._pos_,value,this._xd_);
		this._pos_+=4;
	}

	/**
	*从字节流的当前字节偏移量位置处读取一个 Int16 值。
	*@return Int16 值。
	*/
	__proto.getInt16=function(){
		if (this._pos_+2 > this._length)throw "getInt16 error - Out of bounds";
		var us=this._d_.getInt16(this._pos_,this._xd_);
		this._pos_+=2;
		return us;
	}

	/**
	*从字节流的当前字节偏移量位置处读取一个 Uint16 值。
	*@return Uint16 值。
	*/
	__proto.getUint16=function(){
		if (this._pos_+2 > this._length)throw "getUint16 error - Out of bounds";
		var us=this._d_.getUint16(this._pos_,this._xd_);
		this._pos_+=2;
		return us;
	}

	/**
	*在字节流的当前字节偏移量位置处写入指定的 Uint16 值。
	*@param value 需要写入的Uint16 值。
	*/
	__proto.writeUint16=function(value){
		this.ensureWrite(this._pos_+2);
		this._d_.setUint16(this._pos_,value,this._xd_);
		this._pos_+=2;
	}

	/**
	*在字节流的当前字节偏移量位置处写入指定的 Int16 值。
	*@param value 需要写入的 Int16 值。
	*/
	__proto.writeInt16=function(value){
		this.ensureWrite(this._pos_+2);
		this._d_.setInt16(this._pos_,value,this._xd_);
		this._pos_+=2;
	}

	/**
	*从字节流的当前字节偏移量位置处读取一个 Uint8 值。
	*@return Uint8 值。
	*/
	__proto.getUint8=function(){
		if (this._pos_+1 > this._length)throw "getUint8 error - Out of bounds";
		return this._d_.getUint8(this._pos_++);
	}

	/**
	*在字节流的当前字节偏移量位置处写入指定的 Uint8 值。
	*@param value 需要写入的 Uint8 值。
	*/
	__proto.writeUint8=function(value){
		this.ensureWrite(this._pos_+1);
		this._d_.setUint8(this._pos_,value);
		this._pos_++;
	}

	/**
	*@private
	*从字节流的指定字节偏移量位置处读取一个 Uint8 值。
	*@param pos 字节读取位置。
	*@return Uint8 值。
	*/
	__proto._getUInt8=function(pos){
		return this._d_.getUint8(pos);
	}

	/**
	*@private
	*从字节流的指定字节偏移量位置处读取一个 Uint16 值。
	*@param pos 字节读取位置。
	*@return Uint16 值。
	*/
	__proto._getUint16=function(pos){
		return this._d_.getUint16(pos,this._xd_);
	}

	/**
	*@private
	*使用 getFloat32()读取6个值，用于创建并返回一个 Matrix 对象。
	*@return Matrix 对象。
	*/
	__proto._getMatrix=function(){
		var rst=new Matrix(this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32());
		return rst;
	}

	/**
	*@private
	*读取指定长度的 UTF 型字符串。
	*@param len 需要读取的长度。
	*@return 读取的字符串。
	*/
	__proto.rUTF=function(len){
		var v="",max=this._pos_+len,c=0,c2=0,c3=0,f=String.fromCharCode;
		var u=this._u8d_,i=0;
		while (this._pos_ < max){
			c=u[this._pos_++];
			if (c < 0x80){
				if (c !=0){
					v+=f(c);
				}
				}else if (c < 0xE0){
				v+=f(((c & 0x3F)<< 6)| (u[this._pos_++] & 0x7F));
				}else if (c < 0xF0){
				c2=u[this._pos_++];
				v+=f(((c & 0x1F)<< 12)| ((c2 & 0x7F)<< 6)| (u[this._pos_++] & 0x7F));
				}else {
				c2=u[this._pos_++];
				c3=u[this._pos_++];
				v+=f(((c & 0x0F)<< 18)| ((c2 & 0x7F)<< 12)| ((c3 << 6)& 0x7F)| (u[this._pos_++] & 0x7F));
			}
			i++;
		}
		return v;
	}

	/**
	*@private
	*读取 <code>len</code> 参数指定的长度的字符串。
	*@param len 要读取的字符串的长度。
	*@return 指定长度的字符串。
	*/
	__proto.getCustomString=function(len){
		var v="",ulen=0,c=0,c2=0,f=String.fromCharCode;
		var u=this._u8d_,i=0;
		while (len > 0){
			c=u[this._pos_];
			if (c < 0x80){
				v+=f(c);
				this._pos_++;
				len--;
				}else {
				ulen=c-0x80;
				this._pos_++;
				len-=ulen;
				while (ulen > 0){
					c=u[this._pos_++];
					c2=u[this._pos_++];
					v+=f((c2 << 8)| c);
					ulen--;
				}
			}
		}
		return v;
	}

	/**
	*清除字节数组的内容，并将 length 和 pos 属性重置为 0。调用此方法将释放 Byte 实例占用的内存。
	*/
	__proto.clear=function(){
		this._pos_=0;
		this.length=0;
	}

	/**
	*@private
	*获取此对象的 ArrayBuffer 引用。
	*@return
	*/
	__proto.__getBuffer=function(){
		return this._d_.buffer;
	}

	/**
	*<p>将 UTF-8 字符串写入字节流。类似于 writeUTF()方法，但 writeUTFBytes()不使用 16 位长度的字为字符串添加前缀。</p>
	*<p>对应的读取方法为： getUTFBytes 。</p>
	*@param value 要写入的字符串。
	*/
	__proto.writeUTFBytes=function(value){
		value=value+"";
		for (var i=0,sz=value.length;i < sz;i++){
			var c=value.charCodeAt(i);
			if (c <=0x7F){
				this.writeByte(c);
				}else if (c <=0x7FF){
				this.ensureWrite(this._pos_+2);
				this._u8d_.set([0xC0 | (c >> 6),0x80 | (c & 0x3F)],this._pos_);
				this._pos_+=2;
				}else if (c <=0xFFFF){
				this.ensureWrite(this._pos_+3);
				this._u8d_.set([0xE0 | (c >> 12),0x80 | ((c >> 6)& 0x3F),0x80 | (c & 0x3F)],this._pos_);
				this._pos_+=3;
				}else {
				this.ensureWrite(this._pos_+4);
				this._u8d_.set([0xF0 | (c >> 18),0x80 | ((c >> 12)& 0x3F),0x80 | ((c >> 6)& 0x3F),0x80 | (c & 0x3F)],this._pos_);
				this._pos_+=4;
			}
		}
	}

	/**
	*<p>将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节。</p>
	*<p>对应的读取方法为： getUTFString 。</p>
	*@param value 要写入的字符串值。
	*/
	__proto.writeUTFString=function(value){
		var tPos=this.pos;
		this.writeUint16(1);
		this.writeUTFBytes(value);
		var dPos=this.pos-tPos-2;
		if (dPos >=65536){
			throw "writeUTFString byte len more than 65536";
		}
		this._d_.setUint16(tPos,dPos,this._xd_);
	}

	/**
	*@private
	*读取 UTF-8 字符串。
	*@return 读取的字符串。
	*/
	__proto.readUTFString=function(){
		return this.readUTFBytes(this.getUint16());
	}

	/**
	*<p>从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。</p>
	*<p>对应的写入方法为： writeUTFString 。</p>
	*@return 读取的字符串。
	*/
	__proto.getUTFString=function(){
		return this.readUTFString();
	}

	/**
	*@private
	*读字符串，必须是 writeUTFBytes 方法写入的字符串。
	*@param len 要读的buffer长度，默认将读取缓冲区全部数据。
	*@return 读取的字符串。
	*/
	__proto.readUTFBytes=function(len){
		(len===void 0)&& (len=-1);
		if (len==0)return "";
		var lastBytes=this.bytesAvailable;
		if (len > lastBytes)throw "readUTFBytes error - Out of bounds";
		len=len > 0 ? len :lastBytes;
		return this.rUTF(len);
	}

	/**
	*<p>从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。</p>
	*<p>一般读取的是由 writeUTFBytes 方法写入的字符串。</p>
	*@param len 要读的buffer长度，默认将读取缓冲区全部数据。
	*@return 读取的字符串。
	*/
	__proto.getUTFBytes=function(len){
		(len===void 0)&& (len=-1);
		return this.readUTFBytes(len);
	}

	/**
	*<p>在字节流中写入一个字节。</p>
	*<p>使用参数的低 8 位。忽略高 24 位。</p>
	*@param value
	*/
	__proto.writeByte=function(value){
		this.ensureWrite(this._pos_+1);
		this._d_.setInt8(this._pos_,value);
		this._pos_+=1;
	}

	/**
	*@private
	*从字节流中读取带符号的字节。
	*/
	__proto.readByte=function(){
		if (this._pos_+1 > this._length)throw "readByte error - Out of bounds";
		return this._d_.getInt8(this._pos_++);
	}

	/**
	*<p>从字节流中读取带符号的字节。</p>
	*<p>返回值的范围是从-128 到 127。</p>
	*@return 介于-128 和 127 之间的整数。
	*/
	__proto.getByte=function(){
		return this.readByte();
	}

	/**
	*<p>保证该字节流的可用长度不小于 <code>lengthToEnsure</code> 参数指定的值。</p>
	*@param lengthToEnsure 指定的长度。
	*/
	__proto.ensureWrite=function(lengthToEnsure){
		if (this._length < lengthToEnsure)this._length=lengthToEnsure;
		if (this._allocated_ < lengthToEnsure)this.length=lengthToEnsure;
	}

	/**
	*<p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
	*<p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
	*<p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
	*$NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
	*@param arraybuffer 需要写入的 Arraybuffer 对象。
	*@param offset Arraybuffer 对象的索引的偏移量（以字节为单位）
	*@param length 从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
	*/
	__proto.writeArrayBuffer=function(arraybuffer,offset,length){
		(offset===void 0)&& (offset=0);
		(length===void 0)&& (length=0);
		if (offset < 0 || length < 0)throw "writeArrayBuffer error - Out of bounds";
		if (length==0)length=arraybuffer.byteLength-offset;
		this.ensureWrite(this._pos_+length);
		var uint8array=new Uint8Array(arraybuffer);
		this._u8d_.set(uint8array.subarray(offset,offset+length),this._pos_);
		this._pos_+=length;
	}

	/**
	*读取ArrayBuffer数据
	*@param length
	*@return
	*/
	__proto.readArrayBuffer=function(length){
		var rst;
		rst=this._u8d_.buffer.slice(this._pos_,this._pos_+length);
		this._pos_=this._pos_+length
		return rst;
	}

	/**
	*获取此对象的 ArrayBuffer 数据，数据只包含有效数据部分。
	*/
	__getset(0,__proto,'buffer',function(){
		var rstBuffer=this._d_.buffer;
		if (rstBuffer.byteLength==this.length)return rstBuffer;
		return rstBuffer.slice(0,this.length);
	});

	/**
	*<p> <code>Byte</code> 实例的字节序。取值为：<code>BIG_ENDIAN</code> 或 <code>BIG_ENDIAN</code> 。</p>
	*<p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。通过 <code>getSystemEndian</code> 可以获取当前系统的字节序。</p>
	*<p> <code>BIG_ENDIAN</code> ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。有时也称之为网络字节序。<br/>
	*<code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
	*/
	__getset(0,__proto,'endian',function(){
		return this._xd_ ? "littleEndian" :"bigEndian";
		},function(endianStr){
		this._xd_=(endianStr=="littleEndian");
	});

	/**
	*<p> <code>Byte</code> 对象的长度（以字节为单位）。</p>
	*<p>如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。</p>
	*<p>如果要设置的长度大于当前已分配的内存空间的字节长度，则重新分配内存空间，大小为以下两者较大者：要设置的长度、当前已分配的长度的2倍，并将原有数据拷贝到新的内存空间中；如果要设置的长度小于当前已分配的内存空间的字节长度，也会重新分配内存空间，大小为要设置的长度，并将原有数据从头截断为要设置的长度存入新的内存空间中。</p>
	*/
	__getset(0,__proto,'length',function(){
		return this._length;
		},function(value){
		if (this._allocated_ < value)
			this.___resizeBuffer(this._allocated_=Math.floor(Math.max(value,this._allocated_ *2)));
		else if (this._allocated_ > value)
		this.___resizeBuffer(this._allocated_=value);
		this._length=value;
	});

	/**
	*移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
	*/
	__getset(0,__proto,'pos',function(){
		return this._pos_;
		},function(value){
		this._pos_=value;
	});

	/**
	*可从字节流的当前位置到末尾读取的数据的字节数。
	*/
	__getset(0,__proto,'bytesAvailable',function(){
		return this._length-this._pos_;
	});

	Byte.getSystemEndian=function(){
		if (!Byte._sysEndian){
			var buffer=new ArrayBuffer(2);
			new DataView(buffer).setInt16(0,256,true);
			Byte._sysEndian=(new Int16Array(buffer))[0]===256 ? /*CLASS CONST:laya.utils.Byte.LITTLE_ENDIAN*/"littleEndian" :/*CLASS CONST:laya.utils.Byte.BIG_ENDIAN*/"bigEndian";
		}
		return Byte._sysEndian;
	}

	Byte.BIG_ENDIAN="bigEndian";
	Byte.LITTLE_ENDIAN="littleEndian";
	Byte._sysEndian=null;
	return Byte;
})()


/**
*@private
*对象缓存统一管理类
*/
//class laya.utils.CacheManager
var CacheManager=(function(){
	function CacheManager(){}
	__class(CacheManager,'laya.utils.CacheManager');
	CacheManager.regCacheByFunction=function(disposeFunction,getCacheListFunction){
		CacheManager.unRegCacheByFunction(disposeFunction,getCacheListFunction);
		var cache;
		cache={tryDispose:disposeFunction,getCacheList:getCacheListFunction};
		CacheManager._cacheList.push(cache);
	}

	CacheManager.unRegCacheByFunction=function(disposeFunction,getCacheListFunction){
		var i=0,len=0;
		len=CacheManager._cacheList.length;
		for (i=0;i < len;i++){
			if (CacheManager._cacheList[i].tryDispose==disposeFunction && CacheManager._cacheList[i].getCacheList==getCacheListFunction){
				CacheManager._cacheList.splice(i,1);
				return;
			}
		}
	}

	CacheManager.forceDispose=function(){
		var i=0,len=CacheManager._cacheList.length;
		for (i=0;i < len;i++){
			CacheManager._cacheList[i].tryDispose(true);
		}
	}

	CacheManager.beginCheck=function(waitTime){
		(waitTime===void 0)&& (waitTime=15000);
		Laya.timer.loop(waitTime,null,CacheManager._checkLoop);
	}

	CacheManager.stopCheck=function(){
		Laya.timer.clear(null,CacheManager._checkLoop);
	}

	CacheManager._checkLoop=function(){
		var cacheList=CacheManager._cacheList;
		if (cacheList.length < 1)return;
		var tTime=Browser.now();
		var count=0;
		var len=0;
		len=count=cacheList.length;
		while (count > 0){
			CacheManager._index++;
			CacheManager._index=CacheManager._index % len;
			cacheList[CacheManager._index].tryDispose(false);
			if (Browser.now()-tTime > CacheManager.loopTimeLimit)break ;
			count--;
		}
	}

	CacheManager.loopTimeLimit=2;
	CacheManager._cacheList=[];
	CacheManager._index=0;
	return CacheManager;
})()


/**
*<code>ClassUtils</code> 是一个类工具类。
*/
//class laya.utils.ClassUtils
var ClassUtils=(function(){
	function ClassUtils(){}
	__class(ClassUtils,'laya.utils.ClassUtils');
	ClassUtils.regClass=function(className,classDef){
		ClassUtils._classMap[className]=classDef;
	}

	ClassUtils.getRegClass=function(className){
		return ClassUtils._classMap[className];
	}

	ClassUtils.getInstance=function(className){
		var compClass=ClassUtils.getClass(className);
		if (compClass)
			return new compClass();
		else
		console.warn("[error] Undefined class:",className);
		return null;
	}

	ClassUtils.createByJson=function(json,node,root,customHandler,instanceHandler){
		if ((typeof json=='string'))
			json=JSON.parse(json);
		var props=json.props;
		if (!node){
			node=instanceHandler ? instanceHandler.runWith(json):ClassUtils.getInstance(props.runtime || json.type);
			if (!node)
				return null;
		};
		var child=json.child;
		if (child){
			for (var i=0,n=child.length;i < n;i++){
				var data=child[i];
				if ((data.props.name==="render" || data.props.renderType==="render")&& node["_$set_itemRender"])
					node.itemRender=data;
				else {
					if (data.type=="Graphic"){
						ClassUtils.addGraphicsToSprite(data,node);
						}else if (ClassUtils.isDrawType(data.type)){
						ClassUtils.addGraphicToSprite(data,node,true);
						}else {
						var tChild=ClassUtils.createByJson(data,null,root,customHandler,instanceHandler)
						if (data.type=="Script"){
							if (tChild.hasOwnProperty("owner")){
								tChild["owner"]=node;
								}else if (tChild.hasOwnProperty("target")){
								tChild["target"]=node;
							}
							}else if (data.props.renderType=="mask"){
							node.mask=tChild;
							}else {
							node.addChild(tChild);
						}
					}
				}
			}
		}
		if (props){
			for (var prop in props){
				var value=props[prop];
				if (prop==="var" && root){
					root[value]=node;
					}else if ((value instanceof Array)&& (typeof (node[prop])=='function')){
					node[prop].apply(node,value);
					}else {
					node[prop]=value;
				}
			}
		}
		if (customHandler && json.customProps){
			customHandler.runWith([node,json]);
		}
		if (node["created"])
			node.created();
		return node;
	}

	ClassUtils.addGraphicsToSprite=function(graphicO,sprite){
		var graphics;
		graphics=graphicO.child;
		if (!graphics || graphics.length < 1)
			return;
		var g;
		g=ClassUtils._getGraphicsFromSprite(graphicO,sprite);
		var ox=0;
		var oy=0;
		if (graphicO.props){
			ox=ClassUtils._getObjVar(graphicO.props,"x",0);
			oy=ClassUtils._getObjVar(graphicO.props,"y",0);
		}
		if (ox !=0 && oy !=0){
			g.translate(ox,oy);
		};
		var i=0,len=0;
		len=graphics.length;
		for (i=0;i < len;i++){
			ClassUtils._addGraphicToGraphics(graphics[i],g);
		}
		if (ox !=0 && oy !=0){
			g.translate(-ox,-oy);
		}
	}

	ClassUtils.addGraphicToSprite=function(graphicO,sprite,isChild){
		(isChild===void 0)&& (isChild=false);
		var g;
		g=isChild ? ClassUtils._getGraphicsFromSprite(graphicO,sprite):sprite.graphics;
		ClassUtils._addGraphicToGraphics(graphicO,g);
	}

	ClassUtils._getGraphicsFromSprite=function(dataO,sprite){
		var g;
		if (!dataO || !dataO.props)
			return sprite.graphics;
		var propsName;
		propsName=dataO.props.renderType;
		switch (propsName){
			case "hit":
			case "unHit":;
				var hitArea;
				if (!sprite.hitArea){
					sprite.hitArea=new HitArea();
				}
				hitArea=sprite.hitArea;
				if (!hitArea[propsName]){
					hitArea[propsName]=new Graphics();
				}
				g=hitArea[propsName];
				break ;
			default :
			}
		if (!g)
			g=sprite.graphics;
		return g;
	}

	ClassUtils._getTransformData=function(propsO){
		var m;
		if (propsO.hasOwnProperty("pivotX")|| propsO.hasOwnProperty("pivotY")){
			m=m || new Matrix();
			m.translate(-ClassUtils._getObjVar(propsO,"pivotX",0),-ClassUtils._getObjVar(propsO,"pivotY",0));
		};
		var sx=ClassUtils._getObjVar(propsO,"scaleX",1),sy=ClassUtils._getObjVar(propsO,"scaleY",1);
		var rotate=ClassUtils._getObjVar(propsO,"rotation",0);
		var skewX=ClassUtils._getObjVar(propsO,"skewX",0);
		var skewY=ClassUtils._getObjVar(propsO,"skewY",0);
		if (sx !=1 || sy !=1 || rotate !=0){
			m=m || new Matrix();
			m.scale(sx,sy);
			m.rotate(rotate *0.0174532922222222);
		}
		return m;
	}

	ClassUtils._addGraphicToGraphics=function(graphicO,graphic){
		var propsO;
		propsO=graphicO.props;
		if (!propsO)
			return;
		var drawConfig;
		drawConfig=ClassUtils.DrawTypeDic[graphicO.type];
		if (!drawConfig)
			return;
		var g;
		g=graphic;
		var m;
		var params=ClassUtils._getParams(propsO,drawConfig[1],drawConfig[2],drawConfig[3]);
		m=ClassUtils._tM;
		if (m || ClassUtils._alpha !=1){
			g.save();
			if (m)
				g.transform(m);
			if (ClassUtils._alpha !=1)
				g.alpha(ClassUtils._alpha);
		}
		g[drawConfig[0]].apply(g,params);
		if (m || ClassUtils._alpha !=1){
			g.restore();
		}
	}

	ClassUtils._adptLineData=function(params){
		params[2]=parseFloat(params[0])+parseFloat(params[2]);
		params[3]=parseFloat(params[1])+parseFloat(params[3]);
		return params;
	}

	ClassUtils._adptTextureData=function(params){
		params[0]=Loader.getRes(params[0]);
		return params;
	}

	ClassUtils._adptLinesData=function(params){
		params[2]=ClassUtils._getPointListByStr(params[2]);
		return params;
	}

	ClassUtils.isDrawType=function(type){
		if (type=="Image")
			return false;
		return ClassUtils.DrawTypeDic.hasOwnProperty(type);
	}

	ClassUtils._getParams=function(obj,params,xPos,adptFun){
		(xPos===void 0)&& (xPos=0);
		var rst;
		rst=ClassUtils._temParam;
		rst.length=params.length;
		var i=0,len=0;
		len=params.length;
		for (i=0;i < len;i++){
			rst[i]=ClassUtils._getObjVar(obj,params[i][0],params[i][1]);
		}
		ClassUtils._alpha=ClassUtils._getObjVar(obj,"alpha",1);
		var m;
		m=ClassUtils._getTransformData(obj);
		if (m){
			if (!xPos)xPos=0;
			m.translate(rst[xPos],rst[xPos+1]);
			rst[xPos]=rst[xPos+1]=0;
			ClassUtils._tM=m;
			}else {
			ClassUtils._tM=null;
		}
		if (adptFun && ClassUtils[adptFun]){
			rst=ClassUtils[adptFun](rst);
		}
		return rst;
	}

	ClassUtils._getPointListByStr=function(str){
		var pointArr;
		pointArr=str.split(",");
		var i=0,len=0;
		len=pointArr.length;
		for (i=0;i < len;i++){
			pointArr[i]=parseFloat(pointArr[i]);
		}
		return pointArr;
	}

	ClassUtils._getObjVar=function(obj,key,noValue){
		if (obj.hasOwnProperty(key)){
			return obj[key];
		}
		return noValue;
	}

	ClassUtils._temParam=[];
	ClassUtils._classMap={'Sprite':'laya.display.Sprite','Text':'laya.display.Text','Animation':'laya.display.Animation','Skeleton':'laya.ani.bone.Skeleton','Particle2D':'laya.particle.Particle2D','div':'laya.html.dom.HTMLDivElement','p':'laya.html.dom.HTMLElement','img':'laya.html.dom.HTMLImageElement','span':'laya.html.dom.HTMLElement','br':'laya.html.dom.HTMLBrElement','style':'laya.html.dom.HTMLStyleElement','font':'laya.html.dom.HTMLElement','a':'laya.html.dom.HTMLElement','#text':'laya.html.dom.HTMLElement'};
	ClassUtils.getClass=function(className){
		var classObject=ClassUtils._classMap[className] || className;
		if ((typeof classObject=='string'))
			return Laya["__classmap"][classObject];
		return classObject;
	}

	ClassUtils._tM=null;
	ClassUtils._alpha=NaN;
	__static(ClassUtils,
	['DrawTypeDic',function(){return this.DrawTypeDic={"Rect":["drawRect",[["x",0],["y",0],["width",0],["height",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Circle":["drawCircle",[["x",0],["y",0],["radius",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Pie":["drawPie",[["x",0],["y",0],["radius",0],["startAngle",0],["endAngle",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Image":["drawTexture",[["x",0],["y",0],["width",0],["height",0]]],"Texture":["drawTexture",[["skin",null],["x",0],["y",0],["width",0],["height",0]],1,"_adptTextureData"],"FillTexture":["fillTexture",[["skin",null],["x",0],["y",0],["width",0],["height",0],["repeat",null]],1,"_adptTextureData"],"FillText":["fillText",[["text",""],["x",0],["y",0],["font",null],["color",null],["textAlign",null]],1],"Line":["drawLine",[["x",0],["y",0],["toX",0],["toY",0],["lineColor",null],["lineWidth",0]],0,"_adptLineData"],"Lines":["drawLines",[["x",0],["y",0],["points",""],["lineColor",null],["lineWidth",0]],0,"_adptLinesData"],"Curves":["drawCurves",[["x",0],["y",0],["points",""],["lineColor",null],["lineWidth",0]],0,"_adptLinesData"],"Poly":["drawPoly",[["x",0],["y",0],["points",""],["fillColor",null],["lineColor",null],["lineWidth",1]],0,"_adptLinesData"]};}
	]);
	return ClassUtils;
})()


/**
*@private
*<code>Color</code> 是一个颜色值处理类。
*/
//class laya.utils.Color
var Color=(function(){
	function Color(str){
		/**@private */
		this._color=[];
		/**字符串型颜色值。*/
		//this.strColor=null;
		/**uint 型颜色值。*/
		//this.numColor=0;
		//this._drawStyle=null;
		if ((typeof str=='string')){
			this.strColor=str;
			if (str===null)str="#000000";
			str.charAt(0)=='#' && (str=str.substr(1));
			var len=str.length;
			if (len==3 || len==4){
				var temp="";
				for (var i=0;i < len;i++){
					temp+=(str[i]+str[i]);
				}
				str=temp;
			};
			var color=this.numColor=parseInt(str,16);
			var flag=(str.length==8);
			if (flag){
				this._color=[parseInt(str.substr(0,2),16)/ 255,((0x00FF0000 & color)>> 16)/ 255,((0x0000FF00 & color)>> 8)/ 255,(0x000000FF & color)/ 255];
				return;
			}
			}else {
			color=this.numColor=str;
			this.strColor=Utils.toHexColor(color);
		}
		this._color=[((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>> 8)/ 255,(0xFF & color)/ 255,1];
		(this._color).__id=++Color._COLODID;
	}

	__class(Color,'laya.utils.Color');
	Color._initDefault=function(){
		Color._DEFAULT={};
		for (var i in Color._COLOR_MAP)Color._SAVE[i]=Color._DEFAULT[i]=new Color(Color._COLOR_MAP[i]);
		return Color._DEFAULT;
	}

	Color._initSaveMap=function(){
		Color._SAVE_SIZE=0;
		Color._SAVE={};
		for (var i in Color._DEFAULT)Color._SAVE[i]=Color._DEFAULT[i];
	}

	Color.create=function(str){
		var color=Color._SAVE[str+""];
		if (color !=null)return color;
		(Color._SAVE_SIZE < 1000)|| Color._initSaveMap();
		return Color._SAVE[str+""]=new Color(str);
	}

	Color._SAVE={};
	Color._SAVE_SIZE=0;
	Color._COLOR_MAP={"white":'#FFFFFF',"red":'#FF0000',"green":'#00FF00',"blue":'#0000FF',"black":'#000000',"yellow":'#FFFF00','gray':'#AAAAAA'};
	Color._DEFAULT=Color._initDefault();
	Color._COLODID=1;
	return Color;
})()


/**
*<code>Dictionary</code> 是一个字典型的数据存取类。
*/
//class laya.utils.Dictionary
var Dictionary=(function(){
	function Dictionary(){
		this._values=[];
		this._keys=[];
	}

	__class(Dictionary,'laya.utils.Dictionary');
	var __proto=Dictionary.prototype;
	/**
	*给指定的键名设置值。
	*@param key 键名。
	*@param value 值。
	*/
	__proto.set=function(key,value){
		var index=this.indexOf(key);
		if (index >=0){
			this._values[index]=value;
			return;
		}
		this._keys.push(key);
		this._values.push(value);
	}

	/**
	*获取指定对象的键名索引。
	*@param key 键名对象。
	*@return 键名索引。
	*/
	__proto.indexOf=function(key){
		var index=this._keys.indexOf(key);
		if (index >=0)return index;
		key=((typeof key=='string'))? Number(key):(((typeof key=='number'))? key.toString():key);
		return this._keys.indexOf(key);
	}

	/**
	*返回指定键名的值。
	*@param key 键名对象。
	*@return 指定键名的值。
	*/
	__proto.get=function(key){
		var index=this.indexOf(key);
		return index < 0 ? null :this._values[index];
	}

	/**
	*移除指定键名的值。
	*@param key 键名对象。
	*@return 是否成功移除。
	*/
	__proto.remove=function(key){
		var index=this.indexOf(key);
		if (index >=0){
			this._keys.splice(index,1);
			this._values.splice(index,1);
			return true;
		}
		return false;
	}

	/**
	*清除此对象的键名列表和键值列表。
	*/
	__proto.clear=function(){
		this._values.length=0;
		this._keys.length=0;
	}

	/**
	*获取所有的子元素列表。
	*/
	__getset(0,__proto,'values',function(){
		return this._values;
	});

	/**
	*获取所有的子元素键名列表。
	*/
	__getset(0,__proto,'keys',function(){
		return this._keys;
	});

	return Dictionary;
})()


/**
*@private
*<code>Dragging</code> 类是触摸滑动控件。
*/
//class laya.utils.Dragging
var Dragging=(function(){
	function Dragging(){
		/**被拖动的对象。*/
		//this.target=null;
		/**缓动衰减系数。*/
		this.ratio=0.92;
		/**单帧最大偏移量。*/
		this.maxOffset=60;
		/**滑动范围。*/
		//this.area=null;
		/**表示拖动是否有惯性。*/
		//this.hasInertia=false;
		/**橡皮筋最大值。*/
		//this.elasticDistance=NaN;
		/**橡皮筋回弹时间，单位为毫秒。*/
		//this.elasticBackTime=NaN;
		/**事件携带数据。*/
		//this.data=null;
		this._dragging=false;
		this._clickOnly=true;
		//this._elasticRateX=NaN;
		//this._elasticRateY=NaN;
		//this._lastX=NaN;
		//this._lastY=NaN;
		//this._offsetX=NaN;
		//this._offsetY=NaN;
		//this._offsets=null;
		//this._disableMouseEvent=false;
		//this._tween=null;
		//this._parent=null;
	}

	__class(Dragging,'laya.utils.Dragging');
	var __proto=Dragging.prototype;
	/**
	*开始拖拽。
	*@param target 待拖拽的 <code>Sprite</code> 对象。
	*@param area 滑动范围。
	*@param hasInertia 拖动是否有惯性。
	*@param elasticDistance 橡皮筋最大值。
	*@param elasticBackTime 橡皮筋回弹时间，单位为毫秒。
	*@param data 事件携带数据。
	*@param disableMouseEvent 鼠标事件是否有效。
	*@param ratio 惯性阻尼系数
	*/
	__proto.start=function(target,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio){
		(ratio===void 0)&& (ratio=0.92);
		this.clearTimer();
		this.target=target;
		this.area=area;
		this.hasInertia=hasInertia;
		this.elasticDistance=area ? elasticDistance :0;
		this.elasticBackTime=elasticBackTime;
		this.data=data;
		this._disableMouseEvent=disableMouseEvent;
		this.ratio=ratio;
		this._parent=target.parent;
		this._clickOnly=true;
		this._dragging=true;
		this._elasticRateX=this._elasticRateY=1;
		this._lastX=this._parent.mouseX;
		this._lastY=this._parent.mouseY;
		Laya.stage.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
		Laya.stage.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp);
		Laya.timer.frameLoop(1,this,this.loop);
	}

	/**
	*清除计时器。
	*/
	__proto.clearTimer=function(){
		Laya.timer.clear(this,this.loop);
		Laya.timer.clear(this,this.tweenMove);
		if (this._tween){
			this._tween.recover();
			this._tween=null;
		}
	}

	/**
	*停止拖拽。
	*/
	__proto.stop=function(){
		if (this._dragging){
			MouseManager.instance.disableMouseEvent=false;
			Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
			Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp);
			this._dragging=false;
			this.target && this.area && this.backToArea();
			this.clear();
		}
	}

	/**
	*拖拽的循环处理函数。
	*/
	__proto.loop=function(){
		var point=this._parent.getMousePoint();
		var mouseX=point.x;
		var mouseY=point.y;
		var offsetX=mouseX-this._lastX;
		var offsetY=mouseY-this._lastY;
		if (this._clickOnly){
			if (Math.abs(offsetX *Laya.stage._canvasTransform.getScaleX())> 1 || Math.abs(offsetY *Laya.stage._canvasTransform.getScaleY())> 1){
				this._clickOnly=false;
				this._offsets || (this._offsets=[]);
				this._offsets.length=0;
				this.target.event(/*laya.events.Event.DRAG_START*/"dragstart",this.data);
				MouseManager.instance.disableMouseEvent=this._disableMouseEvent;
				this.target._set$P("$_MOUSEDOWN",false);
			}else return;
			}else {
			this._offsets.push(offsetX,offsetY);
		}
		if (offsetX===0 && offsetY===0)return;
		this._lastX=mouseX;
		this._lastY=mouseY;
		this.target.x+=offsetX *this._elasticRateX;
		this.target.y+=offsetY *this._elasticRateY;
		this.area && this.checkArea();
		this.target.event(/*laya.events.Event.DRAG_MOVE*/"dragmove",this.data);
	}

	/**
	*拖拽区域检测。
	*/
	__proto.checkArea=function(){
		if (this.elasticDistance <=0){
			this.backToArea();
			}else {
			if (this.target.x < this.area.x){
				var offsetX=this.area.x-this.target.x;
				}else if (this.target.x > this.area.x+this.area.width){
				offsetX=this.target.x-this.area.x-this.area.width;
				}else {
				offsetX=0;
			}
			this._elasticRateX=Math.max(0,1-(offsetX / this.elasticDistance));
			if (this.target.y < this.area.y){
				var offsetY=this.area.y-this.target.y;
				}else if (this.target.y > this.area.y+this.area.height){
				offsetY=this.target.y-this.area.y-this.area.height;
				}else {
				offsetY=0;
			}
			this._elasticRateY=Math.max(0,1-(offsetY / this.elasticDistance));
		}
	}

	/**
	*移动至设定的拖拽区域。
	*/
	__proto.backToArea=function(){
		this.target.x=Math.min(Math.max(this.target.x,this.area.x),this.area.x+this.area.width);
		this.target.y=Math.min(Math.max(this.target.y,this.area.y),this.area.y+this.area.height);
	}

	/**
	*舞台的抬起事件侦听函数。
	*@param e Event 对象。
	*/
	__proto.onStageMouseUp=function(e){
		MouseManager.instance.disableMouseEvent=false;
		Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
		Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp);
		Laya.timer.clear(this,this.loop);
		if (this._clickOnly || !this.target)return;
		if (this.hasInertia){
			if (this._offsets.length < 1){
				this._offsets.push(this._parent.mouseX-this._lastX,this._parent.mouseY-this._lastY);
			}
			this._offsetX=this._offsetY=0;
			var len=this._offsets.length;
			var n=Math.min(len,6);
			var m=this._offsets.length-n;
			for (var i=len-1;i > m;i--){
				this._offsetY+=this._offsets[i--];
				this._offsetX+=this._offsets[i];
			}
			this._offsetX=this._offsetX / n *2;
			this._offsetY=this._offsetY / n *2;
			if (Math.abs(this._offsetX)> this.maxOffset)this._offsetX=this._offsetX > 0 ? this.maxOffset :-this.maxOffset;
			if (Math.abs(this._offsetY)> this.maxOffset)this._offsetY=this._offsetY > 0 ? this.maxOffset :-this.maxOffset;
			Laya.timer.frameLoop(1,this,this.tweenMove);
			}else if (this.elasticDistance > 0){
			this.checkElastic();
			}else {
			this.clear();
		}
	}

	/**
	*橡皮筋效果检测。
	*/
	__proto.checkElastic=function(){
		var tx=NaN;
		var ty=NaN;
		if (this.target.x < this.area.x)tx=this.area.x;
		else if (this.target.x > this.area.x+this.area.width)tx=this.area.x+this.area.width;
		if (this.target.y < this.area.y)ty=this.area.y;
		else if (this.target.y > this.area.y+this.area.height)ty=this.area.y+this.area.height;
		if (!isNaN(tx)|| !isNaN(ty)){
			var obj={};
			if (!isNaN(tx))obj.x=tx;
			if (!isNaN(ty))obj.y=ty;
			this._tween=Tween.to(this.target,obj,this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
			}else {
			this.clear();
		}
	}

	/**
	*移动。
	*/
	__proto.tweenMove=function(){
		this._offsetX *=this.ratio *this._elasticRateX;
		this._offsetY *=this.ratio *this._elasticRateY;
		this.target.x+=this._offsetX;
		this.target.y+=this._offsetY;
		this.area && this.checkArea();
		this.target.event(/*laya.events.Event.DRAG_MOVE*/"dragmove",this.data);
		if ((Math.abs(this._offsetX)< 1 && Math.abs(this._offsetY)< 1)|| this._elasticRateX < 0.5 || this._elasticRateY < 0.5){
			Laya.timer.clear(this,this.tweenMove);
			if (this.elasticDistance > 0)this.checkElastic();
			else this.clear();
		}
	}

	/**
	*结束拖拽。
	*/
	__proto.clear=function(){
		if (this.target){
			this.clearTimer();
			var sp=this.target;
			this.target=null;
			this._parent=null;
			sp.event(/*laya.events.Event.DRAG_END*/"dragend",this.data);
		}
	}

	return Dragging;
})()


/**
*<code>Ease</code> 类定义了缓动函数，以便实现 <code>Tween</code> 动画的缓动效果。
*/
//class laya.utils.Ease
var Ease=(function(){
	function Ease(){}
	__class(Ease,'laya.utils.Ease');
	Ease.linearNone=function(t,b,c,d){
		return c *t / d+b;
	}

	Ease.linearIn=function(t,b,c,d){
		return c *t / d+b;
	}

	Ease.linearInOut=function(t,b,c,d){
		return c *t / d+b;
	}

	Ease.linearOut=function(t,b,c,d){
		return c *t / d+b;
	}

	Ease.bounceIn=function(t,b,c,d){
		return c-Ease.bounceOut(d-t,0,c,d)+b;
	}

	Ease.bounceInOut=function(t,b,c,d){
		if (t < d *0.5)return Ease.bounceIn(t *2,0,c,d)*.5+b;
		else return Ease.bounceOut(t *2-d,0,c,d)*.5+c *.5+b;
	}

	Ease.bounceOut=function(t,b,c,d){
		if ((t /=d)< (1 / 2.75))return c *(7.5625 *t *t)+b;
		else if (t < (2 / 2.75))return c *(7.5625 *(t-=(1.5 / 2.75))*t+.75)+b;
		else if (t < (2.5 / 2.75))return c *(7.5625 *(t-=(2.25 / 2.75))*t+.9375)+b;
		else return c *(7.5625 *(t-=(2.625 / 2.75))*t+.984375)+b;
	}

	Ease.backIn=function(t,b,c,d,s){
		(s===void 0)&& (s=1.70158);
		return c *(t /=d)*t *((s+1)*t-s)+b;
	}

	Ease.backInOut=function(t,b,c,d,s){
		(s===void 0)&& (s=1.70158);
		if ((t /=d *0.5)< 1)return c *0.5 *(t *t *(((s *=(1.525))+1)*t-s))+b;
		return c / 2 *((t-=2)*t *(((s *=(1.525))+1)*t+s)+2)+b;
	}

	Ease.backOut=function(t,b,c,d,s){
		(s===void 0)&& (s=1.70158);
		return c *((t=t / d-1)*t *((s+1)*t+s)+1)+b;
	}

	Ease.elasticIn=function(t,b,c,d,a,p){
		(a===void 0)&& (a=0);
		(p===void 0)&& (p=0);
		var s;
		if (t==0)return b;
		if ((t /=d)==1)return b+c;
		if (!p)p=d *.3;
		if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
			a=c;
			s=p / 4;
		}else s=p / Ease.PI2 *Math.asin(c / a);
		return-(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
	}

	Ease.elasticInOut=function(t,b,c,d,a,p){
		(a===void 0)&& (a=0);
		(p===void 0)&& (p=0);
		var s;
		if (t==0)return b;
		if ((t /=d *0.5)==2)return b+c;
		if (!p)p=d *(.3 *1.5);
		if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
			a=c;
			s=p / 4;
		}else s=p / Ease.PI2 *Math.asin(c / a);
		if (t < 1)return-.5 *(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
		return a *Math.pow(2,-10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p)*.5+c+b;
	}

	Ease.elasticOut=function(t,b,c,d,a,p){
		(a===void 0)&& (a=0);
		(p===void 0)&& (p=0);
		var s;
		if (t==0)return b;
		if ((t /=d)==1)return b+c;
		if (!p)p=d *.3;
		if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
			a=c;
			s=p / 4;
		}else s=p / Ease.PI2 *Math.asin(c / a);
		return (a *Math.pow(2,-10 *t)*Math.sin((t *d-s)*Ease.PI2 / p)+c+b);
	}

	Ease.strongIn=function(t,b,c,d){
		return c *(t /=d)*t *t *t *t+b;
	}

	Ease.strongInOut=function(t,b,c,d){
		if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
		return c *0.5 *((t-=2)*t *t *t *t+2)+b;
	}

	Ease.strongOut=function(t,b,c,d){
		return c *((t=t / d-1)*t *t *t *t+1)+b;
	}

	Ease.sineInOut=function(t,b,c,d){
		return-c *0.5 *(Math.cos(Math.PI *t / d)-1)+b;
	}

	Ease.sineIn=function(t,b,c,d){
		return-c *Math.cos(t / d *Ease.HALF_PI)+c+b;
	}

	Ease.sineOut=function(t,b,c,d){
		return c *Math.sin(t / d *Ease.HALF_PI)+b;
	}

	Ease.quintIn=function(t,b,c,d){
		return c *(t /=d)*t *t *t *t+b;
	}

	Ease.quintInOut=function(t,b,c,d){
		if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
		return c *0.5 *((t-=2)*t *t *t *t+2)+b;
	}

	Ease.quintOut=function(t,b,c,d){
		return c *((t=t / d-1)*t *t *t *t+1)+b;
	}

	Ease.quartIn=function(t,b,c,d){
		return c *(t /=d)*t *t *t+b;
	}

	Ease.quartInOut=function(t,b,c,d){
		if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t+b;
		return-c *0.5 *((t-=2)*t *t *t-2)+b;
	}

	Ease.quartOut=function(t,b,c,d){
		return-c *((t=t / d-1)*t *t *t-1)+b;
	}

	Ease.cubicIn=function(t,b,c,d){
		return c *(t /=d)*t *t+b;
	}

	Ease.cubicInOut=function(t,b,c,d){
		if ((t /=d *0.5)< 1)return c *0.5 *t *t *t+b;
		return c *0.5 *((t-=2)*t *t+2)+b;
	}

	Ease.cubicOut=function(t,b,c,d){
		return c *((t=t / d-1)*t *t+1)+b;
	}

	Ease.quadIn=function(t,b,c,d){
		return c *(t /=d)*t+b;
	}

	Ease.quadInOut=function(t,b,c,d){
		if ((t /=d *0.5)< 1)return c *0.5 *t *t+b;
		return-c *0.5 *((--t)*(t-2)-1)+b;
	}

	Ease.quadOut=function(t,b,c,d){
		return-c *(t /=d)*(t-2)+b;
	}

	Ease.expoIn=function(t,b,c,d){
		return (t==0)? b :c *Math.pow(2,10 *(t / d-1))+b-c *0.001;
	}

	Ease.expoInOut=function(t,b,c,d){
		if (t==0)return b;
		if (t==d)return b+c;
		if ((t /=d *0.5)< 1)return c *0.5 *Math.pow(2,10 *(t-1))+b;
		return c *0.5 *(-Math.pow(2,-10 *--t)+2)+b;
	}

	Ease.expoOut=function(t,b,c,d){
		return (t==d)? b+c :c *(-Math.pow(2,-10 *t / d)+1)+b;
	}

	Ease.circIn=function(t,b,c,d){
		return-c *(Math.sqrt(1-(t /=d)*t)-1)+b;
	}

	Ease.circInOut=function(t,b,c,d){
		if ((t /=d *0.5)< 1)return-c *0.5 *(Math.sqrt(1-t *t)-1)+b;
		return c *0.5 *(Math.sqrt(1-(t-=2)*t)+1)+b;
	}

	Ease.circOut=function(t,b,c,d){
		return c *Math.sqrt(1-(t=t / d-1)*t)+b;
	}

	Ease.HALF_PI=Math.PI *0.5;
	Ease.PI2=Math.PI *2;
	return Ease;
})()


/**
*鼠标点击区域，可以设置绘制一系列矢量图作为点击区域和非点击区域（目前只支持圆形，矩形，多边形）
*/
//class laya.utils.HitArea
var HitArea=(function(){
	function HitArea(){
		/**@private */
		this._hit=null;
		/**@private */
		this._unHit=null;
	}

	__class(HitArea,'laya.utils.HitArea');
	var __proto=HitArea.prototype;
	/**
	*是否包含某个点
	*@param x x坐标
	*@param y y坐标
	*@return 是否点击到
	*/
	__proto.isHit=function(x,y){
		if (!HitArea.isHitGraphic(x,y,this.hit))return false;
		return !HitArea.isHitGraphic(x,y,this.unHit);
	}

	/**
	*检测对象是否包含指定的点。
	*@param x 点的 X 轴坐标值（水平位置）。
	*@param y 点的 Y 轴坐标值（垂直位置）。
	*@return 如果包含指定的点，则值为 true；否则为 false。
	*/
	__proto.contains=function(x,y){
		return this.isHit(x,y);
	}

	/**
	*可点击区域，可以设置绘制一系列矢量图作为点击区域（目前只支持圆形，矩形，多边形）
	*/
	__getset(0,__proto,'hit',function(){
		if (!this._hit)this._hit=new Graphics();
		return this._hit;
		},function(value){
		this._hit=value;
	});

	/**
	*不可点击区域，可以设置绘制一系列矢量图作为非点击区域（目前只支持圆形，矩形，多边形）
	*/
	__getset(0,__proto,'unHit',function(){
		if (!this._unHit)this._unHit=new Graphics();
		return this._unHit;
		},function(value){
		this._unHit=value;
	});

	HitArea.isHitGraphic=function(x,y,graphic){
		if (!graphic)return false;
		var cmds;
		cmds=graphic.cmds;
		if (!cmds && graphic._one){
			cmds=HitArea._cmds;
			cmds.length=1;
			cmds[0]=graphic._one;
		}
		if (!cmds)return false;
		var i=0,len=0;
		len=cmds.length;
		var cmd;
		for (i=0;i < len;i++){
			cmd=cmds[i];
			if (!cmd)continue ;
			var context=Render._context;
			switch (cmd.callee){
				case context._translate:
				case 6:
					x-=cmd[0];
					y-=cmd[1];
				default :
				}
			if (HitArea.isHitCmd(x,y,cmd))return true;
		}
		return false;
	}

	HitArea.isHitCmd=function(x,y,cmd){
		if (!cmd)return false;
		var context=Render._context;
		var rst=false;
		switch (cmd["callee"]){
			case context._drawRect:
			case 13:
				HitArea._rec.setTo(cmd[0],cmd[1],cmd[2],cmd[3]);
				rst=HitArea._rec.contains(x,y);
				break ;
			case context._drawCircle:
			case context._fillCircle:
			case 14:;
				var d=NaN;
				x-=cmd[0];
				y-=cmd[1];
				d=x *x+y *y;
				rst=d < cmd[2] *cmd[2];
				break ;
			case context._drawPoly:
			case 18:
				x-=cmd[0];
				y-=cmd[1];
				rst=HitArea.ptInPolygon(x,y,cmd[2]);
				break ;
			default :
				break ;
			}
		return rst;
	}

	HitArea.ptInPolygon=function(x,y,areaPoints){
		var p;
		p=HitArea._ptPoint;
		p.setTo(x,y);
		var nCross=0;
		var p1x=NaN,p1y=NaN,p2x=NaN,p2y=NaN;
		var len=0;
		len=areaPoints.length;
		for (var i=0;i < len;i+=2){
			p1x=areaPoints[i];
			p1y=areaPoints[i+1];
			p2x=areaPoints[(i+2)% len];
			p2y=areaPoints[(i+3)% len];
			if (p1y==p2y)
				continue ;
			if (p.y < Math.min(p1y,p2y))
				continue ;
			if (p.y >=Math.max(p1y,p2y))
				continue ;
			var tx=(p.y-p1y)*(p2x-p1x)/ (p2y-p1y)+p1x;
			if (tx > p.x){
				nCross++;
			}
		}
		return (nCross % 2==1);
	}

	HitArea._cmds=[];
	__static(HitArea,
	['_rec',function(){return this._rec=new Rectangle();},'_ptPoint',function(){return this._ptPoint=new Point();}
	]);
	return HitArea;
})()


/**
*@private
*<code>HTMLChar</code> 是一个 HTML 字符类。
*/
//class laya.utils.HTMLChar
var HTMLChar=(function(){
	function HTMLChar(char,w,h,style){
		//this._sprite=null;
		//this._x=NaN;
		//this._y=NaN;
		//this._w=NaN;
		//this._h=NaN;
		/**表示是否是正常单词(英文|.|数字)。*/
		//this.isWord=false;
		/**字符。*/
		//this.char=null;
		/**字符数量。*/
		//this.charNum=NaN;
		/**CSS 样式。*/
		//this.style=null;
		this.char=char;
		this.charNum=char.charCodeAt(0);
		this._x=this._y=0;
		this.width=w;
		this.height=h;
		this.style=style;
		this.isWord=!HTMLChar._isWordRegExp.test(char);
	}

	__class(HTMLChar,'laya.utils.HTMLChar');
	var __proto=HTMLChar.prototype;
	Laya.imps(__proto,{"laya.display.ILayout":true})
	/**
	*设置与此对象绑定的显示对象 <code>Sprite</code> 。
	*@param sprite 显示对象 <code>Sprite</code> 。
	*/
	__proto.setSprite=function(sprite){
		this._sprite=sprite;
	}

	/**
	*获取与此对象绑定的显示对象 <code>Sprite</code>。
	*@return
	*/
	__proto.getSprite=function(){
		return this._sprite;
	}

	/**@private */
	__proto._isChar=function(){
		return true;
	}

	/**@private */
	__proto._getCSSStyle=function(){
		return this.style;
	}

	/**
	*宽度。
	*/
	__getset(0,__proto,'width',function(){
		return this._w;
		},function(value){
		this._w=value;
	});

	/**
	*此对象存储的 X 轴坐标值。
	*当设置此值时，如果此对象有绑定的 Sprite 对象，则改变 Sprite 对象的属性 x 的值。
	*/
	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		if (this._sprite){
			this._sprite.x=value;
		}
		this._x=value;
	});

	/**
	*此对象存储的 Y 轴坐标值。
	*当设置此值时，如果此对象有绑定的 Sprite 对象，则改变 Sprite 对象的属性 y 的值。
	*/
	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		if (this._sprite){
			this._sprite.y=value;
		}
		this._y=value;
	});

	/**
	*高度。
	*/
	__getset(0,__proto,'height',function(){
		return this._h;
		},function(value){
		this._h=value;
	});

	HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
	return HTMLChar;
})()


/**
*<code>Log</code> 类用于在界面内显示日志记录信息。
*/
//class laya.utils.Log
var Log=(function(){
	function Log(){}
	__class(Log,'laya.utils.Log');
	Log.enable=function(){
		if (!Log._logdiv){
			Log._logdiv=Browser.window.document.createElement('div');
			Browser.window.document.body.appendChild(Log._logdiv);
			Log._logdiv.style.cssText="pointer-events:none;border:white;overflow:hidden;z-index:1000000;background:rgba(100,100,100,0.6);color:white;position: absolute;left:0px;top:0px;width:50%;height:50%;";
		}
	}

	Log.toggle=function(){
		var style=Log._logdiv.style;
		if (style.width=="1px"){
			style.width=style.height="50%";
			}else {
			style.width=style.height="1px";
		}
	}

	Log.print=function(value){
		if (Log._logdiv){
			if (Log._count >=Log.maxCount)Log.clear();
			Log._count++;
			Log._logdiv.innerText+=value+"\n";
			Log._logdiv.scrollTop=Log._logdiv.scrollHeight;
		}
	}

	Log.clear=function(){
		Log._logdiv.innerText="";
		Log._count=0;
	}

	Log._logdiv=null;
	Log._count=0;
	Log.maxCount=20;
	return Log;
})()


/**
*<code>Mouse</code> 类用于控制鼠标光标。
*/
//class laya.utils.Mouse
var Mouse=(function(){
	function Mouse(){}
	__class(Mouse,'laya.utils.Mouse');
	/**
	*设置鼠标样式
	*@param cursorStr
	*例如auto move no-drop col-resize
	*all-scroll pointer not-allowed row-resize
	*crosshair progress e-resize ne-resize
	*default text n-resize nw-resize
	*help vertical-text s-resize se-resize
	*inherit wait w-resize sw-resize
	*
	*/
	__getset(1,Mouse,'cursor',function(){
		return Mouse._style.cursor;
		},function(cursorStr){
		Mouse._style.cursor=cursorStr;
	});

	Mouse.hide=function(){
		if (Mouse.cursor !="none"){
			Mouse._preCursor=Mouse.cursor;
			Mouse.cursor="none";
		}
	}

	Mouse.show=function(){
		if (Mouse.cursor=="none"){
			if (Mouse._preCursor){
				Mouse.cursor=Mouse._preCursor;
				}else {
				Mouse.cursor="auto";
			}
		}
	}

	Mouse._preCursor=null;
	__static(Mouse,
	['_style',function(){return this._style=Browser.document.body.style;}
	]);
	return Mouse;
})()


/**
*<p> <code>Pool</code> 是对象池类，用于对象的存贮、重复使用。</p>
*<p>合理使用对象池，可以有效减少对象创建的开销，避免频繁的垃圾回收，从而优化游戏流畅度。</p>
*/
//class laya.utils.Pool
var Pool=(function(){
	function Pool(){}
	__class(Pool,'laya.utils.Pool');
	Pool.getPoolBySign=function(sign){
		return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
	}

	Pool.clearBySign=function(sign){
		if (Pool._poolDic[sign])Pool._poolDic[sign].length=0;
	}

	Pool.recover=function(sign,item){
		if (item["__InPool"])return;
		item["__InPool"]=true;
		Pool.getPoolBySign(sign).push(item);
	}

	Pool.getItemByClass=function(sign,cls){
		var pool=Pool.getPoolBySign(sign);
		var rst=pool.length ? pool.pop():new cls();
		rst["__InPool"]=false;
		return rst;
	}

	Pool.getItemByCreateFun=function(sign,createFun,caller){
		var pool=Pool.getPoolBySign(sign);
		var rst=pool.length ? pool.pop():createFun.call(caller);
		rst["__InPool"]=false;
		return rst;
	}

	Pool.getItem=function(sign){
		var pool=Pool.getPoolBySign(sign);
		var rst=pool.length ? pool.pop():null;
		if (rst){
			rst["__InPool"]=false;
		}
		return rst;
	}

	Pool._poolDic={};
	Pool.InPoolSign="__InPool";
	return Pool;
})()


/**
*@private
*基于个数的对象缓存管理器
*/
//class laya.utils.PoolCache
var PoolCache=(function(){
	function PoolCache(){
		/**
		*对象在Pool中的标识
		*/
		this.sign=null;
		/**
		*允许缓存的最大数量
		*/
		this.maxCount=1000;
	}

	__class(PoolCache,'laya.utils.PoolCache');
	var __proto=PoolCache.prototype;
	/**
	*获取缓存的对象列表
	*@return
	*
	*/
	__proto.getCacheList=function(){
		return Pool.getPoolBySign(this.sign);
	}

	/**
	*尝试清理缓存
	*@param force 是否强制清理
	*
	*/
	__proto.tryDispose=function(force){
		var list;
		list=Pool.getPoolBySign(this.sign);
		if (list.length > this.maxCount){
			list.splice(this.maxCount,list.length-this.maxCount);
		}
	}

	PoolCache.addPoolCacheManager=function(sign,maxCount){
		(maxCount===void 0)&& (maxCount=100);
		var cache;
		cache=new PoolCache();
		cache.sign=sign;
		cache.maxCount=maxCount;
		CacheManager.regCacheByFunction(Utils.bind(cache.tryDispose,cache),Utils.bind(cache.getCacheList,cache));
	}

	return PoolCache;
})()


/**
*<p> <code>Stat</code> 是一个性能统计面板，可以实时更新相关的性能参数。</p>
*<p>参与统计的性能参数如下（所有参数都是每大约1秒进行更新）：<br/>
*FPS(Canvas)/FPS(WebGL)：Canvas 模式或者 WebGL 模式下的帧频，也就是每秒显示的帧数，值越高、越稳定，感觉越流畅；<br/>
*Sprite：统计所有渲染节点（包括容器）数量，它的大小会影响引擎进行节点遍历、数据组织和渲染的效率。其值越小，游戏运行效率越高；<br/>
*DrawCall：此值是决定性能的重要指标，其值越小，游戏运行效率越高。Canvas模式下表示每大约1秒的图像绘制次数；WebGL模式下表示每大约1秒的渲染提交批次，每次准备数据并通知GPU渲染绘制的过程称为1次DrawCall，在每次DrawCall中除了在通知GPU的渲染上比较耗时之外，切换材质与shader也是非常耗时的操作；<br/>
*CurMem：Canvas模式下，表示内存占用大小，值越小越好，过高会导致游戏闪退；WebGL模式下，表示内存与显存的占用，值越小越好；<br/>
*Shader：是 WebGL 模式独有的性能指标，表示每大约1秒 Shader 提交次数，值越小越好；<br/>
*Canvas：由三个数值组成，只有设置 CacheAs 后才会有值，默认为0/0/0。从左到右数值的意义分别为：每帧重绘的画布数量 / 缓存类型为"normal"类型的画布数量 / 缓存类型为"bitmap"类型的画布数量。</p>
*/
//class laya.utils.Stat
var Stat=(function(){
	function Stat(){}
	__class(Stat,'laya.utils.Stat');
	/**
	*点击性能统计显示区域的处理函数。
	*/
	__getset(1,Stat,'onclick',null,function(fn){
		if (Stat._sp){
			Stat._sp.on("click",Stat._sp,fn);
		}
		if (Stat._canvas){
			Stat._canvas.source.onclick=fn;
			Stat._canvas.source.style.pointerEvents='';
		}
	});

	Stat.show=function(x,y){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		if (Render.isConchApp && !Render.isConchWebGL){
			Browser.window.conch.showFPS && Browser.window.conch.showFPS(x,y);
			return;
		}
		if (!Render.isConchWebGL && !Browser.onMiniGame &&! Browser.onLimixiu && !Browser.onKGMiniGame && !Browser.onBDMiniGame&& !Browser.onTTMiniGame && !Browser.onQGMiniGame && !Browser.onVVMiniGame && !Browser.onBLMiniGame && !Browser.onAlipayMiniGame && !Browser.onQQMiniGame && !Browser.onTTMiniGame && !Browser.onHWMiniGame && !Browser.onTBMiniGame)Stat._useCanvas=true;
		Stat._show=true;
		Stat._fpsData.length=60;
		Stat._view[0]={title:"FPS(Canvas)",value:"_fpsStr",color:"yellow",units:"int"};
		Stat._view[1]={title:"Sprite",value:"_spriteStr",color:"white",units:"int"};
		Stat._view[2]={title:"DrawCall",value:"drawCall",color:"white",units:"int"};
		Stat._view[3]={title:"CurMem",value:"currentMemorySize",color:"yellow",units:"M"};
		if (Render.isWebGL){
			Stat._view[4]={title:"Shader",value:"shaderCall",color:"white",units:"int"};
			if (!Render.is3DMode){
				Stat._view[0].title="FPS(WebGL)";
				Stat._view[5]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
				}else {
				Stat._view[0].title="FPS(3D)";
				Stat._view[5]={title:"TriFaces",value:"trianglesFaces",color:"white",units:"int"};
				Stat._view[6]={title:"treeNodeColl",value:"treeNodeCollision",color:"white",units:"int"};
				Stat._view[7]={title:"treeSpriteColl",value:"treeSpriteCollision",color:"white",units:"int"};
			}
			}else {
			Stat._view[4]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
		}
		if (Stat._useCanvas){
			Stat.createUIPre(x,y);
		}else
		Stat.createUI(x,y);
		Stat.enable();
	}

	Stat.createUIPre=function(x,y){
		var pixel=Browser.pixelRatio;
		if(Laya.stage.useRetinalCanvas){
			pixel=3;
		}
		Stat._width=pixel *130;
		Stat._vx=pixel *75;
		Stat._height=pixel *(Stat._view.length *12+3 *pixel)+4;
		Stat._fontSize=12 *pixel;
		for (var i=0;i < Stat._view.length;i++){
			Stat._view[i].x=4;
			Stat._view[i].y=i *Stat._fontSize+2 *pixel;
		}
		if (!Stat._canvas){
			Stat._canvas=new HTMLCanvas('2D');
			Stat._canvas.size(Stat._width,Stat._height);
			Stat._ctx=Stat._canvas.getContext('2d');
			Stat._ctx.textBaseline="top";
			Stat._ctx.font=Stat._fontSize+"px Sans-serif";
			Stat._canvas.source.style.cssText="pointer-events:none;background:rgba(150,150,150,0.8);z-index:100000;position: absolute;direction:ltr;left:"+x+"px;top:"+y+"px;width:"+(Stat._width / pixel)+"px;height:"+(Stat._height / pixel)+"px;";
		}
		Stat._first=true;
		Stat.loop();
		Stat._first=false;
		if(!Browser.onKGMiniGame){
			Browser.container.appendChild(Stat._canvas.source);
		}
	}

	Stat.createUI=function(x,y){
		var stat=Stat._sp;
		var pixel=Browser.pixelRatio;
		if(Laya.stage.useRetinalCanvas){
			pixel=3;
		}
		if (!stat){
			stat=new Sprite();
			Stat._leftText=new Text();
			Stat._leftText.pos(5,5);
			Stat._leftText.color="#ffffff";
			stat.addChild(Stat._leftText);
			Stat._txt=new Text();
			Stat._txt.pos(80*pixel,5);
			Stat._txt.color="#ffffff";
			stat.addChild(Stat._txt);
			Stat._sp=stat;
		}
		stat.pos(x,y);
		var text="";
		for (var i=0;i < Stat._view.length;i++){
			var one=Stat._view[i];
			text+=one.title+"\n";
		}
		Stat._leftText.text=text;
		var width=pixel *138;
		var height=pixel *(Stat._view.length *12+3 *pixel)+4;
		Stat._txt.fontSize=Stat._fontSize *pixel;
		Stat._leftText.fontSize=Stat._fontSize *pixel;
		stat.size(width,height);
		stat.graphics.clear();
		stat.graphics.setAlpha(0.5);
		stat.graphics.drawRect(0,0,width,height,"#999999");
		stat.graphics.setAlpha(1);
		Stat.loop();
	}

	Stat.enable=function(){
		Laya.timer.frameLoop(1,Stat,Stat.loop);
	}

	Stat.hide=function(){
		Stat._show=false;
		Laya.timer.clear(Stat,Stat.loop);
		if (Stat._canvas){
			Browser.removeElement(Stat._canvas.source);
		}
	}

	Stat.clear=function(){
		Stat.trianglesFaces=Stat.drawCall=Stat.shaderCall=Stat.spriteCount=Stat.spriteRenderUseCacheCount=Stat.treeNodeCollision=Stat.treeSpriteCollision=Stat.canvasNormal=Stat.canvasBitmap=Stat.canvasReCache=0;
	}

	Stat.loop=function(){
		Stat._count++;
		var timer=Browser.now();
		if (timer-Stat._timer < 1000)return;
		var count=Stat._count;
		Stat.FPS=Math.round((count *1000)/ (timer-Stat._timer));
		if (Stat._show){
			Stat.trianglesFaces=Math.round(Stat.trianglesFaces / count);
			if (!Stat._useCanvas){
				Stat.drawCall=Math.round(Stat.drawCall / count)-2;
				Stat.shaderCall=Math.round(Stat.shaderCall / count)-4;
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-4;
				}else{
				Stat.drawCall=Math.round(Stat.drawCall / count)-2;
				Stat.shaderCall=Math.round(Stat.shaderCall / count);
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-1;
			}
			Stat.spriteRenderUseCacheCount=Math.round(Stat.spriteRenderUseCacheCount / count);
			Stat.canvasNormal=Math.round(Stat.canvasNormal / count);
			Stat.canvasBitmap=Math.round(Stat.canvasBitmap / count);
			Stat.canvasReCache=Math.ceil(Stat.canvasReCache / count);
			Stat.treeNodeCollision=Math.round(Stat.treeNodeCollision / count);
			Stat.treeSpriteCollision=Math.round(Stat.treeSpriteCollision / count);
			var delay=Stat.FPS > 0 ? Math.floor(1000 / Stat.FPS).toString():" ";
			Stat._fpsStr=Stat.FPS+(Stat.renderSlow ? " slow" :"")+" "+delay;
			Stat._spriteStr=Stat.spriteCount+(Stat.spriteRenderUseCacheCount ? ("/"+Stat.spriteRenderUseCacheCount):'');
			Stat._canvasStr=Stat.canvasReCache+"/"+Stat.canvasNormal+"/"+Stat.canvasBitmap;
			Stat.currentMemorySize=ResourceManager.systemResourceManager.memorySize;
			if (Stat._useCanvas){
				Stat.renderInfoPre();
			}else
			Stat.renderInfo();
			Stat.clear();
		}
		Stat._count=0;
		Stat._timer=timer;
	}

	Stat.renderInfoPre=function(){
		if (Stat._canvas){
			var ctx=Stat._ctx;
			ctx.clearRect(Stat._first ? 0 :Stat._vx,0,Stat._width,Stat._height);
			for (var i=0;i < Stat._view.length;i++){
				var one=Stat._view[i];
				if (Stat._first){
					ctx.fillStyle="white";
					ctx.fillText(one.title,one.x,one.y,null,null,null);
				}
				ctx.fillStyle=one.color;
				var value=Stat[one.value];
				(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
				ctx.fillText(value+"",one.x+Stat._vx,one.y,null,null,null);
			}
		}
	}

	Stat.renderInfo=function(){
		var text="";
		for (var i=0;i < Stat._view.length;i++){
			var one=Stat._view[i];
			var value=Stat[one.value];
			(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
			(one.units=="K")&& (value=Math.floor(value / (1024)*100)/ 100+" K");
			text+=value+"\n";
		}
		Stat._txt.text=text;
	}

	Stat.FPS=0;
	Stat.loopCount=0;
	Stat.shaderCall=0;
	Stat.drawCall=0;
	Stat.trianglesFaces=0;
	Stat.spriteCount=0;
	Stat.spriteRenderUseCacheCount=0;
	Stat.treeNodeCollision=0;
	Stat.treeSpriteCollision=0;
	Stat.canvasNormal=0;
	Stat.canvasBitmap=0;
	Stat.canvasReCache=0;
	Stat.renderSlow=false;
	Stat.currentMemorySize=0;
	Stat._fpsStr=null;
	Stat._canvasStr=null;
	Stat._spriteStr=null;
	Stat._fpsData=[];
	Stat._timer=0;
	Stat._count=0;
	Stat._view=[];
	Stat._fontSize=12;
	Stat._txt=null;
	Stat._leftText=null;
	Stat._sp=null;
	Stat._show=false;
	Stat._useCanvas=false;
	Stat._canvas=null;
	Stat._ctx=null;
	Stat._first=false;
	Stat._vx=NaN;
	Stat._width=0;
	Stat._height=100;
	return Stat;
})()


/**
*@private
*<code>StringKey</code> 类用于存取字符串对应的数字。
*/
//class laya.utils.StringKey
var StringKey=(function(){
	function StringKey(){
		this._strsToID={};
		this._idToStrs=[];
		this._length=0;
	}

	__class(StringKey,'laya.utils.StringKey');
	var __proto=StringKey.prototype;
	/**
	*添加一个字符。
	*@param str 字符，将作为key 存储相应生成的数字。
	*@return 此字符对应的数字。
	*/
	__proto.add=function(str){
		var index=this._strsToID[str];
		if (index !=null)return index;
		this._idToStrs[this._length]=str;
		return this._strsToID[str]=this._length++;
	}

	/**
	*获取指定字符对应的ID。
	*@param str 字符。
	*@return 此字符对应的ID。
	*/
	__proto.getID=function(str){
		var index=this._strsToID[str];
		return index==null ?-1 :index;
	}

	/**
	*根据指定ID获取对应字符。
	*@param id ID。
	*@return 此id对应的字符。
	*/
	__proto.getName=function(id){
		var str=this._idToStrs[id];
		return str==null ? undefined :str;
	}

	return StringKey;
})()


/**
*<code>Timer</code> 是时钟管理类。它是一个单例，不要手动实例化此类，应该通过 Laya.timer 访问。
*/
//class laya.utils.Timer
var Timer=(function(){
	var TimerHandler;
	function Timer(){
		/**两帧之间的时间间隔,单位毫秒。*/
		this._delta=0;
		/**时针缩放。*/
		this.scale=1;
		/**当前的帧数。*/
		this.currFrame=0;
		/**@private */
		this._mid=1;
		/**@private */
		this._map=[];
		/**@private */
		this._laters=[];
		/**@private */
		this._handlers=[];
		/**@private */
		this._temp=[];
		/**@private */
		this._count=0;
		this.currTimer=this._now();
		this._lastTimer=this._now();
		this._init();
	}

	__class(Timer,'laya.utils.Timer');
	var __proto=Timer.prototype;
	/**@private */
	__proto._init=function(){
		Laya.timer && Laya.timer.frameLoop(1,this,this._update);
	}

	/**@private */
	__proto._now=function(){
		return /*__JS__ */Date.now();
	}

	/**
	*@private
	*帧循环处理函数。
	*/
	__proto._update=function(){
		if (this.scale <=0){
			this._lastTimer=this._now();
			return;
		};
		var frame=this.currFrame=this.currFrame+this.scale;
		var now=this._now();
		this._delta=(now-this._lastTimer)*this.scale;
		var timer=this.currTimer=this.currTimer+this._delta;
		this._lastTimer=now;
		var handlers=this._handlers;
		this._count=0;
		for (i=0,n=handlers.length;i < n;i++){
			handler=handlers[i];
			if (handler.method!==null){
				var t=handler.userFrame ? frame :timer;
				if (t >=handler.exeTime){
					if (handler.repeat){
						if (!handler.jumpFrame){
							handler.exeTime+=handler.delay;
							handler.run(false);
							if (t > handler.exeTime){
								handler.exeTime+=Math.ceil((t-handler.exeTime)/ handler.delay)*handler.delay;
							}
							}else {
							while (t >=handler.exeTime){
								handler.exeTime+=handler.delay;
								handler.run(false);
							}
						}
						}else {
						handler.run(true);
					}
				}
				}else {
				this._count++;
			}
		}
		if (this._count > 30 || frame % 200===0)this._clearHandlers();
		var laters=this._laters;
		for (var i=0,n=laters.length-1;i <=n;i++){
			var handler=laters[i];
			if (handler.method!==null){
				this._map[handler.key]=null;
				handler.run(false);
			}
			this._recoverHandler(handler);
			i===n && (n=laters.length-1);
		}
		laters.length=0;
	}

	/**@private */
	__proto._clearHandlers=function(){
		var handlers=this._handlers;
		for (var i=0,n=handlers.length;i < n;i++){
			var handler=handlers[i];
			if (handler.method!==null)this._temp.push(handler);
			else this._recoverHandler(handler);
		}
		this._handlers=this._temp;
		this._temp=handlers;
		this._temp.length=0;
	}

	/**@private */
	__proto._recoverHandler=function(handler){
		if(this._map[handler.key]==handler)this._map[handler.key]=null;
		handler.clear();
		Timer._pool.push(handler);
	}

	/**@private */
	__proto._create=function(useFrame,repeat,delay,caller,method,args,coverBefore){
		if (!delay){
			method.apply(caller,args);
			return null;
		}
		if (coverBefore){
			var handler=this._getHandler(caller,method);
			if (handler){
				handler.repeat=repeat;
				handler.userFrame=useFrame;
				handler.delay=delay;
				handler.caller=caller;
				handler.method=method;
				handler.args=args;
				handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer+this._now()-this._lastTimer);
				return handler;
			}
		}
		handler=Timer._pool.length > 0 ? Timer._pool.pop():new TimerHandler();
		handler.repeat=repeat;
		handler.userFrame=useFrame;
		handler.delay=delay;
		handler.caller=caller;
		handler.method=method;
		handler.args=args;
		handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer+this._now()-this._lastTimer)+1;
		this._indexHandler(handler);
		this._handlers.push(handler);
		return handler;
	}

	/**@private */
	__proto._indexHandler=function(handler){
		var caller=handler.caller;
		var method=handler.method;
		var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
		var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
		handler.key=cid+mid;
		this._map[handler.key]=handler;
	}

	/**
	*定时执行一次。
	*@param delay 延迟时间(单位为毫秒)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*/
	__proto.once=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this._create(false,false,delay,caller,method,args,coverBefore);
	}

	/**
	*定时重复执行。
	*@param delay 间隔时间(单位毫秒)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*@param jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
	*/
	__proto.loop=function(delay,caller,method,args,coverBefore,jumpFrame){
		(coverBefore===void 0)&& (coverBefore=true);
		(jumpFrame===void 0)&& (jumpFrame=false);
		var handler=this._create(false,true,delay,caller,method,args,coverBefore);
		if (handler)handler.jumpFrame=jumpFrame;
	}

	/**
	*定时执行一次(基于帧率)。
	*@param delay 延迟几帧(单位为帧)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*/
	__proto.frameOnce=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this._create(true,false,delay,caller,method,args,coverBefore);
	}

	/**
	*定时重复执行(基于帧率)。
	*@param delay 间隔几帧(单位为帧)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*/
	__proto.frameLoop=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this._create(true,true,delay,caller,method,args,coverBefore);
	}

	/**返回统计信息。*/
	__proto.toString=function(){
		return "callLater:"+this._laters.length+" handlers:"+this._handlers.length+" pool:"+Timer._pool.length;
	}

	/**
	*清理定时器。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.clear=function(caller,method){
		var handler=this._getHandler(caller,method);
		if (handler){
			this._map[handler.key]=null;handler.key=0;
			handler.clear();
		}
	}

	/**
	*清理对象身上的所有定时器。
	*@param caller 执行域(this)。
	*/
	__proto.clearAll=function(caller){
		if (!caller)return;
		for (var i=0,n=this._handlers.length;i < n;i++){
			var handler=this._handlers[i];
			if (handler.caller===caller){
				this._map[handler.key]=null;handler.key=0;
				handler.clear();
			}
		}
	}

	/**@private */
	__proto._getHandler=function(caller,method){
		var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
		var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
		return this._map[cid+mid];
	}

	/**
	*延迟执行。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*/
	__proto.callLater=function(caller,method,args){
		if (this._getHandler(caller,method)==null){
			if (Timer._pool.length)
				var handler=Timer._pool.pop();
			else handler=new TimerHandler();
			handler.caller=caller;
			handler.method=method;
			handler.args=args;
			this._indexHandler(handler);
			this._laters.push(handler);
		}
	}

	/**
	*立即执行 callLater 。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.runCallLater=function(caller,method){
		var handler=this._getHandler(caller,method);
		if (handler && handler.method !=null){
			this._map[handler.key]=null;
			handler.run(true);
		}
	}

	/**
	*立即提前执行定时器，执行之后从队列中删除
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.runTimer=function(caller,method){
		this.runCallLater(caller,method);
	}

	/**
	*两帧之间的时间间隔,单位毫秒。
	*/
	__getset(0,__proto,'delta',function(){
		return this._delta;
	});

	Timer._pool=[];
	Timer.__init$=function(){
		/**@private */
		//class TimerHandler
		TimerHandler=(function(){
			function TimerHandler(){
				this.key=0;
				this.repeat=false;
				this.delay=0;
				this.userFrame=false;
				this.exeTime=0;
				this.caller=null;
				this.method=null;
				this.args=null;
				this.jumpFrame=false;
			}
			__class(TimerHandler,'');
			var __proto=TimerHandler.prototype;
			__proto.clear=function(){
				this.caller=null;
				this.method=null;
				this.args=null;
			}
			__proto.run=function(withClear){
				var caller=this.caller;
				if (caller && caller.destroyed)return this.clear();
				var method=this.method;
				var args=this.args;
				withClear && this.clear();
				if (method==null)return;
				args ? method.apply(caller,args):method.call(caller);
			}
			return TimerHandler;
		})()
	}

	return Timer;
})()


/**
*<code>Tween</code> 是一个缓动类。使用此类能够实现对目标对象属性的渐变。
*/
//class laya.utils.Tween
var Tween=(function(){
	function Tween(){
		/**@private */
		//this._complete=null;
		/**@private */
		//this._target=null;
		/**@private */
		//this._ease=null;
		/**@private */
		//this._props=null;
		/**@private */
		//this._duration=0;
		/**@private */
		//this._delay=0;
		/**@private */
		//this._startTimer=0;
		/**@private */
		//this._usedTimer=0;
		/**@private */
		//this._usedPool=false;
		/**@private */
		//this._delayParam=null;
		/**@private 唯一标识，TimeLintLite用到*/
		this.gid=0;
		/**更新回调，缓动数值发生变化时，回调变化的值*/
		//this.update=null;
	}

	__class(Tween,'laya.utils.Tween');
	var __proto=Tween.prototype;
	/**
	*缓动对象的props属性到目标值。
	*@param target 目标对象(即将更改属性值的对象)。
	*@param props 变化的属性列表，比如{x:100,y:20,ease:Ease.backOut,complete:Handler.create(this,onComplete),update:new Handler(this,onComplete)}。
	*@param duration 花费的时间，单位毫秒。
	*@param ease 缓动类型，默认为匀速运动。
	*@param complete 结束回调函数。
	*@param delay 延迟执行时间。
	*@param coverBefore 是否覆盖之前的缓动。
	*@return 返回Tween对象。
	*/
	__proto.to=function(target,props,duration,ease,complete,delay,coverBefore){
		(delay===void 0)&& (delay=0);
		(coverBefore===void 0)&& (coverBefore=false);
		return this._create(target,props,duration,ease,complete,delay,coverBefore,true,false,true);
	}

	/**
	*从props属性，缓动到当前状态。
	*@param target 目标对象(即将更改属性值的对象)。
	*@param props 变化的属性列表，比如{x:100,y:20,ease:Ease.backOut,complete:Handler.create(this,onComplete),update:new Handler(this,onComplete)}。
	*@param duration 花费的时间，单位毫秒。
	*@param ease 缓动类型，默认为匀速运动。
	*@param complete 结束回调函数。
	*@param delay 延迟执行时间。
	*@param coverBefore 是否覆盖之前的缓动。
	*@return 返回Tween对象。
	*/
	__proto.from=function(target,props,duration,ease,complete,delay,coverBefore){
		(delay===void 0)&& (delay=0);
		(coverBefore===void 0)&& (coverBefore=false);
		return this._create(target,props,duration,ease,complete,delay,coverBefore,false,false,true);
	}

	/**@private */
	__proto._create=function(target,props,duration,ease,complete,delay,coverBefore,isTo,usePool,runNow){
		if (!target)throw new Error("Tween:target is null");
		this._target=target;
		this._duration=duration;
		this._ease=ease || props.ease || Tween.easeNone;
		this._complete=complete || props.complete;
		this._delay=delay;
		this._props=[];
		this._usedTimer=0;
		this._startTimer=Browser.now();
		this._usedPool=usePool;
		this._delayParam=null;
		this.update=props.update;
		var gid=(target.$_GID || (target.$_GID=Utils.getGID()));
		if (!Tween.tweenMap[gid]){
			Tween.tweenMap[gid]=[this];
			}else {
			if (coverBefore)Tween.clearTween(target);
			Tween.tweenMap[gid].push(this);
		}
		if (runNow){
			if (delay <=0)this.firstStart(target,props,isTo);
			else{
				this._delayParam=[target,props,isTo];
				Laya.scaleTimer.once(delay,this,this.firstStart,this._delayParam);
			}
			}else {
			this._initProps(target,props,isTo);
		}
		return this;
	}

	__proto.firstStart=function(target,props,isTo){
		this._delayParam=null;
		if (target.destroyed){
			this.clear();
			return;
		}
		this._initProps(target,props,isTo);
		this._beginLoop();
	}

	__proto._initProps=function(target,props,isTo){
		for (var p in props){
			if ((typeof (target[p])=='number')){
				var start=isTo ? target[p] :props[p];
				var end=isTo ? props[p] :target[p];
				this._props.push([p,start,end-start]);
				if (!isTo)target[p]=start;
			}
		}
	}

	__proto._beginLoop=function(){
		Laya.scaleTimer.frameLoop(1,this,this._doEase);
	}

	/**执行缓动**/
	__proto._doEase=function(){
		this._updateEase(Browser.now());
	}

	/**@private */
	__proto._updateEase=function(time){
		var target=this._target;
		if (!target)return;
		if (target.destroyed)return Tween.clearTween(target);
		var usedTimer=this._usedTimer=time-this._startTimer-this._delay;
		if (usedTimer < 0)return;
		if (usedTimer >=this._duration)return this.complete();
		var ratio=usedTimer > 0 ? this._ease(usedTimer,0,1,this._duration):0;
		var props=this._props;
		for (var i=0,n=props.length;i < n;i++){
			var prop=props[i];
			target[prop[0]]=prop[1]+(ratio *prop[2]);
		}
		if (this.update)this.update.run();
	}

	/**
	*立即结束缓动并到终点。
	*/
	__proto.complete=function(){
		if (!this._target)return;
		Laya.scaleTimer.runTimer(this,this.firstStart);
		var target=this._target;
		var props=this._props;
		var handler=this._complete;
		for (var i=0,n=props.length;i < n;i++){
			var prop=props[i];
			target[prop[0]]=prop[1]+prop[2];
		}
		if (this.update)this.update.run();
		this.clear();
		handler && handler.run();
	}

	/**
	*暂停缓动，可以通过resume或restart重新开始。
	*/
	__proto.pause=function(){
		Laya.scaleTimer.clear(this,this._beginLoop);
		Laya.scaleTimer.clear(this,this._doEase);
		Laya.scaleTimer.clear(this,this.firstStart);
		var time=Browser.now();
		var dTime=NaN;
		dTime=time-this._startTimer-this._delay;
		if (dTime < 0){
			this._usedTimer=dTime;
		}
	}

	/**
	*设置开始时间。
	*@param startTime 开始时间。
	*/
	__proto.setStartTime=function(startTime){
		this._startTimer=startTime;
	}

	/**
	*停止并清理当前缓动。
	*/
	__proto.clear=function(){
		if (this._target){
			this._remove();
			this._clear();
		}
	}

	/**
	*@private
	*/
	__proto._clear=function(){
		this.pause();
		Laya.scaleTimer.clear(this,this.firstStart);
		this._complete=null;
		this._target=null;
		this._ease=null;
		this._props=null;
		this._delayParam=null;
		if (this._usedPool){
			this.update=null;
			Pool.recover("tween",this);
		}
	}

	/**回收到对象池。*/
	__proto.recover=function(){
		this._usedPool=true;
		this._clear();
	}

	__proto._remove=function(){
		var tweens=Tween.tweenMap[this._target.$_GID];
		if (tweens){
			for (var i=0,n=tweens.length;i < n;i++){
				if (tweens[i]===this){
					tweens.splice(i,1);
					break ;
				}
			}
		}
	}

	/**
	*重新开始暂停的缓动。
	*/
	__proto.restart=function(){
		this.pause();
		this._usedTimer=0;
		this._startTimer=Browser.now();
		if (this._delayParam){
			Laya.scaleTimer.once(this._delay,this,this.firstStart,this._delayParam);
			return;
		};
		var props=this._props;
		for (var i=0,n=props.length;i < n;i++){
			var prop=props[i];
			this._target[prop[0]]=prop[1];
		}
		Laya.scaleTimer.once(this._delay,this,this._beginLoop);
	}

	/**
	*恢复暂停的缓动。
	*/
	__proto.resume=function(){
		if (this._usedTimer >=this._duration)return;
		this._startTimer=Browser.now()-this._usedTimer-this._delay;
		if (this._delayParam){
			if (this._usedTimer < 0){
				Laya.scaleTimer.once(-this._usedTimer,this,this.firstStart,this._delayParam);
				}else{
				this.firstStart.apply(this,this._delayParam);
			}
			}else{
			this._beginLoop();
		}
	}

	/**设置当前执行比例**/
	__getset(0,__proto,'progress',null,function(v){
		var uTime=v *this._duration;
		this._startTimer=Browser.now()-this._delay-uTime;
	});

	Tween.to=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
		(delay===void 0)&& (delay=0);
		(coverBefore===void 0)&& (coverBefore=false);
		(autoRecover===void 0)&& (autoRecover=true);
		return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,true,autoRecover,true);
	}

	Tween.from=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
		(delay===void 0)&& (delay=0);
		(coverBefore===void 0)&& (coverBefore=false);
		(autoRecover===void 0)&& (autoRecover=true);
		return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,false,autoRecover,true);
	}

	Tween.clearAll=function(target){
		if (!target || !target.$_GID)return;
		var tweens=Tween.tweenMap[target.$_GID];
		if (tweens){
			for (var i=0,n=tweens.length;i < n;i++){
				tweens[i]._clear();
			}
			tweens.length=0;
		}
	}

	Tween.clear=function(tween){
		tween.clear();
	}

	Tween.clearTween=function(target){
		Tween.clearAll(target);
	}

	Tween.easeNone=function(t,b,c,d){
		return c *t / d+b;
	}

	Tween.tweenMap={};
	return Tween;
})()


/**
*<code>Utils</code> 是工具类。
*/
//class laya.utils.Utils
var Utils=(function(){
	function Utils(){}
	__class(Utils,'laya.utils.Utils');
	Utils.toRadian=function(angle){
		return angle *Utils._pi2;
	}

	Utils.toAngle=function(radian){
		return radian *Utils._pi;
	}

	Utils.toHexColor=function(color){
		if (color < 0 || isNaN(color))return null;
		var str=color.toString(16);
		while (str.length < 6)str="0"+str;
		return "#"+str;
	}

	Utils.getGID=function(){
		return Utils._gid++;
	}

	Utils.concatArray=function(source,array){
		if (!array)return source;
		if (!source)return array;
		var i=0,len=array.length;
		for (i=0;i < len;i++){
			source.push(array[i]);
		}
		return source;
	}

	Utils.clearArray=function(array){
		if (!array)return array;
		array.length=0;
		return array;
	}

	Utils.copyArray=function(source,array){
		source || (source=[]);
		if (!array)return source;
		source.length=array.length;
		var i=0,len=array.length;
		for (i=0;i < len;i++){
			source[i]=array[i];
		}
		return source;
	}

	Utils.getGlobalRecByPoints=function(sprite,x0,y0,x1,y1){
		var newLTPoint;
		newLTPoint=new Point(x0,y0);
		newLTPoint=sprite.localToGlobal(newLTPoint);
		var newRBPoint;
		newRBPoint=new Point(x1,y1);
		newRBPoint=sprite.localToGlobal(newRBPoint);
		return Rectangle._getWrapRec([newLTPoint.x,newLTPoint.y,newRBPoint.x,newRBPoint.y]);
	}

	Utils.getGlobalPosAndScale=function(sprite){
		return Utils.getGlobalRecByPoints(sprite,0,0,1,1);
	}

	Utils.bind=function(fun,scope){
		var rst=fun;
		/*__JS__ */rst=fun.bind(scope);;
		return rst;
	}

	Utils.measureText=function(txt,font){
		return RunDriver.measureText(txt,font);
	}

	Utils.updateOrder=function(array){
		if (!array || array.length < 2)return false;
		var i=1,j=0,len=array.length,key=NaN,c;
		while (i < len){
			j=i;
			c=array[j];
			key=array[j]._zOrder;
			while (--j >-1){
				if (array[j]._zOrder > key)array[j+1]=array[j];
				else break ;
			}
			array[j+1]=c;
			i++;
		};
		var model=c.parent.conchModel;
		if (model){
			if (model.updateZOrder !=null){
				model.updateZOrder();
				}else {
				for (i=0;i < len;i++){
					model.removeChild(array[i].conchModel);
				}
				for (i=0;i < len;i++){
					model.addChildAt(array[i].conchModel,i);
				}
			}
		}
		return true;
	}

	Utils.transPointList=function(points,x,y){
		var i=0,len=points.length;
		for (i=0;i < len;i+=2){
			points[i]+=x;
			points[i+1]+=y;
		}
	}

	Utils.parseInt=function(str,radix){
		(radix===void 0)&& (radix=0);
		var result=Browser.window.parseInt(str,radix);
		if (isNaN(result))return 0;
		return result;
	}

	Utils.getFileExtension=function(path){
		Utils._extReg.lastIndex=path.lastIndexOf(".");
		var result=Utils._extReg.exec(path);
		if (result && result.length > 1){
			return result[1].toLowerCase();
		}
		return null;
	}

	Utils.getTransformRelativeToWindow=function(coordinateSpace,x,y){
		var stage=Laya.stage;
		var globalTransform=laya.utils.Utils.getGlobalPosAndScale(coordinateSpace);
		var canvasMatrix=stage._canvasTransform.clone();
		var canvasLeft=canvasMatrix.tx;
		var canvasTop=canvasMatrix.ty;
		canvasMatrix.rotate(-Math.PI / 180 *Laya.stage.canvasDegree);
		canvasMatrix.scale(Laya.stage.clientScaleX,Laya.stage.clientScaleY);
		var perpendicular=(Laya.stage.canvasDegree % 180 !=0);
		var tx=NaN,ty=NaN;
		if (perpendicular){
			tx=y+globalTransform.y;
			ty=x+globalTransform.x;
			tx *=canvasMatrix.d;
			ty *=canvasMatrix.a;
			if (Laya.stage.canvasDegree==90){
				tx=canvasLeft-tx;
				ty+=canvasTop;
			}
			else {
				tx+=canvasLeft;
				ty=canvasTop-ty;
			}
		}
		else {
			tx=x+globalTransform.x;
			ty=y+globalTransform.y;
			tx *=canvasMatrix.a;
			ty *=canvasMatrix.d;
			tx+=canvasLeft;
			ty+=canvasTop;
		};
		var domScaleX=NaN,domScaleY=NaN;
		if (perpendicular){
			domScaleX=canvasMatrix.d *globalTransform.height;
			domScaleY=canvasMatrix.a *globalTransform.width;
			}else {
			domScaleX=canvasMatrix.a *globalTransform.width;
			domScaleY=canvasMatrix.d *globalTransform.height;
		}
		return {x:tx,y:ty,scaleX:domScaleX,scaleY:domScaleY};
	}

	Utils.fitDOMElementInArea=function(dom,coordinateSpace,x,y,width,height){
		if (!dom._fitLayaAirInitialized){
			dom._fitLayaAirInitialized=true;
			dom.style.transformOrigin=dom.style.webKittransformOrigin="left top";
			dom.style.position="absolute"
		};
		var transform=Utils.getTransformRelativeToWindow(coordinateSpace,x,y);
		dom.style.transform=dom.style.webkitTransform="scale("+transform.scaleX+","+transform.scaleY+") rotate("+(Laya.stage.canvasDegree)+"deg)";
		dom.style.width=width+'px';
		dom.style.height=height+'px';
		dom.style.left=transform.x+'px';
		dom.style.top=transform.y+'px';
	}

	Utils.isOkTextureList=function(textureList){
		if (!textureList)return false;
		var i=0,len=textureList.length;
		var tTexture;
		for (i=0;i < len;i++){
			tTexture=textureList[i];
			if (!tTexture||!tTexture.source)return false;
		}
		return true;
	}

	Utils.isOKCmdList=function(cmds){
		if (!cmds)return false;
		var i=0,len=cmds.length;
		var context=Render._context;
		var cmd;
		var tex;
		for (i=0;i < len;i++){
			cmd=cmds[i];
			switch(cmd.callee){
				case context._drawTexture:
				case context._fillTexture:
				case context._drawTextureWithTransform:
					tex=cmd[0];
					if (!tex || !tex.source)return false;
				}
		}
		return true;
	}

	Utils._gid=1;
	Utils._pi=180 / Math.PI;
	Utils._pi2=Math.PI / 180;
	Utils._extReg=/\.(\w+)\??/g;
	Utils.parseXMLFromString=function(value){
		var rst;
		value=value.replace(/>\s+</g,'><');
		/*__JS__ */rst=(new DOMParser()).parseFromString(value,'text/xml');
		if (rst.firstChild.textContent.indexOf("This page contains the following errors")>-1){
			throw new Error(rst.firstChild.firstChild.textContent);
		}
		return rst;
	}

	return Utils;
})()


/**
*@private
*/
//class laya.utils.VectorGraphManager
var VectorGraphManager=(function(){
	function VectorGraphManager(){
		this.useDic={};
		this.shapeDic={};
		this.shapeLineDic={};
		this._id=0;
		this._checkKey=false;
		this._freeIdArray=[];
		if (Render.isWebGL){
			CacheManager.regCacheByFunction(Utils.bind(this.startDispose,this),Utils.bind(this.getCacheList,this));
		}
	}

	__class(VectorGraphManager,'laya.utils.VectorGraphManager');
	var __proto=VectorGraphManager.prototype;
	/**
	*得到个空闲的ID
	*@return
	*/
	__proto.getId=function(){
		return this._id++;
	}

	/**
	*添加一个图形到列表中
	*@param id
	*@param shape
	*/
	__proto.addShape=function(id,shape){
		this.shapeDic[id]=shape;
		if (!this.useDic[id]){
			this.useDic[id]=true;
		}
	}

	/**
	*添加一个线图形到列表中
	*@param id
	*@param Line
	*/
	__proto.addLine=function(id,Line){
		this.shapeLineDic[id]=Line;
		if (!this.shapeLineDic[id]){
			this.shapeLineDic[id]=true;
		}
	}

	/**
	*检测一个对象是否在使用中
	*@param id
	*/
	__proto.getShape=function(id){
		if (this._checkKey){
			if (this.useDic[id] !=null){
				this.useDic[id]=true;
			}
		}
	}

	/**
	*删除一个图形对象
	*@param id
	*/
	__proto.deleteShape=function(id){
		if (this.shapeDic[id]){
			this.shapeDic[id]=null;
			delete this.shapeDic[id];
		}
		if (this.shapeLineDic[id]){
			this.shapeLineDic[id]=null;
			delete this.shapeLineDic[id];
		}
		if (this.useDic[id] !=null){
			delete this.useDic[id];
		}
	}

	/**
	*得到缓存列表
	*@return
	*/
	__proto.getCacheList=function(){
		var str;
		var list=[];
		for (str in this.shapeDic){
			list.push(this.shapeDic[str]);
		}
		for (str in this.shapeLineDic){
			list.push(this.shapeLineDic[str]);
		}
		return list;
	}

	/**
	*开始清理状态，准备销毁
	*/
	__proto.startDispose=function(key){
		var str;
		for (str in this.useDic){
			this.useDic[str]=false;
		}
		this._checkKey=true;
	}

	/**
	*确认销毁
	*/
	__proto.endDispose=function(){
		if (this._checkKey){
			var str;
			for (str in this.useDic){
				if (!this.useDic[str]){
					this.deleteShape(str);
				}
			}
			this._checkKey=false;
		}
	}

	VectorGraphManager.getInstance=function(){
		return VectorGraphManager.instance=VectorGraphManager.instance|| new VectorGraphManager();
	}

	VectorGraphManager.instance=null;
	return VectorGraphManager;
})()


/**
*封装弱引用WeakMap
*如果支持WeakMap，则使用WeakMap，如果不支持，则用Object代替
*注意：如果采用Object，为了防止内存泄漏，则采用定时清理缓存策略
*/
//class laya.utils.WeakObject
var WeakObject=(function(){
	function WeakObject(){
		/**@private */
		this._obj=null;
		this._obj=WeakObject.supportWeakMap ? new Browser.window.WeakMap():{};
		if (!WeakObject.supportWeakMap)WeakObject._maps.push(this);
	}

	__class(WeakObject,'laya.utils.WeakObject');
	var __proto=WeakObject.prototype;
	/**
	*设置缓存
	*@param key kye对象，可被回收
	*@param value object对象，可被回收
	*/
	__proto.set=function(key,value){
		if (key==null)return;
		if (WeakObject.supportWeakMap){
			var objKey=key;
			if ((typeof key=='string')|| (typeof key=='number')){
				objKey=WeakObject._keys[key];
				if (!objKey)objKey=WeakObject._keys[key]={k:key};
			}
			this._obj.set(objKey,value);
			}else {
			if ((typeof key=='string')|| (typeof key=='number')){
				this._obj[key]=value;
				}else {
				key.$_GID || (key.$_GID=Utils.getGID());
				this._obj[key.$_GID]=value;
			}
		}
	}

	/**
	*获取缓存
	*@param key kye对象，可被回收
	*/
	__proto.get=function(key){
		if (key==null)return null;
		if (WeakObject.supportWeakMap){
			var objKey=((typeof key=='string')|| (typeof key=='number'))? WeakObject._keys[key] :key;
			if (!objKey)return null;
			return this._obj.get(objKey);
			}else {
			if ((typeof key=='string')|| (typeof key=='number'))return this._obj[key];
			return this._obj[key.$_GID];
		}
	}

	/**
	*删除缓存
	*/
	__proto.del=function(key){
		if (key==null)return;
		if (WeakObject.supportWeakMap){
			var objKey=((typeof key=='string')|| (typeof key=='number'))? WeakObject._keys[key] :key;
			if (!objKey)return;
			/*__JS__ */this._obj.delete(objKey);
			}else {
			if ((typeof key=='string')|| (typeof key=='number'))delete this._obj[key];
			else delete this._obj[this._obj.$_GID];
		}
	}

	/**
	*是否有缓存
	*/
	__proto.has=function(key){
		if (key==null)return false;
		if (WeakObject.supportWeakMap){
			var objKey=((typeof key=='string')|| (typeof key=='number'))? WeakObject._keys[key] :key;
			return this._obj.has(objKey);
			}else {
			if ((typeof key=='string')|| (typeof key=='number'))return this._obj[key] !=null;
			return this._obj[this._obj.$_GID] !=null;
		}
	}

	WeakObject.__init__=function(){
		WeakObject.supportWeakMap=Browser.window.WeakMap !=null;
		if (!WeakObject.supportWeakMap)Laya.timer.loop(WeakObject.delInterval,null,WeakObject.clearCache);
	}

	WeakObject.clearCache=function(){
		for (var i=0,n=WeakObject._maps.length;i < n;i++){
			var obj=WeakObject._maps[i];
			obj._obj={};
		}
	}

	WeakObject.supportWeakMap=false;
	WeakObject.delInterval=5 *60 *1000;
	WeakObject._keys={};
	WeakObject._maps=[];
	__static(WeakObject,
	['I',function(){return this.I=new WeakObject();}
	]);
	return WeakObject;
})()


/**
*@private
*/
//class laya.utils.WordText
var WordText=(function(){
	function WordText(){
		this.id=NaN;
		this.save=[];
		this.toUpperCase=null;
		this.changed=false;
		this._text=null;
	}

	__class(WordText,'laya.utils.WordText');
	var __proto=WordText.prototype;
	__proto.setText=function(txt){
		this.changed=true;
		this._text=txt;
	}

	__proto.toString=function(){
		return this._text;
	}

	__proto.charCodeAt=function(i){
		return this._text ? this._text.charCodeAt(i):NaN;
	}

	__proto.charAt=function(i){
		return this._text ? this._text.charAt(i):null;
	}

	__getset(0,__proto,'length',function(){
		return this._text ? this._text.length :0;
	});

	return WordText;
})()


/**
*<code>Node</code> 类是可放在显示列表中的所有对象的基类。该显示列表管理 Laya 运行时中显示的所有对象。使用 Node 类排列显示列表中的显示对象。Node 对象可以有子显示对象。
*/
//class laya.display.Node extends laya.events.EventDispatcher
var Node=(function(_super){
	function Node(){
		/**@private */
		this._bits=0;
		/**@private 是否在显示列表中显示*/
		this._displayedInStage=false;
		/**@private 父节点对象*/
		this._parent=null;
		/**@private */
		this.conchModel=null;
		/**节点名称。*/
		this.name="";
		/**[只读]是否已经销毁。对象销毁后不能再使用。*/
		this._destroyed=false;
		Node.__super.call(this);
		this._childs=Node.ARRAY_EMPTY;
		this._$P=Node.PROP_EMPTY;
		this.timer=Laya.scaleTimer;
		this.conchModel=Render.isConchNode ? this.createConchModel():null;
	}

	__class(Node,'laya.display.Node',_super);
	var __proto=Node.prototype;
	/**@private */
	__proto._setBit=function(type,value){
		if (type==0x1){
			var preValue=this._getBit(type);
			if (preValue !=value){
				this._updateDisplayedInstage();
			}
		}
		if (value){
			this._bits |=type;
			}else {
			this._bits &=~type;
		}
	}

	/**@private */
	__proto._getBit=function(type){
		return (this._bits & type)!=0;
	}

	/**@private */
	__proto._setUpNoticeChain=function(){
		if (this._getBit(0x1)){
			this._setUpNoticeType(0x1);
		}
	}

	/**@private */
	__proto._setUpNoticeType=function(type){
		var ele=this;
		ele._setBit(type,true);
		ele=ele.parent;
		while (ele){
			if (ele._getBit(type))return;
			ele._setBit(type,true);
			ele=ele.parent;
		}
	}

	/**
	*<p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
	*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param args （可选）事件侦听函数的回调参数。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.on=function(type,caller,listener,args){
		if (type===/*laya.events.Event.DISPLAY*/"display" || type===/*laya.events.Event.UNDISPLAY*/"undisplay"){
			if (!this._getBit(0x1)){
				this._setUpNoticeType(0x1);
			}
		}
		return this._createListener(type,caller,listener,args,false);
	}

	/**
	*<p>增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。</p>
	*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param args （可选）事件侦听函数的回调参数。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.once=function(type,caller,listener,args){
		if (type===/*laya.events.Event.DISPLAY*/"display" || type===/*laya.events.Event.UNDISPLAY*/"undisplay"){
			if (!this._getBit(0x1)){
				this._setUpNoticeType(0x1);
			}
		}
		return this._createListener(type,caller,listener,args,true);
	}

	/**@private */
	__proto.createConchModel=function(){
		return null;
	}

	/**
	*<p>销毁此对象。destroy对象默认会把自己从父节点移除，并且清理自身引用关系，等待js自动垃圾回收机制回收。destroy后不能再使用。</p>
	*<p>destroy时会移除自身的事情监听，自身的timer监听，移除子对象及从父节点移除自己。</p>
	*@param destroyChild （可选）是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._destroyed=true;
		this._parent && this._parent.removeChild(this);
		if (this._childs){
			if (destroyChild)this.destroyChildren();
			else this.removeChildren();
		}
		this._childs=null;
		this._$P=null;
		this.offAll();
		this.timer.clearAll(this);
	}

	/**
	*销毁所有子对象，不销毁自己本身。
	*/
	__proto.destroyChildren=function(){
		if (this._childs){
			for (var i=this._childs.length-1;i >-1;i--){
				this._childs[i].destroy(true);
			}
		}
	}

	/**
	*添加子节点。
	*@param node 节点对象
	*@return 返回添加的节点
	*/
	__proto.addChild=function(node){
		if (!node || this.destroyed || node===this)return node;
		if ((node).zOrder)this._set$P("hasZorder",true);
		if (node._parent===this){
			var index=this.getChildIndex(node);
			if (index!==this._childs.length-1){
				this._childs.splice(index,1);
				this._childs.push(node);
				if (this.conchModel){
					this.conchModel.removeChild(node.conchModel);
					this.conchModel.addChildAt(node.conchModel,this._childs.length-1);
				}
				this._childChanged();
			}
			}else {
			node.parent && node.parent.removeChild(node);
			this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
			this._childs.push(node);
			this.conchModel && this.conchModel.addChildAt(node.conchModel,this._childs.length-1);
			node.parent=this;
			this._childChanged();
		}
		return node;
	}

	/**
	*批量增加子节点
	*@param ...args 无数子节点。
	*/
	__proto.addChildren=function(__args){
		var args=arguments;
		var i=0,n=args.length;
		while (i < n){
			this.addChild(args[i++]);
		}
	}

	/**
	*添加子节点到指定的索引位置。
	*@param node 节点对象。
	*@param index 索引位置。
	*@return 返回添加的节点。
	*/
	__proto.addChildAt=function(node,index){
		if (!node || this.destroyed || node===this)return node;
		if ((node).zOrder)this._set$P("hasZorder",true);
		if (index >=0 && index <=this._childs.length){
			if (node._parent===this){
				var oldIndex=this.getChildIndex(node);
				this._childs.splice(oldIndex,1);
				this._childs.splice(index,0,node);
				if (this.conchModel){
					this.conchModel.removeChild(node.conchModel);
					this.conchModel.addChildAt(node.conchModel,index);
				}
				this._childChanged();
				}else {
				node.parent && node.parent.removeChild(node);
				this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
				this._childs.splice(index,0,node);
				this.conchModel && this.conchModel.addChildAt(node.conchModel,index);
				node.parent=this;
			}
			return node;
			}else {
			throw new Error("appendChildAt:The index is out of bounds");
		}
	}

	/**
	*根据子节点对象，获取子节点的索引位置。
	*@param node 子节点。
	*@return 子节点所在的索引位置。
	*/
	__proto.getChildIndex=function(node){
		return this._childs.indexOf(node);
	}

	/**
	*根据子节点的名字，获取子节点对象。
	*@param name 子节点的名字。
	*@return 节点对象。
	*/
	__proto.getChildByName=function(name){
		var nodes=this._childs;
		if (nodes){
			for (var i=0,n=nodes.length;i < n;i++){
				var node=nodes[i];
				if (node.name===name)return node;
			}
		}
		return null;
	}

	/**@private */
	__proto._get$P=function(key){
		return this._$P[key];
	}

	/**@private */
	__proto._set$P=function(key,value){
		if (!this.destroyed){
			this._$P===Node.PROP_EMPTY && (this._$P={});
			this._$P[key]=value;
		}
		return value;
	}

	/**
	*根据子节点的索引位置，获取子节点对象。
	*@param index 索引位置
	*@return 子节点
	*/
	__proto.getChildAt=function(index){
		return this._childs[index];
	}

	/**
	*设置子节点的索引位置。
	*@param node 子节点。
	*@param index 新的索引。
	*@return 返回子节点本身。
	*/
	__proto.setChildIndex=function(node,index){
		var childs=this._childs;
		if (index < 0 || index >=childs.length){
			throw new Error("setChildIndex:The index is out of bounds.");
		};
		var oldIndex=this.getChildIndex(node);
		if (oldIndex < 0)throw new Error("setChildIndex:node is must child of this object.");
		childs.splice(oldIndex,1);
		childs.splice(index,0,node);
		if (this.conchModel){
			this.conchModel.removeChild(node.conchModel);
			this.conchModel.addChildAt(node.conchModel,index);
		}
		this._childChanged();
		return node;
	}

	/**
	*@private
	*子节点发生改变。
	*@param child 子节点。
	*/
	__proto._childChanged=function(child){}
	/**
	*删除子节点。
	*@param node 子节点
	*@return 被删除的节点
	*/
	__proto.removeChild=function(node){
		if (!this._childs)return node;
		var index=this._childs.indexOf(node);
		return this.removeChildAt(index);
	}

	/**
	*从父容器删除自己，如已经被删除不会抛出异常。
	*@return 当前节点（ Node ）对象。
	*/
	__proto.removeSelf=function(){
		this._parent && this._parent.removeChild(this);
		return this;
	}

	/**
	*根据子节点名字删除对应的子节点对象，如果找不到不会抛出异常。
	*@param name 对象名字。
	*@return 查找到的节点（ Node ）对象。
	*/
	__proto.removeChildByName=function(name){
		var node=this.getChildByName(name);
		node && this.removeChild(node);
		return node;
	}

	/**
	*根据子节点索引位置，删除对应的子节点对象。
	*@param index 节点索引位置。
	*@return 被删除的节点。
	*/
	__proto.removeChildAt=function(index){
		var node=this.getChildAt(index);
		if (node){
			this._childs.splice(index,1);
			this.conchModel && this.conchModel.removeChild(node.conchModel);
			node.parent=null;
		}
		return node;
	}

	/**
	*删除指定索引区间的所有子对象。
	*@param beginIndex 开始索引。
	*@param endIndex 结束索引。
	*@return 当前节点对象。
	*/
	__proto.removeChildren=function(beginIndex,endIndex){
		(beginIndex===void 0)&& (beginIndex=0);
		(endIndex===void 0)&& (endIndex=0x7fffffff);
		if (this._childs && this._childs.length > 0){
			var childs=this._childs;
			if (beginIndex===0 && endIndex >=n){
				var arr=childs;
				this._childs=Node.ARRAY_EMPTY;
				}else {
				arr=childs.splice(beginIndex,endIndex-beginIndex);
			}
			for (var i=0,n=arr.length;i < n;i++){
				arr[i].parent=null;
				this.conchModel && this.conchModel.removeChild(arr[i].conchModel);
			}
		}
		return this;
	}

	/**
	*替换子节点。
	*@internal 将传入的新节点对象替换到已有子节点索引位置处。
	*@param newNode 新节点。
	*@param oldNode 老节点。
	*@return 返回新节点。
	*/
	__proto.replaceChild=function(newNode,oldNode){
		var index=this._childs.indexOf(oldNode);
		if (index >-1){
			this._childs.splice(index,1,newNode);
			if (this.conchModel){
				this.conchModel.removeChild(oldNode.conchModel);
				this.conchModel.addChildAt(newNode.conchModel,index);
			}
			oldNode.parent=null;
			newNode.parent=this;
			return newNode;
		}
		return null;
	}

	/**@private */
	__proto._updateDisplayedInstage=function(){
		var ele;
		ele=this;
		var stage=Laya.stage;
		this._displayedInStage=false;
		while (ele){
			if (ele._getBit(0x1)){
				this._displayedInStage=ele._displayedInStage;
				break ;
			}
			if (ele==stage || ele._displayedInStage){
				this._displayedInStage=true;
				break ;
			}
			ele=ele.parent;
		}
	}

	/**@private */
	__proto._setDisplay=function(value){
		if (this._displayedInStage!==value){
			this._displayedInStage=value;
			if (value)this.event(/*laya.events.Event.DISPLAY*/"display");
			else this.event(/*laya.events.Event.UNDISPLAY*/"undisplay");
		}
	}

	/**
	*@private
	*设置指定节点对象是否可见(是否在渲染列表中)。
	*@param node 节点。
	*@param display 是否可见。
	*/
	__proto._displayChild=function(node,display){
		var childs=node._childs;
		if (childs){
			for (var i=0,n=childs.length;i < n;i++){
				var child=childs[i];
				if (!child._getBit(0x1))continue ;
				if (child._childs.length > 0){
					this._displayChild(child,display);
					}else {
					child._setDisplay(display);
				}
			}
		}
		node._setDisplay(display);
	}

	/**
	*当前容器是否包含指定的 <code>Node</code> 节点对象 。
	*@param node 指定的 <code>Node</code> 节点对象 。
	*@return 一个布尔值表示是否包含指定的 <code>Node</code> 节点对象 。
	*/
	__proto.contains=function(node){
		if (node===this)return true;
		while (node){
			if (node.parent===this)return true;
			node=node.parent;
		}
		return false;
	}

	/**
	*定时重复执行某函数。功能同Laya.timer.timerLoop()。
	*@param delay 间隔时间(单位毫秒)。
	*@param caller 执行域(this)。
	*@param method 结束时的回调方法。
	*@param args （可选）回调参数。
	*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true。
	*@param jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
	*/
	__proto.timerLoop=function(delay,caller,method,args,coverBefore,jumpFrame){
		(coverBefore===void 0)&& (coverBefore=true);
		(jumpFrame===void 0)&& (jumpFrame=false);
		this.timer.loop(delay,caller,method,args,coverBefore,jumpFrame);
	}

	/**
	*定时执行某函数一次。功能同Laya.timer.timerOnce()。
	*@param delay 延迟时间(单位毫秒)。
	*@param caller 执行域(this)。
	*@param method 结束时的回调方法。
	*@param args （可选）回调参数。
	*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true。
	*/
	__proto.timerOnce=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this.timer._create(false,false,delay,caller,method,args,coverBefore);
	}

	/**
	*定时重复执行某函数(基于帧率)。功能同Laya.timer.frameLoop()。
	*@param delay 间隔几帧(单位为帧)。
	*@param caller 执行域(this)。
	*@param method 结束时的回调方法。
	*@param args （可选）回调参数。
	*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true。
	*/
	__proto.frameLoop=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this.timer._create(true,true,delay,caller,method,args,coverBefore);
	}

	/**
	*定时执行一次某函数(基于帧率)。功能同Laya.timer.frameOnce()。
	*@param delay 延迟几帧(单位为帧)。
	*@param caller 执行域(this)
	*@param method 结束时的回调方法
	*@param args （可选）回调参数
	*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true
	*/
	__proto.frameOnce=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this.timer._create(true,false,delay,caller,method,args,coverBefore);
	}

	/**
	*清理定时器。功能同Laya.timer.clearTimer()。
	*@param caller 执行域(this)。
	*@param method 结束时的回调方法。
	*/
	__proto.clearTimer=function(caller,method){
		this.timer.clear(caller,method);
	}

	/**
	*子对象数量。
	*/
	__getset(0,__proto,'numChildren',function(){
		return this._childs.length;
	});

	/**
	*[只读]是否已经销毁。对象销毁后不能再使用。
	*@return
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	/**父节点。*/
	__getset(0,__proto,'parent',function(){
		return this._parent;
		},function(value){
		if (this._parent!==value){
			if (value){
				this._parent=value;
				this.event(/*laya.events.Event.ADDED*/"added");
				if (this._getBit(0x1)){
					this._setUpNoticeChain();
					value.displayedInStage && this._displayChild(this,true);
				}
				value._childChanged(this);
				}else {
				this.event(/*laya.events.Event.REMOVED*/"removed");
				this._parent._childChanged();
				if (this._getBit(0x1))this._displayChild(this,false);
				this._parent=value;
			}
		}
	});

	/**表示是否在显示列表中显示。*/
	__getset(0,__proto,'displayedInStage',function(){
		if (this._getBit(0x1))return this._displayedInStage;
		this._setUpNoticeType(0x1);
		return this._displayedInStage;
	});

	Node.ARRAY_EMPTY=[];
	Node.PROP_EMPTY={};
	Node.NOTICE_DISPLAY=0x1;
	Node.MOUSEENABLE=0x2;
	return Node;
})(EventDispatcher)


/**
*@private
*<code>CSSStyle</code> 类是元素CSS样式定义类。
*/
//class laya.display.css.CSSStyle extends laya.display.css.Style
var CSSStyle=(function(_super){
	function CSSStyle(ower){
		this._bgground=null;
		this._border=null;
		//this._ower=null;
		this._rect=null;
		/**@private */
		this.underLine=0;
		/**行高。 */
		this.lineHeight=0;
		CSSStyle.__super.call(this);
		this._padding=CSSStyle._PADDING;
		this._spacing=CSSStyle._SPACING;
		this._aligns=CSSStyle._ALIGNS;
		this._font=Font.EMPTY;
		this._ower=ower;
	}

	__class(CSSStyle,'laya.display.css.CSSStyle',_super);
	var __proto=CSSStyle.prototype;
	/**@inheritDoc */
	__proto.destroy=function(){
		this._ower=null;
		this._font=null;
		this._rect=null;
	}

	/**
	*复制传入的 CSSStyle 属性值。
	*@param src 待复制的 CSSStyle 对象。
	*/
	__proto.inherit=function(src){
		this._font=src._font;
		this._spacing=src._spacing===CSSStyle._SPACING ? CSSStyle._SPACING :src._spacing.slice();
		this.lineHeight=src.lineHeight;
	}

	/**@private */
	__proto._widthAuto=function(){
		return (this._type & 0x40000)!==0;
	}

	/**@inheritDoc */
	__proto.widthed=function(sprite){
		return (this._type & 0x8)!=0;
	}

	/**
	*@private
	*/
	__proto._calculation=function(type,value){
		if (value.indexOf('%')< 0)return false;
		var ower=this._ower;
		var parent=ower.parent;
		var rect=this._rect;
		function getValue (pw,w,nums){
			return (pw *nums[0]+w *nums[1]+nums[2]);
		}
		function onParentResize (type){
			var pw=parent.width,w=ower.width;
			rect.width && (ower.width=getValue(pw,w,rect.width));
			rect.height && (ower.height=getValue(pw,w,rect.height));
			rect.left && (ower.x=getValue(pw,w,rect.left));
			rect.top && (ower.y=getValue(pw,w,rect.top));
		}
		if (rect===null){
			parent._getCSSStyle()._type |=0x80000;
			parent.on(/*laya.events.Event.RESIZE*/"resize",this,onParentResize);
			this._rect=rect={input:{}};
		};
		var nums=value.split(' ');
		nums[0]=parseFloat(nums[0])/ 100;
		if (nums.length==1)
			nums[1]=nums[2]=0;
		else {
			nums[1]=parseFloat(nums[1])/ 100;
			nums[2]=parseFloat(nums[2]);
		}
		rect[type]=nums;
		rect.input[type]=value;
		onParentResize(type);
		return true;
	}

	/**
	*是否已设置高度。
	*@param sprite 显示对象 Sprite。
	*@return 一个Boolean 表示是否已设置高度。
	*/
	__proto.heighted=function(sprite){
		return (this._type & 0x2000)!=0;
	}

	/**
	*设置宽高。
	*@param w 宽度。
	*@param h 高度。
	*/
	__proto.size=function(w,h){
		var ower=this._ower;
		var resize=false;
		if (w!==-1 && w !=this._ower.width){
			this._type |=0x8;
			this._ower.width=w;
			resize=true;
		}
		if (h!==-1 && h !=this._ower.height){
			this._type |=0x2000;
			this._ower.height=h;
			resize=true;
		}
		if (resize){
			ower._layoutLater();
			(this._type & 0x80000)&& ower.event(/*laya.events.Event.RESIZE*/"resize",this);
		}
	}

	/**@private */
	__proto._getAlign=function(){
		return this._aligns[0];
	}

	/**@private */
	__proto._getValign=function(){
		return this._aligns[1];
	}

	/**@private */
	__proto._getCssFloat=function(){
		return (this._type & 0x8000)!=0 ? 0x8000 :0;
	}

	__proto._createFont=function(){
		return (this._type & 0x1000)? this._font :(this._type |=0x1000,this._font=new Font(this._font));
	}

	/**@inheritDoc */
	__proto.render=function(sprite,context,x,y){
		var w=sprite.width;
		var h=sprite.height;
		x-=sprite.pivotX;
		y-=sprite.pivotY;
		this._bgground && this._bgground.color !=null && context.ctx.fillRect(x,y,w,h,this._bgground.color);
		this._border && this._border.color && context.drawRect(x,y,w,h,this._border.color.strColor,this._border.size);
	}

	/**@inheritDoc */
	__proto.getCSSStyle=function(){
		return this;
	}

	/**
	*设置 CSS 样式字符串。
	*@param text CSS样式字符串。
	*/
	__proto.cssText=function(text){
		this.attrs(CSSStyle.parseOneCSS(text,';'));
	}

	/**
	*根据传入的属性名、属性值列表，设置此对象的属性值。
	*@param attrs 属性名与属性值列表。
	*/
	__proto.attrs=function(attrs){
		if (attrs){
			for (var i=0,n=attrs.length;i < n;i++){
				var attr=attrs[i];
				this[attr[0]]=attr[1];
			}
		}
	}

	/**@inheritDoc */
	__proto.setTransform=function(value){
		(value==='none')? (this._tf=Style._TF_EMPTY):this.attrs(CSSStyle.parseOneCSS(value,','));
	}

	/**
	*定义 X 轴、Y 轴移动转换。
	*@param x X 轴平移量。
	*@param y Y 轴平移量。
	*/
	__proto.translate=function(x,y){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.translateX=x;
		this._tf.translateY=y;
	}

	/**
	*定义 缩放转换。
	*@param x X 轴缩放值。
	*@param y Y 轴缩放值。
	*/
	__proto.scale=function(x,y){
		this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
		this._tf.scaleX=x;
		this._tf.scaleY=y;
	}

	/**@private */
	__proto._enableLayout=function(){
		return (this._type & 0x2)===0 && (this._type & 0x4)===0;
	}

	/**
	*是否显示为块级元素。
	*/
	__getset(0,__proto,'block',_super.prototype._$get_block,function(value){
		value ? (this._type |=0x1):(this._type &=(~0x1));
	});

	/**
	*垂直对齐方式。
	*/
	__getset(0,__proto,'valign',function(){
		return CSSStyle._valigndef[this._aligns[1]];
		},function(value){
		this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
		this._aligns[1]=CSSStyle._valigndef[value];
	});

	/**
	*高度。
	*/
	__getset(0,__proto,'height',null,function(h){
		this._type |=0x2000;
		if ((typeof h=='string')){
			if (this._calculation("height",h))return;
			h=parseInt(h);
		}
		this.size(-1,h);
	});

	/**
	*宽度。
	*/
	__getset(0,__proto,'width',null,function(w){
		this._type |=0x8;
		if ((typeof w=='string')){
			var offset=w.indexOf('auto');
			if (offset >=0){
				this._type |=0x40000;
				w=w.substr(0,offset);
			}
			if (this._calculation("width",w))return;
			w=parseInt(w);
		}
		this.size(w,-1);
	});

	/**
	*字体粗细。
	*/
	__getset(0,__proto,'fontWeight',function(){
		return this._font.weight;
		},function(value){
		this._createFont().weight=value;
	});

	/**
	*表示左边距。
	*/
	__getset(0,__proto,'left',null,function(value){
		var ower=this._ower;
		if (((typeof value=='string'))){
			if (value==="center")
				value="50% -50% 0";
			else if (value==="right")
			value="100% -100% 0";
			if (this._calculation("left",value))return;
			value=parseInt(value);
		}
		ower.x=value;
	});

	__getset(0,__proto,'_translate',null,function(value){
		this.translate(value[0],value[1]);
	});

	/**@inheritDoc */
	__getset(0,__proto,'absolute',function(){
		return (this._type & 0x4)!==0;
	});

	/**
	*表示上边距。
	*/
	__getset(0,__proto,'top',null,function(value){
		var ower=this._ower;
		if (((typeof value=='string'))){
			if (value==="middle")
				value="50% -50% 0";
			else if (value==="bottom")
			value="100% -100% 0";
			if (this._calculation("top",value))return;
			value=parseInt(value);
		}
		ower.y=value;
	});

	/**
	*水平对齐方式。
	*/
	__getset(0,__proto,'align',function(){
		return CSSStyle._aligndef[this._aligns[0]];
		},function(value){
		this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
		this._aligns[0]=CSSStyle._aligndef[value];
	});

	/**
	*表示是否加粗。
	*/
	__getset(0,__proto,'bold',function(){
		return this._font.bold;
		},function(value){
		this._createFont().bold=value;
	});

	/**
	*边距信息。
	*/
	__getset(0,__proto,'padding',function(){
		return this._padding;
		},function(value){
		this._padding=value;
	});

	/**
	*行间距。
	*/
	__getset(0,__proto,'leading',function(){
		return this._spacing[1];
		},function(d){
		((typeof d=='string'))&& (d=parseInt(d+""));
		this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
		this._spacing[1]=d;
	});

	/**
	*是否是行元素。
	*/
	__getset(0,__proto,'lineElement',function(){
		return (this._type & 0x10000)!=0;
		},function(value){
		value ? (this._type |=0x10000):(this._type &=(~0x10000));
	});

	/**
	*浮动方向。
	*/
	__getset(0,__proto,'cssFloat',function(){
		return (this._type & 0x8000)!=0 ? "right" :"left";
		},function(value){
		this.lineElement=false;
		value==="right" ? (this._type |=0x8000):(this._type &=(~0x8000));
	});

	/**
	*添加到文本的修饰。
	*/
	__getset(0,__proto,'textDecoration',function(){
		return this._font.decoration;
		},function(value){
		this._createFont().decoration=value;
	});

	/**
	*设置如何处理元素内的空白。
	*/
	__getset(0,__proto,'whiteSpace',function(){
		return (this._type & 0x20000)? "nowrap" :"";
		},function(type){
		type==="nowrap" && (this._type |=0x20000);
		type==="none" && (this._type &=~0x20000);
	});

	__getset(0,__proto,'background',null,function(value){
		if (!value){
			this._bgground=null;
			return;
		}
		this._bgground || (this._bgground={});
		this._bgground.color=value;
		this._ower.conchModel && this._ower.conchModel.bgColor(value);
		this._type |=0x4000;
		this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x100;
	});

	/**
	*表示是否换行。
	*/
	__getset(0,__proto,'wordWrap',function(){
		return (this._type & 0x20000)===0;
		},function(value){
		value ? (this._type &=~0x20000):(this._type |=0x20000);
	});

	/**
	*字体颜色。
	*/
	__getset(0,__proto,'color',function(){
		return this._font.color;
		},function(value){
		this._createFont().color=value;
	});

	/**
	*<p>指定文本字段是否是密码文本字段。</p>
	*如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
	*/
	__getset(0,__proto,'password',function(){
		return this._font.password;
		},function(value){
		this._createFont().password=value;
	});

	/**
	*背景颜色。
	*/
	__getset(0,__proto,'backgroundColor',function(){
		return this._bgground ? this._bgground.color :null;
		},function(value){
		if (value==='none')this._bgground=null;
		else (this._bgground || (this._bgground={}),this._bgground.color=value);
		this._ower.conchModel && this._ower.conchModel.bgColor(value);
		this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x100;
	});

	/**
	*字体信息。
	*/
	__getset(0,__proto,'font',function(){
		return this._font.toString();
		},function(value){
		this._createFont().set(value);
	});

	/**
	*文本的粗细。
	*/
	__getset(0,__proto,'weight',null,function(value){
		this._createFont().weight=value;
	});

	/**
	*间距。
	*/
	__getset(0,__proto,'letterSpacing',function(){
		return this._spacing[0];
		},function(d){
		((typeof d=='string'))&& (d=parseInt(d+""));
		this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
		this._spacing[0]=d;
	});

	/**
	*字体大小。
	*/
	__getset(0,__proto,'fontSize',function(){
		return this._font.size;
		},function(value){
		this._createFont().size=value;
	});

	/**
	*表示是否为斜体。
	*/
	__getset(0,__proto,'italic',function(){
		return this._font.italic;
		},function(value){
		this._createFont().italic=value;
	});

	/**
	*字体系列。
	*/
	__getset(0,__proto,'fontFamily',function(){
		return this._font.family;
		},function(value){
		this._createFont().family=value;
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*默认值0，表示不描边。
	*@default 0
	*/
	__getset(0,__proto,'stroke',function(){
		return this._font.stroke[0];
		},function(value){
		if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
		this._font.stroke[0]=value;
	});

	/**
	*<p>描边颜色，以字符串表示。</p>
	*@default "#000000";
	*/
	__getset(0,__proto,'strokeColor',function(){
		return this._font.stroke[1];
		},function(value){
		if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
		this._font.stroke[1]=value;
	});

	/**
	*边框属性，比如border="5px solid red"
	*/
	__getset(0,__proto,'border',function(){
		return this._border ? this._border.value :"";
		},function(value){
		if (value=='none'){
			this._border=null;
			return;
		}
		this._border || (this._border={});
		this._border.value=value;
		var values=value.split(' ');
		this._border.color=Color.create(values[values.length-1]);
		if (values.length==1){
			this._border.size=1;
			this._border.type='solid';
			return;
		};
		var i=0;
		if (values[0].indexOf('px')> 0){
			this._border.size=parseInt(values[0]);
			i++;
		}else this._border.size=1;
		this._border.type=values[i];
		this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x100;
	});

	/**
	*边框的颜色。
	*/
	__getset(0,__proto,'borderColor',function(){
		return (this._border && this._border.color)? this._border.color.strColor :null;
		},function(value){
		if (!value){
			this._border=null;
			return;
		}
		this._border || (this._border={size:1,type:'solid'});
		this._border.color=(value==null)? null :Color.create(value);
		this._ower.conchModel && this._ower.conchModel.border(this._border.color.strColor);
		this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x100;
	});

	/**
	*元素的定位类型。
	*/
	__getset(0,__proto,'position',function(){
		return (this._type & 0x4)? "absolute" :"";
		},function(value){
		value=="absolute" ? (this._type |=0x4):(this._type &=~0x4);
	});

	/**
	*规定元素应该生成的框的类型。
	*/
	__getset(0,__proto,'display',null,function(value){
		switch (value){
			case '':
				this._type &=~0x2;
				this.visible=true;
				break ;
			case 'none':
				this._type |=0x2;
				this.visible=false;
				this._ower._layoutLater();
				break ;
			}
	});

	/**@inheritDoc */
	__getset(0,__proto,'paddingLeft',function(){
		return this.padding[3];
	});

	/**@inheritDoc */
	__getset(0,__proto,'paddingTop',function(){
		return this.padding[0];
	});

	__getset(0,__proto,'_scale',null,function(value){
		this._ower.scale(value[0],value[1]);
	});

	__getset(0,__proto,'_rotate',null,function(value){
		this._ower.rotation=value;
	});

	CSSStyle.parseOneCSS=function(text,clipWord){
		var out=[];
		var attrs=text.split(clipWord);
		var valueArray;
		for (var i=0,n=attrs.length;i < n;i++){
			var attr=attrs[i];
			var ofs=attr.indexOf(':');
			var name=attr.substr(0,ofs).replace(/^\s+|\s+$/g,'');
			if (name.length==0)
				continue ;
			var value=attr.substr(ofs+1).replace(/^\s+|\s+$/g,'');
			var one=[name,value];
			switch (name){
				case 'italic':
				case 'bold':
					one[1]=value=="true";
					break ;
				case 'line-height':
					one[0]='lineHeight';
					one[1]=parseInt(value);
					break ;
				case 'font-size':
					one[0]='fontSize';
					one[1]=parseInt(value);
					break ;
				case 'padding':
					valueArray=value.split(' ');
					valueArray.length > 1 || (valueArray[1]=valueArray[2]=valueArray[3]=valueArray[0]);
					one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1]),parseInt(valueArray[2]),parseInt(valueArray[3])];
					break ;
				case 'rotate':
					one[0]="_rotate";
					one[1]=parseFloat(value);
					break ;
				case 'scale':
					valueArray=value.split(' ');
					one[0]="_scale";
					one[1]=[parseFloat(valueArray[0]),parseFloat(valueArray[1])];
					break ;
				case 'translate':
					valueArray=value.split(' ');
					one[0]="_translate";
					one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1])];
					break ;
				default :
					(one[0]=CSSStyle._CSSTOVALUE[name])|| (one[0]=name);
				}
			out.push(one);
		}
		return out;
	}

	CSSStyle.parseCSS=function(text,uri){
		var one;
		while ((one=CSSStyle._parseCSSRegExp.exec(text))!=null){
			CSSStyle.styleSheets[one[1]]=CSSStyle.parseOneCSS(one[2],';');
		}
	}

	CSSStyle.EMPTY=new CSSStyle(null);
	CSSStyle._CSSTOVALUE={'letter-spacing':'letterSpacing','line-spacing':'lineSpacing','white-space':'whiteSpace','line-height':'lineHeight','scale-x':'scaleX','scale-y':'scaleY','translate-x':'translateX','translate-y':'translateY','font-family':'fontFamily','font-weight':'fontWeight','vertical-align':'valign','text-decoration':'textDecoration','background-color':'backgroundColor','border-color':'borderColor','float':'cssFloat'};
	CSSStyle._parseCSSRegExp=new RegExp("([\.\#]\\w+)\\s*{([\\s\\S]*?)}","g");
	CSSStyle._aligndef={'left':0,'center':1,'right':2,0:'left',1:'center',2:'right'};
	CSSStyle._valigndef={'top':0,'middle':1,'bottom':2,0:'top',1:'middle',2:'bottom'};
	CSSStyle.styleSheets={};
	CSSStyle.ALIGN_CENTER=1;
	CSSStyle.ALIGN_RIGHT=2;
	CSSStyle.VALIGN_MIDDLE=1;
	CSSStyle.VALIGN_BOTTOM=2;
	CSSStyle._CSS_BLOCK=0x1;
	CSSStyle._DISPLAY_NONE=0x2;
	CSSStyle._ABSOLUTE=0x4;
	CSSStyle._WIDTH_SET=0x8;
	CSSStyle._PADDING=[0,0,0,0];
	CSSStyle._RECT=[-1,-1,-1,-1];
	CSSStyle._SPACING=[0,0];
	CSSStyle._ALIGNS=[0,0,0];
	CSSStyle.ADDLAYOUTED=0x200;
	CSSStyle._NEWFONT=0x1000;
	CSSStyle._HEIGHT_SET=0x2000;
	CSSStyle._BACKGROUND_SET=0x4000;
	CSSStyle._FLOAT_RIGHT=0x8000;
	CSSStyle._LINE_ELEMENT=0x10000;
	CSSStyle._NOWARP=0x20000;
	CSSStyle._WIDTHAUTO=0x40000;
	CSSStyle._LISTERRESZIE=0x80000;
	return CSSStyle;
})(Style)


/**
*@private
*使用Audio标签播放声音
*/
//class laya.media.h5audio.AudioSound extends laya.events.EventDispatcher
var AudioSound=(function(_super){
	function AudioSound(){
		/**
		*声音URL
		*/
		this.url=null;
		/**
		*播放用的audio标签
		*/
		this.audio=null;
		/**
		*是否已加载完成
		*/
		this.loaded=false;
		AudioSound.__super.call(this);
	}

	__class(AudioSound,'laya.media.h5audio.AudioSound',_super);
	var __proto=AudioSound.prototype;
	/**
	*释放声音
	*
	*/
	__proto.dispose=function(){
		var ad=AudioSound._audioCache[this.url];
		Pool.clearBySign("audio:"+this.url);
		if (ad){
			if (!Render.isConchApp){
				ad.src="";
			}
			delete AudioSound._audioCache[this.url];
		}
	}

	/**
	*加载声音
	*@param url
	*
	*/
	__proto.load=function(url){
		url=URL.formatURL(url);
		this.url=url;
		var ad;
		if (url==SoundManager._tMusic){
			AudioSound._initMusicAudio();
			ad=AudioSound._musicAudio;
			if (ad.src !=url){
				delete AudioSound._audioCache[ad.src];
				ad=null;
			}
			}else{
			ad=AudioSound._audioCache[url];
		}
		if (ad && ad.readyState >=2){
			this.event(/*laya.events.Event.COMPLETE*/"complete");
			return;
		}
		if (!ad){
			if (url==SoundManager._tMusic){
				AudioSound._initMusicAudio();
				ad=AudioSound._musicAudio;
				}else{
				ad=Browser.createElement("audio");
			}
			AudioSound._audioCache[url]=ad;
			ad.src=url;
		}
		ad.addEventListener("canplaythrough",onLoaded);
		ad.addEventListener("error",onErr);
		var me=this;
		function onLoaded (){
			offs();
			me.loaded=true;
			me.event(/*laya.events.Event.COMPLETE*/"complete");
		}
		function onErr (){
			ad.load=null;
			offs();
			me.event(/*laya.events.Event.ERROR*/"error");
		}
		function offs (){
			ad.removeEventListener("canplaythrough",onLoaded);
			ad.removeEventListener("error",onErr);
		}
		this.audio=ad;
		if (ad.load){
			ad.load();
			}else {
			onErr();
		}
	}

	/**
	*播放声音
	*@param startTime 起始时间
	*@param loops 循环次数
	*@return
	*
	*/
	__proto.play=function(startTime,loops){
		(startTime===void 0)&& (startTime=0);
		(loops===void 0)&& (loops=0);
		if (!this.url)return null;
		var ad;
		if (this.url==SoundManager._tMusic){
			ad=AudioSound._musicAudio;
			if (ad.src !="" && ad.src !=this.url){
				delete AudioSound._audioCache[ad.src];
				AudioSound._audioCache[this.url]=ad;
			}
			}else{
			ad=AudioSound._audioCache[this.url];
		}
		if (!ad)return null;
		var tAd;
		tAd=Pool.getItem("audio:"+this.url);
		if (Render.isConchApp){
			if (!tAd){
				tAd=Browser.createElement("audio");
				tAd.src=this.url;
			}
		}
		else {
			if (this.url==SoundManager._tMusic){
				AudioSound._initMusicAudio();
				tAd=AudioSound._musicAudio;
				tAd.src=this.url;
				}else{
				tAd=tAd ? tAd :ad.cloneNode(true);
			}
		};
		var channel=new AudioSoundChannel(tAd);
		channel.url=this.url;
		channel.loops=loops;
		channel.startTime=startTime;
		channel.play();
		SoundManager.addChannel(channel);
		return channel;
	}

	/**
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		var ad;
		ad=AudioSound._audioCache[this.url];
		if (!ad)
			return 0;
		return ad.duration;
	});

	AudioSound._initMusicAudio=function(){
		if (AudioSound._musicAudio)return;
		if (!AudioSound._musicAudio)AudioSound._musicAudio=Browser.createElement("audio");
		if (!Render.isConchApp){
			Browser.document.addEventListener("mousedown",AudioSound._makeMusicOK);
		}
	}

	AudioSound._makeMusicOK=function(){
		Browser.document.removeEventListener("mousedown",AudioSound._makeMusicOK);
		if (!AudioSound._musicAudio.src){
			AudioSound._musicAudio.src="";
			AudioSound._musicAudio.load();
			}else{
			AudioSound._musicAudio.play();
		}
	}

	AudioSound._audioCache={};
	AudioSound._musicAudio=null;
	return AudioSound;
})(EventDispatcher)


/**
*<p> <code>SoundChannel</code> 用来控制程序中的声音。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。</p>
*<p> <code>SoundChannel</code> 类包含控制声音的播放、暂停、停止、音量的方法，以及获取声音的播放状态、总时间、当前播放时间、总循环次数、播放地址等信息的方法。</p>
*/
//class laya.media.SoundChannel extends laya.events.EventDispatcher
var SoundChannel=(function(_super){
	function SoundChannel(){
		/**
		*声音地址。
		*/
		this.url=null;
		/**
		*循环次数。
		*/
		this.loops=0;
		/**
		*开始时间。
		*/
		this.startTime=NaN;
		/**
		*表示声音是否已暂停。
		*/
		this.isStopped=false;
		/**
		*播放完成处理器。
		*/
		this.completeHandler=null;
		SoundChannel.__super.call(this);
	}

	__class(SoundChannel,'laya.media.SoundChannel',_super);
	var __proto=SoundChannel.prototype;
	/**
	*播放。
	*/
	__proto.play=function(){}
	/**
	*停止。
	*/
	__proto.stop=function(){
		if (this.completeHandler)this.completeHandler.run();
	}

	/**
	*暂停。
	*/
	__proto.pause=function(){}
	/**
	*继续播放。
	*/
	__proto.resume=function(){}
	/**
	*private
	*/
	__proto.__runComplete=function(handler){
		if (handler){
			handler.run();
		}
	}

	/**
	*音量范围从 0（静音）至 1（最大音量）。
	*/
	__getset(0,__proto,'volume',function(){
		return 1;
		},function(v){
	});

	/**
	*获取当前播放时间。
	*/
	__getset(0,__proto,'position',function(){
		return 0;
	});

	/**
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		return 0;
	});

	return SoundChannel;
})(EventDispatcher)


/**
*<code>Sound</code> 类是用来播放控制声音的类。
*/
//class laya.media.Sound extends laya.events.EventDispatcher
var Sound=(function(_super){
	function Sound(){
		Sound.__super.call(this);;
	}

	__class(Sound,'laya.media.Sound',_super);
	var __proto=Sound.prototype;
	/**
	*加载声音。
	*@param url 地址。
	*
	*/
	__proto.load=function(url){}
	/**
	*播放声音。
	*@param startTime 开始时间,单位秒
	*@param loops 循环次数,0表示一直循环
	*@return 声道 SoundChannel 对象。
	*
	*/
	__proto.play=function(startTime,loops){
		(startTime===void 0)&& (startTime=0);
		(loops===void 0)&& (loops=0);
		return null;
	}

	/**
	*释放声音资源。
	*
	*/
	__proto.dispose=function(){}
	/**
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		return 0;
	});

	return Sound;
})(EventDispatcher)


/**
*@private
*web audio api方式播放声音
*/
//class laya.media.webaudio.WebAudioSound extends laya.events.EventDispatcher
var WebAudioSound=(function(_super){
	function WebAudioSound(){
		/**
		*声音URL
		*/
		this.url=null;
		/**
		*是否已加载完成
		*/
		this.loaded=false;
		/**
		*声音文件数据
		*/
		this.data=null;
		/**
		*声音原始文件数据
		*/
		this.audioBuffer=null;
		/**
		*待播放的声音列表
		*/
		this.__toPlays=null;
		/**
		*@private
		*/
		this._disposed=false;
		WebAudioSound.__super.call(this);
	}

	__class(WebAudioSound,'laya.media.webaudio.WebAudioSound',_super);
	var __proto=WebAudioSound.prototype;
	/**
	*加载声音
	*@param url
	*
	*/
	__proto.load=function(url){
		var me=this;
		url=URL.formatURL(url);
		this.url=url;
		this.audioBuffer=WebAudioSound._dataCache[url];
		if (this.audioBuffer){
			this._loaded(this.audioBuffer);
			return;
		}
		WebAudioSound.e.on("loaded:"+url,this,this._loaded);
		WebAudioSound.e.on("err:"+url,this,this._err);
		if (WebAudioSound.__loadingSound[url]){
			return;
		}
		WebAudioSound.__loadingSound[url]=true;
		var request=new Browser.window.XMLHttpRequest();
		request.open("GET",url,true);
		request.responseType="arraybuffer";
		request.onload=function (){
			if (me._disposed){
				me._removeLoadEvents();
				return;
			}
			me.data=request.response;
			WebAudioSound.buffs.push({"buffer":me.data,"url":me.url});
			WebAudioSound.decode();
		};
		request.onerror=function (e){
			me._err();
		}
		request.send();
	}

	__proto._err=function(){
		this._removeLoadEvents();
		WebAudioSound.__loadingSound[this.url]=false;
		this.event(/*laya.events.Event.ERROR*/"error");
		if (!this.__toPlays)return;
		var i=0,len=0;
		var toPlays;
		toPlays=this.__toPlays;
		len=toPlays.length;
		var tParams;
		for (i=0;i < len;i++){
			tParams=toPlays[i];
			if (tParams[2] && !(tParams [2]).isStopped){
				(tParams [2]).event(/*laya.events.Event.ERROR*/"error");
			}
		}
		this.__toPlays.length=0;
	}

	__proto._loaded=function(audioBuffer){
		this._removeLoadEvents();
		if (this._disposed){
			return;
		}
		this.audioBuffer=audioBuffer;
		WebAudioSound._dataCache[this.url]=this.audioBuffer;
		this.loaded=true;
		this.event(/*laya.events.Event.COMPLETE*/"complete");
	}

	__proto._removeLoadEvents=function(){
		WebAudioSound.e.off("loaded:"+this.url,this,this._loaded);
		WebAudioSound.e.off("err:"+this.url,this,this._err);
	}

	__proto.__playAfterLoaded=function(){
		if (!this.__toPlays)return;
		var i=0,len=0;
		var toPlays;
		toPlays=this.__toPlays;
		len=toPlays.length;
		var tParams;
		for (i=0;i < len;i++){
			tParams=toPlays[i];
			if (tParams[2] && !(tParams [2]).isStopped){
				this.play(tParams[0],tParams[1],tParams[2]);
			}
		}
		this.__toPlays.length=0;
	}

	/**
	*播放声音
	*@param startTime 起始时间
	*@param loops 循环次数
	*@return
	*
	*/
	__proto.play=function(startTime,loops,channel){
		(startTime===void 0)&& (startTime=0);
		(loops===void 0)&& (loops=0);
		channel=channel ? channel :new WebAudioSoundChannel();
		if (!this.audioBuffer){
			if (this.url){
				if (!this.__toPlays)this.__toPlays=[];
				this.__toPlays.push([startTime,loops,channel]);
				this.once(/*laya.events.Event.COMPLETE*/"complete",this,this.__playAfterLoaded);
				this.load(this.url);
			}
		}
		channel.url=this.url;
		channel.loops=loops;
		channel["audioBuffer"]=this.audioBuffer;
		channel.startTime=startTime;
		channel.play();
		SoundManager.addChannel(channel);
		return channel;
	}

	__proto.dispose=function(){
		this._disposed=true;
		delete WebAudioSound._dataCache[this.url];
		delete WebAudioSound.__loadingSound[this.url];
		this.audioBuffer=null;
		this.data=null;
		this.__toPlays=[];
	}

	__getset(0,__proto,'duration',function(){
		if (this.audioBuffer){
			return this.audioBuffer.duration;
		}
		return 0;
	});

	WebAudioSound.decode=function(){
		if (WebAudioSound.buffs.length <=0 || WebAudioSound.isDecoding){
			return;
		}
		WebAudioSound.isDecoding=true;
		WebAudioSound.tInfo=WebAudioSound.buffs.shift();
		WebAudioSound.ctx.decodeAudioData(WebAudioSound.tInfo["buffer"],WebAudioSound._done,WebAudioSound._fail);
	}

	WebAudioSound._done=function(audioBuffer){
		WebAudioSound.e.event("loaded:"+WebAudioSound.tInfo.url,audioBuffer);
		WebAudioSound.isDecoding=false;
		WebAudioSound.decode();
	}

	WebAudioSound._fail=function(){
		WebAudioSound.e.event("err:"+WebAudioSound.tInfo.url,null);
		WebAudioSound.isDecoding=false;
		WebAudioSound.decode();
	}

	WebAudioSound._playEmptySound=function(){
		if (WebAudioSound.ctx==null){
			return;
		};
		var source=WebAudioSound.ctx.createBufferSource();
		source.buffer=WebAudioSound._miniBuffer;
		source.connect(WebAudioSound.ctx.destination);
		source.start(0,0,0);
	}

	WebAudioSound._unlock=function(){
		if (WebAudioSound._unlocked){
			return;
		}
		WebAudioSound._playEmptySound();
		if (WebAudioSound.ctx.state=="running"){
			Browser.document.removeEventListener("mousedown",WebAudioSound._unlock,true);
			Browser.document.removeEventListener("touchend",WebAudioSound._unlock,true);
			Browser.document.removeEventListener("touchstart",WebAudioSound._unlock,true);
			WebAudioSound._unlocked=true;
		}
	}

	WebAudioSound.initWebAudio=function(){
		if (WebAudioSound.ctx.state !="running"){
			WebAudioSound._unlock();
			Browser.document.addEventListener("mousedown",WebAudioSound._unlock,true);
			Browser.document.addEventListener("touchend",WebAudioSound._unlock,true);
			Browser.document.addEventListener("touchstart",WebAudioSound._unlock,true);
		}
	}

	WebAudioSound._dataCache={};
	WebAudioSound.buffs=[];
	WebAudioSound.isDecoding=false;
	WebAudioSound._unlocked=false;
	WebAudioSound.tInfo=null;
	WebAudioSound.__loadingSound={};
	__static(WebAudioSound,
	['window',function(){return this.window=Browser.window;},'webAudioEnabled',function(){return this.webAudioEnabled=WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"];},'ctx',function(){return this.ctx=WebAudioSound.webAudioEnabled ? new (WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"])():undefined;},'_miniBuffer',function(){return this._miniBuffer=WebAudioSound.ctx.createBuffer(1,1,22050);},'e',function(){return this.e=new EventDispatcher();}
	]);
	return WebAudioSound;
})(EventDispatcher)


/**
*<p> <code>HttpRequest</code> 通过封装 HTML <code>XMLHttpRequest</code> 对象提供了对 HTTP 协议的完全的访问，包括做出 POST 和 HEAD 请求以及普通的 GET 请求的能力。 <code>HttpRequest</code> 只提供以异步的形式返回 Web 服务器的响应，并且能够以文本或者二进制的形式返回内容。</p>
*<p><b>注意：</b>建议每次请求都使用新的 <code>HttpRequest</code> 对象，因为每次调用该对象的send方法时，都会清空之前设置的数据，并重置 HTTP 请求的状态，这会导致之前还未返回响应的请求被重置，从而得不到之前请求的响应结果。</p>
*/
//class laya.net.HttpRequest extends laya.events.EventDispatcher
var HttpRequest=(function(_super){
	function HttpRequest(){
		/**@private */
		this._responseType=null;
		/**@private */
		this._data=null;
		HttpRequest.__super.call(this);
		this._http=new Browser.window.XMLHttpRequest();
	}

	__class(HttpRequest,'laya.net.HttpRequest',_super);
	var __proto=HttpRequest.prototype;
	/**
	*发送 HTTP 请求。
	*@param url 请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
	*@param data (default=null)发送的数据。
	*@param method (default="get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
	*@param responseType (default="text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
	*@param headers (default=null)HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type","application/json"]。
	*/
	__proto.send=function(url,data,method,responseType,headers){
		(method===void 0)&& (method="get");
		(responseType===void 0)&& (responseType="text");
		this._responseType=responseType;
		this._data=null;
		if (Browser.onQGMiniGame || Browser.onVVMiniGame || Browser.onQQMiniGame || Browser.onBDMiniGame || Browser.onBLMiniGame || Browser.onAlipayMiniGame || Browser.onHWMiniGame || Browser.onTTMiniGame || Browser.onTBMiniGame){
			url=HttpRequest._urlEncode(url);
		};
		var _this=this;
		var http=this._http;
		http.open(method,url,true);
		if (headers){
			for (var i=0;i < headers.length;i++){
				http.setRequestHeader(headers[i++],headers[i]);
			}
			}else if (!Render.isConchApp){
			if (!data || (typeof data=='string'))http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			else http.setRequestHeader("Content-Type","application/json");
		};
		var retType=responseType!=="arraybuffer" ? "text" :"arraybuffer";
		http.responseType=retType;
		if (http.dataType){
			http.dataType=retType;
		}
		http.onerror=function (e){
			_this._onError(e);
		}
		http.onabort=function (e){
			_this._onAbort(e);
		}
		http.onprogress=function (e){
			_this._onProgress(e);
		}
		http.onload=function (e){
			_this._onLoad(e);
		}
		if (Browser.onBLMiniGame && Browser.onAndroid && !data){
			data={};
		}
		http.send(data);
	}

	/**
	*@private
	*请求进度的侦听处理函数。
	*@param e 事件对象。
	*/
	__proto._onProgress=function(e){
		if (e && e.lengthComputable)this.event(/*laya.events.Event.PROGRESS*/"progress",e.loaded / e.total);
	}

	/**
	*@private
	*请求中断的侦听处理函数。
	*@param e 事件对象。
	*/
	__proto._onAbort=function(e){
		this.error("Request was aborted by user");
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
		this.clear();
		this.event(/*laya.events.Event.ERROR*/"error",message);
	}

	/**
	*@private
	*请求成功完成的处理函数。
	*/
	__proto.complete=function(){
		this.clear();
		var flag=true;
		try {
			if (this._responseType==="json"){
				this._data=JSON.parse(this._http.responseText);
				}else if (this._responseType==="xml"){
				this._data=Utils.parseXMLFromString(this._http.responseText);
				}else {
				this._data=this._http.response || this._http.responseText;
			}
			}catch (e){
			flag=false;
			this.error(e.message);
		}
		flag && this.event(/*laya.events.Event.COMPLETE*/"complete",(this._data instanceof Array)? [this._data] :this._data);
	}

	/**
	*@private
	*清除当前请求。
	*/
	__proto.clear=function(){
		var http=this._http;
		http.onerror=http.onabort=http.onprogress=http.onload=null;
	}

	/**请求的地址。*/
	__getset(0,__proto,'url',function(){
		return this._http.responseURL;
	});

	/**
	*本对象所封装的原生 XMLHttpRequest 引用。
	*/
	__getset(0,__proto,'http',function(){
		return this._http;
	});

	/**返回的数据。*/
	__getset(0,__proto,'data',function(){
		return this._data;
	});

	__static(HttpRequest,
	['_urlEncode',function(){return this._urlEncode=encodeURI;}
	]);
	return HttpRequest;
})(EventDispatcher)


/**
*<code>Loader</code> 类可用来加载文本、JSON、XML、二进制、图像等资源。
*/
//class laya.net.Loader extends laya.events.EventDispatcher
var Loader=(function(_super){
	function Loader(){
		/**@private 加载后的数据对象，只读*/
		this._data=null;
		/**@private */
		this._class=null;
		/**@private */
		this._url=null;
		/**@private */
		this._type=null;
		/**@private */
		this._cache=false;
		/**@private */
		this._http=null;
		/**@private 自定义解析不派发complete事件，但会派发loaded事件，手动调用endLoad方法再派发complete事件*/
		this._customParse=false;
		Loader.__super.call(this);
	}

	__class(Loader,'laya.net.Loader',_super);
	var __proto=Loader.prototype;
	/**
	*加载资源。加载错误会派发 Event.ERROR 事件，参数为错误信息。
	*@param url 资源地址。
	*@param type (default=null)资源类型。可选值为：Loader.TEXT、Loader.JSON、Loader.XML、Loader.BUFFER、Loader.IMAGE、Loader.SOUND、Loader.ATLAS、Loader.FONT。如果为null，则根据文件后缀分析类型。
	*@param cache (default=true)是否缓存数据。
	*@param group (default=null)分组名称。
	*@param ignoreCache (default=false)是否忽略缓存，强制重新加载。
	*/
	__proto.load=function(url,type,cache,group,ignoreCache){
		(cache===void 0)&& (cache=true);
		(ignoreCache===void 0)&& (ignoreCache=false);
		this._url=url;
		if (url.indexOf("data:image")===0)this._type=type="image";
		else {
			this._type=type || (type=this.getTypeFromUrl(url));
			url=URL.formatURL(url);
		}
		this._cache=cache;
		this._data=null;
		if (!ignoreCache && Loader.loadedMap[url]){
			this._data=Loader.loadedMap[url];
			this.event(/*laya.events.Event.PROGRESS*/"progress",1);
			this.event(/*laya.events.Event.COMPLETE*/"complete",this._data);
			return;
		}
		if (group)Loader.setGroup(url,group);
		if (Loader.parserMap[type] !=null){
			this._customParse=true;
			if (((Loader.parserMap[type])instanceof laya.utils.Handler ))Loader.parserMap[type].runWith(this);
			else Loader.parserMap[type].call(null,this);
			return;
		}
		if (type==="image" || type==="htmlimage" || type==="nativeimage")return this._loadImage(url);
		if (type==="sound")return this._loadSound(url);
		if (type==="ttf")return this._loadTTF(url);
		var contentType;
		switch (type){
			case "atlas":
			case "plf":
				contentType="json";
				break ;
			case "font":
				contentType="xml";
				break ;
			case "pkm":
				contentType="arraybuffer";
				break
			default :
				contentType=type;
			}
		if (Loader.preLoadedMap[url]){
			this.onLoaded(Loader.preLoadedMap[url]);
			}else{
			if(Browser.onVVMiniGame || Browser.onHWMiniGame){
				this._http=new HttpRequest();
				}else{
				if (!this._http){
					this._http=new HttpRequest();
				}
			}
			this._http.on(/*laya.events.Event.PROGRESS*/"progress",this,this.onProgress);
			this._http.on(/*laya.events.Event.ERROR*/"error",this,this.onError);
			this._http.on(/*laya.events.Event.COMPLETE*/"complete",this,this.onLoaded);
			this._http.send(url,null,"get",contentType);
		}
	}

	/**
	*获取指定资源地址的数据类型。
	*@param url 资源地址。
	*@return 数据类型。
	*/
	__proto.getTypeFromUrl=function(url){
		var type=Utils.getFileExtension(url);
		if (type)return Loader.typeMap[type];
		console.warn("Not recognize the resources suffix",url);
		return "text";
	}

	/**
	*@private
	*加载TTF资源。
	*@param url 资源地址。
	*/
	__proto._loadTTF=function(url){
		url=URL.formatURL(url);
		var ttfLoader=new TTFLoader();
		ttfLoader.complete=Handler.create(this,this.onLoaded);
		ttfLoader.load(url);
	}

	/**
	*@private
	*加载图片资源。
	*@param url 资源地址。
	*/
	__proto._loadImage=function(url){
		url=URL.formatURL(url);
		var _this=this;
		var image;
		function clear (){
			image.onload=null;
			image.onerror=null;
			delete Loader.imgCache[url]
		};
		var onload=function (){
			clear();
			_this.onLoaded(image);
		};
		var onerror=function (){
			clear();
			_this.event(/*laya.events.Event.ERROR*/"error","Load image failed");
		}
		if (this._type==="nativeimage"){
			image=new Browser.window.Image();
			image.crossOrigin="";
			image.onload=onload;
			image.onerror=onerror;
			image.src=url;
			Loader.imgCache[url]=image;
			}else {
			new HTMLImage.create(url,{onload:onload,onerror:onerror,onCreate:function (img){
					image=img;
					Loader.imgCache[url]=img;
			}});
		}
	}

	/**
	*@private
	*加载声音资源。
	*@param url 资源地址。
	*/
	__proto._loadSound=function(url){
		var sound=(new SoundManager._soundClass());
		var _this=this;
		sound.on(/*laya.events.Event.COMPLETE*/"complete",this,soundOnload);
		sound.on(/*laya.events.Event.ERROR*/"error",this,soundOnErr);
		sound.load(url);
		function soundOnload (){
			clear();
			_this.onLoaded(sound);
		}
		function soundOnErr (){
			clear();
			sound.dispose();
			_this.event(/*laya.events.Event.ERROR*/"error","Load sound failed");
		}
		function clear (){
			sound.offAll();
		}
	}

	/**@private */
	__proto.onProgress=function(value){
		if (this._type==="atlas")this.event(/*laya.events.Event.PROGRESS*/"progress",value *0.3);
		else this.event(/*laya.events.Event.PROGRESS*/"progress",value);
	}

	/**@private */
	__proto.onError=function(message){
		this.event(/*laya.events.Event.ERROR*/"error",message);
	}

	/**
	*资源加载完成的处理函数。
	*@param data 数据。
	*/
	__proto.onLoaded=function(data){
		var type=this._type;
		if (type=="plf"){
			this.parsePLFData(data);
			this.complete(data);
			}else if (type==="image"){
			var tex=new Texture(data);
			tex.url=this._url;
			this.complete(tex);
			}else if (type==="sound" || type==="htmlimage" || type==="nativeimage"){
			this.complete(data);
			}else if (type==="atlas"){
			if (!data.src && !data._setContext){
				if (!this._data){
					this._data=data;
					if (data.meta && data.meta.image){
						var toloadPics=data.meta.image.split(",");
						var split=this._url.indexOf("/")>=0 ? "/" :"\\";
						var idx=this._url.lastIndexOf(split);
						var folderPath=idx >=0 ? this._url.substr(0,idx+1):"";
						for (var i=0,len=toloadPics.length;i < len;i++){
							toloadPics[i]=folderPath+toloadPics[i];
						}
						}else {
						toloadPics=[this._url.replace(".json",".png")];
					}
					toloadPics.reverse();
					data.toLoads=toloadPics;
					data.pics=[];
				}
				this.event(/*laya.events.Event.PROGRESS*/"progress",0.3+1 / toloadPics.length *0.6);
				return this._loadImage(URL.formatURL(toloadPics.pop()));
				}else {
				this._data.pics.push(data);
				if (this._data.toLoads.length > 0){
					this.event(/*laya.events.Event.PROGRESS*/"progress",0.3+1 / this._data.toLoads.length *0.6);
					return this._loadImage(this._data.toLoads.pop());
				};
				var frames=this._data.frames;
				var cleanUrl=this._url.split("?")[0];
				var directory=(this._data.meta && this._data.meta.prefix)? this._data.meta.prefix :cleanUrl.substring(0,cleanUrl.lastIndexOf("."))+"/";
				var pics=this._data.pics;
				var atlasURL=URL.formatURL(this._url);
				var map=Loader.atlasMap[atlasURL] || (Loader.atlasMap[atlasURL]=[]);
				map.dir=directory;
				var scaleRate=1;
				if (this._data.meta && this._data.meta.scale && this._data.meta.scale !=1){
					scaleRate=parseFloat(this._data.meta.scale);
					for (var name in frames){
						var obj=frames[name];
						var tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						var url=URL.formatURL(directory+name);
						tPic.scaleRate=scaleRate;
						var tTexture;
						tTexture=Texture.create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h);
						Loader.cacheRes(url,tTexture);
						tTexture.url=url;
						map.push(url);
					}
					}else{
					for (name in frames){
						obj=frames[name];
						tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						url=URL.formatURL(directory+name);
						Loader.cacheRes(url,Texture.create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h));
						Loader.loadedMap[url].url=url;
						map.push(url);
					}
				}
				delete this._data.pics;
				this.complete(this._data);
			}
			}else if (type=="font"){
			if (!data.src){
				this._data=data;
				this.event(/*laya.events.Event.PROGRESS*/"progress",0.5);
				return this._loadImage(this._url.replace(".fnt",".png"));
				}else {
				var bFont=new BitmapFont();
				bFont.parseFont(this._data,data);
				var tArr=this._url.split(".fnt")[0].split("/");
				var fontName=tArr[tArr.length-1];
				Text.registerBitmapFont(fontName,bFont);
				this._data=bFont;
				this.complete(this._data);
			}
			}else if (type=="pkm"){
			var image=HTMLImage.create(data,this._url);
			var tex1=new Texture(image);
			tex1.url=this._url;
			this.complete(tex1);
			}else {
			this.complete(data);
		}
	}

	__proto.parsePLFData=function(plfData){
		var type;
		var filePath;
		var fileDic;
		for (type in plfData){
			fileDic=plfData[type];
			switch(type){
				case "json":
				case "text":
					for (filePath in fileDic){
						Loader.preLoadedMap[URL.formatURL(filePath)]=fileDic[filePath]
					}
					break ;
				default :
					for (filePath in fileDic){
						Loader.preLoadedMap[URL.formatURL(filePath)]=fileDic[filePath]
					}
				}
		}
	}

	/**
	*加载完成。
	*@param data 加载的数据。
	*/
	__proto.complete=function(data){
		this._data=data;
		if (this._customParse){
			this.event(/*laya.events.Event.LOADED*/"loaded",(data instanceof Array)? [data] :data);
			}else {
			Loader._loaders.push(this);
			if (!Loader._isWorking)Loader.checkNext();
		}
	}

	/**
	*结束加载，处理是否缓存及派发完成事件 <code>Event.COMPLETE</code> 。
	*@param content 加载后的数据
	*/
	__proto.endLoad=function(content){
		content && (this._data=content);
		if (this._cache)Loader.cacheRes(this._url,this._data);
		this.event(/*laya.events.Event.PROGRESS*/"progress",1);
		this.event(/*laya.events.Event.COMPLETE*/"complete",(this.data instanceof Array)? [this.data] :this.data);
	}

	/**加载地址。*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	/**返回的数据。*/
	__getset(0,__proto,'data',function(){
		return this._data;
	});

	/**是否缓存。*/
	__getset(0,__proto,'cache',function(){
		return this._cache;
	});

	/**加载类型。*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	Loader.checkNext=function(){
		Loader._isWorking=true;
		var startTimer=Browser.now();
		var thisTimer=startTimer;
		while (Loader._startIndex < Loader._loaders.length){
			thisTimer=Browser.now();
			Loader._loaders[Loader._startIndex].endLoad();
			Loader._startIndex++;
			if (Browser.now()-startTimer > Loader.maxTimeOut){
				console.warn("loader callback cost a long time:"+(Browser.now()-startTimer)+" url="+Loader._loaders[Loader._startIndex-1].url);
				Laya.timer.frameOnce(1,null,Loader.checkNext);
				return;
			}
		}
		Loader._loaders.length=0;
		Loader._startIndex=0;
		Loader._isWorking=false;
	}

	Loader.clearRes=function(url,forceDispose){
		(forceDispose===void 0)&& (forceDispose=false);
		url=URL.formatURL(url);
		var arr=Loader.getAtlas(url);
		if (arr){
			for (var i=0,n=arr.length;i < n;i++){
				var resUrl=arr[i];
				var tex=Loader.getRes(resUrl);
				delete Loader.loadedMap[resUrl];
				if (tex)tex.destroy(forceDispose);
			}
			arr.length=0;
			delete Loader.atlasMap[url];
			delete Loader.loadedMap[url];
			}else {
			var res=Loader.loadedMap[url];
			if (res){
				delete Loader.loadedMap[url];
				if ((res instanceof laya.resource.Texture )&& res.bitmap)(res).destroy(forceDispose);
			}
		}
	}

	Loader.clearTextureRes=function(url){
		url=URL.formatURL(url);
		var arr=laya.net.Loader.getAtlas(url);
		var res=(arr && arr.length>0)? laya.net.Loader.getRes(arr[0]):laya.net.Loader.getRes(url);
		if (res && res.bitmap){
			if (Render.isConchApp && !Render.isConchWebGL){
				if (res.bitmap.source.releaseTexture){
					res.bitmap.source.releaseTexture();
				}
				}else if (res.bitmap._atlaser==null){
				res.bitmap.releaseResource(true);
			}
		}
	}

	Loader.getRes=function(url){
		return Loader.loadedMap[URL.formatURL(url)];
	}

	Loader.getAtlas=function(url){
		return Loader.atlasMap[URL.formatURL(url)];
	}

	Loader.cacheRes=function(url,data){
		url=URL.formatURL(url);
		if (Loader.loadedMap[url] !=null){
			console.warn("Resources already exist,is repeated loading:",url);
			}else {
			Loader.loadedMap[url]=data;
		}
	}

	Loader.setGroup=function(url,group){
		if (!Loader.groupMap[group])Loader.groupMap[group]=[];
		Loader.groupMap[group].push(url);
	}

	Loader.clearResByGroup=function(group){
		if (!Loader.groupMap[group])return;
		var arr=Loader.groupMap[group],i=0,len=arr.length;
		for (i=0;i < len;i++){
			Loader.clearRes(arr[i]);
		}
		arr.length=0;
	}

	Loader.TEXT="text";
	Loader.JSON="json";
	Loader.XML="xml";
	Loader.BUFFER="arraybuffer";
	Loader.IMAGE="image";
	Loader.SOUND="sound";
	Loader.ATLAS="atlas";
	Loader.FONT="font";
	Loader.TTF="ttf";
	Loader.PLF="plf";
	Loader.PKM="pkm";
	Loader.typeMap={"png":"image","jpg":"image","jpeg":"image","txt":"text","json":"json","xml":"xml","als":"atlas","atlas":"atlas","mp3":"sound","ogg":"sound","wav":"sound","part":"json","fnt":"font","pkm":"pkm","ttf":"ttf","plf":"plf","ani":"json","sk":"arraybuffer"};
	Loader.parserMap={};
	Loader.groupMap={};
	Loader.maxTimeOut=100;
	Loader.loadedMap={};
	Loader.preLoadedMap={};
	Loader.atlasMap={};
	Loader._loaders=[];
	Loader._isWorking=false;
	Loader._startIndex=0;
	Loader.imgCache={};
	return Loader;
})(EventDispatcher)


/**
*<p> <code>LoaderManager</code> 类用于用于批量加载资源。此类是单例，不要手动实例化此类，请通过Laya.loader访问。</p>
*<p>全部队列加载完成，会派发 Event.COMPLETE 事件；如果队列中任意一个加载失败，会派发 Event.ERROR 事件，事件回调参数值为加载出错的资源地址。</p>
*<p> <code>LoaderManager</code> 类提供了以下几种功能：<br/>
*多线程：默认5个加载线程，可以通过maxLoader属性修改线程数量；<br/>
*多优先级：有0-4共5个优先级，优先级高的优先加载。0最高，4最低；<br/>
*重复过滤：自动过滤重复加载（不会有多个相同地址的资源同时加载）以及复用缓存资源，防止重复加载；<br/>
*错误重试：资源加载失败后，会重试加载（以最低优先级插入加载队列），retryNum设定加载失败后重试次数，retryDelay设定加载重试的时间间隔。</p>
*@see laya.net.Loader
*/
//class laya.net.LoaderManager extends laya.events.EventDispatcher
var LoaderManager=(function(_super){
	var ResInfo;
	function LoaderManager(){
		/**加载出错后的重试次数，默认重试一次*/
		this.retryNum=1;
		/**延迟时间多久再进行错误重试，默认立即重试*/
		this.retryDelay=0;
		/**最大下载线程，默认为5个*/
		this.maxLoader=5;
		/**@private */
		this._loaders=[];
		/**@private */
		this._loaderCount=0;
		/**@private */
		this._resInfos=[];
		/**@private */
		this._infoPool=[];
		/**@private */
		this._maxPriority=5;
		/**@private */
		this._failRes={};
		LoaderManager.__super.call(this);
		for (var i=0;i < this._maxPriority;i++)this._resInfos[i]=[];
	}

	__class(LoaderManager,'laya.net.LoaderManager',_super);
	var __proto=LoaderManager.prototype;
	/**
	*<p>根据clas类型创建一个未初始化资源的对象，随后进行异步加载，资源加载完成后，初始化对象的资源，并通过此对象派发 Event.LOADED 事件，事件回调参数值为此对象本身。套嵌资源的子资源会保留资源路径"?"后的部分。</p>
	*<p>如果url为数组，返回true；否则返回指定的资源类对象，可以通过侦听此对象的 Event.LOADED 事件来判断资源是否已经加载完毕。</p>
	*<p><b>注意：</b>cache参数只能对文件后缀为atlas的资源进行缓存控制，其他资源会忽略缓存，强制重新加载。</p>
	*@param url 资源地址或者数组。如果url和clas同时指定了资源类型，优先使用url指定的资源类型。参数形如：[{url:xx,clas:xx,priority:xx,params:xx},{url:xx,clas:xx,priority:xx,params:xx}]。
	*@param complete 加载结束回调。根据url类型不同分为2种情况：1. url为String类型，也就是单个资源地址，如果加载成功，则回调参数值为加载完成的资源，否则为null；2. url为数组类型，指定了一组要加载的资源，如果全部加载成功，则回调参数值为true，否则为false。
	*@param progress 资源加载进度回调，回调参数值为当前资源加载的进度信息(0-1)。
	*@param clas 资源类名。如果url和clas同时指定了资源类型，优先使用url指定的资源类型。参数形如：Texture。
	*@param params 资源构造参数。
	*@param priority (default=1)加载的优先级，优先级高的优先加载。有0-4共5个优先级，0最高，4最低。
	*@param cache 是否缓存加载的资源。
	*@return 如果url为数组，返回true；否则返回指定的资源类对象。
	*/
	__proto.create=function(url,complete,progress,clas,params,priority,cache,group){
		(priority===void 0)&& (priority=1);
		(cache===void 0)&& (cache=true);
		if ((url instanceof Array)){
			var items=url;
			var itemCount=items.length;
			var loadedCount=0;
			if (progress){
				var progress2=Handler.create(progress.caller,progress.method,progress.args,false);
			}
			for (var i=0;i < itemCount;i++){
				var item=items[i];
				if ((typeof item=='string'))
					item=items[i]={url:item};
				item.progress=0;
			}
			for (i=0;i < itemCount;i++){
				item=items[i];
				var progressHandler=progress ? Handler.create(null,onProgress,[item],false):null;
				var completeHandler=(progress || complete)? Handler.create(null,onComplete,[item]):null;
				this._create(item.url,completeHandler,progressHandler,item.clas || clas,item.params || params,item.priority || priority,cache,item.group || group);
			}
			function onComplete (item,content){
				loadedCount++;
				item.progress=1;
				if (loadedCount===itemCount && complete){
					complete.run();
				}
			}
			function onProgress (item,value){
				item.progress=value;
				var num=0;
				for (var j=0;j < itemCount;j++){
					var item1=items[j];
					num+=item1.progress;
				};
				var v=num / itemCount;
				progress2.runWith(v);
			}
			return true;
		}else return this._create(url,complete,progress,clas,params,priority,cache,group);
	}

	__proto._create=function(url,complete,progress,clas,params,priority,cache,group){
		(priority===void 0)&& (priority=1);
		(cache===void 0)&& (cache=true);
		var formarUrl=URL.formatURL(url);
		var item=this.getRes(formarUrl);
		if (!item){
			var extension=Utils.getFileExtension(url);
			var creatItem=LoaderManager.createMap[extension];
			if (!creatItem)
				throw new Error("LoaderManager:unknown file("+url+") extension with: "+extension+".");
			if (!clas)clas=creatItem[0];
			var type=creatItem[1];
			if (extension=="atlas"){
				this.load(url,complete,progress,type,priority,cache);
				}else {
				if (clas===Texture)type="htmlimage";
				item=clas ? new clas():null;
				if (item.hasOwnProperty("_loaded"))
					item._loaded=false;
				item._setUrl(url);
				(group)&& (item._setGroup(group));
				this._createLoad(item,url,Handler.create(null,onLoaded),progress,type,priority,false,group,true);
				function onLoaded (data){
					(item && !item.destroyed && data)&& (item.onAsynLoaded.call(item,url,data,params));
					if (complete)complete.run();
					Laya.loader.event(url);
				}
				(cache)&& (this.cacheRes(formarUrl,item));
			}
			}else {
			if (!item.hasOwnProperty("loaded")|| item.loaded){
				progress && progress.runWith(1);
				complete && complete.run();
				}else if (complete){
				Laya.loader._createListener(url,complete.caller,complete.method,complete.args,true,false);
			}
		}
		return item;
	}

	/**
	*<p>加载资源。资源加载错误时，本对象会派发 Event.ERROR 事件，事件回调参数值为加载出错的资源地址。</p>
	*<p>因为返回值为 LoaderManager 对象本身，所以可以使用如下语法：Laya.loader.load(...).load(...);</p>
	*@param url 要加载的单个资源地址或资源信息数组。比如：简单数组：["a.png","b.png"]；复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]。
	*@param complete 加载结束回调。根据url类型不同分为2种情况：1. url为String类型，也就是单个资源地址，如果加载成功，则回调参数值为加载完成的资源，否则为null；2. url为数组类型，指定了一组要加载的资源，如果全部加载成功，则回调参数值为true，否则为false。
	*@param progress 加载进度回调。回调参数值为当前资源的加载进度信息(0-1)。
	*@param type 资源类型。比如：Loader.IMAGE。
	*@param priority (default=1)加载的优先级，优先级高的优先加载。有0-4共5个优先级，0最高，4最低。
	*@param cache 是否缓存加载结果。
	*@param group 分组，方便对资源进行管理。
	*@param ignoreCache 是否忽略缓存，强制重新加载。
	*@return 此 LoaderManager 对象本身。
	*/
	__proto.load=function(url,complete,progress,type,priority,cache,group,ignoreCache){
		var _$this=this;
		(priority===void 0)&& (priority=1);
		(cache===void 0)&& (cache=true);
		(ignoreCache===void 0)&& (ignoreCache=false);
		if ((url instanceof Array))return this._loadAssets(url,complete,progress,type,priority,cache,group);
		var content=Loader.getRes(url);
		if (content !=null){
			Laya.timer.frameOnce(1,null,function(){
				progress && progress.runWith(1);
				complete && complete.runWith(content);
				_$this._loaderCount || _$this.event(/*laya.events.Event.COMPLETE*/"complete");
			});
			}else {
			var info=LoaderManager._resMap[url];
			if (!info){
				info=this._infoPool.length ? this._infoPool.pop():new ResInfo();
				info.url=url;
				info.type=type;
				info.cache=cache;
				info.group=group;
				info.ignoreCache=ignoreCache;
				complete && info.on(/*laya.events.Event.COMPLETE*/"complete",complete.caller,complete.method,complete.args);
				progress && info.on(/*laya.events.Event.PROGRESS*/"progress",progress.caller,progress.method,progress.args);
				LoaderManager._resMap[url]=info;
				priority=priority < this._maxPriority ? priority :this._maxPriority-1;
				this._resInfos[priority].push(info);
				this._next();
				}else {
				complete && info._createListener(/*laya.events.Event.COMPLETE*/"complete",complete.caller,complete.method,complete.args,false,false);
				progress && info._createListener(/*laya.events.Event.PROGRESS*/"progress",progress.caller,progress.method,progress.args,false,false);
			}
		}
		return this;
	}

	/**
	*@private
	*/
	__proto._createLoad=function(item,url,complete,progress,type,priority,cache,group,ignoreCache){
		var _$this=this;
		(priority===void 0)&& (priority=1);
		(cache===void 0)&& (cache=true);
		(ignoreCache===void 0)&& (ignoreCache=false);
		if ((url instanceof Array))return this._loadAssets(url,complete,progress,type,priority,cache,group);
		var content=Loader.getRes(url);
		if (content !=null){
			Laya.timer.frameOnce(1,null,function(){
				progress && progress.runWith(1);
				complete && complete.runWith(content);
				_$this._loaderCount || _$this.event(/*laya.events.Event.COMPLETE*/"complete");
			});
			}else {
			var info=LoaderManager._resMap[url];
			if (!info){
				info=this._infoPool.length ? this._infoPool.pop():new ResInfo();
				info.url=url;
				info.clas=item;
				info.type=type;
				info.cache=cache;
				info.group=group;
				info.ignoreCache=ignoreCache;
				complete && info.on(/*laya.events.Event.COMPLETE*/"complete",complete.caller,complete.method,complete.args);
				progress && info.on(/*laya.events.Event.PROGRESS*/"progress",progress.caller,progress.method,progress.args);
				LoaderManager._resMap[url]=info;
				priority=priority < this._maxPriority ? priority :this._maxPriority-1;
				this._resInfos[priority].push(info);
				this._next();
				}else {
				complete && info._createListener(/*laya.events.Event.COMPLETE*/"complete",complete.caller,complete.method,complete.args,false,false);
				progress && info._createListener(/*laya.events.Event.PROGRESS*/"progress",progress.caller,progress.method,progress.args,false,false);
			}
		}
		return this;
	}

	__proto._next=function(){
		if (this._loaderCount >=this.maxLoader)return;
		for (var i=0;i < this._maxPriority;i++){
			var infos=this._resInfos[i];
			while (infos.length > 0){
				var info=infos.shift();
				if (info)return this._doLoad(info);
			}
		}
		this._loaderCount || this.event(/*laya.events.Event.COMPLETE*/"complete");
	}

	__proto._doLoad=function(resInfo){
		this._loaderCount++;
		var loader=this._loaders.length ? this._loaders.pop():new Loader();
		loader.on(/*laya.events.Event.COMPLETE*/"complete",null,onLoaded);
		loader.on(/*laya.events.Event.PROGRESS*/"progress",null,function(num){
			resInfo.event(/*laya.events.Event.PROGRESS*/"progress",num);
		});
		loader.on(/*laya.events.Event.ERROR*/"error",null,function(msg){
			onLoaded(null);
		});
		var _this=this;
		function onLoaded (data){
			loader.offAll();
			loader._data=null;
			loader._customParse=false;
			_this._loaders.push(loader);
			_this._endLoad(resInfo,(data instanceof Array)? [data] :data);
			_this._loaderCount--;
			_this._next();
		}
		loader._class=resInfo.clas;
		loader.load(resInfo.url,resInfo.type,resInfo.cache,resInfo.group,resInfo.ignoreCache);
	}

	__proto._endLoad=function(resInfo,content){
		var url=resInfo.url;
		if (content==null){
			var errorCount=this._failRes[url] || 0;
			if (errorCount < this.retryNum){
				console.warn("[warn]Retry to load:",url);
				this._failRes[url]=errorCount+1;
				Laya.timer.once(this.retryDelay,this,this._addReTry,[resInfo],false);
				return;
				}else {
				console.warn("[error]Failed to load:",url);
				this.event(/*laya.events.Event.ERROR*/"error",url);
			}
		}
		if (this._failRes[url])this._failRes[url]=0;
		delete LoaderManager._resMap[url];
		resInfo.event(/*laya.events.Event.COMPLETE*/"complete",content);
		resInfo.offAll();
		this._infoPool.push(resInfo);
	}

	__proto._addReTry=function(resInfo){
		this._resInfos[this._maxPriority-1].push(resInfo);
		this._next();
	}

	/**
	*清理指定资源地址缓存。
	*@param url 资源地址。
	*@param forceDispose 是否强制销毁，有些资源是采用引用计数方式销毁，如果forceDispose=true，则忽略引用计数，直接销毁，比如Texture，默认为false
	*/
	__proto.clearRes=function(url,forceDispose){
		(forceDispose===void 0)&& (forceDispose=false);
		Loader.clearRes(url,forceDispose);
	}

	/**
	*获取指定资源地址的资源。
	*@param url 资源地址。
	*@return 返回资源。
	*/
	__proto.getRes=function(url){
		return Loader.getRes(url);
	}

	/**
	*缓存资源。
	*@param url 资源地址。
	*@param data 要缓存的内容。
	*/
	__proto.cacheRes=function(url,data){
		Loader.cacheRes(url,data);
	}

	/**
	*销毁Texture使用的图片资源，保留texture壳，如果下次渲染的时候，发现texture使用的图片资源不存在，则会自动恢复
	*相比clearRes，clearTextureRes只是清理texture里面使用的图片资源，并不销毁texture，再次使用到的时候会自动恢复图片资源
	*而clearRes会彻底销毁texture，导致不能再使用；clearTextureRes能确保立即销毁图片资源，并且不用担心销毁错误，clearRes则采用引用计数方式销毁
	*【注意】如果图片本身在自动合集里面（默认图片小于512*512），内存是不能被销毁的，此图片被大图合集管理器管理
	*@param url 图集地址或者texture地址，比如 Loader.clearTextureRes("res/atlas/comp.atlas");Loader.clearTextureRes("hall/bg.jpg");
	*/
	__proto.clearTextureRes=function(url){
		Loader.clearTextureRes(url);
	}

	/**
	*设置资源分组。
	*@param url 资源地址。
	*@param group 分组名
	*/
	__proto.setGroup=function(url,group){
		Loader.setGroup(url,group);
	}

	/**
	*根据分组清理资源。
	*@param group 分组名
	*/
	__proto.clearResByGroup=function(group){
		Loader.clearResByGroup(group);
	}

	/**清理当前未完成的加载，所有未加载的内容全部停止加载。*/
	__proto.clearUnLoaded=function(){
		for (var i=0;i < this._maxPriority;i++){
			var infos=this._resInfos[i];
			for (var j=infos.length-1;j >-1;j--){
				var info=infos[j];
				if (info){
					info.offAll();
					this._infoPool.push(info);
				}
			}
			infos.length=0;
		}
		this._loaderCount=0;
		LoaderManager._resMap={};
	}

	/**
	*根据地址集合清理掉未加载的内容
	*@param urls 资源地址集合
	*/
	__proto.cancelLoadByUrls=function(urls){
		if (!urls)return;
		for (var i=0,n=urls.length;i < n;i++){
			this.cancelLoadByUrl(urls[i]);
		}
	}

	/**
	*根据地址清理掉未加载的内容
	*@param url 资源地址
	*/
	__proto.cancelLoadByUrl=function(url){
		for (var i=0;i < this._maxPriority;i++){
			var infos=this._resInfos[i];
			for (var j=infos.length-1;j >-1;j--){
				var info=infos[j];
				if (info && info.url===url){
					infos[j]=null;
					info.offAll();
					this._infoPool.push(info);
				}
			}
		}
		if (LoaderManager._resMap[url])delete LoaderManager._resMap[url];
	}

	/**
	*@private
	*加载数组里面的资源。
	*@param arr 简单：["a.png","b.png"]，复杂[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]*/
	__proto._loadAssets=function(arr,complete,progress,type,priority,cache,group){
		(priority===void 0)&& (priority=1);
		(cache===void 0)&& (cache=true);
		var itemCount=arr.length;
		var loadedCount=0;
		var totalSize=0;
		var items=[];
		var success=true;
		for (var i=0;i < itemCount;i++){
			var item=arr[i];
			if ((typeof item=='string'))item={url:item,type:type,size:1,priority:priority};
			if (!item.size)item.size=1;
			item.progress=0;
			totalSize+=item.size;
			items.push(item);
			var progressHandler=progress ? Handler.create(null,loadProgress,[item],false):null;
			var completeHandler=(complete || progress)? Handler.create(null,loadComplete,[item]):null;
			this.load(item.url,completeHandler,progressHandler,item.type,item.priority || 1,cache,item.group || group);
		}
		function loadComplete (item,content){
			loadedCount++;
			item.progress=1;
			if (!content)success=false;
			if (loadedCount===itemCount && complete){
				complete.runWith(success);
			}
		}
		function loadProgress (item,value){
			if (progress !=null){
				item.progress=value;
				var num=0;
				for (var j=0;j < items.length;j++){
					var item1=items[j];
					num+=item1.size *item1.progress;
				};
				var v=num / totalSize;
				progress.runWith(v);
			}
		}
		return this;
	}

	LoaderManager.cacheRes=function(url,data){
		Loader.cacheRes(url,data);
	}

	LoaderManager._resMap={};
	__static(LoaderManager,
	['createMap',function(){return this.createMap={atlas:[null,/*laya.net.Loader.ATLAS*/"atlas"]};}
	]);
	LoaderManager.__init$=function(){
		//class ResInfo extends laya.events.EventDispatcher
		ResInfo=(function(_super){
			function ResInfo(){
				this.url=null;
				this.type=null;
				this.cache=false;
				this.group=null;
				this.ignoreCache=false;
				this.clas=null;
				ResInfo.__super.call(this);
			}
			__class(ResInfo,'',_super);
			return ResInfo;
		})(EventDispatcher)
	}

	return LoaderManager;
})(EventDispatcher)


/**
*<p><code>ColorFilter</code> 是颜色滤镜。使用 ColorFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。该类允许饱和度更改、色相旋转、亮度转 Alpha 以及各种其他效果。您可以将滤镜应用于任何显示对象（即，从 Sprite 类继承的对象）。</p>
*<p>注意：对于 RGBA 值，最高有效字节代表红色通道值，其后的有效字节分别代表绿色、蓝色和 Alpha 通道值。</p>
*/
//class laya.filters.ColorFilter extends laya.filters.Filter
var ColorFilter=(function(_super){
	function ColorFilter(mat){
		/**@private */
		//this._mat=null;
		/**@private */
		//this._alpha=null;
		ColorFilter.__super.call(this);
		if (!mat){
			mat=[0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0];
		}
		this._mat=new Float32Array(16);
		this._alpha=new Float32Array(4);
		var j=0;
		var z=0;
		for (var i=0;i < 20;i++){
			if (i % 5 !=4){
				this._mat[j++]=mat[i];
				}else {
				this._alpha[z++]=mat[i];
			}
		}
		this._action=RunDriver.createFilterAction(0x20);
		this._action.data=this;
	}

	__class(ColorFilter,'laya.filters.ColorFilter',_super);
	var __proto=ColorFilter.prototype;
	Laya.imps(__proto,{"laya.filters.IFilter":true})
	/**
	*@private 通知微端
	*/
	__proto.callNative=function(sp){
		var t=sp._$P.cf=this;
		sp.conchModel && sp.conchModel.setFilterMatrix && sp.conchModel.setFilterMatrix(this._mat,this._alpha);
	}

	/**@private */
	__getset(0,__proto,'type',function(){
		return 0x20;
	});

	/**@private */
	__getset(0,__proto,'action',function(){
		return this._action;
	});

	return ColorFilter;
})(Filter)


/**
*<p> <code>Socket</code> 封装了 HTML5 WebSocket ，允许服务器端与客户端进行全双工（full-duplex）的实时通信，并且允许跨域通信。在建立连接后，服务器和 Browser/Client Agent 都能主动的向对方发送或接收文本和二进制数据。</p>
*<p>要使用 <code>Socket</code> 类的方法，请先使用构造函数 <code>new Socket</code> 创建一个 <code>Socket</code> 对象。 <code>Socket</code> 以异步方式传输和接收数据。</p>
*/
//class laya.net.Socket extends laya.events.EventDispatcher
var Socket=(function(_super){
	function Socket(host,port,byteClass){
		/**@private */
		this._endian=null;
		/**@private */
		this._stamp=NaN;
		/**@private */
		this._socket=null;
		/**@private */
		this._connected=false;
		/**@private */
		this._addInputPosition=0;
		/**@private */
		this._input=null;
		/**@private */
		this._output=null;
		/**
		*@private
		*表示建立连接时需等待的毫秒数。
		*/
		this.timeout=0;
		/**
		*@private
		*在写入或读取对象时，控制所使用的 AMF 的版本。
		*/
		this.objectEncoding=0;
		/**
		*不再缓存服务端发来的数据。
		*/
		this.disableInput=false;
		/**
		*用来发送和接收数据的 <code>Byte</code> 类。
		*/
		this._byteClass=null;
		/**
		*<p>子协议名称。子协议名称字符串，或由多个子协议名称字符串构成的数组。必须在调用 connect 或者 connectByUrl 之前进行赋值，否则无效。</p>
		*<p>指定后，只有当服务器选择了其中的某个子协议，连接才能建立成功，否则建立失败，派发 Event.ERROR 事件。</p>
		*@see https://html.spec.whatwg.org/multipage/comms.html#dom-websocket
		*/
		this.protocols=[];
		(port===void 0)&& (port=0);
		Socket.__super.call(this);
		this._byteClass=byteClass ? byteClass :Byte;
		this.endian="bigEndian";
		this.timeout=20000;
		this._addInputPosition=0;
		if (host && port > 0 && port < 65535)
			this.connect(host,port);
	}

	__class(Socket,'laya.net.Socket',_super);
	var __proto=Socket.prototype;
	/**
	*<p>连接到指定的主机和端口。</p>
	*<p>连接成功派发 Event.OPEN 事件；连接失败派发 Event.ERROR 事件；连接被关闭派发 Event.CLOSE 事件；接收到数据派发 Event.MESSAGE 事件； 除了 Event.MESSAGE 事件参数为数据内容，其他事件参数都是原生的 HTML DOM Event 对象。</p>
	*@param host 服务器地址。
	*@param port 服务器端口。
	*/
	__proto.connect=function(host,port){
		var url="ws://"+host+":"+port;
		if (Browser.window.location.protocol=="https:"){
			url="wss://"+host+":"+port;
			}else {
			url="ws://"+host+":"+port;
		}
		this.connectByUrl(url);
	}

	/**
	*<p>连接到指定的服务端 WebSocket URL。 URL 类似 ws://yourdomain:port。</p>
	*<p>连接成功派发 Event.OPEN 事件；连接失败派发 Event.ERROR 事件；连接被关闭派发 Event.CLOSE 事件；接收到数据派发 Event.MESSAGE 事件； 除了 Event.MESSAGE 事件参数为数据内容，其他事件参数都是原生的 HTML DOM Event 对象。</p>
	*@param url 要连接的服务端 WebSocket URL。 URL 类似 ws://yourdomain:port。
	*/
	__proto.connectByUrl=function(url){
		var _$this=this;
		if (this._socket !=null)
			this.close();
		this._socket && this.cleanSocket();
		if (!this.protocols || this.protocols.length==0){
			this._socket=new Browser.window.WebSocket(url);
			}else {
			this._socket=new Browser.window.WebSocket(url,this.protocols);
		}
		this._socket.binaryType="arraybuffer";
		this._output=new this._byteClass();
		this._output.endian=this.endian;
		this._input=new this._byteClass();
		this._input.endian=this.endian;
		this._addInputPosition=0;
		this._socket.onopen=function (e){
			_$this._onOpen(e);
		};
		this._socket.onmessage=function (msg){
			_$this._onMessage(msg);
		};
		this._socket.onclose=function (e){
			_$this._onClose(e);
		};
		this._socket.onerror=function (e){
			_$this._onError(e);
		};
	}

	/**
	*清理socket。
	*/
	__proto.cleanSocket=function(){
		try {
			this._socket.close();
		}catch (e){}
		this._connected=false;
		this._socket.onopen=null;
		this._socket.onmessage=null;
		this._socket.onclose=null;
		this._socket.onerror=null;
		this._socket=null;
	}

	/**
	*关闭连接。
	*/
	__proto.close=function(){
		if (this._socket !=null){
			try {
				this._socket.close();
			}catch (e){}
		}
	}

	/**
	*@private
	*连接建立成功 。
	*/
	__proto._onOpen=function(e){
		this._connected=true;
		this.event(/*laya.events.Event.OPEN*/"open",e);
	}

	/**
	*@private
	*接收到数据处理方法。
	*@param msg 数据。
	*/
	__proto._onMessage=function(msg){
		if (!msg || !msg.data)return;
		var data=msg.data;
		if (this.disableInput && data){
			this.event(/*laya.events.Event.MESSAGE*/"message",data);
			return;
		}
		if (this._input.length > 0 && this._input.bytesAvailable < 1){
			this._input.clear();
			this._addInputPosition=0;
		};
		var pre=this._input.pos;
		!this._addInputPosition && (this._addInputPosition=0);
		this._input.pos=this._addInputPosition;
		if (data){
			if ((typeof data=='string')){
				this._input.writeUTFBytes(data);
				}else {
				this._input.writeArrayBuffer(data);
			}
			this._addInputPosition=this._input.pos;
			this._input.pos=pre;
		}
		this.event(/*laya.events.Event.MESSAGE*/"message",data);
	}

	/**
	*@private
	*连接被关闭处理方法。
	*/
	__proto._onClose=function(e){
		this._connected=false;
		this.event(/*laya.events.Event.CLOSE*/"close",e)
	}

	/**
	*@private
	*出现异常处理方法。
	*/
	__proto._onError=function(e){
		this.event(/*laya.events.Event.ERROR*/"error",e)
	}

	/**
	*发送数据到服务器。
	*@param data 需要发送的数据，可以是String或者ArrayBuffer。
	*/
	__proto.send=function(data){
		this._socket.send(data);
	}

	/**
	*发送缓冲区中的数据到服务器。
	*/
	__proto.flush=function(){
		if (this._output && this._output.length > 0){
			var evt;
			try {
				this._socket && this._socket.send(this._output.__getBuffer().slice(0,this._output.length));
				}catch (e){
				evt=e;
			}
			this._output.endian=this.endian;
			this._output.clear();
			if (evt)this.event(/*laya.events.Event.ERROR*/"error",evt);
		}
	}

	/**
	*缓存的服务端发来的数据。
	*/
	__getset(0,__proto,'input',function(){
		return this._input;
	});

	/**
	*表示需要发送至服务端的缓冲区中的数据。
	*/
	__getset(0,__proto,'output',function(){
		return this._output;
	});

	/**
	*表示此 Socket 对象目前是否已连接。
	*/
	__getset(0,__proto,'connected',function(){
		return this._connected;
	});

	/**
	*<p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。</p>
	*<p> LITTLE_ENDIAN ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
	*<p> BIG_ENDIAN ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。</p>
	*/
	__getset(0,__proto,'endian',function(){
		return this._endian;
		},function(value){
		this._endian=value;
		if (this._input !=null)this._input.endian=value;
		if (this._output !=null)this._output.endian=value;
	});

	Socket.LITTLE_ENDIAN="littleEndian";
	Socket.BIG_ENDIAN="bigEndian";
	return Socket;
})(EventDispatcher)


/**
*@private
*Worker Image加载器
*/
//class laya.net.WorkerLoader extends laya.events.EventDispatcher
var WorkerLoader=(function(_super){
	function WorkerLoader(){
		/**
		*使用的Worker对象。
		*/
		this.worker=null;
		WorkerLoader.__super.call(this);
		var _$this=this;
		this.worker=new Browser.window.Worker(WorkerLoader.workerPath);
		this.worker.onmessage=function (evt){
			_$this.workerMessage(evt.data);
		}
	}

	__class(WorkerLoader,'laya.net.WorkerLoader',_super);
	var __proto=WorkerLoader.prototype;
	/**
	*@private
	*/
	__proto.workerMessage=function(data){
		if (data){
			switch(data.type){
				case "Image":
					this.imageLoaded(data);
					break ;
				case "Msg":
					this.event("image_msg",data.msg);
					break ;
				}
		}
	}

	/**
	*@private
	*/
	__proto.imageLoaded=function(data){
		if (data && data.buffer && data.buffer.length < 10){
			WorkerLoader._enable=false;
			this._myTrace("buffer lost when postmessage ,disable workerloader");
			this.event(data.url,null);
			this.event("image_err",data.url+"\n"+data.msg);
			return;
		}
		if (!data.dataType){
			this.event(data.url,null);
			this.event("image_err",data.url+"\n"+data.msg);
			return;
		};
		var canvas,ctx;
		var imageData;
		switch(data.dataType){
			case "buffer":
				canvas=new HTMLCanvas("2D");
				ctx=canvas.source.getContext("2d");
				imageData=ctx.createImageData(data.width,data.height);
				imageData.data.set(data.buffer);
				canvas.size(imageData.width,imageData.height);
				ctx.putImageData(imageData,0,0);
				canvas.memorySize=0;
				break ;
			case "imagedata":
				canvas=new HTMLCanvas("2D");
				ctx=canvas.source.getContext("2d");
				imageData=data.imagedata;
				canvas.size(imageData.width,imageData.height);
				ctx.putImageData(imageData,0,0);
				imageData=data.imagedata;
				canvas.memorySize=0;
				break ;
			case "imageBitmap":
				imageData=data.imageBitmap;
				if (!Render.isWebGL){
					canvas=new HTMLCanvas("2D");
					ctx=canvas.source.getContext("2d");
					canvas.size(imageData.width,imageData.height);
					ctx.drawImage(imageData,0,0);
					canvas.src=data.url;
				}else
				canvas=imageData;
				break ;
			}
		if (Render.isWebGL)
			/*__JS__ */canvas=new laya.webgl.resource.WebGLImage(canvas,data.url);;
		this.event(data.url,canvas);
	}

	/**
	*@private
	*/
	__proto._myTrace=function(__arg){
		var arg=arguments;
		var rst=[];
		var i=0,len=arg.length;
		for(i=0;i<len;i++){
			rst.push(arg[i]);
		}
		this.event("image_msg",rst.join(" "));
	}

	/**
	*加载图片
	*@param url 图片地址
	*/
	__proto.loadImage=function(url){
		var data;
		data={};
		data.type="load";
		data.url=url;
		this.worker.postMessage(data);
	}

	/**
	*@private
	*加载图片资源。
	*@param url 资源地址。
	*/
	__proto._loadImage=function(url){
		var _this=this;
		if (!WorkerLoader._enable||url.toLowerCase().indexOf(".png")< 0){
			WorkerLoader._preLoadFun.call(_this,url);
			return;
		}
		url=URL.formatURL(url);
		function clear (){
			laya.net.WorkerLoader.I.off(url,_this,onload);
		};
		var onload=function (image){
			clear();
			if (image){
				_this["onLoaded"](image);
				}else{
				WorkerLoader._preLoadFun.call(_this,url);
			}
		};
		laya.net.WorkerLoader.I.on(url,_this,onload);
		laya.net.WorkerLoader.I.loadImage(url);
	}

	/**
	*是否启用。
	*/
	__getset(1,WorkerLoader,'enable',function(){
		return WorkerLoader._enable;
		},function(v){
		if (WorkerLoader.disableJSDecode && (!Browser.window.createImageBitmap))return;
		WorkerLoader._enable=v;
		if (WorkerLoader._enable && WorkerLoader._preLoadFun==null)WorkerLoader._enable=WorkerLoader.__init__();
	});

	WorkerLoader.__init__=function(){
		if (WorkerLoader._preLoadFun !=null)return false;
		if (!Browser.window.Worker)return false;
		WorkerLoader._preLoadFun=Loader["prototype"]["_loadImage"];
		Loader["prototype"]["_loadImage"]=WorkerLoader["prototype"]["_loadImage"];
		if (!WorkerLoader.I)WorkerLoader.I=new WorkerLoader();
		return true;
	}

	WorkerLoader.workerSupported=function(){
		return Browser.window.Worker?true:false;
	}

	WorkerLoader.IMAGE_LOADED="image_loaded";
	WorkerLoader.IMAGE_ERR="image_err";
	WorkerLoader.IMAGE_MSG="image_msg";
	WorkerLoader.I=null;
	WorkerLoader._preLoadFun=null;
	WorkerLoader._enable=false;
	WorkerLoader.workerPath="libs/worker.js";
	WorkerLoader.disableJSDecode=true;
	return WorkerLoader;
})(EventDispatcher)


/**
*@private
*<code>Resource</code> 资源存取类。
*/
//class laya.resource.Resource extends laya.events.EventDispatcher
var Resource=(function(_super){
	function Resource(){
		/**@private */
		//this.__loaded=false;
		/**@private */
		//this._id=0;
		/**@private */
		//this._memorySize=0;
		/**@private */
		//this._released=false;
		/**@private */
		//this._destroyed=false;
		/**@private */
		//this._referenceCount=0;
		/**@private */
		//this._group=null;
		/**@private */
		//this._url=null;
		/**@private */
		//this._resourceManager=null;
		/**@private */
		//this._lastUseFrameCount=0;
		/**是否加锁，如果true为不能使用自动释放机制。*/
		//this.lock=false;
		/**名称。 */
		//this.name=null;
		Resource.__super.call(this);
		this._$1__id=++Resource._uniqueIDCounter;
		this.__loaded=true;
		this._destroyed=false;
		this._referenceCount=0;
		Resource._idResourcesMap[this.id]=this;
		this._released=true;
		this.lock=false;
		this._memorySize=0;
		this._lastUseFrameCount=-1;
		(ResourceManager.currentResourceManager)&& (ResourceManager.currentResourceManager.addResource(this));
	}

	__class(Resource,'laya.resource.Resource',_super);
	var __proto=Resource.prototype;
	Laya.imps(__proto,{"laya.resource.ICreateResource":true,"laya.resource.IDispose":true})
	/**
	*@private
	*/
	__proto._setUrl=function(url){
		if (this._url!==url){
			var resList;
			if (this._url){
				resList=Resource._urlResourcesMap[this._url];
				resList.splice(resList.indexOf(this),1);
				(resList.length===0)&& (delete Resource._urlResourcesMap[this._url]);
			}
			if (url){
				resList=Resource._urlResourcesMap[url];
				(resList)|| (Resource._urlResourcesMap[url]=resList=[]);
				resList.push(this);
			}
			this._url=url;
		}
	}

	/**
	*@private
	*/
	__proto._getGroup=function(){
		return this._group;
	}

	/**
	*@private
	*/
	__proto._setGroup=function(value){
		if (this._group!==value){
			var groupList;
			if (this._group){
				groupList=Resource._groupResourcesMap[this._group];
				groupList.splice(groupList.indexOf(this),1);
				(groupList.length===0)&& (delete Resource._groupResourcesMap[this._group]);
			}
			if (value){
				groupList=Resource._groupResourcesMap[value];
				(groupList)|| (Resource._groupResourcesMap[value]=groupList=[]);
				groupList.push(this);
			}
			this._group=value;
		}
	}

	/**
	*@private
	*/
	__proto._addReference=function(){
		this._referenceCount++;
	}

	/**
	*@private
	*/
	__proto._removeReference=function(){
		this._referenceCount--;
	}

	/**
	*@private
	*/
	__proto._clearReference=function(){
		this._referenceCount=0;
	}

	/**
	*@private
	*/
	__proto._endLoaded=function(){
		this.__loaded=true;
		this.event(/*laya.events.Event.LOADED*/"loaded",this);
	}

	/**
	*@private
	*/
	__proto.recreateResource=function(){
		this.completeCreate();
	}

	/**
	*@private
	*/
	__proto.disposeResource=function(){}
	/**
	*激活资源，使用资源前应先调用此函数激活。
	*@param force 是否强制创建。
	*/
	__proto.activeResource=function(force){
		(force===void 0)&& (force=false);
		this._lastUseFrameCount=Stat.loopCount;
		if (!this._destroyed && this.__loaded && (this._released || force))
			this.recreateResource();
	}

	/**
	*释放资源。
	*@param force 是否强制释放。
	*@return 是否成功释放。
	*/
	__proto.releaseResource=function(force){
		(force===void 0)&& (force=false);
		if (!force && this.lock)
			return false;
		if (!this._released || force){
			this.disposeResource();
			this._released=true;
			this._lastUseFrameCount=-1;
			this.event(/*laya.events.Event.RELEASED*/"released",this);
			return true;
			}else {
			return false;
		}
	}

	/**
	*@private
	*/
	__proto.onAsynLoaded=function(url,data,params){
		throw new Error("Resource: must override this function!");
	}

	/**
	*<p>彻底处理资源，处理后不能恢复。</p>
	*<p><b>注意：</b>会强制解锁清理。</p>
	*/
	__proto.destroy=function(){
		if (this._destroyed)
			return;
		if (this._resourceManager!==null)
			this._resourceManager.removeResource(this);
		this._destroyed=true;
		this.lock=false;
		this.releaseResource();
		delete Resource._idResourcesMap[this.id];
		var resList;
		if (this._url){
			resList=Resource._urlResourcesMap[this._url];
			if (resList){
				resList.splice(resList.indexOf(this),1);
				(resList.length===0)&& (delete Resource._urlResourcesMap[this.url]);
			}
			Loader.clearRes(this._url);
			(this.__loaded)||(RunDriver.cancelLoadByUrl(this._url));
		}
		if (this._group){
			resList=Resource._groupResourcesMap[this._group];
			resList.splice(resList.indexOf(this),1);
			(resList.length===0)&& (delete Resource._groupResourcesMap[this.url]);
		}
	}

	/**完成资源激活。*/
	__proto.completeCreate=function(){
		this._released=false;
		this.event(/*laya.events.Event.RECOVERED*/"recovered",this);
	}

	/**
	*@private
	*/
	__proto.dispose=function(){
		this.destroy();
	}

	/**
	*@private
	*/
	/**
	*占用内存尺寸。
	*/
	__getset(0,__proto,'memorySize',function(){
		return this._memorySize;
		},function(value){
		var offsetValue=value-this._memorySize;
		this._memorySize=value;
		this.resourceManager && this.resourceManager.addSize(offsetValue);
	});

	/**
	*@private
	*/
	__getset(0,__proto,'_loaded',null,function(value){
		this.__loaded=value;
	});

	/**
	*获取是否已加载完成。
	*/
	__getset(0,__proto,'loaded',function(){
		return this.__loaded;
	});

	/**
	*获取唯一标识ID,通常用于识别。
	*/
	__getset(0,__proto,'id',function(){
		return this._$1__id;
	});

	/**
	*是否已处理。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	/**
	*设置资源组名。
	*/
	/**
	*获取资源组名。
	*/
	__getset(0,__proto,'group',function(){
		return this._getGroup();
		},function(value){
		this._setGroup(value);
	});

	/**
	*资源管理员。
	*/
	__getset(0,__proto,'resourceManager',function(){
		return this._resourceManager;
	});

	/**
	*获取资源的URL地址。
	*@return URL地址。
	*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	/**
	*是否已释放。
	*/
	__getset(0,__proto,'released',function(){
		return this._released;
	});

	/**
	*获取资源的引用计数。
	*/
	__getset(0,__proto,'referenceCount',function(){
		return this._referenceCount;
	});

	Resource.getResourceByID=function(id){
		return Resource._idResourcesMap[id];
	}

	Resource.getResourceByURL=function(url,index){
		(index===void 0)&& (index=0);
		return Resource._urlResourcesMap[url][index];
	}

	Resource.getResourceCountByURL=function(url){
		return Resource._urlResourcesMap[url].length;
	}

	Resource.destroyUnusedResources=function(group){
		var res;
		if (group){
			var resouList=Resource._groupResourcesMap[group];
			if (resouList){
				var tempResouList=resouList.slice();
				for (var i=0,n=tempResouList.length;i < n;i++){
					res=tempResouList[i];
					if (!res.lock && res._referenceCount===0)
						res.destroy();
				}
			}
			}else {
			for (var k in Resource._idResourcesMap){
				res=Resource._idResourcesMap[k];
				if (!res.lock && res._referenceCount===0)
					res.destroy();
			}
		}
	}

	Resource._uniqueIDCounter=0;
	Resource._idResourcesMap={};
	Resource._urlResourcesMap={};
	Resource._groupResourcesMap={};
	return Resource;
})(EventDispatcher)


/**
*<code>Texture</code> 是一个纹理处理类。
*/
//class laya.resource.Texture extends laya.events.EventDispatcher
var Texture=(function(_super){
	function Texture(bitmap,uv){
		/**图片或者canvas 。*/
		//this.bitmap=null;
		/**UV信息。*/
		//this.uv=null;
		/**沿 X 轴偏移量。*/
		this.offsetX=0;
		/**沿 Y 轴偏移量。*/
		this.offsetY=0;
		/**原始宽度（包括被裁剪的透明区域）。*/
		this.sourceWidth=0;
		/**原始高度（包括被裁剪的透明区域）。*/
		this.sourceHeight=0;
		/**@private */
		//this._loaded=false;
		/**@private */
		this._w=0;
		/**@private */
		this._h=0;
		/**@private 唯一ID*/
		//this.$_GID=NaN;
		/**图片地址*/
		//this.url=null;
		/**@private */
		this._uvID=0;
		this._atlasID=-1;
		/**@private */
		this.scaleRate=1;
		Texture.__super.call(this);
		if (bitmap && bitmap._addReference!=null){
			bitmap._addReference();
		}
		this.setTo(bitmap,uv);
	}

	__class(Texture,'laya.resource.Texture',_super);
	var __proto=Texture.prototype;
	/**
	*@private
	*/
	__proto._setUrl=function(url){
		this.url=url;
	}

	/**
	*设置此对象的位图资源、UV数据信息。
	*@param bitmap 位图资源
	*@param uv UV数据信息
	*/
	__proto.setTo=function(bitmap,uv){
		if (/*__JS__ */bitmap instanceof window.HTMLElement){
			var canvas=HTMLCanvas.create("2D",bitmap);
			this.bitmap=canvas;
			}else{
			this.bitmap=bitmap;
		}
		this.uv=uv || Texture.DEF_UV;
		if (bitmap){
			this._w=bitmap.width;
			this._h=bitmap.height;
			this.sourceWidth=this.sourceWidth || this._w;
			this.sourceHeight=this.sourceHeight || this._h
			this._loaded=this._w > 0;
			var _this=this;
			if (this._loaded){
				RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
				}else {
				var bm=bitmap;
				if ((bm instanceof laya.resource.HTMLImage )&& bm.image)
					bm.image.addEventListener('load',function(e){
					RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
				},false);
			}
		}
	}

	/**@private 激活资源。*/
	__proto.active=function(){
		if (this.bitmap)this.bitmap.activeResource();
	}

	/**
	*销毁纹理（分直接销毁，跟计数销毁两种）。
	*@param forceDispose (default=false)true为强制销毁主纹理，false是通过计数销毁纹理。
	*/
	__proto.destroy=function(forceDispose){
		(forceDispose===void 0)&& (forceDispose=false);
		if (this.bitmap && (this.bitmap).referenceCount > 0){
			var temp=this.bitmap;
			if (forceDispose){
				if (Render.isConchApp && temp.source && temp.source.conchDestroy){
					this.bitmap.source.conchDestroy();
				}
				this.bitmap=null;
				temp.dispose();
				(temp)._clearReference();
				}else {
				(temp)._removeReference();
				if ((temp).referenceCount==0){
					if (Render.isConchApp && temp.source && temp.source.conchDestroy){
						this.bitmap.source.conchDestroy();
					}
					this.bitmap=null;
					temp.dispose();
				}
			}
			if (this.url && this===Laya.loader.getRes(this.url))Laya.loader.clearRes(this.url,forceDispose);
			this._loaded=false;
		}
	}

	/**
	*加载指定地址的图片。
	*@param url 图片地址。
	*/
	__proto.load=function(url){
		var _$this=this;
		this._loaded=false;
		url=URL.customFormat(url);
		var fileBitmap=(this.bitmap || (this.bitmap=HTMLImage.create(url)));
		if (fileBitmap)fileBitmap._addReference();
		var _this=this;
		fileBitmap.onload=function (){
			fileBitmap.onload=null;
			_this._loaded=true;
			_$this.sourceWidth=_$this._w=fileBitmap.width;
			_$this.sourceHeight=_$this._h=fileBitmap.height;
			_this.event(/*laya.events.Event.LOADED*/"loaded",this);
			(RunDriver.addToAtlas)&& (RunDriver.addToAtlas(_this));
		};
	}

	/**@private */
	__proto.addTextureToAtlas=function(e){
		RunDriver.addTextureToAtlas(this);
	}

	/**
	*获取Texture上的某个区域的像素点
	*@param x
	*@param y
	*@param width
	*@param height
	*@return 返回像素点集合
	*/
	__proto.getPixels=function(x,y,width,height){
		if (Render.isConchApp){
			var temp=this.bitmap;
			if (temp.source && temp.source.getImageData){
				var arraybuffer=temp.source.getImageData(x,y,width,height);
				var tUint8Array=new Uint8Array(arraybuffer);
				return /*__JS__ */Array.from(tUint8Array);
			}
			return null;
			}else if (Render.isWebGL){
			return RunDriver.getTexturePixels(this,x,y,width,height);
			}else {
			Browser.canvas.size(width,height);
			Browser.canvas.clear();
			Browser.context.drawTexture(this,-x,-y,this.width,this.height,0,0);
			var info=Browser.context.getImageData(0,0,width,height);
		}
		return info.data;
	}

	/**@private */
	__proto.onAsynLoaded=function(url,bitmap){
		if (bitmap)bitmap._addReference();
		this.setTo(bitmap,this.uv);
	}

	/**激活并获取资源。*/
	__getset(0,__proto,'source',function(){
		if (!this.bitmap)return null;
		this.bitmap.activeResource();
		return this.bitmap.source;
	});

	/**
	*表示是否加载成功，只能表示初次载入成功（通常包含下载和载入）,并不能完全表示资源是否可立即使用（资源管理机制释放影响等）。
	*/
	__getset(0,__proto,'loaded',function(){
		return this._loaded;
	});

	/**
	*表示资源是否已释放。
	*/
	__getset(0,__proto,'released',function(){
		if (!this.bitmap)return true;
		return this.bitmap.released;
	});

	/**实际宽度。*/
	__getset(0,__proto,'width',function(){
		if (this._w)return this._w;
		return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[2]-this.uv[0])*this.bitmap.width :this.bitmap.width;
		},function(value){
		this._w=value;
		this.sourceWidth || (this.sourceWidth=value);
	});

	/**
	*通过外部设置是否启用纹理平铺(后面要改成在着色器里计算)
	*/
	/**
	*获取当前纹理是否启用了纹理平铺
	*/
	__getset(0,__proto,'repeat',function(){
		if (Render.isWebGL && this.bitmap){
			return this.bitmap.repeat;
		}
		return true;
		},function(value){
		if (value){
			if (Render.isWebGL && this.bitmap){
				this.bitmap.repeat=value;
				if (value){
					this.bitmap.enableMerageInAtlas=false;
				}
			}
		}
	});

	/**实际高度。*/
	__getset(0,__proto,'height',function(){
		if (this._h)return this._h;
		return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[5]-this.uv[1])*this.bitmap.height :this.bitmap.height;
		},function(value){
		this._h=value;
		this.sourceHeight || (this.sourceHeight=value);
	});

	/**
	*设置线性采样的状态（目前只能第一次绘制前设置false生效,来关闭线性采样）。
	*/
	/**
	*获取当前纹理是否启用了线性采样。
	*/
	__getset(0,__proto,'isLinearSampling',function(){
		return Render.isWebGL ? (this.bitmap.minFifter !=0x2600):true;
		},function(value){
		if (!value && Render.isWebGL){
			if (!value && (this.bitmap.minFifter==-1)&& (this.bitmap.magFifter==-1)){
				this.bitmap.minFifter=0x2600;
				this.bitmap.magFifter=0x2600;
				this.bitmap.enableMerageInAtlas=false;
			}
		}
	});

	Texture.moveUV=function(offsetX,offsetY,uv){
		for (var i=0;i < 8;i+=2){
			uv[i]+=offsetX;
			uv[i+1]+=offsetY;
		}
		return uv;
	}

	Texture.create=function(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight){
		(offsetX===void 0)&& (offsetX=0);
		(offsetY===void 0)&& (offsetY=0);
		(sourceWidth===void 0)&& (sourceWidth=0);
		(sourceHeight===void 0)&& (sourceHeight=0);
		var btex=(source instanceof laya.resource.Texture );
		var uv=btex ? source.uv :Texture.DEF_UV;
		var bitmap=btex ? source.bitmap :source;
		var bIsAtlas=RunDriver.isAtlas(bitmap);
		if (bIsAtlas){
			var atlaser=bitmap._atlaser;
			var nAtlasID=(source)._atlasID;
			if (nAtlasID==-1){
				throw new Error("create texture error");
			}
			bitmap=atlaser._inAtlasTextureBitmapValue[nAtlasID];
			uv=atlaser._inAtlasTextureOriUVValue[nAtlasID];
		};
		var tex=new Texture(bitmap,null);
		if (bitmap.width && (x+width)> bitmap.width)width=bitmap.width-x;
		if (bitmap.height && (y+height)> bitmap.height)height=bitmap.height-y;
		tex.width=width;
		tex.height=height;
		tex.offsetX=offsetX;
		tex.offsetY=offsetY;
		tex.sourceWidth=sourceWidth || width;
		tex.sourceHeight=sourceHeight || height;
		var dwidth=1 / bitmap.width;
		var dheight=1 / bitmap.height;
		x *=dwidth;
		y *=dheight;
		width *=dwidth;
		height *=dheight;
		var u1=tex.uv[0],v1=tex.uv[1],u2=tex.uv[4],v2=tex.uv[5];
		var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
		var oriUV=Texture.moveUV(uv[0],uv[1],[x,y,x+width,y,x+width,y+height,x,y+height]);
		tex.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
		if (bIsAtlas){
			tex.addTextureToAtlas();
		};
		var bitmapScale=bitmap.scaleRate;
		if (bitmapScale && bitmapScale !=1){
			tex.sourceWidth /=bitmapScale;
			tex.sourceHeight /=bitmapScale;
			tex.width /=bitmapScale;
			tex.height /=bitmapScale;
			tex.scaleRate=bitmapScale;
			tex.offsetX /=bitmapScale;
			tex.offsetY /=bitmapScale;
			}else{
			tex.scaleRate=1;
		}
		return tex;
	}

	Texture.createFromTexture=function(texture,x,y,width,height){
		var texScaleRate=texture.scaleRate;
		if (texScaleRate !=1){
			x *=texScaleRate;
			y *=texScaleRate;
			width *=texScaleRate;
			height *=texScaleRate;
		};
		var rect=Rectangle.TEMP.setTo(x-texture.offsetX,y-texture.offsetY,width,height);
		var result=rect.intersection(Texture._rect1.setTo(0,0,texture.width,texture.height),Texture._rect2);
		if (result)
			var tex=Texture.create(texture,result.x,result.y,result.width,result.height,result.x-rect.x,result.y-rect.y,width,height);
		else return null;
		tex.bitmap._removeReference();
		return tex;
	}

	Texture.DEF_UV=[0,0,1.0,0,1.0,1.0,0,1.0];
	Texture.INV_UV=[0,1,1.0,1,1.0,0.0,0,0.0];
	Texture._rect1=new Rectangle();
	Texture._rect2=new Rectangle();
	return Texture;
})(EventDispatcher)


/**
*<code>TimeLine</code> 是一个用来创建时间轴动画的类。
*/
//class laya.utils.TimeLine extends laya.events.EventDispatcher
var TimeLine=(function(_super){
	var tweenData;
	function TimeLine(){
		this._labelDic=null;
		this._tweenDic={};
		this._tweenDataList=[];
		this._endTweenDataList=null;
		//以结束时间进行排序
		this._currTime=0;
		this._lastTime=0;
		this._startTime=0;
		/**当前动画数据播放到第几个了*/
		this._index=0;
		/**为TWEEN创建属于自己的唯一标识，方便管理*/
		this._gidIndex=0;
		/**保留所有对象第一次注册动画时的状态（根据时间跳转时，需要把对象的回复，再计算接下来的状态）*/
		this._firstTweenDic={};
		/**是否需要排序*/
		this._startTimeSort=false;
		this._endTimeSort=false;
		/**是否循环*/
		this._loopKey=false;
		/**缩放动画播放的速度。*/
		this.scale=1;
		this._frameRate=60;
		this._frameIndex=0;
		this._total=0;
		TimeLine.__super.call(this);
	}

	__class(TimeLine,'laya.utils.TimeLine',_super);
	var __proto=TimeLine.prototype;
	/**
	*控制一个对象，从当前点移动到目标点。
	*@param target 要控制的对象。
	*@param props 要控制对象的属性。
	*@param duration 对象TWEEN的时间。
	*@param ease 缓动类型
	*@param offset 相对于上一个对象，偏移多长时间（单位：毫秒）。
	*/
	__proto.to=function(target,props,duration,ease,offset){
		(offset===void 0)&& (offset=0);
		return this._create(target,props,duration,ease,offset,true);
	}

	/**
	*从 props 属性，缓动到当前状态。
	*@param target target 目标对象(即将更改属性值的对象)
	*@param props 要控制对象的属性
	*@param duration 对象TWEEN的时间
	*@param ease 缓动类型
	*@param offset 相对于上一个对象，偏移多长时间（单位：毫秒）
	*/
	__proto.from=function(target,props,duration,ease,offset){
		(offset===void 0)&& (offset=0);
		return this._create(target,props,duration,ease,offset,false);
	}

	/**@private */
	__proto._create=function(target,props,duration,ease,offset,isTo){
		var tTweenData=Pool.getItemByClass("tweenData",tweenData);
		tTweenData.isTo=isTo;
		tTweenData.type=0;
		tTweenData.target=target;
		tTweenData.duration=duration;
		tTweenData.data=props;
		tTweenData.startTime=this._startTime+offset;
		tTweenData.endTime=tTweenData.startTime+tTweenData.duration;
		tTweenData.ease=ease;
		this._startTime=Math.max(tTweenData.endTime,this._startTime);
		this._tweenDataList.push(tTweenData);
		this._startTimeSort=true;
		this._endTimeSort=true;
		return this;
	}

	/**
	*在时间队列中加入一个标签。
	*@param label 标签名称。
	*@param offset 标签相对于上个动画的偏移时间(单位：毫秒)。
	*/
	__proto.addLabel=function(label,offset){
		var tTweenData=Pool.getItemByClass("tweenData",tweenData);
		tTweenData.type=1;
		tTweenData.data=label;
		tTweenData.endTime=tTweenData.startTime=this._startTime+offset;
		this._labelDic || (this._labelDic={});
		this._labelDic[label]=tTweenData;
		this._tweenDataList.push(tTweenData);
		return this;
	}

	/**
	*移除指定的标签
	*@param label
	*/
	__proto.removeLabel=function(label){
		if (this._labelDic && this._labelDic[label]){
			var tTweenData=this._labelDic[label];
			if (tTweenData){
				var tIndex=this._tweenDataList.indexOf(tTweenData);
				if (tIndex >-1){
					this._tweenDataList.splice(tIndex,1);
				}
			}
			delete this._labelDic[label];
		}
	}

	/**
	*动画从整个动画的某一时间开始。
	*@param time(单位：毫秒)。
	*/
	__proto.gotoTime=function(time){
		if (this._tweenDataList==null || this._tweenDataList.length==0)return;
		var tTween;
		var tObject;
		for (var p in this._firstTweenDic){
			tObject=this._firstTweenDic[p];
			if (tObject){
				for (var tDataP in tObject){
					if (tObject.diyTarget.hasOwnProperty(tDataP)){
						tObject.diyTarget[tDataP]=tObject[tDataP];
					}
				}
			}
		}
		for (p in this._tweenDic){
			tTween=this._tweenDic[p];
			tTween.clear();
			delete this._tweenDic[p];
		}
		this._index=0;
		this._gidIndex=0;
		this._currTime=time;
		this._lastTime=Browser.now();
		var tTweenDataCopyList;
		if (this._endTweenDataList==null || this._endTimeSort){
			this._endTimeSort=false;
			this._endTweenDataList=tTweenDataCopyList=this._tweenDataList.concat();
			function Compare (paraA,paraB){
				if (paraA.endTime > paraB.endTime){
					return 1;
					}else if (paraA.endTime < paraB.endTime){
					return-1;
					}else {
					return 0;
				}
			}
			tTweenDataCopyList.sort(Compare);
			}else {
			tTweenDataCopyList=this._endTweenDataList
		};
		var tTweenData;
		for (var i=0,n=tTweenDataCopyList.length;i < n;i++){
			tTweenData=tTweenDataCopyList[i];
			if (tTweenData.type==0){
				if (time >=tTweenData.endTime){
					this._index=Math.max(this._index,i+1);
					var props=tTweenData.data;
					if (tTweenData.isTo){
						for (var tP in props){
							tTweenData.target[tP]=props[tP];
						}
					}
					}else {
					break ;
				}
			}
		}
		for (i=0,n=this._tweenDataList.length;i < n;i++){
			tTweenData=this._tweenDataList[i];
			if (tTweenData.type==0){
				if (time >=tTweenData.startTime && time < tTweenData.endTime){
					this._index=Math.max(this._index,i+1);
					this._gidIndex++;
					tTween=Pool.getItemByClass("tween",Tween);
					tTween._create(tTweenData.target,tTweenData.data,tTweenData.duration,tTweenData.ease,Handler.create(this,this._animComplete,[this._gidIndex]),0,false,tTweenData.isTo,true,false);
					tTween.setStartTime(this._currTime-(time-tTweenData.startTime));
					tTween._updateEase(this._currTime);
					tTween.gid=this._gidIndex;
					this._tweenDic[this._gidIndex]=tTween;
				}
			}
		}
	}

	/**
	*从指定的标签开始播。
	*@param Label 标签名。
	*/
	__proto.gotoLabel=function(Label){
		if (this._labelDic==null)return;
		var tLabelData=this._labelDic[Label];
		if (tLabelData)this.gotoTime(tLabelData.startTime);
	}

	/**
	*暂停整个动画。
	*/
	__proto.pause=function(){
		Laya.timer.clear(this,this._update);
	}

	/**
	*恢复暂停动画的播放。
	*/
	__proto.resume=function(){
		this.play(this._currTime,this._loopKey);
	}

	/**
	*播放动画。
	*@param timeOrLabel 开启播放的时间点或标签名。
	*@param loop 是否循环播放。
	*/
	__proto.play=function(timeOrLabel,loop){
		(timeOrLabel===void 0)&& (timeOrLabel=0);
		(loop===void 0)&& (loop=false);
		if (!this._tweenDataList)return;
		if (this._startTimeSort){
			this._startTimeSort=false;
			function Compare (paraA,paraB){
				if (paraA.startTime > paraB.startTime){
					return 1;
					}else if (paraA.startTime < paraB.startTime){
					return-1;
					}else {
					return 0;
				}
			}
			this._tweenDataList.sort(Compare);
			for (var i=0,n=this._tweenDataList.length;i < n;i++){
				var tTweenData=this._tweenDataList[i];
				if (tTweenData !=null && tTweenData.type==0){
					var tTarget=tTweenData.target;
					var gid=(tTarget.$_GID || (tTarget.$_GID=Utils.getGID()));
					var tSrcData=null;
					if (this._firstTweenDic[gid]==null){
						tSrcData={};
						tSrcData.diyTarget=tTarget;
						this._firstTweenDic[gid]=tSrcData;
						}else {
						tSrcData=this._firstTweenDic[gid];
					}
					for (var p in tTweenData.data){
						if (tSrcData[p]==null){
							tSrcData[p]=tTarget[p];
						}
					}
				}
			}
		}
		if ((typeof timeOrLabel=='string')){
			this.gotoLabel(timeOrLabel);
			}else {
			this.gotoTime(timeOrLabel);
		}
		this._loopKey=loop;
		this._lastTime=Browser.now();
		Laya.timer.frameLoop(1,this,this._update);
	}

	/**
	*更新当前动画。
	*/
	__proto._update=function(){
		if (this._currTime >=this._startTime){
			if (this._loopKey){
				this._complete();
				if (!this._tweenDataList)return;
				this.gotoTime(0);
				}else {
				for (var p in this._tweenDic){
					tTween=this._tweenDic[p];
					tTween.complete();
				}
				this._complete();
				this.pause();
				return;
			}
		};
		var tNow=Browser.now();
		var tFrameTime=tNow-this._lastTime;
		var tCurrTime=this._currTime+=tFrameTime *this.scale;
		this._lastTime=tNow;
		for (p in this._tweenDic){
			tTween=this._tweenDic[p];
			tTween._updateEase(tCurrTime);
		};
		var tTween;
		if (this._tweenDataList.length !=0 && this._index < this._tweenDataList.length){
			var tTweenData=this._tweenDataList[this._index];
			if (tCurrTime >=tTweenData.startTime){
				this._index++;
				if (tTweenData.type==0){
					this._gidIndex++;
					tTween=Pool.getItemByClass("tween",Tween);
					tTween._create(tTweenData.target,tTweenData.data,tTweenData.duration,tTweenData.ease,Handler.create(this,this._animComplete,[this._gidIndex]),0,false,tTweenData.isTo,true,false);
					tTween.setStartTime(tCurrTime);
					tTween.gid=this._gidIndex;
					this._tweenDic[this._gidIndex]=tTween;
					tTween._updateEase(tCurrTime);
					}else {
					this.event(/*laya.events.Event.LABEL*/"label",tTweenData.data);
				}
			}
		}
	}

	/**
	*指定的动画索引处的动画播放完成后，把此动画从列表中删除。
	*@param index
	*/
	__proto._animComplete=function(index){
		var tTween=this._tweenDic[index];
		if (tTween)delete this._tweenDic[index];
	}

	/**@private */
	__proto._complete=function(){
		this.event(/*laya.events.Event.COMPLETE*/"complete");
	}

	/**
	*重置所有对象，复用对象的时候使用。
	*/
	__proto.reset=function(){
		var p;
		if (this._labelDic){
			for (p in this._labelDic){
				delete this._labelDic[p];
			}
		};
		var tTween;
		for (p in this._tweenDic){
			tTween=this._tweenDic[p];
			tTween.clear();
			delete this._tweenDic[p];
		}
		for (p in this._firstTweenDic){
			delete this._firstTweenDic[p];
		}
		this._endTweenDataList=null;
		if (this._tweenDataList && this._tweenDataList.length){
			var i=0,len=0;
			len=this._tweenDataList.length;
			for (i=0;i < len;i++){
				if(this._tweenDataList[i])
					this._tweenDataList[i].destroy();
			}
		}
		this._tweenDataList.length=0;
		this._currTime=0;
		this._lastTime=0;
		this._startTime=0;
		this._index=0;
		this._gidIndex=0;
		this.scale=1;
		Laya.timer.clear(this,this._update);
	}

	/**
	*彻底销毁此对象。
	*/
	__proto.destroy=function(){
		this.reset();
		this._labelDic=null;
		this._tweenDic=null;
		this._tweenDataList=null;
		this._firstTweenDic=null;
	}

	/**
	*@private
	*设置帧索引
	*/
	/**
	*@private
	*得到帧索引
	*/
	__getset(0,__proto,'index',function(){
		return this._frameIndex;
		},function(value){
		this._frameIndex=value;
		this.gotoTime(this._frameIndex / this._frameRate *1000);
	});

	/**
	*得到总帧数。
	*/
	__getset(0,__proto,'total',function(){
		this._total=Math.floor(this._startTime / 1000 *this._frameRate);
		return this._total;
	});

	TimeLine.to=function(target,props,duration,ease,offset){
		(offset===void 0)&& (offset=0);
		return (new TimeLine()).to(target,props,duration,ease,offset);
	}

	TimeLine.from=function(target,props,duration,ease,offset){
		(offset===void 0)&& (offset=0);
		return (new TimeLine()).from(target,props,duration,ease,offset);
	}

	TimeLine.__init$=function(){
		//class tweenData
		tweenData=(function(){
			function tweenData(){
				this.type=0;
				//0代表TWEEN,1代表标签
				this.isTo=true;
				this.startTime=NaN;
				this.endTime=NaN;
				this.target=null;
				this.duration=NaN;
				this.ease=null;
				this.data=null;
			}
			__class(tweenData,'');
			var __proto=tweenData.prototype;
			__proto.destroy=function(){
				this.target=null;
				this.ease=null;
				this.data=null;
				this.isTo=true;
				this.type=0;
				Pool.recover("tweenData",this);
			}
			return tweenData;
		})()
	}

	return TimeLine;
})(EventDispatcher)


/**
*<p> <code>Sprite</code> 是基本的显示图形的显示列表节点。 <code>Sprite</code> 默认没有宽高，默认不接受鼠标事件。通过 <code>graphics</code> 可以绘制图片或者矢量图，支持旋转，缩放，位移等操作。<code>Sprite</code>同时也是容器类，可用来添加多个子节点。</p>
*<p>注意： <code>Sprite</code> 默认没有宽高，可以通过<code>getBounds</code>函数获取；也可手动设置宽高；还可以设置<code>autoSize=true</code>，然后再获取宽高。<code>Sprite</code>的宽高一般用于进行碰撞检测和排版，并不影响显示图像大小，如果需要更改显示图像大小，请使用 <code>scaleX</code> ， <code>scaleY</code> ， <code>scale</code>。</p>
*<p> <code>Sprite</code> 默认不接受鼠标事件，即<code>mouseEnabled=false</code>，但是只要对其监听任意鼠标事件，会自动打开自己以及所有父对象的<code>mouseEnabled=true</code>。所以一般也无需手动设置<code>mouseEnabled</code>。</p>
*<p>LayaAir引擎API设计精简巧妙。核心显示类只有一个<code>Sprite</code>。<code>Sprite</code>针对不同的情况做了渲染优化，所以保证一个类实现丰富功能的同时，又达到高性能。</p>
*
*@example <caption>创建了一个 <code>Sprite</code> 实例。</caption>
*package
*{
	*import laya.display.Sprite;
	*import laya.events.Event;
	*
	*public class Sprite_Example
	*{
		*private var sprite:Sprite;
		*private var shape:Sprite
		*public function Sprite_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*sprite=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
			*sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
			*sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
			*sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
			*sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
			*sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
			*Laya.stage.addChild(sprite);//将此 sprite 对象添加到显示列表。
			*sprite.on(Event.CLICK,this,onClickSprite);//给 sprite 对象添加点击事件侦听。
			*shape=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
			*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
			*shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
			*shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
			*shape.width=100;//设置 shape 对象的宽度。
			*shape.height=100;//设置 shape 对象的高度。
			*shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
			*shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
			*Laya.stage.addChild(shape);//将此 shape 对象添加到显示列表。
			*shape.on(Event.CLICK,this,onClickShape);//给 shape 对象添加点击事件侦听。
			*}
		*private function onClickSprite():void
		*{
			*trace("点击 sprite 对象。");
			*sprite.rotation+=5;//旋转 sprite 对象。
			*}
		*private function onClickShape():void
		*{
			*trace("点击 shape 对象。");
			*shape.rotation+=5;//旋转 shape 对象。
			*}
		*}
	*}
*
*@example
*var sprite;
*var shape;
*Sprite_Example();
*function Sprite_Example()
*{
	*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
	*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
	*onInit();
	*}
*function onInit()
*{
	*sprite=new laya.display.Sprite();//创建一个 Sprite 类的实例对象 sprite 。
	*sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
	*sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
	*sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
	*sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
	*sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
	*Laya.stage.addChild(sprite);//将此 sprite 对象添加到显示列表。
	*sprite.on(Event.CLICK,this,onClickSprite);//给 sprite 对象添加点击事件侦听。
	*shape=new laya.display.Sprite();//创建一个 Sprite 类的实例对象 sprite 。
	*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
	*shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
	*shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
	*shape.width=100;//设置 shape 对象的宽度。
	*shape.height=100;//设置 shape 对象的高度。
	*shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
	*shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
	*Laya.stage.addChild(shape);//将此 shape 对象添加到显示列表。
	*shape.on(laya.events.Event.CLICK,this,onClickShape);//给 shape 对象添加点击事件侦听。
	*}
*function onClickSprite()
*{
	*console.log("点击 sprite 对象。");
	*sprite.rotation+=5;//旋转 sprite 对象。
	*}
*function onClickShape()
*{
	*console.log("点击 shape 对象。");
	*shape.rotation+=5;//旋转 shape 对象。
	*}
*
*@example
*import Sprite=laya.display.Sprite;
*class Sprite_Example {
	*private sprite:Sprite;
	*private shape:Sprite
	*public Sprite_Example(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*this.sprite=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
		*this.sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
		*this.sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
		*this.sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
		*this.sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
		*this.sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
		*Laya.stage.addChild(this.sprite);//将此 sprite 对象添加到显示列表。
		*this.sprite.on(laya.events.Event.CLICK,this,this.onClickSprite);//给 sprite 对象添加点击事件侦听。
		*this.shape=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
		*this.shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
		*this.shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
		*this.shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
		*this.shape.width=100;//设置 shape 对象的宽度。
		*this.shape.height=100;//设置 shape 对象的高度。
		*this.shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
		*this.shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
		*Laya.stage.addChild(this.shape);//将此 shape 对象添加到显示列表。
		*this.shape.on(laya.events.Event.CLICK,this,this.onClickShape);//给 shape 对象添加点击事件侦听。
		*}
	*private onClickSprite():void {
		*console.log("点击 sprite 对象。");
		*this.sprite.rotation+=5;//旋转 sprite 对象。
		*}
	*private onClickShape():void {
		*console.log("点击 shape 对象。");
		*this.shape.rotation+=5;//旋转 shape 对象。
		*}
	*}
*/
//class laya.display.Sprite extends laya.display.Node
var Sprite=(function(_super){
	function Sprite(){
		/**@private 矩阵变换信息。*/
		this._transform=null;
		/**@private */
		this._tfChanged=false;
		/**@private */
		this._x=0;
		/**@private */
		this._y=0;
		/**@private */
		this._width=0;
		/**@private */
		this._height=0;
		/**@private */
		this._repaint=1;
		/**@private 鼠标状态，0:auto,1:mouseEnabled=false,2:mouseEnabled=true。*/
		this._mouseEnableState=0;
		/**@private Z排序，数值越大越靠前。*/
		this._zOrder=0;
		/**@private */
		this._graphics=null;
		/**@private */
		this._renderType=0;
		/**@private */
		this._optimizeScrollRect=false;
		/**@private */
		this._texture=null;
		/**
		*<p>鼠标事件与此对象的碰撞检测是否可穿透。碰撞检测发生在鼠标事件的捕获阶段，此阶段引擎会从stage开始递归检测stage及其子对象，直到找到命中的目标对象或者未命中任何对象。</p>
		*<p>穿透表示鼠标事件发生的位置处于本对象绘图区域内时，才算命中，而与对象宽高和值为Rectangle对象的hitArea属性无关。如果sprite.hitArea值是HitArea对象，表示显式声明了此对象的鼠标事件响应区域，而忽略对象的宽高、mouseThrough属性。</p>
		*<p>影响对象鼠标事件响应区域的属性为：width、height、hitArea，优先级顺序为：hitArea(type:HitArea)>hitArea(type:Rectangle)>width/height。</p>
		*@default false 不可穿透，此对象的鼠标响应区域由width、height、hitArea属性决定。</p>
		*/
		this.mouseThrough=false;
		/**
		*<p>指定是否自动计算宽高数据。默认值为 false 。</p>
		*<p>Sprite宽高默认为0，并且不会随着绘制内容的变化而变化，如果想根据绘制内容获取宽高，可以设置本属性为true，或者通过getBounds方法获取。设置为true，对性能有一定影响。</p>
		*/
		this.autoSize=false;
		/**
		*<p>指定鼠标事件检测是优先检测自身，还是优先检测其子对象。鼠标事件检测发生在鼠标事件的捕获阶段，此阶段引擎会从stage开始递归检测stage及其子对象，直到找到命中的目标对象或者未命中任何对象。</p>
		*<p>如果为false，优先检测子对象，当有子对象被命中时，中断检测，获得命中目标。如果未命中任何子对象，最后再检测此对象；如果为true，则优先检测本对象，如果本对象没有被命中，直接中断检测，表示没有命中目标；如果本对象被命中，则进一步递归检测其子对象，以确认最终的命中目标。</p>
		*<p>合理使用本属性，能减少鼠标事件检测的节点，提高性能。可以设置为true的情况：开发者并不关心此节点的子节点的鼠标事件检测结果，也就是以此节点作为其子节点的鼠标事件检测依据。</p>
		*<p>Stage对象和UI的View组件默认为true。</p>
		*@default false 优先检测此对象的子对象，当递归检测完所有子对象后，仍然没有找到目标对象，最后再检测此对象。
		*/
		this.hitTestPrior=false;
		/**
		*<p>视口大小，视口外的子对象，将不被渲染(如果想实现裁剪效果，请使用srollRect)，合理使用能提高渲染性能。比如由一个个小图片拼成的地图块，viewport外面的小图片将不渲染</p>
		*<p>srollRect和viewport的区别：<br/>
		*1. srollRect自带裁剪效果，viewport只影响子对象渲染是否渲染，不具有裁剪效果（性能更高）。<br/>
		*2. 设置rect的x,y属性均能实现区域滚动效果，但scrollRect会保持0,0点位置不变。</p>
		*@default null
		*/
		this.viewport=null;
		Sprite.__super.call(this);
		this._style=Style.EMPTY;
	}

	__class(Sprite,'laya.display.Sprite',_super);
	var __proto=Sprite.prototype;
	Laya.imps(__proto,{"laya.display.ILayout":true})
	/**@private */
	__proto.createConchModel=function(){
		return /*__JS__ */new ConchNode();
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._releaseMem();
		_super.prototype.destroy.call(this,destroyChild);
		this._style && this._style.destroy();
		this._transform && this._transform.destroy();
		this._transform=null;
		this._style=null;
		this._graphics=null;
	}

	/**根据zOrder进行重新排序。*/
	__proto.updateZOrder=function(){
		Utils.updateOrder(this._childs)&& this.repaint();
	}

	/**在设置cacheAs的情况下，调用此方法会重新刷新缓存。*/
	__proto.reCache=function(){
		if (this._$P.cacheCanvas)this._$P.cacheCanvas.reCache=true;
		this._repaint=1;
	}

	/**
	*<p>设置对象在自身坐标系下的边界范围。与 <code>getSelfBounds</code> 对应。当 autoSize==true 时，会影响对象宽高。设置后，当需要获取自身边界范围时，就不再需要计算，合理使用能提高性能。比如 <code>getBounds</code> 会优先使用 <code>setBounds</code> 指定的值，如果没有指定则进行计算，此计算会对性能消耗比较大。</p>
	*<p><b>注意：</b> <code>setBounds</code> 与 <code>getBounds</code> 并非对应相等关系， <code>getBounds</code> 获取的是本对象在父容器坐标系下的边界范围，通过设置 <code>setBounds</code> 会影响 <code>getBounds</code> 的结果。</p>
	*@param bound bounds矩形区域
	*/
	__proto.setBounds=function(bound){
		this._set$P("uBounds",bound);
	}

	/**
	*<p>获取本对象在父容器坐标系的矩形显示区域。</p>
	*<p><b>注意：</b> 1.计算量较大，尽量少用，如果需要频繁使用，可以通过手动设置 <code>setBounds</code> 来缓存自身边界信息，从而避免比较消耗性能的计算。2. <code>setBounds</code> 与 <code>getBounds</code> 并非对应相等关系， <code>getBounds</code> 获取的是本对象在父容器坐标系下的边界范围，通过设置 <code>setBounds</code> 会影响 <code>getBounds</code> 的结果。</p>
	*@return 矩形区域。
	*/
	__proto.getBounds=function(){
		if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
		return Rectangle._getWrapRec(this._boundPointsToParent(),this._$P.mBounds);
	}

	/**
	*获取对象在自身坐标系的边界范围。与 <code>setBounds</code> 对应。
	*<p><b>注意：</b>计算量较大，尽量少用，如果需要频繁使用，可以提前手动设置 <code>setBounds</code> 来缓存自身边界信息，从而避免比较消耗性能的计算。</p>
	*@return 矩形区域。
	*/
	__proto.getSelfBounds=function(){
		if (this._$P.uBounds)return this._$P.uBounds;
		if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
		return Rectangle._getWrapRec(this._getBoundPointsM(false),this._$P.mBounds);
	}

	/**
	*@private
	*获取本对象在父容器坐标系的显示区域多边形顶点列表。
	*当显示对象链中有旋转时，返回多边形顶点列表，无旋转时返回矩形的四个顶点。
	*@param ifRotate （可选）之前的对象链中是否有旋转。
	*@return 顶点列表。结构：[x1,y1,x2,y2,x3,y3,...]。
	*/
	__proto._boundPointsToParent=function(ifRotate){
		(ifRotate===void 0)&& (ifRotate=false);
		var pX=0,pY=0;
		if (this._style){
			pX=this._style._tf.translateX;
			pY=this._style._tf.translateY;
			ifRotate=ifRotate || (this._style._tf.rotate!==0);
			if (this._style.scrollRect){
				pX+=this._style.scrollRect.x;
				pY+=this._style.scrollRect.y;
			}
		};
		var pList=this._getBoundPointsM(ifRotate);
		if (!pList || pList.length < 1)return pList;
		if (pList.length !=8){
			pList=ifRotate ? GrahamScan.scanPList(pList):Rectangle._getWrapRec(pList,Rectangle.TEMP)._getBoundPoints();
		}
		if (!this.transform){
			Utils.transPointList(pList,this._x-pX,this._y-pY);
			return pList;
		};
		var tPoint=Point.TEMP;
		var i=0,len=pList.length;
		for (i=0;i < len;i+=2){
			tPoint.x=pList[i];
			tPoint.y=pList[i+1];
			this.toParentPoint(tPoint);
			pList[i]=tPoint.x;
			pList[i+1]=tPoint.y;
		}
		return pList;
	}

	/**
	*返回此实例中的绘图对象（ <code>Graphics</code> ）的显示区域，不包括子对象。
	*@param realSize （可选）使用图片的真实大小，默认为false
	*@return 一个 Rectangle 对象，表示获取到的显示区域。
	*/
	__proto.getGraphicBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		if (!this._graphics)return Rectangle.TEMP.setTo(0,0,0,0);
		return this._graphics.getBounds(realSize);
	}

	/**
	*@private
	*获取自己坐标系的显示区域多边形顶点列表
	*@param ifRotate （可选）当前的显示对象链是否由旋转
	*@return 顶点列表。结构：[x1,y1,x2,y2,x3,y3,...]。
	*/
	__proto._getBoundPointsM=function(ifRotate){
		(ifRotate===void 0)&& (ifRotate=false);
		if (this._$P.uBounds)return this._$P.uBounds._getBoundPoints();
		if (!this._$P.temBM)this._set$P("temBM",[]);
		if (this.scrollRect){
			var rst=Utils.clearArray(this._$P.temBM);
			var rec=Rectangle.TEMP;
			rec.copyFrom(this.scrollRect);
			Utils.concatArray(rst,rec._getBoundPoints());
			return rst;
		};
		var pList=this._graphics ? this._graphics.getBoundPoints():Utils.clearArray(this._$P.temBM);
		var child;
		var cList;
		var __childs;
		__childs=this._childs;
		for (var i=0,n=__childs.length;i < n;i++){
			child=__childs [i];
			if ((child instanceof laya.display.Sprite )&& child.visible==true){
				cList=child._boundPointsToParent(ifRotate);
				if (cList)
					pList=pList ? Utils.concatArray(pList,cList):cList;
			}
		}
		return pList;
	}

	/**
	*@private
	*获取样式。
	*@return 样式 Style 。
	*/
	__proto.getStyle=function(){
		this._style===Style.EMPTY && (this._style=new Style());
		return this._style;
	}

	/**
	*@private
	*设置样式。
	*@param value 样式。
	*/
	__proto.setStyle=function(value){
		this._style=value;
	}

	/**@private */
	__proto._adjustTransform=function(){
		this._tfChanged=false;
		var style=this._style;
		var tf=style._tf;
		var sx=tf.scaleX,sy=tf.scaleY;
		var m;
		if (tf.rotate || sx!==1 || sy!==1 || tf.skewX || tf.skewY){
			m=this._transform || (this._transform=Matrix.create());
			m.bTransform=true;
			var skx=(tf.rotate-tf.skewX)*0.0174532922222222;
			var sky=(tf.rotate+tf.skewY)*0.0174532922222222;
			var cx=Math.cos(sky);
			var ssx=Math.sin(sky);
			var cy=Math.sin(skx);
			var ssy=Math.cos(skx);
			m.a=sx *cx;
			m.b=sx *ssx;
			m.c=-sy *cy;
			m.d=sy *ssy;
			m.tx=m.ty=0;
			return m;
			}else {
			this._transform && this._transform.destroy();
			this._transform=null;
			this._renderType &=~ /*laya.renders.RenderSprite.TRANSFORM*/0x04;
		}
		return m;
	}

	/**
	*<p>设置坐标位置。相当于分别设置x和y属性。</p>
	*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.pos(...).scale(...);</p>
	*@param x X轴坐标。
	*@param y Y轴坐标。
	*@param speedMode （可选）是否极速模式，正常是调用this.x=value进行赋值，极速模式直接调用内部函数处理，如果未重写x,y属性，建议设置为急速模式性能更高。
	*@return 返回对象本身。
	*/
	__proto.pos=function(x,y,speedMode){
		(speedMode===void 0)&& (speedMode=false);
		if (this._x!==x || this._y!==y){
			if (this.destroyed)return this;
			if (speedMode){
				this._x=x;
				this._y=y;
				this.conchModel && this.conchModel.pos(this._x,this._y);
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
				if (this._$P.maskParent && this._$P.maskParent._repaint===0){
					this._$P.maskParent._repaint=1;
					this._$P.maskParent.parentRepaint();
				}
				}else {
				this.x=x;
				this.y=y;
			}
		}
		return this;
	}

	/**
	*<p>设置轴心点。相当于分别设置pivotX和pivotY属性。</p>
	*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.pivot(...).pos(...);</p>
	*@param x X轴心点。
	*@param y Y轴心点。
	*@return 返回对象本身。
	*/
	__proto.pivot=function(x,y){
		this.pivotX=x;
		this.pivotY=y;
		return this;
	}

	/**
	*<p>设置宽高。相当于分别设置width和height属性。</p>
	*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.size(...).pos(...);</p>
	*@param width 宽度值。
	*@param hegiht 高度值。
	*@return 返回对象本身。
	*/
	__proto.size=function(width,height){
		this.width=width;
		this.height=height;
		return this;
	}

	/**
	*<p>设置缩放。相当于分别设置scaleX和scaleY属性。</p>
	*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.scale(...).pos(...);</p>
	*@param scaleX X轴缩放比例。
	*@param scaleY Y轴缩放比例。
	*@param speedMode （可选）是否极速模式，正常是调用this.scaleX=value进行赋值，极速模式直接调用内部函数处理，如果未重写scaleX,scaleY属性，建议设置为急速模式性能更高。
	*@return 返回对象本身。
	*/
	__proto.scale=function(scaleX,scaleY,speedMode){
		(speedMode===void 0)&& (speedMode=false);
		var style=this.getStyle();
		var _tf=style._tf;
		if (_tf.scaleX !=scaleX || _tf.scaleY !=scaleY){
			if (this.destroyed)return this;
			if (speedMode){
				style.setScale(scaleX,scaleY);
				this._tfChanged=true;
				this.conchModel && this.conchModel.scale(scaleX,scaleY);
				this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
				}else {
				this.scaleX=scaleX;
				this.scaleY=scaleY;
			}
		}
		return this;
	}

	/**
	*<p>设置倾斜角度。相当于分别设置skewX和skewY属性。</p>
	*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.skew(...).pos(...);</p>
	*@param skewX 水平倾斜角度。
	*@param skewY 垂直倾斜角度。
	*@return 返回对象本身
	*/
	__proto.skew=function(skewX,skewY){
		this.skewX=skewX;
		this.skewY=skewY;
		return this;
	}

	/**
	*更新、呈现显示对象。由系统调用。
	*@param context 渲染的上下文引用。
	*@param x X轴坐标。
	*@param y Y轴坐标。
	*/
	__proto.render=function(context,x,y){
		Stat.spriteCount++;
		RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
		this._repaint=0;
	}

	/**
	*<p>绘制 当前<code>Sprite</code> 到 <code>Canvas</code> 上，并返回一个HtmlCanvas。</p>
	*<p>绘制的结果可以当作图片源，再次绘制到其他Sprite里面，示例：</p>
	*
	*var htmlCanvas:HTMLCanvas=sprite.drawToCanvas(100,100,0,0);//把精灵绘制到canvas上面
	*var texture:Texture=new Texture(htmlCanvas);//使用htmlCanvas创建Texture
	*var sp:Sprite=new Sprite().pos(0,200);//创建精灵并把它放倒200位置
	*sp.graphics.drawTexture(texture);//把截图绘制到精灵上
	*Laya.stage.addChild(sp);//把精灵显示到舞台
	*
	*<p>也可以获取原始图片数据，分享到网上，从而实现截图效果，示例：</p>
	*
	*var htmlCanvas:HTMLCanvas=sprite.drawToCanvas(100,100,0,0);//把精灵绘制到canvas上面
	*
	*htmlCanvas.toBase64("image/png",0.92,function(base64){//webgl和canvas模式下为同步方法，加速器下是异步方法
		*trace(base64);//打印图片base64信息，可以发给服务器或者保存为图片
		*});
	*
	*@param canvasWidth 画布宽度。
	*@param canvasHeight 画布高度。
	*@param x 绘制的 X 轴偏移量。
	*@param y 绘制的 Y 轴偏移量。
	*@return HTMLCanvas 对象。
	*/
	__proto.drawToCanvas=function(canvasWidth,canvasHeight,offsetX,offsetY){
		if (Render.isConchNode){
			var canvas=HTMLCanvas.create("2D");
			var context=new RenderContext(canvasWidth,canvasHeight,canvas);
			context.ctx.setCanvasType(1);
			this.conchModel.drawToCanvas(canvas.source,offsetX,offsetY);
			return canvas;
			}else {
			return RunDriver.drawToCanvas(this,this._renderType,canvasWidth,canvasHeight,offsetX,offsetY);
		}
	}

	/**
	*<p>自定义更新、呈现显示对象。一般用来扩展渲染模式，请合理使用，可能会导致在加速器上无法渲染。</p>
	*<p><b>注意</b>不要在此函数内增加或删除树节点，否则会对树节点遍历造成影响。</p>
	*@param context 渲染的上下文引用。
	*@param x X轴坐标。
	*@param y Y轴坐标。
	*/
	__proto.customRender=function(context,x,y){
		this._renderType |=/*laya.renders.RenderSprite.CUSTOM*/0x400;
	}

	/**
	*@private
	*应用滤镜。
	*/
	__proto._applyFilters=function(){
		if (Render.isWebGL)return;
		var _filters;
		_filters=this._$P.filters;
		if (!_filters || _filters.length < 1)return;
		for (var i=0,n=_filters.length;i < n;i++){
			_filters[i].action.apply(this._$P.cacheCanvas);
		}
	}

	/**
	*@private
	*查看当前原件中是否包含发光滤镜。
	*@return 一个 Boolean 值，表示当前原件中是否包含发光滤镜。
	*/
	__proto._isHaveGlowFilter=function(){
		var i=0,len=0;
		if (this.filters){
			for (i=0;i < this.filters.length;i++){
				if (this.filters[i].type==/*laya.filters.Filter.GLOW*/0x08){
					return true;
				}
			}
		}
		for (i=0,len=this._childs.length;i < len;i++){
			if (this._childs[i]._isHaveGlowFilter()){
				return true;
			}
		}
		return false;
	}

	/**
	*把本地坐标转换为相对stage的全局坐标。
	*@param point 本地坐标点。
	*@param createNewPoint （可选）是否创建一个新的Point对象作为返回值，默认为false，使用输入的point对象返回，减少对象创建开销。
	*@return 转换后的坐标的点。
	*/
	__proto.localToGlobal=function(point,createNewPoint){
		(createNewPoint===void 0)&& (createNewPoint=false);
		if (createNewPoint===true){
			point=new Point(point.x,point.y);
		};
		var ele=this;
		while (ele){
			if (ele==Laya.stage)break ;
			point=ele.toParentPoint(point);
			ele=ele.parent;
		}
		return point;
	}

	/**
	*把stage的全局坐标转换为本地坐标。
	*@param point 全局坐标点。
	*@param createNewPoint （可选）是否创建一个新的Point对象作为返回值，默认为false，使用输入的point对象返回，减少对象创建开销。
	*@return 转换后的坐标的点。
	*/
	__proto.globalToLocal=function(point,createNewPoint){
		(createNewPoint===void 0)&& (createNewPoint=false);
		if (createNewPoint){
			point=new Point(point.x,point.y);
		};
		var ele=this;
		var list=[];
		while (ele){
			if (ele==Laya.stage)break ;
			list.push(ele);
			ele=ele.parent;
		};
		var i=list.length-1;
		while (i >=0){
			ele=list[i];
			point=ele.fromParentPoint(point);
			i--;
		}
		return point;
	}

	/**
	*将本地坐标系坐标转转换到父容器坐标系。
	*@param point 本地坐标点。
	*@return 转换后的点。
	*/
	__proto.toParentPoint=function(point){
		if (!point)return point;
		point.x-=this.pivotX;
		point.y-=this.pivotY;
		if (this.transform){
			this._transform.transformPoint(point);
		}
		point.x+=this._x;
		point.y+=this._y;
		var scroll=this._style.scrollRect;
		if (scroll){
			point.x-=scroll.x;
			point.y-=scroll.y;
		}
		return point;
	}

	/**
	*将父容器坐标系坐标转换到本地坐标系。
	*@param point 父容器坐标点。
	*@return 转换后的点。
	*/
	__proto.fromParentPoint=function(point){
		if (!point)return point;
		point.x-=this._x;
		point.y-=this._y;
		var scroll=this._style.scrollRect;
		if (scroll){
			point.x+=scroll.x;
			point.y+=scroll.y;
		}
		if (this.transform){
			this._transform.invertTransformPoint(point);
		}
		point.x+=this.pivotX;
		point.y+=this.pivotY;
		return point;
	}

	/**
	*<p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
	*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param args （可选）事件侦听函数的回调参数。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.on=function(type,caller,listener,args){
		if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
			this.mouseEnabled=true;
			this._setBit(/*laya.display.Node.MOUSEENABLE*/0x2,true);
			if (this._parent){
				this._$2__onDisplay();
			}
			return this._createListener(type,caller,listener,args,false);
		}
		return _super.prototype.on.call(this,type,caller,listener,args);
	}

	/**
	*<p>增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。</p>
	*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
	*@param type 事件的类型。
	*@param caller 事件侦听函数的执行域。
	*@param listener 事件侦听函数。
	*@param args （可选）事件侦听函数的回调参数。
	*@return 此 EventDispatcher 对象。
	*/
	__proto.once=function(type,caller,listener,args){
		if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
			this.mouseEnabled=true;
			this._setBit(/*laya.display.Node.MOUSEENABLE*/0x2,true);
			if (this._parent){
				this._$2__onDisplay();
			}
			return this._createListener(type,caller,listener,args,true);
		}
		return _super.prototype.once.call(this,type,caller,listener,args);
	}

	/**@private */
	__proto._$2__onDisplay=function(){
		if (this._mouseEnableState!==1){
			var ele=this;
			ele=ele.parent;
			while (ele && ele._mouseEnableState!==1){
				if (ele._getBit(/*laya.display.Node.MOUSEENABLE*/0x2))break ;
				ele.mouseEnabled=true;
				ele._setBit(/*laya.display.Node.MOUSEENABLE*/0x2,true);
				ele=ele.parent;
			}
		}
	}

	/**
	*<p>加载并显示一个图片。功能等同于graphics.loadImage方法。支持异步加载。</p>
	*<p>注意：多次调用loadImage绘制不同的图片，会同时显示。</p>
	*@param url 图片地址。
	*@param x （可选）显示图片的x位置。
	*@param y （可选）显示图片的y位置。
	*@param width （可选）显示图片的宽度，设置为0表示使用图片默认宽度。
	*@param height （可选）显示图片的高度，设置为0表示使用图片默认高度。
	*@param complete （可选）加载完成回调。
	*@return 返回精灵对象本身。
	*/
	__proto.loadImage=function(url,x,y,width,height,complete){
		var _$this=this;
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		function loaded (tex){
			if (!_$this.destroyed){
				_$this.size(x+(width || tex.width),y+(height || tex.height));
				_$this.repaint();
				complete && complete.runWith(tex);
			}
		}
		this.graphics.loadImage(url,x,y,width,height,loaded);
		return this;
	}

	/**cacheAs后，设置自己和父对象缓存失效。*/
	__proto.repaint=function(){
		this.conchModel && this.conchModel.repaint && this.conchModel.repaint();
		if (this._repaint===0){
			this._repaint=1;
			this.parentRepaint();
		}
		if (this._$P && this._$P.maskParent){
			this._$P.maskParent.repaint();
		}
	}

	/**
	*@private
	*获取是否重新缓存。
	*@return 如果重新缓存值为 true，否则值为 false。
	*/
	__proto._needRepaint=function(){
		return (this._repaint!==0)&& this._$P.cacheCanvas && this._$P.cacheCanvas.reCache;
	}

	/**@private */
	__proto._childChanged=function(child){
		if (this._childs.length)this._renderType |=/*laya.renders.RenderSprite.CHILDS*/0x800;
		else this._renderType &=~ /*laya.renders.RenderSprite.CHILDS*/0x800;
		if (child && this._get$P("hasZorder"))Laya.timer.callLater(this,this.updateZOrder);
		this.repaint();
	}

	/**cacheAs时，设置所有父对象缓存失效。 */
	__proto.parentRepaint=function(){
		var p=this._parent;
		if (p && p._repaint===0){
			p._repaint=1;
			p.parentRepaint();
		}
	}

	/**
	*开始拖动此对象。
	*@param area （可选）拖动区域，此区域为当前对象注册点活动区域（不包括对象宽高），可选。
	*@param hasInertia （可选）鼠标松开后，是否还惯性滑动，默认为false，可选。
	*@param elasticDistance （可选）橡皮筋效果的距离值，0为无橡皮筋效果，默认为0，可选。
	*@param elasticBackTime （可选）橡皮筋回弹时间，单位为毫秒，默认为300毫秒，可选。
	*@param data （可选）拖动事件携带的数据，可选。
	*@param disableMouseEvent （可选）禁用其他对象的鼠标检测，默认为false，设置为true能提高性能。
	*@param ratio （可选）惯性阻尼系数，影响惯性力度和时长。
	*/
	__proto.startDrag=function(area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio){
		(hasInertia===void 0)&& (hasInertia=false);
		(elasticDistance===void 0)&& (elasticDistance=0);
		(elasticBackTime===void 0)&& (elasticBackTime=300);
		(disableMouseEvent===void 0)&& (disableMouseEvent=false);
		(ratio===void 0)&& (ratio=0.92);
		this._$P.dragging || (this._set$P("dragging",new Dragging()));
		this._$P.dragging.start(this,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio);
	}

	/**停止拖动此对象。*/
	__proto.stopDrag=function(){
		this._$P.dragging && this._$P.dragging.stop();
	}

	__proto._releaseMem=function(){
		if (!this._$P)return;
		var cc=this._$P.cacheCanvas;
		if (cc && cc.ctx){
			Pool.recover("RenderContext",cc.ctx);
			cc.ctx.canvas.size(0,0);
			cc.ctx=null;
		};
		var fc=this._$P._filterCache;
		if (fc){
			fc.destroy();
			fc.recycle();
			this._set$P('_filterCache',null);
		}
		this._$P._isHaveGlowFilter && this._set$P('_isHaveGlowFilter',false);
		this._$P._isHaveGlowFilter=null;
	}

	/**@private */
	__proto._setDisplay=function(value){
		if (!value)this._releaseMem();
		_super.prototype._setDisplay.call(this,value);
	}

	/**
	*检测某个点是否在此对象内。
	*@param x 全局x坐标。
	*@param y 全局y坐标。
	*@return 表示是否在对象内。
	*/
	__proto.hitTestPoint=function(x,y){
		var point=this.globalToLocal(Point.TEMP.setTo(x,y));
		x=point.x;
		y=point.y;
		var rect=this._$P.hitArea ? this._$P.hitArea :(this._width > 0 && this._height > 0)? Rectangle.TEMP.setTo(0,0,this._width,this._height):this.getSelfBounds();
		return rect.contains(x,y);
	}

	/**获得相对于本对象上的鼠标坐标信息。*/
	__proto.getMousePoint=function(){
		return this.globalToLocal(Point.TEMP.setTo(Laya.stage.mouseX,Laya.stage.mouseY));
	}

	/**@private */
	__proto._getWords=function(){
		return null;
	}

	/**@private */
	__proto._addChildsToLayout=function(out){
		var words=this._getWords();
		if (words==null && this._childs.length==0)return false;
		if (words){
			for (var i=0,n=words.length;i < n;i++){
				out.push(words[i]);
			}
		}
		this._childs.forEach(function(o,index,array){
			o._style._enableLayout()&& o._addToLayout(out);
		});
		return true;
	}

	/**@private */
	__proto._addToLayout=function(out){
		if (this._style.absolute)return;
		this._style.block ? out.push(this):(this._addChildsToLayout(out)&& (this.x=this.y=0));
	}

	/**@private */
	__proto._isChar=function(){
		return false;
	}

	/**@private */
	__proto._getCSSStyle=function(){
		return this._style.getCSSStyle();
	}

	/**
	*@private
	*设置指定属性名的属性值。
	*@param name 属性名。
	*@param value 属性值。
	*/
	__proto._setAttributes=function(name,value){
		switch (name){
			case 'x':
				this.x=parseFloat(value);
				break ;
			case 'y':
				this.y=parseFloat(value);
				break ;
			case 'width':
				this.width=parseFloat(value);
				break ;
			case 'height':
				this.height=parseFloat(value);
				break ;
			default :
				this[name]=value;
			}
	}

	/**
	*@private
	*/
	__proto._layoutLater=function(){
		this.parent && (this.parent)._layoutLater();
	}

	/**
	*<p>指定是否对使用了 scrollRect 的显示对象进行优化处理。默认为false(不优化)。</p>
	*<p>当值为ture时：将对此对象使用了scrollRect 设定的显示区域以外的显示内容不进行渲染，以提高性能(如果子对象有旋转缩放或者中心点偏移，则显示筛选会不精确)。</p>
	*/
	__getset(0,__proto,'optimizeScrollRect',function(){
		return this._optimizeScrollRect;
		},function(b){
		if (this._optimizeScrollRect !=b){
			this._optimizeScrollRect=b;
			this.conchModel && this.conchModel.optimizeScrollRect(b);
		}
	});

	/**
	*设置是否开启自定义渲染，只有开启自定义渲染，才能使用customRender函数渲染。
	*/
	__getset(0,__proto,'customRenderEnable',null,function(b){
		if (b){
			this._renderType |=/*laya.renders.RenderSprite.CUSTOM*/0x400;
			if (Render.isConchNode){
				Sprite.CustomList.push(this);
				var canvas=new HTMLCanvas("2d");
				canvas._setContext(/*__JS__ */new CanvasRenderingContext2D());
				/*__JS__ */this.customContext=new RenderContext(0,0,canvas);
				canvas.context.setCanvasType && canvas.context.setCanvasType(2);
				this.conchModel.custom(canvas.context);
			}
		}
	});

	/**
	*指定显示对象是否缓存为静态图像。功能同cacheAs的normal模式。建议优先使用cacheAs代替。
	*/
	__getset(0,__proto,'cacheAsBitmap',function(){
		return this.cacheAs!=="none";
		},function(value){
		this.cacheAs=value ? (this._$P["hasFilter"] ? "none" :"normal"):"none";
	});

	/**
	*<p>指定显示对象是否缓存为静态图像，cacheAs时，子对象发生变化，会自动重新缓存，同时也可以手动调用reCache方法更新缓存。</p>
	*<p>建议把不经常变化的“复杂内容”缓存为静态图像，能极大提高渲染性能。cacheAs有"none"，"normal"和"bitmap"三个值可选。
	*<li>默认为"none"，不做任何缓存。</li>
	*<li>当值为"normal"时，canvas模式下进行画布缓存，webgl模式下进行命令缓存。</li>
	*<li>当值为"bitmap"时，canvas模式下进行依然是画布缓存，webgl模式下使用renderTarget缓存。</li></p>
	*<p>webgl下renderTarget缓存模式缺点：会额外创建renderTarget对象，增加内存开销，缓存面积有最大2048限制，不断重绘时会增加CPU开销。优点：大幅减少drawcall，渲染性能最高。
	*webgl下命令缓存模式缺点：只会减少节点遍历及命令组织，不会减少drawcall数，性能中等。优点：没有额外内存开销，无需renderTarget支持。</p>
	*/
	__getset(0,__proto,'cacheAs',function(){
		return this._$P.cacheCanvas==null ? "none" :this._$P.cacheCanvas.type;
		},function(value){
		var cacheCanvas=this._$P.cacheCanvas;
		if (value===(cacheCanvas ? cacheCanvas.type :"none"))return;
		if (value!=="none"){
			if (!this._getBit(/*laya.display.Node.NOTICE_DISPLAY*/0x1))this._setUpNoticeType(/*laya.display.Node.NOTICE_DISPLAY*/0x1);
			cacheCanvas || (cacheCanvas=this._set$P("cacheCanvas",Pool.getItemByClass("cacheCanvas",Object)));
			cacheCanvas.type=value;
			cacheCanvas.reCache=true;
			this._renderType |=/*laya.renders.RenderSprite.CANVAS*/0x10;
			if (value=="bitmap")this.conchModel && this.conchModel.cacheAs(1);
			this._set$P("cacheForFilters",false);
			}else {
			if (this._$P["_mask"]){
			}else
			if (this._$P["hasFilter"]){
				this._set$P("cacheForFilters",true);
				}else {
				if (cacheCanvas){
					var cc=cacheCanvas;
					if (cc && cc.ctx){
						Pool.recover("RenderContext",cc.ctx);
						cc.ctx.canvas.size(0,0);
						cc.ctx=null;
					}
					Pool.recover("cacheCanvas",cacheCanvas);
				}
				this._$P.cacheCanvas=null;
				this._renderType &=~ /*laya.renders.RenderSprite.CANVAS*/0x10;
				this.conchModel && this.conchModel.cacheAs(0);
			}
		}
		this.repaint();
	});

	/**z排序，更改此值，则会按照值的大小对同一容器的所有对象重新排序。值越大，越靠上。默认为0，则根据添加顺序排序。*/
	__getset(0,__proto,'zOrder',function(){
		return this._zOrder;
		},function(value){
		if (this._zOrder !=value){
			this._zOrder=value;
			this.conchModel && this.conchModel.setZOrder && this.conchModel.setZOrder(value);
			if (this._parent){
				value && this._parent._set$P("hasZorder",true);
				Laya.timer.callLater(this._parent,this.updateZOrder);
			}
		}
	});

	/**旋转角度，默认值为0。以角度为单位。*/
	__getset(0,__proto,'rotation',function(){
		return this._style._tf.rotate;
		},function(value){
		var style=this.getStyle();
		if (style._tf.rotate!==value){
			style.setRotate(value);
			this._tfChanged=true;
			this.conchModel && this.conchModel.rotate(value);
			this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
		}
	});

	/**
	*<p>显示对象的宽度，单位为像素，默认为0。</p>
	*<p>此宽度用于鼠标碰撞检测，并不影响显示对象图像大小。需要对显示对象的图像进行缩放，请使用scale、scaleX、scaleY。</p>
	*<p>可以通过getbounds获取显示对象图像的实际宽度。</p>
	*/
	__getset(0,__proto,'width',function(){
		if (!this.autoSize)return this._width;
		return this.getSelfBounds().width;
		},function(value){
		if (this._width!==value){
			this._width=value;
			this.conchModel && this.conchModel.size(value,this._height)
			this.repaint();
		}
	});

	/**表示显示对象相对于父容器的水平方向坐标值。*/
	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		if (this._x!==value){
			if (this.destroyed)return;
			this._x=value;
			this.conchModel && this.conchModel.pos(value,this._y);
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
			if (this._$P.maskParent && this._$P.maskParent._repaint===0){
				this._$P.maskParent._repaint=1;
				this._$P.maskParent.parentRepaint();
			}
		}
	});

	/**
	*获得相对于stage的全局Y轴缩放值（会叠加父亲节点的缩放值）。
	*/
	__getset(0,__proto,'globalScaleY',function(){
		var scale=1;
		var ele=this;
		while (ele){
			if (ele===Laya.stage)break ;
			scale *=ele.scaleY;
			ele=ele.parent;
		}
		return scale;
	});

	/**
	*<p>可以设置一个Rectangle区域作为点击区域，或者设置一个<code>HitArea</code>实例作为点击区域，HitArea内可以设置可点击和不可点击区域。</p>
	*<p>如果不设置hitArea，则根据宽高形成的区域进行碰撞。</p>
	*/
	__getset(0,__proto,'hitArea',function(){
		return this._$P.hitArea;
		},function(value){
		this._set$P("hitArea",value);
	});

	/**
	*是否静态缓存此对象的当前帧的最终属性。为 true 时，子对象变化时不会自动更新缓存，但是可以通过调用 reCache 方法手动刷新。
	*<b>注意：</b> 1. 设置 cacheAs 为非空和非"none"时才有效。 2. 由于渲染的时机在脚本执行之后，也就是说当前帧渲染的是对象的最终属性，所以如果在当前帧渲染之前、设置静态缓存之后改变对象属性，则最终渲染结果表现的是对象的最终属性。
	*/
	__getset(0,__proto,'staticCache',function(){
		return this._$P.staticCache;
		},function(value){
		this._set$P("staticCache",value);
		if (!value)this.reCache();
	});

	/**设置一个Texture实例，并显示此图片（如果之前有其他绘制，则会被清除掉）。等同于graphics.clear();graphics.drawTexture()*/
	__getset(0,__proto,'texture',function(){
		return this._texture;
		},function(value){
		if (this._texture !=value){
			this._texture=value;
			this.graphics.cleanByTexture(value,0,0);
		}
	});

	/**表示显示对象相对于父容器的垂直方向坐标值。*/
	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		if (this._y!==value){
			if (this.destroyed)return;
			this._y=value;
			this.conchModel && this.conchModel.pos(this._x,value);
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
			if (this._$P.maskParent && this._$P.maskParent._repaint===0){
				this._$P.maskParent._repaint=1;
				this._$P.maskParent.parentRepaint();
			}
		}
	});

	/**
	*<p>显示对象的高度，单位为像素，默认为0。</p>
	*<p>此高度用于鼠标碰撞检测，并不影响显示对象图像大小。需要对显示对象的图像进行缩放，请使用scale、scaleX、scaleY。</p>
	*<p>可以通过getbounds获取显示对象图像的实际高度。</p>
	*/
	__getset(0,__proto,'height',function(){
		if (!this.autoSize)return this._height;
		return this.getSelfBounds().height;
		},function(value){
		if (this._height!==value){
			this._height=value;
			this.conchModel && this.conchModel.size(this._width,value);
			this.repaint();
		}
	});

	/**指定要使用的混合模式。目前只支持"lighter"。*/
	__getset(0,__proto,'blendMode',function(){
		return this._style.blendMode;
		},function(value){
		this.getStyle().blendMode=value;
		this.conchModel && this.conchModel.blendMode(value);
		if (value && value !="source-over")this._renderType |=/*laya.renders.RenderSprite.BLEND*/0x08;
		else this._renderType &=~ /*laya.renders.RenderSprite.BLEND*/0x08;
		this.parentRepaint();
	});

	/**X轴缩放值，默认值为1。设置为负数，可以实现水平反转效果，比如scaleX=-1。*/
	__getset(0,__proto,'scaleX',function(){
		return this._style._tf.scaleX;
		},function(value){
		var style=this.getStyle();
		if (style._tf.scaleX!==value){
			style.setScaleX(value);
			this._tfChanged=true;
			this.conchModel && this.conchModel.scale(value,style._tf.scaleY);
			this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
		}
	});

	/**Y轴缩放值，默认值为1。设置为负数，可以实现垂直反转效果，比如scaleX=-1。*/
	__getset(0,__proto,'scaleY',function(){
		return this._style._tf.scaleY;
		},function(value){
		var style=this.getStyle();
		if (style._tf.scaleY!==value){
			style.setScaleY(value);
			this._tfChanged=true;
			this.conchModel && this.conchModel.scale(style._tf.scaleX,value);
			this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
		}
	});

	/**对舞台 <code>stage</code> 的引用。*/
	__getset(0,__proto,'stage',function(){
		return Laya.stage;
	});

	/**水平倾斜角度，默认值为0。以角度为单位。*/
	__getset(0,__proto,'skewX',function(){
		return this._style._tf.skewX;
		},function(value){
		var style=this.getStyle();
		if (style._tf.skewX!==value){
			style.setSkewX(value);
			this._tfChanged=true;
			this.conchModel && this.conchModel.skew(value,style._tf.skewY);
			this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
		}
	});

	/**
	*<p>显示对象的滚动矩形范围，具有裁剪效果(如果只想限制子对象渲染区域，请使用viewport)，设置optimizeScrollRect=true，可以优化裁剪区域外的内容不进行渲染。</p>
	*<p> srollRect和viewport的区别：<br/>
	*1.srollRect自带裁剪效果，viewport只影响子对象渲染是否渲染，不具有裁剪效果（性能更高）。<br/>
	*2.设置rect的x,y属性均能实现区域滚动效果，但scrollRect会保持0,0点位置不变。</p>
	*/
	__getset(0,__proto,'scrollRect',function(){
		return this._style.scrollRect;
		},function(value){
		this.getStyle().scrollRect=value;
		this.repaint();
		if (value){
			this._renderType |=/*laya.renders.RenderSprite.CLIP*/0x80;
			this.conchModel && this.conchModel.scrollRect(value.x,value.y,value.width,value.height);
			}else {
			this._renderType &=~ /*laya.renders.RenderSprite.CLIP*/0x80;
			if (this.conchModel){
				if (Sprite.RUNTIMEVERION < "0.9.1")
					this.conchModel.removeType(0x40);
				else
				this.conchModel.removeType(/*laya.renders.RenderSprite.CLIP*/0x80);
			}
		}
	});

	/**垂直倾斜角度，默认值为0。以角度为单位。*/
	__getset(0,__proto,'skewY',function(){
		return this._style._tf.skewY;
		},function(value){
		var style=this.getStyle();
		if (style._tf.skewY!==value){
			style.setSkewY(value);
			this._tfChanged=true;
			this.conchModel && this.conchModel.skew(style._tf.skewX,value);
			this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
		}
	});

	/**
	*<p>对象的矩阵信息。通过设置矩阵可以实现节点旋转，缩放，位移效果。</p>
	*<p>矩阵更多信息请参考 <code>Matrix</code></p>
	*/
	__getset(0,__proto,'transform',function(){
		return this._tfChanged ? this._adjustTransform():this._transform;
		},function(value){
		this._tfChanged=false;
		this._transform=value;
		if (value){
			this._x=value.tx;
			this._y=value.ty;
			value.tx=value.ty=0;
			this.conchModel && this.conchModel.transform(value.a,value.b,value.c,value.d,this._x,this._y);
		}
		if (value)this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
		else {
			this._renderType &=~ /*laya.renders.RenderSprite.TRANSFORM*/0x04;
			this.conchModel && this.conchModel.removeType(/*laya.renders.RenderSprite.TRANSFORM*/0x04);
		}
		this.parentRepaint();
	});

	/**X轴 轴心点的位置，单位为像素，默认为0。轴心点会影响对象位置，缩放中心，旋转中心。*/
	__getset(0,__proto,'pivotX',function(){
		return this._style._tf.translateX;
		},function(value){
		this.getStyle().setTranslateX(value);
		this.conchModel && this.conchModel.pivot(value,this._style._tf.translateY);
		this.repaint();
	});

	/**Y轴 轴心点的位置，单位为像素，默认为0。轴心点会影响对象位置，缩放中心，旋转中心。*/
	__getset(0,__proto,'pivotY',function(){
		return this._style._tf.translateY;
		},function(value){
		this.getStyle().setTranslateY(value);
		this.conchModel && this.conchModel.pivot(this._style._tf.translateX,value);
		this.repaint();
	});

	/**透明度，值为0-1，默认值为1，表示不透明。更改alpha值会影响drawcall。*/
	__getset(0,__proto,'alpha',function(){
		return this._style.alpha;
		},function(value){
		if (this._style && this._style.alpha!==value){
			value=value < 0 ? 0 :(value > 1 ? 1 :value);
			this.getStyle().alpha=value;
			this.conchModel && this.conchModel.alpha(value);
			if (value!==1)this._renderType |=/*laya.renders.RenderSprite.ALPHA*/0x02;
			else this._renderType &=~ /*laya.renders.RenderSprite.ALPHA*/0x02;
			this.parentRepaint();
		}
	});

	/**表示是否可见，默认为true。如果设置不可见，节点将不被渲染。*/
	__getset(0,__proto,'visible',function(){
		return this._style.visible;
		},function(value){
		if (this._style && this._style.visible!==value){
			this.getStyle().visible=value;
			this.conchModel && this.conchModel.visible(value);
			this.parentRepaint();
		}
	});

	/**绘图对象。封装了绘制位图和矢量图的接口，Sprite所有的绘图操作都通过Graphics来实现的。*/
	__getset(0,__proto,'graphics',function(){
		return this._graphics || (this.graphics=RunDriver.createGraphics());
		},function(value){
		if (this._graphics)this._graphics._sp=null;
		this._graphics=value;
		if (value){
			this._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01;
			this._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x200;
			value._sp=this;
			this.conchModel && this.conchModel.graphics(this._graphics);
			}else {
			this._renderType &=~ /*laya.renders.RenderSprite.GRAPHICS*/0x200;
			this._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01;
			if (this.conchModel){
				if (Sprite.RUNTIMEVERION < "0.9.1")
					this.conchModel.removeType(0x100);
				else
				this.conchModel.removeType(/*laya.renders.RenderSprite.GRAPHICS*/0x200);
			}
		}
		this.repaint();
	});

	/**滤镜集合。可以设置多个滤镜组合。*/
	__getset(0,__proto,'filters',function(){
		return this._$P.filters;
		},function(value){
		value && value.length===0 && (value=null);
		if (this._$P.filters==value)return;
		this._set$P("filters",value ? value.slice():null);
		if (Render.isConchApp){
			if (this.conchModel){
				if (Sprite.RUNTIMEVERION < "0.9.1")
					this.conchModel.removeType(0x10);
				else
				this.conchModel.removeType(/*laya.renders.RenderSprite.FILTERS*/0x20);
			}
			if (this._$P.filters && this._$P.filters.length==1){
				this._$P.filters[0].callNative(this);
			}
		}
		if (Render.isWebGL){
			if (value && value.length){
				this._renderType |=/*laya.renders.RenderSprite.FILTERS*/0x20;
				}else {
				this._renderType &=~ /*laya.renders.RenderSprite.FILTERS*/0x20;
			}
		}
		if (value && value.length > 0){
			if (!this._getBit(/*laya.display.Node.NOTICE_DISPLAY*/0x1))this._setUpNoticeType(/*laya.display.Node.NOTICE_DISPLAY*/0x1);
			if (!(Render.isWebGL && value.length==1 && (((value[0])instanceof laya.filters.ColorFilter )))){
				if (this.cacheAs !="bitmap"){
					if (!Render.isConchNode)this.cacheAs="bitmap";
					this._set$P("cacheForFilters",true);
				}
				this._set$P("hasFilter",true);
			}
			}else {
			this._set$P("hasFilter",false);
			if (this._$P["cacheForFilters"] && this.cacheAs=="bitmap"){
				this.cacheAs="none";
			}
		}
		this.repaint();
	});

	__getset(0,__proto,'parent',_super.prototype._$get_parent,function(value){
		Laya.superSet(Node,this,'parent',value);
		if (value && this._getBit(/*laya.display.Node.MOUSEENABLE*/0x2)){
			this._$2__onDisplay();
		}
	});

	/**
	*<p>遮罩，可以设置一个对象(支持位图和矢量图)，根据对象形状进行遮罩显示。</p>
	*<p>【注意】遮罩对象坐标系是相对遮罩对象本身的，和Flash机制不同</p>
	*/
	__getset(0,__proto,'mask',function(){
		return this._$P._mask;
		},function(value){
		if (value && this.mask && this.mask._$P.maskParent)return;
		if (value){
			this.cacheAs="bitmap";
			this._set$P("_mask",value);
			value._set$P("maskParent",this);
			}else {
			this.mask && this.mask._set$P("maskParent",null);
			this._set$P("_mask",value);
			this.cacheAs="none";
		}
		this.conchModel && this.conchModel.mask(value ? value.conchModel :null);
		this._renderType |=/*laya.renders.RenderSprite.MASK*/0x40;
		this.parentRepaint();
	});

	/**
	*是否接受鼠标事件。
	*默认为false，如果监听鼠标事件，则会自动设置本对象及父节点的属性 mouseEnable 的值都为 true（如果父节点手动设置为false，则不会更改）。
	**/
	__getset(0,__proto,'mouseEnabled',function(){
		return this._mouseEnableState > 1;
		},function(value){
		this._mouseEnableState=value ? 2 :1;
	});

	/**
	*获得相对于stage的全局X轴缩放值（会叠加父亲节点的缩放值）。
	*/
	__getset(0,__proto,'globalScaleX',function(){
		var scale=1;
		var ele=this;
		while (ele){
			if (ele===Laya.stage)break ;
			scale *=ele.scaleX;
			ele=ele.parent;
		}
		return scale;
	});

	/**
	*返回鼠标在此对象坐标系上的 X 轴坐标信息。
	*/
	__getset(0,__proto,'mouseX',function(){
		return this.getMousePoint().x;
	});

	/**
	*返回鼠标在此对象坐标系上的 Y 轴坐标信息。
	*/
	__getset(0,__proto,'mouseY',function(){
		return this.getMousePoint().y;
	});

	Sprite.fromImage=function(url){
		return new Sprite().loadImage(url);
	}

	Sprite.CustomList=[];
	__static(Sprite,
	['RUNTIMEVERION',function(){return this.RUNTIMEVERION=/*__JS__ */window.conch?conchConfig.getRuntimeVersion().substr(conchConfig.getRuntimeVersion().lastIndexOf('-')+1):'';}
	]);
	return Sprite;
})(Node)


/**
*@private
*audio标签播放声音的音轨控制
*/
//class laya.media.h5audio.AudioSoundChannel extends laya.media.SoundChannel
var AudioSoundChannel=(function(_super){
	function AudioSoundChannel(audio){
		/**
		*播放用的audio标签
		*/
		this._audio=null;
		this._onEnd=null;
		this._resumePlay=null;
		AudioSoundChannel.__super.call(this);
		this._onEnd=Utils.bind(this.__onEnd,this);
		this._resumePlay=Utils.bind(this.__resumePlay,this);
		audio.addEventListener("ended",this._onEnd);
		this._audio=audio;
	}

	__class(AudioSoundChannel,'laya.media.h5audio.AudioSoundChannel',_super);
	var __proto=AudioSoundChannel.prototype;
	__proto.__onEnd=function(){
		if (this.loops==1){
			if (this.completeHandler){
				Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
				this.completeHandler=null;
			}
			this.stop();
			this.event(/*laya.events.Event.COMPLETE*/"complete");
			return;
		}
		if (this.loops > 0){
			this.loops--;
		}
		this.startTime=0;
		this.play();
	}

	__proto.__resumePlay=function(){
		if (this._audio)this._audio.removeEventListener("canplay",this._resumePlay);
		if (this.isStopped)return;
		try {
			this._audio.currentTime=this.startTime;
			Browser.container.appendChild(this._audio);
			this._audio.play();
			}catch (e){
			this.event(/*laya.events.Event.ERROR*/"error");
		}
	}

	/**
	*播放
	*/
	__proto.play=function(){
		this.isStopped=false;
		if (!this._audio)return;
		try {
			this._audio.playbackRate=SoundManager.playbackRate;
			this._audio.currentTime=this.startTime;
			}catch (e){
			this._audio.addEventListener("canplay",this._resumePlay);
			return;
		}
		SoundManager.addChannel(this);
		Browser.container.appendChild(this._audio);
		if("play" in this._audio)
			this._audio.play();
	}

	/**
	*停止播放
	*
	*/
	__proto.stop=function(){
		this.isStopped=true;
		SoundManager.removeChannel(this);
		this.completeHandler=null;
		if (!this._audio)
			return;
		if ("pause" in this._audio)
			if (Render.isConchApp){
			this._audio.stop();
		}
		this._audio.pause();
		this._audio.removeEventListener("ended",this._onEnd);
		this._audio.removeEventListener("canplay",this._resumePlay);
		if (!Browser.onIE){
			if (this._audio!=AudioSound._musicAudio){
				Pool.recover("audio:"+this.url,this._audio);
			}
		}
		Browser.removeElement(this._audio);
		this._audio=null;
	}

	__proto.pause=function(){
		this.isStopped=true;
		SoundManager.removeChannel(this);
		if("pause" in this._audio)
			this._audio.pause();
	}

	__proto.resume=function(){
		if (!this._audio)
			return;
		this.isStopped=false;
		SoundManager.addChannel(this);
		if("play" in this._audio)
			this._audio.play();
	}

	/**
	*当前播放到的位置
	*@return
	*
	*/
	__getset(0,__proto,'position',function(){
		if (!this._audio)
			return 0;
		return this._audio.currentTime;
	});

	/**
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		if (!this._audio)
			return 0;
		return this._audio.duration;
	});

	/**
	*设置音量
	*@param v
	*
	*/
	/**
	*获取音量
	*@return
	*
	*/
	__getset(0,__proto,'volume',function(){
		if (!this._audio)return 1;
		return this._audio.volume;
		},function(v){
		if (!this._audio)return;
		this._audio.volume=v;
	});

	return AudioSoundChannel;
})(SoundChannel)


/**
*@private
*web audio api方式播放声音的音轨控制
*/
//class laya.media.webaudio.WebAudioSoundChannel extends laya.media.SoundChannel
var WebAudioSoundChannel=(function(_super){
	function WebAudioSoundChannel(){
		/**
		*声音原始文件数据
		*/
		this.audioBuffer=null;
		/**
		*gain节点
		*/
		this.gain=null;
		/**
		*播放用的数据
		*/
		this.bufferSource=null;
		/**
		*当前时间
		*/
		this._currentTime=0;
		/**
		*当前音量
		*/
		this._volume=1;
		/**
		*播放开始时的时间戳
		*/
		this._startTime=0;
		this._pauseTime=0;
		this._onPlayEnd=null;
		this.context=WebAudioSound.ctx;
		WebAudioSoundChannel.__super.call(this);
		this._onPlayEnd=Utils.bind(this.__onPlayEnd,this);
		if (this.context["createGain"]){
			this.gain=this.context["createGain"]();
			}else {
			this.gain=this.context["createGainNode"]();
		}
	}

	__class(WebAudioSoundChannel,'laya.media.webaudio.WebAudioSoundChannel',_super);
	var __proto=WebAudioSoundChannel.prototype;
	/**
	*播放声音
	*/
	__proto.play=function(){
		SoundManager.addChannel(this);
		this.isStopped=false;
		this._clearBufferSource();
		if (!this.audioBuffer)return;
		if (this.startTime >=this.duration)return this.stop();
		var context=this.context;
		var gain=this.gain;
		var bufferSource=context.createBufferSource();
		this.bufferSource=bufferSource;
		bufferSource.buffer=this.audioBuffer;
		bufferSource.connect(gain);
		if (gain)
			gain.disconnect();
		gain.connect(context.destination);
		bufferSource.onended=this._onPlayEnd;
		this._startTime=Browser.now();
		if (this.gain.gain.setTargetAtTime){
			this.gain.gain.setTargetAtTime(this._volume,this.context.currentTime,0.001);
		}else
		this.gain.gain.value=this._volume;
		if (this.loops==0){
			bufferSource.loop=true;
		}
		if (bufferSource.playbackRate.setTargetAtTime){
			bufferSource.playbackRate.setTargetAtTime(SoundManager.playbackRate,this.context.currentTime,0.001)
		}else
		bufferSource.playbackRate.value=SoundManager.playbackRate;
		bufferSource.start(0,this.startTime);
		this._currentTime=0;
	}

	__proto.__onPlayEnd=function(){
		if (this.loops==1){
			if (this.completeHandler){
				Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
				this.completeHandler=null;
			}
			this.stop();
			this.event(/*laya.events.Event.COMPLETE*/"complete");
			return;
		}
		if (this.loops > 0){
			this.loops--;
		}
		this.startTime=0;
		this.play();
	}

	__proto._clearBufferSource=function(){
		if (this.bufferSource){
			var sourceNode=this.bufferSource;
			if (sourceNode.stop){
				sourceNode.stop(0);
				}else {
				sourceNode.noteOff(0);
			}
			sourceNode.disconnect(0);
			sourceNode.onended=null;
			if (!WebAudioSoundChannel._tryCleanFailed)this._tryClearBuffer(sourceNode);
			this.bufferSource=null;
		}
	}

	__proto._tryClearBuffer=function(sourceNode){
		if (!Browser.onMac){
			try{
				sourceNode.buffer=null;
				}catch (e){
				WebAudioSoundChannel._tryCleanFailed=true;
			}
			return;
		}
		try {sourceNode.buffer=WebAudioSound._miniBuffer;}catch (e){WebAudioSoundChannel._tryCleanFailed=true;}
	}

	/**
	*停止播放
	*/
	__proto.stop=function(){
		_super.prototype.stop.call(this);
		this._clearBufferSource();
		this.audioBuffer=null;
		if (this.gain)
			this.gain.disconnect();
		this.isStopped=true;
		SoundManager.removeChannel(this);
		this.completeHandler=null;
		if(SoundManager.autoReleaseSound)
			Laya.timer.once(5000,null,SoundManager.disposeSoundIfNotUsed,[this.url],false);
	}

	__proto.pause=function(){
		if (!this.isStopped){
			this._pauseTime=this.position;
		}
		this._clearBufferSource();
		if (this.gain)
			this.gain.disconnect();
		this.isStopped=true;
		SoundManager.removeChannel(this);
		if(SoundManager.autoReleaseSound)
			Laya.timer.once(5000,null,SoundManager.disposeSoundIfNotUsed,[this.url],false);
	}

	__proto.resume=function(){
		this.startTime=this._pauseTime;
		this.play();
	}

	/**
	*获取当前播放位置
	*/
	__getset(0,__proto,'position',function(){
		if (this.bufferSource){
			return (Browser.now()-this._startTime)/ 1000+this.startTime;
		}
		return 0;
	});

	__getset(0,__proto,'duration',function(){
		if (this.audioBuffer){
			return this.audioBuffer.duration;
		}
		return 0;
	});

	/**
	*设置音量
	*/
	/**
	*获取音量
	*/
	__getset(0,__proto,'volume',function(){
		return this._volume;
		},function(v){
		if (this.isStopped){
			return;
		}
		this._volume=v;
		if (this.gain.gain.setTargetAtTime){
			this.gain.gain.setTargetAtTime(v,this.context.currentTime,0.001);
		}else
		this.gain.gain.value=v;
	});

	WebAudioSoundChannel._tryCleanFailed=false;
	WebAudioSoundChannel.SetTargetDelay=0.001;
	return WebAudioSoundChannel;
})(SoundChannel)


/**
*@private
*<code>Bitmap</code> 是图片资源类。
*/
//class laya.resource.Bitmap extends laya.resource.Resource
var Bitmap=(function(_super){
	function Bitmap(){
		/**@private
		*HTML Image或HTML Canvas或WebGL Texture。
		**/
		//this._source=null;
		/**@private 宽度*/
		//this._w=NaN;
		/**@private 高度*/
		//this._h=NaN;
		Bitmap.__super.call(this);
		this._w=0;
		this._h=0;
	}

	__class(Bitmap,'laya.resource.Bitmap',_super);
	var __proto=Bitmap.prototype;
	/***
	*宽度。
	*/
	__getset(0,__proto,'width',function(){
		return this._w;
	});

	/***
	*高度。
	*/
	__getset(0,__proto,'height',function(){
		return this._h;
	});

	/***
	*HTML Image 或 HTML Canvas 或 WebGL Texture 。
	*/
	__getset(0,__proto,'source',function(){
		return this._source;
	});

	return Bitmap;
})(Resource)


/**
*<p>动画播放基类，提供了基础的动画播放控制方法和帧标签事件相关功能。</p>
*<p>可以继承此类，但不要直接实例化此类，因为有些方法需要由子类实现。</p>
*/
//class laya.display.AnimationPlayerBase extends laya.display.Sprite
var AnimationPlayerBase=(function(_super){
	function AnimationPlayerBase(){
		/**
		*是否循环播放，调用play(...)方法时，会将此值设置为指定的参数值。
		*/
		this.loop=false;
		/**
		*<p>播放顺序类型：AnimationPlayerBase.WRAP_POSITIVE为正序播放，AnimationPlayerBase.WRAP_REVERSE为倒序播放，AnimationPlayerBase.WRAP_PINGPONG为pingpong播放(当按指定顺序播放完结尾后，如果继续播发，则会改变播放顺序)。</p>
		*<p>默认为正序播放。</p>
		*/
		this.wrapMode=0;
		/**@private */
		this._index=0;
		/**@private */
		this._count=0;
		/**@private */
		this._isPlaying=false;
		/**@private */
		this._labels=null;
		/**是否是逆序播放*/
		this._isReverse=false;
		/**@private */
		this._frameRateChanged=false;
		/**@private */
		this._controlNode=null;
		/**@private */
		this._actionName=null;
		AnimationPlayerBase.__super.call(this);
		this._interval=Config.animationInterval;
		this._setUpNoticeType(/*laya.display.Node.NOTICE_DISPLAY*/0x1);
	}

	__class(AnimationPlayerBase,'laya.display.AnimationPlayerBase',_super);
	var __proto=AnimationPlayerBase.prototype;
	/**
	*<p>开始播放动画。play(...)方法被设计为在创建实例后的任何时候都可以被调用，当相应的资源加载完毕、调用动画帧填充方法(set frames)或者将实例显示在舞台上时，会判断是否正在播放中，如果是，则进行播放。</p>
	*<p>配合wrapMode属性，可设置动画播放顺序类型。</p>
	*@param start （可选）指定动画播放开始的索引(int)或帧标签(String)。帧标签可以通过addLabel(...)和removeLabel(...)进行添加和删除。
	*@param loop （可选）是否循环播放。
	*@param name （可选）动画名称。
	*@param showWarn（可选）是否动画不存在时打印警告
	*/
	__proto.play=function(start,loop,name,showWarn){
		(start===void 0)&& (start=0);
		(loop===void 0)&& (loop=true);
		(name===void 0)&& (name="");
		(showWarn===void 0)&& (showWarn=true);
		this._isPlaying=true;
		this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
		this.loop=loop;
		this._actionName=name;
		this._isReverse=this.wrapMode==1;
		if (this.interval > 0){
			this.timerLoop(this.interval,this,this._frameLoop,null,true,true);
		}
	}

	/**@private */
	__proto._getFrameByLabel=function(label){
		var i=0;
		for (i=0;i < this._count;i++){
			if (this._labels[i] && (this._labels [i]).indexOf(label)>=0)return i;
		}
		return 0;
	}

	/**@private */
	__proto._frameLoop=function(){
		if (this._isReverse){
			this._index--;
			if (this._index < 0){
				if (this.loop){
					if (this.wrapMode==2){
						this._index=this._count > 0 ? 1 :0;
						this._isReverse=false;
						}else {
						this._index=this._count-1;
					}
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					}else {
					this._index=0;
					this.stop();
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					return;
				}
			}
			}else {
			this._index++;
			if (this._index >=this._count){
				if (this.loop){
					if (this.wrapMode==2){
						this._index=this._count-2 >=0 ? this._count-2 :0;
						this._isReverse=true;
						}else {
						this._index=0;
					}
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					}else {
					this._index--;
					this.stop();
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					return;
				}
			}
		}
		this.index=this._index;
	}

	/**@private */
	__proto._setControlNode=function(node){
		if (this._controlNode){
			this._controlNode.off(/*laya.events.Event.DISPLAY*/"display",this,this._checkResumePlaying);
			this._controlNode.off(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._checkResumePlaying);
		}
		this._controlNode=node;
		if (node && node !=this){
			node.on(/*laya.events.Event.DISPLAY*/"display",this,this._checkResumePlaying);
			node.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._checkResumePlaying);
		}
	}

	/**@private */
	__proto._setDisplay=function(value){
		_super.prototype._setDisplay.call(this,value);
		this._checkResumePlaying();
	}

	/**@private */
	__proto._checkResumePlaying=function(){
		if (this._isPlaying){
			if (this._controlNode.displayedInStage)this.play(this._index,this.loop,this._actionName);
			else this.clearTimer(this,this._frameLoop);
		}
	}

	/**
	*停止动画播放。
	*/
	__proto.stop=function(){
		this._isPlaying=false;
		this.clearTimer(this,this._frameLoop);
	}

	/**
	*增加一个帧标签到指定索引的帧上。当动画播放到此索引的帧时会派发Event.LABEL事件，派发事件是在完成当前帧画面更新之后。
	*@param label 帧标签名称
	*@param index 帧索引
	*/
	__proto.addLabel=function(label,index){
		if (!this._labels)this._labels={};
		if (!this._labels[index])this._labels[index]=[];
		this._labels[index].push(label);
	}

	/**
	*删除指定的帧标签。
	*@param label 帧标签名称。注意：如果为空，则删除所有帧标签！
	*/
	__proto.removeLabel=function(label){
		if (!label)this._labels=null;
		else if (this._labels){
			for (var name in this._labels){
				this._removeLabelFromLabelList(this._labels[name],label);
			}
		}
	}

	/**@private */
	__proto._removeLabelFromLabelList=function(list,label){
		if (!list)return;
		for (var i=list.length-1;i >=0;i--){
			if (list[i]==label){
				list.splice(i,1);
			}
		}
	}

	/**
	*将动画切换到指定帧并停在那里。
	*@param position 帧索引或帧标签
	*/
	__proto.gotoAndStop=function(position){
		this.index=((typeof position=='string'))? this._getFrameByLabel(position):position;
		this.stop();
	}

	/**
	*@private
	*显示到某帧
	*@param value 帧索引
	*/
	__proto._displayToIndex=function(value){}
	/**
	*停止动画播放，并清理对象属性。之后可存入对象池，方便对象复用。
	*/
	__proto.clear=function(){
		this.stop();
		this._labels=null;
	}

	/**
	*<p>动画播放的帧间隔时间(单位：毫秒)。默认值依赖于Config.animationInterval=50，通过Config.animationInterval可以修改默认帧间隔时间。</p>
	*<p>要想为某动画设置独立的帧间隔时间，可以使用set interval，注意：如果动画正在播放，设置后会重置帧循环定时器的起始时间为当前时间，也就是说，如果频繁设置interval，会导致动画帧更新的时间间隔会比预想的要慢，甚至不更新。</p>
	*/
	__getset(0,__proto,'interval',function(){
		return this._interval;
		},function(value){
		if (this._interval !=value){
			this._frameRateChanged=true;
			this._interval=value;
			if (this._isPlaying && value > 0){
				this.timerLoop(value,this,this._frameLoop,null,true,true);
			}
		}
	});

	/**
	*是否正在播放中。
	*/
	__getset(0,__proto,'isPlaying',function(){
		return this._isPlaying;
	});

	/**
	*动画当前帧的索引。
	*/
	__getset(0,__proto,'index',function(){
		return this._index;
		},function(value){
		this._index=value;
		this._displayToIndex(value);
		if (this._labels && this._labels[value]){
			var tArr=this._labels[value];
			for (var i=0,len=tArr.length;i < len;i++){
				this.event(/*laya.events.Event.LABEL*/"label",tArr[i]);
			}
		}
	});

	/**
	*当前动画中帧的总数。
	*/
	__getset(0,__proto,'count',function(){
		return this._count;
	});

	AnimationPlayerBase.WRAP_POSITIVE=0;
	AnimationPlayerBase.WRAP_REVERSE=1;
	AnimationPlayerBase.WRAP_PINGPONG=2;
	return AnimationPlayerBase;
})(Sprite)


/**
*<p> <code>Text</code> 类用于创建显示对象以显示文本。</p>
*<p>
*注意：如果运行时系统找不到设定的字体，则用系统默认的字体渲染文字，从而导致显示异常。(通常电脑上显示正常，在一些移动端因缺少设置的字体而显示异常)。
*</p>
*@example
*package
*{
	*import laya.display.Text;
	*public class Text_Example
	*{
		*public function Text_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*var text:Text=new Text();//创建一个 Text 类的实例对象 text 。
			*text.text="这个是一个 Text 文本示例。";
			*text.color="#008fff";//设置 text 的文本颜色。
			*text.font="Arial";//设置 text 的文本字体。
			*text.bold=true;//设置 text 的文本显示为粗体。
			*text.fontSize=30;//设置 text 的字体大小。
			*text.wordWrap=true;//设置 text 的文本自动换行。
			*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
			*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
			*text.width=300;//设置 text 的宽度。
			*text.height=200;//设置 text 的高度。
			*text.italic=true;//设置 text 的文本显示为斜体。
			*text.borderColor="#fff000";//设置 text 的文本边框颜色。
			*Laya.stage.addChild(text);//将 text 添加到显示列表。
			*}
		*}
	*}
*@example
*Text_Example();
*function Text_Example()
*{
	*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
	*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
	*onInit();
	*}
*function onInit()
*{
	*var text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
	*text.text="这个是一个 Text 文本示例。";
	*text.color="#008fff";//设置 text 的文本颜色。
	*text.font="Arial";//设置 text 的文本字体。
	*text.bold=true;//设置 text 的文本显示为粗体。
	*text.fontSize=30;//设置 text 的字体大小。
	*text.wordWrap=true;//设置 text 的文本自动换行。
	*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
	*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
	*text.width=300;//设置 text 的宽度。
	*text.height=200;//设置 text 的高度。
	*text.italic=true;//设置 text 的文本显示为斜体。
	*text.borderColor="#fff000";//设置 text 的文本边框颜色。
	*Laya.stage.addChild(text);//将 text 添加到显示列表。
	*}
*@example
*class Text_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*var text:laya.display.Text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
		*text.text="这个是一个 Text 文本示例。";
		*text.color="#008fff";//设置 text 的文本颜色。
		*text.font="Arial";//设置 text 的文本字体。
		*text.bold=true;//设置 text 的文本显示为粗体。
		*text.fontSize=30;//设置 text 的字体大小。
		*text.wordWrap=true;//设置 text 的文本自动换行。
		*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
		*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
		*text.width=300;//设置 text 的宽度。
		*text.height=200;//设置 text 的高度。
		*text.italic=true;//设置 text 的文本显示为斜体。
		*text.borderColor="#fff000";//设置 text 的文本边框颜色。
		*Laya.stage.addChild(text);//将 text 添加到显示列表。
		*}
	*}
*/
//class laya.display.Text extends laya.display.Sprite
var Text=(function(_super){
	function Text(){
		/**@private */
		this._clipPoint=null;
		/**当前使用的位置字体。*/
		this._currBitmapFont=null;
		/**@private 表示文本内容字符串。*/
		this._text=null;
		/**@private 表示文本内容是否发生改变。*/
		this._isChanged=false;
		/**@private 表示文本的宽度，以像素为单位。*/
		this._textWidth=0;
		/**@private 表示文本的高度，以像素为单位。*/
		this._textHeight=0;
		/**@private 存储文字行数信息。*/
		this._lines=[];
		/**@private 保存每行宽度*/
		this._lineWidths=[];
		/**@private 文本的内容位置 X 轴信息。*/
		this._startX=NaN;
		/**@private 文本的内容位置X轴信息。 */
		this._startY=NaN;
		/**@private 当前可视行索引。*/
		this._lastVisibleLineIndex=-1;
		/**@private 当前可视行索引。*/
		this._words=null;
		/**@private */
		this._charSize={};
		/**
		*是否显示下划线。
		*/
		this.underline=false;
		/**
		*下划线的颜色，为null则使用字体颜色。
		*/
		this._underlineColor=null;
		Text.__super.call(this);
		this.overflow=Text.VISIBLE;
		this._style=new CSSStyle(this);
		(this._style).wordWrap=false;
	}

	__class(Text,'laya.display.Text',_super);
	var __proto=Text.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._lines=null;
		if (this._words){
			this._words.length=0;
			this._words=null;
		}
	}

	/**
	*@private
	*@inheritDoc
	*/
	__proto._getBoundPointsM=function(ifRotate){
		(ifRotate===void 0)&& (ifRotate=false);
		var rec=Rectangle.TEMP;
		rec.setTo(0,0,this.width,this.height);
		return rec._getBoundPoints();
	}

	/**
	*@inheritDoc
	*/
	__proto.getGraphicBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		var rec=Rectangle.TEMP;
		rec.setTo(0,0,this.width,this.height);
		return rec;
	}

	/**
	*@private
	*@inheritDoc
	*/
	__proto._getCSSStyle=function(){
		return this._style;
	}

	/**
	*<p>根据指定的文本，从语言包中取当前语言的文本内容。并对此文本中的{i}文本进行替换。</p>
	*<p>设置Text.langPacks语言包后，即可使用lang获取里面的语言</p>
	*<p>例如：
	*<li>（1）text 的值为“我的名字”，先取到这个文本对应的当前语言版本里的值“My name”，将“My name”设置为当前文本的内容。</li>
	*<li>（2）text 的值为“恭喜你赢得{0}个钻石，{1}经验。”，arg1 的值为100，arg2 的值为200。
	*则先取到这个文本对应的当前语言版本里的值“Congratulations on your winning {0}diamonds,{1}experience.”，
	*然后将文本里的{0}、{1}，依据括号里的数字从0开始替换为 arg1、arg2 的值。
	*将替换处理后的文本“Congratulations on your winning 100 diamonds,200 experience.”设置为当前文本的内容。
	*</li>
	*</p>
	*@param text 文本内容。
	*@param ...args 文本替换参数。
	*/
	__proto.lang=function(text,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10){
		text=Text.langPacks && Text.langPacks[text] ? Text.langPacks[text] :text;
		if (arguments.length < 2){
			this._text=text;
			}else {
			for (var i=0,n=arguments.length;i < n;i++){
				text=text.replace("{"+i+"}",arguments[i+1]);
			}
			this._text=text;
		}
	}

	/**
	*@private
	*/
	__proto._isPassWordMode=function(){
		var style=this._style;
		var password=style.password;
		if (("prompt" in this)&& this['prompt']==this._text)
			password=false;
		return password;
	}

	/**
	*@private
	*/
	__proto._getPassWordTxt=function(txt){
		var len=txt.length;
		var word;
		word="";
		for (var j=len;j > 0;j--){
			word+="●";
		}
		return word;
	}

	/**
	*渲染文字。
	*@param begin 开始渲染的行索引。
	*@param visibleLineCount 渲染的行数。
	*/
	__proto.renderText=function(begin,visibleLineCount){
		var graphics=this.graphics;
		graphics.clear(true);
		var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+(Browser.onIPhone ? (laya.display.Text._fontFamilyMap[this.font] || this.font):this.font);
		Browser.context.font=ctxFont;
		if (Render.isConchNode){
			Browser.context.direction=this.direction;
			graphics.setDirection && graphics.setDirection(this.direction);
		};
		var padding=this.padding;
		var startX=padding[3];
		var textAlgin="left";
		var lines=this._lines;
		var lineHeight=this.leading+this._charSize.height;
		var tCurrBitmapFont=this._currBitmapFont;
		if (tCurrBitmapFont){
			lineHeight=this.leading+tCurrBitmapFont.getMaxHeight();
		};
		var startY=padding[0];
		if ((!tCurrBitmapFont)&& this._width > 0 && this._textWidth <=this._width){
			if (this.align=="right"){
				textAlgin="right";
				startX=this._width-padding[1];
				}else if (this.align=="center"){
				textAlgin="center";
				startX=this._width *0.5+padding[3]-padding[1];
			}
		}
		if (this._height > 0){
			var tempVAlign=(this._textHeight > this._height)? "top" :this.valign;
			if (tempVAlign==="middle")
				startY=(this._height-visibleLineCount *lineHeight)*0.5+padding[0]-padding[2];
			else if (tempVAlign==="bottom")
			startY=this._height-visibleLineCount *lineHeight-padding[2];
		};
		var style=this._style;
		if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
			var bitmapScale=tCurrBitmapFont.fontSize / this.fontSize;
		}
		if (this._clipPoint){
			graphics.save();
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var tClipWidth=0;
				var tClipHeight=0;
				this._width ? tClipWidth=(this._width-padding[3]-padding[1]):tClipWidth=this._textWidth;
				this._height ? tClipHeight=(this._height-padding[0]-padding[2]):tClipHeight=this._textHeight;
				tClipWidth *=bitmapScale;
				tClipHeight *=bitmapScale;
				graphics.clipRect(padding[3],padding[0],tClipWidth,tClipHeight);
				}else {
				graphics.clipRect(padding[3],padding[0],this._width ? (this._width-padding[3]-padding[1]):this._textWidth,this._height ? (this._height-padding[0]-padding[2]):this._textHeight);
			}
		};
		var password=style.password;
		if (("prompt" in this)&& this['prompt']==this._text)
			password=false;
		var x=0,y=0;
		var end=Math.min(this._lines.length,visibleLineCount+begin)|| 1;
		for (var i=begin;i < end;i++){
			var word=lines[i];
			var _word;
			if (password){
				var len=word.length;
				word="";
				for (var j=len;j > 0;j--){
					word+="●";
				}
			}
			if (word===undefined)word="";
			x=startX-(this._clipPoint ? this._clipPoint.x :0);
			y=startY+lineHeight *i-(this._clipPoint ? this._clipPoint.y :0);
			this.underline && this.drawUnderline(textAlgin,x,y,i);
			if (tCurrBitmapFont){
				var tWidth=this.width;
				if (tCurrBitmapFont.autoScaleSize){
					tWidth=this.width *bitmapScale;
				}
				tCurrBitmapFont.drawText(word,this,x,y,this.align,tWidth);
				}else {
				if (Render.isWebGL){
					this._words || (this._words=[]);
					_word=this._words.length > (i-begin)? this._words[i-begin] :new WordText();
					_word.setText(word);
					}else {
					_word=word;
				}
				style.stroke ? graphics.fillBorderText(_word,x,y,ctxFont,this.color,style.strokeColor,style.stroke,textAlgin):graphics.fillText(_word,x,y,ctxFont,this.color,textAlgin);
			}
		}
		if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
			var tScale=1 / bitmapScale;
			this.scale(tScale,tScale);
		}
		if (this._clipPoint)
			graphics.restore();
		this._startX=startX;
		this._startY=startY;
	}

	/**
	*绘制下划线
	*@param x 本行坐标
	*@param y 本行坐标
	*@param lineIndex 本行索引
	*/
	__proto.drawUnderline=function(align,x,y,lineIndex){
		var lineWidth=this._lineWidths[lineIndex];
		switch (align){
			case 'center':
				x-=lineWidth / 2;
				break ;
			case 'right':
				x-=lineWidth;
				break ;
			case 'left':
			default :
				break ;
			}
		y+=this._charSize.height;
		this._graphics.drawLine(x,y,x+lineWidth,y,this.underlineColor || this.color,1);
	}

	/**
	*<p>排版文本。</p>
	*<p>进行宽高计算，渲染、重绘文本。</p>
	*/
	__proto.typeset=function(){
		this._isChanged=false;
		if (!this._text){
			this._clipPoint=null;
			this._textWidth=this._textHeight=0;
			this.graphics.clear(true);
			return;
		}
		if (Render.isConchApp){
			var ctxFont=""+this._getCSSStyle().font;
			var style=this._getCSSStyle();
			if (style.stroke){
				if (this._getCSSStyle().strokeColor){
					ctxFont+=" "+1+" "+this._getCSSStyle().strokeColor;
				}
			}
			Browser.context.font=ctxFont;
			if (Render.isConchNode){
				Browser.context.direction=this.direction;
				this.graphics.setDirection && this.graphics.setDirection(this.direction);
			}
		}
		else {
			Browser.context.font=this._getCSSStyle().font;
		}
		this._lines.length=0;
		this._lineWidths.length=0;
		if (this._isPassWordMode()){
			this.parseLines(this._getPassWordTxt(this._text));
		}else
		this.parseLines(this._text);
		this.evalTextSize();
		if (this.checkEnabledViewportOrNot())
			this._clipPoint || (this._clipPoint=new Point(0,0));
		else
		this._clipPoint=null;
		var lineCount=this._lines.length;
		if (this.overflow !=Text.VISIBLE){
			var func=this.overflow==Text.HIDDEN ? Math.floor :Math.ceil;
			lineCount=Math.min(lineCount,func((this.height-this.padding[0]-this.padding[2])/ (this.leading+this._charSize.height)));
		};
		var startLine=this.scrollY / (this._charSize.height+this.leading)| 0;
		this.renderText(startLine,lineCount);
		this.repaint();
	}

	__proto.evalTextSize=function(){
		var nw=NaN,nh=NaN;
		nw=Math.max.apply(this,this._lineWidths);
		if (this._currBitmapFont)
			nh=this._lines.length *(this._currBitmapFont.getMaxHeight()+this.leading)+this.padding[0]+this.padding[2];
		else
		nh=this._lines.length *(this._charSize.height+this.leading)+this.padding[0]+this.padding[2];
		if (nw !=this._textWidth || nh !=this._textHeight){
			this._textWidth=nw;
			this._textHeight=nh;
			if (!this._width || !this._height)
				this.conchModel && this.conchModel.size(this._width || this._textWidth,this._height || this._textHeight);
		}
	}

	__proto.checkEnabledViewportOrNot=function(){
		return this.overflow==Text.SCROLL && ((this._width > 0 && this._textWidth > this._width)|| (this._height > 0 && this._textHeight > this._height));
	}

	/**
	*<p>快速更改显示文本。不进行排版计算，效率较高。</p>
	*<p>如果只更改文字内容，不更改文字样式，建议使用此接口，能提高效率。</p>
	*@param text 文本内容。
	*/
	__proto.changeText=function(text){
		if (this._text!==text){
			this.lang(text+"");
			if (this._graphics && this._graphics.replaceText(this._text)){
				}else {
				this.typeset();
			}
		}
	}

	/**
	*@private
	*分析文本换行。
	*/
	__proto.parseLines=function(text){
		var needWordWrapOrTruncate=this.wordWrap || this.overflow==Text.HIDDEN;
		if (needWordWrapOrTruncate){
			var wordWrapWidth=this.getWordWrapWidth();
		}
		if (this._currBitmapFont){
			this._charSize.width=this._currBitmapFont.getMaxWidth();
			this._charSize.height=this._currBitmapFont.getMaxHeight();
			}else {
			var measureResult=Browser.context.measureText(Text._testWord);
			if (Render.isConchApp && measureResult.width===0 && measureResult.height===0){
				measureResult=Browser.context.measureText('W');
			}
			this._charSize.width=measureResult.width;
			this._charSize.height=(measureResult.height || this.fontSize);
		};
		var lines=text.replace(/\r\n/g,"\n").split("\n");
		for (var i=0,n=lines.length;i < n;i++){
			var line=lines[i];
			if (needWordWrapOrTruncate)
				this.parseLine(line,wordWrapWidth);
			else {
				this._lineWidths.push(this.getTextWidth(line));
				this._lines.push(line);
			}
		}
	}

	/**
	*@private
	*解析行文本。
	*@param line 某行的文本。
	*@param wordWrapWidth 文本的显示宽度。
	*/
	__proto.parseLine=function(line,wordWrapWidth){
		var ctx=Browser.context;
		var lines=this._lines;
		var maybeIndex=0;
		var execResult;
		var charsWidth=NaN;
		var wordWidth=NaN;
		var startIndex=0;
		charsWidth=this.getTextWidth(line);
		if (charsWidth <=wordWrapWidth){
			lines.push(line);
			this._lineWidths.push(charsWidth);
			return;
		}
		charsWidth=this._charSize.width;
		maybeIndex=Math.floor(wordWrapWidth / charsWidth);
		(maybeIndex==0)&& (maybeIndex=1);
		charsWidth=this.getTextWidth(line.substring(0,maybeIndex));
		wordWidth=charsWidth;
		for (var j=maybeIndex,m=line.length;j < m;j++){
			charsWidth=this.getTextWidth(line.charAt(j));
			wordWidth+=charsWidth;
			if (wordWidth > wordWrapWidth){
				if (this.wordWrap){
					var newLine=line.substring(startIndex,j);
					if (newLine.charCodeAt(newLine.length-1)< 255){
						execResult=/(?:\w|-)+$/.exec(newLine);
						if (execResult){
							j=execResult.index+startIndex;
							if (execResult.index==0)
								j+=newLine.length;
							else
							newLine=line.substring(startIndex,j);
						}
					}else
					if (Text.RightToLeft){
						execResult=/([\u0600-\u06FF])+$/.exec(newLine);
						if(execResult){
							j=execResult.index+startIndex;
							if (execResult.index==0)
								j+=newLine.length;
							else
							newLine=line.substring(startIndex,j);
						}
					}
					lines.push(newLine);
					this._lineWidths.push(wordWidth-charsWidth);
					startIndex=j;
					if (j+maybeIndex < m){
						j+=maybeIndex;
						charsWidth=this.getTextWidth(line.substring(startIndex,j));
						wordWidth=charsWidth;
						j--;
						}else {
						lines.push(line.substring(startIndex,m));
						this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
						startIndex=-1;
						break ;
					}
					}else if (this.overflow==Text.HIDDEN){
					lines.push(line.substring(0,j));
					this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
					return;
				}
			}
		}
		if (this.wordWrap && startIndex !=-1){
			lines.push(line.substring(startIndex,m));
			this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
		}
	}

	__proto.getTextWidth=function(text){
		if (this._currBitmapFont)
			return this._currBitmapFont.getTextWidth(text);
		else
		return Browser.context.measureText(text).width;
	}

	/**
	*获取换行所需的宽度。
	*/
	__proto.getWordWrapWidth=function(){
		var p=this.padding;
		var w=NaN;
		if (this._currBitmapFont && this._currBitmapFont.autoScaleSize)
			w=this._width *(this._currBitmapFont.fontSize / this.fontSize);
		else
		w=this._width;
		if (w <=0){
			w=this.wordWrap ? 100 :Browser.width;
		}
		w <=0 && (w=100);
		return w-p[3]-p[1];
	}

	/**
	*返回字符在本类实例的父坐标系下的坐标。
	*@param charIndex 索引位置。
	*@param out （可选）输出的Point引用。
	*@return Point 字符在本类实例的父坐标系下的坐标。如果out参数不为空，则将结果赋值给指定的Point对象，否则创建一个新的Point对象返回。建议使用Point.TEMP作为out参数，可以省去Point对象创建和垃圾回收的开销，尤其是在需要频繁执行的逻辑中，比如帧循环和MOUSE_MOVE事件回调函数里面。
	*/
	__proto.getCharPoint=function(charIndex,out){
		this._isChanged && Laya.timer.runCallLater(this,this.typeset);
		var len=0,lines=this._lines,startIndex=0;
		for (var i=0,n=lines.length;i < n;i++){
			len+=lines[i].length;
			if (charIndex < len){
				var line=i;
				break ;
			}
			startIndex=len;
		};
		var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
		Browser.context.font=ctxFont;
		if (Render.isConchNode){
			Browser.context.direction=this.direction;
			this.graphics.setDirection && this.graphics.setDirection(this.direction);
		};
		var width=this.getTextWidth(this._text.substring(startIndex,charIndex));
		var point=out || new Point();
		return point.setTo(this._startX+width-(this._clipPoint ? this._clipPoint.x :0),this._startY+line *(this._charSize.height+this.leading)-(this._clipPoint ? this._clipPoint.y :0));
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',function(){
		if (this._width)
			return this._width;
		return this.textWidth+this.padding[1]+this.padding[3];
		},function(value){
		if (value !=this._width){
			Laya.superSet(Sprite,this,'width',value);
			this.isChanged=true;
		}
	});

	/**
	*表示文本的宽度，以像素为单位。
	*/
	__getset(0,__proto,'textWidth',function(){
		this._isChanged && Laya.timer.runCallLater(this,this.typeset);
		return this._textWidth;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		return this.textHeight;
		},function(value){
		if (value !=this._height){
			Laya.superSet(Sprite,this,'height',value);
			this.isChanged=true;
		}
	});

	/**
	*表示文本的高度，以像素为单位。
	*/
	__getset(0,__proto,'textHeight',function(){
		this._isChanged && Laya.timer.runCallLater(this,this.typeset);
		return this._textHeight;
	});

	/**
	*<p>边距信息。</p>
	*<p>数据格式：[上边距，右边距，下边距，左边距]（边距以像素为单位）。</p>
	*/
	__getset(0,__proto,'padding',function(){
		return this._getCSSStyle().padding;
		},function(value){
		this._getCSSStyle().padding=value;
		this.isChanged=true;
	});

	/**
	*<p>指定文本是否为粗体字。</p>
	*<p>默认值为 false，这意味着不使用粗体字。如果值为 true，则文本为粗体字。</p>
	*/
	__getset(0,__proto,'bold',function(){
		return this._getCSSStyle().bold;
		},function(value){
		this._getCSSStyle().bold=value;
		this.isChanged=true;
	});

	/**当前文本的内容字符串。*/
	__getset(0,__proto,'text',function(){
		return this._text || "";
		},function(value){
		if (this._text!==value){
			this.lang(value+"");
			this.isChanged=true;
			this.event(/*laya.events.Event.CHANGE*/"change");
		}
	});

	/**
	*<p>表示文本的颜色值。可以通过 <code>Text.defaultColor</code> 设置默认颜色。</p>
	*<p>默认值为黑色。</p>
	*/
	__getset(0,__proto,'color',function(){
		return this._getCSSStyle().color;
		},function(value){
		if (this._getCSSStyle().color !=value){
			this._getCSSStyle().color=value;
			if (!this._isChanged && this._graphics){
				this._graphics.replaceTextColor(this.color)
				}else {
				this.isChanged=true;
			}
		}
	});

	/**
	*<p>文本的字体名称，以字符串形式表示。</p>
	*<p>默认值为："Arial"，可以通过Font.defaultFont设置默认字体。</p>
	*<p>如果运行时系统找不到设定的字体，则用系统默认的字体渲染文字，从而导致显示异常。(通常电脑上显示正常，在一些移动端因缺少设置的字体而显示异常)。</p>
	*@see laya.display.css.Font#defaultFamily
	*/
	__getset(0,__proto,'font',function(){
		return this._getCSSStyle().fontFamily;
		},function(value){
		if (this._currBitmapFont){
			this._currBitmapFont=null;
			this.scale(1,1);
		}
		if (Text._bitmapFonts && Text._bitmapFonts[value]){
			this._currBitmapFont=Text._bitmapFonts[value];
		}
		this._getCSSStyle().fontFamily=value;
		this.isChanged=true;
	});

	/**
	*<p>指定文本的字体大小（以像素为单位）。</p>
	*<p>默认为20像素，可以通过 <code>Text.defaultSize</code> 设置默认大小。</p>
	*/
	__getset(0,__proto,'fontSize',function(){
		return this._getCSSStyle().fontSize;
		},function(value){
		this._getCSSStyle().fontSize=value;
		this.isChanged=true;
	});

	/**
	*<p>表示使用此文本格式的文本是否为斜体。</p>
	*<p>默认值为 false，这意味着不使用斜体。如果值为 true，则文本为斜体。</p>
	*/
	__getset(0,__proto,'italic',function(){
		return this._getCSSStyle().italic;
		},function(value){
		this._getCSSStyle().italic=value;
		this.isChanged=true;
	});

	/**
	*<p>表示文本的水平显示方式。</p>
	*<p><b>取值：</b>
	*<li>"left"： 居左对齐显示。</li>
	*<li>"center"： 居中对齐显示。</li>
	*<li>"right"： 居右对齐显示。</li>
	*</p>
	*/
	__getset(0,__proto,'align',function(){
		return this._getCSSStyle().align;
		},function(value){
		this._getCSSStyle().align=value;
		this.isChanged=true;
	});

	/**
	*<p>表示文本的垂直显示方式。</p>
	*<p><b>取值：</b>
	*<li>"top"： 居顶部对齐显示。</li>
	*<li>"middle"： 居中对齐显示。</li>
	*<li>"bottom"： 居底部对齐显示。</li>
	*</p>
	*/
	__getset(0,__proto,'valign',function(){
		return this._getCSSStyle().valign;
		},function(value){
		this._getCSSStyle().valign=value;
		this.isChanged=true;
	});

	/**
	*<p>表示文本是否自动换行，默认为false。</p>
	*<p>若值为true，则自动换行；否则不自动换行。</p>
	*/
	__getset(0,__proto,'wordWrap',function(){
		return this._getCSSStyle().wordWrap;
		},function(value){
		this._getCSSStyle().wordWrap=value;
		this.isChanged=true;
	});

	/**
	*垂直行间距（以像素为单位）。
	*/
	__getset(0,__proto,'leading',function(){
		return this._getCSSStyle().leading;
		},function(value){
		this._getCSSStyle().leading=value;
		this.isChanged=true;
	});

	/**
	*文本背景颜色，以字符串表示。
	*/
	__getset(0,__proto,'bgColor',function(){
		return this._getCSSStyle().backgroundColor;
		},function(value){
		this._getCSSStyle().backgroundColor=value;
		this.isChanged=true;
	});

	/**
	*文本边框背景颜色，以字符串表示。
	*/
	__getset(0,__proto,'borderColor',function(){
		return this._getCSSStyle().borderColor;
		},function(value){
		this._getCSSStyle().borderColor=value;
		this.isChanged=true;
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*<p>默认值0，表示不描边。</p>
	*/
	__getset(0,__proto,'stroke',function(){
		return this._getCSSStyle().stroke;
		},function(value){
		this._getCSSStyle().stroke=value;
		this.isChanged=true;
	});

	/**
	*<p>描边颜色，以字符串表示。</p>
	*<p>默认值为 "#000000"（黑色）;</p>
	*/
	__getset(0,__proto,'strokeColor',function(){
		return this._getCSSStyle().strokeColor;
		},function(value){
		this._getCSSStyle().strokeColor=value;
		this.isChanged=true;
	});

	/**
	*
	*
	*/
	/**
	*
	*
	*/
	__getset(0,__proto,'direction',function(){
		return this._getCSSStyle().direction;
		},function(value){
		this._getCSSStyle().direction=value;
		this.isChanged=true;
	});

	/**
	*一个布尔值，表示文本的属性是否有改变。若为true表示有改变。
	*/
	__getset(0,__proto,'isChanged',null,function(value){
		if (this._isChanged!==value){
			this._isChanged=value;
			value && Laya.timer.callLater(this,this.typeset);
		}
	});

	/**
	*<p>设置横向滚动量。</p>
	*<p>即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。</p>
	*/
	/**
	*获取横向滚动量。
	*/
	__getset(0,__proto,'scrollX',function(){
		if (!this._clipPoint)
			return 0;
		return this._clipPoint.x;
		},function(value){
		if (this.overflow !=Text.SCROLL || (this.textWidth < this._width || !this._clipPoint))
			return;
		value=value < this.padding[3] ? this.padding[3] :value;
		var maxScrollX=this._textWidth-this._width;
		value=value > maxScrollX ? maxScrollX :value;
		var visibleLineCount=this._height / (this._charSize.height+this.leading)| 0+1;
		this._clipPoint.x=value;
		this.renderText(this._lastVisibleLineIndex,visibleLineCount);
	});

	/**
	*设置纵向滚动量（px)。即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。
	*/
	/**
	*获取纵向滚动量。
	*/
	__getset(0,__proto,'scrollY',function(){
		if (!this._clipPoint)
			return 0;
		return this._clipPoint.y;
		},function(value){
		if (this.overflow !=Text.SCROLL || (this.textHeight < this._height || !this._clipPoint))
			return;
		value=value < this.padding[0] ? this.padding[0] :value;
		var maxScrollY=this._textHeight-this._height;
		value=value > maxScrollY ? maxScrollY :value;
		var startLine=value / (this._charSize.height+this.leading)| 0;
		this._lastVisibleLineIndex=startLine;
		var visibleLineCount=(this._height / (this._charSize.height+this.leading)| 0)+1;
		this._clipPoint.y=value;
		this.renderText(startLine,visibleLineCount);
	});

	/**
	*获取横向可滚动最大值。
	*/
	__getset(0,__proto,'maxScrollX',function(){
		return (this.textWidth < this._width)? 0 :this._textWidth-this._width;
	});

	/**
	*获取纵向可滚动最大值。
	*/
	__getset(0,__proto,'maxScrollY',function(){
		return (this.textHeight < this._height)? 0 :this._textHeight-this._height;
	});

	__getset(0,__proto,'lines',function(){
		if (this._isChanged)
			this.typeset();
		return this._lines;
	});

	__getset(0,__proto,'underlineColor',function(){
		return this._underlineColor;
		},function(value){
		this._underlineColor=value;
		this._isChanged=true;
		this.typeset();
	});

	Text.registerBitmapFont=function(name,bitmapFont){
		Text._bitmapFonts || (Text._bitmapFonts={});
		Text._bitmapFonts[name]=bitmapFont;
	}

	Text.unregisterBitmapFont=function(name,destroy){
		(destroy===void 0)&& (destroy=true);
		if (Text._bitmapFonts && Text._bitmapFonts[name]){
			var tBitmapFont=Text._bitmapFonts[name];
			if (destroy){
				tBitmapFont.destroy();
			}
			delete Text._bitmapFonts[name];
		}
	}

	Text.setTextRightToLeft=function(){
		var style;
		style=Browser.canvas.source.style;
		style.display="none";
		style.position="absolute";
		style.direction="rtl";
		Render._mainCanvas.source.style.direction="rtl";
		laya.display.Text.RightToLeft=true;
		Browser.document.body.appendChild(Browser.canvas.source);
	}

	Text.supportFont=function(font){
		Browser.context.font="10px sans-serif";
		var defaultFontWidth=Browser.context.measureText("abcji").width;
		Browser.context.font="10px "+font;
		var customFontWidth=Browser.context.measureText("abcji").width;
		console.log(defaultFontWidth,customFontWidth);
		if (defaultFontWidth===customFontWidth)return false;
		else return true;
	}

	Text._testWord="游";
	Text.langPacks=null;
	Text.VISIBLE="visible";
	Text.SCROLL="scroll";
	Text.HIDDEN="hidden";
	Text.CharacterCache=true;
	Text.RightToLeft=false;
	Text._bitmapFonts=null;
	__static(Text,
	['_fontFamilyMap',function(){return this._fontFamilyMap={"报隶" :"报隶-简","黑体" :"黑体-简","楷体" :"楷体-简","兰亭黑" :"兰亭黑-简","隶变" :"隶变-简","凌慧体" :"凌慧体-简","翩翩体" :"翩翩体-简","苹方" :"苹方-简","手札体" :"手札体-简","宋体" :"宋体-简","娃娃体" :"娃娃体-简","魏碑" :"魏碑-简","行楷" :"行楷-简","雅痞" :"雅痞-简","圆体" :"圆体-简"};}
	]);
	return Text;
})(Sprite)


/**
*<p> <code>Stage</code> 是舞台类，显示列表的根节点，所有显示对象都在舞台上显示。通过 Laya.stage 单例访问。</p>
*<p>Stage提供几种适配模式，不同的适配模式会产生不同的画布大小，画布越大，渲染压力越大，所以要选择合适的适配方案。</p>
*<p>Stage提供不同的帧率模式，帧率越高，渲染压力越大，越费电，合理使用帧率甚至动态更改帧率有利于改进手机耗电。</p>
*/
//class laya.display.Stage extends laya.display.Sprite
var Stage=(function(_super){
	function Stage(){
		/**当前焦点对象，此对象会影响当前键盘事件的派发主体。*/
		this.focus=null;
		/**设计宽度（初始化时设置的宽度Laya.init(width,height)）*/
		this.designWidth=0;
		/**设计高度（初始化时设置的高度Laya.init(width,height)）*/
		this.designHeight=0;
		/**画布是否发生翻转。*/
		this.canvasRotation=false;
		/**画布的旋转角度。*/
		this.canvasDegree=0;
		/**
		*<p>设置是否渲染，设置为false，可以停止渲染，画面会停留到最后一次渲染上，减少cpu消耗，此设置不影响时钟。</p>
		*<p>比如非激活状态，可以设置renderingEnabled=false以节省消耗。</p>
		**/
		this.renderingEnabled=true;
		/**是否启用屏幕适配，可以适配后，在某个时候关闭屏幕适配，防止某些操作导致的屏幕以外改变*/
		this.screenAdaptationEnabled=true;
		/**@private */
		this._screenMode="none";
		/**@private */
		this._scaleMode="noscale";
		/**@private */
		this._alignV="top";
		/**@private */
		this._alignH="left";
		/**@private */
		this._bgColor="black";
		/**@private */
		this._mouseMoveTime=0;
		/**@private */
		this._renderCount=0;
		/**@private */
		this._frameStartTime=NaN;
		/**@private */
		this._isFocused=false;
		/**@private */
		this._isVisibility=false;
		/**@private 3D场景*/
		this._scenes=null;
		/**@private */
		this._frameRate="fast";
		/**使用物理分辨率作为canvas大小，会改进渲染效果，但是会降低性能*/
		this.useRetinalCanvas=false;
		Stage.__super.call(this);
		this.offset=new Point();
		this._canvasTransform=new Matrix();
		this._previousOrientation=Browser.window.orientation;
		var _$this=this;
		this.transform=Matrix.create();
		this._scenes=[];
		this.mouseEnabled=true;
		this.hitTestPrior=true;
		this.autoSize=false;
		this._displayedInStage=true;
		this._isFocused=true;
		this._isVisibility=true;
		this.useRetinalCanvas=Config.useRetinalCanvas;
		var window=Browser.window;
		var _this=this;
		window.addEventListener("focus",function(){
			_$this._isFocused=true;
			_this.event(/*laya.events.Event.FOCUS*/"focus");
			_this.event(/*laya.events.Event.FOCUS_CHANGE*/"focuschange");
		});
		window.addEventListener("blur",function(){
			_$this._isFocused=false;
			_this.event(/*laya.events.Event.BLUR*/"blur");
			_this.event(/*laya.events.Event.FOCUS_CHANGE*/"focuschange");
			if (_this._isInputting())Input["inputElement"].target.focus=false;
		});
		var hidden="hidden",state="visibilityState",visibilityChange="visibilitychange";
		var document=window.document;
		if (typeof document.hidden!=="undefined"){
			visibilityChange="visibilitychange";
			state="visibilityState";
			}else if (typeof document.mozHidden!=="undefined"){
			visibilityChange="mozvisibilitychange";
			state="mozVisibilityState";
			}else if (typeof document.msHidden!=="undefined"){
			visibilityChange="msvisibilitychange";
			state="msVisibilityState";
			}else if (typeof document.webkitHidden!=="undefined"){
			visibilityChange="webkitvisibilitychange";
			state="webkitVisibilityState";
		}
		window.document.addEventListener(visibilityChange,visibleChangeFun);
		function visibleChangeFun (){
			if (Browser.document[state]=="hidden"){
				_this._setStageVisible(false);
				}else {
				_this._setStageVisible(true);
			}
		}
		window.document.addEventListener("qbrowserVisibilityChange",qbroserVisibleChangeFun);
		function qbroserVisibleChangeFun (e){
			_this._setStageVisible(!e.hidden);
		}
		window.addEventListener("resize",function(){
			var orientation=Browser.window.orientation;
			if (orientation !=null && orientation !=_$this._previousOrientation && _this._isInputting()){
				Input["inputElement"].target.focus=false;
			}
			_$this._previousOrientation=orientation;
			if (_this._isInputting())return;
			_this._resetCanvas();
		});
		window.addEventListener("orientationchange",function(e){
			_this._resetCanvas();
		});
		this.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onmouseMove);
		if (Browser.onMobile)this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onmouseMove);
	}

	__class(Stage,'laya.display.Stage',_super);
	var __proto=Stage.prototype;
	__proto._setStageVisible=function(value){
		if (this._isVisibility==value)return;
		this._isVisibility=value;
		if (!this._isVisibility)if (this._isInputting())Input["inputElement"].target.focus=false;
		this.event(/*laya.events.Event.VISIBILITY_CHANGE*/"visibilitychange");
	}

	/**
	*@private
	*在移动端输入时，输入法弹出期间不进行画布尺寸重置。
	*/
	__proto._isInputting=function(){
		return (Browser.onMobile && Input.isInputting);
	}

	/**@private */
	__proto._changeCanvasSize=function(){
		this.setScreenSize(Browser.clientWidth *Browser.pixelRatio,Browser.clientHeight *Browser.pixelRatio);
	}

	/**@private */
	__proto._resetCanvas=function(){
		if (!this.screenAdaptationEnabled)return;
		var canvas=Render._mainCanvas;
		var canvasStyle=canvas.source.style;
		canvas.size(1,1);
		Laya.timer.once(100,this,this._changeCanvasSize);
	}

	/**
	*设置屏幕大小，场景会根据屏幕大小进行适配。可以动态调用此方法，来更改游戏显示的大小。
	*@param screenWidth 屏幕宽度。
	*@param screenHeight 屏幕高度。
	*/
	__proto.setScreenSize=function(screenWidth,screenHeight){
		var rotation=false;
		if (this._screenMode!=="none"){
			var screenType=screenWidth / screenHeight < 1 ? "vertical" :"horizontal";
			rotation=screenType!==this._screenMode;
			if (rotation){
				var temp=screenHeight;
				screenHeight=screenWidth;
				screenWidth=temp;
			}
		}
		this.canvasRotation=rotation;
		var canvas=Render._mainCanvas;
		var canvasStyle=canvas.source.style;
		var mat=this._canvasTransform.identity();
		var scaleMode=this._scaleMode;
		var scaleX=screenWidth / this.designWidth;
		var scaleY=screenHeight / this.designHeight;
		var canvasWidth=Config.useRetinalCanvas?screenWidth:this.designWidth;
		var canvasHeight=Config.useRetinalCanvas?screenHeight:this.designHeight;
		var realWidth=screenWidth;
		var realHeight=screenHeight;
		var pixelRatio=Browser.pixelRatio;
		this._width=this.designWidth;
		this._height=this.designHeight;
		switch (scaleMode){
			case "noscale":
				scaleX=scaleY=1;
				realWidth=this.designWidth;
				realHeight=this.designHeight;
				break ;
			case "showall":
				scaleX=scaleY=Math.min(scaleX,scaleY);
				canvasWidth=realWidth=Math.round(this.designWidth *scaleX);
				canvasHeight=realHeight=Math.round(this.designHeight *scaleY);
				break ;
			case "noborder":
				scaleX=scaleY=Math.max(scaleX,scaleY);
				realWidth=Math.round(this.designWidth *scaleX);
				realHeight=Math.round(this.designHeight *scaleY);
				break ;
			case "full":
				scaleX=scaleY=1;
				this._width=canvasWidth=screenWidth;
				this._height=canvasHeight=screenHeight;
				break ;
			case "fixedwidth":
				scaleY=scaleX;
				this._height=canvasHeight=Math.round(screenHeight / scaleX);
				break ;
			case "fixedheight":
				scaleX=scaleY;
				this._width=canvasWidth=Math.round(screenWidth / scaleY);
				break ;
			case "fixedauto":
				if ((screenWidth / screenHeight)< (this.designWidth / this.designHeight)){
					scaleY=scaleX;
					this._height=canvasHeight=Math.round(screenHeight / scaleX);
					}else {
					scaleX=scaleY;
					this._width=canvasWidth=Math.round(screenWidth / scaleY);
				}
				break ;
			}
		if (this.conchModel)this.conchModel.size(this._width,this._height);
		if (Config.useRetinalCanvas){
			realWidth=canvasWidth=screenWidth;
			realHeight=canvasHeight=screenHeight;
		}
		scaleX *=this.scaleX;
		scaleY *=this.scaleY;
		if (scaleX===1 && scaleY===1){
			this.transform.identity();
			}else {
			this.transform.a=this._formatData(scaleX / (realWidth / canvasWidth));
			this.transform.d=this._formatData(scaleY / (realHeight / canvasHeight));
			this.conchModel && this.conchModel.scale(this.transform.a,this.transform.d);
		}
		canvas.size(canvasWidth,canvasHeight);
		RunDriver.changeWebGLSize(canvasWidth,canvasHeight);
		mat.scale(realWidth / canvasWidth / pixelRatio,realHeight / canvasHeight / pixelRatio);
		if (this._alignH==="left")this.offset.x=0;
		else if (this._alignH==="right")this.offset.x=(screenWidth-realWidth)/pixelRatio;
		else this.offset.x=(screenWidth-realWidth)*0.5 / pixelRatio;
		if (this._alignV==="top")this.offset.y=0;
		else if (this._alignV==="bottom")this.offset.y=(screenHeight-realHeight)/pixelRatio;
		else this.offset.y=(screenHeight-realHeight)*0.5 / pixelRatio;
		this.offset.x=Math.round(this.offset.x);
		this.offset.y=Math.round(this.offset.y);
		mat.translate(this.offset.x,this.offset.y);
		this.canvasDegree=0;
		if (rotation){
			if (this._screenMode==="horizontal"){
				mat.rotate(Math.PI / 2);
				mat.translate(screenHeight / pixelRatio,0);
				this.canvasDegree=90;
				}else {
				mat.rotate(-Math.PI / 2);
				mat.translate(0,screenWidth / pixelRatio);
				this.canvasDegree=-90;
			}
		}
		mat.a=this._formatData(mat.a);
		mat.d=this._formatData(mat.d);
		mat.tx=this._formatData(mat.tx);
		mat.ty=this._formatData(mat.ty);
		canvasStyle.transformOrigin=canvasStyle.webkitTransformOrigin=canvasStyle.msTransformOrigin=canvasStyle.mozTransformOrigin=canvasStyle.oTransformOrigin="0px 0px 0px";
		canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="matrix("+mat.toString()+")";
		canvasStyle.width=canvasWidth;
		canvasStyle.height=canvasHeight;
		mat.translate(parseInt(canvasStyle.left)|| 0,parseInt(canvasStyle.top)|| 0);
		this.visible=true;
		this._repaint=1;
		this.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**@private */
	__proto._formatData=function(value){
		if (Math.abs(value)< 0.000001)return 0;
		if (Math.abs(1-value)< 0.001)return value > 0 ? 1 :-1;
		return value;
	}

	/**@inheritDoc */
	__proto.getMousePoint=function(){
		return Point.TEMP.setTo(this.mouseX,this.mouseY);
	}

	/**@inheritDoc */
	__proto.repaint=function(){
		this._repaint=1;
	}

	/**@inheritDoc */
	__proto.parentRepaint=function(){}
	/**@private */
	__proto._loop=function(){
		this.render(Render.context,0,0);
		return true;
	}

	/**@private */
	__proto._onmouseMove=function(e){
		this._mouseMoveTime=Browser.now();
	}

	/**
	*<p>获得距当前帧开始后，过了多少时间，单位为毫秒。</p>
	*<p>可以用来判断函数内时间消耗，通过合理控制每帧函数处理消耗时长，避免一帧做事情太多，对复杂计算分帧处理，能有效降低帧率波动。</p>
	*/
	__proto.getTimeFromFrameStart=function(){
		return Browser.now()-this._frameStartTime;
	}

	/**@inheritDoc */
	__proto.render=function(context,x,y){
		if (this._frameRate==="sleep" && !Render.isConchApp){
			var now=Browser.now();
			if (now-this._frameStartTime >=1000)this._frameStartTime=now;
			else return;
		}
		this._renderCount++;
		Render.isFlash && this.repaint();
		if (!this._style.visible){
			if (this._renderCount % 5===0){
				Stat.loopCount++;
				MouseManager.instance.runEvent();
				Laya.timer._update();
			}
			return;
		}
		this._frameStartTime=Browser.now();
		var frameMode=this._frameRate==="mouse" ? (((this._frameStartTime-this._mouseMoveTime)< 2000)? "fast" :"slow"):this._frameRate;
		var isFastMode=(frameMode!=="slow");
		var isDoubleLoop=(this._renderCount % 2===0);
		Stat.renderSlow=!isFastMode;
		if (isFastMode || isDoubleLoop || Render.isConchApp){
			Stat.loopCount++;
			MouseManager.instance.runEvent();
			Laya.timer._update();
			RunDriver.update3DLoop();
			var scene;
			var i=0,n=0;
			if (Render.isConchNode){
				for (i=0,n=this._scenes.length;i < n;i++){
					scene=this._scenes[i];
					(scene)&& (scene._updateSceneConch());
				}
				}else {
				for (i=0,n=this._scenes.length;i < n;i++){
					scene=this._scenes[i];
					(scene)&& (scene._updateScene());
				}
			}
			if (Render.isConchNode){
				var customList=Sprite["CustomList"];
				for (i=0,n=customList.length;i < n;i++){
					var customItem=customList[i];
					customItem.customRender(customItem.customContext,0,0);
				}
				return;
			}
		}
		if (Render.isConchNode)return;
		if (this.renderingEnabled && (isFastMode || !isDoubleLoop || Render.isConchWebGL)){
			if (Render.isWebGL){
				context.clear();
				_super.prototype.render.call(this,context,x,y);
				Stat._show&& Stat._sp && Stat._sp.render(context,x,y);
				RunDriver.clear(this._bgColor);
				RunDriver.beginFlush();
				context.flush();
				RunDriver.endFinish();
				VectorGraphManager.instance && VectorGraphManager.getInstance().endDispose();
				}else {
				RunDriver.clear(this._bgColor);
				_super.prototype.render.call(this,context,x,y);
				Stat._show&& Stat._sp && Stat._sp.render(context,x,y);
			}
		}
	}

	/**@private */
	__proto._requestFullscreen=function(){
		var element=Browser.document.documentElement;
		if (element.requestFullscreen){
			element.requestFullscreen();
			}else if (element.mozRequestFullScreen){
			element.mozRequestFullScreen();
			}else if (element.webkitRequestFullscreen){
			element.webkitRequestFullscreen();
			}else if (element.msRequestFullscreen){
			element.msRequestFullscreen();
		}
	}

	/**@private */
	__proto._fullScreenChanged=function(){
		Laya.stage.event(/*laya.events.Event.FULL_SCREEN_CHANGE*/"fullscreenchange");
	}

	/**退出全屏模式*/
	__proto.exitFullscreen=function(){
		var document=Browser.document;
		if (document.exitFullscreen){
			document.exitFullscreen();
			}else if (document.mozCancelFullScreen){
			document.mozCancelFullScreen();
			}else if (document.webkitExitFullscreen){
			document.webkitExitFullscreen();
		}
	}

	/**当前视窗由缩放模式导致的 X 轴缩放系数。*/
	__getset(0,__proto,'clientScaleX',function(){
		return this._transform ? this._transform.getScaleX():1;
	});

	//[Deprecated]
	__getset(0,__proto,'desginHeight',function(){
		console.debug("desginHeight已经弃用，请使用designHeight代替");
		return this.designHeight;
	});

	/**帧率类型，支持三种模式：fast-60帧(默认)，slow-30帧，mouse-30帧（鼠标活动后会自动加速到60，鼠标不动2秒后降低为30帧，以节省消耗），sleep-1帧。*/
	__getset(0,__proto,'frameRate',function(){
		return this._frameRate;
		},function(value){
		this._frameRate=value;
		if (Render.isConchApp){
			switch (this._frameRate){
				case "slow":
					Browser.window.conch && Browser.window.conchConfig.setSlowFrame && Browser.window.conchConfig.setSlowFrame(true);
					break ;
				case "fast":
					Browser.window.conch && Browser.window.conchConfig.setSlowFrame && Browser.window.conchConfig.setSlowFrame(false);
					break ;
				case "mouse":
					Browser.window.conch && Browser.window.conchConfig.setMouseFrame && Browser.window.conchConfig.setMouseFrame(2000);
					break ;
				case "sleep":
					Browser.window.conch && Browser.window.conchConfig.setLimitFPS && Browser.window.conchConfig.setLimitFPS(1);
					break ;
				default :
					throw new Error("Stage:frameRate invalid.");
					break ;
				}
		}
	});

	/**当前视窗由缩放模式导致的 Y 轴缩放系数。*/
	__getset(0,__proto,'clientScaleY',function(){
		return this._transform ? this._transform.getScaleY():1;
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		this.designWidth=value;
		Laya.superSet(Sprite,this,'width',value);
		Laya.timer.callLater(this,this._changeCanvasSize);
	});

	/**
	*<p>水平对齐方式。默认值为"left"。</p>
	*<p><ul>取值范围：
	*<li>"left" ：居左对齐；</li>
	*<li>"center" ：居中对齐；</li>
	*<li>"right" ：居右对齐；</li>
	*</ul></p>
	*/
	__getset(0,__proto,'alignH',function(){
		return this._alignH;
		},function(value){
		this._alignH=value;
		Laya.timer.callLater(this,this._changeCanvasSize);
	});

	/**
	*舞台是否获得焦点。
	*/
	__getset(0,__proto,'isFocused',function(){
		return this._isFocused;
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		this.designHeight=value;
		Laya.superSet(Sprite,this,'height',value);
		Laya.timer.callLater(this,this._changeCanvasSize);
	});

	__getset(0,__proto,'transform',function(){
		if (this._tfChanged)this._adjustTransform();
		return this._transform=this._transform|| Matrix.create();
	},_super.prototype._$set_transform);

	/**
	*舞台是否处于可见状态(是否进入后台)。
	*/
	__getset(0,__proto,'isVisibility',function(){
		return this._isVisibility;
	});

	//[Deprecated]
	__getset(0,__proto,'desginWidth',function(){
		console.debug("desginWidth已经弃用，请使用designWidth代替");
		return this.designWidth;
	});

	/**
	*<p>缩放模式。默认值为 "noscale"。</p>
	*<p><ul>取值范围：
	*<li>"noscale" ：不缩放；</li>
	*<li>"exactfit" ：全屏不等比缩放；</li>
	*<li>"showall" ：最小比例缩放；</li>
	*<li>"noborder" ：最大比例缩放；</li>
	*<li>"full" ：不缩放，stage的宽高等于屏幕宽高；</li>
	*<li>"fixedwidth" ：宽度不变，高度根据屏幕比缩放；</li>
	*<li>"fixedheight" ：高度不变，宽度根据屏幕比缩放；</li>
	*<li>"fixedauto" ：根据宽高比，自动选择使用fixedwidth或fixedheight；</li>
	*</ul></p>
	*/
	__getset(0,__proto,'scaleMode',function(){
		return this._scaleMode;
		},function(value){
		this._scaleMode=value;
		Laya.timer.callLater(this,this._changeCanvasSize);
	});

	/**
	*<p>垂直对齐方式。默认值为"top"。</p>
	*<p><ul>取值范围：
	*<li>"top" ：居顶部对齐；</li>
	*<li>"middle" ：居中对齐；</li>
	*<li>"bottom" ：居底部对齐；</li>
	*</ul></p>
	*/
	__getset(0,__proto,'alignV',function(){
		return this._alignV;
		},function(value){
		this._alignV=value;
		Laya.timer.callLater(this,this._changeCanvasSize);
	});

	/**舞台的背景颜色，默认为黑色，null为透明。*/
	__getset(0,__proto,'bgColor',function(){
		return this._bgColor;
		},function(value){
		this._bgColor=value;
		this.conchModel && this.conchModel.bgColor(value);
		if (Render.isWebGL){
			if (value){
				Stage._wgColor=Color.create(value)._color;
				}else {
				Stage._wgColor=null;
			}
		}
		if (Browser.onLimixiu){
			Stage._wgColor=Color.create(value)._color;
		}else
		if (value){
			Render.canvas.style.background=value;
			}else {
			Render.canvas.style.background="none";
		}
	});

	/**鼠标在 Stage 上的 X 轴坐标。*/
	__getset(0,__proto,'mouseX',function(){
		return Math.round(MouseManager.instance.mouseX / this.clientScaleX);
	});

	/**鼠标在 Stage 上的 Y 轴坐标。*/
	__getset(0,__proto,'mouseY',function(){
		return Math.round(MouseManager.instance.mouseY / this.clientScaleY);
	});

	/**
	*<p>场景布局类型。</p>
	*<p><ul>取值范围：
	*<li>"none" ：不更改屏幕</li>
	*<li>"horizontal" ：自动横屏</li>
	*<li>"vertical" ：自动竖屏</li>
	*</ul></p>
	*/
	__getset(0,__proto,'screenMode',function(){
		return this._screenMode;
		},function(value){
		this._screenMode=value;
	});

	__getset(0,__proto,'visible',_super.prototype._$get_visible,function(value){
		if (this.visible!==value){
			Laya.superSet(Sprite,this,'visible',value);
			var style=Render._mainCanvas.source.style;
			style.visibility=value ? "visible" :"hidden";
		}
	});

	/**
	*<p>是否开启全屏，用户点击后进入全屏。</p>
	*<p>兼容性提示：部分浏览器不允许点击进入全屏，比如Iphone等。</p>
	*/
	__getset(0,__proto,'fullScreenEnabled',null,function(value){
		var document=Browser.document;
		var canvas=Render.canvas;
		if (value){
			canvas.addEventListener('mousedown',this._requestFullscreen);
			canvas.addEventListener('touchstart',this._requestFullscreen);
			document.addEventListener("fullscreenchange",this._fullScreenChanged);
			document.addEventListener("mozfullscreenchange",this._fullScreenChanged);
			document.addEventListener("webkitfullscreenchange",this._fullScreenChanged);
			document.addEventListener("msfullscreenchange",this._fullScreenChanged);
			}else {
			canvas.removeEventListener('mousedown',this._requestFullscreen);
			canvas.removeEventListener('touchstart',this._requestFullscreen);
			document.removeEventListener("fullscreenchange",this._fullScreenChanged);
			document.removeEventListener("mozfullscreenchange",this._fullScreenChanged);
			document.removeEventListener("webkitfullscreenchange",this._fullScreenChanged);
			document.removeEventListener("msfullscreenchange",this._fullScreenChanged);
		}
	});

	Stage.SCALE_NOSCALE="noscale";
	Stage.SCALE_EXACTFIT="exactfit";
	Stage.SCALE_SHOWALL="showall";
	Stage.SCALE_NOBORDER="noborder";
	Stage.SCALE_FULL="full";
	Stage.SCALE_FIXED_WIDTH="fixedwidth";
	Stage.SCALE_FIXED_HEIGHT="fixedheight";
	Stage.SCALE_FIXED_AUTO="fixedauto";
	Stage.ALIGN_LEFT="left";
	Stage.ALIGN_RIGHT="right";
	Stage.ALIGN_CENTER="center";
	Stage.ALIGN_TOP="top";
	Stage.ALIGN_MIDDLE="middle";
	Stage.ALIGN_BOTTOM="bottom";
	Stage.SCREEN_NONE="none";
	Stage.SCREEN_HORIZONTAL="horizontal";
	Stage.SCREEN_VERTICAL="vertical";
	Stage.FRAME_FAST="fast";
	Stage.FRAME_SLOW="slow";
	Stage.FRAME_MOUSE="mouse";
	Stage.FRAME_SLEEP="sleep";
	Stage.FRAME_MOUSE_THREDHOLD=2000;
	__static(Stage,
	['_wgColor',function(){return this._wgColor=[0,0,0,1];}
	]);
	return Stage;
})(Sprite)


/**
*@private
*/
//class laya.media.SoundNode extends laya.display.Sprite
var SoundNode=(function(_super){
	function SoundNode(){
		this.url=null;
		this._channel=null;
		this._tar=null;
		this._playEvents=null;
		this._stopEvents=null;
		SoundNode.__super.call(this);
		this.visible=false;
		this.on(/*laya.events.Event.ADDED*/"added",this,this._onParentChange);
		this.on(/*laya.events.Event.REMOVED*/"removed",this,this._onParentChange);
	}

	__class(SoundNode,'laya.media.SoundNode',_super);
	var __proto=SoundNode.prototype;
	/**@private */
	__proto._onParentChange=function(){
		this.target=this.parent;
	}

	/**
	*播放
	*@param loops 循环次数
	*@param complete 完成回调
	*
	*/
	__proto.play=function(loops,complete){
		(loops===void 0)&& (loops=1);
		if (isNaN(loops)){
			loops=1;
		}
		if (!this.url)return;
		this.stop();
		this._channel=SoundManager.playSound(this.url,loops,complete);
	}

	/**
	*停止播放
	*
	*/
	__proto.stop=function(){
		if (this._channel && !this._channel.isStopped){
			this._channel.stop();
		}
		this._channel=null;
	}

	/**@private */
	__proto._setPlayAction=function(tar,event,action,add){
		(add===void 0)&& (add=true);
		if (!this[action])return;
		if (!tar)return;
		if (add){
			tar.on(event,this,this[action]);
			}else {
			tar.off(event,this,this[action]);
		}
	}

	/**@private */
	__proto._setPlayActions=function(tar,events,action,add){
		(add===void 0)&& (add=true);
		if (!tar)return;
		if (!events)return;
		var eventArr=events.split(",");
		var i=0,len=0;
		len=eventArr.length;
		for (i=0;i < len;i++){
			this._setPlayAction(tar,eventArr[i],action,add);
		}
	}

	/**
	*设置触发播放的事件
	*@param events
	*
	*/
	__getset(0,__proto,'playEvent',null,function(events){
		this._playEvents=events;
		if (!events)return;
		if (this._tar){
			this._setPlayActions(this._tar,events,"play");
		}
	});

	/**
	*设置控制播放的对象
	*@param tar
	*
	*/
	__getset(0,__proto,'target',null,function(tar){
		if (this._tar){
			this._setPlayActions(this._tar,this._playEvents,"play",false);
			this._setPlayActions(this._tar,this._stopEvents,"stop",false);
		}
		this._tar=tar;
		if (this._tar){
			this._setPlayActions(this._tar,this._playEvents,"play",true);
			this._setPlayActions(this._tar,this._stopEvents,"stop",true);
		}
	});

	/**
	*设置触发停止的事件
	*@param events
	*
	*/
	__getset(0,__proto,'stopEvent',null,function(events){
		this._stopEvents=events;
		if (!events)return;
		if (this._tar){
			this._setPlayActions(this._tar,events,"stop");
		}
	});

	return SoundNode;
})(Sprite)


/**
*@private
*<code>FileBitmap</code> 是图片文件资源类。
*/
//class laya.resource.FileBitmap extends laya.resource.Bitmap
var FileBitmap=(function(_super){
	function FileBitmap(){
		/**@private 文件路径全名。*/
		this._src=null;
		/**@private onload触发函数*/
		this._onload=null;
		/**@private onerror触发函数*/
		this._onerror=null;
		FileBitmap.__super.call(this);
	}

	__class(FileBitmap,'laya.resource.FileBitmap',_super);
	var __proto=FileBitmap.prototype;
	/**
	*文件路径全名。
	*/
	__getset(0,__proto,'src',function(){
		return this._src;
		},function(value){
		this._src=value;
	});

	/**
	*载入完成处理函数。
	*/
	__getset(0,__proto,'onload',null,function(value){
	});

	/**
	*错误处理函数。
	*/
	__getset(0,__proto,'onerror',null,function(value){
	});

	return FileBitmap;
})(Bitmap)


/**
*<code>HTMLCanvas</code> 是 Html Canvas 的代理类，封装了 Canvas 的属性和方法。。请不要直接使用 new HTMLCanvas！
*/
//class laya.resource.HTMLCanvas extends laya.resource.Bitmap
var HTMLCanvas=(function(_super){
	function HTMLCanvas(type,canvas){
		//this._ctx=null;
		this._is2D=false;
		HTMLCanvas.__super.call(this);
		var _$this=this;
		this._source=this;
		if (type==="2D" || (type==="AUTO" && !Render.isWebGL)){
			this._is2D=true;
			this._source=canvas || Browser.createElement("canvas");
			this._w=this._source.width;
			this._h=this._source.height;
			var o=this;
			o.getContext=function (contextID,other){
				if (_$this._ctx)return _$this._ctx;
				var ctx=_$this._ctx=_$this._source.getContext(contextID,other);
				if (ctx){
					ctx._canvas=o;
					if(!Render.isFlash&&!Browser.onLimixiu)ctx.size=function (w,h){
					};
				}
				return ctx;
			}
		}
		this.lock=true;
	}

	__class(HTMLCanvas,'laya.resource.HTMLCanvas',_super);
	var __proto=HTMLCanvas.prototype;
	/**
	*清空画布内容。
	*/
	__proto.clear=function(){
		this._ctx && this._ctx.clear();
	}

	/**
	*销毁。
	*/
	__proto.destroy=function(){
		this._ctx && this._ctx.destroy();
		this._ctx=null;
		laya.resource.Resource.prototype.destroy.call(this);
	}

	/**
	*释放。
	*/
	__proto.release=function(){}
	/**
	*@private
	*设置 Canvas 渲染上下文。
	*@param context Canvas 渲染上下文。
	*/
	__proto._setContext=function(context){
		this._ctx=context;
	}

	/**
	*获取 Canvas 渲染上下文。
	*@param contextID 上下文ID.
	*@param other
	*@return Canvas 渲染上下文 Context 对象。
	*/
	__proto.getContext=function(contextID,other){
		return this._ctx ? this._ctx :(this._ctx=HTMLCanvas._createContext(this));
	}

	/**
	*获取内存大小。
	*@return 内存大小。
	*/
	__proto.getMemSize=function(){
		return 0;
	}

	/**
	*设置宽高。
	*@param w 宽度。
	*@param h 高度。
	*/
	__proto.size=function(w,h){
		if (this._w !=w || this._h !=h ||(this._source && (this._source.width!=w || this._source.height!=h))){
			this._w=w;
			this._h=h;
			this.memorySize=this._w *this._h *4;
			this._ctx && this._ctx.size(w,h);
			this._source && (this._source.height=h,this._source.width=w);
		}
	}

	__proto.getCanvas=function(){
		return this._source;
	}

	__proto.toBase64=function(type,encoderOptions,callBack){
		if (this._source){
			if (Render.isConchApp && this._source.toBase64){
				this._source.toBase64(type,encoderOptions,callBack);
			}
			else {
				var base64Data=this._source.toDataURL(type,encoderOptions);
				callBack.call(this,base64Data);
			}
		}
	}

	/**
	*Canvas 渲染上下文。
	*/
	__getset(0,__proto,'context',function(){
		return this._ctx;
	});

	/**
	*是否当作 Bitmap 对象。
	*/
	__getset(0,__proto,'asBitmap',null,function(value){
	});

	HTMLCanvas.create=function(type,canvas){
		return new HTMLCanvas(type,canvas);
	}

	HTMLCanvas.TYPE2D="2D";
	HTMLCanvas.TYPE3D="3D";
	HTMLCanvas.TYPEAUTO="AUTO";
	HTMLCanvas._createContext=null;
	return HTMLCanvas;
})(Bitmap)


/**
*@private
*/
//class laya.resource.HTMLSubImage extends laya.resource.Bitmap
var HTMLSubImage=(function(_super){
	//请不要直接使用new HTMLSubImage
	function HTMLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,allowMerageInAtlas){
		HTMLSubImage.__super.call(this);
		throw new Error("不允许new！");
	}

	__class(HTMLSubImage,'laya.resource.HTMLSubImage',_super);
	HTMLSubImage.create=function(canvas,offsetX,offsetY,width,height,atlasImage,src,allowMerageInAtlas){
		(allowMerageInAtlas===void 0)&& (allowMerageInAtlas=false);
		return new HTMLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,allowMerageInAtlas);
	}

	return HTMLSubImage;
})(Bitmap)


/**
*<p> <code>Animation</code> 是Graphics动画类。实现了基于Graphics的动画创建、播放、控制接口。</p>
*<p>本类使用了动画模版缓存池，它以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
*<p>动画模版缓存池，以key-value键值对存储，key可以自定义，也可以从指定的配置文件中读取，value为对应的动画模版，是一个Graphics对象数组，每个Graphics对象对应一个帧图像，动画的播放实质就是定时切换Graphics对象。</p>
*<p>使用set source、loadImages(...)、loadAtlas(...)、loadAnimation(...)方法可以创建动画模版。使用play(...)可以播放指定动画。</p>
*@example <caption>以下示例代码，创建了一个 <code>Text</code> 实例。</caption>
*package
*{
	*import laya.display.Animation;
	*import laya.net.Loader;
	*import laya.utils.Handler;
	*public class Animation_Example
	*{
		*public function Animation_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*init();//初始化
			*}
		*private function init():void
		*{
			*var animation:Animation=new Animation();//创建一个 Animation 类的实例对象 animation 。
			*animation.loadAtlas("resource/ani/fighter.json");//加载图集并播放
			*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
			*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
			*animation.interval=50;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
			*animation.play();//播放动画。
			*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
			*}
		*}
	*}
*
*@example
*Animation_Example();
*function Animation_Example(){
	*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
	*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
	*init();//初始化
	*}
*function init()
*{
	*var animation=new Laya.Animation();//创建一个 Animation 类的实例对象 animation 。
	*animation.loadAtlas("resource/ani/fighter.json");//加载图集并播放
	*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
	*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
	*animation.interval=50;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
	*animation.play();//播放动画。
	*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
	*}
*
*@example
*import Animation=laya.display.Animation;
*class Animation_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.init();
		*}
	*private init():void {
		*var animation:Animation=new Laya.Animation();//创建一个 Animation 类的实例对象 animation 。
		*animation.loadAtlas("resource/ani/fighter.json");//加载图集并播放
		*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
		*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
		*animation.interval=50;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
		*animation.play();//播放动画。
		*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
		*}
	*}
*new Animation_Example();
*/
//class laya.display.Animation extends laya.display.AnimationPlayerBase
var Animation=(function(_super){
	function Animation(){
		/**@private */
		this._frames=null;
		/**@private */
		this._url=null;
		Animation.__super.call(this);
		this._setControlNode(this);
	}

	__class(Animation,'laya.display.Animation',_super);
	var __proto=Animation.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.stop();
		laya.display.Sprite.prototype.destroy.call(this,destroyChild);
		this._frames=null;
		this._labels=null;
	}

	/**
	*<p>开始播放动画。会在动画模版缓存池中查找key值为name的动画模版，存在则用此动画模版初始化当前序列帧， 如果不存在，则使用当前序列帧。</p>
	*<p>play(...)方法被设计为在创建实例后的任何时候都可以被调用，调用后就处于播放状态，当相应的资源加载完毕、调用动画帧填充方法(set frames)或者将实例显示在舞台上时，会判断是否处于播放状态，如果是，则开始播放。</p>
	*<p>配合wrapMode属性，可设置动画播放顺序类型。</p>
	*@param start （可选）指定动画播放开始的索引(int)或帧标签(String)。帧标签可以通过addLabel(...)和removeLabel(...)进行添加和删除。
	*@param loop （可选）是否循环播放。
	*@param name （可选）动画模板在动画模版缓存池中的key，也可认为是动画名称。如果name为空，则播放当前动画序列帧；如果不为空，则在动画模版缓存池中寻找key值为name的动画模版，如果存在则用此动画模版初始化当前序列帧并播放，如果不存在，则仍然播放当前动画序列帧；如果没有当前动画的帧数据，则不播放，但该实例仍然处于播放状态。
	*@param showWarn（可选）是否动画不存在时打印警告
	*/
	__proto.play=function(start,loop,name,showWarn){
		(start===void 0)&& (start=0);
		(loop===void 0)&& (loop=true);
		(name===void 0)&& (name="");
		(showWarn===void 0)&& (showWarn=true);
		if (name)this._setFramesFromCache(name,showWarn);
		this._isPlaying=true;
		this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
		this.loop=loop;
		this._actionName=name;
		this._isReverse=this.wrapMode==1;
		if (this._frames && this.interval > 0){
			this.timerLoop(this.interval,this,this._frameLoop,null,true,true);
		}
	}

	/**@private */
	__proto._setFramesFromCache=function(name,showWarn){
		(showWarn===void 0)&& (showWarn=false);
		if (this._url)name=this._url+"#"+name;
		if (name && Animation.framesMap[name]){
			var tAniO;
			tAniO=Animation.framesMap[name];
			if ((tAniO instanceof Array)){
				this._frames=Animation.framesMap[name];
				this._count=this._frames.length;
				}else {
				if (tAniO.nodeRoot){
					Animation.framesMap[name]=this._parseGraphicAnimationByData(tAniO);
					tAniO=Animation.framesMap[name];
				}
				this._frames=tAniO.frames;
				this._count=this._frames.length;
				if (!this._frameRateChanged)this._interval=tAniO.interval;
				this._labels=this._copyLabels(tAniO.labels);
			}
			return true;
			}else {
			if (showWarn)console.log("ani not found:",name);
		}
		return false;
	}

	/**@private */
	__proto._copyLabels=function(labels){
		if (!labels)return null;
		var rst;
		rst={};
		var key;
		for (key in labels){
			rst[key]=Utils.copyArray([],labels[key]);
		}
		return rst;
	}

	/**@private */
	__proto._frameLoop=function(){
		if (this._style.visible && this._style.alpha > 0.01){
			_super.prototype._frameLoop.call(this);
		}
	}

	/**@private */
	__proto._displayToIndex=function(value){
		if (this._frames)this.graphics=this._frames[value];
	}

	/**
	*停止动画播放，并清理对象属性。之后可存入对象池，方便对象复用。
	*/
	__proto.clear=function(){
		this.stop();
		this.graphics=null;
		this._frames=null;
		this._labels=null;
	}

	/**
	*<p>根据指定的动画模版初始化当前动画序列帧。选择动画模版的过程如下：1. 动画模版缓存池中key为cacheName的动画模版；2. 如果不存在，则加载指定的图片集合并创建动画模版。注意：只有指定不为空的cacheName，才能将创建好的动画模版以此为key缓存到动画模版缓存池，否则不进行缓存。</p>
	*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
	*<p>因为返回值为Animation对象本身，所以可以使用如下语法：ani.loadImages(...).loadImages(...).play(...);。</p>
	*@param urls 图片路径集合。需要创建动画模版时，会以此为数据源。参数形如：[url1,url2,url3,...]。
	*@param cacheName （可选）动画模板在动画模版缓存池中的key。如果此参数不为空，表示使用动画模版缓存池。如果动画模版缓存池中存在key为cacheName的动画模版，则使用此模版。否则，创建新的动画模版，如果cacheName不为空，则以cacheName为key缓存到动画模版缓存池中，如果cacheName为空，不进行缓存。
	*@return 返回Animation对象本身。
	*/
	__proto.loadImages=function(urls,cacheName){
		(cacheName===void 0)&& (cacheName="");
		this._url="";
		if (!this._setFramesFromCache(cacheName)){
			this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(urls,cacheName);
		}
		return this;
	}

	/**
	*<p>根据指定的动画模版初始化当前动画序列帧。选择动画模版的过程如下：1. 动画模版缓存池中key为cacheName的动画模版；2. 如果不存在，则加载指定的图集并创建动画模版。</p>
	*<p>注意：只有指定不为空的cacheName，才能将创建好的动画模版以此为key缓存到动画模版缓存池，否则不进行缓存。</p>
	*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
	*<p>因为返回值为Animation对象本身，所以可以使用如下语法：ani.loadAtlas(...).loadAtlas(...).play(...);。</p>
	*@param url 图集路径。需要创建动画模版时，会以此为数据源。
	*@param loaded （可选）使用指定图集初始化动画完毕的回调。
	*@param cacheName （可选）动画模板在动画模版缓存池中的key。如果此参数不为空，表示使用动画模版缓存池。如果动画模版缓存池中存在key为cacheName的动画模版，则使用此模版。否则，创建新的动画模版，如果cacheName不为空，则以cacheName为key缓存到动画模版缓存池中，如果cacheName为空，不进行缓存。
	*@return 返回动画本身。
	*/
	__proto.loadAtlas=function(url,loaded,cacheName){
		(cacheName===void 0)&& (cacheName="");
		this._url="";
		var _this_=this;
		function onLoaded (loadUrl){
			if (url===loadUrl){
				_this_.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(url,cacheName);
				if (loaded)loaded.run();
			}
		}
		if (!_this_._setFramesFromCache(cacheName)){
			if (Loader.getAtlas(url))onLoaded(url);
			else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,/*laya.net.Loader.ATLAS*/"atlas");
		}
		return this;
	}

	/**
	*<p>加载并解析由LayaAir IDE制作的动画文件，此文件中可能包含多个动画。默认帧率为在IDE中设计的帧率，如果调用过set interval，则使用此帧间隔对应的帧率。加载后创建动画模版，并缓存到动画模版缓存池，key "url#动画名称" 对应相应动画名称的动画模板，key "url#" 对应动画模版集合的默认动画模版。</p>
	*<p>注意：如果调用本方法前，还没有预加载动画使用的图集，请将atlas参数指定为对应的图集路径，否则会导致动画创建失败。</p>
	*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
	*<p>因为返回值为Animation对象本身，所以可以使用如下语法：ani.loadAnimation(...).loadAnimation(...).play(...);。</p>
	*@param url 动画文件路径。可由LayaAir IDE创建并发布。
	*@param loaded （可选）使用指定动画资源初始化动画完毕的回调。
	*@param atlas （可选）动画用到的图集地址（可选）。
	*@return 返回动画本身。
	*/
	__proto.loadAnimation=function(url,loaded,atlas){
		this._url=url;
		var _this_=this;
		if (!this._actionName)this._actionName="";
		if (!_this_._setFramesFromCache(this._actionName)){
			if (!atlas || Loader.getAtlas(atlas)){
				this._loadAnimationData(url,loaded,atlas);
				}else {
				Laya.loader.load(atlas,Handler.create(this,this._loadAnimationData,[url,loaded,atlas]),null,/*laya.net.Loader.ATLAS*/"atlas")
			}
			}else {
			_this_._setFramesFromCache(this._actionName,true);
			this.index=0;
			if (loaded)loaded.run();
		}
		return this;
	}

	/**@private */
	__proto._loadAnimationData=function(url,loaded,atlas){
		var _$this=this;
		if (atlas && !Loader.getAtlas(atlas)){
			console.warn("atlas load fail:"+atlas);
			return;
		};
		var _this_=this;
		function onLoaded (loadUrl){
			if (!Loader.getRes(loadUrl))return;
			if (url===loadUrl){
				var tAniO;
				if (!Animation.framesMap[url+"#"]){
					var aniData=_this_._parseGraphicAnimation(Loader.getRes(url));
					if (!aniData)return;
					var aniList=aniData.animationList;
					var i=0,len=aniList.length;
					var defaultO;
					for (i=0;i < len;i++){
						tAniO=aniList[i];
						Animation.framesMap[url+"#"+tAniO.name]=tAniO;
						if (!defaultO)defaultO=tAniO;
					}
					if (defaultO){
						Animation.framesMap[url+"#"]=defaultO;
						_this_._setFramesFromCache(_$this._actionName,true);
						_$this.index=0;
					}
					_$this._checkResumePlaying();
					}else {
					_this_._setFramesFromCache(_$this._actionName,true);
					_$this.index=0;
					_$this._checkResumePlaying();
				}
				if (loaded)loaded.run();
			}
		}
		if (Loader.getRes(url))onLoaded(url);
		else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,/*laya.net.Loader.JSON*/"json");
		Loader.clearRes(url);
	}

	/**@private */
	__proto._parseGraphicAnimation=function(animationData){
		return GraphicAnimation.parseAnimationData(animationData);
	}

	/**@private */
	__proto._parseGraphicAnimationByData=function(animationObject){
		return GraphicAnimation.parseAnimationByData(animationObject);
	}

	/**
	*当前动画的帧图像数组。本类中，每个帧图像是一个Graphics对象，而动画播放就是定时切换Graphics对象的过程。
	*/
	__getset(0,__proto,'frames',function(){
		return this._frames;
		},function(value){
		this._frames=value;
		if (value){
			this._count=value.length;
			if (this._isPlaying)this.play(this._index,this.loop,this._actionName);
			else this.index=this._index;
		}
	});

	/**
	*是否自动播放，默认为false。如果设置为true，则动画被创建并添加到舞台后自动播放。
	*/
	__getset(0,__proto,'autoPlay',null,function(value){
		if (value)this.play();
		else this.stop();
	});

	/**
	*<p>动画数据源。</p>
	*<p>类型如下：<br/>
	*1. LayaAir IDE动画文件路径：使用此类型需要预加载所需的图集资源，否则会创建失败，如果不想预加载或者需要创建完毕的回调，请使用loadAnimation(...)方法；<br/>
	*2. 图集路径：使用此类型创建的动画模版不会被缓存到动画模版缓存池中，如果需要缓存或者创建完毕的回调，请使用loadAtlas(...)方法；<br/>
	*3. 图片路径集合：使用此类型创建的动画模版不会被缓存到动画模版缓存池中，如果需要缓存，请使用loadImages(...)方法。</p>
	*@param value 数据源。比如：图集："xx/a1.atlas"；图片集合："a1.png,a2.png,a3.png"；LayaAir IDE动画"xx/a1.ani"。
	*/
	__getset(0,__proto,'source',null,function(value){
		if (value.indexOf(".ani")>-1)this.loadAnimation(value);
		else if (value.indexOf(".json")>-1 || value.indexOf("als")>-1 || value.indexOf("atlas")>-1)this.loadAtlas(value);
		else this.loadImages(value.split(","));
	});

	/**
	*设置自动播放的动画名称，在LayaAir IDE中可以创建的多个动画组成的动画集合，选择其中一个动画名称进行播放。
	*/
	__getset(0,__proto,'autoAnimation',null,function(value){
		this.play(0,true,value,false);
	});

	Animation.createFrames=function(url,name){
		var arr,i=0,n=0,g;
		if ((typeof url=='string')){
			var atlas=Loader.getAtlas(url);
			if (atlas && atlas.length){
				arr=[];
				for (i=0,n=atlas.length;i < n;i++){
					g=new RunDriver.createGraphics();
					g.drawTexture(Loader.getRes(atlas[i]),0,0);
					arr.push(g);
				}
			}
			}else if ((url instanceof Array)){
			arr=[];
			for (i=0,n=url.length;i < n;i++){
				g=new RunDriver.createGraphics();
				g.loadImage(url[i],0,0);
				arr.push(g);
			}
		}
		if (name)Animation.framesMap[name]=arr;
		return arr;
	}

	Animation.clearCache=function(key){
		var cache=Animation.framesMap;
		var val;
		var key2=key+"#";
		for (val in cache){
			if (val===key || val.indexOf(key2)==0){
				delete Animation.framesMap[val];
			}
		}
	}

	Animation.framesMap={};
	return Animation;
})(AnimationPlayerBase)


/**
*关键帧动画播放类。
*/
//class laya.display.FrameAnimation extends laya.display.AnimationPlayerBase
var FrameAnimation=(function(_super){
	function FrameAnimation(){
		/**
		*@private
		*id对象表
		*/
		this._targetDic=null;
		/**
		*@private
		*动画数据
		*/
		this._animationData=null;
		/**@private */
		this._animationNewFrames=null;
		FrameAnimation.__super.call(this);
		if (FrameAnimation._sortIndexFun==null){
			FrameAnimation._sortIndexFun=MathUtil.sortByKey("index",false,true);
		}
	}

	__class(FrameAnimation,'laya.display.FrameAnimation',_super);
	var __proto=FrameAnimation.prototype;
	/**
	*@private
	*初始化动画数据
	*@param targetDic 对象表
	*@param animationData 动画数据
	*
	*/
	__proto._setUp=function(targetDic,animationData){
		this._labels=null;
		this._animationNewFrames=null;
		this._targetDic=targetDic;
		this._animationData=animationData;
		this.interval=1000 / animationData.frameRate;
		if (animationData.parsed){
			this._count=animationData.count;
			this._labels=animationData.labels;
			this._animationNewFrames=animationData.animationNewFrames;
			}else {
			this._animationNewFrames=[];
			this._calculateDatas();
		}
		animationData.parsed=true;
		animationData.labels=this._labels;
		animationData.count=this._count;
		animationData.animationNewFrames=this._animationNewFrames;
	}

	/**@inheritDoc */
	__proto.clear=function(){
		_super.prototype.clear.call(this);
		this._targetDic=null;
		this._animationData=null;
	}

	/**@inheritDoc */
	__proto._displayToIndex=function(value){
		if (!this._animationData)return;
		if (value < 0)value=0;
		if (value > this._count)value=this._count;
		var nodes=this._animationData.nodes,i=0,len=nodes.length;
		for (i=0;i < len;i++){
			this._displayNodeToFrame(nodes[i],value);
		}
	}

	/**
	*@private
	*将节点设置到某一帧的状态
	*@param node 节点ID
	*@param frame
	*@param targetDic 节点表
	*
	*/
	__proto._displayNodeToFrame=function(node,frame,targetDic){
		if (!targetDic)targetDic=this._targetDic;
		var target=targetDic[node.target];
		if (!target){
			return;
		};
		var frames=node.frames,key,propFrames,value;
		var keys=node.keys,i=0,len=keys.length;
		for (i=0;i < len;i++){
			key=keys[i];
			propFrames=frames[key];
			if (propFrames.length > frame){
				value=propFrames[frame];
				}else {
				value=propFrames[propFrames.length-1];
			}
			target[key]=value;
		}
	}

	/**
	*@private
	*计算帧数据
	*
	*/
	__proto._calculateDatas=function(){
		if (!this._animationData)return;
		var nodes=this._animationData.nodes,i=0,len=nodes.length,tNode;
		this._count=0;
		for (i=0;i < len;i++){
			tNode=nodes[i];
			this._calculateNodeKeyFrames(tNode);
		}
		this._count+=1;
	}

	/**
	*@private
	*计算某个节点的帧数据
	*@param node
	*
	*/
	__proto._calculateNodeKeyFrames=function(node){
		var keyFrames=node.keyframes,key,tKeyFrames,target=node.target;
		if (!node.frames){
			node.frames={};
		}
		if (!node.keys){
			node.keys=[];
			}else {
			node.keys.length=0;
		}
		if (!node.initValues){
			node.initValues={};
		}
		for (key in keyFrames){
			tKeyFrames=keyFrames[key];
			if (!node.frames[key]){
				node.frames[key]=[];
			}
			if (this._targetDic && this._targetDic[target]){
				node.initValues[key]=this._targetDic[target][key];
			}
			tKeyFrames.sort(FrameAnimation._sortIndexFun);
			node.keys.push(key);
			this._calculateNodePropFrames(tKeyFrames,node.frames[key],key,target);
		}
	}

	/**
	*将动画控制对象还原到动画控制之前的状态
	*/
	__proto.resetToInitState=function(){
		if (!this._targetDic)return;
		if (!this._animationData)return;
		var nodes=this._animationData.nodes,i=0,len=nodes.length;
		var tNode;
		var initValues;
		for (i=0;i < len;i++){
			tNode=nodes[i];
			initValues=tNode.initValues;
			if (!initValues)continue ;
			var target=this._targetDic[tNode.target];
			if (!target)continue ;
			var key;
			for (key in initValues){
				target[key]=initValues[key];
			}
		}
	}

	/**
	*@private
	*计算节点某个属性的帧数据
	*@param keyframes
	*@param frames
	*@param key
	*@param target
	*
	*/
	__proto._calculateNodePropFrames=function(keyframes,frames,key,target){
		var i=0,len=keyframes.length-1;
		frames.length=keyframes[len].index+1;
		for (i=0;i < len;i++){
			this._dealKeyFrame(keyframes[i]);
			this._calculateFrameValues(keyframes[i],keyframes[i+1],frames);
		}
		if (len==0){
			frames[keyframes[0].index]=keyframes[0].value;
			if (this._animationNewFrames)
				this._animationNewFrames[keyframes[0].index]=true;
		}
		this._dealKeyFrame(keyframes[i]);
	}

	/**
	*@private
	*
	*/
	__proto._dealKeyFrame=function(keyFrame){
		if (keyFrame.label && keyFrame.label !="")this.addLabel(keyFrame.label,keyFrame.index);
	}

	/**
	*@private
	*计算两个关键帧直接的帧数据
	*@param startFrame
	*@param endFrame
	*@param result
	*
	*/
	__proto._calculateFrameValues=function(startFrame,endFrame,result){
		var i=0,easeFun;
		var start=startFrame.index,end=endFrame.index;
		var startValue=startFrame.value;
		var dValue=endFrame.value-startFrame.value;
		var dLen=end-start;
		if (end > this._count)this._count=end;
		if (startFrame.tween){
			easeFun=Ease[startFrame.tweenMethod];
			if (easeFun==null){
				easeFun=Ease.linearNone;
			}
			for (i=start;i < end;i++){
				result[i]=easeFun(i-start,startValue,dValue,dLen);
				if (this._animationNewFrames){
					this._animationNewFrames[i]=true;
				}
			}
			}else {
			for (i=start;i < end;i++){
				result[i]=startValue;
			}
		}
		if (this._animationNewFrames){
			this._animationNewFrames[startFrame.index]=true;
			this._animationNewFrames[endFrame.index]=true;
		}
		result[endFrame.index]=endFrame.value;
	}

	FrameAnimation._sortIndexFun=null;
	return FrameAnimation;
})(AnimationPlayerBase)


/**
*<p><code>Input</code> 类用于创建显示对象以显示和输入文本。</p>
*<p>Input 类封装了原生的文本输入框，由于不同浏览器的差异，会导致此对象的默认文本的位置与用户点击输入时的文本的位置有少许的偏差。</p>
*/
//class laya.display.Input extends laya.display.Text
var Input=(function(_super){
	function Input(){
		/**@private */
		this._focus=false;
		/**@private */
		this._multiline=false;
		/**@private */
		this._editable=true;
		/**@private */
		this._restrictPattern=null;
		this._type="text";
		/**输入提示符。*/
		this._prompt='';
		/**输入提示符颜色。*/
		this._promptColor="#A9A9A9";
		this._originColor="#000000";
		this._content='';
		Input.__super.call(this);
		this._maxChars=1E5;
		this._width=100;
		this._height=20;
		this.multiline=false;
		this.overflow=Text.SCROLL;
		this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
		this.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._onUnDisplay);
	}

	__class(Input,'laya.display.Input',_super);
	var __proto=Input.prototype;
	/**
	*设置光标位置和选取字符。
	*@param startIndex 光标起始位置。
	*@param endIndex 光标结束位置。
	*/
	__proto.setSelection=function(startIndex,endIndex){
		this.focus=true;
		laya.display.Input.inputElement.selectionStart=startIndex;
		laya.display.Input.inputElement.selectionEnd=endIndex;
	}

	__proto._onUnDisplay=function(e){
		this.focus=false;
	}

	__proto._onMouseDown=function(e){
		this.focus=true;
	}

	/**
	*在输入期间，如果 Input 实例的位置改变，调用_syncInputTransform同步输入框的位置。
	*/
	__proto._syncInputTransform=function(){
		var inputElement=this.nativeInput;
		var transform=Utils.getTransformRelativeToWindow(this,this.padding[3],this.padding[0]);
		var inputWid=this._width-this.padding[1]-this.padding[3];
		var inputHei=this._height-this.padding[0]-this.padding[2];
		if (Render.isConchApp){
			inputElement.setScale(transform.scaleX,transform.scaleY);
			inputElement.setSize(inputWid,inputHei);
			inputElement.setPos(transform.x,transform.y);
			}else {
			Input.inputContainer.style.transform=Input.inputContainer.style.webkitTransform="scale("+transform.scaleX+","+transform.scaleY+") rotate("+(Laya.stage.canvasDegree)+"deg)";
			inputElement.style.width=inputWid+'px';
			inputElement.style.height=inputHei+'px';
			Input.inputContainer.style.left=transform.x+'px';
			Input.inputContainer.style.top=transform.y+'px';
		}
	}

	/**选中当前实例的所有文本。*/
	__proto.select=function(){
		this.nativeInput.select();
	}

	__proto._setInputMethod=function(){
		Input.input.parentElement && (Input.inputContainer.removeChild(Input.input));
		Input.area.parentElement && (Input.inputContainer.removeChild(Input.area));
		Input.inputElement=(this._multiline ? Input.area :Input.input);
		Input.inputContainer.appendChild(Input.inputElement);
		if (Text.RightToLeft){
			Input.inputElement.style.direction="rtl";
		}
	}

	__proto._focusIn=function(){
		laya.display.Input.isInputting=true;
		var input=this.nativeInput;
		this._focus=true;
		var cssStyle=input.style;
		cssStyle.whiteSpace=(this.wordWrap ? "pre-wrap" :"nowrap");
		this._setPromptColor();
		input.readOnly=!this._editable;
		if (Render.isConchApp){
			input.setType(this._type);
			input.setForbidEdit(!this._editable);
		}
		input.maxLength=this._maxChars;
		var padding=this.padding;
		input.type=this._type;
		input.value=this._content;
		input.placeholder=this._prompt;
		Laya.stage.off(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
		Laya.stage.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
		Laya.stage.focus=this;
		this.event(/*laya.events.Event.FOCUS*/"focus");
		if (Browser.onPC)input.focus();
		if(!Browser.onMiniGame && !Browser.onBDMiniGame && !Browser.onQGMiniGame && !Browser.onVVMiniGame && !Browser.onBLMiniGame && !Browser.onAlipayMiniGame && !Browser.onTTMiniGame && !Browser.onHWMiniGame && !Browser.onTBMiniGame){
			var temp=this._text;
			this._text=null;
		}
		this.typeset();
		input.setColor(this._originColor);
		if(input.setBgColor)
			input.setBgColor(this.bgColor);
		input.setFontSize(this.fontSize);
		input.setFontFace(Browser.onIPhone ? (Text._fontFamilyMap[this.font] || this.font):this.font);
		if (Render.isConchApp){
			input.setMultiAble && input.setMultiAble(this._multiline);
		}
		cssStyle.lineHeight=(this.leading+this.fontSize)+"px";
		cssStyle.fontStyle=(this.italic ? "italic" :"normal");
		cssStyle.fontWeight=(this.bold ? "bold" :"normal");
		cssStyle.textAlign=this.align;
		cssStyle.padding="0 0";
		this._syncInputTransform();
		if (!Render.isConchApp && Browser.onPC)
			Laya.timer.frameLoop(1,this,this._syncInputTransform);
	}

	// 设置DOM输入框提示符颜色。
	__proto._setPromptColor=function(){
		Input.promptStyleDOM=Browser.getElementById("promptStyle");
		if (!Input.promptStyleDOM){
			Input.promptStyleDOM=Browser.createElement("style");
			Input.promptStyleDOM.setAttribute("id","promptStyle");
			Browser.document.head.appendChild(Input.promptStyleDOM);
		}
		Input.promptStyleDOM.innerText="input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {"+"color:"+this._promptColor+"}"+"input:-moz-placeholder, textarea:-moz-placeholder {"+"color:"+this._promptColor+"}"+"input::-moz-placeholder, textarea::-moz-placeholder {"+"color:"+this._promptColor+"}"+"input:-ms-input-placeholder, textarea:-ms-input-placeholder {"+"color:"+this._promptColor+"}";
	}

	/**@private */
	__proto._focusOut=function(){
		laya.display.Input.isInputting=false;
		this._focus=false;
		this._text=null;
		this._content=this.nativeInput.value;
		if (!this._content){
			Laya.superSet(Text,this,'text',this._prompt);
			Laya.superSet(Text,this,'color',this._promptColor);
			}else {
			Laya.superSet(Text,this,'text',this._content);
			Laya.superSet(Text,this,'color',this._originColor);
		}
		Laya.stage.off(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
		Laya.stage.focus=null;
		this.event(/*laya.events.Event.BLUR*/"blur");
		if (Render.isConchApp)this.nativeInput.blur();
		Browser.onPC && Laya.timer.clear(this,this._syncInputTransform);
	}

	/**@private */
	__proto._onKeyDown=function(e){
		if (e.keyCode===13){
			if (Browser.onMobile && !this._multiline)
				this.focus=false;
			this.event(/*laya.events.Event.ENTER*/"enter");
		}
	}

	__proto.changeText=function(text){
		this._content=text;
		if (this._focus){
			this.nativeInput.value=text || '';
			this.event(/*laya.events.Event.CHANGE*/"change");
		}else
		_super.prototype.changeText.call(this,text);
	}

	/**@inheritDoc */
	__getset(0,__proto,'color',_super.prototype._$get_color,function(value){
		if (this._focus)
			this.nativeInput.setColor(value);
		Laya.superSet(Text,this,'color',this._content?value:this._promptColor);
		this._originColor=value;
	});

	//[Deprecated]
	__getset(0,__proto,'inputElementYAdjuster',function(){
		console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementYAdjuster已弃用。");
		return 0;
		},function(value){
		console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementYAdjuster已弃用。");
	});

	/**表示是否是多行输入框。*/
	__getset(0,__proto,'multiline',function(){
		return this._multiline;
		},function(value){
		this._multiline=value;
		this.valign=value ? "top" :"middle";
	});

	/**
	*<p>字符数量限制，默认为10000。</p>
	*<p>设置字符数量限制时，小于等于0的值将会限制字符数量为10000。</p>
	*/
	__getset(0,__proto,'maxChars',function(){
		return this._maxChars;
		},function(value){
		if (value <=0)
			value=1E5;
		this._maxChars=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'text',function(){
		if (this._focus)
			return this.nativeInput.value;
		else
		return this._content || "";
		},function(value){
		Laya.superSet(Text,this,'color',this._originColor);
		value+='';
		if (this._focus){
			this.nativeInput.value=value || '';
			this.event(/*laya.events.Event.CHANGE*/"change");
			}else {
			if (!this._multiline)
				value=value.replace(/\r?\n/g,'');
			this._content=value;
			if (value)
				Laya.superSet(Text,this,'text',value);
			else {
				Laya.superSet(Text,this,'text',this._prompt);
				Laya.superSet(Text,this,'color',this.promptColor);
			}
		}
	});

	/**
	*获取对输入框的引用实例。
	*/
	__getset(0,__proto,'nativeInput',function(){
		return this._multiline ? Input.area :Input.input;
	});

	/**
	*设置输入提示符。
	*/
	__getset(0,__proto,'prompt',function(){
		return this._prompt;
		},function(value){
		if (!this._text && value)
			Laya.superSet(Text,this,'color',this._promptColor);
		this.promptColor=this._promptColor;
		if (this._text)
			Laya.superSet(Text,this,'text',(this._text==this._prompt)?value:this._text);
		else
		Laya.superSet(Text,this,'text',value);
		this._prompt=Text.langPacks && Text.langPacks[value] ? Text.langPacks[value] :value;
	});

	// 因此 调用focus接口是无法都在移动平台立刻弹出键盘的
	/**
	*表示焦点是否在此实例上。
	*/
	__getset(0,__proto,'focus',function(){
		return this._focus;
		},function(value){
		var input=this.nativeInput;
		if (this._focus!==value){
			if (value){
				if (input.target){
					input.target._focusOut();
					}else {
					this._setInputMethod();
				}
				input.target=this;
				this._focusIn();
				}else {
				input.target=null;
				this._focusOut();
				Browser.document.body.scrollTop=0;
				input.blur();
				if (Render.isConchApp){
					input.setPos(-10000,-10000);
				}else if (Input.inputContainer.contains(input))
				Input.inputContainer.removeChild(input);
			}
		}
	});

	/**限制输入的字符。*/
	__getset(0,__proto,'restrict',function(){
		if (this._restrictPattern){
			return this._restrictPattern.source;
		}
		return "";
		},function(pattern){
		if (pattern){
			pattern="[^"+pattern+"]";
			if (pattern.indexOf("^^")>-1)
				pattern=pattern.replace("^^","");
			this._restrictPattern=new RegExp(pattern,"g");
		}else
		this._restrictPattern=null;
	});

	/**
	*是否可编辑。
	*/
	__getset(0,__proto,'editable',function(){
		return this._editable;
		},function(value){
		this._editable=value;
		if (Render.isConchApp){
			Input.input.setForbidEdit(!value);
		}
	});

	/**
	*设置输入提示符颜色。
	*/
	__getset(0,__proto,'promptColor',function(){
		return this._promptColor;
		},function(value){
		this._promptColor=value;
		if (!this._content)Laya.superSet(Text,this,'color',value);
	});

	/**
	*<p>输入框类型为Input静态常量之一。</p>
	*<ul>
	*<li>TYPE_TEXT</li>
	*<li>TYPE_PASSWORD</li>
	*<li>TYPE_EMAIL</li>
	*<li>TYPE_URL</li>
	*<li>TYPE_NUMBER</li>
	*<li>TYPE_RANGE</li>
	*<li>TYPE_DATE</li>
	*<li>TYPE_MONTH</li>
	*<li>TYPE_WEEK</li>
	*<li>TYPE_TIME</li>
	*<li>TYPE_DATE_TIME</li>
	*<li>TYPE_DATE_TIME_LOCAL</li>
	*</ul>
	*<p>平台兼容性参见http://www.w3school.com.cn/html5/html_5_form_input_types.asp。</p>
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
		},function(value){
		if (value=="password")
			this._getCSSStyle().password=true;
		else
		this._getCSSStyle().password=false;
		this._type=value;
		if (Render.isConchApp){
			this.nativeInput.setType(value);
		}
	});

	/**
	*<p>原生输入框 X 轴调整值，用来调整输入框坐标。</p>
	*<p>由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementXAdjuster已弃用。</p>
	*@deprecated
	*/
	__getset(0,__proto,'inputElementXAdjuster',function(){
		console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementXAdjuster已弃用。");
		return 0;
		},function(value){
		console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementXAdjuster已弃用。");
	});

	//[Deprecated(replacement="Input.type")]
	__getset(0,__proto,'asPassword',function(){
		return this._getCSSStyle().password;
		},function(value){
		this._getCSSStyle().password=value;
		this._type=/*CLASS CONST:laya.display.Input.TYPE_PASSWORD*/"password";
		console.warn("deprecated: 使用type=\"password\"替代设置asPassword, asPassword将在下次重大更新时删去");
		this.isChanged=true;
	});

	Input.__init__=function(){
		Input._createInputElement();
		if (Browser.onMobile){
			var isTrue=false;
			if (Browser.onMiniGame || Browser.onBDMiniGame || Browser.onKGMiniGame || Browser.onQGMiniGame || Browser.onVVMiniGame || Browser.onBLMiniGame || Browser.onAlipayMiniGame || Browser.onQQMiniGame || Browser.onTTMiniGame || Browser.onHWMiniGame||Browser.onTBMiniGame){
				isTrue=true;
			}
			Render.canvas.addEventListener(Input.IOS_IFRAME ?(isTrue ? "touchend" :"click"):"touchend",Input._popupInputMethod);
		}
	}

	Input._popupInputMethod=function(e){
		if (!laya.display.Input.isInputting)return;
		var input=laya.display.Input.inputElement;
		input.focus();
	}

	Input._createInputElement=function(){
		Input._initInput(Input.area=Browser.createElement("textarea"));
		Input._initInput(Input.input=Browser.createElement("input"));
		Input.inputContainer=Browser.createElement("div");
		Input.inputContainer.style.position="absolute";
		Input.inputContainer.style.zIndex=1E5;
		Browser.container.appendChild(Input.inputContainer);
		Input.inputContainer.setPos=function (x,y){Input.inputContainer.style.left=x+'px';Input.inputContainer.style.top=y+'px';};
	}

	Input._initInput=function(input){
		var style=input.style;
		style.cssText="position:absolute;overflow:hidden;resize:none;transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-o-transform-origin:0 0;";
		style.resize='none';
		style.backgroundColor='transparent';
		style.border='none';
		style.outline='none';
		style.zIndex=1;
		input.addEventListener('input',Input._processInputting);
		input.addEventListener('mousemove',Input._stopEvent);
		input.addEventListener('mousedown',Input._stopEvent);
		input.addEventListener('touchmove',Input._stopEvent);
		input.setFontFace=function (fontFace){input.style.fontFamily=fontFace;};
		if(!Render.isConchApp){
			input.setColor=function (color){input.style.color=color;};
			input.setFontSize=function (fontSize){input.style.fontSize=fontSize+'px';};
		}
	}

	Input._processInputting=function(e){
		var input=laya.display.Input.inputElement.target;
		if (!input)return;
		var value=laya.display.Input.inputElement.value;
		if (input._restrictPattern){
			value=value.replace(/\u2006|\x27/g,"");
			if (input._restrictPattern.test(value)){
				value=value.replace(input._restrictPattern,"");
				laya.display.Input.inputElement.value=value;
			}
		}
		input._text=value;
		input.event(/*laya.events.Event.INPUT*/"input");
	}

	Input._stopEvent=function(e){
		if (e.type=='touchmove')
			e.preventDefault();
		e.stopPropagation && e.stopPropagation();
	}

	Input.TYPE_TEXT="text";
	Input.TYPE_PASSWORD="password";
	Input.TYPE_EMAIL="email";
	Input.TYPE_URL="url";
	Input.TYPE_NUMBER="number";
	Input.TYPE_RANGE="range";
	Input.TYPE_DATE="date";
	Input.TYPE_MONTH="month";
	Input.TYPE_WEEK="week";
	Input.TYPE_TIME="time";
	Input.TYPE_DATE_TIME="datetime";
	Input.TYPE_DATE_TIME_LOCAL="datetime-local";
	Input.TYPE_SEARCH="search";
	Input.input=null;
	Input.area=null;
	Input.inputElement=null;
	Input.inputContainer=null;
	Input.confirmButton=null;
	Input.promptStyleDOM=null;
	Input.inputHeight=45;
	Input.isInputting=false;
	Input.stageMatrix=null;
	__static(Input,
	['IOS_IFRAME',function(){return this.IOS_IFRAME=(Browser.onIOS && Browser.window.top !=Browser.window.self);}
	]);
	return Input;
})(Text)


/**
*@private
*<p> <code>HTMLImage</code> 用于创建 HTML Image 元素。</p>
*<p>请使用 <code>HTMLImage.create()<code>获取新实例，不要直接使用 <code>new HTMLImage<code> 。</p>
*/
//class laya.resource.HTMLImage extends laya.resource.FileBitmap
var HTMLImage=(function(_super){
	function HTMLImage(src,def){
		/**异步加载锁*/
		this._recreateLock=false;
		/**异步加载完成后是否需要释放（有可能在恢复过程中,再次被释放，用此变量做标记）*/
		this._needReleaseAgain=false;
		this._enableMerageInAtlas=true;
		HTMLImage.__super.call(this);
		this._init_(src,def);
	}

	__class(HTMLImage,'laya.resource.HTMLImage',_super);
	var __proto=HTMLImage.prototype;
	__proto._init_=function(src,def){
		this._src=src;
		this._source=new Browser.window.Image();
		if (def){
			def.onload && (this.onload=def.onload);
			def.onerror && (this.onerror=def.onerror);
			def.onCreate && def.onCreate(this);
		}
		if (src.indexOf("data:image")!=0)this._source.crossOrigin="";
		(src)&& (this._source.src=src);
	}

	/**
	*@inheritDoc
	*/
	__proto.recreateResource=function(){
		var _$this=this;
		if (this._src==="")
			throw new Error("src no null！");
		this._needReleaseAgain=false;
		if (!this._source){
			this._recreateLock=true;
			var _this=this;
			this._source=new Browser.window.Image();
			this._source.crossOrigin="";
			this._source.onload=function (){
				if (_this._needReleaseAgain){
					_this._needReleaseAgain=false;
					_this._source.onload=null;
					_this._source=null;
					return;
				}
				_this._source.onload=null;
				_this.memorySize=_$this._w *_$this._h *4;
				_this._recreateLock=false;
				_this.completeCreate();
			};
			this._source.src=this._src;
			}else {
			if (this._recreateLock)
				return;
			this.memorySize=this._w *this._h *4;
			this._recreateLock=false;
			this.completeCreate();
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.disposeResource=function(){
		if (this._recreateLock)
			this._needReleaseAgain=true;
		(this._source)&& (this._source=null,this.memorySize=0);
	}

	/***调整尺寸。*/
	__proto.onresize=function(){
		this._w=this._source.width;
		this._h=this._source.height;
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'onload',null,function(value){
		var _$this=this;
		this._onload=value;
		this._source && (this._source.onload=this._onload !=null ? (function(){
			_$this.onresize();
			_$this._onload();
		}):null);
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'onerror',null,function(value){
		var _$this=this;
		this._onerror=value;
		this._source && (this._source.onerror=this._onerror !=null ? (function(){
			_$this._onerror()
		}):null);
	});

	__getset(0,__proto,'enableMerageInAtlas',function(){
		return this._enableMerageInAtlas;
		},function(value){
		this._enableMerageInAtlas=value;
		if (Render.isConchApp){
			if (this._source)this._source.enableMerageInAtlas=value;
		}
	});

	HTMLImage.create=function(src,def){
		return new HTMLImage(src,def);
	}

	return HTMLImage;
})(FileBitmap)


/**
*<p> 动效模板。用于为指定目标对象添加动画效果。每个动效有唯一的目标对象，而同一个对象可以添加多个动效。 当一个动效开始播放时，其他动效会自动停止播放。</p>
*<p> 可以通过LayaAir IDE创建。 </p>
*/
//class laya.display.EffectAnimation extends laya.display.FrameAnimation
var EffectAnimation=(function(_super){
	function EffectAnimation(){
		/**@private */
		this._target=null;
		/**@private */
		this._playEvents=null;
		/**@private */
		this._initData={};
		/**@private */
		this._aniKeys=null;
		/**@private */
		this._effectClass=null;
		EffectAnimation.__super.call(this);
	}

	__class(EffectAnimation,'laya.display.EffectAnimation',_super);
	var __proto=EffectAnimation.prototype;
	/**@private */
	__proto._onOtherBegin=function(effect){
		if (effect==this)
			return;
		this.stop();
	}

	/**@private */
	__proto.addEvent=function(){
		if (!this._target || !this._playEvents)
			return;
		this._setControlNode(this._target);
		this._target.on(this._playEvents,this,this._onPlayAction);
	}

	/**@private */
	__proto._onPlayAction=function(){
		this.play(0,false);
	}

	__proto.play=function(start,loop,name,showWarn){
		(start===void 0)&& (start=0);
		(loop===void 0)&& (loop=true);
		(name===void 0)&& (name="");
		(showWarn===void 0)&& (showWarn=true);
		if (!this._target)
			return;
		this._target.event("effectanimationbegin",[this]);
		this._recordInitData();
		laya.display.AnimationPlayerBase.prototype.play.call(this,start,loop,name,showWarn);
	}

	/**@private */
	__proto._recordInitData=function(){
		if (!this._aniKeys)
			return;
		var i=0,len=0;
		len=this._aniKeys.length;
		var key;
		for (i=0;i < len;i++){
			key=this._aniKeys[i];
			this._initData[key]=this._target[key];
		}
	}

	/**@private */
	__proto._displayToIndex=function(value){
		if (!this._animationData)
			return;
		if (value < 0)
			value=0;
		if (value > this._count)
			value=this._count;
		var nodes=this._animationData.nodes,i=0,len=nodes.length;
		len=len > 1 ? 1 :len;
		for (i=0;i < len;i++){
			this._displayNodeToFrame(nodes[i],value);
		}
	}

	/**@private */
	__proto._displayNodeToFrame=function(node,frame,targetDic){
		if (!this._target)
			return;
		var target;
		target=this._target;
		var frames=node.frames,key,propFrames,value;
		var keys=node.keys,i=0,len=keys.length;
		var secondFrames;
		secondFrames=node.secondFrames;
		var tSecondFrame=0;
		var easeFun;
		var tKeyFrames;
		var startFrame;
		var endFrame;
		for (i=0;i < len;i++){
			key=keys[i];
			propFrames=frames[key];
			tSecondFrame=secondFrames[key];
			if (tSecondFrame==-1){
				value=this._initData[key];
				}else {
				if (frame < tSecondFrame){
					tKeyFrames=node.keyframes[key];
					startFrame=tKeyFrames[0];
					if (startFrame.tween){
						easeFun=Ease[startFrame.tweenMethod];
						if (easeFun==null){
							easeFun=Ease.linearNone;
						}
						endFrame=tKeyFrames[1];
						value=easeFun(frame,this._initData[key],endFrame.value-this._initData[key],endFrame.index);
						}else {
						value=this._initData[key];
					}
					}else {
					if (propFrames.length > frame){
						value=propFrames[frame];
						}else {
						value=propFrames[propFrames.length-1];
					}
				}
			}
			target[key]=value;
		}
	}

	/**@private */
	__proto._calculateNodeKeyFrames=function(node){
		_super.prototype._calculateNodeKeyFrames.call(this,node);
		var keyFrames=node.keyframes,key,tKeyFrames,target=node.target;
		var secondFrames;
		secondFrames={};
		node.secondFrames=secondFrames;
		for (key in keyFrames){
			tKeyFrames=keyFrames[key];
			if (tKeyFrames.length <=1){
				secondFrames[key]=-1;
				}else {
				secondFrames[key]=tKeyFrames[1].index;
			}
		}
	}

	/**
	*本实例的目标对象。通过本实例控制目标对象的属性变化。
	*@param v 指定的目标对象。
	*/
	__getset(0,__proto,'target',function(){
		return this._target;
		},function(v){
		if (this._target){
			this._target.off("effectanimationbegin",this,this._onOtherBegin);
		}
		this._target=v;
		if (this._target){
			this._target.on("effectanimationbegin",this,this._onOtherBegin);
		}
		this.addEvent();
	});

	/**
	*设置开始播放的事件。本实例会侦听目标对象的指定事件，触发后播放相应动画效果。
	*@param event
	*/
	__getset(0,__proto,'playEvent',null,function(event){
		this._playEvents=event;
		if (!event)
			return;
		this.addEvent();
	});

	/**
	*设置动画数据。
	*@param uiData
	*/
	__getset(0,__proto,'effectData',null,function(uiData){
		if (uiData){
			var aniData;
			aniData=uiData["animations"];
			if (aniData && aniData[0]){
				this._setUp({},aniData[0]);
				if (aniData[0].nodes && aniData[0].nodes[0]){
					this._aniKeys=aniData[0].nodes[0].keys;
				}
			}
		}
	});

	/**
	*设置提供数据的类。
	*@param classStr 类路径
	*/
	__getset(0,__proto,'effectClass',null,function(classStr){
		this._effectClass=ClassUtils.getClass(classStr);
		if (this._effectClass){
			var uiData;
			uiData=this._effectClass["uiView"];
			if (uiData){
				var aniData;
				aniData=uiData["animations"];
				if (aniData && aniData[0]){
					this._setUp({},aniData[0]);
					if (aniData[0].nodes && aniData[0].nodes[0]){
						this._aniKeys=aniData[0].nodes[0].keys;
					}
				}
			}
		}
	});

	EffectAnimation.EffectAnimationBegin="effectanimationbegin";
	return EffectAnimation;
})(FrameAnimation)


/**
*@private
*/
//class laya.utils.GraphicAnimation extends laya.display.FrameAnimation
var GraphicAnimation=(function(_super){
	var GraphicNode;
	function GraphicAnimation(){
		/**
		*@private
		*/
		this.animationList=null;
		/**
		*@private
		*/
		this.animationDic=null;
		/**
		*@private
		*/
		this._nodeList=null;
		/**
		*@private
		*/
		this._nodeDefaultProps=null;
		/**
		*@private
		*/
		this._gList=null;
		/**
		*@private
		*/
		this._nodeIDAniDic={};
		this._rootNode=null;
		this._nodeGDic=null;
		GraphicAnimation.__super.call(this);
	}

	__class(GraphicAnimation,'laya.utils.GraphicAnimation',_super);
	var __proto=GraphicAnimation.prototype;
	/**
	*@private
	*/
	__proto._parseNodeList=function(uiView){
		if (!this._nodeList){
			this._nodeList=[];
		}
		this._nodeDefaultProps[uiView.compId]=uiView.props;
		if (uiView.compId)
			this._nodeList.push(uiView.compId);
		var childs=uiView.child;
		if (childs){
			var i=0,len=childs.length;
			for (i=0;i < len;i++){
				this._parseNodeList(childs[i]);
			}
		}
	}

	/**
	*@private
	*/
	__proto._calGraphicData=function(aniData){
		this._setUp(null,aniData);
		this._createGraphicData();
		if (this._nodeIDAniDic){
			var key;
			for (key in this._nodeIDAniDic){
				this._nodeIDAniDic[key]=null;
			}
		}
	}

	/**
	*@private
	*/
	__proto._createGraphicData=function(){
		var gList=[];
		var i=0,len=this.count;
		var animationDataNew=this._animationNewFrames;
		if (!animationDataNew)animationDataNew=[];
		var preGraphic;
		for (i=0;i < len;i++){
			if (animationDataNew[i] || !preGraphic){
				preGraphic=this._createFrameGraphic(i);
			}
			gList.push(preGraphic);
		}
		this._gList=gList;
	}

	/**
	*@private
	*/
	__proto._createFrameGraphic=function(frame){
		var g=RunDriver.createGraphics();
		if (!GraphicAnimation._rootMatrix)
			GraphicAnimation._rootMatrix=new Matrix();
		this._updateNodeGraphic(this._rootNode,frame,GraphicAnimation._rootMatrix,g);
		return g;
	}

	__proto._updateNodeGraphic=function(node,frame,parentTransfrom,g,alpha){
		(alpha===void 0)&& (alpha=1);
		var tNodeG;
		tNodeG=this._nodeGDic[node.compId]=this._getNodeGraphicData(node.compId,frame,this._nodeGDic[node.compId]);
		var tGraphicAlpha=tNodeG.alpha *alpha;
		if (tGraphicAlpha < 0.01)return;
		if (!tNodeG.resultTransform){
			tNodeG.resultTransform=Matrix.create();
		};
		var tResultTransform;
		tResultTransform=tNodeG.resultTransform;
		Matrix.mul(tNodeG.transform,parentTransfrom,tResultTransform);
		var tTex;
		if (tNodeG.skin){
			tTex=this._getTextureByUrl(tNodeG.skin);
			if (tTex){
				if (tResultTransform._checkTransform()){
					g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height,tResultTransform,tGraphicAlpha);
					tNodeG.resultTransform=null;
					}else {
					g.drawTexture(tTex,tResultTransform.tx,tResultTransform.ty,tNodeG.width,tNodeG.height,null,tGraphicAlpha);
				}
			}
		};
		var childs;
		childs=node.child;
		if (!childs)
			return;
		var i=0,len=0;
		len=childs.length;
		for (i=0;i < len;i++){
			this._updateNodeGraphic(childs[i],frame,tResultTransform,g,tGraphicAlpha);
		}
	}

	__proto._updateNoChilds=function(tNodeG,g){
		if (!tNodeG.skin)
			return;
		var tTex=this._getTextureByUrl(tNodeG.skin);
		if (!tTex)
			return;
		var tTransform=tNodeG.transform;
		tTransform._checkTransform();
		var onlyTranslate=false;
		onlyTranslate=!tTransform.bTransform;
		if (!onlyTranslate){
			g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height,tTransform.clone(),tNodeG.alpha);
			}else {
			g.drawTexture(tTex,tTransform.tx,tTransform.ty,tNodeG.width,tNodeG.height,null,tNodeG.alpha);
		}
	}

	__proto._updateNodeGraphic2=function(node,frame,g){
		var tNodeG;
		tNodeG=this._nodeGDic[node.compId]=this._getNodeGraphicData(node.compId,frame,this._nodeGDic[node.compId]);
		if (!node.child){
			this._updateNoChilds(tNodeG,g);
			return;
		};
		var tTransform=tNodeG.transform;
		tTransform._checkTransform();
		var onlyTranslate=false;
		onlyTranslate=!tTransform.bTransform;
		var hasTrans=false;
		hasTrans=onlyTranslate && (tTransform.tx !=0 || tTransform.ty !=0);
		var ifSave=false;
		ifSave=(tTransform.bTransform)|| tNodeG.alpha !=1;
		if (ifSave){
			g.save();
		}
		if (tNodeG.alpha !=1){
			g.alpha(tNodeG.alpha);
		}
		if (!onlyTranslate){
			g.transform(tTransform.clone());
			}else if (hasTrans){
			g.translate(tTransform.tx,tTransform.ty);
		};
		var childs;
		childs=node.child;
		var tTex;
		if (tNodeG.skin){
			tTex=this._getTextureByUrl(tNodeG.skin);
			if (tTex){
				g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height);
			}
		}
		if (childs){
			var i=0,len=0;
			len=childs.length;
			for (i=0;i < len;i++){
				this._updateNodeGraphic2(childs[i],frame,g);
			}
		}
		if (ifSave){
			g.restore();
			}else {
			if (!onlyTranslate){
				g.transform(tTransform.clone().invert());
				}else if (hasTrans){
				g.translate(-tTransform.tx,-tTransform.ty);
			}
		}
	}

	/**
	*@private
	*/
	__proto._calculateNodeKeyFrames=function(node){
		_super.prototype._calculateNodeKeyFrames.call(this,node);
		this._nodeIDAniDic[node.target]=node;
	}

	/**
	*@private
	*/
	__proto.getNodeDataByID=function(nodeID){
		return this._nodeIDAniDic[nodeID];
	}

	/**
	*@private
	*/
	__proto._getParams=function(obj,params,frame,obj2){
		var rst=GraphicAnimation._temParam;
		rst.length=params.length;
		var i=0,len=params.length;
		for (i=0;i < len;i++){
			rst[i]=this._getObjVar(obj,params[i][0],frame,params[i][1],obj2);
		}
		return rst;
	}

	/**
	*@private
	*/
	__proto._getObjVar=function(obj,key,frame,noValue,obj2){
		if (obj.hasOwnProperty(key)){
			var vArr=obj[key];
			if (frame >=vArr.length)
				frame=vArr.length-1;
			if(obj[key][frame]!=undefined)
				return obj[key][frame];
		}
		if (obj2.hasOwnProperty(key)){
			return obj2[key];
		}
		return noValue;
	}

	__proto._getNodeGraphicData=function(nodeID,frame,rst){
		if (!rst)
			rst=GraphicNode.create();
		if (!rst.transform){
			rst.transform=Matrix.create();
			}else{
			rst.transform.identity();
		};
		var node=this.getNodeDataByID(nodeID);
		if (!node)
			return rst;
		var frameData=node.frames;
		var params=this._getParams(frameData,GraphicAnimation._drawTextureCmd,frame,this._nodeDefaultProps[nodeID]);
		var url=params[0];
		var width=NaN,height=NaN;
		var px=params[5],py=params[6];
		var aX=params[13],aY=params[14];
		var sx=params[7],sy=params[8];
		var rotate=params[9];
		var skewX=params[11],skewY=params[12]
		width=params[3];
		height=params[4];
		if (width==0 || height==0)url=null;
		if (width==-1)width=0;
		if (height==-1)height=0;
		var tex;
		rst.skin=url;
		rst.width=width;
		rst.height=height;
		if (url){
			tex=this._getTextureByUrl(url);
			if (tex){
				if (!width)
					width=tex.sourceWidth;
				if (!height)
					height=tex.sourceHeight;
				}else {
				console.warn("lost skin:",url,",you may load pics first");
			}
		}
		rst.alpha=params[10];
		var m;
		m=rst.transform;
		if (aX !=0){
			px=aX *width;
		}
		if (aY !=0){
			py=aY *height;
		}
		if (px !=0 || py !=0){
			m.translate(-px,-py);
		};
		var tm=null;
		if (rotate || sx!==1 || sy!==1 || skewX || skewY){
			tm=GraphicAnimation._tempMt;
			tm.identity();
			tm.bTransform=true;
			var skx=(rotate-skewX)*0.0174532922222222;
			var sky=(rotate+skewY)*0.0174532922222222;
			var cx=Math.cos(sky);
			var ssx=Math.sin(sky);
			var cy=Math.sin(skx);
			var ssy=Math.cos(skx);
			tm.a=sx *cx;
			tm.b=sx *ssx;
			tm.c=-sy *cy;
			tm.d=sy *ssy;
			tm.tx=tm.ty=0;
		}
		if (tm){
			m=Matrix.mul(m,tm,m);
		}
		m.translate(params[1],params[2]);
		return rst;
	}

	/**
	*@private
	*/
	__proto._getTextureByUrl=function(url){
		return Loader.getRes(url);
	}

	/**
	*@private
	*/
	__proto.setAniData=function(uiView,aniName){
		if (uiView.animations){
			this._nodeDefaultProps={};
			this._nodeGDic={};
			if (this._nodeList)
				this._nodeList.length=0;
			this._rootNode=uiView;
			this._parseNodeList(uiView);
			var aniDic={};
			var anilist=[];
			var animations=uiView.animations;
			var i=0,len=animations.length;
			var tAniO;
			for (i=0;i < len;i++){
				tAniO=animations[i];
				this._labels=null;
				if (aniName && aniName !=tAniO.name){
					continue ;
				}
				if (!tAniO)
					continue ;
				try {
					this._calGraphicData(tAniO);
					}catch (e){
					console.warn("parse animation fail:"+tAniO.name+",empty animation created");
					this._gList=[];
				};
				var frameO={};
				frameO.interval=1000 / tAniO["frameRate"];
				frameO.frames=this._gList;
				frameO.labels=this._labels;
				frameO.name=tAniO.name;
				anilist.push(frameO);
				aniDic[tAniO.name]=frameO;
			}
			this.animationList=anilist;
			this.animationDic=aniDic;
		}
		GraphicAnimation._temParam.length=0;
	}

	__proto.parseByData=function(aniData){
		var rootNode,aniO;
		rootNode=aniData.nodeRoot;
		aniO=aniData.aniO;
		delete aniData.nodeRoot;
		delete aniData.aniO;
		this._nodeDefaultProps={};
		this._nodeGDic={};
		if (this._nodeList)
			this._nodeList.length=0;
		this._rootNode=rootNode;
		this._parseNodeList(rootNode);
		this._labels=null;
		try {
			this._calGraphicData(aniO);
			}catch (e){
			console.warn("parse animation fail:"+aniO.name+",empty animation created");
			this._gList=[];
		};
		var frameO=aniData;
		frameO.interval=1000 / aniO["frameRate"];
		frameO.frames=this._gList;
		frameO.labels=this._labels;
		frameO.name=aniO.name;
		return frameO;
	}

	/**
	*@private
	*/
	__proto.setUpAniData=function(uiView){
		if (uiView.animations){
			var aniDic={};
			var anilist=[];
			var animations=uiView.animations;
			var i=0,len=animations.length;
			var tAniO;
			for (i=0;i < len;i++){
				tAniO=animations[i];
				if (!tAniO)
					continue ;
				var frameO={};
				frameO.name=tAniO.name;
				frameO.aniO=tAniO;
				frameO.nodeRoot=uiView;
				anilist.push(frameO);
				aniDic[tAniO.name]=frameO;
			}
			this.animationList=anilist;
			this.animationDic=aniDic;
		}
	}

	/**
	*@private
	*/
	__proto._clear=function(){
		this.animationList=null;
		this.animationDic=null;
		this._gList=null;
		if (this._nodeGDic){
			var key;
			var tGNode;
			for (key in this._nodeGDic){
				tGNode=this._nodeGDic[key];
				if (tGNode)tGNode.recover();
			}
		}
		this._nodeGDic=null;
	}

	GraphicAnimation.parseAnimationByData=function(animationObject){
		if (!GraphicAnimation._I)
			GraphicAnimation._I=new GraphicAnimation();
		var rst;
		rst=GraphicAnimation._I.parseByData(animationObject);
		GraphicAnimation._I._clear();
		return rst;
	}

	GraphicAnimation.parseAnimationData=function(aniData){
		if (!GraphicAnimation._I)
			GraphicAnimation._I=new GraphicAnimation();
		GraphicAnimation._I.setUpAniData(aniData);
		var rst;
		rst={};
		rst.animationList=GraphicAnimation._I.animationList;
		rst.animationDic=GraphicAnimation._I.animationDic;
		GraphicAnimation._I._clear();
		return rst;
	}

	GraphicAnimation._drawTextureCmd=[["skin",null],["x",0],["y",0],["width",-1],["height",-1],["pivotX",0],["pivotY",0],["scaleX",1],["scaleY",1],["rotation",0],["alpha",1],["skewX",0],["skewY",0],["anchorX",0],["anchorY",0]];
	GraphicAnimation._temParam=[];
	GraphicAnimation._I=null;
	GraphicAnimation._rootMatrix=null;
	__static(GraphicAnimation,
	['_tempMt',function(){return this._tempMt=new Matrix();}
	]);
	GraphicAnimation.__init$=function(){
		//class GraphicNode
		GraphicNode=(function(){
			function GraphicNode(){
				this.skin=null;
				this.transform=null;
				this.resultTransform=null;
				this.width=NaN;
				this.height=NaN;
				this.alpha=1;
			}
			__class(GraphicNode,'');
			var __proto=GraphicNode.prototype;
			__proto.recover=function(){
				this.skin=null;
				this.width=0;
				this.height=0;
				this.alpha=1;
				if (this.transform){
					this.transform.destroy();
					this.transform=null;
				}
				if (this.resultTransform){
					this.resultTransform.destroy();
					this.resultTransform=null;
				}
				Pool.recover("GraphicNode",this);
			}
			GraphicNode.create=function(){
				return Pool.getItemByClass("GraphicNode",GraphicNode);
			}
			return GraphicNode;
		})()
	}

	return GraphicAnimation;
})(FrameAnimation)


	Laya.__init([EventDispatcher,LoaderManager,GraphicAnimation,Render,Browser,Timer,LocalStorage,TimeLine]);
})(window,document,Laya);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
//class LayaMain
var LayaMain=(function(){
	/*[COMPILER OPTIONS:normal]*/
	function LayaMain(){}
	__class(LayaMain,'LayaMain');
	return LayaMain;
})()



	/**LayaGameStart**/
	new LayaMain();

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