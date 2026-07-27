
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Browser=laya.utils.Browser,Config=Laya.Config,Event=laya.events.Event,EventDispatcher=laya.events.EventDispatcher;
	var HTMLImage=laya.resource.HTMLImage,Handler=laya.utils.Handler,Input=laya.display.Input,Loader=laya.net.Loader;
	var LocalStorage=laya.net.LocalStorage,Matrix=laya.maths.Matrix,Render=laya.renders.Render,RunDriver=laya.utils.RunDriver;
	var SoundChannel=laya.media.SoundChannel,SoundManager=laya.media.SoundManager,URL=laya.net.URL,Utils=laya.utils.Utils;
/**@private **/
//class laya.qg.mini.MiniFileMgr
var MiniFileMgr$3=(function(){
	function MiniFileMgr(){}
	__class(MiniFileMgr,'laya.qg.mini.MiniFileMgr',null,'MiniFileMgr$3');
	MiniFileMgr.isLocalNativeFile=function(url){
		for(var i=0,sz=QGMiniAdapter.nativefiles.length;i<sz;i++){
			if(url.indexOf(QGMiniAdapter.nativefiles[i])!=-1)
				return true;
		}
		return false;
	}

	MiniFileMgr.getFileInfo=function(fileUrl){
		var fileNativePath=fileUrl;
		var fileObj=MiniFileMgr.filesListObj[fileNativePath];
		if (fileObj==null)
			return null;
		else
		return fileObj;
		return null;
	}

	MiniFileMgr.read=function(filePath,encoding,callBack,readyUrl,isSaveFile,fileType){
		(encoding===void 0)&& (encoding="utf8");
		(readyUrl===void 0)&& (readyUrl="");
		(isSaveFile===void 0)&& (isSaveFile=false);
		(fileType===void 0)&& (fileType="");
		var fileUrl;
		if(readyUrl!="" && (readyUrl.indexOf("http://")!=-1 || readyUrl.indexOf("https://")!=-1)){
			fileUrl=MiniFileMgr.getFileNativePath(filePath)
			}else{
			fileUrl=filePath;
		}
		MiniFileMgr.fs.readFile({filePath:fileUrl,encoding:encoding,success:function (data){
				callBack !=null && callBack.runWith([0,data]);
				},fail:function (data){
				if (data && readyUrl !="")
					MiniFileMgr.downFiles(readyUrl,encoding,callBack,readyUrl,isSaveFile,fileType);
				else
				callBack !=null && callBack.runWith([1]);
		}});
	}

	MiniFileMgr.downFiles=function(fileUrl,encoding,callBack,readyUrl,isSaveFile,fileType,isAutoClear){
		(encoding===void 0)&& (encoding="utf8");
		(readyUrl===void 0)&& (readyUrl="");
		(isSaveFile===void 0)&& (isSaveFile=false);
		(fileType===void 0)&& (fileType="");
		(isAutoClear===void 0)&& (isAutoClear=true);
		var downloadTask=MiniFileMgr.wxdown({url:fileUrl,success:function (data){
				if (data.statusCode===200)
					MiniFileMgr.readFile(data.tempFilePath,encoding,callBack,readyUrl,isSaveFile,fileType,isAutoClear);
				else
				if(data.statusCode===403){
					callBack !=null && callBack.runWith([0,fileUrl]);
					}else{
					callBack !=null && callBack.runWith([1,data]);
				}
				},fail:function (data){
				callBack !=null && callBack.runWith([1,data]);
		}});
		downloadTask.onProgressUpdate(function(data){
			callBack !=null && callBack.runWith([2,data.progress]);
		});
	}

	MiniFileMgr.readFile=function(filePath,encoding,callBack,readyUrl,isSaveFile,fileType,isAutoClear){
		(encoding===void 0)&& (encoding="utf8");
		(readyUrl===void 0)&& (readyUrl="");
		(isSaveFile===void 0)&& (isSaveFile=false);
		(fileType===void 0)&& (fileType="");
		(isAutoClear===void 0)&& (isAutoClear=true);
		MiniFileMgr.fs.readFile({filePath:filePath,encoding:encoding,success:function (data){
				if (filePath.indexOf("http://")!=-1 || filePath.indexOf("https://")!=-1){
					if(QGMiniAdapter.autoCacheFile || isSaveFile){
						MiniFileMgr.copyFile(filePath,readyUrl,callBack,encoding,isAutoClear);
					}
				}
				else
				callBack !=null && callBack.runWith([0,data]);
				},fail:function (data){
				if (data)
					callBack !=null && callBack.runWith([1,data]);
		}});
	}

	MiniFileMgr.downOtherFiles=function(fileUrl,callBack,readyUrl,isSaveFile,isAutoClear){
		(readyUrl===void 0)&& (readyUrl="");
		(isSaveFile===void 0)&& (isSaveFile=false);
		(isAutoClear===void 0)&& (isAutoClear=true);
		MiniFileMgr.wxdown({url:fileUrl,success:function (data){
				if (data.statusCode===200){
					if((QGMiniAdapter.autoCacheFile || isSaveFile)&& readyUrl.indexOf("qlogo.cn")==-1 && readyUrl.indexOf(".php")==-1){
						callBack !=null && callBack.runWith([0,data.tempFilePath]);
						MiniFileMgr.copyFile(data.tempFilePath,readyUrl,null,"",isAutoClear);
					}
					else
					callBack !=null && callBack.runWith([0,data.tempFilePath]);
					}else{
					callBack !=null && callBack.runWith([1,data]);
				}
				},fail:function (data){
				callBack !=null && callBack.runWith([1,data]);
		}});
	}

	MiniFileMgr.downLoadFile=function(fileUrl,fileType,callBack,encoding){
		(fileType===void 0)&& (fileType="");
		(encoding===void 0)&& (encoding="utf8");
		if(QGMiniAdapter.window.navigator.userAgent.indexOf('MiniGame')<0 && QGMiniAdapter.window.navigator.userAgent.indexOf('OPPO')<0){
			Laya.loader.load(fileUrl,callBack);
			}else{
			if(fileType==/*laya.net.Loader.IMAGE*/"image" || fileType==/*laya.net.Loader.SOUND*/"sound")
				MiniFileMgr.downOtherFiles(fileUrl,callBack,fileUrl,true,false);
			else
			MiniFileMgr.downFiles(fileUrl,encoding,callBack,fileUrl,true,fileType,false);
		}
	}

	MiniFileMgr.copyFile=function(tempFilePath,readyUrl,callBack,encoding,isAutoClear){
		(encoding===void 0)&& (encoding="");
		(isAutoClear===void 0)&& (isAutoClear=true);
		var temp=tempFilePath.split("/");
		var tempFileName=temp[temp.length-1];
		var fileurlkey=readyUrl;
		var fileObj=MiniFileMgr.getFileInfo(readyUrl);
		var saveFilePath=MiniFileMgr.getFileNativePath(tempFileName);
		var totalSize=50 *1024 *1024;
		var chaSize=4 *1024 *1024;
		var fileUseSize=MiniFileMgr.getCacheUseSize();
		if (fileObj){
			if (fileObj.readyUrl !=readyUrl){
				MiniFileMgr.fs.getFileInfo({
					filePath:tempFilePath,
					success:function (data){
						if((isAutoClear && (fileUseSize+chaSize+data.size)>=totalSize)){
							if(data.size > QGMiniAdapter.minClearSize)
								QGMiniAdapter.minClearSize=data.size;
							MiniFileMgr.onClearCacheRes();
						}
						MiniFileMgr.deleteFile(tempFilePath,readyUrl,callBack,encoding,data.size);
					},
					fail:function (data){
						callBack !=null && callBack.runWith([1,data]);
					}
				});
			}
			else
			callBack !=null && callBack.runWith([0]);
			}else{
			MiniFileMgr.fs.getFileInfo({
				filePath:tempFilePath,
				success:function (data){
					if((isAutoClear && (fileUseSize+chaSize+data.size)>=totalSize)){
						if(data.size > QGMiniAdapter.minClearSize)
							QGMiniAdapter.minClearSize=data.size;
						MiniFileMgr.onClearCacheRes();
					}
					MiniFileMgr.fs.copyFile({srcPath:tempFilePath,destPath:saveFilePath,success:function (data2){
							MiniFileMgr.onSaveFile(readyUrl,tempFileName,true,encoding,callBack,data.size);
							},fail:function (data){
							callBack !=null && callBack.runWith([1,data]);
					}});
				},
				fail:function (data){
					callBack !=null && callBack.runWith([1,data]);
				}
			});
		}
	}

	MiniFileMgr.onClearCacheRes=function(){
		var memSize=QGMiniAdapter.minClearSize;
		var tempFileListArr=[];
		for(var key in MiniFileMgr.filesListObj){
			if(key!="fileUsedSize")
				tempFileListArr.push(MiniFileMgr.filesListObj[key]);
		}
		MiniFileMgr.sortOn(tempFileListArr,"times",16);
		var clearSize=0;
		for(var i=1,sz=tempFileListArr.length;i<sz;i++){
			var fileObj=tempFileListArr[i];
			if(clearSize >=memSize)
				break ;
			clearSize+=fileObj.size;
			MiniFileMgr.deleteFile("",fileObj.readyUrl);
		}
	}

	MiniFileMgr.sortOn=function(array,name,options){
		(options===void 0)&& (options=0);
		if (options==16)return array.sort(function(a,b){return a[name]-b[name];});
		if (options==(16 | 2))return array.sort(function(a,b){return b[name]-a[name];});
		return array.sort(function(a,b){return a[name]-b[name] });
	}

	MiniFileMgr.getFileNativePath=function(fileName){
		return laya.qg.mini.MiniFileMgr.fileNativeDir+"/"+fileName;
	}

	MiniFileMgr.deleteFile=function(tempFileName,readyUrl,callBack,encoding,fileSize){
		(readyUrl===void 0)&& (readyUrl="");
		(encoding===void 0)&& (encoding="");
		(fileSize===void 0)&& (fileSize=0);
		var fileObj=MiniFileMgr.getFileInfo(readyUrl);
		var deleteFileUrl=MiniFileMgr.getFileNativePath(fileObj.md5);
		MiniFileMgr.fs.unlink({filePath:deleteFileUrl,success:function (data){
				var isAdd=tempFileName !="" ? true :false;
				if(tempFileName !=""){
					var saveFilePath=MiniFileMgr.getFileNativePath(tempFileName);
					MiniFileMgr.fs.copyFile({srcPath:tempFileName,destPath:saveFilePath,success:function (data){
							MiniFileMgr.onSaveFile(readyUrl,tempFileName,isAdd,encoding,callBack,data.size);
							},fail:function (data){
							callBack !=null && callBack.runWith([1,data]);
					}});
					}else{
					MiniFileMgr.onSaveFile(readyUrl,tempFileName,isAdd,encoding,callBack,fileSize);
				}
				},fail:function (data){
		}});
	}

	MiniFileMgr.deleteAll=function(){
		var tempFileListArr=[];
		for(var key in MiniFileMgr.filesListObj){
			if(key!="fileUsedSize")
				tempFileListArr.push(MiniFileMgr.filesListObj[key]);
		}
		for(var i=1,sz=tempFileListArr.length;i<sz;i++){
			var fileObj=tempFileListArr[i];
			MiniFileMgr.deleteFile("",fileObj.readyUrl);
		}
		if(laya.qg.mini.MiniFileMgr.filesListObj && laya.qg.mini.MiniFileMgr.filesListObj.fileUsedSize){
			laya.qg.mini.MiniFileMgr.filesListObj.fileUsedSize=0;
		}
		laya.qg.mini.MiniFileMgr.writeFilesList("",JSON.stringify({}),false);
	}

	MiniFileMgr.onSaveFile=function(readyUrl,md5Name,isAdd,encoding,callBack,fileSize){
		(isAdd===void 0)&& (isAdd=true);
		(encoding===void 0)&& (encoding="");
		(fileSize===void 0)&& (fileSize=0);
		var fileurlkey=readyUrl;
		if(MiniFileMgr.filesListObj['fileUsedSize']==null)
			MiniFileMgr.filesListObj['fileUsedSize']=0;
		if(isAdd){
			var fileNativeName=MiniFileMgr.getFileNativePath(md5Name);
			MiniFileMgr.filesListObj[fileurlkey]={md5:md5Name,readyUrl:readyUrl,size:fileSize,times:Browser.now(),encoding:encoding};
			MiniFileMgr.filesListObj['fileUsedSize']=parseInt(MiniFileMgr.filesListObj['fileUsedSize'])+fileSize;
			MiniFileMgr.writeFilesList(fileurlkey,JSON.stringify(MiniFileMgr.filesListObj),true);
			callBack !=null && callBack.runWith([0]);
			}else{
			if(MiniFileMgr.filesListObj[fileurlkey]){
				var deletefileSize=parseInt(MiniFileMgr.filesListObj[fileurlkey].size);
				MiniFileMgr.filesListObj['fileUsedSize']=parseInt(MiniFileMgr.filesListObj['fileUsedSize'])-deletefileSize;
				delete MiniFileMgr.filesListObj[fileurlkey];
				MiniFileMgr.writeFilesList(fileurlkey,JSON.stringify(MiniFileMgr.filesListObj),false);
				callBack !=null && callBack.runWith([0]);
			}
		}
	}

	MiniFileMgr.writeFilesList=function(fileurlkey,filesListStr,isAdd){
		var listFilesPath=MiniFileMgr.fileNativeDir+"/"+MiniFileMgr.fileListName;
		MiniFileMgr.fs.writeFile({filePath:listFilesPath,encoding:'utf8',data:filesListStr,success:function (data){
				},fail:function (data){
		}});
		if(!QGMiniAdapter.isZiYu &&QGMiniAdapter.isPosMsgYu){
			QGMiniAdapter.window.qg.postMessage && QGMiniAdapter.window.qg.postMessage({url:fileurlkey,data:MiniFileMgr.filesListObj[fileurlkey],isLoad:"filenative",isAdd:isAdd});
		}
	}

	MiniFileMgr.getCacheUseSize=function(){
		if(MiniFileMgr.filesListObj && MiniFileMgr.filesListObj['fileUsedSize'])
			return MiniFileMgr.filesListObj['fileUsedSize'];
		return 0;
	}

	MiniFileMgr.existDir=function(dirPath,callBack){
		MiniFileMgr.fs.mkdir({dirPath:dirPath,success:function (data){
				callBack !=null && callBack.runWith([0,{data:JSON.stringify({})}]);
				},fail:function (data){
				if (data.errMsg.indexOf("file already exists")!=-1)
					MiniFileMgr.readSync(MiniFileMgr.fileListName,"utf8",callBack);
				else
				callBack !=null && callBack.runWith([1,data]);
		}});
	}

	MiniFileMgr.readSync=function(filePath,encoding,callBack,readyUrl){
		(encoding===void 0)&& (encoding="utf8");
		(readyUrl===void 0)&& (readyUrl="");
		var fileUrl=MiniFileMgr.getFileNativePath(filePath);
		var filesListStr
		try{
			MiniFileMgr.fs.readFile({
				filePath:fileUrl,
				encoding:encoding,
				success:function (data){
					filesListStr=data.data;
					callBack !=null && callBack.runWith([0,{data:filesListStr}]);
				},
				fail:function (){
					callBack !=null && callBack.runWith([1]);
				}
			});
		}
		catch(error){
			callBack !=null && callBack.runWith([1]);
		}
	}

	MiniFileMgr.setNativeFileDir=function(value){
		MiniFileMgr.fileNativeDir=/*__JS__ */qg.env.USER_DATA_PATH+value;
	}

	MiniFileMgr.filesListObj={};
	MiniFileMgr.fileNativeDir=null;
	MiniFileMgr.fileListName="layaairfiles.txt";
	MiniFileMgr.ziyuFileData={};
	MiniFileMgr.ziyuFileTextureData={};
	MiniFileMgr.loadPath="";
	MiniFileMgr.DESCENDING=2;
	MiniFileMgr.NUMERIC=16;
	__static(MiniFileMgr,
	['fs',function(){return this.fs=QGMiniAdapter.window.qg.getFileSystemManager();},'wxdown',function(){return this.wxdown=QGMiniAdapter.window.qg.downloadFile;}
	]);
	return MiniFileMgr;
})()


/**@private **/
//class laya.qg.mini.MiniImage
var MiniImage$3=(function(){
	function MiniImage(){}
	__class(MiniImage,'laya.qg.mini.MiniImage',null,'MiniImage$3');
	var __proto=MiniImage.prototype;
	/**@private **/
	__proto._loadImage=function(url){
		var thisLoader=this;
		var urlHeader=QGMiniAdapter.window.qg.env.USER_DATA_PATH;
		if (url.indexOf(urlHeader)!=-1 || url.indexOf(urlHeader)!=-1){
			MiniImage.onCreateImage(url,thisLoader,true);
			return;
		}
		if (QGMiniAdapter.isZiYu){
			MiniImage.onCreateImage(url,thisLoader,true);
			return;
		};
		var isTransformUrl=false;
		if (!MiniFileMgr$3.isLocalNativeFile(url)){
			isTransformUrl=true;
			url=URL.formatURL(url);
			}else{
			if (url.indexOf('http://usr/')==-1&&(url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1)){
				if(MiniFileMgr$3.loadPath !=""){
					url=url.split(MiniFileMgr$3.loadPath)[1];
					}else{
					var tempStr=URL.rootPath !="" ? URL.rootPath :URL.basePath;
					var tempUrl=url;
					if(tempStr !="")
						url=url.split(tempStr)[1];
					if(!url){
						url=tempUrl;
					}
				}
			}
			if (QGMiniAdapter.subNativeFiles && QGMiniAdapter.subNativeheads.length==0){
				for (var key in QGMiniAdapter.subNativeFiles){
					var tempArr=QGMiniAdapter.subNativeFiles[key];
					QGMiniAdapter.subNativeheads=QGMiniAdapter.subNativeheads.concat(tempArr);
					for (var aa=0;aa < tempArr.length;aa++){
						QGMiniAdapter.subMaps[tempArr[aa]]=key+"/"+tempArr[aa];
					}
				}
			}
			if(QGMiniAdapter.subNativeFiles && url.indexOf("/")!=-1){
				var curfileHead=url.split("/")[0]+"/";
				if(curfileHead && QGMiniAdapter.subNativeheads.indexOf(curfileHead)!=-1){
					var newfileHead=QGMiniAdapter.subMaps[curfileHead];
					url=url.replace(curfileHead,newfileHead);
				}
			}
		}
		if (!MiniFileMgr$3.getFileInfo(url)){
			if (url.indexOf('http://usr/')==-1&&(url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1)){
				if(QGMiniAdapter.isZiYu){
					MiniImage.onCreateImage(url,thisLoader,true);
					}else{
					MiniFileMgr$3.downOtherFiles(encodeURI(url),new Handler(MiniImage,MiniImage.onDownImgCallBack,[url,thisLoader]),url);
				}
			}
			else
			MiniImage.onCreateImage(url,thisLoader,true);
			}else {
			MiniImage.onCreateImage(url,thisLoader,!isTransformUrl);
		}
	}

	MiniImage.onDownImgCallBack=function(sourceUrl,thisLoader,errorCode,tempFilePath){
		(tempFilePath===void 0)&& (tempFilePath="");
		if (!errorCode)
			MiniImage.onCreateImage(sourceUrl,thisLoader,false,tempFilePath);
		else {
			thisLoader.onError(null);
		}
	}

	MiniImage.onCreateImage=function(sourceUrl,thisLoader,isLocal,tempFilePath){
		(isLocal===void 0)&& (isLocal=false);
		(tempFilePath===void 0)&& (tempFilePath="");
		var fileNativeUrl;
		if(QGMiniAdapter.autoCacheFile){
			if (!isLocal){
				if(tempFilePath !=""){
					fileNativeUrl=tempFilePath;
					}else{
					var fileObj=MiniFileMgr$3.getFileInfo(sourceUrl);
					var fileMd5Name=fileObj.md5;
					fileNativeUrl=MiniFileMgr$3.getFileNativePath(fileMd5Name);
				}
			}else
			if(QGMiniAdapter.isZiYu){
				var tempUrl=URL.formatURL(sourceUrl);
				if(MiniFileMgr$3.ziyuFileTextureData[tempUrl]){
					fileNativeUrl=MiniFileMgr$3.ziyuFileTextureData[tempUrl];
				}else
				fileNativeUrl=sourceUrl;
			}else
			fileNativeUrl=sourceUrl;
			}else{
			if(!isLocal)
				fileNativeUrl=tempFilePath;
			else
			fileNativeUrl=sourceUrl;
		}
		if (thisLoader.imgCache==null)
			thisLoader.imgCache={};
		var image;
		function clear (){
			image.onload=null;
			image.onerror=null;
			delete thisLoader.imgCache[sourceUrl]
		};
		var onload=function (){
			clear();
			thisLoader.onLoaded(image);
		};
		var onerror=function (){
			clear();
			thisLoader.event(/*laya.events.Event.ERROR*/"error","Load image failed");
		}
		if (thisLoader._type=="nativeimage"){
			image=new Browser.window.Image();
			image.crossOrigin="";
			image.onload=onload;
			image.onerror=onerror;
			image.src=fileNativeUrl;
			thisLoader.imgCache[sourceUrl]=image;
			}else {
			new HTMLImage.create(fileNativeUrl,{onload:onload,onerror:onerror,onCreate:function (img){
					image=img;
					thisLoader.imgCache[sourceUrl]=img;
			}});
		}
	}

	return MiniImage;
})()


/**@private **/
//class laya.qg.mini.MiniInput
var MiniInput$3=(function(){
	function MiniInput(){}
	__class(MiniInput,'laya.qg.mini.MiniInput',null,'MiniInput$3');
	MiniInput._createInputElement=function(){
		Input['_initInput'](Input['area']=Browser.createElement("textarea"));
		Input['_initInput'](Input['input']=Browser.createElement("input"));
		Input['inputContainer']=Browser.createElement("div");
		Input['inputContainer'].style.position="absolute";
		Input['inputContainer'].style.zIndex=1E5;
		Browser.container.appendChild(Input['inputContainer']);
		Input['inputContainer'].setPos=function (x,y){Input['inputContainer'].style.left=x+'px';Input['inputContainer'].style.top=y+'px';};
		Laya.stage.on("resize",null,MiniInput._onStageResize);
		QGMiniAdapter.window.qg.onWindowResize && QGMiniAdapter.window.qg.onWindowResize(function(res){
			QGMiniAdapter.window.dispatchEvent && QGMiniAdapter.window.dispatchEvent("resize");
		});
		SoundManager._soundClass=MiniSound$3;
		SoundManager._musicClass=MiniSound$3;
		var model=QGMiniAdapter.systemInfo.model;
		var system=QGMiniAdapter.systemInfo.system;
		if(model && model.indexOf("iPhone")!=-1){
			Browser.onIPhone=true;
			Browser.onIOS=true;
			Browser.onIPad=true;
			Browser.onAndroid=false;
		}
		if(system && (system.indexOf("Android")!=-1 || system.indexOf("Adr")!=-1)){
			Browser.onAndroid=true;
			Browser.onIPhone=false;
			Browser.onIOS=false;
			Browser.onIPad=false;
		}
	}

	MiniInput._onStageResize=function(){}
	MiniInput.wxinputFocus=function(e){
		var _inputTarget=Input['inputElement'].target;
		if (_inputTarget && !_inputTarget.editable){
			return;
		}
		QGMiniAdapter.window.qg.showKeyboard({
			defaultValue:_inputTarget.text,
			maxLength:_inputTarget.maxChars,
			multiple:_inputTarget.multiline,
			confirmHold:true,
			confirmType:'done',
			success:function (res){
			},
			fail:function (res){}
		});
		QGMiniAdapter.window.qg.onKeyboardComplete(function(res){
			QGMiniAdapter.window.qg.offKeyboardComplete();
			var str=res ? res.value :"";
			if (_inputTarget._restrictPattern){
				str=str.replace(/\u2006|\x27/g,"");
				if (_inputTarget._restrictPattern.test(str)){
					str=str.replace(_inputTarget._restrictPattern,"");
				}
			}
			_inputTarget.text=str;
			_inputTarget.event(/*laya.events.Event.INPUT*/"input");
			laya.qg.mini.MiniInput.inputEnter(true);
		});
		QGMiniAdapter.window.qg.onKeyboardConfirm(function(res){
			var str=res ? res.value :"";
			if (_inputTarget._restrictPattern){
				str=str.replace(/\u2006|\x27/g,"");
				if (_inputTarget._restrictPattern.test(str)){
					str=str.replace(_inputTarget._restrictPattern,"");
				}
			}
			_inputTarget.text=str;
			_inputTarget.event(/*laya.events.Event.INPUT*/"input");
			laya.qg.mini.MiniInput.inputEnter(true);
		})
		QGMiniAdapter.window.qg.onKeyboardInput(function(res){
			var str=res ? res.value :"";
			if (!_inputTarget.multiline){
				if (str.indexOf("\n")!=-1){
					laya.qg.mini.MiniInput.inputEnter(false);
					return;
				}
			}
			if (_inputTarget._restrictPattern){
				str=str.replace(/\u2006|\x27/g,"");
				if (_inputTarget._restrictPattern.test(str)){
					str=str.replace(_inputTarget._restrictPattern,"");
				}
			}
			_inputTarget.text=str;
			_inputTarget.event(/*laya.events.Event.INPUT*/"input");
			laya.qg.mini.MiniInput.inputEnter(false);
		});
	}

	MiniInput.inputEnter=function(isBool){
		if(isBool){
			MiniInput.hideKeyboard();
		}
		if(!Input['inputElement'].target)
			return;
		Input['inputElement'].target.focus=false;
	}

	MiniInput.wxinputblur=function(){}
	MiniInput.hideKeyboard=function(){
		QGMiniAdapter.window.qg.offKeyboardConfirm();
		QGMiniAdapter.window.qg.offKeyboardInput();
		QGMiniAdapter.window.qg.hideKeyboard({
			success:function (res){
				console.log('隐藏键盘')
				},fail:function (res){
				console.log("隐藏键盘出错:"+(res ? res.errMsg :""));
		}});
	}

	return MiniInput;
})()


/**@private **/
//class laya.qg.mini.MiniLocalStorage
var MiniLocalStorage$3=(function(){
	function MiniLocalStorage(){}
	__class(MiniLocalStorage,'laya.qg.mini.MiniLocalStorage',null,'MiniLocalStorage$3');
	MiniLocalStorage.__init__=function(){
		MiniLocalStorage.items=MiniLocalStorage;
	}

	MiniLocalStorage.setItem=function(key,value){
		QGMiniAdapter.window.qg.setStorageSync(key,value);
	}

	MiniLocalStorage.getItem=function(key){
		return QGMiniAdapter.window.qg.getStorageSync(key);
	}

	MiniLocalStorage.setJSON=function(key,value){
		try{
			MiniLocalStorage.setItem(key,JSON.stringify(value));
		}
		catch(error){
			MiniLocalStorage.setItem(key,value);
		}
	}

	MiniLocalStorage.getJSON=function(key){
		var tempData=MiniLocalStorage.getItem(key);
		try{
			return JSON.parse(tempData);
		}
		catch(error){
			return tempData;
		}
	}

	MiniLocalStorage.removeItem=function(key){
		QGMiniAdapter.window.qg.removeStorageSync(key);
	}

	MiniLocalStorage.clear=function(){
		QGMiniAdapter.window.qg.clearStorageSync();
	}

	MiniLocalStorage.getStorageInfoSync=function(){
		try {
			var res=QGMiniAdapter.window.qg.getStorageInfoSync()
			console.log(res.keys)
			console.log(res.currentSize)
			console.log(res.limitSize)
			return res;
		}catch (e){}
		return null;
	}

	MiniLocalStorage.support=true;
	MiniLocalStorage.items=null;
	return MiniLocalStorage;
})()


/**@private **/
//class laya.qg.mini.MiniLocation
var MiniLocation$3=(function(){
	function MiniLocation(){}
	__class(MiniLocation,'laya.qg.mini.MiniLocation',null,'MiniLocation$3');
	MiniLocation.__init__=function(){
		QGMiniAdapter.window.navigator.geolocation.getCurrentPosition=MiniLocation.getCurrentPosition;
		QGMiniAdapter.window.navigator.geolocation.watchPosition=MiniLocation.watchPosition;
		QGMiniAdapter.window.navigator.geolocation.clearWatch=MiniLocation.clearWatch;
	}

	MiniLocation.getCurrentPosition=function(success,error,options){
		var paramO;
		paramO={};
		paramO.success=getSuccess;
		paramO.fail=error;
		QGMiniAdapter.window.qg.getLocation(paramO);
		function getSuccess (res){
			if (success !=null){
				success(res);
			}
		}
	}

	MiniLocation.watchPosition=function(success,error,options){
		MiniLocation._curID++;
		var curWatchO;
		curWatchO={};
		curWatchO.success=success;
		curWatchO.error=error;
		MiniLocation._watchDic[MiniLocation._curID]=curWatchO;
		Laya.timer.loop(1000,null,MiniLocation._myLoop);
		return MiniLocation._curID;
	}

	MiniLocation.clearWatch=function(id){
		delete MiniLocation._watchDic[id];
		if (!MiniLocation._hasWatch()){
			Laya.timer.clear(null,MiniLocation._myLoop);
		}
	}

	MiniLocation._hasWatch=function(){
		var key;
		for (key in MiniLocation._watchDic){
			if (MiniLocation._watchDic[key])return true;
		}
		return false;
	}

	MiniLocation._myLoop=function(){
		MiniLocation.getCurrentPosition(MiniLocation._mySuccess,MiniLocation._myError);
	}

	MiniLocation._mySuccess=function(res){
		var rst={};
		rst.coords=res;
		rst.timestamp=Browser.now();
		var key;
		for (key in MiniLocation._watchDic){
			if (MiniLocation._watchDic[key].success){
				MiniLocation._watchDic[key].success(rst);
			}
		}
	}

	MiniLocation._myError=function(res){
		var key;
		for (key in MiniLocation._watchDic){
			if (MiniLocation._watchDic[key].error){
				MiniLocation._watchDic[key].error(res);
			}
		}
	}

	MiniLocation._watchDic={};
	MiniLocation._curID=0;
	return MiniLocation;
})()


/**
*视频类
*@author xiaosong
*@date-2019-04-22
*/
//class laya.qg.mini.MiniVideo
var MiniVideo$1=(function(){
	function MiniVideo(width,height){
		/**视频是否播放结束**/
		this.videoend=false;
		this.videourl="";
		this.videoElement=null;
		this.videoW=NaN;
		this.videoH=NaN;
		this.onPlayFunc=null;
		this.onEndedFunC=null;
		/**视频的总时⻓长，单位为秒**/
		this._duration=NaN;
		/**视频播放的当前位置**/
		this.position=NaN;
		(width===void 0)&& (width=320);
		(height===void 0)&& (height=240);
		this.videoW=width;
		this.videoH=height;
	}

	__class(MiniVideo,'laya.qg.mini.MiniVideo',null,'MiniVideo$1');
	var __proto=MiniVideo.prototype;
	__proto.on=function(eventType,ths,callBack){
		if(eventType=="loadedmetadata"){
			this.onPlayFunc=callBack.bind(ths);
			}else if(eventType=="ended"){
			this.onEndedFunC=callBack.bind(ths);
		}
		this.videoElement.onTimeUpdate=this.onTimeUpdateFunc.bind(this);
	}

	__proto.onTimeUpdateFunc=function(data){
		this.position=data.position;
		this._duration=data.duration;
	}

	__proto.onPlayFunction=function(){
		if(this.videoElement)
			this.videoElement.readyState=200;
		this.onPlayFunc !=null && this.onPlayFunc();
	}

	__proto.onEndedFunction=function(){
		this.videoend=true;
		this.onEndedFunC !=null && this.onEndedFunC();
	}

	__proto.off=function(eventType,ths,callBack){
		if(eventType=="loadedmetadata"){
			this.onPlayFunc=callBack.bind(ths);
			this.videoElement.offPlay=this.onPlayFunction.bind(this);
			}else if(eventType=="ended"){
			this.onEndedFunC=callBack.bind(ths);
			this.videoElement.offEnded=this.onEndedFunction.bind(this);
		}
	}

	/**
	*设置播放源。
	*@param url 播放源路径。
	*/
	__proto.load=function(url){
		if(!this.videoElement){
			this.videoElement=QGMiniAdapter.window.qg.createVideo({width:this.videoW,height:this.videoH,autoplay:true,src:url});
			this.videoElement.onPlay=this.onPlayFunction.bind(this);
			this.videoElement.onEnded=this.onEndedFunction.bind(this);
			}else{
			this.videoElement.src=url;
		}
	}

	/**
	*开始播放视频。
	*/
	__proto.play=function(){
		if(!this.videoElement)
			return;
		this.videoend=false;
		this.videoElement.play();
	}

	/**
	*暂停视频播放。
	*/
	__proto.pause=function(){
		if(!this.videoElement)
			return;
		this.videoend=true;
		this.videoElement.pause();
	}

	/**
	*设置大小
	*@param width
	*@param height
	*/
	__proto.size=function(width,height){
		if(!this.videoElement)
			return;
		this.videoElement.width=width;
		this.videoElement.height=height;
	}

	__proto.destroy=function(){
		if(this.videoElement)
			this.videoElement.destroy();
		this.videoElement=null;
		this.onEndedFunC=null;
		this.onPlayFunc=null;
		this.videoend=false;
		this.videourl=null;
	}

	/**
	*重新加载视频。
	*/
	__proto.reload=function(){
		if(!this.videoElement)
			return;
		this.videoElement.src=this.videourl;
	}

	/**
	*获取视频长度（秒）。ready事件触发后可用。
	*/
	__getset(0,__proto,'duration',function(){
		return this._duration;
	});

	/**
	*返回视频是否暂停
	*/
	__getset(0,__proto,'paused',function(){
		if(!this.videoElement)
			return false;
		return this.videoElement.paused;
	});

	/**
	*设置或返回音频/视频是否应在结束时重新播放。
	*/
	__getset(0,__proto,'loop',function(){
		if(!this.videoElement)
			return false;
		return this.videoElement.loop;
		},function(value){
		if(!this.videoElement)
			return;
		this.videoElement.loop=value;
	});

	/**
	*设置和获取当前播放头位置。
	*/
	__getset(0,__proto,'currentTime',function(){
		if(!this.videoElement)
			return 0;
		return this.videoElement.initialTime;
		},function(value){
		if(!this.videoElement)
			return;
		this.videoElement.initialTime=value;
	});

	/**
	*返回音频/视频的播放是否已结束
	*/
	__getset(0,__proto,'ended',function(){
		return this.videoend;
	});

	/**
	*获取和设置静音状态。
	*/
	__getset(0,__proto,'muted',function(){
		if(!this.videoElement)
			return false;
		return this.videoElement.muted;
		},function(value){
		if(!this.videoElement)
			return;
		this.videoElement.muted=value;
	});

	/**
	*获取视频源尺寸。ready事件触发后可用。
	*/
	__getset(0,__proto,'videoWidth',function(){
		if(!this.videoElement)
			return 0;
		return this.videoElement.width;
	});

	__getset(0,__proto,'videoHeight',function(){
		if(!this.videoElement)
			return 0;
		return this.videoElement.height;
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
		if(!this.videoElement)
			return 0;
		return this.videoElement.playbackRate;
		},function(value){
		if(!this.videoElement)
			return;
		this.videoElement.playbackRate=value;
	});

	__getset(0,__proto,'x',function(){
		if(!this.videoElement)
			return 0;
		return this.videoElement.x;
		},function(value){
		if(!this.videoElement)
			return;
		this.videoElement.x=value;
	});

	__getset(0,__proto,'y',function(){
		if(!this.videoElement)
			return 0;
		return this.videoElement.y;
		},function(value){
		if(!this.videoElement)
			return;
		this.videoElement.y=value;
	});

	/**
	*获取当前播放源路径。
	*/
	__getset(0,__proto,'currentSrc',function(){
		return this.videoElement.src;
	});

	MiniVideo.__init__=function(){
		/*__JS__ */laya.device.media.Video=MiniVideo;
	}

	return MiniVideo;
})()


//class laya.qg.mini.QGMiniAdapter
var QGMiniAdapter=(function(){
	function QGMiniAdapter(){}
	__class(QGMiniAdapter,'laya.qg.mini.QGMiniAdapter');
	QGMiniAdapter.getJson=function(data){
		return JSON.parse(data);
	}

	QGMiniAdapter.init=function(isPosMsg,isSon){
		(isPosMsg===void 0)&& (isPosMsg=false);
		(isSon===void 0)&& (isSon=false);
		if (QGMiniAdapter._inited)return;
		QGMiniAdapter._inited=true;
		QGMiniAdapter.window=/*__JS__ */window;
		if(!QGMiniAdapter.window.hasOwnProperty('qg'))
			return;
		if(QGMiniAdapter.window.navigator.userAgent.indexOf('OPPO')<0)return;
		QGMiniAdapter.isZiYu=isSon;
		QGMiniAdapter.isPosMsgYu=isPosMsg;
		QGMiniAdapter.EnvConfig={};
		try{
			/*__JS__ */laya.webgl.resource.WebGLCanvas.premulAlpha=true;
			}catch(e){
		}
		if(!QGMiniAdapter.isZiYu){
			if(!/*__JS__ */qg){
				console.log("======qg null======================");
			}
			if(!/*__JS__ */qg.env){
				console.log("======qg.env  null======================");
			}
			MiniFileMgr$3.setNativeFileDir("/layaairGame");
			MiniFileMgr$3.existDir(MiniFileMgr$3.fileNativeDir,Handler.create(QGMiniAdapter,QGMiniAdapter.onMkdirCallBack));
		}
		QGMiniAdapter.window.qg.getSystemInfo({
			success:function (data){
				QGMiniAdapter.systemInfo=data;
			}
		});
		QGMiniAdapter.window.focus=function (){
		};
		Laya['_getUrlPath']=function (){
		};
		Laya['getUrlPath']=function (){
		};
		QGMiniAdapter.window.logtime=function (str){
		};
		QGMiniAdapter.window.alertTimeLog=function (str){
		};
		QGMiniAdapter.window.resetShareInfo=function (){
		};
		QGMiniAdapter.window.document.body.appendChild=function (){
		};
		QGMiniAdapter.EnvConfig.pixelRatioInt=0;
		RunDriver.getPixelRatio=QGMiniAdapter.pixelRatio;
		QGMiniAdapter._preCreateElement=Browser.createElement;
		Browser["createElement"]=QGMiniAdapter.createElement;
		RunDriver.createShaderCondition=QGMiniAdapter.createShaderCondition;
		Utils['parseXMLFromString']=QGMiniAdapter.parseXMLFromString;
		Input['_createInputElement']=MiniInput$3['_createInputElement'];
		QGMiniAdapter.EnvConfig.load=Loader.prototype.load;
		Loader.prototype.load=MiniLoader$3.prototype.load;
		Loader.prototype._loadImage=MiniImage$3.prototype._loadImage;
		QGMiniAdapter.onReciveData();
		Config.useRetinalCanvas=true;
	}

	QGMiniAdapter.onReciveData=function(){
		if(laya.qg.mini.QGMiniAdapter.isZiYu && QGMiniAdapter.window.qg.onMessage){
			QGMiniAdapter.window.qg.onMessage(function(message){
				if(message['isLoad']=="opendatacontext"){
					if(message.url){
						MiniFileMgr$3.ziyuFileData[message.url]=message.atlasdata;
						MiniFileMgr$3.ziyuFileTextureData[message.imgReadyUrl]=message.imgNativeUrl;
					}
					}else if(message['isLoad']=="openJsondatacontext"){
					if(message.url){
						MiniFileMgr$3.ziyuFileData[message.url]=message.atlasdata;
					}
					}else if(message['isLoad']=="openJsondatacontextPic"){
					MiniFileMgr$3.ziyuFileTextureData[message.imgReadyUrl]=message.imgNativeUrl;
				}
			});
		}
	}

	QGMiniAdapter.measureText=function(str){
		var tempObj=QGMiniAdapter._measureText(str);
		if(!tempObj){
			tempObj={width:16};
			console.warn("-------微信获取文字宽度失败----等待修复---------");
		}
		return tempObj;
	}

	QGMiniAdapter.getUrlEncode=function(url,type){
		if(type=="arraybuffer")
			return "";
		return "utf8";
	}

	QGMiniAdapter.downLoadFile=function(fileUrl,fileType,callBack,encoding){
		(fileType===void 0)&& (fileType="");
		(encoding===void 0)&& (encoding="utf8");
		var fileObj=MiniFileMgr$3.getFileInfo(fileUrl);
		if(!fileObj)
			MiniFileMgr$3.downLoadFile(fileUrl,fileType,callBack,encoding);
		else{
			callBack !=null && callBack.runWith([0]);
		}
	}

	QGMiniAdapter.remove=function(fileUrl,callBack){
		MiniFileMgr$3.deleteFile("",fileUrl,callBack,"",0);
	}

	QGMiniAdapter.removeAll=function(){
		MiniFileMgr$3.deleteAll();
	}

	QGMiniAdapter.hasNativeFile=function(fileUrl){
		return MiniFileMgr$3.isLocalNativeFile(fileUrl);
	}

	QGMiniAdapter.getFileInfo=function(fileUrl){
		return MiniFileMgr$3.getFileInfo(fileUrl);
	}

	QGMiniAdapter.getFileList=function(){
		return MiniFileMgr$3.filesListObj;
	}

	QGMiniAdapter.exitMiniProgram=function(){
		QGMiniAdapter.window.qg.exitMiniProgram();
	}

	QGMiniAdapter.onMkdirCallBack=function(errorCode,data){
		if (!errorCode)
			MiniFileMgr$3.filesListObj=JSON.parse(data.data);
	}

	QGMiniAdapter.pixelRatio=function(){
		if (!QGMiniAdapter.EnvConfig.pixelRatioInt){
			try {
				QGMiniAdapter.systemInfo.pixelRatio=QGMiniAdapter.window.devicePixelRatio;
				QGMiniAdapter.EnvConfig.pixelRatioInt=QGMiniAdapter.systemInfo.pixelRatio;
				return QGMiniAdapter.systemInfo.pixelRatio;
			}catch (error){}
		}
		return QGMiniAdapter.EnvConfig.pixelRatioInt;
	}

	QGMiniAdapter.createElement=function(type){
		if (type=="canvas"){
			var _source;
			if (QGMiniAdapter.idx==1){
				if(QGMiniAdapter.isZiYu){
					_source=QGMiniAdapter.window.document.createElement("canvas");
					_source.style={};
					}else{
					_source=QGMiniAdapter.window.__canvas;
				}
				}else {
				_source=QGMiniAdapter.window.document.createElement("canvas");
			}
			QGMiniAdapter.idx++;
			return _source;
			}else if (type=="textarea" || type=="input"){
			return QGMiniAdapter.onCreateInput(type);
			}else if (type=="div"){
			var node=QGMiniAdapter._preCreateElement(type);
			node.contains=function (value){
				return null
			};
			node.removeChild=function (value){
			};
			return node;
		}
		else {
			return QGMiniAdapter._preCreateElement(type);
		}
	}

	QGMiniAdapter.onCreateInput=function(type){
		var node=QGMiniAdapter._preCreateElement(type);
		node.focus=MiniInput$3.wxinputFocus;
		node.blur=MiniInput$3.wxinputblur;
		node.style={};
		node.value=0;
		node.parentElement={};
		node.placeholder={};
		node.type={};
		node.setColor=function (value){
		};
		node.setType=function (value){
		};
		node.setFontFace=function (value){
		};
		node.addEventListener=function (value){
		};
		node.contains=function (value){
			return null
		};
		node.removeChild=function (value){
		};
		return node;
	}

	QGMiniAdapter.createShaderCondition=function(conditionScript){
		var _$this=this;
		var func=function (){
			var abc=conditionScript;
			return _$this[conditionScript.replace("this.","")];
		}
		return func;
	}

	QGMiniAdapter.sendAtlasToOpenDataContext=function(url){
		if(!laya.qg.mini.QGMiniAdapter.isZiYu){
			var atlasJson=Loader.getRes(URL.formatURL(url));
			if(atlasJson){
				var textureArr=(atlasJson.meta.image).split(",");
				if (atlasJson.meta && atlasJson.meta.image){
					var toloadPics=atlasJson.meta.image.split(",");
					var split=url.indexOf("/")>=0 ? "/" :"\\";
					var idx=url.lastIndexOf(split);
					var folderPath=idx >=0 ? url.substr(0,idx+1):"";
					for (var i=0,len=toloadPics.length;i < len;i++){
						toloadPics[i]=folderPath+toloadPics[i];
					}
					}else {
					toloadPics=[url.replace(".json",".png")];
				}
				for(i=0;i<toloadPics.length;i++){
					var tempAtlasPngUrl=toloadPics[i];
					QGMiniAdapter.postInfoToContext(url,tempAtlasPngUrl,atlasJson);
				}
				}else{
				throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
			}
		}
	}

	QGMiniAdapter.postInfoToContext=function(url,atlaspngUrl,atlasJson){
		var postData={"frames":atlasJson.frames,"meta":atlasJson.meta};
		var textureUrl=atlaspngUrl;
		var fileObj=MiniFileMgr$3.getFileInfo(URL.formatURL(atlaspngUrl));
		if(fileObj){
			var fileMd5Name=fileObj.md5;
			var fileNativeUrl=MiniFileMgr$3.getFileNativePath(fileMd5Name);
			}else{
			fileNativeUrl=textureUrl;
		}
		if(fileNativeUrl){
			QGMiniAdapter.window.qg.postMessage && QGMiniAdapter.window.qg.postMessage({url:url,atlasdata:postData,imgNativeUrl:fileNativeUrl,imgReadyUrl:textureUrl,isLoad:"opendatacontext"});
			}else{
			throw "获取图集的磁盘url路径不存在！";
		}
	}

	QGMiniAdapter.sendSinglePicToOpenDataContext=function(url){
		var tempTextureUrl=URL.formatURL(url);
		var fileObj=MiniFileMgr$3.getFileInfo(tempTextureUrl);
		if(fileObj){
			var fileMd5Name=fileObj.md5;
			var fileNativeUrl=MiniFileMgr$3.getFileNativePath(fileMd5Name);
			url=tempTextureUrl;
			}else{
			fileNativeUrl=url;
		}
		if(fileNativeUrl){
			QGMiniAdapter.window.qg.postMessage && QGMiniAdapter.window.qg.postMessage({url:url,imgNativeUrl:fileNativeUrl,imgReadyUrl:url,isLoad:"openJsondatacontextPic"});
			}else{
			throw "获取图集的磁盘url路径不存在！";
		}
	}

	QGMiniAdapter.sendJsonDataToDataContext=function(url){
		if(!laya.qg.mini.QGMiniAdapter.isZiYu){
			var atlasJson=Loader.getRes(url);
			if(atlasJson){
				QGMiniAdapter.window.qg.postMessage && QGMiniAdapter.window.qg.postMessage({url:url,atlasdata:atlasJson,isLoad:"openJsondatacontext"});
				}else{
				throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
			}
		}
	}

	QGMiniAdapter.EnvConfig=null;
	QGMiniAdapter.window=null;
	QGMiniAdapter._preCreateElement=null;
	QGMiniAdapter._inited=false;
	QGMiniAdapter.systemInfo={};
	QGMiniAdapter.isZiYu=false;
	QGMiniAdapter.isPosMsgYu=false;
	QGMiniAdapter.autoCacheFile=true;
	QGMiniAdapter.minClearSize=(5 *1024 *1024);
	QGMiniAdapter.subNativeFiles=null;
	QGMiniAdapter.subNativeheads=[];
	QGMiniAdapter.subMaps=[];
	QGMiniAdapter.AutoCacheDownFile=false;
	QGMiniAdapter._measureText=null;
	QGMiniAdapter.parseXMLFromString=function(value){
		var rst;
		var Parser;
		value=value.replace(/>\s+</g,'><');
		try {
			/*__JS__ */rst=(new window.DOMParser()).parseFromString(value,'text/xml');
			}catch (error){
			throw "需要引入xml解析库文件";
		}
		return rst;
	}

	QGMiniAdapter.idx=1;
	__static(QGMiniAdapter,
	['nativefiles',function(){return this.nativefiles=["layaNativeDir","qgfile"];}
	]);
	return QGMiniAdapter;
})()


/**@private **/
//class laya.qg.mini.MiniAccelerator extends laya.events.EventDispatcher
var MiniAccelerator$3=(function(_super){
	function MiniAccelerator(){
		MiniAccelerator.__super.call(this);
	}

	__class(MiniAccelerator,'laya.qg.mini.MiniAccelerator',_super,'MiniAccelerator$3');
	var __proto=MiniAccelerator.prototype;
	/**
	*侦听加速器运动。
	*@param observer 回调函数接受4个参数，见类说明。
	*/
	__proto.on=function(type,caller,listener,args){
		_super.prototype.on.call(this,type,caller,listener,args);
		MiniAccelerator.startListen(this["onAccelerometerChange"]);
		return this;
	}

	/**
	*取消侦听加速器。
	*@param handle 侦听加速器所用处理器。
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (!this.hasListener(type))
			MiniAccelerator.stopListen();
		return _super.prototype.off.call(this,type,caller,listener,onceOnly);
	}

	MiniAccelerator.__init__=function(){
		try{
			var Acc;
			Acc=/*__JS__ */laya.device.motion.Accelerator;
			if (!Acc)return;
			Acc["prototype"]["on"]=MiniAccelerator["prototype"]["on"];
			Acc["prototype"]["off"]=MiniAccelerator["prototype"]["off"];
			}catch (e){
		}
	}

	MiniAccelerator.startListen=function(callBack){
		MiniAccelerator._callBack=callBack;
		if (MiniAccelerator._isListening)return;
		MiniAccelerator._isListening=true;
		try{
			QGMiniAdapter.window.qg.onAccelerometerChange(laya.qg.mini.MiniAccelerator.onAccelerometerChange);
		}catch(e){}
	}

	MiniAccelerator.stopListen=function(){
		MiniAccelerator._isListening=false;
		try{
			QGMiniAdapter.window.qg.stopAccelerometer({});
		}catch(e){}
	}

	MiniAccelerator.onAccelerometerChange=function(res){
		var e;
		e={};
		e.acceleration=res;
		e.accelerationIncludingGravity=res;
		e.rotationRate={};
		if (MiniAccelerator._callBack !=null){
			MiniAccelerator._callBack(e);
		}
	}

	MiniAccelerator._isListening=false;
	MiniAccelerator._callBack=null;
	return MiniAccelerator;
})(EventDispatcher)


/**@private **/
//class laya.qg.mini.MiniLoader extends laya.events.EventDispatcher
var MiniLoader$3=(function(_super){
	function MiniLoader(){
		MiniLoader.__super.call(this);
	}

	__class(MiniLoader,'laya.qg.mini.MiniLoader',_super,'MiniLoader$3');
	var __proto=MiniLoader.prototype;
	/**
	*@private
	*@param url
	*@param type
	*@param cache
	*@param group
	*@param ignoreCache
	*/
	__proto.load=function(url,type,cache,group,ignoreCache){
		(cache===void 0)&& (cache=true);
		(ignoreCache===void 0)&& (ignoreCache=false);
		var thisLoader=this;
		thisLoader._url=url;
		if (!url){
			thisLoader.onLoaded(null);
			return;
		}
		url=URL.customFormat(url);
		if (url.indexOf("data:image")===0)thisLoader._type=type=/*laya.net.Loader.IMAGE*/"image";
		else {
			thisLoader._type=type || (type=thisLoader.getTypeFromUrl(thisLoader._url));
		}
		thisLoader._cache=cache;
		thisLoader._data=null;
		if (!ignoreCache && Loader.loadedMap[URL.formatURL(url)]){
			thisLoader._data=Loader.loadedMap[URL.formatURL(url)];
			this.event(/*laya.events.Event.PROGRESS*/"progress",1);
			this.event(/*laya.events.Event.COMPLETE*/"complete",thisLoader._data);
			return;
		}
		if (Loader.parserMap[type] !=null){
			thisLoader._customParse=true;
			if (((Loader.parserMap[type])instanceof laya.utils.Handler ))Loader.parserMap[type].runWith(this);
			else Loader.parserMap[type].call(null,this);
			return;
		};
		var encoding=QGMiniAdapter.getUrlEncode(url,type);
		var urlType=Utils.getFileExtension(url);
		if ((MiniLoader._fileTypeArr.indexOf(urlType)!=-1)|| type==/*laya.net.Loader.IMAGE*/"image"){
			QGMiniAdapter.EnvConfig.load.call(this,url,type,cache,group,ignoreCache);
			}else {
			if(QGMiniAdapter.isZiYu && !MiniFileMgr$3.ziyuFileData[url]){
				url=URL.formatURL(url);
			}
			if(QGMiniAdapter.isZiYu && MiniFileMgr$3.ziyuFileData[url]){
				var tempData=MiniFileMgr$3.ziyuFileData[url];
				thisLoader.onLoaded(tempData);
				return;
			}
			if (!MiniFileMgr$3.getFileInfo(URL.formatURL(url))){
				if (MiniFileMgr$3.isLocalNativeFile(url)){
					if (QGMiniAdapter.subNativeFiles && QGMiniAdapter.subNativeheads.length==0){
						for (var key in QGMiniAdapter.subNativeFiles){
							var tempArr=QGMiniAdapter.subNativeFiles[key];
							QGMiniAdapter.subNativeheads=QGMiniAdapter.subNativeheads.concat(tempArr);
							for (var aa=0;aa < tempArr.length;aa++){
								QGMiniAdapter.subMaps[tempArr[aa]]=key+"/"+tempArr[aa];
							}
						}
					}
					if(QGMiniAdapter.subNativeFiles && url.indexOf("/")!=-1){
						var curfileHead=url.split("/")[0]+"/";
						if(curfileHead && QGMiniAdapter.subNativeheads.indexOf(curfileHead)!=-1){
							var newfileHead=QGMiniAdapter.subMaps[curfileHead];
							url=url.replace(curfileHead,newfileHead);
						}
					}
					MiniFileMgr$3.read(url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]));
					return;
				};
				var tempUrl=url;
				var tempurl=URL.formatURL(url);
				if (tempurl.indexOf(QGMiniAdapter.window.qg.env.USER_DATA_PATH)==-1 &&(url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1)&& !QGMiniAdapter.AutoCacheDownFile){
					QGMiniAdapter.EnvConfig.load.call(thisLoader,tempUrl,type,cache,group,ignoreCache);
					}else {
					fileObj=MiniFileMgr$3.getFileInfo(url);
					if(fileObj){
						fileObj.encoding=fileObj.encoding==null ? "utf8" :fileObj.encoding;
						MiniFileMgr$3.readFile(fileObj.url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),url);
						}else if (thisLoader.type=="image" || thisLoader.type=="htmlimage"){
						QGMiniAdapter.EnvConfig.load.call(thisLoader,url,type,cache,group,ignoreCache);
					}
					else{
						url=URL.formatURL(url);
						if(type !=/*laya.net.Loader.IMAGE*/"image" && ((url.indexOf("http://")==-1 && url.indexOf("https://")==-1)|| MiniFileMgr$3.isLocalNativeFile(url))){
							MiniFileMgr$3.readFile(url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),url);
							}else{
							MiniFileMgr$3.downFiles(url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),url,cache);
						}
					}
				}
				}else {
				var fileObj=MiniFileMgr$3.getFileInfo(URL.formatURL(url));
				fileObj.encoding=fileObj.encoding==null ? "utf8" :fileObj.encoding;
				var nativepath=MiniFileMgr$3.getFileNativePath(fileObj.md5);
				MiniFileMgr$3.readFile(nativepath,fileObj.encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),URL.formatURL(url));
			}
		}
	}

	MiniLoader.onReadNativeCallBack=function(encoding,url,type,cache,group,ignoreCache,thisLoader,errorCode,data){
		(cache===void 0)&& (cache=true);
		(ignoreCache===void 0)&& (ignoreCache=false);
		(errorCode===void 0)&& (errorCode=0);
		if (!errorCode){
			var tempData;
			if (type==/*laya.net.Loader.JSON*/"json" || type==/*laya.net.Loader.ATLAS*/"atlas"){
				tempData=QGMiniAdapter.getJson(data.data);
				}else if (type==/*laya.net.Loader.XML*/"xml"){
				tempData=Utils.parseXMLFromString(data.data);
				}else {
				tempData=data.data;
			}
			if(!QGMiniAdapter.isZiYu &&QGMiniAdapter.isPosMsgYu && type !=/*laya.net.Loader.BUFFER*/"arraybuffer"){
				QGMiniAdapter.window.qg.postMessage && QGMiniAdapter.window.qg.postMessage({url:url,data:tempData,isLoad:"filedata"});
			}
			thisLoader.onLoaded(tempData);
			}else if (errorCode==1){
			console.log("-----------本地加载失败，尝试外网加载----");
			QGMiniAdapter.EnvConfig.load.call(thisLoader,url,type,cache,group,ignoreCache);
		}
	}

	__static(MiniLoader,
	['_fileTypeArr',function(){return this._fileTypeArr=['png','jpg','bmp','jpeg','gif'];}
	]);
	return MiniLoader;
})(EventDispatcher)


/**@private **/
//class laya.qg.mini.MiniSound extends laya.events.EventDispatcher
var MiniSound$3=(function(_super){
	function MiniSound(){
		/**@private **/
		this._sound=null;
		/**
		*@private
		*声音URL
		*/
		this.url=null;
		/**
		*@private
		*是否已加载完成
		*/
		this.loaded=false;
		/**@private **/
		this.readyUrl=null;
		MiniSound.__super.call(this);
		this._sound=MiniSound._createSound();
	}

	__class(MiniSound,'laya.qg.mini.MiniSound',_super,'MiniSound$3');
	var __proto=MiniSound.prototype;
	/**
	*@private
	*加载声音。
	*@param url 地址。
	*
	*/
	__proto.load=function(url){
		if (!MiniFileMgr$3.isLocalNativeFile(url)){
			url=URL.formatURL(url);
			}else{
			if (url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1){
				if(MiniFileMgr$3.loadPath !=""){
					url=url.split(MiniFileMgr$3.loadPath)[1];
					}else{
					var tempStr=URL.rootPath !="" ? URL.rootPath :URL.basePath;
					if(tempStr !="")
						url=url.split(tempStr)[1];
				}
			}
		}
		this.url=url;
		this.readyUrl=url;
		if(QGMiniAdapter.autoCacheFile&&MiniFileMgr$3.getFileInfo(url)){
			this.onDownLoadCallBack(url,0);
			}else{
			if(!QGMiniAdapter.autoCacheFile){
				this.onDownLoadCallBack(url,0);
				}else{
				if (MiniFileMgr$3.isLocalNativeFile(url)){
					tempStr=URL.rootPath !="" ? URL.rootPath :URL.basePath;
					var tempUrl=url;
					if(tempStr !="")
						url=url.split(tempStr)[1];
					if (!url){
						url=tempUrl;
					}
					if (QGMiniAdapter.subNativeFiles && QGMiniAdapter.subNativeheads.length==0){
						for (var key in QGMiniAdapter.subNativeFiles){
							var tempArr=QGMiniAdapter.subNativeFiles[key];
							QGMiniAdapter.subNativeheads=QGMiniAdapter.subNativeheads.concat(tempArr);
							for (var aa=0;aa < tempArr.length;aa++){
								QGMiniAdapter.subMaps[tempArr[aa]]=key+"/"+tempArr[aa];
							}
						}
					}
					if(QGMiniAdapter.subNativeFiles && url.indexOf("/")!=-1){
						var curfileHead=url.split("/")[0]+"/";
						if(curfileHead && QGMiniAdapter.subNativeheads.indexOf(curfileHead)!=-1){
							var newfileHead=QGMiniAdapter.subMaps[curfileHead];
							url=url.replace(curfileHead,newfileHead);
						}
					}
					this.onDownLoadCallBack(url,0);
					}else{
					if((url.indexOf("http://")==-1 && url.indexOf("https://")==-1)
						|| url.indexOf(QGMiniAdapter.window.my.env.USER_DATA_PATH)!=-1){
						this.onDownLoadCallBack(url,0);
					}else
					MiniFileMgr$3.downOtherFiles(url,Handler.create(this,this.onDownLoadCallBack,[url]),url);
				}
			}
		}
	}

	/**@private **/
	__proto.onDownLoadCallBack=function(sourceUrl,errorCode,tempFilePath){
		(tempFilePath===void 0)&& (tempFilePath="");
		if (!errorCode){
			var fileNativeUrl;
			if(QGMiniAdapter.autoCacheFile){
				if (MiniFileMgr$3.isLocalNativeFile(sourceUrl)){
					var tempStr=URL.rootPath !="" ? URL.rootPath :URL.basePath;
					var tempUrl=sourceUrl;
					if(tempStr !="" && (sourceUrl.indexOf("http://")!=-1 || sourceUrl.indexOf("https://")!=-1))
						fileNativeUrl=sourceUrl.split(tempStr)[1];
					if(!fileNativeUrl){
						fileNativeUrl=tempUrl;
					}
					}else{
					var fileObj=MiniFileMgr$3.getFileInfo(sourceUrl);
					if(fileObj && fileObj.md5){
						var fileMd5Name=fileObj.md5;
						fileNativeUrl=MiniFileMgr$3.getFileNativePath(fileMd5Name);
						}else{
						fileNativeUrl=encodeURI(sourceUrl);
					}
				}
				this._sound.src=this.url=fileNativeUrl;
				}else{
				this._sound.src=sourceUrl;
			}
			}else{
			this.event(/*laya.events.Event.ERROR*/"error");
		}
	}

	/**
	*@private
	*播放声音。
	*@param startTime 开始时间,单位秒
	*@param loops 循环次数,0表示一直循环
	*@return 声道 SoundChannel 对象。
	*
	*/
	__proto.play=function(startTime,loops){
		(startTime===void 0)&& (startTime=0);
		(loops===void 0)&& (loops=0);
		if(!this.url)return null;
		var channel=new MiniSoundChannel$3(this);
		channel.url=this.url;
		channel.loops=loops;
		channel.loop=(loops===0 ? true :false);
		channel.startTime=startTime;
		channel.play();
		SoundManager.addChannel(channel);
		return channel;
	}

	/**
	*@private
	*释放声音资源。
	*
	*/
	__proto.dispose=function(){
		if (this._sound){
			this._sound.destroy();
			this._sound=null;
			this.readyUrl=this.url=null;
		}
	}

	/**
	*@private
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		return this._sound.duration;
	});

	MiniSound._createSound=function(){
		if(MiniSound._audioCache.length){
			return MiniSound._audioCache.pop();
			}else{
			MiniSound._id++;
			return QGMiniAdapter.window.qg.createInnerAudioContext();
		}
	}

	MiniSound._id=0;
	MiniSound._audioCache=[];
	return MiniSound;
})(EventDispatcher)


/**@private **/
//class laya.qg.mini.MiniSoundChannel extends laya.media.SoundChannel
var MiniSoundChannel$3=(function(_super){
	function MiniSoundChannel(miniSound){
		/**@private **/
		this._audio=null;
		/**@private **/
		this._onEnd=null;
		this._onCanplay=null;
		this._onError=null;
		/**@private **/
		this._miniSound=null;
		MiniSoundChannel.__super.call(this);
		this._audio=miniSound._sound;
		this._miniSound=miniSound;
		this._onEnd=MiniSoundChannel.bindToThis(this.__onEnd,this);
		this._onCanplay=MiniSoundChannel.bindToThis(this.onCanPlay,this);
		this._onError=MiniSoundChannel.bindToThis(this.onError,this);
		this.addEventListener();
	}

	__class(MiniSoundChannel,'laya.qg.mini.MiniSoundChannel',_super,'MiniSoundChannel$3');
	var __proto=MiniSoundChannel.prototype;
	__proto.addEventListener=function(){
		this._audio.onError(this._onError);
		this._audio.onCanplay(this._onCanplay);
	}

	//_audio.onEnded(_onEnd);
	__proto.offEventListener=function(){
		this._audio.offError(this._onError);
		this._audio.offCanplay(this._onCanplay);
		this._audio.offEnded(this._onEnd);
	}

	/**@private **/
	__proto.onError=function(error){
		console.log("-----1---------------minisound-----url:",this.url);
		this.event(/*laya.events.Event.ERROR*/"error",[error]);
		if(!this._audio)return;
		this._miniSound.dispose();
		this.offEventListener();
		this._audio=this._miniSound=null;
	}

	/**@private **/
	__proto.onCanPlay=function(){
		if(!this._audio)return;
		this.event(/*laya.events.Event.COMPLETE*/"complete");
		this.offEventListener();
		this._audio.onEnded(this._onEnd);
		if (!this.isStopped){
			this.play()
			}else{
			this.stop();
		}
	}

	/**@private **/
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

	/**
	*@private
	*播放
	*/
	__proto.play=function(){
		this.isStopped=false;
		SoundManager.addChannel(this);
		if(!this._audio || !this._audio.src)return;
		this._audio.play();
	}

	/**
	*@private
	*停止播放
	*
	*/
	__proto.stop=function(){
		_super.prototype.stop.call(this);
		this.isStopped=true;
		SoundManager.removeChannel(this);
		this.completeHandler=null;
		if (!this._audio)
			return;
		this._audio.stop();
		if (!this.loop){
			this.offEventListener();
			this._miniSound.dispose();
			this._miniSound=null;
			this._audio=null;
		}
	}

	/**@private **/
	__proto.pause=function(){
		this.isStopped=true;
		if(!this._audio)return;
		this._audio.pause();
	}

	/**@private **/
	__proto.resume=function(){
		if (!this._audio)
			return;
		this.isStopped=false;
		SoundManager.addChannel(this);
		this._audio.play();
	}

	/**
	*设置开始时间
	*@param time
	*/
	/**
	*设置开始时间
	*@param time
	*/
	__getset(0,__proto,'startTime',function(){
		if(!this._audio)return 0;
		return this._audio.startTime;
		},function(time){
		if(!this._audio)return;
		this._audio.startTime=time;
	});

	/**@private **/
	/**
	*@private
	*自动播放
	*@param value
	*/
	__getset(0,__proto,'autoplay',function(){
		if(!this._audio)return false;
		return this._audio.autoplay;
		},function(value){
		if(!this._audio)return;
		this._audio.autoplay=value;
	});

	/**
	*@private
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		if (!this._audio)
			return 0;
		return this._audio.duration;
	});

	/**
	*@private
	*当前播放到的位置
	*@return
	*
	*/
	__getset(0,__proto,'position',function(){
		if (!this._audio)
			return 0;
		return this._audio.currentTime;
	});

	/**@private **/
	/**@private **/
	__getset(0,__proto,'loop',function(){
		if(!this._audio)return false;
		return this._audio.loop;
		},function(value){
		if(!this._audio)return;
		this._audio.loop=value;
	});

	/**
	*@private
	*设置音量
	*@param v
	*
	*/
	/**
	*@private
	*获取音量
	*@return
	*/
	__getset(0,__proto,'volume',function(){
		if (!this._audio)return 1;
		return this._audio.volume;
		},function(v){
		if (!this._audio)return;
		this._audio.volume=v;
	});

	MiniSoundChannel.bindToThis=function(fun,scope){
		var rst=fun;
		/*__JS__ */rst=fun.bind(scope);;
		return rst;
	}

	return MiniSoundChannel;
})(SoundChannel)



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