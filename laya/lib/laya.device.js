
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Bitmap=laya.resource.Bitmap,Browser=laya.utils.Browser,Event=laya.events.Event,EventDispatcher=laya.events.EventDispatcher;
	var Handler=laya.utils.Handler,Rectangle=laya.maths.Rectangle,Render=laya.renders.Render,Sprite=laya.display.Sprite;
	var Stage=laya.display.Stage,Texture=laya.resource.Texture,Utils=laya.utils.Utils,WebGL=laya.webgl.WebGL;
	var WebGLContext=laya.webgl.WebGLContext;
/**
*使用前可用<code>supported</code>查看浏览器支持。
*/
//class laya.device.geolocation.Geolocation
var Geolocation=(function(){
	function Geolocation(){}
	__class(Geolocation,'laya.device.geolocation.Geolocation');
	Geolocation.getCurrentPosition=function(onSuccess,onError){
		Geolocation.navigator.geolocation.getCurrentPosition(function(pos){
			Geolocation.position.setPosition(pos);
			onSuccess.runWith(Geolocation.position);
		},
		function(error){
			onError.runWith(error);
			},{
			enableHighAccuracy :laya.device.geolocation.Geolocation.enableHighAccuracy,
			timeout :laya.device.geolocation.Geolocation.timeout,
			maximumAge :laya.device.geolocation.Geolocation.maximumAge
		});
	}

	Geolocation.watchPosition=function(onSuccess,onError){
		return Geolocation.navigator.geolocation.watchPosition(function(pos){
			Geolocation.position.setPosition(pos);
			onSuccess.runWith(Geolocation.position);
		},
		function(error){
			onError.runWith(error);
			},{
			enableHighAccuracy :Geolocation.enableHighAccuracy,
			timeout :Geolocation.timeout,
			maximumAge :Geolocation.maximumAge
		});
	}

	Geolocation.clearWatch=function(id){
		Geolocation.navigator.geolocation.clearWatch(id);
	}

	Geolocation.PERMISSION_DENIED=1;
	Geolocation.POSITION_UNAVAILABLE=2;
	Geolocation.TIMEOUT=3;
	Geolocation.enableHighAccuracy=false;
	Geolocation.maximumAge=0;
	__static(Geolocation,
	['navigator',function(){return this.navigator=Browser.window.navigator;},'position',function(){return this.position=new GeolocationInfo();},'supported',function(){return this.supported=!!Geolocation.navigator.geolocation;},'timeout',function(){return this.timeout=1E10;}
	]);
	return Geolocation;
})()


//class laya.device.geolocation.GeolocationInfo
var GeolocationInfo=(function(){
	function GeolocationInfo(){
		this.pos=null;
		this.coords=null;
	}

	__class(GeolocationInfo,'laya.device.geolocation.GeolocationInfo');
	var __proto=GeolocationInfo.prototype;
	__proto.setPosition=function(pos){
		this.pos=pos;
		this.coords=pos.coords;
	}

	__getset(0,__proto,'heading',function(){
		return this.coords.heading;
	});

	__getset(0,__proto,'latitude',function(){
		return this.coords.latitude;
	});

	__getset(0,__proto,'altitudeAccuracy',function(){
		return this.coords.altitudeAccuracy;
	});

	__getset(0,__proto,'longitude',function(){
		return this.coords.longitude;
	});

	__getset(0,__proto,'altitude',function(){
		return this.coords.altitude;
	});

	__getset(0,__proto,'accuracy',function(){
		return this.coords.accuracy;
	});

	__getset(0,__proto,'speed',function(){
		return this.coords.speed;
	});

	__getset(0,__proto,'timestamp',function(){
		return this.pos.timestamp;
	});

	return GeolocationInfo;
})()


/**
*Media用于捕捉摄像头和麦克风。可以捕捉任意之一，或者同时捕捉两者。<code>getCamera</code>前可以使用<code>supported()</code>检查当前浏览器是否支持。
*<b>NOTE:</b>
*<p>目前Media在移动平台只支持Android，不支持IOS。只可在FireFox完整地使用，Chrome测试时无法捕捉视频。</p>
*/
//class laya.device.media.Media
var Media=(function(){
	function Media(){}
	__class(Media,'laya.device.media.Media');
	Media.supported=function(){
		return !!Browser.window.navigator.getUserMedia;
	}

	Media.getMedia=function(options,onSuccess,onError){
		if (Browser.window.navigator.getUserMedia){
			Browser.window.navigator.getUserMedia(options,function(stream){
				onSuccess.runWith(Browser.window.URL.createObjectURL(stream));
				},function(err){
				onError.runWith(err);
			});
		}
	}

	Media.__init$=function(){
		/*__JS__ */navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;;
	}

	return Media;
})()


/**
*加速度x/y/z的单位均为m/s²。
*在硬件（陀螺仪）不支持的情况下，alpha、beta和gamma值为null。
*
*@author Survivor
*/
//class laya.device.motion.AccelerationInfo
var AccelerationInfo=(function(){
	function AccelerationInfo(){
		/**
		*x轴上的加速度值。
		*/
		this.x=NaN;
		/**
		*y轴上的加速度值。
		*/
		this.y=NaN;
		/**
		*z轴上的加速度值。
		*/
		this.z=NaN;
	}

	__class(AccelerationInfo,'laya.device.motion.AccelerationInfo');
	return AccelerationInfo;
})()


/**
*保存旋转信息的类。请勿修改本类的属性。
*@author Survivor
*/
//class laya.device.motion.RotationInfo
var RotationInfo=(function(){
	function RotationInfo(){
		/**
		*<p>
		*指示设备是否可以提供绝对方位数据（指向地球坐标系），或者设备决定的任意坐标系。
		*关于坐标系参见<i>https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained</i>。
		*</p>
		*需要注意的是，IOS环境下，该值始终为false。即使如此，你依旧可以从<code>alpha</code>中取得正确的值。
		*/
		this.absolute=false;
		/**
		*Z轴旋转角度，其值范围从0至360。
		*若<code>absolute</code>为true或者在IOS中，alpha值是从北方到当前设备方向的角度值。
		*/
		this.alpha=NaN;
		/**
		*X轴旋转角度,其值范围从-180至180。代表设备从前至后的运动。
		*/
		this.beta=NaN;
		/**
		*Y轴旋转角度，其值范围从-90至90。代表设备从左至右的运动。
		*/
		this.gamma=NaN;
		/**
		*罗盘数据的精确度（角度）。仅IOS可用。
		*/
		this.compassAccuracy=NaN;
	}

	__class(RotationInfo,'laya.device.motion.RotationInfo');
	return RotationInfo;
})()


/**
*Accelerator.instance获取唯一的Accelerator引用，请勿调用构造函数。
*
*<p>
*listen()的回调处理器接受四个参数：
*<ol>
*<li><b>acceleration</b>:表示用户给予设备的加速度。</li>
*<li><b>accelerationIncludingGravity</b>:设备受到的总加速度（包含重力）。</li>
*<li><b>rotationRate</b>:设备的自转速率。</li>
*<li><b>interval</b>:加速度获取的时间间隔（毫秒）。</li>
*</ol>
*</p>
*<p>
*<b>NOTE</b><br/>
*如，rotationRate的alpha在apple和moz文档中都是z轴旋转角度，但是实测是x轴旋转角度。为了使各属性表示的值与文档所述相同，实际值与其他属性进行了对调。
*其中：
*<ul>
*<li>alpha使用gamma值。</li>
*<li>beta使用alpha值。</li>
*<li>gamma使用beta。</li>
*</ul>
*目前孰是孰非尚未可知，以此为注。
*</p>
*/
//class laya.device.motion.Accelerator extends laya.events.EventDispatcher
var Accelerator=(function(_super){
	function Accelerator(singleton){
		Accelerator.__super.call(this);
		/*__JS__ */this.onDeviceOrientationChange=this.onDeviceOrientationChange.bind(this);
	}

	__class(Accelerator,'laya.device.motion.Accelerator',_super);
	var __proto=Accelerator.prototype;
	/**
	*侦听加速器运动。
	*@param observer 回调函数接受4个参数，见类说明。
	*/
	__proto.on=function(type,caller,listener,args){
		_super.prototype.on.call(this,type,caller,listener,args);
		Browser.window.addEventListener('devicemotion',this.onDeviceOrientationChange);
		return this;
	}

	/**
	*取消侦听加速器。
	*@param handle 侦听加速器所用处理器。
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (!this.hasListener(type))
			Browser.window.removeEventListener('devicemotion',this.onDeviceOrientationChange)
		return _super.prototype.off.call(this,type,caller,listener,onceOnly);
	}

	__proto.onDeviceOrientationChange=function(e){
		var interval=e.interval;
		Accelerator.acceleration.x=e.acceleration.x;
		Accelerator.acceleration.y=e.acceleration.y;
		Accelerator.acceleration.z=e.acceleration.z;
		Accelerator.accelerationIncludingGravity.x=e.accelerationIncludingGravity.x;
		Accelerator.accelerationIncludingGravity.y=e.accelerationIncludingGravity.y;
		Accelerator.accelerationIncludingGravity.z=e.accelerationIncludingGravity.z;
		Accelerator.rotationRate.alpha=e.rotationRate.gamma *-1;
		Accelerator.rotationRate.beta=e.rotationRate.alpha *-1;
		Accelerator.rotationRate.gamma=e.rotationRate.beta;
		if (Browser.onAndroid){
			if (Accelerator.onChrome){
				Accelerator.rotationRate.alpha *=180 / Math.PI;
				Accelerator.rotationRate.beta *=180 / Math.PI;
				Accelerator.rotationRate.gamma *=180 / Math.PI;
			}
			Accelerator.acceleration.x *=-1;
			Accelerator.accelerationIncludingGravity.x *=-1;
		}
		else if (Browser.onIOS){
			Accelerator.acceleration.y *=-1;
			Accelerator.acceleration.z *=-1;
			Accelerator.accelerationIncludingGravity.y *=-1;
			Accelerator.accelerationIncludingGravity.z *=-1;
			interval *=1000;
		}
		this.event(/*laya.events.Event.CHANGE*/"change",[Accelerator.acceleration,Accelerator.accelerationIncludingGravity,Accelerator.rotationRate,interval]);
	}

	__getset(1,Accelerator,'instance',function(){Accelerator._instance=Accelerator._instance|| new Accelerator(0)
		return Accelerator._instance;
	},laya.events.EventDispatcher._$SET_instance);

	Accelerator.getTransformedAcceleration=function(acceleration){Accelerator.transformedAcceleration=Accelerator.transformedAcceleration|| new AccelerationInfo();
		Accelerator.transformedAcceleration.z=acceleration.z;
		if (Browser.window.orientation==90){
			Accelerator.transformedAcceleration.x=acceleration.y;
			Accelerator.transformedAcceleration.y=-acceleration.x;
		}
		else if (Browser.window.orientation==-90){
			Accelerator.transformedAcceleration.x=-acceleration.y;
			Accelerator.transformedAcceleration.y=acceleration.x;
		}
		else if (!Browser.window.orientation){
			Accelerator.transformedAcceleration.x=acceleration.x;
			Accelerator.transformedAcceleration.y=acceleration.y;
		}
		else if (Browser.window.orientation==180){
			Accelerator.transformedAcceleration.x=-acceleration.x;
			Accelerator.transformedAcceleration.y=-acceleration.y;
		};
		var tx=NaN;
		if (Laya.stage.canvasDegree==-90){
			tx=Accelerator.transformedAcceleration.x;
			Accelerator.transformedAcceleration.x=-Accelerator.transformedAcceleration.y;
			Accelerator.transformedAcceleration.y=tx;
		}
		else if (Laya.stage.canvasDegree==90){
			tx=Accelerator.transformedAcceleration.x;
			Accelerator.transformedAcceleration.x=Accelerator.transformedAcceleration.y;
			Accelerator.transformedAcceleration.y=-tx;
		}
		return Accelerator.transformedAcceleration;
	}

	Accelerator._instance=null;
	Accelerator.transformedAcceleration=null;
	__static(Accelerator,
	['acceleration',function(){return this.acceleration=new AccelerationInfo();},'accelerationIncludingGravity',function(){return this.accelerationIncludingGravity=new AccelerationInfo();},'rotationRate',function(){return this.rotationRate=new RotationInfo();},'onChrome',function(){return this.onChrome=(Browser.userAgent.indexOf("Chrome")>-1);}
	]);
	return Accelerator;
})(EventDispatcher)


/**
*使用Gyroscope.instance获取唯一的Gyroscope引用，请勿调用构造函数。
*
*<p>
*listen()的回调处理器接受两个参数：
*<code>function onOrientationChange(absolute:Boolean,info:RotationInfo):void</code>
*<ol>
*<li><b>absolute</b>:指示设备是否可以提供绝对方位数据（指向地球坐标系），或者设备决定的任意坐标系。关于坐标系参见<i>https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained</i>。</li>
*<li><b>info</b>:<code>RotationInfo</code>类型参数，保存设备的旋转值。</li>
*</ol>
*</p>
*
*<p>
*浏览器兼容性参见：<i>http://caniuse.com/#search=deviceorientation</i>
*</p>
*/
//class laya.device.motion.Gyroscope extends laya.events.EventDispatcher
var Gyroscope=(function(_super){
	function Gyroscope(singleton){
		Gyroscope.__super.call(this);
		/*__JS__ */this.onDeviceOrientationChange=this.onDeviceOrientationChange.bind(this);
	}

	__class(Gyroscope,'laya.device.motion.Gyroscope',_super);
	var __proto=Gyroscope.prototype;
	/**
	*监视陀螺仪运动。
	*@param observer 回调函数接受一个Boolean类型的<code>absolute</code>和<code>GyroscopeInfo</code>类型参数。
	*/
	__proto.on=function(type,caller,listener,args){
		_super.prototype.on.call(this,type,caller,listener,args);
		Browser.window.addEventListener('deviceorientation',this.onDeviceOrientationChange);
		return this;
	}

	/**
	*取消指定处理器对陀螺仪的监视。
	*@param observer
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (!this.hasListener(type))
			Browser.window.removeEventListener('deviceorientation',this.onDeviceOrientationChange);
		return _super.prototype.off.call(this,type,caller,listener,onceOnly);
	}

	__proto.onDeviceOrientationChange=function(e){
		Gyroscope.info.alpha=e.alpha;
		Gyroscope.info.beta=e.beta;
		Gyroscope.info.gamma=e.gamma;
		if (e.webkitCompassHeading){
			Gyroscope.info.alpha=e.webkitCompassHeading *-1;
			Gyroscope.info.compassAccuracy=e.webkitCompassAccuracy;
		}
		this.event(/*laya.events.Event.CHANGE*/"change",[e.absolute,Gyroscope.info]);
	}

	__getset(1,Gyroscope,'instance',function(){Gyroscope._instance=Gyroscope._instance|| new Gyroscope(0);
		return Gyroscope._instance;
	},laya.events.EventDispatcher._$SET_instance);

	Gyroscope._instance=null;
	__static(Gyroscope,
	['info',function(){return this.info=new RotationInfo();}
	]);
	return Gyroscope;
})(EventDispatcher)


/**
*Shake只能在支持此操作的设备上有效。
*
*@author Survivor
*/
//class laya.device.Shake extends laya.events.EventDispatcher
var Shake=(function(_super){
	function Shake(){
		this.throushold=0;
		this.shakeInterval=0;
		this.callback=null;
		this.lastX=NaN;
		this.lastY=NaN;
		this.lastZ=NaN;
		this.lastMillSecond=NaN;
		Shake.__super.call(this);
	}

	__class(Shake,'laya.device.Shake',_super);
	var __proto=Shake.prototype;
	/**
	*开始响应设备摇晃。
	*@param throushold 响应的瞬时速度阈值，轻度摇晃的值约在5~10间。
	*@param timeout 设备摇晃的响应间隔时间。
	*@param callback 在设备摇晃触发时调用的处理器。
	*/
	__proto.start=function(throushold,interval){
		this.throushold=throushold;
		this.shakeInterval=interval;
		this.lastX=this.lastY=this.lastZ=NaN;
		Accelerator.instance.on(/*laya.events.Event.CHANGE*/"change",this,this.onShake);
	}

	/**
	*停止响应设备摇晃。
	*/
	__proto.stop=function(){
		Accelerator.instance.off(/*laya.events.Event.CHANGE*/"change",this,this.onShake);
	}

	__proto.onShake=function(acceleration,accelerationIncludingGravity,rotationRate,interval){
		if(isNaN(this.lastX)){
			this.lastX=accelerationIncludingGravity.x;
			this.lastY=accelerationIncludingGravity.y;
			this.lastZ=accelerationIncludingGravity.z;
			this.lastMillSecond=Browser.now();
			return;
		};
		var deltaX=Math.abs(this.lastX-accelerationIncludingGravity.x);
		var deltaY=Math.abs(this.lastY-accelerationIncludingGravity.y);
		var deltaZ=Math.abs(this.lastZ-accelerationIncludingGravity.z);
		if(this.isShaked(deltaX,deltaY,deltaZ)){
			var deltaMillSecond=Browser.now()-this.lastMillSecond;
			if (deltaMillSecond > this.shakeInterval){
				this.event(/*laya.events.Event.CHANGE*/"change");
				this.lastMillSecond=Browser.now();
			}
		}
		this.lastX=accelerationIncludingGravity.x;
		this.lastY=accelerationIncludingGravity.y;
		this.lastZ=accelerationIncludingGravity.z;
	}

	// 通过任意两个分量判断是否满足摇晃设定。
	__proto.isShaked=function(deltaX,deltaY,deltaZ){
		return (deltaX > this.throushold && deltaY > this.throushold)||
		(deltaX > this.throushold && deltaZ > this.throushold)||
		(deltaY > this.throushold && deltaZ > this.throushold)
	}

	__getset(1,Shake,'instance',function(){Shake._instance=Shake._instance|| new Shake();
		return Shake._instance;
	},laya.events.EventDispatcher._$SET_instance);

	Shake._instance=null;
	return Shake;
})(EventDispatcher)


/**
*<code>Video</code>将视频显示到Canvas上。<code>Video</code>可能不会在所有浏览器有效。
*<p>关于Video支持的所有事件参见：<i>http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp</i>。</p>
*<p>
*<b>注意：</b><br/>
*在PC端可以在任何时机调用<code>play()</code>因此，可以在程序开始运行时就使Video开始播放。但是在移动端，只有在用户第一次触碰屏幕后才可以调用play()，所以移动端不可能在程序开始运行时就自动开始播放Video。
*</p>
*
*<p>MDN Video链接： <i>https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video</i></p>
*/
//class laya.device.media.Video extends laya.display.Sprite
var Video=(function(_super){
	function Video(width,height){
		this.htmlVideo=null;
		this.videoElement=null;
		this.internalTexture=null;
		(width===void 0)&& (width=320);
		(height===void 0)&& (height=240);
		Video.__super.call(this);
		if (Render.isWebGL)
			this.htmlVideo=new WebGLVideo();
		else
		this.htmlVideo=new HtmlVideo();
		this.videoElement=this.htmlVideo.getVideo();
		this.videoElement.layaTarget=this;
		this.internalTexture=new Texture(this.htmlVideo);
		this.videoElement.addEventListener("abort",Video.onAbort);
		this.videoElement.addEventListener("canplay",Video.onCanplay);
		this.videoElement.addEventListener("canplaythrough",Video.onCanplaythrough);
		this.videoElement.addEventListener("durationchange",Video.onDurationchange);
		this.videoElement.addEventListener("emptied",Video.onEmptied);
		this.videoElement.addEventListener("error",Video.onError);
		this.videoElement.addEventListener("loadeddata",Video.onLoadeddata);
		this.videoElement.addEventListener("loadedmetadata",Video.onLoadedmetadata);
		this.videoElement.addEventListener("loadstart",Video.onLoadstart);
		this.videoElement.addEventListener("pause",Video.onPause);
		this.videoElement.addEventListener("play",Video.onPlay);
		this.videoElement.addEventListener("playing",Video.onPlaying);
		this.videoElement.addEventListener("progress",Video.onProgress);
		this.videoElement.addEventListener("ratechange",Video.onRatechange);
		this.videoElement.addEventListener("seeked",Video.onSeeked);
		this.videoElement.addEventListener("seeking",Video.onSeeking);
		this.videoElement.addEventListener("stalled",Video.onStalled);
		this.videoElement.addEventListener("suspend",Video.onSuspend);
		this.videoElement.addEventListener("timeupdate",Video.onTimeupdate);
		this.videoElement.addEventListener("volumechange",Video.onVolumechange);
		this.videoElement.addEventListener("waiting",Video.onWaiting);
		this.videoElement.addEventListener("ended",this.onPlayComplete['bind'](this));
		this.size(width,height);
		if (Browser.onMobile){
			/*__JS__ */this.onDocumentClick=this.onDocumentClick.bind(this);
			Browser.document.addEventListener("touchend",this.onDocumentClick);
		}
	}

	__class(Video,'laya.device.media.Video',_super);
	var __proto=Video.prototype;
	__proto.onPlayComplete=function(e){
		Laya.timer.clear(this,this.renderCanvas);
		this.event("ended");
	}

	/**
	*设置播放源。
	*@param url 播放源路径。
	*/
	__proto.load=function(url){
		if (url.indexOf("blob:")==0)
			this.videoElement.src=url;
		else
		this.htmlVideo.setSource(url,laya.device.media.Video.MP4);
	}

	/**
	*开始播放视频。
	*/
	__proto.play=function(){
		this.videoElement.play();
		Laya.timer.frameLoop(1,this,this.renderCanvas);
	}

	/**
	*暂停视频播放。
	*/
	__proto.pause=function(){
		this.videoElement.pause();
		Laya.timer.clear(this,this.renderCanvas);
	}

	/**
	*重新加载视频。
	*/
	__proto.reload=function(){
		this.videoElement.load();
	}

	/**
	*检测是否支持播放指定格式视频。
	*@param type 参数为Video.MP4 / Video.OGG / Video.WEBM之一。
	*@return 表示支持的级别。可能的值：
	*<ul>
	*<li>"probably"，Video.SUPPORT_PROBABLY-浏览器最可能支持该音频/视频类型</li>
	*<li>"maybe"，Video.SUPPORT_MAYBY-浏览器也许支持该音频/视频类型</li>
	*<li>""，Video.SUPPORT_NO-（空字符串）浏览器不支持该音频/视频类型</li>
	*</ul>
	*/
	__proto.canPlayType=function(type){
		var typeString;
		switch (type){
			case laya.device.media.Video.MP4:
				typeString="video/mp4";
				break ;
			case laya.device.media.Video.OGG:
				typeString="video/ogg";
				break ;
			case laya.device.media.Video.WEBM:
				typeString="video/webm";
				break ;
			}
		return this.videoElement.canPlayType(typeString);
	}

	__proto.renderCanvas=function(){
		if (this.readyState===0)
			return;
		if (Render.isWebGL)
			this.htmlVideo['updateTexture']();
		this.graphics.clear();
		this.graphics.drawTexture(this.internalTexture,0,0,this.width,this.height);
	}

	__proto.onDocumentClick=function(){
		this.videoElement.play();
		this.videoElement.pause();
		Browser.document.removeEventListener("touchend",this.onDocumentClick);
	}

	__proto.size=function(width,height){
		_super.prototype.size.call(this,width,height)
		this.videoElement.width=width / Browser.pixelRatio;
		if (this.paused)this.renderCanvas();
		return this;
	}

	/**
	*销毁内部事件绑定。
	*/
	__proto.destroy=function(detroyChildren){
		(detroyChildren===void 0)&& (detroyChildren=true);
		_super.prototype.destroy.call(this,detroyChildren);
		this.videoElement.removeEventListener("abort",Video.onAbort);
		this.videoElement.removeEventListener("canplay",Video.onCanplay);
		this.videoElement.removeEventListener("canplaythrough",Video.onCanplaythrough);
		this.videoElement.removeEventListener("durationchange",Video.onDurationchange);
		this.videoElement.removeEventListener("emptied",Video.onEmptied);
		this.videoElement.removeEventListener("error",Video.onError);
		this.videoElement.removeEventListener("loadeddata",Video.onLoadeddata);
		this.videoElement.removeEventListener("loadedmetadata",Video.onLoadedmetadata);
		this.videoElement.removeEventListener("loadstart",Video.onLoadstart);
		this.videoElement.removeEventListener("pause",Video.onPause);
		this.videoElement.removeEventListener("play",Video.onPlay);
		this.videoElement.removeEventListener("playing",Video.onPlaying);
		this.videoElement.removeEventListener("progress",Video.onProgress);
		this.videoElement.removeEventListener("ratechange",Video.onRatechange);
		this.videoElement.removeEventListener("seeked",Video.onSeeked);
		this.videoElement.removeEventListener("seeking",Video.onSeeking);
		this.videoElement.removeEventListener("stalled",Video.onStalled);
		this.videoElement.removeEventListener("suspend",Video.onSuspend);
		this.videoElement.removeEventListener("timeupdate",Video.onTimeupdate);
		this.videoElement.removeEventListener("volumechange",Video.onVolumechange);
		this.videoElement.removeEventListener("waiting",Video.onWaiting);
		this.videoElement.removeEventListener("ended",this.onPlayComplete);
		this.pause();
		this.videoElement=null;
	}

	__proto.syncVideoPosition=function(){
		var stage=Laya.stage;
		var rec;
		rec=Utils.getGlobalPosAndScale(this);
		var a=stage._canvasTransform.a,d=stage._canvasTransform.d;
		var x=rec.x *stage.clientScaleX *a+stage.offset.x;
		var y=rec.y *stage.clientScaleY *d+stage.offset.y;
		this.videoElement.style.left=x+'px';;
		this.videoElement.style.top=y+'px';
		this.videoElement.width=this.width / Browser.pixelRatio;
		this.videoElement.height=this.height / Browser.pixelRatio;
	}

	/**
	*buffered 属性返回 TimeRanges(JS)对象。TimeRanges 对象表示用户的音视频缓冲范围。缓冲范围指的是已缓冲音视频的时间范围。如果用户在音视频中跳跃播放，会得到多个缓冲范围。
	*<p>buffered.length返回缓冲范围个数。如获取第一个缓冲范围则是buffered.start(0)和buffered.end(0)。以秒计。</p>
	*@return TimeRanges(JS)对象
	*/
	__getset(0,__proto,'buffered',function(){
		return this.videoElement.buffered;
	});

	/**
	*获取视频源尺寸。ready事件触发后可用。
	*/
	__getset(0,__proto,'videoWidth',function(){
		return this.videoElement.videoWidth;
	});

	/**
	*获取当前播放源路径。
	*/
	__getset(0,__proto,'currentSrc',function(){
		return this.videoElement.currentSrc;
	});

	/**
	*设置和获取当前播放头位置。
	*/
	__getset(0,__proto,'currentTime',function(){
		return this.videoElement.currentTime;
		},function(value){
		this.videoElement.currentTime=value;
		this.renderCanvas();
	});

	/**
	*返回音频/视频的播放是否已结束
	*/
	__getset(0,__proto,'ended',function(){
		return this.videoElement.ended;
	});

	/**
	*设置和获取当前音量。
	*/
	__getset(0,__proto,'volume',function(){
		return this.videoElement.volume;
		},function(value){
		this.videoElement.volume=value;
	});

	__getset(0,__proto,'videoHeight',function(){
		return this.videoElement.videoHeight;
	});

	/**
	*表示视频元素的就绪状态：
	*<ul>
	*<li>0=HAVE_NOTHING-没有关于音频/视频是否就绪的信息</li>
	*<li>1=HAVE_METADATA-关于音频/视频就绪的元数据</li>
	*<li>2=HAVE_CURRENT_DATA-关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒</li>
	*<li>3=HAVE_FUTURE_DATA-当前及至少下一帧的数据是可用的</li>
	*<li>4=HAVE_ENOUGH_DATA-可用数据足以开始播放</li>
	*</ul>
	*/
	__getset(0,__proto,'readyState',function(){
		return this.videoElement.readyState;
	});

	/**
	*获取视频长度（秒）。ready事件触发后可用。
	*/
	__getset(0,__proto,'duration',function(){
		return this.videoElement.duration;
	});

	/**
	*返回表示音频/视频错误状态的 MediaError（JS）对象。
	*/
	__getset(0,__proto,'error',function(){
		return this.videoElement.error;
	});

	/**
	*设置或返回音频/视频是否应在结束时重新播放。
	*/
	__getset(0,__proto,'loop',function(){
		return this.videoElement.loop;
		},function(value){
		this.videoElement.loop=value;
	});

	/**
	*playbackRate 属性设置或返回音频/视频的当前播放速度。如：
	*<ul>
	*<li>1.0 正常速度</li>
	*<li>0.5 半速（更慢）</li>
	*<li>2.0 倍速（更快）</li>
	*<li>-1.0 向后，正常速度</li>
	*<li>-0.5 向后，半速</li>
	*</ul>
	*<p>只有 Google Chrome 和 Safari 支持 playbackRate 属性。</p>
	*/
	__getset(0,__proto,'playbackRate',function(){
		return this.videoElement.playbackRate;
		},function(value){
		this.videoElement.playbackRate=value;
	});

	/**
	*获取和设置静音状态。
	*/
	__getset(0,__proto,'muted',function(){
		return this.videoElement.muted;
		},function(value){
		this.videoElement.muted=value;
	});

	/**
	*返回视频是否暂停
	*/
	__getset(0,__proto,'paused',function(){
		return this.videoElement.paused;
	});

	/**
	*preload 属性设置或返回是否在页面加载后立即加载视频。可赋值如下：
	*<ul>
	*<li>auto 指示一旦页面加载，则开始加载视频。</li>
	*<li>metadata 指示当页面加载后仅加载音频/视频的元数据。</li>
	*<li>none 指示页面加载后不应加载音频/视频。</li>
	*</ul>
	*/
	__getset(0,__proto,'preload',function(){
		return this.videoElement.preload;
		},function(value){
		this.videoElement.preload=value;
	});

	/**
	*参见 <i>http://www.w3school.com.cn/tags/av_prop_seekable.asp</i>。
	*/
	__getset(0,__proto,'seekable',function(){
		return this.videoElement.seekable;
	});

	/**
	*seeking 属性返回用户目前是否在音频/视频中寻址。
	*寻址中（Seeking）指的是用户在音频/视频中移动/跳跃到新的位置。
	*/
	__getset(0,__proto,'seeking',function(){
		return this.videoElement.seeking;
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Sprite,this,'height',value);
		if (this.paused)this.renderCanvas();
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		this.videoElement.width=this.width / Browser.pixelRatio;
		Laya.superSet(Sprite,this,'width',value);
		if (this.paused)this.renderCanvas();
	});

	Video.onAbort=function(e){e.target.layaTarget.event("abort")}
	Video.onCanplay=function(e){e.target.layaTarget.event("canplay")}
	Video.onCanplaythrough=function(e){e.target.layaTarget.event("canplaythrough")}
	Video.onDurationchange=function(e){e.target.layaTarget.event("durationchange")}
	Video.onEmptied=function(e){e.target.layaTarget.event("emptied")}
	Video.onError=function(e){e.target.layaTarget.event("error")}
	Video.onLoadeddata=function(e){e.target.layaTarget.event("loadeddata")}
	Video.onLoadedmetadata=function(e){e.target.layaTarget.event("loadedmetadata")}
	Video.onLoadstart=function(e){e.target.layaTarget.event("loadstart")}
	Video.onPause=function(e){e.target.layaTarget.event("pause")}
	Video.onPlay=function(e){e.target.layaTarget.event("play")}
	Video.onPlaying=function(e){e.target.layaTarget.event("playing")}
	Video.onProgress=function(e){e.target.layaTarget.event("progress")}
	Video.onRatechange=function(e){e.target.layaTarget.event("ratechange")}
	Video.onSeeked=function(e){e.target.layaTarget.event("seeked")}
	Video.onSeeking=function(e){e.target.layaTarget.event("seeking")}
	Video.onStalled=function(e){e.target.layaTarget.event("stalled")}
	Video.onSuspend=function(e){e.target.layaTarget.event("suspend")}
	Video.onTimeupdate=function(e){e.target.layaTarget.event("timeupdate")}
	Video.onVolumechange=function(e){e.target.layaTarget.event("volumechange")}
	Video.onWaiting=function(e){e.target.layaTarget.event("waiting")}
	Video.MP4=1;
	Video.OGG=2;
	Video.CAMERA=4;
	Video.WEBM=8;
	Video.SUPPORT_PROBABLY="probably";
	Video.SUPPORT_MAYBY="maybe";
	Video.SUPPORT_NO="";
	return Video;
})(Sprite)


/**
*@private
*/
//class laya.device.media.HtmlVideo extends laya.resource.Bitmap
var HtmlVideo=(function(_super){
	function HtmlVideo(){
		this.video=null;
		HtmlVideo.__super.call(this);
		this._w=1;
		this._h=1;
		this.createDomElement();
	}

	__class(HtmlVideo,'laya.device.media.HtmlVideo',_super);
	var __proto=HtmlVideo.prototype;
	__proto.createDomElement=function(){
		var _$this=this;
		this._source=this.video=Browser.createElement("video");
		var style=this.video.style;
		style.position='absolute';
		style.top='0px';
		style.left='0px';
		this.video.addEventListener("loadedmetadata",(function(){
			this._w=_$this.video.videoWidth;
			this._h=_$this.video.videoHeight;
		})['bind'](this));
	}

	__proto.setSource=function(url,extension){
		while(this.video.childElementCount)
		this.video.firstChild.remove();
		if (extension & Video.MP4)
			this.appendSource(url,"video/mp4");
		if (extension & Video.OGG)
			this.appendSource(url+".ogg","video/ogg");
	}

	__proto.appendSource=function(source,type){
		var sourceElement=Browser.createElement("source");
		sourceElement.src=source;
		sourceElement.type=type;
		this.video.appendChild(sourceElement);
	}

	__proto.getVideo=function(){
		return this.video;
	}

	HtmlVideo.create=function(){
		return new HtmlVideo();
	}

	return HtmlVideo;
})(Bitmap)


/**
*@private
*/
//class laya.device.media.WebGLVideo extends laya.device.media.HtmlVideo
var WebGLVideo=(function(_super){
	function WebGLVideo(){
		this.gl=null;
		this.preTarget=null;
		this.preTexture=null;
		WebGLVideo.__super.call(this);
		if(Browser.onIPhone)
			return;
		this.gl=WebGL.mainContext;
		this._source=this.gl.createTexture();
		this.preTarget=WebGLContext.curBindTexTarget;
		this.preTexture=WebGLContext.curBindTexValue;
		WebGLContext.bindTexture(this.gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		(this.preTarget && this.preTexture)&& (WebGLContext.bindTexture(this.gl,this.preTarget,this.preTexture));
	}

	__class(WebGLVideo,'laya.device.media.WebGLVideo',_super);
	var __proto=WebGLVideo.prototype;
	__proto.updateTexture=function(){
		if(Browser.onIPhone)
			return;
		WebGLContext.bindTexture(this.gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		this.gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGB*/0x1907,/*laya.webgl.WebGLContext.RGB*/0x1907,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,this.video);
	}

	return WebGLVideo;
})(HtmlVideo)


	Laya.__init([Media]);
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