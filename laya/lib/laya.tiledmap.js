
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Browser=laya.utils.Browser,HTMLCanvas=laya.resource.HTMLCanvas,Handler=laya.utils.Handler,Loader=laya.net.Loader;
	var Point=laya.maths.Point,Rectangle=laya.maths.Rectangle,Render=laya.renders.Render,RenderContext=laya.renders.RenderContext;
	var Sprite=laya.display.Sprite,Texture=laya.resource.Texture;
/**
*tiledMap是整个地图的核心
*地图以层级来划分地图（例如：地表层，植被层，建筑层）
*每层又以分块（GridSprite)来处理显示对象，只显示在视口区域的区
*每块又包括N*N个格子（tile)
*格子类型又分为动画格子跟图片格子两种
*@author ...
*/
//class laya.map.TiledMap
var TiledMap=(function(){
	var GRect,TileMapAniData,TileSet;
	function TiledMap(){
		//json数据
		this._jsonData=null;
		//存放地图中用到的所有子纹理数据
		this._tileTexSetArr=[];
		//主纹理数据，主要在释放纹理资源时使用
		this._texArray=[];
		//地图信息中的一些基本数据
		this._x=0;
		//地图的坐标
		this._y=0;
		//_height=_mapTileH *_mapH
		this._width=0;
		//地图的宽度
		this._height=0;
		//地图的高度
		this._mapW=0;
		//地图的横向格子数
		this._mapH=0;
		//地图的竖向格子数
		this._mapTileW=0;
		//tile的宽度
		this._mapTileH=0;
		//地图的显示对象
		this._mapSprite=null;
		//地图的显示对象
		this._layerArray=[];
		//这里保存所有的MapLayer对象
		this._renderLayerArray=[];
		//这里保存需要渲染的MapLayer对象
		this._gridArray=[];
		//地图块相关的
		this._showGridKey=false;
		//是否显示块边界线（用来调试用）
		this._totalGridNum=0;
		//一层中的GridSprite的总数
		this._gridW=0;
		//地图的横向块数
		this._gridH=0;
		//地图的坚向块数
		this._gridWidth=450;
		//块的默认宽度
		this._gridHeight=450;
		//块的默认高度
		this._jsonLoader=null;
		//用来加载JSON文件用的LOADER
		this._loader=null;
		//用来加载纹理数据用的LOADER
		this._tileSetArray=[];
		//用来存放还需要哪些儿纹理等待加载
		this._currTileSet=null;
		//正在加载的纹理需要的数据源
		this._completeHandler=null;
		//上次视口显示的块范围
		this._index=0;
		this._animationDic={};
		//需要创建的动画数据
		this._properties=null;
		//当前地图的自定义属性
		this._tileProperties={};
		//图块属性
		this._tileProperties2={};
		//默认的地图类型（具体要看JSON文件）
		this._orientation="orthogonal";
		//默认的tile渲染顺序（具体要看JSON文件）
		this._renderOrder="right-down";
		//调试用的颜色组合
		this._colorArray=["FF","00","33","66"];
		//缩放相关的操作
		this._scale=1;
		this._pivotScaleX=0.5;
		this._pivotScaleY=0.5;
		this._centerX=0;
		this._centerY=0;
		/**@private */
		this._viewPortX=0;
		/**@private */
		this._viewPortY=0;
		this._viewPortWidth=0;
		this._viewPortHeight=0;
		//是否开启线性取样
		this._enableLinear=true;
		//资源的相对路径
		this._resPath=null;
		this._pathArray=null;
		//把地图限制在显示区域
		this._limitRange=false;
		/**
		*快速更新模式是否不可用
		*/
		this._fastDirty=true;
		/**
		*是否自动缓存没有动画的地块
		*/
		this.autoCache=true;
		/**
		*自动缓存类型,地图较大时建议使用normal
		*/
		this.autoCacheType="normal";
		/**
		*是否合并图层,开启合并图层时，图层属性内可添加layer属性，运行时将会将相邻的layer属性相同的图层进行合并以提高性能
		*/
		this.enableMergeLayer=false;
		/**
		*是否移除被覆盖的格子,地块可添加type属性，type不为0时表示不透明，被不透明地块遮挡的地块将会被剔除以提高性能
		*/
		this.removeCoveredTile=false;
		/**
		*是否显示大格子里显示的贴图数量
		*/
		this.showGridTextureCount=false;
		/**
		*是否调整地块边缘消除缩放导致的缝隙
		*/
		this.antiCrack=true;
		/**
		*是否在加载完成之后cache所有大格子
		*/
		this.cacheAllAfterInit=false;
		this._texutreStartDic={};
		this._rect=new Rectangle();
		this._paddingRect=new Rectangle();
		this._mapRect=new GRect();
		this._mapLogicRect=new GRect();
		this._mapLastRect=new GRect();
		this._mapSprite=new Sprite();
	}

	__class(TiledMap,'laya.map.TiledMap');
	var __proto=TiledMap.prototype;
	/**
	*创建地图
	*@param mapName JSON文件名字
	*@param viewRect 视口区域
	*@param completeHandler 地图创建完成的回调函数
	*@param viewRectPadding 视口扩充区域，把视口区域上、下、左、右扩充一下，防止视口移动时的穿帮
	*@param gridSize grid大小
	*@param enableLinear 是否开启线性取样（为false时，可以解决地图黑线的问题，但画质会锐化）
	*@param limitRange 把地图限制在显示区域
	*/
	__proto.createMap=function(mapName,viewRect,completeHandler,viewRectPadding,gridSize,enableLinear,limitRange){
		(enableLinear===void 0)&& (enableLinear=true);
		(limitRange===void 0)&& (limitRange=false);
		this._enableLinear=enableLinear;
		this._limitRange=limitRange;
		this._rect.x=viewRect.x;
		this._rect.y=viewRect.y;
		this._rect.width=viewRect.width;
		this._rect.height=viewRect.height;
		this._viewPortWidth=viewRect.width / this._scale;
		this._viewPortHeight=viewRect.height / this._scale;
		this._completeHandler=completeHandler;
		if (viewRectPadding){
			this._paddingRect.copyFrom(viewRectPadding);
		}
		else {
			this._paddingRect.setTo(0,0,0,0);
		}
		if (gridSize){
			this._gridWidth=gridSize.x;
			this._gridHeight=gridSize.y;
		};
		var tIndex=mapName.lastIndexOf("/");
		if (tIndex >-1){
			this._resPath=mapName.substr(0,tIndex);
			this._pathArray=this._resPath.split("/");
		}
		else {
			this._resPath="";
			this._pathArray=[];
		}
		this._jsonLoader=new Loader();
		this._jsonLoader.once("complete",this,this.onJsonComplete);
		this._jsonLoader.load(mapName,/*laya.net.Loader.JSON*/"json",false);
	}

	/**
	*json文件读取成功后，解析里面的纹理数据，进行加载
	*@param e JSON数据
	*/
	__proto.onJsonComplete=function(e){
		var tJsonData=this._jsonData=e;
		this._properties=tJsonData.properties;
		this._orientation=tJsonData.orientation;
		this._renderOrder=tJsonData.renderorder;
		this._mapW=tJsonData.width;
		this._mapH=tJsonData.height;
		this._mapTileW=tJsonData.tilewidth;
		this._mapTileH=tJsonData.tileheight;
		this._width=this._mapTileW *this._mapW;
		this._height=this._mapTileH *this._mapH;
		if (this._orientation=="staggered"){
			this._height=(0.5+this._mapH *0.5)*this._mapTileH;
		}
		this._mapLastRect.top=this._mapLastRect.bottom=this._mapLastRect.left=this._mapLastRect.right=-1;
		var tArray=tJsonData.tilesets;
		var tileset;
		var tTileSet;
		var i=0;
		for (i=0;i < tArray.length;i++){
			tileset=tArray[i];
			tTileSet=new TileSet();
			tTileSet.init(tileset);
			if (tTileSet.properties && tTileSet.properties.ignore)continue ;
			this._tileProperties[i]=tTileSet.tileproperties;
			this.addTileProperties(tTileSet.tileproperties);
			this._tileSetArray.push(tTileSet);
			var tTiles=tileset.tiles;
			if (tTiles){
				for (var p in tTiles){
					var tAnimation=tTiles[p].animation;
					if (tAnimation){
						var tAniData=new TileMapAniData();
						this._animationDic[p]=tAniData;
						tAniData.image=tileset.image;
						for (var j=0;j < tAnimation.length;j++){
							var tAnimationItem=tAnimation[j];
							tAniData.mAniIdArray.push(tAnimationItem.tileid);
							tAniData.mDurationTimeArray.push(tAnimationItem.duration);
						}
					}
				}
			}
		}
		this._tileTexSetArr.push(null);
		if (this._tileSetArray.length > 0){
			tTileSet=this._currTileSet=this._tileSetArray.shift();
			this._loader=new Loader();
			this._loader.once("complete",this,this.onTextureComplete);
			var tPath=this.mergePath(this._resPath,tTileSet.image);
			this._loader.load(tPath,/*laya.net.Loader.IMAGE*/"image",false);
		}
	}

	/**
	*合并路径
	*@param resPath
	*@param relativePath
	*@return
	*/
	__proto.mergePath=function(resPath,relativePath){
		var tResultPath="";
		var tImageArray=relativePath.split("/");
		var tParentPathNum=0;
		var i=0;
		for (i=tImageArray.length-1;i >=0;i--){
			if (tImageArray[i]==".."){
				tParentPathNum++;
			}
		}
		if (tParentPathNum==0){
			if (this._pathArray.length > 0){
				tResultPath=resPath+"/"+relativePath;
			}
			else {
				tResultPath=relativePath;
			}
			return tResultPath;
		};
		var tSrcNum=this._pathArray.length-tParentPathNum;
		if (tSrcNum < 0){
			console.log("[error]path does not exist",this._pathArray,tImageArray,resPath,relativePath);
		}
		for (i=0;i < tSrcNum;i++){
			if (i==0){
				tResultPath+=this._pathArray[i];
			}
			else {
				tResultPath=tResultPath+"/"+this._pathArray[i];
			}
		}
		for (i=tParentPathNum;i < tImageArray.length;i++){
			tResultPath=tResultPath+"/"+tImageArray[i];
		}
		return tResultPath;
	}

	/**
	*纹理加载完成，如果所有的纹理加载，开始初始化地图
	*@param e 纹理数据
	*/
	__proto.onTextureComplete=function(e){
		var json=this._jsonData;
		var tTexture=e;
		if (Render.isWebGL && (!this._enableLinear)){
			tTexture.bitmap.minFifter=0x2600;
			tTexture.bitmap.magFifter=0x2600;
			tTexture.bitmap.enableMerageInAtlas=false;
		}
		this._texArray.push(tTexture);
		var tSubTexture=null;
		var tTileSet=this._currTileSet;
		var tTileTextureW=tTileSet.tilewidth;
		var tTileTextureH=tTileSet.tileheight;
		var tImageWidth=tTileSet.imagewidth;
		var tImageHeight=tTileSet.imageheight;
		var tFirstgid=tTileSet.firstgid;
		var tTileWNum=Math.floor((tImageWidth-tTileSet.margin-tTileTextureW)/ (tTileTextureW+tTileSet.spacing))+1;
		var tTileHNum=Math.floor((tImageHeight-tTileSet.margin-tTileTextureH)/ (tTileTextureH+tTileSet.spacing))+1;
		var tTileTexSet=null;
		this._texutreStartDic[tTileSet.image]=this._tileTexSetArr.length;
		for (var i=0;i < tTileHNum;i++){
			for (var j=0;j < tTileWNum;j++){
				tTileTexSet=new TileTexSet();
				tTileTexSet.offX=tTileSet.titleoffsetX;
				tTileTexSet.offY=tTileSet.titleoffsetY-(tTileTextureH-this._mapTileH);
				tTileTexSet.texture=Texture.createFromTexture(tTexture,tTileSet.margin+(tTileTextureW+tTileSet.spacing)*j,tTileSet.margin+(tTileTextureH+tTileSet.spacing)*i,tTileTextureW,tTileTextureH);
				if(this.antiCrack)
					this.adptTexture(tTileTexSet.texture);
				this._tileTexSetArr.push(tTileTexSet);
				tTileTexSet.gid=this._tileTexSetArr.length;
			}
		}
		if (this._tileSetArray.length > 0){
			tTileSet=this._currTileSet=this._tileSetArray.shift();
			this._loader.once("complete",this,this.onTextureComplete);
			var tPath=this.mergePath(this._resPath,tTileSet.image);
			this._loader.load(tPath,/*laya.net.Loader.IMAGE*/"image",false);
		}
		else {
			this._currTileSet=null;
			this.initMap();
		}
	}

	__proto.adptTexture=function(tex){
		if (!tex)return;
		var pX=tex.uv[0];
		var pX1=tex.uv[2];
		var pY=tex.uv[1];
		var pY1=tex.uv[7];
		var dW=1 / tex.bitmap.width;
		var dH=1 / tex.bitmap.height;
		tex.uv[0]=tex.uv[6]=pX+dW;
		tex.uv[2]=tex.uv[4]=pX1-dW;
		tex.uv[1]=tex.uv[3]=pY+dH;
		tex.uv[5]=tex.uv[7]=pY1-dH;
	}

	/**
	*初始化地图
	*/
	__proto.initMap=function(){
		var i=0,n=0;
		for (var p in this._animationDic){
			var tAniData=this._animationDic[p];
			var gStart=0;
			gStart=this._texutreStartDic[tAniData.image];
			var tTileTexSet=this.getTexture(parseInt(p)+gStart);
			if (tAniData.mAniIdArray.length > 0){
				tTileTexSet.textureArray=[];
				tTileTexSet.durationTimeArray=tAniData.mDurationTimeArray;
				tTileTexSet.isAnimation=true;
				tTileTexSet.animationTotalTime=0;
				for (i=0,n=tTileTexSet.durationTimeArray.length;i < n;i++){
					tTileTexSet.animationTotalTime+=tTileTexSet.durationTimeArray[i];
				}
				for (i=0,n=tAniData.mAniIdArray.length;i < n;i++){
					var tTexture=this.getTexture(tAniData.mAniIdArray[i]+gStart);
					tTileTexSet.textureArray.push(tTexture);
				}
			}
		}
		this._gridWidth=Math.floor(this._gridWidth / this._mapTileW)*this._mapTileW;
		this._gridHeight=Math.floor(this._gridHeight / this._mapTileH)*this._mapTileH;
		if (this._gridWidth < this._mapTileW){
			this._gridWidth=this._mapTileW;
		}
		if (this._gridHeight < this._mapTileH){
			this._gridHeight=this._mapTileH;
		}
		this._gridW=Math.ceil(this._width / this._gridWidth);
		this._gridH=Math.ceil(this._height / this._gridHeight);
		this._totalGridNum=this._gridW *this._gridH;
		for (i=0;i < this._gridH;i++){
			var tGridArray=[];
			this._gridArray.push(tGridArray);
			for (var j=0;j < this._gridW;j++){
				tGridArray.push(null);
			}
		};
		var tLayerArray=this._jsonData.layers;
		var isFirst=true;
		var tTarLayerID=1;
		var tLayerTarLayerName;
		var preLayerTarName;
		var preLayer;
		for (var tLayerLoop=0;tLayerLoop < tLayerArray.length;tLayerLoop++){
			var tLayerData=tLayerArray[tLayerLoop];
			if (tLayerData.visible==true){
				var tMapLayer=new MapLayer();
				tMapLayer.init(tLayerData,this);
				if (!this.enableMergeLayer){
					this._mapSprite.addChild(tMapLayer);
					this._renderLayerArray.push(tMapLayer);
					}else{
					tLayerTarLayerName=tMapLayer.getLayerProperties("layer");
					isFirst=isFirst || (!preLayer)|| (tLayerTarLayerName !=preLayerTarName);
					if (isFirst){
						isFirst=false;
						tMapLayer.tarLayer=tMapLayer;
						preLayer=tMapLayer;
						this._mapSprite.addChild(tMapLayer);
						this._renderLayerArray.push(tMapLayer);
						}else{
						tMapLayer.tarLayer=preLayer;
					}
					preLayerTarName=tLayerTarLayerName;
				}
				this._layerArray.push(tMapLayer);
			}
		}
		if (this.removeCoveredTile){
			this.adptTiledMapData();
		}
		if (this.cacheAllAfterInit){
			this.cacheAllGrid();
		}
		this.moveViewPort(this._rect.x,this._rect.y);
		Laya.stage.addChild(this.mapSprite());
		if (this._completeHandler !=null){
			this._completeHandler.run();
		}
	}

	//这里应该发送消息，通知上层，地图创建完成
	__proto.addTileProperties=function(tileDataDic){
		var key;
		for (key in tileDataDic){
			this._tileProperties2[key]=tileDataDic[key];
		}
	}

	__proto.getTileUserData=function(id,sign,defaultV){
		if (!this._tileProperties2 || !this._tileProperties2[id] || !(sign in this._tileProperties2[id]))return defaultV;
		return this._tileProperties2[id][sign];
	}

	__proto.adptTiledMapData=function(){
		var i=0,len=0;
		len=this._layerArray.length;
		var tLayer;
		var noNeeds={};
		var tDatas;
		for (i=len-1;i >=0;i--){
			tLayer=this._layerArray[i];
			tDatas=tLayer._mapData;
			if (!tDatas)continue ;
			this.removeCoverd(tDatas,noNeeds);
			this.collectCovers(tDatas,noNeeds,i);
		}
	}

	__proto.removeCoverd=function(datas,noNeeds){
		var i=0,len=0;
		len=datas.length;
		for (i=0;i < len;i++){
			if (noNeeds[i]){
				datas[i]=0;
			}
		}
	}

	__proto.collectCovers=function(datas,noNeeds,layer){
		var i=0,len=0;
		len=datas.length;
		var tTileData=0;
		var isCover=0;
		for (i=0;i < len;i++){
			tTileData=datas[i];
			if (tTileData > 0){
				isCover=this.getTileUserData(tTileData-1,"type",0);
				if (isCover > 0){
					noNeeds[i]=tTileData;
				}
			}
		}
	}

	/**
	*得到一块指定的地图纹理
	*@param index 纹理的索引值，默认从1开始
	*@return
	*/
	__proto.getTexture=function(index){
		if (index < this._tileTexSetArr.length){
			return this._tileTexSetArr[index];
		}
		return null;
	}

	/**
	*得到地图的自定义属性
	*@param name 属性名称
	*@return
	*/
	__proto.getMapProperties=function(name){
		if (this._properties){
			return this._properties[name];
		}
		return null;
	}

	/**
	*得到tile自定义属性
	*@param index 地图块索引
	*@param id 具体的TileSetID
	*@param name 属性名称
	*@return
	*/
	__proto.getTileProperties=function(index,id,name){
		if (this._tileProperties[index] && this._tileProperties[index][id]){
			return this._tileProperties[index][id][name];
		}
		return null;
	}

	/**
	*通过纹理索引，生成一个可控制物件
	*@param index 纹理的索引值，默认从1开始
	*@return
	*/
	__proto.getSprite=function(index,width,height){
		if (0 < this._tileTexSetArr.length){
			var tGridSprite=new GridSprite();
			tGridSprite.initData(this,true);
			tGridSprite.size(width,height);
			var tTileTexSet=this._tileTexSetArr[index];
			if (tTileTexSet !=null && tTileTexSet.texture !=null){
				if (tTileTexSet.isAnimation){
					var tAnimationSprite=new TileAniSprite();
					this._index++;
					tAnimationSprite.setTileTextureSet(this._index.toString(),tTileTexSet);
					tGridSprite.addAniSprite(tAnimationSprite);
					tGridSprite.addChild(tAnimationSprite);
				}
				else {
					tGridSprite.graphics.drawTexture(tTileTexSet.texture,0,0,width,height);
				}
				tGridSprite.drawImageNum++;
			}
			return tGridSprite;
		}
		return null;
	}

	/**
	*设置视口的缩放中心点（例如：scaleX=scaleY=0.5,就是以视口中心缩放）
	*@param scaleX
	*@param scaleY
	*/
	__proto.setViewPortPivotByScale=function(scaleX,scaleY){
		this._pivotScaleX=scaleX;
		this._pivotScaleY=scaleY;
		this._fastDirty=true;
	}

	/**
	*移动视口
	*@param moveX 视口的坐标x
	*@param moveY 视口的坐标y
	*/
	__proto.moveViewPort=function(moveX,moveY){
		this._x=-moveX;
		this._y=-moveY;
		if (this._fastDirty){
			this._rect.x=moveX;
			this._rect.y=moveY;
			this.updateViewPort();
			}else{
			var dx=NaN,dy=NaN;
			dx=moveX-this._rect.x;
			dy=moveY-this._rect.y;
			this._rect.x=moveX;
			this._rect.y=moveY;
			this.updateViewPortFast(dx,dy);
		}
	}

	/**
	*改变视口大小
	*@param moveX 视口的坐标x
	*@param moveY 视口的坐标y
	*@param width 视口的宽
	*@param height 视口的高
	*/
	__proto.changeViewPort=function(moveX,moveY,width,height){
		if (moveX==this._rect.x && moveY==this._rect.y && width==this._rect.width && height==this._rect.height)return;
		if (width==this._rect.width && height==this._rect.height){
			this.moveViewPort(moveX,moveY);
			return;
		}
		this._fastDirty=true;
		this._x=-moveX;
		this._y=-moveY;
		this._rect.x=moveX;
		this._rect.y=moveY;
		this._rect.width=width;
		this._rect.height=height;
		this._viewPortWidth=width / this._scale;
		this._viewPortHeight=height / this._scale;
		this.updateViewPort();
	}

	/**
	*在锚点的基础上计算，通过宽和高，重新计算视口
	*@param width 新视口宽
	*@param height 新视口高
	*@param rect 返回的结果
	*@return
	*/
	__proto.changeViewPortBySize=function(width,height,rect){
		if (rect==null){
			rect=new Rectangle();
		}
		this._centerX=this._rect.x+this._rect.width *this._pivotScaleX;
		this._centerY=this._rect.y+this._rect.height *this._pivotScaleY;
		rect.x=this._centerX-width *this._pivotScaleX;
		rect.y=this._centerY-height *this._pivotScaleY;
		rect.width=width;
		rect.height=height;
		this.changeViewPort(rect.x,rect.y,rect.width,rect.height);
		return rect;
	}

	/**
	*快速更新视口 ,只有在视口大小和各种缩放信息没有改变时才可以使用这个函数更新
	*@param dx 视口偏移x
	*@param dy 视口偏移y
	*/
	__proto.updateViewPortFast=function(dx,dy){
		this._centerX+=dx;
		this._centerY+=dy;
		this._viewPortX+=dx;
		this._viewPortY+=dy;
		var posChanged=false;
		var dyG=dy / this._gridHeight;
		var dxG=dx / this._gridWidth;
		this._mapLogicRect.top+=dyG;
		this._mapLogicRect.bottom+=dyG;
		this._mapLogicRect.left+=dxG;
		this._mapLogicRect.right+=dxG;
		this._mapRect.top=0|this._mapLogicRect.top;
		this._mapRect.bottom=0|this._mapLogicRect.bottom;
		this._mapRect.left=0|this._mapLogicRect.left;
		this._mapRect.right=0|this._mapLogicRect.right;
		if (this._mapRect.top !=this._mapLastRect.top || this._mapRect.bottom !=this._mapLastRect.bottom || this._mapRect.left !=this._mapLastRect.left || this._mapRect.right !=this._mapLastRect.right){
			this.clipViewPort();
			this._mapLastRect.top=this._mapRect.top;
			this._mapLastRect.bottom=this._mapRect.bottom;
			this._mapLastRect.left=this._mapRect.left;
			this._mapLastRect.right=this._mapRect.right;
			posChanged=true;
		};posChanged=posChanged|| (dx !=0 || dy !=0);
		if (!posChanged)return;
		this.updateMapLayersPos();
	}

	/**
	*刷新地图层坐标
	*/
	__proto.updateMapLayersPos=function(){
		var tMapLayer;
		var len=this._renderLayerArray.length;
		for (var i=0;i < len;i++){
			tMapLayer=this._renderLayerArray[i];
			if (tMapLayer._gridSpriteArray.length > 0){
				tMapLayer.updateAloneObject();
				tMapLayer.pos(-this._viewPortX,-this._viewPortY);
			}
		}
	}

	/**
	*刷新视口
	*/
	__proto.updateViewPort=function(){
		this._fastDirty=false;
		var dw=this._rect.width *this._pivotScaleX;
		var dh=this._rect.height *this._pivotScaleY;
		this._centerX=this._rect.x+dw;
		this._centerY=this._rect.y+dh;
		var posChanged=false;
		var preValue=this._viewPortX;
		this._viewPortX=this._centerX-dw / this._scale;
		if (preValue !=this._viewPortX){
			posChanged=true;
			}else {
			preValue=this._viewPortY;
		}
		this._viewPortY=this._centerY-dh/ this._scale;
		if (!posChanged && preValue !=this._viewPortY){
			posChanged=true;
		}
		if (this._limitRange){
			var tRight=this._viewPortX+this._viewPortWidth;
			if (tRight > this._width){
				this._viewPortX=this._width-this._viewPortWidth;
			};
			var tBottom=this._viewPortY+this._viewPortHeight;
			if (tBottom > this._height){
				this._viewPortY=this._height-this._viewPortHeight;
			}
			if (this._viewPortX < 0){
				this._viewPortX=0;
			}
			if (this._viewPortY < 0){
				this._viewPortY=0;
			}
		};
		var tPaddingRect=this._paddingRect;
		this._mapLogicRect.top=(this._viewPortY-tPaddingRect.y)/ this._gridHeight;
		this._mapLogicRect.bottom=(this._viewPortY+this._viewPortHeight+tPaddingRect.height+tPaddingRect.y)/ this._gridHeight;
		this._mapLogicRect.left=(this._viewPortX-tPaddingRect.x)/ this._gridWidth;
		this._mapLogicRect.right=(this._viewPortX+this._viewPortWidth+tPaddingRect.width+tPaddingRect.x)/ this._gridWidth;
		this._mapRect.top=0|this._mapLogicRect.top;
		this._mapRect.bottom=0|this._mapLogicRect.bottom;
		this._mapRect.left=0|this._mapLogicRect.left;
		this._mapRect.right=0|this._mapLogicRect.right;
		if (this._mapRect.top !=this._mapLastRect.top || this._mapRect.bottom !=this._mapLastRect.bottom || this._mapRect.left !=this._mapLastRect.left || this._mapRect.right !=this._mapLastRect.right){
			this.clipViewPort();
			this._mapLastRect.top=this._mapRect.top;
			this._mapLastRect.bottom=this._mapRect.bottom;
			this._mapLastRect.left=this._mapRect.left;
			this._mapLastRect.right=this._mapRect.right;
			posChanged=true;
		}
		if (!posChanged)return;
		this.updateMapLayersPos();
	}

	/**
	*GRID裁剪
	*/
	__proto.clipViewPort=function(){
		var tSpriteNum=0;
		var tSprite;
		var tIndex=0;
		var tSub=0;
		var tAdd=0;
		var i=0,j=0;
		if (this._mapRect.left > this._mapLastRect.left){
			tSub=this._mapRect.left-this._mapLastRect.left;
			if (tSub > 0){
				for (j=this._mapLastRect.left;j < this._mapLastRect.left+tSub;j++){
					for (i=this._mapLastRect.top;i <=this._mapLastRect.bottom;i++){
						this.hideGrid(j,i);
					}
				}
			}
		}
		else {
			tAdd=Math.min(this._mapLastRect.left,this._mapRect.right+1)-this._mapRect.left;
			if (tAdd > 0){
				for (j=this._mapRect.left;j < this._mapRect.left+tAdd;j++){
					for (i=this._mapRect.top;i <=this._mapRect.bottom;i++){
						this.showGrid(j,i);
					}
				}
			}
		}
		if (this._mapRect.right > this._mapLastRect.right){
			tAdd=this._mapRect.right-this._mapLastRect.right;
			if (tAdd > 0){
				for (j=Math.max(this._mapLastRect.right+1,this._mapRect.left);j <=this._mapLastRect.right+tAdd;j++){
					for (i=this._mapRect.top;i <=this._mapRect.bottom;i++){
						this.showGrid(j,i);
					}
				}
			}
		}
		else {
			tSub=this._mapLastRect.right-this._mapRect.right
			if (tSub > 0){
				for (j=this._mapRect.right+1;j <=this._mapRect.right+tSub;j++){
					for (i=this._mapLastRect.top;i <=this._mapLastRect.bottom;i++){
						this.hideGrid(j,i);
					}
				}
			}
		}
		if (this._mapRect.top > this._mapLastRect.top){
			tSub=this._mapRect.top-this._mapLastRect.top;
			if (tSub > 0){
				for (i=this._mapLastRect.top;i < this._mapLastRect.top+tSub;i++){
					for (j=this._mapLastRect.left;j <=this._mapLastRect.right;j++){
						this.hideGrid(j,i);
					}
				}
			}
		}
		else {
			tAdd=Math.min(this._mapLastRect.top,this._mapRect.bottom+1)-this._mapRect.top;
			if (tAdd > 0){
				for (i=this._mapRect.top;i < this._mapRect.top+tAdd;i++){
					for (j=this._mapRect.left;j <=this._mapRect.right;j++){
						this.showGrid(j,i);
					}
				}
			}
		}
		if (this._mapRect.bottom > this._mapLastRect.bottom){
			tAdd=this._mapRect.bottom-this._mapLastRect.bottom;
			if (tAdd > 0){
				for (i=Math.max(this._mapLastRect.bottom+1,this._mapRect.top);i <=this._mapLastRect.bottom+tAdd;i++){
					for (j=this._mapRect.left;j <=this._mapRect.right;j++){
						this.showGrid(j,i);
					}
				}
			}
		}
		else {
			tSub=this._mapLastRect.bottom-this._mapRect.bottom
			if (tSub > 0){
				for (i=this._mapRect.bottom+1;i <=this._mapRect.bottom+tSub;i++){
					for (j=this._mapLastRect.left;j <=this._mapLastRect.right;j++){
						this.hideGrid(j,i);
					}
				}
			}
		}
	}

	/**
	*显示指定的GRID
	*@param gridX
	*@param gridY
	*/
	__proto.showGrid=function(gridX,gridY){
		if (gridX < 0 || gridX >=this._gridW || gridY < 0 || gridY >=this._gridH){
			return;
		};
		var i=0,j=0;
		var tGridSprite;
		var tTempArray=this._gridArray[gridY][gridX];
		if (tTempArray==null){
			tTempArray=this.getGridArray(gridX,gridY);
		}
		else {
			for (i=0;i < tTempArray.length && i < this._layerArray.length;i++){
				var tLayerSprite=this._layerArray[i];
				if (tLayerSprite && tTempArray[i]){
					tGridSprite=tTempArray[i];
					if (tGridSprite.visible==false && tGridSprite.drawImageNum > 0){
						tGridSprite.show();
					}
				}
			}
		}
	}

	__proto.cacheAllGrid=function(){
		var i=0,j=0;
		var tempArr;
		for (i=0;i < this._gridW;i++){
			for (j=0;j < this._gridH;j++){
				tempArr=this.getGridArray(i,j);
				this.cacheGridsArray(tempArr);
			}
		}
	}

	__proto.cacheGridsArray=function(arr){
		var canvas;
		if (!TiledMap._tempContext){
			TiledMap._tempContext=new RenderContext(1,1,HTMLCanvas.create(/*laya.resource.HTMLCanvas.TYPEAUTO*/"AUTO"));
		}
		canvas=TiledMap._tempContext.canvas;
		canvas.context.asBitmap=false;
		var i=0,len=0;
		len=arr.length;
		var tGrid;
		for (i=0;i < len;i++){
			tGrid=arr[i];
			canvas.clear();
			canvas.size(1,1);
			tGrid.render(TiledMap._tempContext,0,0);
			tGrid.hide();
		}
		canvas.clear();
		canvas.size(1,1);
	}

	__proto.getGridArray=function(gridX,gridY){
		var i=0,j=0;
		var tGridSprite;
		var tTempArray=this._gridArray[gridY][gridX];
		if (tTempArray==null){
			tTempArray=this._gridArray[gridY][gridX]=[];
			var tLeft=0;
			var tRight=0;
			var tTop=0;
			var tBottom=0;
			var tGridWidth=this._gridWidth;
			var tGridHeight=this._gridHeight;
			switch (this.orientation){
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
					tLeft=Math.floor(gridX *tGridWidth);
					tRight=Math.floor(gridX *tGridWidth+tGridWidth);
					tTop=Math.floor(gridY *tGridHeight);
					tBottom=Math.floor(gridY *tGridHeight+tGridHeight);
					var tLeft1=0,tRight1=0,tTop1=0,tBottom1=0;
					break ;
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
					tLeft=Math.floor(gridX *tGridWidth / this._mapTileW);
					tRight=Math.floor((gridX *tGridWidth+tGridWidth)/ this._mapTileW);
					tTop=Math.floor(gridY *tGridHeight / (this._mapTileH / 2));
					tBottom=Math.floor((gridY *tGridHeight+tGridHeight)/ (this._mapTileH / 2));
					break ;
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
					tLeft=Math.floor(gridX *tGridWidth / this._mapTileW);
					tRight=Math.floor((gridX *tGridWidth+tGridWidth)/ this._mapTileW);
					tTop=Math.floor(gridY *tGridHeight / this._mapTileH);
					tBottom=Math.floor((gridY *tGridHeight+tGridHeight)/ this._mapTileH);
					break ;
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":;
					var tHeight=this._mapTileH *2 / 3;
					tLeft=Math.floor(gridX *tGridWidth / this._mapTileW);
					tRight=Math.ceil((gridX *tGridWidth+tGridWidth)/ this._mapTileW);
					tTop=Math.floor(gridY *tGridHeight / tHeight);
					tBottom=Math.ceil((gridY *tGridHeight+tGridHeight)/ tHeight);
					break ;
				};
			var tLayer=null;
			var tTGridSprite;
			var tDrawMapLayer;
			for (var z=0;z < this._layerArray.length;z++){
				tLayer=this._layerArray[z];
				if (this.enableMergeLayer){
					if (tLayer.tarLayer !=tDrawMapLayer){
						tTGridSprite=null;
						tDrawMapLayer=tLayer.tarLayer;
					}
					if (!tTGridSprite){
						tTGridSprite=tDrawMapLayer.getDrawSprite(gridX,gridY);
						tTempArray.push(tTGridSprite);
					}
					tGridSprite=tTGridSprite;
				}
				else {
					tGridSprite=tLayer.getDrawSprite(gridX,gridY);
					tTempArray.push(tGridSprite);
				};
				var tColorStr;
				if (this._showGridKey){
					tColorStr="#";
					tColorStr+=this._colorArray[Math.floor(Math.random()*this._colorArray.length)];
					tColorStr+=this._colorArray[Math.floor(Math.random()*this._colorArray.length)];
					tColorStr+=this._colorArray[Math.floor(Math.random()*this._colorArray.length)];
				}
				switch (this.orientation){
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":;
						var tHalfTileHeight=this.tileHeight / 2;
						var tHalfTileWidth=this.tileWidth / 2;
						var tHalfMapWidth=this._width / 2;
						tTop1=Math.floor(tTop / tHalfTileHeight);
						tBottom1=Math.floor(tBottom / tHalfTileHeight);
						tLeft1=this._mapW+Math.floor((tLeft-tHalfMapWidth)/ tHalfTileWidth);
						tRight1=this._mapW+Math.floor((tRight-tHalfMapWidth)/ tHalfTileWidth);
						var tMapW=this._mapW *2;
						var tMapH=this._mapH *2;
						if (tTop1 < 0){
							tTop1=0;
						}
						if (tTop1 >=tMapH){
							tTop1=tMapH-1;
						}
						if (tBottom1 < 0){
							tBottom=0;
						}
						if (tBottom1 >=tMapH){
							tBottom1=tMapH-1;
						}
						tGridSprite.zOrder=this._totalGridNum *z+gridY *this._gridW+gridX;
						for (i=tTop1;i < tBottom1;i++){
							for (j=0;j <=i;j++){
								var tIndexX=i-j;
								var tIndexY=j;
								var tIndexValue=(tIndexX-tIndexY)+this._mapW;
								if (tIndexValue > tLeft1 && tIndexValue <=tRight1){
									if (tLayer.drawTileTexture(tGridSprite,tIndexX,tIndexY)){
										tGridSprite.drawImageNum++;
									}
								}
							}
						}
						break ;
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
						tGridSprite.zOrder=z *this._totalGridNum+gridY *this._gridW+gridX;
						for (i=tTop;i < tBottom;i++){
							for (j=tLeft;j < tRight;j++){
								if (tLayer.drawTileTexture(tGridSprite,j,i)){
									tGridSprite.drawImageNum++;
								}
							}
						}
						break ;
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":
					switch (this._renderOrder){
						case "right-down":
							tGridSprite.zOrder=z *this._totalGridNum+gridY *this._gridW+gridX;
							for (i=tTop;i < tBottom;i++){
								for (j=tLeft;j < tRight;j++){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						case "right-up":
							tGridSprite.zOrder=z *this._totalGridNum+(this._gridH-1-gridY)*this._gridW+gridX;
							for (i=tBottom-1;i >=tTop;i--){
								for (j=tLeft;j < tRight;j++){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						case "left-down":
							tGridSprite.zOrder=z *this._totalGridNum+gridY *this._gridW+(this._gridW-1-gridX);
							for (i=tTop;i < tBottom;i++){
								for (j=tRight-1;j >=tLeft;j--){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						case "left-up":
							tGridSprite.zOrder=z *this._totalGridNum+(this._gridH-1-gridY)*this._gridW+(this._gridW-1-gridX);
							for (i=tBottom-1;i >=tTop;i--){
								for (j=tRight-1;j >=tLeft;j--){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						}
					break ;
				}
				if (!tGridSprite.isHaveAnimation){
					tGridSprite.autoSize=true;
					if (this.autoCache)
						tGridSprite.cacheAs=this.autoCacheType;
					tGridSprite.autoSize=false;
				}
				if (!this.enableMergeLayer){
					if (tGridSprite.drawImageNum > 0){
						tLayer.addChild(tGridSprite);
						tGridSprite.visible=false;
						tGridSprite.show();
					}
					if (this._showGridKey){
						tGridSprite.graphics.drawRect(0,0,tGridWidth,tGridHeight,null,tColorStr);
					}
					}else{
					if (tTGridSprite && tTGridSprite.drawImageNum > 0&&tDrawMapLayer){
						tDrawMapLayer.addChild(tTGridSprite);
						tTGridSprite.visible=false;
						tTGridSprite.show();
					}
				}
			}
			if (this.enableMergeLayer&&this.showGridTextureCount){
				if (tTGridSprite){
					tTGridSprite.graphics.fillText(tTGridSprite.drawImageNum+"",20,20,null,"#ff0000","left");
				}
			}
		}
		return tTempArray;
	}

	/**
	*隐藏指定的GRID
	*@param gridX
	*@param gridY
	*/
	__proto.hideGrid=function(gridX,gridY){
		if (gridX < 0 || gridX >=this._gridW || gridY < 0 || gridY >=this._gridH){
			return;
		};
		var tTempArray=this._gridArray[gridY][gridX];
		if (tTempArray){
			var tGridSprite;
			for (var i=0;i < tTempArray.length;i++){
				tGridSprite=tTempArray[i];
				if (tGridSprite.drawImageNum > 0){
					if (tGridSprite !=null){
						tGridSprite.hide();
					}
				}
			}
		}
	}

	/**
	*得到对象层上的某一个物品
	*@param layerName 层的名称
	*@param objectName 所找物品的名称
	*@return
	*/
	__proto.getLayerObject=function(layerName,objectName){
		var tLayer=null;
		for (var i=0;i < this._layerArray.length;i++){
			tLayer=this._layerArray[i];
			if (tLayer.layerName==layerName){
				break ;
			}
		}
		if (tLayer){
			return tLayer.getObjectByName(objectName);
		}
		return null;
	}

	/**
	*销毁地图
	*/
	__proto.destroy=function(){
		this._orientation="orthogonal";
		this._jsonData=null;
		var i=0;
		var j=0;
		var z=0;
		this._gridArray=[];
		var tTileTexSet;
		for (i=0;i < this._tileTexSetArr.length;i++){
			tTileTexSet=this._tileTexSetArr[i];
			if (tTileTexSet){
				tTileTexSet.clearAll();
			}
		}
		this._tileTexSetArr=[];
		var tTexture;
		for (i=0;i < this._texArray.length;i++){
			tTexture=this._texArray[i];
			tTexture.destroy();
		}
		this._texArray=[];
		this._width=0;
		this._height=0;
		this._mapW=0;
		this._mapH=0;
		this._mapTileW=0;
		this._mapTileH=0;
		this._rect.setTo(0,0,0,0);
		var tLayer;
		for (i=0;i < this._layerArray.length;i++){
			tLayer=this._layerArray[i];
			tLayer.clearAll();
		}
		this._layerArray=[];
		this._renderLayerArray=[];
		if (this._mapSprite){
			this._mapSprite.destroy();
			this._mapSprite=null;
		}
		this._jsonLoader=null;
		this._loader=null;
		var tDic=this._animationDic;
		for (var p in tDic){
			delete tDic[p];
		}
		this._properties=null;
		tDic=this._tileProperties;
		for (p in tDic){
			delete tDic[p];
		}
		this._currTileSet=null;
		this._completeHandler=null;
		this._mapRect.clearAll();
		this._mapLastRect.clearAll();
		this._tileSetArray=[];
		this._gridWidth=450;
		this._gridHeight=450;
		this._gridW=0;
		this._gridH=0;
		this._x=0;
		this._y=0;
		this._index=0;
		this._enableLinear=true;
		this._resPath=null;
		this._pathArray=null;
	}

	/**
	*整个地图的显示容器
	*@return 地图的显示容器
	*/
	__proto.mapSprite=function(){
		return this._mapSprite;
	}

	/**
	*得到指定的MapLayer
	*@param layerName 要找的层名称
	*@return
	*/
	__proto.getLayerByName=function(layerName){
		var tMapLayer;
		for (var i=0;i < this._layerArray.length;i++){
			tMapLayer=this._layerArray[i];
			if (layerName==tMapLayer.layerName){
				return tMapLayer;
			}
		}
		return null;
	}

	/**
	*通过索引得MapLayer
	*@param index 要找的层索引
	*@return
	*/
	__proto.getLayerByIndex=function(index){
		if (index < this._layerArray.length){
			return this._layerArray[index];
		}
		return null;
	}

	/**
	*当前地图类型
	*/
	__getset(0,__proto,'orientation',function(){
		return this._orientation;
	});

	/**
	*@private
	*视口x坐标
	*/
	__getset(0,__proto,'viewPortX',function(){
		return-this._viewPortX;
	});

	/**
	*设置地图缩放
	*@param scale
	*/
	/**
	*得到当前地图的缩放
	*/
	__getset(0,__proto,'scale',function(){
		return this._scale;
		},function(scale){
		if (scale <=0)
			return;
		this._scale=scale;
		this._viewPortWidth=this._rect.width / scale;
		this._viewPortHeight=this._rect.height / scale;
		this._mapSprite.scale(this._scale,this._scale);
		this.updateViewPort();
	});

	/**
	*格子的宽度
	*/
	__getset(0,__proto,'tileWidth',function(){
		return this._mapTileW;
	});

	/**
	*@private
	*视口的y坐标
	*/
	__getset(0,__proto,'viewPortY',function(){
		return-this._viewPortY;
	});

	/**
	*格子的高度
	*/
	__getset(0,__proto,'tileHeight',function(){
		return this._mapTileH;
	});

	/**
	*地图的宽度
	*/
	__getset(0,__proto,'width',function(){
		return this._width;
	});

	/**
	*地图竖向的格子数
	*/
	__getset(0,__proto,'numRowsTile',function(){
		return this._mapH;
	});

	/**
	*地图横向的格子数
	*/
	__getset(0,__proto,'numColumnsTile',function(){
		return this._mapW;
	});

	/**
	*地图的高度
	*/
	__getset(0,__proto,'height',function(){
		return this._height;
	});

	/**
	*@private
	*视口的宽度
	*/
	__getset(0,__proto,'viewPortWidth',function(){
		return this._viewPortWidth;
	});

	/**
	*@private
	*视口的高度
	*/
	__getset(0,__proto,'viewPortHeight',function(){
		return this._viewPortHeight;
	});

	/**
	*地图的x坐标
	*/
	__getset(0,__proto,'x',function(){
		return this._x;
	});

	/**
	*地图的y坐标
	*/
	__getset(0,__proto,'y',function(){
		return this._y;
	});

	/**
	*块的宽度
	*/
	__getset(0,__proto,'gridWidth',function(){
		return this._gridWidth;
	});

	/**
	*块的高度
	*/
	__getset(0,__proto,'gridHeight',function(){
		return this._gridHeight;
	});

	/**
	*地图的横向块数
	*/
	__getset(0,__proto,'numColumnsGrid',function(){
		return this._gridW;
	});

	/**
	*地图的坚向块数
	*/
	__getset(0,__proto,'numRowsGrid',function(){
		return this._gridH;
	});

	/**
	*tile渲染顺序
	*/
	__getset(0,__proto,'renderOrder',function(){
		return this._renderOrder;
	});

	TiledMap.ORIENTATION_ORTHOGONAL="orthogonal";
	TiledMap.ORIENTATION_ISOMETRIC="isometric";
	TiledMap.ORIENTATION_STAGGERED="staggered";
	TiledMap.ORIENTATION_HEXAGONAL="hexagonal";
	TiledMap.RENDERORDER_RIGHTDOWN="right-down";
	TiledMap.RENDERORDER_RIGHTUP="right-up";
	TiledMap.RENDERORDER_LEFTDOWN="left-down";
	TiledMap.RENDERORDER_LEFTUP="left-up";
	TiledMap._tempContext=null;
	TiledMap.__init$=function(){
		//class GRect
		GRect=(function(){
			function GRect(){
				this.left=0;
				this.top=0;
				this.right=0;
				this.bottom=0;
			}
			__class(GRect,'');
			var __proto=GRect.prototype;
			__proto.clearAll=function(){
				this.left=this.top=this.right=this.bottom=0;
			}
			return GRect;
		})()
		//class TileMapAniData
		TileMapAniData=(function(){
			function TileMapAniData(){
				this.mAniIdArray=[];
				this.mDurationTimeArray=[];
				this.mTileTexSetArr=[];
				this.image=null;
			}
			__class(TileMapAniData,'');
			return TileMapAniData;
		})()
		//class TileSet
		TileSet=(function(){
			function TileSet(){
				this.firstgid=0;
				this.image="";
				this.imageheight=0;
				this.imagewidth=0;
				this.margin=0;
				this.name=0;
				this.properties=null;
				this.spacing=0;
				this.tileheight=0;
				this.tilewidth=0;
				this.titleoffsetX=0;
				this.titleoffsetY=0;
				this.tileproperties=null;
			}
			__class(TileSet,'');
			var __proto=TileSet.prototype;
			__proto.init=function(data){
				this.firstgid=data.firstgid;
				this.image=data.image;
				this.imageheight=data.imageheight;
				this.imagewidth=data.imagewidth;
				this.margin=data.margin;
				this.name=data.name;
				this.properties=data.properties;
				this.spacing=data.spacing;
				this.tileheight=data.tileheight;
				this.tilewidth=data.tilewidth;
				this.tileproperties=data.tileproperties;
				var tTileoffset=data.tileoffset;
				if (tTileoffset){
					this.titleoffsetX=tTileoffset.x;
					this.titleoffsetY=tTileoffset.y;
				}
			}
			return TileSet;
		})()
	}

	return TiledMap;
})()


/**
*此类是子纹理类，也包括同类动画的管理
*TiledMap会把纹理分割成无数子纹理，也可以把其中的某块子纹理替换成一个动画序列
*本类的实现就是如果发现子纹理被替换成一个动画序列，animationKey会被设为true
*即animationKey为true,就使用TileAniSprite来做显示，把动画序列根据时间画到TileAniSprite上
*@author ...
*/
//class laya.map.TileTexSet
var TileTexSet=(function(){
	function TileTexSet(){
		/**唯一标识*/
		this.gid=-1;
		/**子纹理的引用*/
		this.texture=null;
		/**纹理显示时的坐标偏移X*/
		this.offX=0;
		/**纹理显示时的坐标偏移Y*/
		this.offY=0;
		/**当前要播放动画的纹理序列*/
		this.textureArray=null;
		/**当前动画每帧的时间间隔*/
		this.durationTimeArray=null;
		/**动画播放的总时间 */
		this.animationTotalTime=0;
		/**true表示当前纹理，是一组动画，false表示当前只有一个纹理*/
		this.isAnimation=false;
		this._spriteNum=0;
		//当前动画有多少个显示对象
		this._aniDic=null;
		//通过显示对象的唯一名字，去保存显示显示对象
		this._frameIndex=0;
		//当前动画播放到第几帧
		this._time=0;
		//距离上次动画刷新，过了多少长时间
		this._interval=0;
		//每帧刷新的时间间隔
		this._preFrameTime=0;
	}

	__class(TileTexSet,'laya.map.TileTexSet');
	var __proto=TileTexSet.prototype;
	/**
	*加入一个动画显示对象到此动画中
	*@param aniName //显示对象的名字
	*@param sprite //显示对象
	*/
	__proto.addAniSprite=function(aniName,sprite){
		if (this.animationTotalTime==0){
			return;
		}
		if (this._aniDic==null){
			this._aniDic={};
		}
		if (this._spriteNum==0){
			Laya.timer.frameLoop(3,this,this.animate);
			this._preFrameTime=Browser.now();
			this._frameIndex=0;
			this._time=0;
			this._interval=0;
		}
		this._spriteNum++;
		this._aniDic[aniName]=sprite;
		if (this.textureArray && this._frameIndex < this.textureArray.length){
			var tTileTextureSet=this.textureArray[this._frameIndex];
			this.drawTexture(sprite,tTileTextureSet);
		}
	}

	/**
	*把动画画到所有注册的SPRITE上
	*/
	__proto.animate=function(){
		if (this.textureArray && this.textureArray.length > 0 && this.durationTimeArray && this.durationTimeArray.length > 0){
			var tNow=Browser.now();
			this._interval=tNow-this._preFrameTime;
			this._preFrameTime=tNow;
			if (this._interval > this.animationTotalTime){
				this._interval=this._interval % this.animationTotalTime;
			}
			this._time+=this._interval;
			var tTime=this.durationTimeArray[this._frameIndex];
			while (this._time > tTime){
				this._time-=tTime;
				this._frameIndex++;
				if (this._frameIndex >=this.durationTimeArray.length || this._frameIndex >=this.textureArray.length){
					this._frameIndex=0;
				};
				var tTileTextureSet=this.textureArray[this._frameIndex];
				var tSprite;
				for (var p in this._aniDic){
					tSprite=this._aniDic[p];
					this.drawTexture(tSprite,tTileTextureSet);
				}
				tTime=this.durationTimeArray[this._frameIndex];
			}
		}
	}

	__proto.drawTexture=function(sprite,tileTextSet){
		sprite.graphics.clear();
		sprite.graphics.drawTexture(tileTextSet.texture,tileTextSet.offX,tileTextSet.offY);
	}

	/**
	*移除不需要更新的SPRITE
	*@param _name
	*/
	__proto.removeAniSprite=function(_name){
		if (this._aniDic && this._aniDic[_name]){
			delete this._aniDic[_name];
			this._spriteNum--
			if (this._spriteNum==0){
				Laya.timer.clear(this,this.animate);
			}
		}
	}

	/**
	*显示当前动画的使用情况
	*/
	__proto.showDebugInfo=function(){
		var tInfo=null;
		if (this._spriteNum > 0){
			tInfo="TileTextureSet::gid:"+this.gid.toString()+" 动画数:"+this._spriteNum.toString();
		}
		return tInfo;
	}

	/**
	*清理
	*/
	__proto.clearAll=function(){
		this.gid=-1;
		if (this.texture){
			this.texture.destroy();
			this.texture=null;
		}
		this.offX=0;
		this.offY=0;
		this.textureArray=null;
		this.durationTimeArray=null;
		this.isAnimation=false;
		this._spriteNum=0;
		this._aniDic=null;
		this._frameIndex=0;
		this._preFrameTime=0;
		this._time=0;
		this._interval=0;
	}

	return TileTexSet;
})()


/**
*地图的每层都会分块渲染处理
*本类就是地图的块数据
*@author ...
*/
//class laya.map.GridSprite extends laya.display.Sprite
var GridSprite=(function(_super){
	function GridSprite(){
		/**相对于地图X轴的坐标*/
		this.relativeX=0;
		/**相对于地图Y轴的坐标*/
		this.relativeY=0;
		/**是否用于对象层的独立物件*/
		this.isAloneObject=false;
		/**当前GRID中是否有动画*/
		this.isHaveAnimation=false;
		/**当前GRID包含的动画*/
		this.aniSpriteArray=null;
		/**当前GRID包含多少个TILE(包含动画)*/
		this.drawImageNum=0;
		this._map=null;
		GridSprite.__super.call(this);
	}

	__class(GridSprite,'laya.map.GridSprite',_super);
	var __proto=GridSprite.prototype;
	/**
	*传入必要的参数，用于裁剪，跟确认此对象类型
	*@param map 把地图的引用传进来，参与一些裁剪计算
	*@param objectKey true:表示当前GridSprite是个活动对象，可以控制，false:地图层的组成块
	*/
	__proto.initData=function(map,objectKey){
		(objectKey===void 0)&& (objectKey=false);
		this._map=map;
		this.isAloneObject=objectKey;
	}

	/**@private */
	__proto._setDisplay=function(value){
		if (!value){
			var cc=this._$P.cacheCanvas;
			if (cc && cc.ctx){
				cc.ctx.canvas.destroy();
				cc.ctx=null;
			};
			var fc=this._$P._filterCache;
			if (fc){
				fc.destroy();
				fc.recycle();
				this._set$P('_filterCache',null);
			}
			this._$P._isHaveGlowFilter && this._set$P('_isHaveGlowFilter',false);
		}
		_super.prototype._setDisplay.call(this,value);
	}

	/**
	*把一个动画对象绑定到当前GridSprite
	*@param sprite 动画的显示对象
	*/
	__proto.addAniSprite=function(sprite){
		if (this.aniSpriteArray==null){
			this.aniSpriteArray=[];
		}
		this.aniSpriteArray.push(sprite);
	}

	/**
	*显示当前GridSprite，并把上面的动画全部显示
	*/
	__proto.show=function(){
		if (!this.visible){
			this.visible=true;
			if (!this.isAloneObject){
				var tParent;
				tParent=this.parent;
				if (tParent){
					tParent.showGridSprite(this);
				}
			}
			if (!Render.isWebGL&&this._map.autoCache){
				this.cacheAs=this._map.autoCacheType;
			}
			if (this.aniSpriteArray==null){
				return;
			};
			var tAniSprite;
			for (var i=0;i < this.aniSpriteArray.length;i++){
				tAniSprite=this.aniSpriteArray[i];
				tAniSprite.show();
			}
		}
	}

	/**
	*隐藏当前GridSprite，并把上面绑定的动画全部移除
	*/
	__proto.hide=function(){
		if (this.visible){
			this.visible=false;
			if (!this.isAloneObject){
				var tParent;
				tParent=this.parent;
				if (tParent){
					tParent.hideGridSprite(this);
				}
			}
			if (!Render.isWebGL&&this._map.autoCache){
				this.cacheAs="none";
			}
			if (this.aniSpriteArray==null){
				return;
			};
			var tAniSprite;
			for (var i=0;i < this.aniSpriteArray.length;i++){
				tAniSprite=this.aniSpriteArray[i];
				tAniSprite.hide();
			}
		}
	}

	/**
	*刷新坐标，当我们自己控制一个GridSprite移动时，需要调用此函数，手动刷新
	*/
	__proto.updatePos=function(){
		if (this.isAloneObject){
			if (this._map){
				this.x=this.relativeX;
				this.y=this.relativeY;
			}
			if (this.x < 0 || this.x > this._map.viewPortWidth || this.y < 0 || this.y > this._map.viewPortHeight){
				this.hide();
				}else {
				this.show();
			}
			}else {
			if (this._map){
				this.x=this.relativeX;
				this.y=this.relativeY;
			}
		}
	}

	/**
	*重置当前对象的所有属性
	*/
	__proto.clearAll=function(){
		if (this._map){
			this._map=null;
		}
		this.visible=false;
		var tAniSprite;
		if (this.aniSpriteArray !=null){
			for (var i=0;i < this.aniSpriteArray.length;i++){
				tAniSprite=this.aniSpriteArray[i];
				tAniSprite.clearAll();
			}
		}
		this.destroy();
		this.relativeX=0;
		this.relativeY=0;
		this.isHaveAnimation=false;
		this.aniSpriteArray=null;
		this.drawImageNum=0;
	}

	return GridSprite;
})(Sprite)


/**
*地图支持多层渲染（例如，地表层，植被层，建筑层等）
*本类就是层级类
*@author ...
*/
//class laya.map.MapLayer extends laya.display.Sprite
var MapLayer=(function(_super){
	function MapLayer(){
		this._map=null;
		this._mapData=null;
		this._tileWidthHalf=0;
		this._tileHeightHalf=0;
		this._mapWidthHalf=0;
		this._mapHeightHalf=0;
		/**
		*@private
		*/
		this._gridSpriteArray=[];
		this._objDic=null;
		//用来做字典，方便查询
		this._dataDic=null;
		//临时变量
		this._properties=null;
		/**被合到的层*/
		this.tarLayer=null;
		/**当前Layer的名称*/
		this.layerName=null;
		/**
		*当前需要更新的gridSprite列表
		*/
		this._showGridList=[];
		/**
		*活动对象列表,活动对象不管是否显示都需要更新
		*/
		this._aloneObjs=[];
		MapLayer.__super.call(this);
		this._tempMapPos=new Point();
	}

	__class(MapLayer,'laya.map.MapLayer',_super);
	var __proto=MapLayer.prototype;
	/**
	*解析LAYER数据，以及初始化一些数据
	*@param layerData 地图数据中，layer数据的引用
	*@param map 地图的引用
	*/
	__proto.init=function(layerData,map){
		this._map=map;
		this._mapData=layerData.data;
		var tHeight=layerData.height;
		var tWidth=layerData.width;
		var tTileW=map.tileWidth;
		var tTileH=map.tileHeight;
		this.layerName=layerData.name;
		this._properties=layerData.properties;
		this.alpha=layerData.opacity;
		this._tileWidthHalf=tTileW / 2;
		this._tileHeightHalf=tTileH / 2;
		this._mapWidthHalf=this._map.width / 2-this._tileWidthHalf;
		this._mapHeightHalf=this._map.height / 2;
		switch (layerData.type){
			case "tilelayer":
				break ;
			case "objectgroup":;
				var tObjectGid=0;
				var tArray=layerData.objects;
				if (tArray.length > 0){
					this._objDic={};
					this._dataDic={};
				};
				var tObjectData;
				var tObjWidth=NaN;
				var tObjHeight=NaN;
				for (var i=0;i < tArray.length;i++){
					tObjectData=tArray[i];
					this._dataDic[tObjectData.name]=tObjectData;
					if (tObjectData.visible==true){
						tObjWidth=tObjectData.width;
						tObjHeight=tObjectData.height;
						var tSprite=map.getSprite(tObjectData.gid,tObjWidth,tObjHeight);
						if (tSprite !=null){
						switch (this._map.orientation){
							case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
								this.getScreenPositionByTilePos(tObjectData.x / tTileH,tObjectData.y / tTileH,Point.TEMP);
								tSprite.pivot(tObjWidth / 2,tObjHeight / 2);
								tSprite.rotation=tObjectData.rotation;
								tSprite.x=tSprite.relativeX=Point.TEMP.x+this._map.viewPortX;
								tSprite.y=tSprite.relativeY=Point.TEMP.y+this._map.viewPortY-tObjHeight / 2;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
								tSprite.pivot(tObjWidth / 2,tObjHeight / 2);
								tSprite.rotation=tObjectData.rotation;
								tSprite.x=tSprite.relativeX=tObjectData.x+tObjWidth / 2;
								tSprite.y=tSprite.relativeY=tObjectData.y-tObjHeight / 2;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
								tSprite.pivot(tObjWidth / 2,tObjHeight / 2);
								tSprite.rotation=tObjectData.rotation;
								tSprite.x=tSprite.relativeX=tObjectData.x+tObjWidth / 2;
								tSprite.y=tSprite.relativeY=tObjectData.y-tObjHeight / 2;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":
								tSprite.x=tSprite.relativeX=tObjectData.x;
								tSprite.y=tSprite.relativeY=tObjectData.y;
								break ;
							}
						this.addChild(tSprite);
						this._gridSpriteArray.push(tSprite);
						if (tSprite.isAloneObject){
							this._showGridList.push(tSprite);
							this._aloneObjs.push(tSprite);
						}
						this._objDic[tObjectData.name]=tSprite;
					}
				}
			}
			break ;
		}
	}

	/**
	*通过名字获取控制对象，如果找不到返回为null
	*@param objName 所要获取对象的名字
	*@return
	*/
	__proto.getObjectByName=function(objName){
		if (this._objDic){
			return this._objDic[objName];
		}
		return null;
	}

	/**
	*通过名字获取数据，如果找不到返回为null
	*@param objName 所要获取对象的名字
	*@return
	*/
	__proto.getObjectDataByName=function(objName){
		if (this._dataDic){
			return this._dataDic[objName];
		}
		return null;
	}

	/**
	*得到地图层的自定义属性
	*@param name
	*@return
	*/
	__proto.getLayerProperties=function(name){
		if (this._properties){
			return this._properties[name];
		}
		return null;
	}

	/**
	*得到指定格子的数据
	*@param tileX 格子坐标X
	*@param tileY 格子坐标Y
	*@return
	*/
	__proto.getTileData=function(tileX,tileY){
		if (tileY >=0 && tileY < this._map.numRowsTile && tileX >=0 && tileX < this._map.numColumnsTile){
			var tIndex=tileY *this._map.numColumnsTile+tileX;
			var tMapData=this._mapData;
			if (tMapData !=null && tIndex < tMapData.length){
				return tMapData[tIndex];
			}
		}
		return 0;
	}

	/**
	*通过地图坐标得到屏幕坐标
	*@param tileX 格子坐标X
	*@param tileY 格子坐标Y
	*@param screenPos 把计算好的屏幕坐标数据，放到此对象中
	*/
	__proto.getScreenPositionByTilePos=function(tileX,tileY,screenPos){
		if (screenPos){
			switch (this._map.orientation){
				case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
					screenPos.x=this._map.width / 2-(tileY-tileX)*this._tileWidthHalf;
					screenPos.y=(tileY+tileX)*this._tileHeightHalf;
					break ;
				case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
					tileX=Math.floor(tileX);
					tileY=Math.floor(tileY);
					screenPos.x=tileX *this._map.tileWidth+(tileY & 1)*this._tileWidthHalf;
					screenPos.y=tileY *this._tileHeightHalf;
					break ;
				case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
					screenPos.x=tileX *this._map.tileWidth;
					screenPos.y=tileY *this._map.tileHeight;
					break ;
				case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":
					tileX=Math.floor(tileX);
					tileY=Math.floor(tileY);
					var tTileHeight=this._map.tileHeight *2 / 3;
					screenPos.x=(tileX *this._map.tileWidth+tileY % 2 *this._tileWidthHalf)% this._map.gridWidth;
					screenPos.y=(tileY *tTileHeight)% this._map.gridHeight;
					break ;
				}
			screenPos.x=(screenPos.x+this._map.viewPortX)*this._map.scale;
			screenPos.y=(screenPos.y+this._map.viewPortY)*this._map.scale;
		}
	}

	/**
	*通过屏幕坐标来获取选中格子的数据
	*@param screenX 屏幕坐标x
	*@param screenY 屏幕坐标y
	*@return
	*/
	__proto.getTileDataByScreenPos=function(screenX,screenY){
		var tData=0;
		if (this.getTilePositionByScreenPos(screenX,screenY,this._tempMapPos)){
			tData=this.getTileData(Math.floor(this._tempMapPos.x),Math.floor(this._tempMapPos.y));
		}
		return tData;
	}

	/**
	*通过屏幕坐标来获取选中格子的索引
	*@param screenX 屏幕坐标x
	*@param screenY 屏幕坐标y
	*@param result 把计算好的格子坐标，放到此对象中
	*@return
	*/
	__proto.getTilePositionByScreenPos=function(screenX,screenY,result){
		screenX=screenX/this._map.scale-this._map.viewPortX;
		screenY=screenY/this._map.scale-this._map.viewPortY;
		var tTileW=this._map.tileWidth;
		var tTileH=this._map.tileHeight;
		var tV=0;
		var tU=0;
		switch (this._map.orientation){
			case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":;
				var tDirX=screenX-this._map.width / 2;
				var tDirY=screenY;
				tV=-(tDirX / tTileW-tDirY / tTileH);
				tU=tDirX / tTileW+tDirY / tTileH;
				if (result){
					result.x=tU;
					result.y=tV;
				}
				return true;
				break ;
			case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
				if (result){
					var cx=0,cy=0,rx=0,ry=0;
					cx=Math.floor(screenX / tTileW)*tTileW+tTileW / 2;
					cy=Math.floor(screenY / tTileH)*tTileH+tTileH / 2;
					rx=(screenX-cx)*tTileH / 2;
					ry=(screenY-cy)*tTileW / 2;
					if (Math.abs(rx)+Math.abs(ry)<=tTileW *tTileH / 4){
						tU=Math.floor(screenX / tTileW);
						tV=Math.floor(screenY / tTileH)*2;
						}else {
						screenX=screenX-tTileW / 2;
						tU=Math.floor(screenX / tTileW)+1;
						screenY=screenY-tTileH / 2;
						tV=Math.floor(screenY / tTileH)*2+1;
					}
					result.x=tU-(tV & 1);
					result.y=tV;
				}
				return true;
				break ;
			case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
				tU=screenX / tTileW;
				tV=screenY / tTileH;
				if (result){
					result.x=tU;
					result.y=tV;
				}
				return true;
				break ;
			case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":;
				var tTileHeight=tTileH *2 / 3;
				tV=screenY / tTileHeight;
				tU=(screenX-tV % 2 *this._tileWidthHalf)/ tTileW;
				if (result){
					result.x=tU;
					result.y=tV;
				}
				break ;
			}
		return false;
	}

	/**
	*得到一个GridSprite
	*@param gridX 当前Grid的X轴索引
	*@param gridY 当前Grid的Y轴索引
	*@return 一个GridSprite对象
	*/
	__proto.getDrawSprite=function(gridX,gridY){
		var tSprite=new GridSprite();
		tSprite.relativeX=gridX *this._map.gridWidth;
		tSprite.relativeY=gridY *this._map.gridHeight;
		tSprite.initData(this._map);
		tSprite.updatePos();
		this._gridSpriteArray.push(tSprite);
		return tSprite;
	}

	/**
	*将gridSprite设为显示状态
	*@param gridSprite
	*/
	__proto.showGridSprite=function(gridSprite){
		var gridList=this._showGridList;
		var i=0,len=0;
		len=gridList.length;
		var ok_i=-1;
		var tGridSprite;
		for (i=0;i < len;i++){
			tGridSprite=gridList[i];
			if (tGridSprite==gridSprite)return;
			if (!tGridSprite.isAloneObject && !tGridSprite.visible){
				ok_i=i;
			}
		}
		if (ok_i >=0){
			gridList[ok_i]=gridSprite;
			}else{
			gridList.push(gridSprite);
		}
	}

	/**
	*将gridSprite设为隐藏状态
	*@param gridSprite
	*
	*/
	__proto.hideGridSprite=function(gridSprite){
		gridSprite.visible=false;
	}

	/**
	*更新此层中块的坐标
	*手动刷新的目的是，保持层级的宽和高保持最小，加快渲染
	*/
	__proto.updateGridPos=function(){
		var tSprite;
		var tList;
		tList=this._showGridList;
		var len=0;
		len=tList.length;
		for (var i=0;i < len;i++){
			tSprite=tList[i];
			if ((tSprite._style.visible || tSprite.isAloneObject)&& tSprite.drawImageNum > 0){
				tSprite.updatePos();
			}
		}
	}

	/**
	*更新此层中的活动对象
	*/
	__proto.updateAloneObject=function(){
		var tSprite;
		var tList;
		tList=this._aloneObjs;
		var len=0;
		len=tList.length;
		for (var i=0;i < len;i++){
			tSprite=tList[i];
			if (tSprite.drawImageNum > 0){
				tSprite.updatePos();
			}
		}
	}

	/**
	*渲染时使用需要更新的列表进行渲染，减少遍历
	*@param context
	*@param x
	*@param y
	*
	*/
	__proto.render=function(context,x,y){
		var childs=this._childs;
		this._childs=this._showGridList;
		_super.prototype.render.call(this,context,x,y);
		this._childs=childs;
	}

	/**
	*@private
	*把tile画到指定的显示对象上
	*@param gridSprite 被指定显示的目标
	*@param tileX 格子的X轴坐标
	*@param tileY 格子的Y轴坐标
	*@return
	*/
	__proto.drawTileTexture=function(gridSprite,tileX,tileY){
		if (tileY >=0 && tileY < this._map.numRowsTile && tileX >=0 && tileX < this._map.numColumnsTile){
			var tIndex=tileY *this._map.numColumnsTile+tileX;
			var tMapData=this._mapData;
			if (tMapData !=null && tIndex < tMapData.length){
				if (tMapData[tIndex] !=0){
					var tTileTexSet=this._map.getTexture(tMapData[tIndex]);
					if (tTileTexSet){
						var tX=0;
						var tY=0;
						var tTexture=tTileTexSet.texture;
						switch (this._map.orientation){
							case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
								tX=tileX *this._map.tileWidth % this._map.gridWidth+(tileY & 1)*this._tileWidthHalf;
								tY=tileY *this._tileHeightHalf % this._map.gridHeight;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
								tX=tileX *this._map.tileWidth % this._map.gridWidth;
								tY=tileY *this._map.tileHeight % this._map.gridHeight;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
								tX=(this._mapWidthHalf+(tileX-tileY)*this._tileWidthHalf)% this._map.gridWidth;
								tY=((tileX+tileY)*this._tileHeightHalf)% this._map.gridHeight;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":;
								var tTileHeight=this._map.tileHeight *2 / 3;
								tX=(tileX *this._map.tileWidth+tileY % 2 *this._tileWidthHalf)% this._map.gridWidth;
								tY=(tileY *tTileHeight)% this._map.gridHeight;
								break ;
							}
						if (tTileTexSet.isAnimation){
							var tAnimationSprite=new TileAniSprite();
							tAnimationSprite.x=tX;
							tAnimationSprite.y=tY;
							tAnimationSprite.setTileTextureSet(tIndex.toString(),tTileTexSet);
							gridSprite.addAniSprite(tAnimationSprite);
							gridSprite.addChild(tAnimationSprite);
							gridSprite.isHaveAnimation=true;
							}else {
							gridSprite.graphics.drawTexture(tTileTexSet.texture,tX+tTileTexSet.offX,tY+tTileTexSet.offY);
						}
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	*@private
	*清理当前对象
	*/
	__proto.clearAll=function(){
		this._map=null;
		this._mapData=null;
		this._tileWidthHalf=0;
		this._tileHeightHalf=0;
		this._mapWidthHalf=0;
		this._mapHeightHalf=0;
		this.layerName=null;
		var i=0;
		if (this._objDic){
			for (var p in this._objDic){
				delete this._objDic[p];
			}
			this._objDic=null;
		}
		if (this._dataDic){
			for (p in this._dataDic){
				delete this._dataDic[p];
			}
			this._dataDic=null;
		};
		var tGridSprite;
		for (i=0;i < this._gridSpriteArray.length;i++){
			tGridSprite=this._gridSpriteArray[i];
			tGridSprite.clearAll();
		}
		this._properties=null;
		this._tempMapPos=null;
		this.tarLayer=null;
	}

	return MapLayer;
})(Sprite)


/**
*TildMap的动画显示对象（一个动画（TileTexSet），可以绑定多个动画显示对象（TileAniSprite））
*@author ...
*/
//class laya.map.TileAniSprite extends laya.display.Sprite
var TileAniSprite=(function(_super){
	function TileAniSprite(){
		this._tileTextureSet=null;
		//动画的引用
		this._aniName=null;
		TileAniSprite.__super.call(this);
	}

	__class(TileAniSprite,'laya.map.TileAniSprite',_super);
	var __proto=TileAniSprite.prototype;
	/**
	*确定当前显示对象的名称以及属于哪个动画
	*@param aniName 当前动画显示对象的名字，名字唯一
	*@param tileTextureSet 当前显示对象属于哪个动画（一个动画，可以绑定多个同类显示对象）
	*/
	__proto.setTileTextureSet=function(aniName,tileTextureSet){
		this._aniName=aniName;
		this._tileTextureSet=tileTextureSet;
		tileTextureSet.addAniSprite(this._aniName,this);
	}

	/**
	*把当前动画加入到对应的动画刷新列表中
	*/
	__proto.show=function(){
		this._tileTextureSet.addAniSprite(this._aniName,this);
	}

	/**
	*把当前动画从对应的动画刷新列表中移除
	*/
	__proto.hide=function(){
		this._tileTextureSet.removeAniSprite(this._aniName);
	}

	/**
	*清理
	*/
	__proto.clearAll=function(){
		this._tileTextureSet.removeAniSprite(this._aniName);
		this.destroy();
		this._tileTextureSet=null;
		this._aniName=null;
	}

	return TileAniSprite;
})(Sprite)


	Laya.__init([TiledMap]);
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