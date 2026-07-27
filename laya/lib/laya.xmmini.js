
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Browser=laya.utils.Browser,Event=laya.events.Event,EventDispatcher=laya.events.EventDispatcher;
	var HTMLImage=laya.resource.HTMLImage,Handler=laya.utils.Handler,Input=laya.display.Input,Loader=laya.net.Loader;
	var LocalStorage=laya.net.LocalStorage,Matrix=laya.maths.Matrix,Render=laya.renders.Render,RunDriver=laya.utils.RunDriver;
	var SoundChannel=laya.media.SoundChannel,SoundManager=laya.media.SoundManager,URL=laya.net.URL,Utils=laya.utils.Utils;
//class laya.mi.mini.KGMiniAdapter
var KGMiniAdapter=(function(){
	function KGMiniAdapter(){}
	__class(KGMiniAdapter,'laya.mi.mini.KGMiniAdapter');
	KGMiniAdapter.getJson=function(data){
		return JSON.parse(data);
	}

	KGMiniAdapter.init=function(isPosMsg,isSon){
		(isPosMsg===void 0)&& (isPosMsg=false);
		(isSon===void 0)&& (isSon=false);
		if (KGMiniAdapter._inited)return;
		KGMiniAdapter._inited=true;
		KGMiniAdapter.window=/*__JS__ */window;
		if(KGMiniAdapter.window.navigator.userAgent.indexOf('QuickGame')<0)return;
		KGMiniAdapter.isZiYu=isSon;
		KGMiniAdapter.isPosMsgYu=isPosMsg;
		KGMiniAdapter.EnvConfig={};
		if(!KGMiniAdapter.isZiYu){
			MiniFileMgr$2.setNativeFileDir("/layaairGame");
			MiniFileMgr$2.existDir(MiniFileMgr$2.fileNativeDir,Handler.create(KGMiniAdapter,KGMiniAdapter.onMkdirCallBack));
		}
		if(!KGMiniAdapter.isZiYu){
			KGMiniAdapter.systemInfo=laya.mi.mini.KGMiniAdapter.window.qg.getSystemInfoSync();
		}
		KGMiniAdapter.window.focus=function (){
		};
		Laya['getUrlPath']=function (){
		};
		Laya['_getUrlPath']=function (){
		};
		KGMiniAdapter.window.logtime=function (str){
		};
		KGMiniAdapter.window.alertTimeLog=function (str){
		};
		KGMiniAdapter.window.resetShareInfo=function (){
		};
		KGMiniAdapter.EnvConfig.pixelRatioInt=0;
		RunDriver.getPixelRatio=KGMiniAdapter.pixelRatio;
		KGMiniAdapter._preCreateElement=Browser.createElement;
		Browser["createElement"]=KGMiniAdapter.createElement;
		RunDriver.createShaderCondition=KGMiniAdapter.createShaderCondition;
		Utils['parseXMLFromString']=KGMiniAdapter.parseXMLFromString;
		Input['_createInputElement']=MiniInput$2['_createInputElement'];
		KGMiniAdapter.EnvConfig.load=Loader.prototype.load;
		Loader.prototype.load=MiniLoader$2.prototype.load;
		Loader.prototype._loadImage=MiniImage$2.prototype._loadImage;
		KGMiniAdapter.onReciveData();
	}

	KGMiniAdapter.onReciveData=function(){
		if(laya.mi.mini.KGMiniAdapter.isZiYu && laya.mi.mini.KGMiniAdapter.window.qg.onMessage){
			laya.mi.mini.KGMiniAdapter.window.qg.onMessage(function(message){
				if(message['isLoad']=="opendatacontext"){
					if(message.url){
						MiniFileMgr$2.ziyuFileData[message.url]=message.atlasdata;
						MiniFileMgr$2.ziyuFileTextureData[message.imgReadyUrl]=message.imgNativeUrl;
					}
					}else if(message['isLoad']=="openJsondatacontext"){
					if(message.url){
						MiniFileMgr$2.ziyuFileData[message.url]=message.atlasdata;
					}
					}else if(message['isLoad']=="openJsondatacontextPic"){
					MiniFileMgr$2.ziyuFileTextureData[message.imgReadyUrl]=message.imgNativeUrl;
				}
			});
		}
	}

	KGMiniAdapter.measureText=function(str){
		var tempObj=KGMiniAdapter._measureText(str);
		if(!tempObj){
			tempObj={width:16};
			console.warn("-------微信获取文字宽度失败----等待修复---------");
		}
		return tempObj;
	}

	KGMiniAdapter.getUrlEncode=function(url,type){
		if(type=="arraybuffer")
			return "";
		return "utf8";
	}

	KGMiniAdapter.downLoadFile=function(fileUrl,fileType,callBack,encoding){
		(fileType===void 0)&& (fileType="");
		(encoding===void 0)&& (encoding="utf8");
		var fileObj=MiniFileMgr$2.getFileInfo(fileUrl);
		if(!fileObj)
			MiniFileMgr$2.downLoadFile(fileUrl,fileType,callBack,encoding);
		else{
			callBack !=null && callBack.runWith([0]);
		}
	}

	KGMiniAdapter.remove=function(fileUrl,callBack){
		MiniFileMgr$2.deleteFile("",fileUrl,callBack,"",0);
	}

	KGMiniAdapter.removeAll=function(){
		MiniFileMgr$2.deleteAll();
	}

	KGMiniAdapter.hasNativeFile=function(fileUrl){
		return MiniFileMgr$2.isLocalNativeFile(fileUrl);
	}

	KGMiniAdapter.getFileInfo=function(fileUrl){
		return MiniFileMgr$2.getFileInfo(fileUrl);
	}

	KGMiniAdapter.getFileList=function(){
		return MiniFileMgr$2.filesListObj;
	}

	KGMiniAdapter.exitMiniProgram=function(){
		laya.mi.mini.KGMiniAdapter.window.qg.exitMiniProgram();
	}

	KGMiniAdapter.onMkdirCallBack=function(errorCode,data){
		if (!errorCode)
			MiniFileMgr$2.filesListObj=JSON.parse(data.data);
	}

	KGMiniAdapter.pixelRatio=function(){
		if (!KGMiniAdapter.EnvConfig.pixelRatioInt){
			try {
				KGMiniAdapter.EnvConfig.pixelRatioInt=KGMiniAdapter.systemInfo.pixelRatio;
				return KGMiniAdapter.systemInfo.pixelRatio;
			}catch (error){}
		}
		return KGMiniAdapter.EnvConfig.pixelRatioInt;
	}

	KGMiniAdapter.createElement=function(type){
		if (type=="canvas"){
			var _source;
			if (KGMiniAdapter.idx==1){
				if(KGMiniAdapter.isZiYu){
					_source=KGMiniAdapter.window.document.createElement("canvas");
					_source.style={};
					}else{
					_source=KGMiniAdapter.window.document.getElementById("canvas");
					_source.style={
						width:_source.width+"px",
						height:_source.height+"px"
					};
				}
				}else {
				_source=KGMiniAdapter.window.document.createElement("canvas");
			}
			KGMiniAdapter.idx++;
			return _source;
			}else if (type=="textarea" || type=="input"){
			return KGMiniAdapter.onCreateInput(type);
			}else if (type=="div"){
			var node=KGMiniAdapter._preCreateElement(type);
			node.contains=function (value){
				return null
			};
			node.removeChild=function (value){
			};
			return node;
			}else {
			return KGMiniAdapter._preCreateElement(type);
		}
	}

	KGMiniAdapter.onCreateInput=function(type){
		var node=KGMiniAdapter._preCreateElement(type);
		node.focus=MiniInput$2.wxinputFocus;
		node.blur=MiniInput$2.wxinputblur;
		node.style={};
		node.value=0;
		node.placeholder={};
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

	KGMiniAdapter.createShaderCondition=function(conditionScript){
		var _$this=this;
		var func=function (){
			var abc=conditionScript;
			return _$this[conditionScript.replace("this.","")];
		}
		return func;
	}

	KGMiniAdapter.sendAtlasToOpenDataContext=function(url){
		if(!laya.mi.mini.KGMiniAdapter.isZiYu){
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
					KGMiniAdapter.postInfoToContext(url,tempAtlasPngUrl,atlasJson);
				}
				}else{
				throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
			}
		}
	}

	KGMiniAdapter.postInfoToContext=function(url,atlaspngUrl,atlasJson){
		var postData={"frames":atlasJson.frames,"meta":atlasJson.meta};
		var textureUrl=atlaspngUrl;
		var fileObj=MiniFileMgr$2.getFileInfo(URL.formatURL(atlaspngUrl));
		if(fileObj){
			var fileMd5Name=fileObj.md5;
			var fileNativeUrl=MiniFileMgr$2.getFileNativePath(fileMd5Name);
			}else{
			fileNativeUrl=textureUrl;
		}
		if(fileNativeUrl){
			var openDataContext=laya.mi.mini.KGMiniAdapter.window.qg.getOpenDataContext();
			openDataContext.postMessage({url:url,atlasdata:postData,imgNativeUrl:fileNativeUrl,imgReadyUrl:textureUrl,isLoad:"opendatacontext"});
			}else{
			throw "获取图集的磁盘url路径不存在！";
		}
	}

	KGMiniAdapter.sendSinglePicToOpenDataContext=function(url){
		var tempTextureUrl=URL.formatURL(url);
		var fileObj=MiniFileMgr$2.getFileInfo(tempTextureUrl);
		if(fileObj){
			var fileMd5Name=fileObj.md5;
			var fileNativeUrl=MiniFileMgr$2.getFileNativePath(fileMd5Name);
			url=tempTextureUrl;
			}else{
			fileNativeUrl=url;
		}
		if(fileNativeUrl){
			laya.mi.mini.KGMiniAdapter.window.qg.postMessage({url:url,imgNativeUrl:fileNativeUrl,imgReadyUrl:url,isLoad:"openJsondatacontextPic"});
			}else{
			throw "获取图集的磁盘url路径不存在！";
		}
	}

	KGMiniAdapter.sendJsonDataToDataContext=function(url){
		if(!laya.mi.mini.KGMiniAdapter.isZiYu){
			var atlasJson=Loader.getRes(url);
			if(atlasJson){
				laya.mi.mini.KGMiniAdapter.window.qg.postMessage({url:url,atlasdata:atlasJson,isLoad:"openJsondatacontext"});
				}else{
				throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
			}
		}
	}

	KGMiniAdapter.EnvConfig=null;
	KGMiniAdapter.window=null;
	KGMiniAdapter._preCreateElement=null;
	KGMiniAdapter._inited=false;
	KGMiniAdapter.systemInfo={};
	KGMiniAdapter.isZiYu=false;
	KGMiniAdapter.isPosMsgYu=false;
	KGMiniAdapter.autoCacheFile=true;
	KGMiniAdapter.minClearSize=(5 *1024 *1024);
	KGMiniAdapter.subNativeFiles=null;
	KGMiniAdapter.subNativeheads=[];
	KGMiniAdapter.subMaps=[];
	KGMiniAdapter.AutoCacheDownFile=false;
	KGMiniAdapter._measureText=null;
	KGMiniAdapter.parseXMLFromString=function(value){
		var rst;
		var Parser;
		value=value.replace(/>\s+</g,'><');
		try {
			/*__JS__ */rst=(new window.Parser.DOMParser()).parseFromString(value,'text/xml');
			}catch (error){
			throw "需要引入xml解析库文件";
		}
		return rst;
	}

	KGMiniAdapter.idx=1;
	__static(KGMiniAdapter,
	['nativefiles',function(){return this.nativefiles=["layaNativeDir","wxlocal"];}
	]);
	return KGMiniAdapter;
})()


/**@private **/
//class laya.mi.mini.MiniFileMgr
var MiniFileMgr$2=(function(){
	function MiniFileMgr(){}
	__class(MiniFileMgr,'laya.mi.mini.MiniFileMgr',null,'MiniFileMgr$2');
	MiniFileMgr.isLocalNativeFile=function(url){
		for(var i=0,sz=KGMiniAdapter.nativefiles.length;i<sz;i++){
			if(url.indexOf(KGMiniAdapter.nativefiles[i])!=-1)
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
		(encoding===void 0)&& (encoding="ascill");
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
		(encoding===void 0)&& (encoding="ascill");
		(readyUrl===void 0)&& (readyUrl="");
		(isSaveFile===void 0)&& (isSaveFile=false);
		(fileType===void 0)&& (fileType="");
		(isAutoClear===void 0)&& (isAutoClear=true);
		MiniFileMgr.fs.readFile({filePath:filePath,encoding:encoding,success:function (data){
				if (filePath.indexOf("http://")!=-1 || filePath.indexOf("https://")!=-1){
					if(KGMiniAdapter.autoCacheFile || isSaveFile){
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
		console.log("====fileUrl:"+fileUrl);
		MiniFileMgr.wxdown({url:fileUrl,success:function (data){
				console.log("===downOtherFiles success:"+JSON.stringify(data));
				if (data.statusCode===200){
					if((KGMiniAdapter.autoCacheFile || isSaveFile)&& readyUrl.indexOf("qlogo.cn")==-1 && readyUrl.indexOf(".php")==-1)
						MiniFileMgr.copyFile(data.tempFilePath,readyUrl,callBack,"",isAutoClear);
					else
					callBack !=null && callBack.runWith([0,data.tempFilePath]);
					}else{
					callBack !=null && callBack.runWith([1,data]);
				}
				},fail:function (data){
				console.log("===downOtherFiles fail data:"+JSON.stringify(data));
				callBack !=null && callBack.runWith([1,data]);
		}});
	}

	MiniFileMgr.downLoadFile=function(fileUrl,fileType,callBack,encoding){
		(fileType===void 0)&& (fileType="");
		(encoding===void 0)&& (encoding="utf8");
		if(((typeof /*__JS__ */getApp=='function'))==false){
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
							if(data.size > KGMiniAdapter.minClearSize)
								KGMiniAdapter.minClearSize=data.size;
							MiniFileMgr.onClearCacheRes();
						}
						MiniFileMgr.deleteFile(tempFilePath,readyUrl,callBack,encoding,data.size);
					},
					fail:function (data){
						console.log("=1==getFileInfo fail data:"+JSON.stringify(data));
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
						if(data.size > KGMiniAdapter.minClearSize)
							KGMiniAdapter.minClearSize=data.size;
						MiniFileMgr.onClearCacheRes();
					}
					console.log("=====tempFilePath:"+tempFilePath+"===saveFilePath:"+saveFilePath);
					MiniFileMgr.fs.copyFile({srcPath:tempFilePath,destPath:saveFilePath,success:function (data2){
							MiniFileMgr.onSaveFile(readyUrl,tempFileName,true,encoding,callBack,data.size);
							},fail:function (data){
							console.log("===copyFile fail data:"+JSON.stringify(data));
							callBack !=null && callBack.runWith([1,data]);
					}});
				},
				fail:function (data){
					console.log("=2==getFileInfo fail data:"+JSON.stringify(data));
					callBack !=null && callBack.runWith([1,data]);
				}
			});
		}
	}

	MiniFileMgr.onClearCacheRes=function(){
		var memSize=KGMiniAdapter.minClearSize;
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
		return laya.mi.mini.MiniFileMgr.fileNativeDir+"/"+fileName;
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
		if(laya.mi.mini.MiniFileMgr.filesListObj && laya.mi.mini.MiniFileMgr.filesListObj.fileUsedSize){
			laya.mi.mini.MiniFileMgr.filesListObj.fileUsedSize=0;
		}
		laya.mi.mini.MiniFileMgr.writeFilesList("",JSON.stringify({}),false);
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
		if(!KGMiniAdapter.isZiYu &&KGMiniAdapter.isPosMsgYu){
			/*__JS__ */wx.postMessage({url:fileurlkey,data:MiniFileMgr.filesListObj[fileurlkey],isLoad:"filenative",isAdd:isAdd});
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
		(encoding===void 0)&& (encoding="ascill");
		(readyUrl===void 0)&& (readyUrl="");
		var fileUrl=MiniFileMgr.getFileNativePath(filePath);
		var filesListStr
		try{
			filesListStr=MiniFileMgr.fs.readFileSync(fileUrl,encoding);
			callBack !=null && callBack.runWith([0,{data:filesListStr}]);
		}
		catch(error){
			callBack !=null && callBack.runWith([1]);
		}
	}

	MiniFileMgr.setNativeFileDir=function(value){
		MiniFileMgr.fileNativeDir=KGMiniAdapter.window.qg.env.USER_DATA_PATH+value;
		console.log("fileNativeDir:"+MiniFileMgr.fileNativeDir);
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
	['fs',function(){return this.fs=KGMiniAdapter.window.qg.getFileSystemManager();},'wxdown',function(){return this.wxdown=KGMiniAdapter.window.qg.downloadFile;}
	]);
	return MiniFileMgr;
})()


/**@private **/
//class laya.mi.mini.MiniImage
var MiniImage$2=(function(){
	function MiniImage(){}
	__class(MiniImage,'laya.mi.mini.MiniImage',null,'MiniImage$2');
	var __proto=MiniImage.prototype;
	/**@private **/
	__proto._loadImage=function(url){
		var thisLoader=this;
		if (KGMiniAdapter.isZiYu){
			MiniImage.onCreateImage(url,thisLoader,true);
			return;
		};
		var isTransformUrl=false;
		if (!MiniFileMgr$2.isLocalNativeFile(url)){
			isTransformUrl=true;
			url=URL.formatURL(url);
			}else{
			if (url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1){
				if(MiniFileMgr$2.loadPath !=""){
					url=url.split(MiniFileMgr$2.loadPath)[1];
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
			if (KGMiniAdapter.subNativeFiles && KGMiniAdapter.subNativeheads.length==0){
				for (var key in KGMiniAdapter.subNativeFiles){
					var tempArr=KGMiniAdapter.subNativeFiles[key];
					KGMiniAdapter.subNativeheads=KGMiniAdapter.subNativeheads.concat(tempArr);
					for (var aa=0;aa < tempArr.length;aa++){
						KGMiniAdapter.subMaps[tempArr[aa]]=key+"/"+tempArr[aa];
					}
				}
			}
			if(KGMiniAdapter.subNativeFiles && url.indexOf("/")!=-1){
				var curfileHead=url.split("/")[0]+"/";
				if(curfileHead && KGMiniAdapter.subNativeheads.indexOf(curfileHead)!=-1){
					var newfileHead=KGMiniAdapter.subMaps[curfileHead];
					url=url.replace(curfileHead,newfileHead);
				}
			}
		}
		if (!MiniFileMgr$2.getFileInfo(url)){
			if (url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1){
				if(KGMiniAdapter.isZiYu){
					MiniImage.onCreateImage(url,thisLoader,true);
					}else{
					MiniFileMgr$2.downOtherFiles(url,new Handler(MiniImage,MiniImage.onDownImgCallBack,[url,thisLoader]),url);
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
		if(KGMiniAdapter.autoCacheFile){
			if (!isLocal){
				if(tempFilePath !=""){
					fileNativeUrl=tempFilePath;
					}else{
					var fileObj=MiniFileMgr$2.getFileInfo(sourceUrl);
					var fileMd5Name=fileObj.md5;
					fileNativeUrl=MiniFileMgr$2.getFileNativePath(fileMd5Name);
				}
			}else
			if(KGMiniAdapter.isZiYu){
				var tempUrl=URL.formatURL(sourceUrl);
				if(MiniFileMgr$2.ziyuFileTextureData[tempUrl]){
					fileNativeUrl=MiniFileMgr$2.ziyuFileTextureData[tempUrl];
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
			console.log("====获取磁盘文件 onload ===thisLoader.url:"+thisLoader.url);
			clear();
			thisLoader.onLoaded(image);
		};
		var onerror=function (e){
			console.log(e);
			console.log("====获取磁盘文件 onerror =====thisLoader.url:"+thisLoader.url);
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
//class laya.mi.mini.MiniInput
var MiniInput$2=(function(){
	function MiniInput(){}
	__class(MiniInput,'laya.mi.mini.MiniInput',null,'MiniInput$2');
	MiniInput._createInputElement=function(){
		Input['_initInput'](Input['area']=Browser.createElement("textarea"));
		Input['_initInput'](Input['input']=Browser.createElement("input"));
		Input['inputContainer']=Browser.createElement("div");
		Input['inputContainer'].style.position="absolute";
		Input['inputContainer'].style.zIndex=1E5;
		Browser.container.appendChild(Input['inputContainer']);
		Input['inputContainer'].setPos=function (x,y){Input['inputContainer'].style.left=x+'px';Input['inputContainer'].style.top=y+'px';};
		Laya.stage.on("resize",null,MiniInput._onStageResize);
		KGMiniAdapter.window.qg.onWindowResize && KGMiniAdapter.window.qg.onWindowResize(function(res){
			KGMiniAdapter.window.dispatchEvent && KGMiniAdapter.window.dispatchEvent("resize");
		});
		SoundManager._soundClass=MiniSound$2;
		SoundManager._musicClass=MiniSound$2;
		var model=KGMiniAdapter.systemInfo.model;
		var system=KGMiniAdapter.systemInfo.system;
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

	MiniInput._onStageResize=function(){
		var ts=Laya.stage._canvasTransform.identity();
		ts.scale((Browser.width / Render.canvas.width / RunDriver.getPixelRatio()),Browser.height / Render.canvas.height / RunDriver.getPixelRatio());
	}

	MiniInput.wxinputFocus=function(e){
		debugger;
		var _inputTarget=Input['inputElement'].target;
		if (_inputTarget && !_inputTarget.editable){
			return;
		}
		KGMiniAdapter.window.qg.offKeyboardConfirm();
		KGMiniAdapter.window.qg.offKeyboardInput();
		KGMiniAdapter.window.qg.showKeyboard({defaultValue:_inputTarget.text,maxLength:_inputTarget.maxChars,multiple:_inputTarget.multiline,enterHold:true,enterType:'done',success:function (res){
				debugger;
				},fail:function (res){
				debugger;
		}});
		KGMiniAdapter.window.qg.onKeyboardConfirm(function(res){
			debugger;
			var str=res ? res.value :"";
			if (_inputTarget._restrictPattern){
				str=str.replace(/\u2006|\x27/g,"");
				if (_inputTarget._restrictPattern.test(str)){
					str=str.replace(_inputTarget._restrictPattern,"");
				}
			}
			_inputTarget.text=str;
			_inputTarget.event(/*laya.events.Event.INPUT*/"input");
			laya.mi.mini.MiniInput.inputEnter();
		});
		KGMiniAdapter.window.qg.onKeyboardInput(function(res){
			debugger;
			var str=res ? res.value :"";
			if (!_inputTarget.multiline){
				if (str.indexOf("\n")!=-1){
					laya.mi.mini.MiniInput.inputEnter();
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
		});
	}

	MiniInput.inputEnter=function(){
		Input['inputElement'].target.focus=false;
	}

	MiniInput.wxinputblur=function(){
		MiniInput.hideKeyboard();
	}

	MiniInput.hideKeyboard=function(){
		KGMiniAdapter.window.qg.offKeyboardConfirm();
		KGMiniAdapter.window.qg.offKeyboardInput();
		KGMiniAdapter.window.qg.hideKeyboard({success:function (res){
				debugger;
				console.log('隐藏键盘')
				},fail:function (res){
				console.log("隐藏键盘出错:"+(res ? res.errMsg :""));
				debugger;
		}});
	}

	return MiniInput;
})()


/**@private **/
//class laya.mi.mini.MiniLocalStorage
var MiniLocalStorage$2=(function(){
	function MiniLocalStorage(){}
	__class(MiniLocalStorage,'laya.mi.mini.MiniLocalStorage',null,'MiniLocalStorage$2');
	MiniLocalStorage.__init__=function(){
		MiniLocalStorage.items=MiniLocalStorage;
	}

	MiniLocalStorage.setItem=function(key,value){
		KGMiniAdapter.window.qg.setStorageSync(key,value);
	}

	MiniLocalStorage.getItem=function(key){
		return KGMiniAdapter.window.qg.getStorageSync(key);
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
		KGMiniAdapter.window.qg.removeStorageSync(key);
	}

	MiniLocalStorage.clear=function(){
		KGMiniAdapter.window.qg.clearStorageSync();
	}

	MiniLocalStorage.getStorageInfoSync=function(){
		try {
			var res=KGMiniAdapter.window.qg.getStorageInfoSync()
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
//class laya.mi.mini.MiniLocation
var MiniLocation$2=(function(){
	function MiniLocation(){}
	__class(MiniLocation,'laya.mi.mini.MiniLocation',null,'MiniLocation$2');
	MiniLocation.__init__=function(){
		KGMiniAdapter.window.navigator.geolocation.getCurrentPosition=MiniLocation.getCurrentPosition;
		KGMiniAdapter.window.navigator.geolocation.watchPosition=MiniLocation.watchPosition;
		KGMiniAdapter.window.navigator.geolocation.clearWatch=MiniLocation.clearWatch;
	}

	MiniLocation.getCurrentPosition=function(success,error,options){
		var paramO;
		paramO={};
		paramO.success=getSuccess;
		paramO.fail=error;
		KGMiniAdapter.window.wx.getLocation(paramO);
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


/**@private **/
//class laya.mi.mini.MiniAccelerator extends laya.events.EventDispatcher
var MiniAccelerator$2=(function(_super){
	function MiniAccelerator(){
		MiniAccelerator.__super.call(this);
	}

	__class(MiniAccelerator,'laya.mi.mini.MiniAccelerator',_super,'MiniAccelerator$2');
	var __proto=MiniAccelerator.prototype;
	/**
	*侦听加速器运动。
	*@param observer 回调函数接受4个参数，见类说明。
	*/
	__proto.on=function(type,caller,listener,args){
		_super.prototype.on.call(this,type,caller,listener,args);
		MiniAccelerator.startListen(this["onDeviceOrientationChange"]);
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
			KGMiniAdapter.window.wx.onAccelerometerChange(laya.mi.mini.MiniAccelerator.onAccelerometerChange);
		}catch(e){}
	}

	MiniAccelerator.stopListen=function(){
		MiniAccelerator._isListening=false;
		try{
			KGMiniAdapter.window.wx.stopAccelerometer({});
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
//class laya.mi.mini.MiniLoader extends laya.events.EventDispatcher
var MiniLoader$2=(function(_super){
	function MiniLoader(){
		MiniLoader.__super.call(this);
	}

	__class(MiniLoader,'laya.mi.mini.MiniLoader',_super,'MiniLoader$2');
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
		if (url.indexOf("data:image")===0)thisLoader._type=type=/*laya.net.Loader.IMAGE*/"image";
		else {
			thisLoader._type=type || (type=thisLoader.getTypeFromUrl(url));
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
		var encoding=KGMiniAdapter.getUrlEncode(url,type);
		var urlType=Utils.getFileExtension(url);
		if ((MiniLoader._fileTypeArr.indexOf(urlType)!=-1)|| type==/*laya.net.Loader.IMAGE*/"image"){
			KGMiniAdapter.EnvConfig.load.call(this,url,type,cache,group,ignoreCache);
			}else {
			if(KGMiniAdapter.isZiYu && !MiniFileMgr$2.ziyuFileData[url]){
				url=URL.formatURL(url);
			}
			if(KGMiniAdapter.isZiYu && MiniFileMgr$2.ziyuFileData[url]){
				var tempData=MiniFileMgr$2.ziyuFileData[url];
				thisLoader.onLoaded(tempData);
				return;
			}
			if (!MiniFileMgr$2.getFileInfo(URL.formatURL(url))){
				if (MiniFileMgr$2.isLocalNativeFile(url)){
					if (KGMiniAdapter.subNativeFiles && KGMiniAdapter.subNativeheads.length==0){
						for (var key in KGMiniAdapter.subNativeFiles){
							var tempArr=KGMiniAdapter.subNativeFiles[key];
							KGMiniAdapter.subNativeheads=KGMiniAdapter.subNativeheads.concat(tempArr);
							for (var aa=0;aa < tempArr.length;aa++){
								KGMiniAdapter.subMaps[tempArr[aa]]=key+"/"+tempArr[aa];
							}
						}
					}
					if(KGMiniAdapter.subNativeFiles && url.indexOf("/")!=-1){
						var curfileHead=url.split("/")[0]+"/";
						if(curfileHead && KGMiniAdapter.subNativeheads.indexOf(curfileHead)!=-1){
							var newfileHead=KGMiniAdapter.subMaps[curfileHead];
							url=url.replace(curfileHead,newfileHead);
						}
					}
					MiniFileMgr$2.read(url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]));
					return;
				};
				var tempUrl=url;
				var tempurl=URL.formatURL(url);
				if (tempurl.indexOf(KGMiniAdapter.window.qg.env.USER_DATA_PATH)==-1 &&(url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1)&& !KGMiniAdapter.AutoCacheDownFile){
					KGMiniAdapter.EnvConfig.load.call(thisLoader,tempUrl,type,cache,group,ignoreCache);
					}else {
					fileObj=MiniFileMgr$2.getFileInfo(url);
					if(fileObj){
						fileObj.encoding=fileObj.encoding==null ? "utf8" :fileObj.encoding;
						MiniFileMgr$2.readFile(fileObj.url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),url);
						}else if (thisLoader.type=="image" || thisLoader.type=="htmlimage"){
						KGMiniAdapter.EnvConfig.load.call(thisLoader,url,type,cache,group,ignoreCache);
					}
					else{
						url=URL.formatURL(url);
						if(type !=/*laya.net.Loader.IMAGE*/"image" && ((url.indexOf("http://")==-1 && url.indexOf("https://")==-1)|| MiniFileMgr$2.isLocalNativeFile(url))){
							MiniFileMgr$2.readFile(url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),url);
							}else{
							MiniFileMgr$2.downFiles(url,encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),url,cache);
						}
					}
				}
				}else {
				var fileObj=MiniFileMgr$2.getFileInfo(URL.formatURL(url));
				fileObj.encoding=fileObj.encoding==null ? "utf8" :fileObj.encoding;
				var nativepath=MiniFileMgr$2.getFileNativePath(fileObj.md5);
				MiniFileMgr$2.readFile(nativepath,fileObj.encoding,new Handler(MiniLoader,MiniLoader.onReadNativeCallBack,[encoding,url,type,cache,group,ignoreCache,thisLoader]),URL.formatURL(url));
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
				tempData=KGMiniAdapter.getJson(data.data);
				}else if (type==/*laya.net.Loader.XML*/"xml"){
				tempData=Utils.parseXMLFromString(data.data);
				}else {
				tempData=data.data;
			}
			if(!KGMiniAdapter.isZiYu &&KGMiniAdapter.isPosMsgYu && type !=/*laya.net.Loader.BUFFER*/"arraybuffer"){
				KGMiniAdapter.window.kg.postMessage({url:url,data:tempData,isLoad:"filedata"});
			}
			thisLoader.onLoaded(tempData);
			}else if (errorCode==1){
			KGMiniAdapter.EnvConfig.load.call(thisLoader,url,type,cache,group,ignoreCache);
		}
	}

	__static(MiniLoader,
	['_fileTypeArr',function(){return this._fileTypeArr=['png','jpg','bmp','jpeg','gif'];}
	]);
	return MiniLoader;
})(EventDispatcher)


/**@private **/
//class laya.mi.mini.MiniSound extends laya.events.EventDispatcher
var MiniSound$2=(function(_super){
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
	}

	__class(MiniSound,'laya.mi.mini.MiniSound',_super,'MiniSound$2');
	var __proto=MiniSound.prototype;
	/**
	*@private
	*加载声音。
	*@param url 地址。
	*
	*/
	__proto.load=function(url){
		if (!MiniFileMgr$2.isLocalNativeFile(url)){
			url=URL.formatURL(url);
			}else{
			if (url.indexOf("http://")!=-1 || url.indexOf("https://")!=-1){
				if(MiniFileMgr$2.loadPath !=""){
					url=url.split(MiniFileMgr$2.loadPath)[1];
					}else{
					var tempStr=URL.rootPath !="" ? URL.rootPath :URL.basePath;
					if(tempStr !="")
						url=url.split(tempStr)[1];
				}
			}
		}
		this.url=url;
		this.readyUrl=url;
		if (MiniSound._audioCache[this.readyUrl]){
			this.event(/*laya.events.Event.COMPLETE*/"complete");
			return;
		}
		if(KGMiniAdapter.autoCacheFile&&MiniFileMgr$2.getFileInfo(url)){
			this.onDownLoadCallBack(url,0);
			}else{
			if(!KGMiniAdapter.autoCacheFile){
				this.onDownLoadCallBack(url,0);
				}else{
				if (MiniFileMgr$2.isLocalNativeFile(url)){
					tempStr=URL.rootPath !="" ? URL.rootPath :URL.basePath;
					var tempUrl=url;
					if(tempStr !="")
						url=url.split(tempStr)[1];
					if (!url){
						url=tempUrl;
					}
					if (KGMiniAdapter.subNativeFiles && KGMiniAdapter.subNativeheads.length==0){
						for (var key in KGMiniAdapter.subNativeFiles){
							var tempArr=KGMiniAdapter.subNativeFiles[key];
							KGMiniAdapter.subNativeheads=KGMiniAdapter.subNativeheads.concat(tempArr);
							for (var aa=0;aa < tempArr.length;aa++){
								KGMiniAdapter.subMaps[tempArr[aa]]=key+"/"+tempArr[aa];
							}
						}
					}
					if(KGMiniAdapter.subNativeFiles && url.indexOf("/")!=-1){
						var curfileHead=url.split("/")[0]+"/";
						if(curfileHead && KGMiniAdapter.subNativeheads.indexOf(curfileHead)!=-1){
							var newfileHead=KGMiniAdapter.subMaps[curfileHead];
							url=url.replace(curfileHead,newfileHead);
						}
					}
					this.onDownLoadCallBack(url,0);
					}else{
					MiniFileMgr$2.downOtherFiles(url,Handler.create(this,this.onDownLoadCallBack,[url]),url);
				}
			}
		}
	}

	/**@private **/
	__proto.onDownLoadCallBack=function(sourceUrl,errorCode){
		if (!errorCode){
			var fileNativeUrl;
			if(KGMiniAdapter.autoCacheFile){
				var fileObj=MiniFileMgr$2.getFileInfo(sourceUrl);
				if(fileObj && fileObj.md5){
					var fileMd5Name=fileObj.md5;
					fileNativeUrl=MiniFileMgr$2.getFileNativePath(fileMd5Name);
					}else{
					fileNativeUrl=sourceUrl;
				}
				this._sound=MiniSound._createSound();
				this._sound.src=this.url=fileNativeUrl;
				}else{
				this._sound=MiniSound._createSound();
				this._sound.src=sourceUrl;
			}
			this._sound.oncanplay(MiniSound.bindToThis(this.onCanPlay,this));
			this._sound.onerror(MiniSound.bindToThis(this.onError,this));
			}else{
			this.event(/*laya.events.Event.ERROR*/"error");
		}
	}

	/**@private **/
	__proto.onError=function(error){
		this.event(/*laya.events.Event.ERROR*/"error");
		this._sound.offerror && (this._sound.offerror(null));
	}

	/**@private **/
	__proto.onCanPlay=function(){
		this.loaded=true;
		this.event(/*laya.events.Event.COMPLETE*/"complete");
		this._sound.offcanplay && (this._sound.offcanplay(null));
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
		var tSound;
		if (this.url==SoundManager._tMusic){
			if (!MiniSound._musicAudio)MiniSound._musicAudio=MiniSound._createSound();
			tSound=MiniSound._musicAudio;
			}else {
			if(MiniSound._audioCache[this.readyUrl]){
				tSound=MiniSound._audioCache[this.readyUrl]._sound;
				}else{
				tSound=MiniSound._createSound();
			}
		}
		if(!tSound)
			return null;
		if(KGMiniAdapter.autoCacheFile&&MiniFileMgr$2.getFileInfo(this.url)){
			var fileNativeUrl;
			var fileObj=MiniFileMgr$2.getFileInfo(this.url);
			var fileMd5Name=fileObj.md5;
			tSound.src=this.url=MiniFileMgr$2.getFileNativePath(fileMd5Name);
			}else{
			tSound.src=this.url;
		};
		var channel=new MiniSoundChannel$2(tSound,this);
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
		var ad=MiniSound._audioCache[this.readyUrl];
		if (ad){
			ad.src="";
			if(ad._sound){
				ad._sound.destroy && ad._sound.destroy();
				ad._sound=null;
				ad=null;
			}
			delete MiniSound._audioCache[this.readyUrl];
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
		MiniSound._id++;
		return KGMiniAdapter.window.qg.createInnerAudioContext();
	}

	MiniSound.bindToThis=function(fun,scope){
		var rst=fun;
		/*__JS__ */rst=fun.bind(scope);;
		return rst;
	}

	MiniSound._musicAudio=null;
	MiniSound._id=0;
	MiniSound._audioCache={};
	return MiniSound;
})(EventDispatcher)


/**@private **/
//class laya.mi.mini.MiniSoundChannel extends laya.media.SoundChannel
var MiniSoundChannel$2=(function(_super){
	function MiniSoundChannel(audio,miniSound){
		/**@private **/
		this._audio=null;
		/**@private **/
		this._onEnd=null;
		/**@private **/
		this._miniSound=null;
		MiniSoundChannel.__super.call(this);
		this._audio=audio;
		this._miniSound=miniSound;
		this._onEnd=MiniSoundChannel.bindToThis(this.__onEnd,this);
		audio.onended(this._onEnd);
	}

	__class(MiniSoundChannel,'laya.mi.mini.MiniSoundChannel',_super,'MiniSoundChannel$2');
	var __proto=MiniSoundChannel.prototype;
	/**@private **/
	__proto.__onEnd=function(){
		MiniSound$2._audioCache[this.url]=this._miniSound;
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
		this._audio.play();
	}

	/**
	*@private
	*停止播放
	*
	*/
	__proto.stop=function(){
		this.isStopped=true;
		SoundManager.removeChannel(this);
		this.completeHandler=null;
		if (!this._audio)
			return;
		this._audio.stop();
		this._audio.offended && this._audio.offended(null);
		this._miniSound.dispose();
		this._audio=null;
		this._miniSound=null;
		this._onEnd=null;
	}

	/**@private **/
	__proto.pause=function(){
		this.isStopped=true;
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
	__getset(0,__proto,'startTime',null,function(time){
		if(this._audio){
			this._audio.startTime=time;
		}
	});

	/**@private **/
	/**
	*@private
	*自动播放
	*@param value
	*/
	__getset(0,__proto,'autoplay',function(){
		return this._audio.autoplay;
		},function(value){
		this._audio.autoplay=value;
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

	/**
	*@private
	*获取总时间。
	*/
	__getset(0,__proto,'duration',function(){
		if (!this._audio)
			return 0;
		return this._audio.duration;
	});

	/**@private **/
	/**@private **/
	__getset(0,__proto,'loop',function(){
		return this._audio.loop;
		},function(value){
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