
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Bezier=laya.maths.Bezier,Browser=laya.utils.Browser,Byte=laya.utils.Byte,Event=laya.events.Event;
	var EventDispatcher=laya.events.EventDispatcher,Graphics=laya.display.Graphics,HTMLCanvas=laya.resource.HTMLCanvas;
	var Handler=laya.utils.Handler,Loader=laya.net.Loader,MathUtil=laya.maths.MathUtil,Matrix=laya.maths.Matrix;
	var Node=laya.display.Node,Point=laya.maths.Point,Rectangle=laya.maths.Rectangle,Render=laya.renders.Render;
	var RenderContext=laya.renders.RenderContext,Resource=laya.resource.Resource,RunDriver=laya.utils.RunDriver;
	var SoundChannel=laya.media.SoundChannel,SoundManager=laya.media.SoundManager,Sprite=laya.display.Sprite;
	var Stat=laya.utils.Stat,Texture=laya.resource.Texture,URL=laya.net.URL,Utils=laya.utils.Utils;
/**
*@private
*@author ...
*/
//class laya.ani.AnimationContent
var AnimationContent=(function(){
	function AnimationContent(){
		this.nodes=null;
		this.name=null;
		this.playTime=NaN;
		this.bone3DMap=null;
		this.totalKeyframeDatasLength=0;
	}

	__class(AnimationContent,'laya.ani.AnimationContent');
	return AnimationContent;
})()


/**
*@private
*@author ...
*/
//class laya.ani.AnimationNodeContent
var AnimationNodeContent=(function(){
	function AnimationNodeContent(){
		this.name=null;
		this.parentIndex=0;
		this.parent=null;
		this.keyframeWidth=0;
		this.lerpType=0;
		this.interpolationMethod=null;
		this.childs=null;
		this.keyFrame=null;
		//=new Vector.<KeyFramesContent>;
		this.playTime=NaN;
		this.extenData=null;
		this.dataOffset=0;
	}

	__class(AnimationNodeContent,'laya.ani.AnimationNodeContent');
	return AnimationNodeContent;
})()


/**
*@private
*/
//class laya.ani.AnimationParser01
var AnimationParser01=(function(){
	function AnimationParser01(){}
	__class(AnimationParser01,'laya.ani.AnimationParser01');
	AnimationParser01.parse=function(templet,reader){
		var data=reader.__getBuffer();
		var i=0,j=0,k=0,n=0,l=0,m=0,o=0;
		var aniClassName=reader.readUTFString();
		templet._aniClassName=aniClassName;
		var strList=reader.readUTFString().split("\n");
		var aniCount=reader.getUint8();
		var publicDataPos=reader.getUint32();
		var publicExtDataPos=reader.getUint32();
		var publicData;
		if (publicDataPos > 0)
			publicData=data.slice(publicDataPos,publicExtDataPos);
		var publicRead=new Byte(publicData);
		if (publicExtDataPos > 0)
			templet._publicExtData=data.slice(publicExtDataPos,data.byteLength);
		templet._useParent=!!reader.getUint8();
		templet._anis.length=aniCount;
		for (i=0;i < aniCount;i++){
			var ani=templet._anis[i]=new AnimationContent();
			{};
			ani.nodes=new Array;
			var name=ani.name=strList[reader.getUint16()];
			templet._aniMap[name]=i;
			ani.bone3DMap={};
			ani.playTime=reader.getFloat32();
			var boneCount=ani.nodes.length=reader.getUint8();
			ani.totalKeyframeDatasLength=0;
			for (j=0;j < boneCount;j++){
				var node=ani.nodes[j]=new AnimationNodeContent();
				{};
				node.childs=[];
				var nameIndex=reader.getInt16();
				if (nameIndex >=0){
					node.name=strList[nameIndex];
					ani.bone3DMap[node.name]=j;
				}
				node.keyFrame=new Array;
				node.parentIndex=reader.getInt16();
				node.parentIndex==-1 ? node.parent=null :node.parent=ani.nodes[node.parentIndex]
				node.lerpType=reader.getUint8();
				var keyframeParamsOffset=reader.getUint32();
				publicRead.pos=keyframeParamsOffset;
				var keyframeDataCount=node.keyframeWidth=publicRead.getUint16();
				ani.totalKeyframeDatasLength+=keyframeDataCount;
				if (node.lerpType===0 || node.lerpType===1){
					node.interpolationMethod=[];
					node.interpolationMethod.length=keyframeDataCount;
					for (k=0;k < keyframeDataCount;k++)
					node.interpolationMethod[k]=AnimationTemplet.interpolation[publicRead.getUint8()];
				}
				if (node.parent !=null)
					node.parent.childs.push(node);
				var privateDataLen=reader.getUint16();
				if (privateDataLen > 0){
					node.extenData=data.slice(reader.pos,reader.pos+privateDataLen);
					reader.pos+=privateDataLen;
				};
				var keyframeCount=reader.getUint16();
				node.keyFrame.length=keyframeCount;
				var startTime=0;
				var keyFrame;
				for (k=0,n=keyframeCount;k < n;k++){
					keyFrame=node.keyFrame[k]=new KeyFramesContent();
					{};
					keyFrame.duration=reader.getFloat32();
					keyFrame.startTime=startTime;
					if (node.lerpType===2){
						keyFrame.interpolationData=[];
						var interDataLength=reader.getUint8();
						var lerpType=0;
						lerpType=reader.getFloat32();
						switch (lerpType){
							case 254:
								keyFrame.interpolationData.length=keyframeDataCount;
								for (o=0;o < keyframeDataCount;o++)
								keyFrame.interpolationData[o]=0;
								break ;
							case 255:
								keyFrame.interpolationData.length=keyframeDataCount;
								for (o=0;o < keyframeDataCount;o++)
								keyFrame.interpolationData[o]=5;
								break ;
							default :
								keyFrame.interpolationData.push(lerpType);
								for (m=1;m < interDataLength;m++){
									keyFrame.interpolationData.push(reader.getFloat32());
								}
							}
					}
					keyFrame.data=new Float32Array(keyframeDataCount);
					for (l=0;l < keyframeDataCount;l++){
						keyFrame.data[l]=reader.getFloat32();
						if (keyFrame.data[l] >-0.00000001 && keyFrame.data[l] < 0.00000001)keyFrame.data[l]=0;
					}
					startTime+=keyFrame.duration;
				}
				keyFrame.startTime=ani.playTime;
				node.playTime=ani.playTime;
				templet._calculateKeyFrame(node,keyframeCount,keyframeDataCount);
			}
		}
	}

	return AnimationParser01;
})()


/**
*@private
*/
//class laya.ani.AnimationParser02
var AnimationParser02=(function(){
	function AnimationParser02(){}
	__class(AnimationParser02,'laya.ani.AnimationParser02');
	AnimationParser02.READ_DATA=function(){
		AnimationParser02._DATA.offset=AnimationParser02._reader.getUint32();
		AnimationParser02._DATA.size=AnimationParser02._reader.getUint32();
	}

	AnimationParser02.READ_BLOCK=function(){
		var count=AnimationParser02._BLOCK.count=AnimationParser02._reader.getUint16();
		var blockStarts=AnimationParser02._BLOCK.blockStarts=[];
		var blockLengths=AnimationParser02._BLOCK.blockLengths=[];
		for (var i=0;i < count;i++){
			blockStarts.push(AnimationParser02._reader.getUint32());
			blockLengths.push(AnimationParser02._reader.getUint32());
		}
	}

	AnimationParser02.READ_STRINGS=function(){
		var offset=AnimationParser02._reader.getUint32();
		var count=AnimationParser02._reader.getUint16();
		var prePos=AnimationParser02._reader.pos;
		AnimationParser02._reader.pos=offset+AnimationParser02._DATA.offset;
		for (var i=0;i < count;i++)
		AnimationParser02._strings[i]=AnimationParser02._reader.readUTFString();
		AnimationParser02._reader.pos=prePos;
	}

	AnimationParser02.parse=function(templet,reader){
		AnimationParser02._templet=templet;
		AnimationParser02._reader=reader;
		var arrayBuffer=reader.__getBuffer();
		AnimationParser02.READ_DATA();
		AnimationParser02.READ_BLOCK();
		AnimationParser02.READ_STRINGS();
		for (var i=0,n=AnimationParser02._BLOCK.count;i < n;i++){
			var index=reader.getUint16();
			var blockName=AnimationParser02._strings[index];
			var fn=AnimationParser02["READ_"+blockName];
			if (fn==null)
				throw new Error("model file err,no this function:"+index+" "+blockName);
			else
			fn.call();
		}
	}

	AnimationParser02.READ_ANIMATIONS=function(){
		var reader=AnimationParser02._reader;
		var arrayBuffer=reader.__getBuffer();
		var i=0,j=0,k=0,n=0,l=0;
		var keyframeWidth=reader.getUint16();
		var interpolationMethod=[];
		interpolationMethod.length=keyframeWidth;
		for (i=0;i < keyframeWidth;i++)
		interpolationMethod[i]=AnimationTemplet.interpolation[reader.getByte()];
		var aniCount=reader.getUint8();
		AnimationParser02._templet._anis.length=aniCount;
		for (i=0;i < aniCount;i++){
			var ani=AnimationParser02._templet._anis[i]=
			{};
			ani.nodes=new Array;
			var aniName=ani.name=AnimationParser02._strings[reader.getUint16()];
			AnimationParser02._templet._aniMap[aniName]=i;
			ani.bone3DMap={};
			ani.playTime=reader.getFloat32();
			var boneCount=ani.nodes.length=reader.getInt16();
			ani.totalKeyframeDatasLength=0;
			for (j=0;j < boneCount;j++){
				var node=ani.nodes[j]=
				{};
				node.keyframeWidth=keyframeWidth;
				node.childs=[];
				var nameIndex=reader.getUint16();
				if (nameIndex >=0){
					node.name=AnimationParser02._strings[nameIndex];
					ani.bone3DMap[node.name]=j;
				}
				node.keyFrame=new Array;
				node.parentIndex=reader.getInt16();
				node.parentIndex==-1 ? node.parent=null :node.parent=ani.nodes[node.parentIndex]
				ani.totalKeyframeDatasLength+=keyframeWidth;
				node.interpolationMethod=interpolationMethod;
				if (node.parent !=null)
					node.parent.childs.push(node);
				var keyframeCount=reader.getUint16();
				node.keyFrame.length=keyframeCount;
				var keyFrame=null,lastKeyFrame=null;
				for (k=0,n=keyframeCount;k < n;k++){
					keyFrame=node.keyFrame[k]=
					{};
					keyFrame.startTime=reader.getFloat32();
					(lastKeyFrame)&& (lastKeyFrame.duration=keyFrame.startTime-lastKeyFrame.startTime);
					var offset=AnimationParser02._DATA.offset;
					var keyframeDataOffset=reader.getUint32();
					var keyframeDataLength=keyframeWidth *4;
					var keyframeArrayBuffer=arrayBuffer.slice(offset+keyframeDataOffset,offset+keyframeDataOffset+keyframeDataLength);
					keyFrame.data=new Float32Array(keyframeArrayBuffer);
					lastKeyFrame=keyFrame;
				}
				keyFrame.duration=0;
				node.playTime=ani.playTime;
				AnimationParser02._templet._calculateKeyFrame(node,keyframeCount,keyframeWidth);
			}
		}
	}

	AnimationParser02._templet=null;
	AnimationParser02._reader=null;
	AnimationParser02._strings=[];
	__static(AnimationParser02,
	['_BLOCK',function(){return this._BLOCK={count:0};},'_DATA',function(){return this._DATA={offset:0,size:0};}
	]);
	return AnimationParser02;
})()


/**
*@private
*/
//class laya.ani.AnimationState
var AnimationState=(function(){
	function AnimationState(){}
	__class(AnimationState,'laya.ani.AnimationState');
	AnimationState.stopped=0;
	AnimationState.paused=1;
	AnimationState.playing=2;
	return AnimationState;
})()


/**
*@private
*/
//class laya.ani.bone.Bone
var Bone=(function(){
	function Bone(){
		this.name=null;
		this.root=null;
		this.parentBone=null;
		this.length=10;
		this.transform=null;
		this.inheritScale=true;
		this.inheritRotation=true;
		this.rotation=NaN;
		this.resultRotation=NaN;
		this.d=-1;
		this._tempMatrix=null;
		this._sprite=null;
		this.resultTransform=new Transform();
		this.resultMatrix=new Matrix();
		this._children=[];
	}

	__class(Bone,'laya.ani.bone.Bone');
	var __proto=Bone.prototype;
	__proto.setTempMatrix=function(matrix){
		this._tempMatrix=matrix;
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.setTempMatrix(this._tempMatrix);
		}
	}

	__proto.update=function(pMatrix){
		this.rotation=this.transform.skX;
		var tResultMatrix;
		if (pMatrix){
			tResultMatrix=this.resultTransform.getMatrix();
			Matrix.mul(tResultMatrix,pMatrix,this.resultMatrix);
			this.resultRotation=this.rotation;
		}
		else {
			this.resultRotation=this.rotation+this.parentBone.resultRotation;
			if (this.parentBone){
				if (this.inheritRotation && this.inheritScale){
					tResultMatrix=this.resultTransform.getMatrix();
					Matrix.mul(tResultMatrix,this.parentBone.resultMatrix,this.resultMatrix);
				}
				else {
					var temp=0;
					var parent=this.parentBone;
					var tAngle=NaN;
					var cos=NaN;
					var sin=NaN;
					var tParentMatrix=this.parentBone.resultMatrix;
					tResultMatrix=this.resultTransform.getMatrix();
					var worldX=tParentMatrix.a *tResultMatrix.tx+tParentMatrix.c *tResultMatrix.ty+tParentMatrix.tx;
					var worldY=tParentMatrix.b *tResultMatrix.tx+tParentMatrix.d *tResultMatrix.ty+tParentMatrix.ty;
					var tTestMatrix=new Matrix();
					if (this.inheritRotation){
						tAngle=Math.atan2(parent.resultMatrix.b,parent.resultMatrix.a);
						cos=Math.cos(tAngle),sin=Math.sin(tAngle);
						tTestMatrix.setTo(cos,sin,-sin,cos,0,0);
						Matrix.mul(this._tempMatrix,tTestMatrix,Matrix.TEMP);
						Matrix.TEMP.copyTo(tTestMatrix);
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.mul(tResultMatrix,tTestMatrix,this.resultMatrix);
						if (this.resultTransform.scX *this.resultTransform.scY < 0){
							this.resultMatrix.rotate(Math.PI*0.5);
						}
						this.resultMatrix.tx=worldX;
						this.resultMatrix.ty=worldY;
					}
					else if (this.inheritScale){
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.TEMP.identity();
						Matrix.TEMP.d=this.d;
						Matrix.mul(tResultMatrix,Matrix.TEMP,this.resultMatrix);
						this.resultMatrix.tx=worldX;
						this.resultMatrix.ty=worldY;
					}
					else {
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.TEMP.identity();
						Matrix.TEMP.d=this.d;
						Matrix.mul(tResultMatrix,Matrix.TEMP,this.resultMatrix);
						this.resultMatrix.tx=worldX;
						this.resultMatrix.ty=worldY;
					}
				}
			}
			else {
				tResultMatrix=this.resultTransform.getMatrix();
				tResultMatrix.copyTo(this.resultMatrix);
			}
		};
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.update();
		}
	}

	__proto.updateChild=function(){
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.update();
		}
	}

	__proto.setRotation=function(rd){
		if (this._sprite){
			this._sprite.rotation=rd *180 / Math.PI;
		}
	}

	__proto.updateDraw=function(x,y){
		if (!Bone.ShowBones || Bone.ShowBones[this.name]){
			if (this._sprite){
				this._sprite.x=x+this.resultMatrix.tx;
				this._sprite.y=y+this.resultMatrix.ty;
			}
			else {
				this._sprite=new Sprite();
				this._sprite.graphics.drawCircle(0,0,5,"#ff0000");
				this._sprite.graphics.drawLine(0,0,this.length,0,"#00ff00");
				this._sprite.graphics.fillText(this.name,0,0,"20px Arial","#00ff00","center");
				Laya.stage.addChild(this._sprite);
				this._sprite.x=x+this.resultMatrix.tx;
				this._sprite.y=y+this.resultMatrix.ty;
			}
		};
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.updateDraw(x,y);
		}
	}

	__proto.addChild=function(bone){
		this._children.push(bone);
		bone.parentBone=this;
	}

	__proto.findBone=function(boneName){
		if (this.name==boneName){
			return this;
		}
		else {
			var i=0,n=0;
			var tBone;
			var tResult;
			for (i=0,n=this._children.length;i < n;i++){
				tBone=this._children[i];
				tResult=tBone.findBone(boneName);
				if (tResult){
					return tResult;
				}
			}
		}
		return null;
	}

	__proto.localToWorld=function(local){
		var localX=local[0];
		var localY=local[1];
		local[0]=localX *this.resultMatrix.a+localY *this.resultMatrix.c+this.resultMatrix.tx;
		local[1]=localX *this.resultMatrix.b+localY *this.resultMatrix.d+this.resultMatrix.ty;
	}

	Bone.ShowBones={};
	return Bone;
})()


/**
*@private
*/
//class laya.ani.bone.BoneSlot
var BoneSlot=(function(){
	function BoneSlot(){
		/**插槽名称 */
		this.name=null;
		/**插槽绑定的骨骼名称 */
		this.parent=null;
		/**插糟显示数据数据的名称 */
		this.attachmentName=null;
		/**原始数据的索引 */
		this.srcDisplayIndex=-1;
		/**判断对象是否是原对象 */
		this.type="src";
		/**模板的指针 */
		this.templet=null;
		/**当前插槽对应的数据 */
		this.currSlotData=null;
		/**当前插槽显示的纹理 */
		this.currTexture=null;
		/**显示对象对应的数据 */
		this.currDisplayData=null;
		/**显示皮肤的索引 */
		this.displayIndex=-1;
		/**@private */
		this.originalIndex=-1;
		/**用户自定义的皮肤 */
		this._diyTexture=null;
		this._parentMatrix=null;
		this._resultMatrix=null;
		/**索引替换表 */
		this._replaceDic={};
		/**当前diyTexture的动画纹理 */
		this._curDiyUV=null;
		this._curDiyVS=null;
		/**实时模式下，复用使用 */
		this._skinSprite=null;
		/**@private 变形动画数据 */
		this.deformData=null;
		this._mVerticleArr=null;
	}

	__class(BoneSlot,'laya.ani.bone.BoneSlot');
	var __proto=BoneSlot.prototype;
	/**
	*设置要显示的插槽数据
	*@param slotData
	*@param disIndex
	*@param freshIndex 是否重置纹理
	*/
	__proto.showSlotData=function(slotData,freshIndex){
		(freshIndex===void 0)&& (freshIndex=true);
		this.currSlotData=slotData;
		if(freshIndex)
			this.displayIndex=this.srcDisplayIndex;
		this.currDisplayData=null;
		this.currTexture=null;
	}

	/**
	*通过名字显示指定对象
	*@param name
	*/
	__proto.showDisplayByName=function(name){
		if (this.currSlotData){
			this.showDisplayByIndex(this.currSlotData.getDisplayByName(name));
		}
	}

	/**
	*替换贴图名
	*@param tarName 要替换的贴图名
	*@param newName 替换后的贴图名
	*/
	__proto.replaceDisplayByName=function(tarName,newName){
		if (!this.currSlotData)return;
		var preIndex=0;
		preIndex=this.currSlotData.getDisplayByName(tarName);
		var newIndex=0;
		newIndex=this.currSlotData.getDisplayByName(newName);
		this.replaceDisplayByIndex(preIndex,newIndex);
	}

	/**
	*替换贴图索引
	*@param tarIndex 要替换的索引
	*@param newIndex 替换后的索引
	*/
	__proto.replaceDisplayByIndex=function(tarIndex,newIndex){
		if (!this.currSlotData)return;
		this._replaceDic[tarIndex]=newIndex;
		if (this.originalIndex==tarIndex){
			this.showDisplayByIndex(tarIndex);
		}
	}

	/**
	*指定显示对象
	*@param index
	*/
	__proto.showDisplayByIndex=function(index){
		this.originalIndex=index;
		if (this._replaceDic[index]!=null)index=this._replaceDic[index];
		if (this.currSlotData && index >-1 && index < this.currSlotData.displayArr.length){
			this.displayIndex=index;
			this.currDisplayData=this.currSlotData.displayArr[index];
			if (this.currDisplayData){
				var tName=this.currDisplayData.name;
				this.currTexture=this.templet.getTexture(tName);
				if (this.currTexture && this.currDisplayData.type==0 && this.currDisplayData.uvs && (!Render.isConchApp || (Render.isConchApp && Sprite.RUNTIMEVERION > "0.9.15"))){
					this.currTexture=this.currDisplayData.createTexture(this.currTexture);
				}
			}
			}else {
			this.displayIndex=-1;
			this.currDisplayData=null;
			this.currTexture=null;
		}
	}

	/**
	*替换皮肤
	*@param _texture
	*/
	__proto.replaceSkin=function(_texture){
		this._diyTexture=_texture;
		if (this._curDiyUV)this._curDiyUV.length=0;
		if (this.currDisplayData&&this._diyTexture==this.currDisplayData.texture){
			this._diyTexture=null;
		}
	}

	/**
	*保存父矩阵的索引
	*@param parentMatrix
	*/
	__proto.setParentMatrix=function(parentMatrix){
		this._parentMatrix=parentMatrix;
	}

	/**
	*把纹理画到Graphics上
	*@param graphics
	*@param noUseSave
	*/
	__proto.draw=function(graphics,boneMatrixArray,noUseSave,alpha){
		(noUseSave===void 0)&& (noUseSave=false);
		(alpha===void 0)&& (alpha=1);
		if ((this._diyTexture==null && this.currTexture==null)|| this.currDisplayData==null){
			if (!(this.currDisplayData && this.currDisplayData.type==3)){
				return;
			}
		};
		var tTexture=this.currTexture;
		if (this._diyTexture)tTexture=this._diyTexture;
		var tSkinSprite;
		switch (this.currDisplayData.type){
			case 0:
				if (graphics){
					var tCurrentMatrix=this.getDisplayMatrix();
					if (this._parentMatrix){
						var tRotateKey=false;
						if (tCurrentMatrix){
							Matrix.mul(tCurrentMatrix,this._parentMatrix,Matrix.TEMP);
							var tResultMatrix;
							if (noUseSave){
								if (this._resultMatrix==null)this._resultMatrix=new Matrix();
								tResultMatrix=this._resultMatrix;
								}else {
								tResultMatrix=new Matrix();
							}
							if ((!Render.isWebGL && this.currDisplayData.uvs)|| (Render.isWebGL && this._diyTexture && this.currDisplayData.uvs)){
								var tTestMatrix=BoneSlot._tempMatrix;
								tTestMatrix.identity();
								if (this.currDisplayData.uvs[1] > this.currDisplayData.uvs[5]){
									tTestMatrix.d=-1;
								}
								if (this.currDisplayData.uvs[0] > this.currDisplayData.uvs[4]
									&& this.currDisplayData.uvs[1] > this.currDisplayData.uvs[5]){
									tRotateKey=true;
									tTestMatrix.rotate(-Math.PI/2);
								}
								Matrix.mul(tTestMatrix,Matrix.TEMP,tResultMatrix);
								}else {
								Matrix.TEMP.copyTo(tResultMatrix);
							}
							if (tRotateKey){
								graphics.drawTexture(tTexture,-this.currDisplayData.height / 2,-this.currDisplayData.width / 2,this.currDisplayData.height,this.currDisplayData.width,tResultMatrix);
								}else {
								graphics.drawTexture(tTexture,-this.currDisplayData.width / 2,-this.currDisplayData.height / 2,this.currDisplayData.width,this.currDisplayData.height,tResultMatrix);
							}
						}
					}
				}
				break ;
			case 1:
				if (noUseSave){
					if (this._skinSprite==null){
						this._skinSprite=BoneSlot.createSkinMesh();
					}
					tSkinSprite=this._skinSprite;
					}else {
					tSkinSprite=BoneSlot.createSkinMesh();
				}
				if (tSkinSprite==null){
					return;
				};
				var tIBArray;
				var tRed=1;
				var tGreed=1;
				var tBlue=1;
				var tAlpha=1;
				if (this.currDisplayData.bones==null){
					var tVertices=this.currDisplayData.weights;
					if (this.deformData){
						tVertices=this.deformData;
					};
					var tUVs;
					if (this._diyTexture){
						if (!this._curDiyUV){
							this._curDiyUV=[];
						}
						if (this._curDiyUV.length==0){
							this._curDiyUV=UVTools.getRelativeUV(this.currTexture.uv,this.currDisplayData.uvs,this._curDiyUV);
							this._curDiyUV=UVTools.getAbsoluteUV(this._diyTexture.uv,this._curDiyUV,this._curDiyUV);
						}
						tUVs=this._curDiyUV;
						}else{
						tUVs=this.currDisplayData.uvs;
					}
					this._mVerticleArr=tVertices;
					var tTriangleNum=this.currDisplayData.triangles.length / 3;
					tIBArray=this.currDisplayData.triangles;
					tSkinSprite.init2(tTexture,null ,tIBArray,this._mVerticleArr,tUVs);
					var tCurrentMatrix2=this.getDisplayMatrix();
					if (this._parentMatrix){
						if (tCurrentMatrix2){
							Matrix.mul(tCurrentMatrix2,this._parentMatrix,Matrix.TEMP);
							var tResultMatrix2;
							if (noUseSave){
								if (this._resultMatrix==null)this._resultMatrix=new Matrix();
								tResultMatrix2=this._resultMatrix;
								}else {
								tResultMatrix2=new Matrix();
							}
							Matrix.TEMP.copyTo(tResultMatrix2);
							tSkinSprite.transform=tResultMatrix2;
						}
					}
					}else {
					this.skinMesh(boneMatrixArray,tSkinSprite,alpha);
				}
				graphics.drawSkin(tSkinSprite);
				break ;
			case 2:
				if (noUseSave){
					if (this._skinSprite==null){
						this._skinSprite=BoneSlot.createSkinMesh();
					}
					tSkinSprite=this._skinSprite;
					}else {
					tSkinSprite=BoneSlot.createSkinMesh();
				}
				if (tSkinSprite==null){
					return;
				}
				this.skinMesh(boneMatrixArray,tSkinSprite,alpha);
				graphics.drawSkin(tSkinSprite);
				break ;
			case 3:
				break ;
			}
	}

	/**
	*显示蒙皮动画
	*@param boneMatrixArray 当前帧的骨骼矩阵
	*/
	__proto.skinMesh=function(boneMatrixArray,skinSprite,alpha){
		var tTexture=this.currTexture;
		var tBones=this.currDisplayData.bones;
		var tUvs;
		if (this._diyTexture){
			tTexture=this._diyTexture;
			if (!this._curDiyUV){
				this._curDiyUV=[];
			}
			if (this._curDiyUV.length==0){
				this._curDiyUV=UVTools.getRelativeUV(this.currTexture.uv,this.currDisplayData.uvs,this._curDiyUV);
				this._curDiyUV=UVTools.getAbsoluteUV(this._diyTexture.uv,this._curDiyUV,this._curDiyUV);
			}
			tUvs=this._curDiyUV;
			}else{
			tUvs=this.currDisplayData.uvs;
		};
		var tWeights=this.currDisplayData.weights;
		var tTriangles=this.currDisplayData.triangles;
		var tIBArray;
		var tRx=0;
		var tRy=0;
		var nn=0;
		var tMatrix;
		var tX=NaN;
		var tY=NaN;
		var tB=0;
		var tWeight=0;
		var tVertices=[];
		var i=0,j=0,n=0;
		var tRed=1;
		var tGreed=1;
		var tBlue=1;
		var tAlpha=alpha;
		if (this.deformData && this.deformData.length > 0){
			var f=0;
			for (i=0,n=tBones.length;i < n;){
				nn=tBones[i++]+i;
				tRx=0,tRy=0;
				for (;i < nn;i++){
					tMatrix=boneMatrixArray[tBones[i]]
					tX=tWeights[tB]+this.deformData[f++];
					tY=tWeights[tB+1]+this.deformData[f++];
					tWeight=tWeights[tB+2];
					tRx+=(tX *tMatrix.a+tY *tMatrix.c+tMatrix.tx)*tWeight;
					tRy+=(tX *tMatrix.b+tY *tMatrix.d+tMatrix.ty)*tWeight;
					tB+=3;
				}
				tVertices.push(tRx,tRy);
			}
			}else {
			for (i=0,n=tBones.length;i < n;){
				nn=tBones[i++]+i;
				tRx=0,tRy=0;
				for (;i < nn;i++){
					tMatrix=boneMatrixArray[tBones[i]]
					tX=tWeights[tB];
					tY=tWeights[tB+1];
					tWeight=tWeights[tB+2];
					tRx+=(tX *tMatrix.a+tY *tMatrix.c+tMatrix.tx)*tWeight;
					tRy+=(tX *tMatrix.b+tY *tMatrix.d+tMatrix.ty)*tWeight;
					tB+=3;
				}
				tVertices.push(tRx,tRy);
			}
		}
		this._mVerticleArr=tVertices;
		tIBArray=tTriangles;
		skinSprite.init2(tTexture,null,tIBArray,this._mVerticleArr,tUvs);
	}

	/**
	*画骨骼的起始点，方便调试
	*@param graphics
	*/
	__proto.drawBonePoint=function(graphics){
		if (graphics && this._parentMatrix){
			graphics.drawCircle(this._parentMatrix.tx,this._parentMatrix.ty,5,"#ff0000");
		}
	}

	/**
	*得到显示对象的矩阵
	*@return
	*/
	__proto.getDisplayMatrix=function(){
		if (this.currDisplayData){
			return this.currDisplayData.transform.getMatrix();
		}
		return null;
	}

	/**
	*得到插糟的矩阵
	*@return
	*/
	__proto.getMatrix=function(){
		return this._resultMatrix;
	}

	/**
	*用原始数据拷贝出一个
	*@return
	*/
	__proto.copy=function(){
		var tBoneSlot=new BoneSlot();
		tBoneSlot.type="copy";
		tBoneSlot.name=this.name;
		tBoneSlot.attachmentName=this.attachmentName;
		tBoneSlot.srcDisplayIndex=this.srcDisplayIndex;
		tBoneSlot.parent=this.parent;
		tBoneSlot.displayIndex=this.displayIndex;
		tBoneSlot.templet=this.templet;
		tBoneSlot.currSlotData=this.currSlotData;
		tBoneSlot.currTexture=this.currTexture;
		tBoneSlot.currDisplayData=this.currDisplayData;
		return tBoneSlot;
	}

	BoneSlot.createSkinMesh=function(){
		if (Render.isWebGL || Render.isConchApp){
			return RunDriver.skinAniSprite();
			}else{
			if (!Render.isWebGL){
				if (Skeleton.useSimpleMeshInCanvas){
					return new SimpleSkinMeshCanvas();
					}else{
					return new SkinMeshCanvas();
				}
			}
		}
		return null;
	}

	__static(BoneSlot,
	['_tempMatrix',function(){return this._tempMatrix=new Matrix();}
	]);
	return BoneSlot;
})()


/**
*@private
*canvas mesh渲染器
*/
//class laya.ani.bone.canvasmesh.CanvasMeshRender
var CanvasMeshRender=(function(){
	function CanvasMeshRender(){
		/**
		*mesh数据
		*/
		this.mesh=null;
		/**
		*矩阵
		*/
		this.transform=null;
		/**
		*绘图环境
		*/
		this.context=null;
		/**
		*绘制mesh的模式 0:顶点索引模式 1：无顶点索引模式
		*/
		this.mode=0;
	}

	__class(CanvasMeshRender,'laya.ani.bone.canvasmesh.CanvasMeshRender');
	var __proto=CanvasMeshRender.prototype;
	/**
	*将mesh数据渲染到context上面
	*@param context
	*
	*/
	__proto.renderToContext=function(context){
		this.context=context.ctx||context;
		if (this.mesh){
			if (this.mode==0){
				this._renderWithIndexes(this.mesh);
				}else{
				this._renderNoIndexes(this.mesh);
			}
		}
	}

	/**
	*无顶点索引的模式
	*@param mesh
	*
	*/
	__proto._renderNoIndexes=function(mesh){
		var i=0,len=mesh.vertices.length / 2;
		var index=0;
		for (i=0;i < len-2;i++){
			index=i *2;
			this._renderDrawTriangle(mesh,index,(index+2),(index+4));
		}
	}

	/**
	*使用顶点索引模式绘制
	*@param mesh
	*
	*/
	__proto._renderWithIndexes=function(mesh){
		var indexes=mesh.indexes;
		var i=0,len=indexes.length;
		for (i=0;i < len;i+=3){
			var index0=indexes[i] *2;
			var index1=indexes[i+1] *2;
			var index2=indexes[i+2] *2;
			this._renderDrawTriangle(mesh,index0,index1,index2);
		}
	}

	/**
	*绘制三角形
	*@param mesh mesh
	*@param index0 顶点0
	*@param index1 顶点1
	*@param index2 顶点2
	*
	*/
	__proto._renderDrawTriangle=function(mesh,index0,index1,index2){
		var context=this.context;
		var uvs=mesh.uvs;
		var vertices=mesh.vertices;
		var texture=mesh.texture;
		var source=texture.bitmap;
		var textureSource=source.source;
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var sourceWidth=source.width;
		var sourceHeight=source.height;
		var u0=NaN;
		var u1=NaN;
		var u2=NaN;
		var v0=NaN;
		var v1=NaN;
		var v2=NaN;
		if (mesh.useUvTransform){
			var ut=mesh.uvTransform;
			u0=((uvs[index0] *ut.a)+(uvs[index0+1] *ut.c)+ut.tx)*sourceWidth;
			u1=((uvs[index1] *ut.a)+(uvs[index1+1] *ut.c)+ut.tx)*sourceWidth;
			u2=((uvs[index2] *ut.a)+(uvs[index2+1] *ut.c)+ut.tx)*sourceWidth;
			v0=((uvs[index0] *ut.b)+(uvs[index0+1] *ut.d)+ut.ty)*sourceHeight;
			v1=((uvs[index1] *ut.b)+(uvs[index1+1] *ut.d)+ut.ty)*sourceHeight;
			v2=((uvs[index2] *ut.b)+(uvs[index2+1] *ut.d)+ut.ty)*sourceHeight;
		}
		else {
			u0=uvs[index0] *sourceWidth;
			u1=uvs[index1] *sourceWidth;
			u2=uvs[index2] *sourceWidth;
			v0=uvs[index0+1] *sourceHeight;
			v1=uvs[index1+1] *sourceHeight;
			v2=uvs[index2+1] *sourceHeight;
		};
		var x0=vertices[index0];
		var x1=vertices[index1];
		var x2=vertices[index2];
		var y0=vertices[index0+1];
		var y1=vertices[index1+1];
		var y2=vertices[index2+1];
		if (mesh.canvasPadding > 0){
			var paddingX=mesh.canvasPadding;
			var paddingY=mesh.canvasPadding;
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
		context.save();
		if (this.transform){
			var mt=this.transform;
			context.transform(mt.a,mt.b,mt.c,mt.d,mt.tx,mt.ty);
		}
		context.beginPath();
		context.moveTo(x0,y0);
		context.lineTo(x1,y1);
		context.lineTo(x2,y2);
		context.closePath();
		context.clip();
		var delta=(u0 *v1)+(v0 *u2)+(u1 *v2)-(v1 *u2)-(v0 *u1)-(u0 *v2);
		var dDelta=1 / delta;
		var deltaA=(x0 *v1)+(v0 *x2)+(x1 *v2)-(v1 *x2)-(v0 *x1)-(x0 *v2);
		var deltaB=(u0 *x1)+(x0 *u2)+(u1 *x2)-(x1 *u2)-(x0 *u1)-(u0 *x2);
		var deltaC=(u0 *v1 *x2)+(v0 *x1 *u2)+(x0 *u1 *v2)-(x0 *v1 *u2)-(v0 *u1 *x2)-(u0 *x1 *v2);
		var deltaD=(y0 *v1)+(v0 *y2)+(y1 *v2)-(v1 *y2)-(v0 *y1)-(y0 *v2);
		var deltaE=(u0 *y1)+(y0 *u2)+(u1 *y2)-(y1 *u2)-(y0 *u1)-(u0 *y2);
		var deltaF=(u0 *v1 *y2)+(v0 *y1 *u2)+(y0 *u1 *v2)-(y0 *v1 *u2)-(v0 *u1 *y2)-(u0 *y1 *v2);
		context.transform(deltaA *dDelta,deltaD *dDelta,deltaB *dDelta,deltaE*dDelta,deltaC *dDelta,deltaF *dDelta);
		context.drawImage(textureSource,texture.uv[0]*sourceWidth,texture.uv[1]*sourceHeight,textureWidth,textureHeight,texture.uv[0]*sourceWidth,texture.uv[1]*sourceHeight,textureWidth,textureHeight);
		context.restore();
	}

	return CanvasMeshRender;
})()


/**
*@private
*/
//class laya.ani.bone.canvasmesh.MeshData
var MeshData=(function(){
	function MeshData(){
		/**
		*纹理
		*/
		this.texture=null;
		/**
		*uv数据
		*/
		this.uvs=[0,0,1,0,1,1,0,1];
		/**
		*顶点数据
		*/
		this.vertices=[0,0,100,0,100,100,0,100];
		/**
		*顶点索引
		*/
		this.indexes=[0,1,3,3,1,2];
		/**
		*uv变换矩阵
		*/
		this.uvTransform=null;
		/**
		*是否有uv变化矩阵
		*/
		this.useUvTransform=false;
		/**
		*扩展像素,用来去除黑边
		*/
		this.canvasPadding=1;
	}

	__class(MeshData,'laya.ani.bone.canvasmesh.MeshData');
	var __proto=MeshData.prototype;
	/**
	*计算mesh的Bounds
	*@return
	*
	*/
	__proto.getBounds=function(){
		return Rectangle._getWrapRec(this.vertices);
	}

	return MeshData;
})()


/**
*@private
*/
//class laya.ani.bone.DeformAniData
var DeformAniData=(function(){
	function DeformAniData(){
		this.skinName=null;
		this.deformSlotDataList=[];
	}

	__class(DeformAniData,'laya.ani.bone.DeformAniData');
	return DeformAniData;
})()


/**
*@private
*/
//class laya.ani.bone.DeformSlotData
var DeformSlotData=(function(){
	function DeformSlotData(){
		this.deformSlotDisplayList=[];
	}

	__class(DeformSlotData,'laya.ani.bone.DeformSlotData');
	return DeformSlotData;
})()


/**
*@private
*/
//class laya.ani.bone.DeformSlotDisplayData
var DeformSlotDisplayData=(function(){
	function DeformSlotDisplayData(){
		this.boneSlot=null;
		this.slotIndex=-1;
		this.attachment=null;
		this.deformData=null;
		this.frameIndex=0;
		this.timeList=[];
		this.vectices=[];
		this.tweenKeyList=[];
	}

	__class(DeformSlotDisplayData,'laya.ani.bone.DeformSlotDisplayData');
	var __proto=DeformSlotDisplayData.prototype;
	__proto.binarySearch1=function(values,target){
		var low=0;
		var high=values.length-2;
		if (high==0)
			return 1;
		var current=high >>> 1;
		while (true){
			if (values[Math.floor(current+1)] <=target)
				low=current+1;
			else
			high=current;
			if (low==high)
				return low+1;
			current=(low+high)>>> 1;
		}
		return 0;
	}

	// Can't happen.
	__proto.apply=function(time,boneSlot,alpha){
		(alpha===void 0)&& (alpha=1);
		time+=0.05;
		if (this.timeList.length <=0){
			return;
		};
		var i=0;
		var n=0;
		var tTime=this.timeList[0];
		if (time < tTime){
			return;
		};
		var tVertexCount=this.vectices[0].length;
		var tVertices=[];
		var tFrameIndex=this.binarySearch1(this.timeList,time);
		this.frameIndex=tFrameIndex;
		if (time >=this.timeList[this.timeList.length-1]){
			var lastVertices=this.vectices[this.vectices.length-1];
			if (alpha < 1){
				for (i=0;i < tVertexCount;i++){
					tVertices[i]+=(lastVertices[i]-tVertices[i])*alpha;
				}
				}else {
				for (i=0;i < tVertexCount;i++){
					tVertices[i]=lastVertices[i];
				}
			}
			this.deformData=tVertices;
			return;
		};
		var tTweenKey=this.tweenKeyList[this.frameIndex];
		var tPrevVertices=this.vectices[this.frameIndex-1];
		var tNextVertices=this.vectices[this.frameIndex];
		var tPreFrameTime=this.timeList[this.frameIndex-1];
		var tFrameTime=this.timeList[this.frameIndex];
		if (this.tweenKeyList[tFrameIndex-1]){
			alpha=(time-tPreFrameTime)/ (tFrameTime-tPreFrameTime);
			}else {
			alpha=0;
		};
		var tPrev=NaN;
		for (i=0;i < tVertexCount;i++){
			tPrev=tPrevVertices[i];
			tVertices[i]=tPrev+(tNextVertices[i]-tPrev)*alpha;
		}
		this.deformData=tVertices;
	}

	return DeformSlotDisplayData;
})()


/**
*@private
*/
//class laya.ani.bone.DrawOrderData
var DrawOrderData=(function(){
	function DrawOrderData(){
		this.time=NaN;
		this.drawOrder=[];
	}

	__class(DrawOrderData,'laya.ani.bone.DrawOrderData');
	return DrawOrderData;
})()


/**
*@private
*/
//class laya.ani.bone.EventData
var EventData=(function(){
	function EventData(){
		this.name=null;
		this.intValue=0;
		this.floatValue=NaN;
		this.stringValue=null;
		this.audioValue=null;
		this.time=NaN;
	}

	__class(EventData,'laya.ani.bone.EventData');
	return EventData;
})()


/**
*@private
*/
//class laya.ani.bone.IkConstraint
var IkConstraint=(function(){
	function IkConstraint(data,bones){
		this._targetBone=null;
		this._bones=null;
		this._data=null;
		this.name=null;
		this.mix=NaN;
		this.bendDirection=NaN;
		this.isSpine=true;
		//debug相关代码
		this._sp=null;
		this.isDebug=false;
		this._data=data;
		this._targetBone=bones[data.targetBoneIndex];
		this.isSpine=data.isSpine;
		if (this._bones==null)this._bones=[];
		this._bones.length=0;
		for (var i=0,n=data.boneIndexs.length;i < n;i++){
			this._bones.push(bones[data.boneIndexs[i]]);
		}
		this.name=data.name;
		this.mix=data.mix;
		this.bendDirection=data.bendDirection;
	}

	__class(IkConstraint,'laya.ani.bone.IkConstraint');
	var __proto=IkConstraint.prototype;
	__proto.apply=function(){
		switch (this._bones.length){
			case 1:
				this._applyIk1(this._bones[0],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.mix);
				break ;
			case 2:
				if (this.isSpine){
					this._applyIk2(this._bones[0],this._bones[1],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.bendDirection,this.mix);
					}else{
					this._applyIk3(this._bones[0],this._bones[1],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.bendDirection,this.mix);
				}
				break ;
			}
	}

	__proto._applyIk1=function(bone,targetX,targetY,alpha){
		var pp=bone.parentBone;
		var id=1 / (pp.resultMatrix.a *pp.resultMatrix.d-pp.resultMatrix.b *pp.resultMatrix.c);
		var x=targetX-pp.resultMatrix.tx;
		var y=targetY-pp.resultMatrix.ty;
		var tx=(x *pp.resultMatrix.d-y *pp.resultMatrix.c)*id-bone.transform.x;
		var ty=(y *pp.resultMatrix.a-x *pp.resultMatrix.b)*id-bone.transform.y;
		var rotationIK=Math.atan2(ty,tx)*IkConstraint.radDeg-0-bone.transform.skX;
		if (bone.transform.scX < 0)rotationIK+=180;
		if (rotationIK > 180)
			rotationIK-=360;
		else if (rotationIK <-180)rotationIK+=360;
		bone.transform.skX=bone.transform.skY=bone.transform.skX+rotationIK *alpha;
		bone.update();
	}

	__proto.updatePos=function(x,y){
		if (this._sp){
			this._sp.pos(x,y);
		}
	}

	__proto._applyIk2=function(parent,child,targetX,targetY,bendDir,alpha){
		if (alpha==0){
			return;
		};
		var px=parent.resultTransform.x,py=parent.resultTransform.y;
		var psx=parent.transform.scX,psy=parent.transform.scY;
		var csx=child.transform.scX;
		var os1=0,os2=0,s2=0;
		if (psx < 0){
			psx=-psx;
			os1=180;
			s2=-1;
			}else {
			os1=0;
			s2=1;
		}
		if (psy < 0){
			psy=-psy;
			s2=-s2;
		}
		if (csx < 0){
			csx=-csx;
			os2=180;
			}else {
			os2=0
		};
		var cx=child.resultTransform.x,cy=NaN,cwx=NaN,cwy=NaN;
		var a=parent.resultMatrix.a,b=parent.resultMatrix.c;
		var c=parent.resultMatrix.b,d=parent.resultMatrix.d;
		var u=Math.abs(psx-psy)<=0.0001;
		if (!u){
			cy=0;
			cwx=a *cx+parent.resultMatrix.tx;
			cwy=c *cx+parent.resultMatrix.ty;
			}else {
			cy=child.resultTransform.y;
			cwx=a *cx+b *cy+parent.resultMatrix.tx;
			cwy=c *cx+d *cy+parent.resultMatrix.ty;
		}
		if (this.isDebug){
			if (!this._sp){
				this._sp=new Sprite();
				Laya.stage.addChild(this._sp);
			}
			this._sp.graphics.clear();
			this._sp.graphics.drawCircle(targetX,targetY,15,"#ffff00");
			this._sp.graphics.drawCircle(cwx,cwy,15,"#ff00ff");
		}
		parent.setRotation(Math.atan2(cwy-parent.resultMatrix.ty,cwx-parent.resultMatrix.tx));
		var pp=parent.parentBone;
		a=pp.resultMatrix.a;
		b=pp.resultMatrix.c;
		c=pp.resultMatrix.b;
		d=pp.resultMatrix.d;
		var id=1 / (a *d-b *c);
		var x=targetX-pp.resultMatrix.tx,y=targetY-pp.resultMatrix.ty;
		var tx=(x *d-y *b)*id-px;
		var ty=(y *a-x *c)*id-py;
		x=cwx-pp.resultMatrix.tx;
		y=cwy-pp.resultMatrix.ty;
		var dx=(x *d-y *b)*id-px;
		var dy=(y *a-x *c)*id-py;
		var l1=Math.sqrt(dx *dx+dy *dy);
		var l2=child.length *csx;
		var a1=NaN,a2=NaN;
		if (u){
			l2 *=psx;
			var cos=(tx *tx+ty *ty-l1 *l1-l2 *l2)/ (2 *l1 *l2);
			if (cos <-1)
				cos=-1;
			else if (cos > 1)cos=1;
			a2=Math.acos(cos)*bendDir;
			a=l1+l2 *cos;
			b=l2 *Math.sin(a2);
			a1=Math.atan2(ty *a-tx *b,tx *a+ty *b);
			}else {
			a=psx *l2;
			b=psy *l2;
			var aa=a *a,bb=b *b,dd=tx *tx+ty *ty,ta=Math.atan2(ty,tx);
			c=bb *l1 *l1+aa *dd-aa *bb;
			var c1=-2 *bb *l1,c2=bb-aa;
			d=c1 *c1-4 *c2 *c;
			if (d > 0){
				var q=Math.sqrt(d);
				if (c1 < 0)q=-q;
				q=-(c1+q)/ 2;
				var r0=q / c2,r1=c / q;
				var r=Math.abs(r0)< Math.abs(r1)? r0 :r1;
				if (r *r <=dd){
					y=Math.sqrt(dd-r *r)*bendDir;
					a1=ta-Math.atan2(y,r);
					a2=Math.atan2(y / psy,(r-l1)/ psx);
				}
			};
			var minAngle=0,minDist=Number.MAX_VALUE,minX=0,minY=0;
			var maxAngle=0,maxDist=0,maxX=0,maxY=0;
			x=l1+a;
			d=x *x;
			if (d > maxDist){
				maxAngle=0;
				maxDist=d;
				maxX=x;
			}
			x=l1-a;
			d=x *x;
			if (d < minDist){
				minAngle=Math.PI;
				minDist=d;
				minX=x;
			};
			var angle=Math.acos(-a *l1 / (aa-bb));
			x=a *Math.cos(angle)+l1;
			y=b *Math.sin(angle);
			d=x *x+y *y;
			if (d < minDist){
				minAngle=angle;
				minDist=d;
				minX=x;
				minY=y;
			}
			if (d > maxDist){
				maxAngle=angle;
				maxDist=d;
				maxX=x;
				maxY=y;
			}
			if (dd <=(minDist+maxDist)/ 2){
				a1=ta-Math.atan2(minY *bendDir,minX);
				a2=minAngle *bendDir;
				}else {
				a1=ta-Math.atan2(maxY *bendDir,maxX);
				a2=maxAngle *bendDir;
			}
		};
		var os=Math.atan2(cy,cx)*s2;
		var rotation=parent.resultTransform.skX;
		a1=(a1-os)*IkConstraint.radDeg+os1-rotation;
		if (a1 > 180)
			a1-=360;
		else if (a1 <-180)a1+=360;
		parent.resultTransform.x=px;
		parent.resultTransform.y=py;
		parent.resultTransform.skX=parent.resultTransform.skY=rotation+a1 *alpha;
		rotation=child.resultTransform.skX;
		rotation=rotation % 360;
		a2=((a2+os)*IkConstraint.radDeg-0)*s2+os2-rotation;
		if (a2 > 180)
			a2-=360;
		else if (a2 <-180)a2+=360;
		child.resultTransform.x=cx;
		child.resultTransform.y=cy;
		child.resultTransform.skX=child.resultTransform.skY=child.resultTransform.skY+a2 *alpha;
		parent.update();
	}

	__proto._applyIk3=function(parent,child,targetX,targetY,bendDir,alpha){
		if (alpha==0){
			return;
		};
		var cwx=NaN,cwy=NaN;
		var x=child.resultMatrix.a *child.length;
		var y=child.resultMatrix.b *child.length;
		var lLL=x *x+y *y;
		var lL=Math.sqrt(lLL);
		var parentX=parent.resultMatrix.tx;
		var parentY=parent.resultMatrix.ty;
		var childX=child.resultMatrix.tx;
		var childY=child.resultMatrix.ty;
		var dX=childX-parentX;
		var dY=childY-parentY;
		var lPP=dX *dX+dY *dY;
		var lP=Math.sqrt(lPP);
		dX=targetX-parent.resultMatrix.tx;
		dY=targetY-parent.resultMatrix.ty;
		var lTT=dX *dX+dY *dY;
		var lT=Math.sqrt(lTT);
		var ikRadianA=0;
		if (lL+lP <=lT || lT+lL <=lP || lT+lP <=lL){
			var rate=NaN;
			if (lL+lP <=lT){
				rate=1;
				}else{
				rate=-1;
			}
			childX=parentX+rate*(targetX-parentX)*lP / lT;
			childY=parentY+rate*(targetY-parentY)*lP / lT;
		}
		else{
			var h=(lPP-lLL+lTT)/ (2 *lTT);
			var r=Math.sqrt(lPP-h *h *lTT)/ lT;
			var hX=parentX+(dX *h);
			var hY=parentY+(dY *h);
			var rX=-dY *r;
			var rY=dX *r;
			if (bendDir>0){
				childX=hX-rX;
				childY=hY-rY;
			}
			else{
				childX=hX+rX;
				childY=hY+rY;
			}
		}
		cwx=childX;
		cwy=childY;
		if (this.isDebug){
			if (!this._sp){
				this._sp=new Sprite();
				Laya.stage.addChild(this._sp);
			}
			this._sp.graphics.clear();
			this._sp.graphics.drawCircle(parentX,parentY,15,"#ff00ff");
			this._sp.graphics.drawCircle(targetX,targetY,15,"#ffff00");
			this._sp.graphics.drawCircle(cwx,cwy,15,"#ff00ff");
		};
		var pRotation=NaN;
		pRotation=Math.atan2(cwy-parent.resultMatrix.ty,cwx-parent.resultMatrix.tx);
		parent.setRotation(pRotation);
		var pTarMatrix;
		pTarMatrix=IkConstraint._tempMatrix;
		pTarMatrix.identity();
		pTarMatrix.rotate(pRotation);
		pTarMatrix.scale(parent.resultMatrix.getScaleX(),parent.resultMatrix.getScaleY());
		pTarMatrix.translate(parent.resultMatrix.tx,parent.resultMatrix.ty);
		pTarMatrix.copyTo(parent.resultMatrix);
		parent.updateChild();
		var childRotation=NaN;
		childRotation=Math.atan2(targetY-cwy,targetX-cwx);
		child.setRotation(childRotation);
		var childTarMatrix;
		childTarMatrix=IkConstraint._tempMatrix;
		childTarMatrix.identity();
		childTarMatrix.rotate(childRotation);
		childTarMatrix.scale(child.resultMatrix.getScaleX(),child.resultMatrix.getScaleY());
		childTarMatrix.translate(cwx,cwy);
		pTarMatrix.copyTo(child.resultMatrix);
		child.updateChild();
	}

	__static(IkConstraint,
	['radDeg',function(){return this.radDeg=180 / Math.PI;},'degRad',function(){return this.degRad=Math.PI / 180;},'_tempMatrix',function(){return this._tempMatrix=new Matrix();}
	]);
	return IkConstraint;
})()


/**
*@private
*/
//class laya.ani.bone.IkConstraintData
var IkConstraintData=(function(){
	function IkConstraintData(){
		this.name=null;
		this.targetBoneName=null;
		this.bendDirection=1;
		this.mix=1;
		this.isSpine=true;
		this.targetBoneIndex=-1;
		this.boneNames=[];
		this.boneIndexs=[];
	}

	__class(IkConstraintData,'laya.ani.bone.IkConstraintData');
	return IkConstraintData;
})()


/**
*@private
*Mesh数据处理工具
*@version 1.0
*
*@created 2017-4-28 下午2:46:23
*/
//class laya.ani.bone.MeshTools
var MeshTools=(function(){
	function MeshTools(){}
	__class(MeshTools,'laya.ani.bone.MeshTools');
	MeshTools.findEdge=function(verticles,offI,min){
		(offI===void 0)&& (offI=0);
		(min===void 0)&& (min=true);
		var i=0,len=0;
		var tIndex=0;
		len=verticles.length;
		tIndex=-1;
		for (i=0;i < len;i+=2){
			if (tIndex < 0 || (min==(verticles[tIndex+offI] < verticles[i+offI]))){
				tIndex=i;
			}
		}
		return tIndex;
	}

	MeshTools.findBestTriangle=function(verticles){
		var topI=0;
		topI=MeshTools.findEdge(verticles,1,true);
		var bottomI=0;
		bottomI=MeshTools.findEdge(verticles,1,false);
		var leftI=0;
		leftI=MeshTools.findEdge(verticles,0,true);
		var rightI=0;
		rightI=MeshTools.findEdge(verticles,0,false);
		var rst;
		rst=MeshTools._bestTriangle;
		rst.length=0;
		rst.push(leftI,rightI);
		if (rst.indexOf(topI)< 0)rst.push(topI);
		if (rst.indexOf(bottomI)< 0)rst.push(bottomI);
		return rst;
	}

	MeshTools.solveMesh=function(mesh,rst){
		rst=rst||[];
		rst.length=0;
		var mUv;
		mUv=mesh.uvs;
		var mVer;
		mVer=mesh.vertices;
		var uvAbs;
		var indexs;
		indexs=MeshTools.findBestTriangle(mUv);
		var index0=0;
		var index1=0;
		var index2=0;
		index0=indexs[0];
		index1=indexs[1];
		index2=indexs[2];
		MeshTools._absArr.length=0;
		var newVerticles;
		if (MeshTools.isNormalUV(mesh.texture.uv)){
			MeshTools.adptTexture(mesh);
		}
		uvAbs=MeshTools.solvePoints(mesh.texture.uv,mUv[index0],mUv[index0+1],mUv[index1]-mUv[index0],mUv[index1+1]-mUv[index0+1],mUv[index2]-mUv[index0],mUv[index2+1]-mUv[index0+1],MeshTools._absArr);
		newVerticles=MeshTools.transPoints(uvAbs,mVer[index0],mVer[index0+1],mVer[index1]-mVer[index0],mVer[index1+1]-mVer[index0+1],mVer[index2]-mVer[index0],mVer[index2+1]-mVer[index0+1],rst);
		return newVerticles;
	}

	MeshTools.findWrapRect=function(verticles){
		var topI=0;
		topI=MeshTools.findEdge(verticles,1,true);
		var bottomI=0;
		bottomI=MeshTools.findEdge(verticles,1,false);
		var leftI=0;
		leftI=MeshTools.findEdge(verticles,0,true);
		var rightI=0;
		rightI=MeshTools.findEdge(verticles,0,false);
		var left=NaN;
		left=verticles[leftI];
		var right=NaN;
		right=verticles[rightI];
		var top=NaN;
		top=verticles[topI+1];
		var bottom=NaN;
		bottom=verticles[bottomI+1];
		var rst;
		return [right,bottom,left-right,top-bottom];
	}

	MeshTools.adptTexture=function(mesh){
		var rec;
		rec=MeshTools.findWrapRect(mesh.uvs);
		var oTex;
		var nTex;
		oTex=mesh.texture;
		var oWidth=oTex.width;
		var oHeight=oTex.height;
		nTex=Texture.create(oTex,rec[0] *oWidth,rec[1] *oHeight,rec[2] *oWidth,rec[3] *oHeight);
		mesh.texture=nTex;
	}

	MeshTools.isNormalUV=function(uv){
		return uv[0]==0 && uv[1]==0 && uv[4]==1 && uv[5]==1;
	}

	MeshTools.solvePoints=function(pointList,oX,oY,v1x,v1y,v2x,v2y,rst){
		rst=rst||[];
		var i=0,len=0;
		len=pointList.length;
		var tRst;
		for (i=0;i < len;i+=2){
			tRst=MeshTools.solve2(pointList[i],pointList[i+1],oX,oY,v1x,v1y,v2x,v2y);
			rst.push(tRst[0],tRst[1]);
		}
		return rst;
	}

	MeshTools.transPoints=function(abs,oX,oY,v1x,v1y,v2x,v2y,rst){
		rst=rst|| [];
		var i=0,len=0;
		len=abs.length;
		var tRst;
		for (i=0;i < len;i+=2){
			tRst=MeshTools.transPoint(abs[i],abs[i+1],oX,oY,v1x,v1y,v2x,v2y,rst);
		}
		return rst;
	}

	MeshTools.transPoint=function(a,b,oX,oY,v1x,v1y,v2x,v2y,rst){
		rst=rst|| [];
		var nX=NaN;
		var nY=NaN;
		nX=oX+v1x *a+v2x *b;
		nY=oY+v1y *a+v2y *b;
		rst.push(nX,nY)
		return rst;
	}

	MeshTools.solve2=function(rx,ry,oX,oY,v1x,v1y,v2x,v2y,rv,rst){
		(rv===void 0)&& (rv=false);
		rst=rst||[];
		var a=NaN,b=NaN;
		if (v1x==0){
			return MeshTools.solve2(rx,ry,oX,oY,v2x,v2y,v1x,v1y,true,rst);
		};
		var dX=NaN;
		var dY=NaN;
		dX=rx-oX;
		dY=ry-oY;
		b=(dY-dX *v1y / v1x)/ (v2y-v2x *v1y / v1x);
		a=(dX-b *v2x)/ v1x;
		if(rv){
			rst.push(b,a);
			}else{
			rst.push(a,b);
		}
		return rst;
	}

	MeshTools.solve=function(pointC,point0,v1,v2){
		return MeshTools.solve2(pointC.x,pointC.y,point0.x,point0.y,v1.x,v1.y,v2.x,v2.y);
	}

	MeshTools._bestTriangle=[];
	MeshTools._absArr=[];
	return MeshTools;
})()


/**
*@private
*路径作用器
*1，生成根据骨骼计算控制点
*2，根据控制点生成路径，并计算路径上的节点
*3，根据节点，重新调整骨骼位置
*/
//class laya.ani.bone.PathConstraint
var PathConstraint=(function(){
	function PathConstraint(data,bones){
		this.target=null;
		this.data=null;
		this.bones=null;
		this.position=NaN;
		this.spacing=NaN;
		this.rotateMix=NaN;
		this.translateMix=NaN;
		this._debugKey=false;
		this._spaces=null;
		this._segments=[];
		this._curves=[];
		this.data=data;
		this.position=data.position;
		this.spacing=data.spacing;
		this.rotateMix=data.rotateMix;
		this.translateMix=data.translateMix;
		this.bones=[];
		var tBoneIds=this.data.bones;
		for (var i=0,n=tBoneIds.length;i < n;i++){
			this.bones.push(bones[tBoneIds[i]]);
		}
	}

	__class(PathConstraint,'laya.ani.bone.PathConstraint');
	var __proto=PathConstraint.prototype;
	/**
	*计算骨骼在路径上的节点
	*@param boneSlot
	*@param boneMatrixArray
	*@param graphics
	*/
	__proto.apply=function(boneList,graphics){
		if (!this.target)
			return;
		var tTranslateMix=this.translateMix;
		var tRotateMix=this.translateMix;
		var tTranslate=tTranslateMix > 0;
		var tRotate=tRotateMix > 0;
		var tSpacingMode=this.data.spacingMode;
		var tLengthSpacing=tSpacingMode=="length";
		var tRotateMode=this.data.rotateMode;
		var tTangents=tRotateMode=="tangent";
		var tScale=tRotateMode=="chainScale";
		var lengths=[];
		var boneCount=this.bones.length;
		var spacesCount=tTangents ? boneCount :boneCount+1;
		var spaces=[];
		this._spaces=spaces;
		spaces[0]=this.position;
		var spacing=this.spacing;
		if (tScale || tLengthSpacing){
			for (var i=0,n=spacesCount-1;i < n;){
				var bone=this.bones[i];
				var length=bone.length;
				var x=length *bone.resultMatrix.a;
				var y=length *bone.resultMatrix.b;
				length=Math.sqrt(x *x+y *y);
				if (tScale)
					lengths[i]=length;
				spaces[++i]=tLengthSpacing ? Math.max(0,length+spacing):spacing;
			}
		}
		else {
			for (i=1;i < spacesCount;i++){
				spaces[i]=spacing;
			}
		};
		var positions=this.computeWorldPositions(this.target,boneList,graphics,spacesCount,tTangents,this.data.positionMode=="percent",tSpacingMode=="percent");
		if (this._debugKey){
			for (i=0;i < positions.length;i++){
				graphics.drawCircle(positions[i++],positions[i++],5,"#00ff00");
			};
			var tLinePos=[];
			for (i=0;i < positions.length;i++){
				tLinePos.push(positions[i++],positions[i++]);
			}
			graphics.drawLines(0,0,tLinePos,"#ff0000");
		};
		var skeletonX=NaN;
		var skeletonY=NaN;
		var boneX=positions[0];
		var boneY=positions[1];
		var offsetRotation=this.data.offsetRotation;
		var tip=tRotateMode=="chain" && offsetRotation==0;
		var p=NaN;
		for (i=0,p=3;i < boneCount;i++,p+=3){
			bone=this.bones[i];
			bone.resultMatrix.tx+=(boneX-bone.resultMatrix.tx)*tTranslateMix;
			bone.resultMatrix.ty+=(boneY-bone.resultMatrix.ty)*tTranslateMix;
			x=positions[p];
			y=positions[p+1];
			var dx=x-boneX,dy=y-boneY;
			if (tScale){
				length=lengths[i];
				if (length !=0){
					var s=(Math.sqrt(dx *dx+dy *dy)/ length-1)*tRotateMix+1;
					bone.resultMatrix.a *=s;
					bone.resultMatrix.c *=s;
				}
			}
			boneX=x;
			boneY=y;
			if (tRotate){
				var a=bone.resultMatrix.a;
				var b=bone.resultMatrix.c;
				var c=bone.resultMatrix.b;
				var d=bone.resultMatrix.d;
				var r=NaN;
				var cos=NaN;
				var sin=NaN;
				if (tTangents){
					r=positions[p-1];
				}
				else if (spaces[i+1]==0){
					r=positions[p+2];
				}
				else {
					r=Math.atan2(dy,dx);
				}
				r-=Math.atan2(c,a)-offsetRotation / 180 *Math.PI;
				if (tip){
					cos=Math.cos(r);
					sin=Math.sin(r);
					length=bone.length;
					boneX+=(length *(cos *a-sin *c)-dx)*tRotateMix;
					boneY+=(length *(sin *a+cos *c)-dy)*tRotateMix;
				}
				if (r > Math.PI){
					r-=(Math.PI *2);
				}
				else if (r <-Math.PI){
					r+=(Math.PI *2);
				}
				r *=tRotateMix;
				cos=Math.cos(r);
				sin=Math.sin(r);
				bone.resultMatrix.a=cos *a-sin *c;
				bone.resultMatrix.c=cos *b-sin *d;
				bone.resultMatrix.b=sin *a+cos *c;
				bone.resultMatrix.d=sin *b+cos *d;
			}
		}
	}

	/**
	*计算顶点的世界坐标
	*@param boneSlot
	*@param boneList
	*@param start
	*@param count
	*@param worldVertices
	*@param offset
	*/
	__proto.computeWorldVertices2=function(boneSlot,boneList,start,count,worldVertices,offset){
		var tBones=boneSlot.currDisplayData.bones;
		var tWeights=boneSlot.currDisplayData.weights;
		var tTriangles=boneSlot.currDisplayData.triangles;
		var tMatrix;
		var i=0;
		var v=0;
		var skip=0;
		var n=0;
		var w=0;
		var b=0;
		var wx=0;
		var wy=0;
		var vx=0;
		var vy=0;
		var bone;
		var len=0;
		if (tBones==null){
			if (!tTriangles)tTriangles=tWeights;
			if (boneSlot.deformData)
				tTriangles=boneSlot.deformData;
			var parentName;
			parentName=boneSlot.parent;
			if (boneList){
				len=boneList.length;
				for (i=0;i < len;i++){
					if (boneList[i].name==parentName){
						bone=boneList[i];
						break ;
					}
				}
			};
			var tBoneMt;
			if (bone){
				tBoneMt=bone.resultMatrix;
			}
			if (!tBoneMt)tBoneMt=PathConstraint._tempMt;
			var x=tBoneMt.tx;
			var y=tBoneMt.ty;
			var a=tBoneMt.a,bb=tBoneMt.b,c=tBoneMt.c,d=tBoneMt.d;
			if(bone)d*=bone.d;
			for (v=start,w=offset;w < count;v+=2,w+=2){
				vx=tTriangles[v],vy=tTriangles[v+1];
				worldVertices[w]=vx *a+vy *bb+x;
				worldVertices[w+1]=-(vx *c+vy *d+y);
			}
			return;
		}
		for (i=0;i < start;i+=2){
			n=tBones[v];
			v+=n+1;
			skip+=n;
		};
		var skeletonBones=boneList;
		for (w=offset,b=skip *3;w < count;w+=2){
			wx=0,wy=0;
			n=tBones[v++];
			n+=v;
			for (;v < n;v++,b+=3){
				tMatrix=skeletonBones[tBones[v]].resultMatrix;
				vx=tWeights[b];
				vy=tWeights[b+1];
				var weight=tWeights[b+2];
				wx+=(vx *tMatrix.a+vy *tMatrix.c+tMatrix.tx)*weight;
				wy+=(vx *tMatrix.b+vy *tMatrix.d+tMatrix.ty)*weight;
			}
			worldVertices[w]=wx;
			worldVertices[w+1]=wy;
		}
	}

	/**
	*计算路径上的节点
	*@param boneSlot
	*@param boneList
	*@param graphics
	*@param spacesCount
	*@param tangents
	*@param percentPosition
	*@param percentSpacing
	*@return
	*/
	__proto.computeWorldPositions=function(boneSlot,boneList,graphics,spacesCount,tangents,percentPosition,percentSpacing){
		var tBones=boneSlot.currDisplayData.bones;
		var tWeights=boneSlot.currDisplayData.weights;
		var tTriangles=boneSlot.currDisplayData.triangles;
		var tRx=0;
		var tRy=0;
		var nn=0;
		var tMatrix;
		var tX=NaN;
		var tY=NaN;
		var tB=0;
		var tWeight=0;
		var tVertices=[];
		var i=0,j=0,n=0;
		var verticesLength=boneSlot.currDisplayData.verLen;
		var target=boneSlot;
		var position=this.position;
		var spaces=this._spaces;
		var world=[];
		var out=[];
		var closed=false;
		var curveCount=verticesLength / 6;
		var prevCurve=-1;
		var pathLength=NaN;
		var o=0,curve=0;
		var p=NaN;
		var space=NaN;
		var prev=NaN;
		var length=NaN;
		if (!true){
			var lengths=boneSlot.currDisplayData.lengths;
			curveCount-=closed ? 1 :2;
			pathLength=lengths[curveCount];
			if (percentPosition)
				position *=pathLength;
			if (percentSpacing){
				for (i=0;i < spacesCount;i++)
				spaces[i] *=pathLength;
			}
			world.length=8;
			for (i=0,o=0,curve=0;i < spacesCount;i++,o+=3){
				space=spaces[i];
				position+=space;
				p=position;
				if (closed){
					p %=pathLength;
					if (p < 0)
						p+=pathLength;
					curve=0;
				}
				else if (p < 0){
					if (prevCurve !=PathConstraint.BEFORE){
						prevCurve=PathConstraint.BEFORE;
						this.computeWorldVertices2(target,boneList,2,4,world,0);
					}
					this.addBeforePosition(p,world,0,out,o);
					continue ;
				}
				else if (p > pathLength){
					if (prevCurve !=PathConstraint.AFTER){
						prevCurve=PathConstraint.AFTER;
						this.computeWorldVertices2(target,boneList,verticesLength-6,4,world,0);
					}
					this.addAfterPosition(p-pathLength,world,0,out,o);
					continue ;
				}
				for (;;curve++){
					length=lengths[curve];
					if (p > length)
						continue ;
					if (curve==0)
						p /=length;
					else {
						prev=lengths[curve-1];
						p=(p-prev)/ (length-prev);
					}
					break ;
				}
				if (curve !=prevCurve){
					prevCurve=curve;
					if (closed && curve==curveCount){
						this.computeWorldVertices2(target,boneList,verticesLength-4,4,world,0);
						this.computeWorldVertices2(target,boneList,0,4,world,4);
					}
					else
					this.computeWorldVertices2(target,boneList,curve *6+2,8,world,0);
				}
				this.addCurvePosition(p,world[0],world[1],world[2],world[3],world[4],world[5],world[6],world[7],out,o,tangents || (i > 0 && space==0));
			}
			return out;
		}
		if (closed){
			verticesLength+=2;
			world[verticesLength-2]=world[0];
			world[verticesLength-1]=world[1];
		}
		else {
			curveCount--;
			verticesLength-=4;
			this.computeWorldVertices2(boneSlot,boneList,2,verticesLength,tVertices,0);
			if (this._debugKey){
				for (i=0;i < tVertices.length;){
					graphics.drawCircle(tVertices[i++],tVertices[i++],10,"#ff0000");
				}
			}
			world=tVertices;
		}
		this._curves.length=curveCount;
		var curves=this._curves;
		pathLength=0;
		var x1=world[0],y1=world[1],cx1=0,cy1=0,cx2=0,cy2=0,x2=0,y2=0;
		var tmpx=NaN,tmpy=NaN,dddfx=NaN,dddfy=NaN,ddfx=NaN,ddfy=NaN,dfx=NaN,dfy=NaN;
		var w=0;
		for (i=0,w=2;i < curveCount;i++,w+=6){
			cx1=world[w];
			cy1=world[w+1];
			cx2=world[w+2];
			cy2=world[w+3];
			x2=world[w+4];
			y2=world[w+5];
			tmpx=(x1-cx1 *2+cx2)*0.1875;
			tmpy=(y1-cy1 *2+cy2)*0.1875;
			dddfx=((cx1-cx2)*3-x1+x2)*0.09375;
			dddfy=((cy1-cy2)*3-y1+y2)*0.09375;
			ddfx=tmpx *2+dddfx;
			ddfy=tmpy *2+dddfy;
			dfx=(cx1-x1)*0.75+tmpx+dddfx *0.16666667;
			dfy=(cy1-y1)*0.75+tmpy+dddfy *0.16666667;
			pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
			dfx+=ddfx;
			dfy+=ddfy;
			ddfx+=dddfx;
			ddfy+=dddfy;
			pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
			dfx+=ddfx;
			dfy+=ddfy;
			pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
			dfx+=ddfx+dddfx;
			dfy+=ddfy+dddfy;
			pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
			curves[i]=pathLength;
			x1=x2;
			y1=y2;
		}
		if (percentPosition)
			position *=pathLength;
		if (percentSpacing){
			for (i=0;i < spacesCount;i++)
			spaces[i] *=pathLength;
		};
		var segments=this._segments;
		var curveLength=0;
		var segment=0;
		for (i=0,o=0,curve=0,segment=0;i < spacesCount;i++,o+=3){
			space=spaces[i];
			position+=space;
			p=position;
			if (closed){
				p %=pathLength;
				if (p < 0)
					p+=pathLength;
				curve=0;
			}
			else if (p < 0){
				this.addBeforePosition(p,world,0,out,o);
				continue ;
			}
			else if (p > pathLength){
				this.addAfterPosition(p-pathLength,world,verticesLength-4,out,o);
				continue ;
			}
			for (;;curve++){
				length=curves[curve];
				if (p > length)
					continue ;
				if (curve==0)
					p /=length;
				else {
					prev=curves[curve-1];
					p=(p-prev)/ (length-prev);
				}
				break ;
			}
			if (curve !=prevCurve){
				prevCurve=curve;
				var ii=curve *6;
				x1=world[ii];
				y1=world[ii+1];
				cx1=world[ii+2];
				cy1=world[ii+3];
				cx2=world[ii+4];
				cy2=world[ii+5];
				x2=world[ii+6];
				y2=world[ii+7];
				tmpx=(x1-cx1 *2+cx2)*0.03;
				tmpy=(y1-cy1 *2+cy2)*0.03;
				dddfx=((cx1-cx2)*3-x1+x2)*0.006;
				dddfy=((cy1-cy2)*3-y1+y2)*0.006;
				ddfx=tmpx *2+dddfx;
				ddfy=tmpy *2+dddfy;
				dfx=(cx1-x1)*0.3+tmpx+dddfx *0.16666667;
				dfy=(cy1-y1)*0.3+tmpy+dddfy *0.16666667;
				curveLength=Math.sqrt(dfx *dfx+dfy *dfy);
				segments[0]=curveLength;
				for (ii=1;ii < 8;ii++){
					dfx+=ddfx;
					dfy+=ddfy;
					ddfx+=dddfx;
					ddfy+=dddfy;
					curveLength+=Math.sqrt(dfx *dfx+dfy *dfy);
					segments[ii]=curveLength;
				}
				dfx+=ddfx;
				dfy+=ddfy;
				curveLength+=Math.sqrt(dfx *dfx+dfy *dfy);
				segments[8]=curveLength;
				dfx+=ddfx+dddfx;
				dfy+=ddfy+dddfy;
				curveLength+=Math.sqrt(dfx *dfx+dfy *dfy);
				segments[9]=curveLength;
				segment=0;
			}
			p *=curveLength;
			for (;;segment++){
				length=segments[segment];
				if (p > length)
					continue ;
				if (segment==0)
					p /=length;
				else {
					prev=segments[segment-1];
					p=segment+(p-prev)/ (length-prev);
				}
				break ;
			}
			this.addCurvePosition(p *0.1,x1,y1,cx1,cy1,cx2,cy2,x2,y2,out,o,tangents || (i > 0 && space==0));
		}
		return out;
	}

	__proto.addBeforePosition=function(p,temp,i,out,o){
		var x1=temp[i],y1=temp[i+1],dx=temp[i+2]-x1,dy=temp[i+3]-y1,r=Math.atan2(dy,dx);
		out[o]=x1+p *Math.cos(r);
		out[o+1]=y1+p *Math.sin(r);
		out[o+2]=r;
	}

	__proto.addAfterPosition=function(p,temp,i,out,o){
		var x1=temp[i+2],y1=temp[i+3],dx=x1-temp[i],dy=y1-temp[i+1],r=Math.atan2(dy,dx);
		out[o]=x1+p *Math.cos(r);
		out[o+1]=y1+p *Math.sin(r);
		out[o+2]=r;
	}

	__proto.addCurvePosition=function(p,x1,y1,cx1,cy1,cx2,cy2,x2,y2,out,o,tangents){
		if (p==0)
			p=0.0001;
		var tt=p *p,ttt=tt *p,u=1-p,uu=u *u,uuu=uu *u;
		var ut=u *p,ut3=ut *3,uut3=u *ut3,utt3=ut3 *p;
		var x=x1 *uuu+cx1 *uut3+cx2 *utt3+x2 *ttt,y=y1 *uuu+cy1 *uut3+cy2 *utt3+y2 *ttt;
		out[o]=x;
		out[o+1]=y;
		if (tangents){
			out[o+2]=Math.atan2(y-(y1 *uu+cy1 *ut *2+cy2 *tt),x-(x1 *uu+cx1 *ut *2+cx2 *tt));
		}
		else {
			out[o+2]=0;
		}
	}

	PathConstraint.NONE=-1;
	PathConstraint.BEFORE=-2;
	PathConstraint.AFTER=-3;
	__static(PathConstraint,
	['_tempMt',function(){return this._tempMt=new Matrix();}
	]);
	return PathConstraint;
})()


/**
*@private
*/
//class laya.ani.bone.PathConstraintData
var PathConstraintData=(function(){
	function PathConstraintData(){
		this.name=null;
		this.target=null;
		this.positionMode=null;
		this.spacingMode=null;
		this.rotateMode=null;
		this.offsetRotation=NaN;
		this.position=NaN;
		this.spacing=NaN;
		this.rotateMix=NaN;
		this.translateMix=NaN;
		this.bones=[];
	}

	__class(PathConstraintData,'laya.ani.bone.PathConstraintData');
	return PathConstraintData;
})()


/**
*@private
*/
//class laya.ani.bone.SkinData
var SkinData=(function(){
	function SkinData(){
		this.name=null;
		this.slotArr=[];
	}

	__class(SkinData,'laya.ani.bone.SkinData');
	return SkinData;
})()


/**
*@private
*/
//class laya.ani.bone.SkinSlotDisplayData
var SkinSlotDisplayData=(function(){
	function SkinSlotDisplayData(){
		this.name=null;
		this.attachmentName=null;
		this.type=0;
		this.transform=null;
		this.width=NaN;
		this.height=NaN;
		this.texture=null;
		this.bones=null;
		this.uvs=null;
		this.weights=null;
		this.triangles=null;
		this.vertices=null;
		this.lengths=null;
		this.verLen=0;
	}

	__class(SkinSlotDisplayData,'laya.ani.bone.SkinSlotDisplayData');
	var __proto=SkinSlotDisplayData.prototype;
	__proto.createTexture=function(currTexture){
		if (this.texture)return this.texture;
		this.texture=new Texture(currTexture.bitmap,this.uvs);
		if (this.uvs[0] > this.uvs[4]
			&& this.uvs[1] > this.uvs[5]){
			this.texture.width=currTexture.height;
			this.texture.height=currTexture.width;
			this.texture.offsetX=-currTexture.offsetX;
			this.texture.offsetY=-currTexture.offsetY;
			this.texture.sourceWidth=currTexture.sourceHeight;
			this.texture.sourceHeight=currTexture.sourceWidth;
			}else {
			this.texture.width=currTexture.width;
			this.texture.height=currTexture.height;
			this.texture.offsetX=-currTexture.offsetX;
			this.texture.offsetY=-currTexture.offsetY;
			this.texture.sourceWidth=currTexture.sourceWidth;
			this.texture.sourceHeight=currTexture.sourceHeight;
		}
		if (!Render.isWebGL){
			if (this.uvs[1] > this.uvs[5]){
				this.texture.offsetY=this.texture.sourceHeight-this.texture.height-this.texture.offsetY;
			}
		}
		return this.texture;
	}

	__proto.destory=function(){
		if (this.texture)this.texture.destroy();
	}

	return SkinSlotDisplayData;
})()


/**
*@private
*/
//class laya.ani.bone.SlotData
var SlotData=(function(){
	function SlotData(){
		this.name=null;
		this.displayArr=[];
	}

	__class(SlotData,'laya.ani.bone.SlotData');
	var __proto=SlotData.prototype;
	__proto.getDisplayByName=function(name){
		var tDisplay;
		for (var i=0,n=this.displayArr.length;i < n;i++){
			tDisplay=this.displayArr[i];
			if (tDisplay.attachmentName==name){
				return i;
			}
		}
		return-1;
	}

	return SlotData;
})()


/**
*@private
*/
//class laya.ani.bone.TfConstraint
var TfConstraint=(function(){
	function TfConstraint(data,bones){
		this._data=null;
		this._bones=null;
		this.target=null;
		this.rotateMix=NaN;
		this.translateMix=NaN;
		this.scaleMix=NaN;
		this.shearMix=NaN;
		this._temp=__newvec(2,0);
		this._data=data;
		if (this._bones==null){
			this._bones=[];
		}
		this.target=bones[data.targetIndex];
		var j=0,n=0;
		for (j=0,n=data.boneIndexs.length;j < n;j++){
			this._bones.push(bones[data.boneIndexs[j]]);
		}
		this.rotateMix=data.rotateMix;
		this.translateMix=data.translateMix;
		this.scaleMix=data.scaleMix;
		this.shearMix=data.shearMix;
	}

	__class(TfConstraint,'laya.ani.bone.TfConstraint');
	var __proto=TfConstraint.prototype;
	__proto.apply=function(){
		var tTfBone;
		var ta=this.target.resultMatrix.a,tb=this.target.resultMatrix.b,tc=this.target.resultMatrix.c,td=this.target.resultMatrix.d;
		for (var j=0,n=this._bones.length;j < n;j++){
			tTfBone=this._bones[j];
			if (this.rotateMix > 0){
				var a=tTfBone.resultMatrix.a,b=tTfBone.resultMatrix.b,c=tTfBone.resultMatrix.c,d=tTfBone.resultMatrix.d;
				var r=Math.atan2(tc,ta)-Math.atan2(c,a)+this._data.offsetRotation *Math.PI / 180;
				if (r > Math.PI)
					r-=Math.PI *2;
				else if (r <-Math.PI)r+=Math.PI *2;
				r *=this.rotateMix;
				var cos=Math.cos(r),sin=Math.sin(r);
				tTfBone.resultMatrix.a=cos *a-sin *c;
				tTfBone.resultMatrix.b=cos *b-sin *d;
				tTfBone.resultMatrix.c=sin *a+cos *c;
				tTfBone.resultMatrix.d=sin *b+cos *d;
			}
			if (this.translateMix){
				this._temp[0]=this._data.offsetX;
				this._temp[1]=this._data.offsetY;
				this.target.localToWorld(this._temp);
				tTfBone.resultMatrix.tx+=(this._temp[0]-tTfBone.resultMatrix.tx)*this.translateMix;
				tTfBone.resultMatrix.ty+=(this._temp[1]-tTfBone.resultMatrix.ty)*this.translateMix;
				tTfBone.updateChild();
			}
			if (this.scaleMix > 0){
				var bs=Math.sqrt(tTfBone.resultMatrix.a *tTfBone.resultMatrix.a+tTfBone.resultMatrix.c *tTfBone.resultMatrix.c);
				var ts=Math.sqrt(ta *ta+tc *tc);
				var s=bs > 0.00001 ? (bs+(ts-bs+this._data.offsetScaleX)*this.scaleMix)/ bs :0;
				tTfBone.resultMatrix.a *=s;
				tTfBone.resultMatrix.c *=s;
				bs=Math.sqrt(tTfBone.resultMatrix.b *tTfBone.resultMatrix.b+tTfBone.resultMatrix.d *tTfBone.resultMatrix.d);
				ts=Math.sqrt(tb *tb+td *td);
				s=bs > 0.00001 ? (bs+(ts-bs+this._data.offsetScaleY)*this.scaleMix)/ bs :0;
				tTfBone.resultMatrix.b *=s;
				tTfBone.resultMatrix.d *=s;
			}
			if (this.shearMix > 0){
				b=tTfBone.resultMatrix.b,d=tTfBone.resultMatrix.d;
				var by=Math.atan2(d,b);
				r=Math.atan2(td,tb)-Math.atan2(tc,ta)-(by-Math.atan2(tTfBone.resultMatrix.c,tTfBone.resultMatrix.a));
				if (r > Math.PI)
					r-=Math.PI *2;
				else if (r <-Math.PI)r+=Math.PI *2;
				r=by+(r+this._data.offsetShearY *Math.PI / 180)*this.shearMix;
				s=Math.sqrt(b *b+d *d);
				tTfBone.resultMatrix.b=Math.cos(r)*s;
				tTfBone.resultMatrix.d=Math.sin(r)*s;
			}
		}
	}

	return TfConstraint;
})()


/**
*@private
*/
//class laya.ani.bone.TfConstraintData
var TfConstraintData=(function(){
	function TfConstraintData(){
		this.name=null;
		this.targetIndex=0;
		this.rotateMix=NaN;
		this.translateMix=NaN;
		this.scaleMix=NaN;
		this.shearMix=NaN;
		this.offsetRotation=NaN;
		this.offsetX=NaN;
		this.offsetY=NaN;
		this.offsetScaleX=NaN;
		this.offsetScaleY=NaN;
		this.offsetShearY=NaN;
		this.boneIndexs=[];
	}

	__class(TfConstraintData,'laya.ani.bone.TfConstraintData');
	return TfConstraintData;
})()


/**
*@private
*/
//class laya.ani.bone.Transform
var Transform=(function(){
	function Transform(){
		this.skX=0;
		this.skY=0;
		this.scX=1;
		this.scY=1;
		this.x=0;
		this.y=0;
		this.skewX=0;
		this.skewY=0;
		this.mMatrix=null;
	}

	__class(Transform,'laya.ani.bone.Transform');
	var __proto=Transform.prototype;
	__proto.initData=function(data){
		if (data.x !=undefined){
			this.x=data.x;
		}
		if (data.y !=undefined){
			this.y=data.y;
		}
		if (data.skX !=undefined){
			this.skX=data.skX;
		}
		if (data.skY !=undefined){
			this.skY=data.skY;
		}
		if (data.scX !=undefined){
			this.scX=data.scX;
		}
		if (data.scY !=undefined){
			this.scY=data.scY;
		}
	}

	__proto.getMatrix=function(){
		var tMatrix;
		if (this.mMatrix){
			tMatrix=this.mMatrix;
			}else {
			tMatrix=this.mMatrix=new Matrix();
		}
		tMatrix.identity();
		tMatrix.scale(this.scX,this.scY);
		if (this.skewX || this.skewY){
			this.skew(tMatrix,this.skewX *Math.PI / 180,this.skewY *Math.PI / 180);
		}
		tMatrix.rotate(this.skX *Math.PI / 180);
		tMatrix.translate(this.x,this.y);
		return tMatrix;
	}

	__proto.skew=function(m,x,y){
		var sinX=Math.sin(y);
		var cosX=Math.cos(y);
		var sinY=Math.sin(x);
		var cosY=Math.cos(x);
		m.setTo(m.a *cosY-m.b *sinX,
		m.a *sinY+m.b *cosX,
		m.c *cosY-m.d *sinX,
		m.c *sinY+m.d *cosX,
		m.tx *cosY-m.ty *sinX,
		m.tx *sinY+m.ty *cosX);
		return m;
	}

	return Transform;
})()


/**
*用于UV转换的工具类
*@private
*/
//class laya.ani.bone.UVTools
var UVTools=(function(){
	function UVTools(){}
	__class(UVTools,'laya.ani.bone.UVTools');
	UVTools.getRelativeUV=function(bigUV,smallUV,rst){
		var startX=bigUV[0];
		var width=bigUV[2]-bigUV[0];
		var startY=bigUV[1];
		var height=bigUV[5]-bigUV[1];
		if(!rst)rst=[];
		rst.length=smallUV.length;
		var i=0,len=0;
		len=rst.length;
		var dWidth=1 / width;
		var dHeight=1 / height;
		for (i=0;i < len;i+=2){
			rst[i]=(smallUV[i]-startX)*dWidth;
			rst[i+1]=(smallUV[i+1]-startY)*dHeight;
		}
		return rst;
	}

	UVTools.getAbsoluteUV=function(bigUV,smallUV,rst){
		if (bigUV[0]==0 && bigUV[1]==0 && bigUV[4]==1 && bigUV[5]==1){
			if (rst){
				Utils.copyArray(rst,smallUV);
				return rst;
				}else{
				return smallUV;
			}
		};
		var startX=bigUV[0];
		var width=bigUV[2]-bigUV[0];
		var startY=bigUV[1];
		var height=bigUV[5]-bigUV[1];
		if(!rst)rst=[];
		rst.length=smallUV.length;
		var i=0,len=0;
		len=rst.length;
		for (i=0;i < len;i+=2){
			rst[i]=smallUV[i]*width+startX;
			rst[i+1]=smallUV[i+1]*height+startY;
		}
		return rst;
	}

	return UVTools;
})()


/**
*@private
*@author ...
*/
//class laya.ani.KeyFramesContent
var KeyFramesContent=(function(){
	function KeyFramesContent(){
		this.startTime=NaN;
		this.duration=NaN;
		this.interpolationData=null;
		//私有插值方式 [type0(插值类型),Data0(插值数据,可为空)，type1(插值类型),Data1(插值数据,可为空)] 注意：254全线性插值，255全不插值
		this.data=null;
		//=new Float32Array();
		this.nextData=null;
	}

	__class(KeyFramesContent,'laya.ani.KeyFramesContent');
	return KeyFramesContent;
})()


/**
*@private
*...
*@author ww
*/
//class laya.ani.math.BezierLerp
var BezierLerp=(function(){
	function BezierLerp(){}
	__class(BezierLerp,'laya.ani.math.BezierLerp');
	BezierLerp.getBezierRate=function(t,px0,py0,px1,py1){
		var key=BezierLerp._getBezierParamKey(px0,py0,px1,py1);
		var vKey=key *100+t;
		if (BezierLerp._bezierResultCache[vKey])return BezierLerp._bezierResultCache[vKey];
		var points=BezierLerp._getBezierPoints(px0,py0,px1,py1,key);
		var i=0,len=0;
		len=points.length;
		for (i=0;i < len;i+=2){
			if (t <=points[i]){
				BezierLerp._bezierResultCache[vKey]=points[i+1];
				return points[i+1];
			}
		}
		BezierLerp._bezierResultCache[vKey]=1;
		return 1;
	}

	BezierLerp._getBezierParamKey=function(px0,py0,px1,py1){
		return (((px0 *100+py0)*100+px1)*100+py1)*100;
	}

	BezierLerp._getBezierPoints=function(px0,py0,px1,py1,key){
		if (BezierLerp._bezierPointsCache[key])return BezierLerp._bezierPointsCache[key];
		var controlPoints;
		controlPoints=[0,0,px0,py0,px1,py1,1,1];
		var bz;
		bz=new Bezier();
		var points;
		points=bz.getBezierPoints(controlPoints,100,3);
		BezierLerp._bezierPointsCache[key]=points;
		return points;
	}

	BezierLerp._bezierResultCache={};
	BezierLerp._bezierPointsCache={};
	return BezierLerp;
})()


/**
*<code>AnimationPlayer</code> 类用于动画播放器。
*/
//class laya.ani.AnimationPlayer extends laya.events.EventDispatcher
var AnimationPlayer=(function(_super){
	function AnimationPlayer(){
		/**@private */
		this._destroyed=false;
		/**数据模板*/
		this._templet=null;
		/**当前精确时间，不包括重播时间*/
		this._currentTime=NaN;
		/**当前帧时间，不包括重播时间*/
		this._currentFrameTime=NaN;
		/**动画播放的起始时间位置*/
		this._playStart=NaN;
		/**动画播放的结束时间位置*/
		this._playEnd=NaN;
		/**动画播放一次的总时间*/
		this._playDuration=NaN;
		/**动画播放总时间*/
		this._overallDuration=NaN;
		/**是否在一帧结束时停止*/
		this._stopWhenCircleFinish=false;
		/**已播放时间，包括重播时间*/
		this._elapsedPlaybackTime=NaN;
		/**播放时帧数*/
		this._startUpdateLoopCount=NaN;
		/**当前动画索引*/
		this._currentAnimationClipIndex=0;
		/**当前帧数*/
		this._currentKeyframeIndex=0;
		/**是否暂停*/
		this._paused=false;
		/**默认帧率,必须大于0*/
		this._cacheFrameRate=0;
		/**帧率间隔时间*/
		this._cacheFrameRateInterval=NaN;
		/**缓存播放速率*/
		this._cachePlayRate=NaN;
		this._fullFrames=null;
		/**是否缓存*/
		this.isCache=true;
		/**播放速率*/
		this.playbackRate=1.0;
		/**停止时是否归零*/
		this.returnToZeroStopped=false;
		AnimationPlayer.__super.call(this);
		this._destroyed=false;
		this._currentAnimationClipIndex=-1;
		this._currentKeyframeIndex=-1;
		this._currentTime=0.0;
		this._overallDuration=Number.MAX_VALUE;
		this._stopWhenCircleFinish=false;
		this._elapsedPlaybackTime=0;
		this._startUpdateLoopCount=-1;
		this._cachePlayRate=1.0;
		this.cacheFrameRate=60;
		this.returnToZeroStopped=false;
	}

	__class(AnimationPlayer,'laya.ani.AnimationPlayer',_super);
	var __proto=AnimationPlayer.prototype;
	Laya.imps(__proto,{"laya.resource.IDestroy":true})
	/**
	*@private
	*/
	__proto._onTempletLoadedComputeFullKeyframeIndices=function(cachePlayRate,cacheFrameRate,templet){
		if (this._templet===templet && this._cachePlayRate===cachePlayRate && this._cacheFrameRate===cacheFrameRate)
			this._computeFullKeyframeIndices();
	}

	/**
	*@private
	*/
	__proto._computeFullKeyframeIndices=function(){
		var anifullFrames=this._fullFrames=[];
		var templet=this._templet;
		var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
		for (var i=0,iNum=templet.getAnimationCount();i < iNum;i++){
			var aniFullFrame=[];
			for (var j=0,jNum=templet.getAnimation(i).nodes.length;j < jNum;j++){
				var node=templet.getAnimation(i).nodes[j];
				var frameCount=Math.floor(node.playTime / cacheFrameInterval+0.01);
				var nodeFullFrames=new Uint16Array(frameCount+1);
				var lastFrameIndex=-1;
				for (var n=0,nNum=node.keyFrame.length;n < nNum;n++){
					var keyFrame=node.keyFrame[n];
					var tm=keyFrame.startTime;
					var endTm=tm+keyFrame.duration+cacheFrameInterval;
					do {
						var frameIndex=Math.floor(tm / cacheFrameInterval+0.5);
						for (var k=lastFrameIndex+1;k < frameIndex;k++)
						nodeFullFrames[k]=n;
						lastFrameIndex=frameIndex;
						nodeFullFrames[frameIndex]=n;
						tm+=cacheFrameInterval;
					}while (tm <=endTm);
				}
				aniFullFrame.push(nodeFullFrames);
			}
			anifullFrames.push(aniFullFrame);
		}
	}

	/**
	*@private
	*/
	__proto._onAnimationTempletLoaded=function(){
		(this.destroyed)|| (this._calculatePlayDuration());
	}

	/**
	*@private
	*/
	__proto._calculatePlayDuration=function(){
		if (this.state!==/*laya.ani.AnimationState.stopped*/0){
			var oriDuration=this._templet.getAniDuration(this._currentAnimationClipIndex);
			(this._playEnd===0)&& (this._playEnd=oriDuration);
			if (this._playEnd > oriDuration)
				this._playEnd=oriDuration;
			this._playDuration=this._playEnd-this._playStart;
		}
	}

	/**
	*@private
	*/
	__proto._setPlayParams=function(time,cacheFrameInterval){
		this._currentTime=time;
		this._currentKeyframeIndex=Math.max(Math.floor((this.currentPlayTime)/ cacheFrameInterval+0.01),0);
		this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
	}

	/**
	*@private
	*/
	__proto._setPlayParamsWhenStop=function(currentAniClipPlayDuration,cacheFrameInterval,playEnd){
		(playEnd===void 0)&& (playEnd=-1);
		this._currentTime=currentAniClipPlayDuration;
		var endTime=playEnd > 0 ? playEnd :currentAniClipPlayDuration;
		this._currentKeyframeIndex=Math.max(Math.floor(endTime / cacheFrameInterval+0.01),0);
		this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
		this._currentAnimationClipIndex=-1;
	}

	/**
	*@private
	*/
	__proto._update=function(elapsedTime){
		if (this._currentAnimationClipIndex===-1 || this._paused || !this._templet || !this._templet.loaded)
			return;
		var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
		var time=0;
		(this._startUpdateLoopCount!==Stat.loopCount)&& (time=elapsedTime *this.playbackRate,this._elapsedPlaybackTime+=time);
		var currentAniClipPlayDuration=this.playDuration;
		time+=this._currentTime;
		if ((this._overallDuration!==0 && this._elapsedPlaybackTime >=this._overallDuration)|| (this._overallDuration===0 && this._elapsedPlaybackTime >=currentAniClipPlayDuration)
			|| (this._overallDuration===0 && time >=this.playEnd)){
			this._setPlayParamsWhenStop(currentAniClipPlayDuration,cacheFrameInterval,this.playEnd);
			this.event(/*laya.events.Event.STOPPED*/"stopped");
			return;
		}
		if (currentAniClipPlayDuration > 0){
			if (time >=currentAniClipPlayDuration){
				do {
					time-=currentAniClipPlayDuration;
					if (this._stopWhenCircleFinish){
						this._setPlayParamsWhenStop(currentAniClipPlayDuration,cacheFrameInterval);
						this._stopWhenCircleFinish=false;
						this.event(/*laya.events.Event.STOPPED*/"stopped");
						return;
					}
					if (time < currentAniClipPlayDuration){
						this._setPlayParams(time,cacheFrameInterval);
						this.event(/*laya.events.Event.COMPLETE*/"complete");
					}
				}while (time >=currentAniClipPlayDuration)
				}else {
				this._setPlayParams(time,cacheFrameInterval);
			}
			}else {
			if (this._stopWhenCircleFinish){
				this._setPlayParamsWhenStop(currentAniClipPlayDuration,cacheFrameInterval);
				this._stopWhenCircleFinish=false;
				this.event(/*laya.events.Event.STOPPED*/"stopped");
				return;
			}
			this._currentTime=this._currentFrameTime=this._currentKeyframeIndex=0;
			this.event(/*laya.events.Event.COMPLETE*/"complete");
		}
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		this.offAll();
		this._templet=null;
		this._fullFrames=null;
		this._destroyed=true;
	}

	/**
	*播放动画。
	*@param index 动画索引。
	*@param playbackRate 播放速率。
	*@param duration 播放时长（0为1次,Number.MAX_VALUE为循环播放）。
	*@param playStart 播放的起始时间位置。
	*@param playEnd 播放的结束时间位置。（0为动画一次循环的最长结束时间位置）。
	*/
	__proto.play=function(index,playbackRate,overallDuration,playStart,playEnd){
		(index===void 0)&& (index=0);
		(playbackRate===void 0)&& (playbackRate=1.0);
		(overallDuration===void 0)&& (overallDuration=2147483647);
		(playStart===void 0)&& (playStart=0);
		(playEnd===void 0)&& (playEnd=0);
		if (!this._templet)
			throw new Error("AnimationPlayer:templet must not be null,maybe you need to set url.");
		if (overallDuration < 0 || playStart < 0 || playEnd < 0)
			throw new Error("AnimationPlayer:overallDuration,playStart and playEnd must large than zero.");
		if ((playEnd!==0)&& (playStart > playEnd))
			throw new Error("AnimationPlayer:start must less than end.");
		this._currentTime=0;
		this._currentFrameTime=0;
		this._elapsedPlaybackTime=0;
		this.playbackRate=playbackRate;
		this._overallDuration=overallDuration;
		this._playStart=playStart;
		this._playEnd=playEnd;
		this._paused=false;
		this._currentAnimationClipIndex=index;
		this._currentKeyframeIndex=0;
		this._startUpdateLoopCount=Stat.loopCount;
		this.event(/*laya.events.Event.PLAYED*/"played");
		if (this._templet.loaded)
			this._calculatePlayDuration();
		else
		this._templet.once(/*laya.events.Event.LOADED*/"loaded",this,this._onAnimationTempletLoaded);
		this._update(0);
	}

	/**
	*播放动画。
	*@param index 动画索引。
	*@param playbackRate 播放速率。
	*@param duration 播放时长（0为1次,Number.MAX_VALUE为循环播放）。
	*@param playStartFrame 播放的原始起始帧率位置。
	*@param playEndFrame 播放的原始结束帧率位置。（0为动画一次循环的最长结束时间位置）。
	*/
	__proto.playByFrame=function(index,playbackRate,overallDuration,playStartFrame,playEndFrame,fpsIn3DBuilder){
		(index===void 0)&& (index=0);
		(playbackRate===void 0)&& (playbackRate=1.0);
		(overallDuration===void 0)&& (overallDuration=2147483647);
		(playStartFrame===void 0)&& (playStartFrame=0);
		(playEndFrame===void 0)&& (playEndFrame=0);
		(fpsIn3DBuilder===void 0)&& (fpsIn3DBuilder=30);
		var interval=1000.0 / fpsIn3DBuilder;
		this.play(index,playbackRate,overallDuration,playStartFrame *interval,playEndFrame *interval);
	}

	/**
	*停止播放当前动画
	*@param immediate 是否立即停止
	*/
	__proto.stop=function(immediate){
		(immediate===void 0)&& (immediate=true);
		if (immediate){
			this._currentTime=this._currentFrameTime=this._currentKeyframeIndex=0;
			this._currentAnimationClipIndex=-1;
			this.event(/*laya.events.Event.STOPPED*/"stopped");
			}else {
			this._stopWhenCircleFinish=true;
		}
	}

	/**
	*动画播放的结束时间位置。
	*@return 结束时间位置。
	*/
	__getset(0,__proto,'playEnd',function(){
		return this._playEnd;
	});

	/**
	*设置动画数据模板,注意：修改此值会有计算开销。
	*@param value 动画数据模板
	*/
	/**
	*获取动画数据模板
	*@param value 动画数据模板
	*/
	__getset(0,__proto,'templet',function(){
		return this._templet;
		},function(value){
		if (!this.state===/*laya.ani.AnimationState.stopped*/0)
			this.stop(true);
		if (this._templet!==value){
			this._templet=value;
			if (value.loaded)
				this._computeFullKeyframeIndices();
			else
			value.once(/*laya.events.Event.LOADED*/"loaded",this,this._onTempletLoadedComputeFullKeyframeIndices,[this._cachePlayRate,this._cacheFrameRate]);
		}
	});

	/**
	*动画播放的起始时间位置。
	*@return 起始时间位置。
	*/
	__getset(0,__proto,'playStart',function(){
		return this._playStart;
	});

	/**
	*获取动画播放一次的总时间
	*@return 动画播放一次的总时间
	*/
	__getset(0,__proto,'playDuration',function(){
		return this._playDuration;
	});

	/**
	*获取当前播放状态
	*@return 当前播放状态
	*/
	__getset(0,__proto,'state',function(){
		if (this._currentAnimationClipIndex===-1)
			return /*laya.ani.AnimationState.stopped*/0;
		if (this._paused)
			return /*laya.ani.AnimationState.paused*/1;
		return /*laya.ani.AnimationState.playing*/2;
	});

	/**
	*获取当前帧数
	*@return 当前帧数
	*/
	__getset(0,__proto,'currentKeyframeIndex',function(){
		return this._currentKeyframeIndex;
	});

	/**
	*获取动画播放的总总时间
	*@return 动画播放的总时间
	*/
	__getset(0,__proto,'overallDuration',function(){
		return this._overallDuration;
	});

	/**
	*获取当前帧时间，不包括重播时间
	*@return value 当前时间
	*/
	__getset(0,__proto,'currentFrameTime',function(){
		return this._currentFrameTime;
	});

	/**
	*获取当前动画索引
	*@return value 当前动画索引
	*/
	__getset(0,__proto,'currentAnimationClipIndex',function(){
		return this._currentAnimationClipIndex;
	});

	/**
	*获取当前精确时间，不包括重播时间
	*@return value 当前时间
	*/
	__getset(0,__proto,'currentPlayTime',function(){
		return this._currentTime+this._playStart;
	});

	/**
	*设置缓存播放速率,默认值为1.0,注意：修改此值会有计算开销。*
	*@return value 缓存播放速率。
	*/
	/**
	*获取缓存播放速率。*
	*@return 缓存播放速率。
	*/
	__getset(0,__proto,'cachePlayRate',function(){
		return this._cachePlayRate;
		},function(value){
		if (this._cachePlayRate!==value){
			this._cachePlayRate=value;
			if (this._templet)
				if (this._templet.loaded)
			this._computeFullKeyframeIndices();
			else
			this._templet.once(/*laya.events.Event.LOADED*/"loaded",this,this._onTempletLoadedComputeFullKeyframeIndices,[value,this._cacheFrameRate]);
		}
	});

	/**
	*设置默认帧率,每秒60帧,注意：修改此值会有计算开销。*
	*@return value 缓存帧率
	*/
	/**
	*获取默认帧率*
	*@return value 默认帧率
	*/
	__getset(0,__proto,'cacheFrameRate',function(){
		return this._cacheFrameRate;
		},function(value){
		if (this._cacheFrameRate!==value){
			this._cacheFrameRate=value;
			this._cacheFrameRateInterval=1000.0 / this._cacheFrameRate;
			if (this._templet)
				if (this._templet.loaded)
			this._computeFullKeyframeIndices();
			else
			this._templet.once(/*laya.events.Event.LOADED*/"loaded",this,this._onTempletLoadedComputeFullKeyframeIndices,[this._cachePlayRate,value]);
		}
	});

	/**
	*设置当前播放位置
	*@param value 当前时间
	*/
	__getset(0,__proto,'currentTime',null,function(value){
		if (this._currentAnimationClipIndex===-1 || !this._templet || !this._templet.loaded)
			return;
		if (value < this._playStart || value > this._playEnd)
			throw new Error("AnimationPlayer:value must large than playStartTime,small than playEndTime.");
		this._startUpdateLoopCount=Stat.loopCount;
		var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
		this._currentTime=value;
		this._currentKeyframeIndex=Math.max(Math.floor(this.currentPlayTime / cacheFrameInterval),0);
		this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
	});

	/**
	*设置是否暂停
	*@param value 是否暂停
	*/
	/**
	*获取当前是否暂停
	*@return 是否暂停
	*/
	__getset(0,__proto,'paused',function(){
		return this._paused;
		},function(value){
		this._paused=value;
		value && this.event(/*laya.events.Event.PAUSED*/"paused");
	});

	/**
	*获取缓存帧率间隔时间
	*@return 缓存帧率间隔时间
	*/
	__getset(0,__proto,'cacheFrameRateInterval',function(){
		return this._cacheFrameRateInterval;
	});

	/**
	*获取是否已销毁。
	*@return 是否已销毁。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	return AnimationPlayer;
})(EventDispatcher)


/**
*@private
*/
//class laya.ani.GraphicsAni extends laya.display.Graphics
var GraphicsAni=(function(_super){
	function GraphicsAni(){
		GraphicsAni.__super.call(this);
		if (Render.isConchNode){
			this["drawSkin"]=function (skin){
				skin.transform || (skin.transform=Matrix.EMPTY);
				/*__JS__ */this._addCmd([skin]);
				this.setSkinMesh&&this.setSkinMesh(skin._ps,skin.mVBData,skin.mEleNum,0,skin.mTexture,skin.transform);
			};
		}
	}

	__class(GraphicsAni,'laya.ani.GraphicsAni',_super);
	var __proto=GraphicsAni.prototype;
	/**
	*@private
	*画自定义蒙皮动画
	*@param skin
	*/
	__proto.drawSkin=function(skin){
		var arr=[skin];
		this._saveToCmd(Render._context._drawSkin,arr);
	}

	GraphicsAni.create=function(){
		var rs=GraphicsAni._caches.pop();
		return rs||new GraphicsAni();
	}

	GraphicsAni.recycle=function(graphics){
		graphics.clear();
		GraphicsAni._caches.push(graphics);
	}

	GraphicsAni._caches=[];
	return GraphicsAni;
})(Graphics)


/**
*@private
*Canvas版本的SkinMesh
*/
//class laya.ani.bone.canvasmesh.SkinMeshCanvas extends laya.ani.bone.canvasmesh.CanvasMeshRender
var SkinMeshCanvas=(function(_super){
	function SkinMeshCanvas(){
		SkinMeshCanvas.__super.call(this);
		this.mesh=new MeshData();
	}

	__class(SkinMeshCanvas,'laya.ani.bone.canvasmesh.SkinMeshCanvas',_super);
	var __proto=SkinMeshCanvas.prototype;
	__proto.init2=function(texture,vs,ps,verticles,uvs){
		if (this.transform){
			this.transform=null;
		};
		var _ps;
		if (ps){
			_ps=ps;
			}else {
			_ps=[];
			_ps.push(0,1,3,3,1,2);
		}
		this.mesh.texture=texture;
		this.mesh.indexes=_ps;
		this.mesh.vertices=verticles;
		this.mesh.uvs=uvs;
	}

	__proto.render=function(context,x,y){
		if(!this.mesh.texture)return;
		if(!this.transform){
			this.transform=SkinMeshCanvas._tempMatrix;
			this.transform.identity();
			this.transform.translate(x,y);
			this.renderToContext(context);
			this.transform.translate(-x,-y);
			this.transform=null;
			}else{
			this.transform.translate(x,y);
			this.renderToContext(context);
			this.transform.translate(-x,-y);
		}
	}

	__static(SkinMeshCanvas,
	['_tempMatrix',function(){return this._tempMatrix=new Matrix();}
	]);
	return SkinMeshCanvas;
})(CanvasMeshRender)


/**
*<code>AnimationTemplet</code> 类用于动画模板资源。
*/
//class laya.ani.AnimationTemplet extends laya.resource.Resource
var AnimationTemplet=(function(_super){
	function AnimationTemplet(){
		/**@private */
		//this._aniVersion=null;
		/**@private */
		this._aniMap={};
		/**@private */
		//this._publicExtData=null;
		/**@private */
		//this._useParent=false;
		/**@private */
		//this.unfixedCurrentFrameIndexes=null;
		/**@private */
		//this.unfixedCurrentTimes=null;
		/**@private */
		//this.unfixedKeyframes=null;
		/**@private */
		this.unfixedLastAniIndex=-1;
		/**@private */
		//this._aniClassName=null;
		/**@private */
		//this._animationDatasCache=null;
		AnimationTemplet.__super.call(this);
		this._anis=new Array;
	}

	__class(AnimationTemplet,'laya.ani.AnimationTemplet',_super);
	var __proto=AnimationTemplet.prototype;
	/**
	*@private
	*/
	__proto.parse=function(data){
		var reader=new Byte(data);
		this._aniVersion=reader.readUTFString();
		AnimationParser01.parse(this,reader);
	}

	/**
	*@private
	*/
	__proto._calculateKeyFrame=function(node,keyframeCount,keyframeDataCount){
		var keyFrames=node.keyFrame;
		keyFrames[keyframeCount]=keyFrames[0];
		for (var i=0;i < keyframeCount;i++){
			var keyFrame=keyFrames[i];
			keyFrame.nextData=(keyFrame.duration===0)? keyFrame.data :keyFrames[i+1].data;
		}
		keyFrames.length--;
	}

	/**
	*@inheritDoc
	*/
	__proto.onAsynLoaded=function(url,data,params){
		var reader=new Byte(data);
		this._aniVersion=reader.readUTFString();
		switch (this._aniVersion){
			case "LAYAANIMATION:02":
				AnimationParser02.parse(this,reader);
				break ;
			default :
				AnimationParser01.parse(this,reader);
			}
		this._endLoaded();
	}

	/**
	*@inheritDoc
	*/
	__proto.disposeResource=function(){
		this._aniVersion=null;
		this._anis=null;
		this._aniMap=null;
		this._publicExtData=null;
		this.unfixedCurrentFrameIndexes=null;
		this.unfixedCurrentTimes=null;
		this.unfixedKeyframes=null;
		this._aniClassName=null;
		this._animationDatasCache=null;
	}

	__proto.getAnimationCount=function(){
		return this._anis.length;
	}

	__proto.getAnimation=function(aniIndex){
		return this._anis[aniIndex];
	}

	__proto.getAniDuration=function(aniIndex){
		return this._anis[aniIndex].playTime;
	}

	__proto.getNodes=function(aniIndex){
		return this._anis[aniIndex].nodes;
	}

	__proto.getNodeIndexWithName=function(aniIndex,name){
		return this._anis[aniIndex].bone3DMap[name];
	}

	__proto.getNodeCount=function(aniIndex){
		return this._anis[aniIndex].nodes.length;
	}

	__proto.getTotalkeyframesLength=function(aniIndex){
		return this._anis[aniIndex].totalKeyframeDatasLength;
	}

	__proto.getPublicExtData=function(){
		return this._publicExtData;
	}

	__proto.getAnimationDataWithCache=function(key,cacheDatas,aniIndex,frameIndex){
		var aniDatas=cacheDatas[aniIndex];
		if (!aniDatas){
			return null;
			}else {
			var keyDatas=aniDatas[key];
			if (!keyDatas)
				return null;
			else {
				return keyDatas[frameIndex];
			}
		}
	}

	__proto.setAnimationDataWithCache=function(key,cacheDatas,aniIndex,frameIndex,data){
		var aniDatas=(cacheDatas[aniIndex])|| (cacheDatas[aniIndex]={});
		var aniDatasCache=(aniDatas[key])|| (aniDatas[key]=[]);
		aniDatasCache[frameIndex]=data;
	}

	__proto.getOriginalData=function(aniIndex,originalData,nodesFrameIndices,frameIndex,playCurTime){
		var oneAni=this._anis[aniIndex];
		var nodes=oneAni.nodes;
		var j=0;
		for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
			var node=nodes[i];
			var key;
			key=node.keyFrame[nodesFrameIndices[i][frameIndex]];
			node.dataOffset=outOfs;
			var dt=playCurTime-key.startTime;
			var lerpType=node.lerpType;
			if (lerpType){
				switch (lerpType){
					case 0:
					case 1:
						for (j=0;j < node.keyframeWidth;)
						j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,null,key.duration,key.nextData);
						break ;
					case 2:;
						var interpolationData=key.interpolationData;
						var interDataLen=interpolationData.length;
						var dataIndex=0;
						for (j=0;j < interDataLen;){
							var type=interpolationData[j];
						switch (type){
							case 6:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,null,key.duration,key.nextData,interpolationData,j+1);
								break ;
							case 7:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,null,key.duration,key.nextData,interpolationData,j+1);
								break ;
							default :
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,null,key.duration,key.nextData);
							}
						dataIndex++;
					}
					break ;
				}
				}else {
				for (j=0;j < node.keyframeWidth;)
				j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,null,key.duration,key.nextData);
			}
			outOfs+=node.keyframeWidth;
		}
	}

	__proto.getNodesCurrentFrameIndex=function(aniIndex,playCurTime){
		var ani=this._anis[aniIndex];
		var nodes=ani.nodes;
		if (aniIndex!==this.unfixedLastAniIndex){
			this.unfixedCurrentFrameIndexes=new Uint32Array(nodes.length);
			this.unfixedCurrentTimes=new Float32Array(nodes.length);
			this.unfixedLastAniIndex=aniIndex;
		}
		for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
			var node=nodes[i];
			if (playCurTime < this.unfixedCurrentTimes[i])
				this.unfixedCurrentFrameIndexes[i]=0;
			this.unfixedCurrentTimes[i]=playCurTime;
			while ((this.unfixedCurrentFrameIndexes[i] < node.keyFrame.length)){
				if (node.keyFrame[this.unfixedCurrentFrameIndexes[i]].startTime > this.unfixedCurrentTimes[i])
					break ;
				this.unfixedCurrentFrameIndexes[i]++;
			}
			this.unfixedCurrentFrameIndexes[i]--;
		}
		return this.unfixedCurrentFrameIndexes;
	}

	__proto.getOriginalDataUnfixedRate=function(aniIndex,originalData,playCurTime){
		var oneAni=this._anis[aniIndex];
		var nodes=oneAni.nodes;
		if (aniIndex!==this.unfixedLastAniIndex){
			this.unfixedCurrentFrameIndexes=new Uint32Array(nodes.length);
			this.unfixedCurrentTimes=new Float32Array(nodes.length);
			this.unfixedKeyframes=__newvec(nodes.length);
			this.unfixedLastAniIndex=aniIndex;
		};
		var j=0;
		for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
			var node=nodes[i];
			if (playCurTime < this.unfixedCurrentTimes[i])
				this.unfixedCurrentFrameIndexes[i]=0;
			this.unfixedCurrentTimes[i]=playCurTime;
			while (this.unfixedCurrentFrameIndexes[i] < node.keyFrame.length){
				if (node.keyFrame[this.unfixedCurrentFrameIndexes[i]].startTime > this.unfixedCurrentTimes[i])
					break ;
				this.unfixedKeyframes[i]=node.keyFrame[this.unfixedCurrentFrameIndexes[i]];
				this.unfixedCurrentFrameIndexes[i]++;
			};
			var key=this.unfixedKeyframes[i];
			node.dataOffset=outOfs;
			var dt=playCurTime-key.startTime;
			var lerpType=node.lerpType;
			if (lerpType){
				switch (node.lerpType){
					case 0:
					case 1:
						for (j=0;j < node.keyframeWidth;)
						j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,null,key.duration,key.nextData);
						break ;
					case 2:;
						var interpolationData=key.interpolationData;
						var interDataLen=interpolationData.length;
						var dataIndex=0;
						for (j=0;j < interDataLen;){
							var type=interpolationData[j];
						switch (type){
							case 6:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,null,key.duration,key.nextData,interpolationData,j+1);
								break ;
							case 7:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,null,key.duration,key.nextData,interpolationData,j+1);
								break ;
							default :
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,null,key.duration,key.nextData);
							}
						dataIndex++;
					}
					break ;
				}
				}else {
				for (j=0;j < node.keyframeWidth;)
				j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,null,key.duration,key.nextData);
			}
			outOfs+=node.keyframeWidth;
		}
	}

	AnimationTemplet._LinearInterpolation_0=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		var amount=duration===0 ? 0 :dt / duration;
		out[outOfs]=(1.0-amount)*data[index]+amount *nextData[index];
		return 1;
	}

	AnimationTemplet._QuaternionInterpolation_1=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		var amount=duration===0 ? 0 :dt / duration;
		MathUtil.slerpQuaternionArray(data,index,nextData,index,amount,out,outOfs);
		return 4;
	}

	AnimationTemplet._AngleInterpolation_2=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		return 0;
	}

	AnimationTemplet._RadiansInterpolation_3=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		return 0;
	}

	AnimationTemplet._Matrix4x4Interpolation_4=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		for (var i=0;i < 16;i++,index++)
		out[outOfs+i]=data[index]+dt *dData[index];
		return 16;
	}

	AnimationTemplet._NoInterpolation_5=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		out[outOfs]=data[index];
		return 1;
	}

	AnimationTemplet._BezierInterpolation_6=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData,offset){
		(offset===void 0)&& (offset=0);
		out[outOfs]=data[index]+(nextData[index]-data[index])*BezierLerp.getBezierRate(dt / duration,interData[offset],interData[offset+1],interData[offset+2],interData[offset+3]);
		return 5;
	}

	AnimationTemplet._BezierInterpolation_7=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData,offset){
		(offset===void 0)&& (offset=0);
		out[outOfs]=interData[offset+4]+interData[offset+5] *BezierLerp.getBezierRate((dt *0.001+interData[offset+6])/ interData[offset+7],interData[offset],interData[offset+1],interData[offset+2],interData[offset+3]);
		return 9;
	}

	AnimationTemplet.load=function(url){
		return Laya.loader.create(url,null,null,AnimationTemplet);
	}

	AnimationTemplet.interpolation=[AnimationTemplet._LinearInterpolation_0,AnimationTemplet._QuaternionInterpolation_1,AnimationTemplet._AngleInterpolation_2,AnimationTemplet._RadiansInterpolation_3,AnimationTemplet._Matrix4x4Interpolation_4,AnimationTemplet._NoInterpolation_5,AnimationTemplet._BezierInterpolation_6,AnimationTemplet._BezierInterpolation_7];
	return AnimationTemplet;
})(Resource)


/**
*@private
*将mesh元素缓存到canvas中并进行绘制
*/
//class laya.ani.bone.canvasmesh.CacheAbleSkinMesh extends laya.ani.bone.canvasmesh.SkinMeshCanvas
var CacheAbleSkinMesh=(function(_super){
	function CacheAbleSkinMesh(){
		this.isCached=false;
		this.canvas=null;
		this.tex=null;
		this.rec=null;
		CacheAbleSkinMesh.__super.call(this);
	}

	__class(CacheAbleSkinMesh,'laya.ani.bone.canvasmesh.CacheAbleSkinMesh',_super);
	var __proto=CacheAbleSkinMesh.prototype;
	__proto.getCanvasPic=function(){
		var canvas=new HTMLCanvas("2D");
		var ctx=canvas.getContext('2d');
		this.rec=this.mesh.getBounds();
		debugger;
		canvas.size(this.rec.width,this.rec.height);
		var preTransform;
		preTransform=this.transform;
		this.transform=CacheAbleSkinMesh.tempMt;
		this.transform.identity();
		this.transform.translate(-this.rec.x,-this.rec.y);
		this.renderToContext(ctx);
		this.transform.translate(+this.rec.x,+this.rec.y);
		this.transform=preTransform;
		return new Texture(canvas);
	}

	__proto.render=function(context,x,y){
		if (!this.mesh.texture)return;
		if (!this.isCached){
			this.isCached=true;
			this.tex=this.getCanvasPic();
		}
		if(!this.transform){
			this.transform=SkinMeshCanvas._tempMatrix;
			this.transform.identity();
			this.transform.translate(x,y);
			this._renderTextureToContext(context);
			this.transform.translate(-x,-y);
			this.transform=null;
			}else{
			this.transform.translate(x,y);
			this._renderTextureToContext(context);
			this.transform.translate(-x,-y);
		}
	}

	__proto._renderTextureToContext=function(context){
		this.context=context.ctx || context;
		context.save();
		var texture;
		texture=this.tex;
		if (this.transform){
			var mt=this.transform;
			context.transform(mt.a,mt.b,mt.c,mt.d,mt.tx,mt.ty);
		}
		this.rec=this.mesh.getBounds();
		context.translate(this.rec.x,this.rec.y);
		context.drawTexture(texture,0,0,texture.width,texture.height,0,0);
		context.restore();
	}

	__static(CacheAbleSkinMesh,
	['tempMt',function(){return this.tempMt=new Matrix();}
	]);
	return CacheAbleSkinMesh;
})(SkinMeshCanvas)


/**
*@private
*简化mesh绘制，多顶点mesh改为四顶点mesh，只绘制矩形不绘制三角形
*/
//class laya.ani.bone.canvasmesh.SimpleSkinMeshCanvas extends laya.ani.bone.canvasmesh.SkinMeshCanvas
var SimpleSkinMeshCanvas=(function(_super){
	function SimpleSkinMeshCanvas(){
		/**
		*当前mesh数据是否可用
		*/
		this.cacheOK=false;
		/**
		*当前渲染数据是否可用
		*/
		this.cacheCmdOK=false;
		/**
		*transform参数缓存
		*/
		this.transformCmds=[];
		/**
		*drawImage参数缓存
		*/
		this.drawCmds=[]
		SimpleSkinMeshCanvas.__super.call(this);
		this.tempMesh=new MeshData();
	}

	__class(SimpleSkinMeshCanvas,'laya.ani.bone.canvasmesh.SimpleSkinMeshCanvas',_super);
	var __proto=SimpleSkinMeshCanvas.prototype;
	__proto.init2=function(texture,vs,ps,verticles,uvs){
		_super.prototype.init2.call(this,texture,vs,ps,verticles,uvs);
		this.cacheOK=false;
		this.cacheCmdOK=false;
		this.transformCmds.length=6;
		this.drawCmds.length=9;
	}

	__proto.renderToContext=function(context){
		this.context=context.ctx || context;
		if (this.mesh){
			if (this.mesh.uvs.length <=8){
				if (this.mode==0){
					this._renderWithIndexes(this.mesh);
				}
				else {
					this._renderNoIndexes(this.mesh);
				}
				return;
			}
			if (!this.cacheOK){
				this.tempMesh.texture=this.mesh.texture;
				this.tempMesh.uvs=this.mesh.texture.uv;
				this.tempMesh.vertices=MeshTools.solveMesh(this.mesh,this.tempMesh.vertices);
				this.cacheOK=true;
			}
			if (this.mode==0){
				this._renderWithIndexes(this.tempMesh);
			}
			else {
				this._renderNoIndexes(this.tempMesh);
			}
		}
	}

	__proto._renderWithIndexes=function(mesh){
		if(this.cacheCmdOK){
			this.renderByCache(mesh);
			return;
		};
		var indexes=mesh.indexes;
		var i=0,len=indexes.length;
		if (len > 1)
			len=1;
		for (i=0;i < len;i+=3){
			var index0=indexes[i] *2;
			var index1=indexes[i+1] *2;
			var index2=indexes[i+2] *2;
			this._renderDrawTriangle(mesh,index0,index1,index2);
		}
		this.cacheCmdOK=true;
	}

	__proto._renderDrawTriangle=function(mesh,index0,index1,index2){
		var context=this.context;
		var uvs=mesh.uvs;
		var vertices=mesh.vertices;
		var texture=mesh.texture;
		var source=texture.bitmap;
		var textureSource=source.source;
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var sourceWidth=source.width;
		var sourceHeight=source.height;
		var u0=NaN;
		var u1=NaN;
		var u2=NaN;
		var v0=NaN;
		var v1=NaN;
		var v2=NaN;
		if (mesh.useUvTransform){
			var ut=mesh.uvTransform;
			u0=((uvs[index0] *ut.a)+(uvs[index0+1] *ut.c)+ut.tx)*sourceWidth;
			u1=((uvs[index1] *ut.a)+(uvs[index1+1] *ut.c)+ut.tx)*sourceWidth;
			u2=((uvs[index2] *ut.a)+(uvs[index2+1] *ut.c)+ut.tx)*sourceWidth;
			v0=((uvs[index0] *ut.b)+(uvs[index0+1] *ut.d)+ut.ty)*sourceHeight;
			v1=((uvs[index1] *ut.b)+(uvs[index1+1] *ut.d)+ut.ty)*sourceHeight;
			v2=((uvs[index2] *ut.b)+(uvs[index2+1] *ut.d)+ut.ty)*sourceHeight;
		}
		else {
			u0=uvs[index0] *sourceWidth;
			u1=uvs[index1] *sourceWidth;
			u2=uvs[index2] *sourceWidth;
			v0=uvs[index0+1] *sourceHeight;
			v1=uvs[index1+1] *sourceHeight;
			v2=uvs[index2+1] *sourceHeight;
		};
		var x0=vertices[index0];
		var x1=vertices[index1];
		var x2=vertices[index2];
		var y0=vertices[index0+1];
		var y1=vertices[index1+1];
		var y2=vertices[index2+1];
		var delta=(u0 *v1)+(v0 *u2)+(u1 *v2)-(v1 *u2)-(v0 *u1)-(u0 *v2);
		var dDelta=1 / delta;
		var deltaA=(x0 *v1)+(v0 *x2)+(x1 *v2)-(v1 *x2)-(v0 *x1)-(x0 *v2);
		var deltaB=(u0 *x1)+(x0 *u2)+(u1 *x2)-(x1 *u2)-(x0 *u1)-(u0 *x2);
		var deltaC=(u0 *v1 *x2)+(v0 *x1 *u2)+(x0 *u1 *v2)-(x0 *v1 *u2)-(v0 *u1 *x2)-(u0 *x1 *v2);
		var deltaD=(y0 *v1)+(v0 *y2)+(y1 *v2)-(v1 *y2)-(v0 *y1)-(y0 *v2);
		var deltaE=(u0 *y1)+(y0 *u2)+(u1 *y2)-(y1 *u2)-(y0 *u1)-(u0 *y2);
		var deltaF=(u0 *v1 *y2)+(v0 *y1 *u2)+(y0 *u1 *v2)-(y0 *v1 *u2)-(v0 *u1 *y2)-(u0 *y1 *v2);
		this.transformCmds[0]=deltaA *dDelta;
		this.transformCmds[1]=deltaD *dDelta;
		this.transformCmds[2]=deltaB *dDelta;
		this.transformCmds[3]=deltaE *dDelta;
		this.transformCmds[4]=deltaC *dDelta;
		this.transformCmds[5]=deltaF *dDelta;
		this.drawCmds[0]=textureSource;
		this.drawCmds[1]=texture.uv[0] *sourceWidth;
		this.drawCmds[2]=texture.uv[1] *sourceHeight;
		this.drawCmds[3]=textureWidth;
		this.drawCmds[4]=textureHeight;
		this.drawCmds[5]=texture.uv[0] *sourceWidth;
		this.drawCmds[6]=texture.uv[1] *sourceHeight;
		this.drawCmds[7]=textureWidth;
		this.drawCmds[8]=textureHeight;
		context.save();
		if (this.transform){
			var mt=this.transform;
			context.transform(mt.a,mt.b,mt.c,mt.d,mt.tx,mt.ty);
		}
		context.transform.apply(context,this.transformCmds);
		context.drawImage.apply(context,this.drawCmds);
		context.restore();
	}

	/**
	*绘制缓存的命令
	*@param mesh
	*
	*/
	__proto.renderByCache=function(mesh){
		var context=this.context;
		context.save();
		if (this.transform){
			var mt=this.transform;
			context.transform(mt.a,mt.b,mt.c,mt.d,mt.tx,mt.ty);
		}
		context.transform.apply(context,this.transformCmds);
		context.drawImage.apply(context,this.drawCmds);
		context.restore();
	}

	return SimpleSkinMeshCanvas;
})(SkinMeshCanvas)


/**
*骨骼动画由<code>Templet</code>，<code>AnimationPlayer</code>，<code>Skeleton</code>三部分组成。
*/
//class laya.ani.bone.Skeleton extends laya.display.Sprite
var Skeleton=(function(_super){
	function Skeleton(templet,aniMode){
		this._templet=null;
		/**@private */
		this._player=null;
		/**@private */
		this._curOriginalData=null;
		//当前骨骼的偏移数据
		this._boneMatrixArray=[];
		//当前骨骼动画的最终结果数据
		this._lastTime=0;
		//上次的帧时间
		this._currAniName=null;
		this._currAniIndex=-1;
		this._pause=true;
		/**@private */
		this._aniClipIndex=-1;
		/**@private */
		this._clipIndex=-1;
		this._skinIndex=0;
		this._skinName="default";
		this._aniMode=0;
		//当前动画自己的缓冲区
		this._graphicsCache=null;
		this._boneSlotDic=null;
		this._bindBoneBoneSlotDic=null;
		this._boneSlotArray=null;
		this._index=-1;
		this._total=-1;
		this._indexControl=false;
		//加载路径
		this._aniPath=null;
		this._texturePath=null;
		this._complete=null;
		this._loadAniMode=0;
		this._yReverseMatrix=null;
		this._ikArr=null;
		this._tfArr=null;
		this._pathDic=null;
		this._rootBone=null;
		/**@private */
		this._boneList=null;
		/**@private */
		this._aniSectionDic=null;
		this._eventIndex=0;
		this._drawOrderIndex=0;
		this._drawOrder=null;
		this._lastAniClipIndex=-1;
		this._lastUpdateAniClipIndex=-1;
		this._playAudio=true;
		this._soundChannelArr=[];
		Skeleton.__super.call(this);
		(aniMode===void 0)&& (aniMode=0);
		if (templet)this.init(templet,aniMode);
	}

	__class(Skeleton,'laya.ani.bone.Skeleton',_super);
	var __proto=Skeleton.prototype;
	/**
	*初始化动画
	*@param templet 模板
	*@param aniMode 动画模式
	*<table>
	*<tr><th>模式</th><th>描述</th></tr>
	*<tr>
	*<td>0</td> <td>使用模板缓冲的数据，模板缓冲的数据，不允许修改（内存开销小，计算开销小，不支持换装）</td>
	*</tr>
	*<tr>
	*<td>1</td> <td>使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装）</td>
	*</tr>
	*<tr>
	*<td>2</td> <td>使用动态方式，去实时去画（内存开销小，计算开销大，支持换装,不建议使用）</td>
	*</tr>
	*</table>
	*/
	__proto.init=function(templet,aniMode){
		(aniMode===void 0)&& (aniMode=0);
		var i=0,n=0;
		if (aniMode==1){
			this._graphicsCache=[];
			for (i=0,n=templet.getAnimationCount();i < n;i++){
				this._graphicsCache.push([]);
			}
		}
		this._yReverseMatrix=templet.yReverseMatrix;
		this._aniMode=aniMode;
		this._templet=templet;
		this._player=new AnimationPlayer();
		this._player.cacheFrameRate=templet.rate;
		this._player.templet=templet;
		this._player.play();
		this._parseSrcBoneMatrix();
		this._boneList=templet.mBoneArr;
		this._rootBone=templet.mRootBone;
		this._aniSectionDic=templet.aniSectionDic;
		if (templet.ikArr.length > 0){
			this._ikArr=[];
			for (i=0,n=templet.ikArr.length;i < n;i++){
				this._ikArr.push(new IkConstraint(templet.ikArr[i],this._boneList));
			}
		}
		if (templet.pathArr.length > 0){
			var tPathData;
			var tPathConstraint;
			if (this._pathDic==null)this._pathDic={};
			var tBoneSlot;
			for (i=0,n=templet.pathArr.length;i < n;i++){
				tPathData=templet.pathArr[i];
				tPathConstraint=new PathConstraint(tPathData,this._boneList);
				tBoneSlot=this._boneSlotDic[tPathData.name];
				if (tBoneSlot){
					tPathConstraint=new PathConstraint(tPathData,this._boneList);
					tPathConstraint.target=tBoneSlot;
				}
				this._pathDic[tPathData.name]=tPathConstraint;
			}
		}
		if (templet.tfArr.length > 0){
			this._tfArr=[];
			for (i=0,n=templet.tfArr.length;i < n;i++){
				this._tfArr.push(new TfConstraint(templet.tfArr[i],this._boneList));
			}
		}
		if (templet.skinDataArray.length > 0){
			var tSkinData=this._templet.skinDataArray[this._skinIndex];
			this._skinName=tSkinData.name;
		}
		this._player.on(/*laya.events.Event.PLAYED*/"played",this,this._onPlay);
		this._player.on(/*laya.events.Event.STOPPED*/"stopped",this,this._onStop);
		this._player.on(/*laya.events.Event.PAUSED*/"paused",this,this._onPause);
	}

	/**
	*通过加载直接创建动画
	*@param path 要加载的动画文件路径
	*@param complete 加载完成的回调函数
	*@param aniMode 与<code>Skeleton.init</code>的<code>aniMode</code>作用一致
	*/
	__proto.load=function(path,complete,aniMode){
		(aniMode===void 0)&& (aniMode=0);
		this._aniPath=path;
		this._complete=complete;
		this._loadAniMode=aniMode;
		Laya.loader.load([{url:path,type:/*laya.net.Loader.BUFFER*/"arraybuffer"}],Handler.create(this,this._onLoaded));
	}

	/**
	*加载完成
	*/
	__proto._onLoaded=function(){
		var arraybuffer=Loader.getRes(this._aniPath);
		if (arraybuffer==null)return;
		if (Templet.TEMPLET_DICTIONARY==null){
			Templet.TEMPLET_DICTIONARY={};
		};
		var tFactory;
		tFactory=Templet.TEMPLET_DICTIONARY[this._aniPath];
		if (tFactory){
			if (tFactory.isParseFail){
				this._parseFail();
				}else {
				if (tFactory.isParserComplete){
					this._parseComplete();
					}else {
					tFactory.on(/*laya.events.Event.COMPLETE*/"complete",this,this._parseComplete);
					tFactory.on(/*laya.events.Event.ERROR*/"error",this,this._parseFail);
				}
			}
			}else {
			tFactory=new Templet();
			tFactory._setUrl(this._aniPath);
			Templet.TEMPLET_DICTIONARY[this._aniPath]=tFactory;
			tFactory.on(/*laya.events.Event.COMPLETE*/"complete",this,this._parseComplete);
			tFactory.on(/*laya.events.Event.ERROR*/"error",this,this._parseFail);
			tFactory.isParserComplete=false;
			tFactory.parseData(null,arraybuffer);
		}
	}

	/**
	*解析完成
	*/
	__proto._parseComplete=function(){
		var tTemple=Templet.TEMPLET_DICTIONARY[this._aniPath];
		if (tTemple){
			this.init(tTemple,this._loadAniMode);
			this.play(0,true);
		}
		this._complete && this._complete.runWith(this);
	}

	/**
	*解析失败
	*/
	__proto._parseFail=function(){
		console.log("[Error]:"+this._aniPath+"解析失败");
	}

	/**
	*传递PLAY事件
	*/
	__proto._onPlay=function(){
		this.event(/*laya.events.Event.PLAYED*/"played");
	}

	/**
	*传递STOP事件
	*/
	__proto._onStop=function(){
		var tEventData;
		var tEventAniArr=this._templet.eventAniArr;
		var tEventArr=tEventAniArr[this._aniClipIndex];
		if (tEventArr && this._eventIndex < tEventArr.length){
			for (;this._eventIndex < tEventArr.length;this._eventIndex++){
				tEventData=tEventArr[this._eventIndex];
				if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
					this.event(/*laya.events.Event.LABEL*/"label",tEventData);
				}
			}
		}
		this._drawOrder=null;
		this.event(/*laya.events.Event.STOPPED*/"stopped");
	}

	/**
	*传递PAUSE事件
	*/
	__proto._onPause=function(){
		this.event(/*laya.events.Event.PAUSED*/"paused");
	}

	/**
	*创建骨骼的矩阵，保存每次计算的最终结果
	*/
	__proto._parseSrcBoneMatrix=function(){
		var i=0,n=0;
		n=this._templet.srcBoneMatrixArr.length;
		for (i=0;i < n;i++){
			this._boneMatrixArray.push(new Matrix());
		}
		if (this._aniMode==0){
			this._boneSlotDic=this._templet.boneSlotDic;
			this._bindBoneBoneSlotDic=this._templet.bindBoneBoneSlotDic;
			this._boneSlotArray=this._templet.boneSlotArray;
			}else {
			if (this._boneSlotDic==null)this._boneSlotDic={};
			if (this._bindBoneBoneSlotDic==null)this._bindBoneBoneSlotDic={};
			if (this._boneSlotArray==null)this._boneSlotArray=[];
			var tArr=this._templet.boneSlotArray;
			var tBS;
			var tBSArr;
			for (i=0,n=tArr.length;i < n;i++){
				tBS=tArr[i];
				tBSArr=this._bindBoneBoneSlotDic[tBS.parent];
				if (tBSArr==null){
					this._bindBoneBoneSlotDic[tBS.parent]=tBSArr=[];
				}
				this._boneSlotDic[tBS.name]=tBS=tBS.copy();
				tBSArr.push(tBS);
				this._boneSlotArray.push(tBS);
			}
		}
	}

	__proto._emitMissedEvents=function(startTime,endTime,startIndex){
		(startIndex===void 0)&& (startIndex=0);
		var tEventAniArr=this._templet.eventAniArr;
		var tEventArr=tEventAniArr[this._player.currentAnimationClipIndex];
		if (tEventArr){
			var i=0,len=0;
			var tEventData;
			len=tEventArr.length;
			for (i=startIndex;i < len;i++){
				tEventData=tEventArr[i];
				if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
					this.event(/*laya.events.Event.LABEL*/"label",tEventData);
				}
			}
		}
	}

	/**
	*更新动画
	*@param autoKey true为正常更新，false为index手动更新
	*/
	__proto._update=function(autoKey){
		(autoKey===void 0)&& (autoKey=true);
		if (this._pause)return;
		if (autoKey && this._indexControl){
			return;
		};
		var tCurrTime=this.timer.currTimer;
		var preIndex=this._player.currentKeyframeIndex;
		var dTime=tCurrTime-this._lastTime;
		if (autoKey){
			this._player._update(dTime);
			}else {
			preIndex=-1;
		}
		this._lastTime=tCurrTime;
		if (!this._player)return;
		this._index=this._clipIndex=this._player.currentKeyframeIndex;
		if (this._index < 0)return;
		if (dTime > 0 && this._clipIndex==preIndex && this._lastUpdateAniClipIndex==this._aniClipIndex){
			return;
		}
		this._lastUpdateAniClipIndex=this._aniClipIndex;
		if (preIndex > this._clipIndex && this._eventIndex !=0){
			this._emitMissedEvents(this._player.playStart,this._player.playEnd,this._eventIndex);
			this._eventIndex=0;
		};
		var tEventData;
		var tEventAniArr=this._templet.eventAniArr;
		var tEventArr=tEventAniArr[this._aniClipIndex];
		var _soundChannel;
		if (tEventArr && this._eventIndex < tEventArr.length){
			tEventData=tEventArr[this._eventIndex];
			if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
				if (this._player.currentPlayTime >=tEventData.time){
					this.event(/*laya.events.Event.LABEL*/"label",tEventData);
					this._eventIndex++;
					if (this._playAudio && tEventData.audioValue && tEventData.audioValue!=="null"){
						_soundChannel=SoundManager.playSound(this._player.templet._path+tEventData.audioValue,1,Handler.create(this,this._onAniSoundStoped));
						SoundManager.playbackRate=this._player.playbackRate;
						_soundChannel && this._soundChannelArr.push(_soundChannel);
					}
				}
				}else if (tEventData.time < this._player.playStart && this._playAudio && tEventData.audioValue && tEventData.audioValue!=="null"){
				this._eventIndex++;
				_soundChannel=SoundManager.playSound(this._player.templet._path+tEventData.audioValue,1,Handler.create(this,this._onAniSoundStoped),null,(this._player.currentPlayTime-tEventData.time)/ 1000);
				SoundManager.playbackRate=this._player.playbackRate;
				_soundChannel && this._soundChannelArr.push(_soundChannel);
				}else {
				this._eventIndex++;
			}
		};
		var tGraphics;
		if (this._aniMode==0){
			tGraphics=this._templet.getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
			if (tGraphics){
				if (this.graphics !=tGraphics){
					this.graphics=tGraphics;
				}
				return;
				}else {
				var i=0,minIndex=0;
				minIndex=this._clipIndex;
				while ((!this._templet.getGrahicsDataWithCache(this._aniClipIndex,minIndex-1))&& (minIndex > 0)){
					minIndex--;
				}
				if (minIndex < this._clipIndex){
					for (i=minIndex;i < this._clipIndex;i++){
						this._createGraphics(i);
					}
				}
			}
			}else if (this._aniMode==1){
			tGraphics=this._getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
			if (tGraphics){
				if (this.graphics !=tGraphics){
					this.graphics=tGraphics;
				}
				return;
				}else {
				minIndex=this._clipIndex;
				while ((!this._getGrahicsDataWithCache(this._aniClipIndex,minIndex-1))&& (minIndex > 0)){
					minIndex--;
				}
				if (minIndex < this._clipIndex){
					for (i=minIndex;i < this._clipIndex;i++){
						this._createGraphics(i);
					}
				}
			}
		}
		this._createGraphics();
	}

	/**
	*@private
	*清掉播放完成的音频
	*@param force 是否强制删掉所有的声音channel
	*/
	__proto._onAniSoundStoped=function(force){
		var _channel;
		for (var len=this._soundChannelArr.length,i=0;i < len;i++){
			_channel=this._soundChannelArr[i];
			if (_channel.isStopped || force){
				!_channel.isStopped && _channel.stop();
				this._soundChannelArr.splice(i,1);
				len--;i--;
			}
		}
	}

	/**
	*@private
	*创建grahics图像
	*/
	__proto._createGraphics=function(_clipIndex){
		(_clipIndex===void 0)&& (_clipIndex=-1);
		if (_clipIndex==-1)_clipIndex=this._clipIndex;
		var curTime=_clipIndex *this._player.cacheFrameRateInterval;
		var tDrawOrderData;
		var tDrawOrderAniArr=this._templet.drawOrderAniArr;
		var tDrawOrderArr=tDrawOrderAniArr[this._aniClipIndex];
		if (tDrawOrderArr && tDrawOrderArr.length > 0){
			this._drawOrderIndex=0;
			tDrawOrderData=tDrawOrderArr[this._drawOrderIndex];
			while (curTime >=tDrawOrderData.time){
				this._drawOrder=tDrawOrderData.drawOrder;
				this._drawOrderIndex++;
				if (this._drawOrderIndex >=tDrawOrderArr.length){
					break ;
				}
				tDrawOrderData=tDrawOrderArr[this._drawOrderIndex];
			}
		};
		var tGraphics;
		if (this._aniMode==0 || this._aniMode==1){
			this.graphics=GraphicsAni.create();
			}else {
			if ((this.graphics instanceof laya.ani.GraphicsAni )){
				this.graphics.clear();
				}else {
				this.graphics=GraphicsAni.create();
			}
		}
		tGraphics=this.graphics;
		var bones=this._templet.getNodes(this._aniClipIndex);
		this._templet.getOriginalData(this._aniClipIndex,this._curOriginalData,this._player._fullFrames[this._aniClipIndex],_clipIndex,curTime);
		var tSectionArr=this._aniSectionDic[this._aniClipIndex];
		var tParentMatrix;
		var tStartIndex=0;
		var i=0,j=0,k=0,n=0;
		var tDBBoneSlot;
		var tDBBoneSlotArr;
		var tParentTransform;
		var tSrcBone;
		var boneCount=this._templet.srcBoneMatrixArr.length;
		for (i=0,n=tSectionArr[0];i < boneCount;i++){
			tSrcBone=this._boneList[i];
			tParentTransform=this._templet.srcBoneMatrixArr[i];
			tSrcBone.resultTransform.scX=tParentTransform.scX *this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.skX=tParentTransform.skX+this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.skY=tParentTransform.skY+this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.scY=tParentTransform.scY *this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.x=tParentTransform.x+this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.y=tParentTransform.y+this._curOriginalData[tStartIndex++];
			if (this._templet.tMatrixDataLen===8){
				tSrcBone.resultTransform.skewX=tParentTransform.skewX+this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.skewY=tParentTransform.skewY+this._curOriginalData[tStartIndex++];
			}
		};
		var tSlotDic={};
		var tSlotAlphaDic={};
		var tBoneData;
		for (n+=tSectionArr[1];i < n;i++){
			tBoneData=bones[i];
			tSlotDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			tSlotAlphaDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
		};
		var tBendDirectionDic={};
		var tMixDic={};
		for (n+=tSectionArr[2];i < n;i++){
			tBoneData=bones[i];
			tBendDirectionDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			tMixDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
		}
		if (this._pathDic){
			var tPathConstraint;
			for (n+=tSectionArr[3];i < n;i++){
				tBoneData=bones[i];
				tPathConstraint=this._pathDic[tBoneData.name];
				if (tPathConstraint){
					var tByte=new Byte(tBoneData.extenData);
					switch (tByte.getByte()){
						case 1:
							tPathConstraint.position=this._curOriginalData[tStartIndex++];
							break ;
						case 2:
							tPathConstraint.spacing=this._curOriginalData[tStartIndex++];
							break ;
						case 3:
							tPathConstraint.rotateMix=this._curOriginalData[tStartIndex++];
							tPathConstraint.translateMix=this._curOriginalData[tStartIndex++];
							break ;
						}
				}
			}
		}
		if (this._yReverseMatrix){
			this._rootBone.update(this._yReverseMatrix);
			}else {
			this._rootBone.update(Matrix.TEMP.identity());
		}
		if (this._ikArr){
			var tIkConstraint;
			for (i=0,n=this._ikArr.length;i < n;i++){
				tIkConstraint=this._ikArr[i];
				if (tBendDirectionDic.hasOwnProperty(tIkConstraint.name)){
					tIkConstraint.bendDirection=tBendDirectionDic[tIkConstraint.name];
				}
				if (tMixDic.hasOwnProperty(tIkConstraint.name)){
					tIkConstraint.mix=tMixDic[tIkConstraint.name]
				}
				tIkConstraint.apply();
			}
		}
		if (this._pathDic){
			for (var tPathStr in this._pathDic){
				tPathConstraint=this._pathDic[tPathStr];
				tPathConstraint.apply(this._boneList,tGraphics);
			}
		}
		if (this._tfArr){
			var tTfConstraint;
			for (i=0,k=this._tfArr.length;i < k;i++){
				tTfConstraint=this._tfArr[i];
				tTfConstraint.apply();
			}
		}
		for (i=0,k=this._boneList.length;i < k;i++){
			tSrcBone=this._boneList[i];
			tDBBoneSlotArr=this._bindBoneBoneSlotDic[tSrcBone.name];
			tSrcBone.resultMatrix.copyTo(this._boneMatrixArray[i]);
			if (tDBBoneSlotArr){
				for (j=0,n=tDBBoneSlotArr.length;j < n;j++){
					tDBBoneSlot=tDBBoneSlotArr[j];
					if (tDBBoneSlot){
						tDBBoneSlot.setParentMatrix(tSrcBone.resultMatrix);
					}
				}
			}
		};
		var tDeformDic={};
		var tDeformAniArr=this._templet.deformAniArr;
		var tDeformAniData;
		var tDeformSlotData;
		var tDeformSlotDisplayData;
		if (tDeformAniArr && tDeformAniArr.length > 0){
			if (this._lastAniClipIndex !=this._aniClipIndex){
				this._lastAniClipIndex=this._aniClipIndex;
				for (i=0,n=this._boneSlotArray.length;i < n;i++){
					tDBBoneSlot=this._boneSlotArray[i];
					tDBBoneSlot.deformData=null;
				}
			};
			var tSkinDeformAni=tDeformAniArr[this._aniClipIndex];
			tDeformAniData=(tSkinDeformAni["default"]);
			this._setDeform(tDeformAniData,tDeformDic,this._boneSlotArray,curTime);
			var tSkin;
			for (tSkin in tSkinDeformAni){
				if (tSkin !="default" && tSkin !=this._skinName){
					tDeformAniData=tSkinDeformAni [tSkin];
					this._setDeform(tDeformAniData,tDeformDic,this._boneSlotArray,curTime);
				}
			}
			tDeformAniData=(tSkinDeformAni[this._skinName]);
			this._setDeform(tDeformAniData,tDeformDic,this._boneSlotArray,curTime);
		};
		var tSlotData2;
		var tSlotData3;
		var tObject;
		if (this._drawOrder){
			for (i=0,n=this._drawOrder.length;i < n;i++){
				tDBBoneSlot=this._boneSlotArray[this._drawOrder[i]];
				tSlotData2=tSlotDic[tDBBoneSlot.name];
				tSlotData3=tSlotAlphaDic[tDBBoneSlot.name];
				if (!isNaN(tSlotData3)){
					tGraphics.save();
					tGraphics.alpha(tSlotData3);
				}
				if (!isNaN(tSlotData2)&& tSlotData2 !=-2){
					if (this._templet.attachmentNames){
						tDBBoneSlot.showDisplayByName(this._templet.attachmentNames[tSlotData2]);
						}else {
						tDBBoneSlot.showDisplayByIndex(tSlotData2);
					}
				}
				if (tDeformDic[this._drawOrder[i]]){
					tObject=tDeformDic[this._drawOrder[i]];
					if (tDBBoneSlot.currDisplayData && tObject[tDBBoneSlot.currDisplayData.attachmentName]){
						tDBBoneSlot.deformData=tObject[tDBBoneSlot.currDisplayData.attachmentName];
						}else {
						tDBBoneSlot.deformData=null;
					}
					}else {
					tDBBoneSlot.deformData=null;
				}
				if (!isNaN(tSlotData3)){
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2,tSlotData3);
					}else {
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2);
				}
				if (!isNaN(tSlotData3)){
					tGraphics.restore();
				}
			}
			}else {
			for (i=0,n=this._boneSlotArray.length;i < n;i++){
				tDBBoneSlot=this._boneSlotArray[i];
				tSlotData2=tSlotDic[tDBBoneSlot.name];
				tSlotData3=tSlotAlphaDic[tDBBoneSlot.name];
				if (!isNaN(tSlotData3)){
					tGraphics.save();
					tGraphics.alpha(tSlotData3);
				}
				if (!isNaN(tSlotData2)&& tSlotData2 !=-2){
					if (this._templet.attachmentNames){
						tDBBoneSlot.showDisplayByName(this._templet.attachmentNames[tSlotData2]);
						}else {
						tDBBoneSlot.showDisplayByIndex(tSlotData2);
					}
				}
				if (tDeformDic[i]){
					tObject=tDeformDic[i];
					if (tDBBoneSlot.currDisplayData && tObject[tDBBoneSlot.currDisplayData.attachmentName]){
						tDBBoneSlot.deformData=tObject[tDBBoneSlot.currDisplayData.attachmentName];
						}else {
						tDBBoneSlot.deformData=null;
					}
					}else {
					tDBBoneSlot.deformData=null;
				}
				if (!isNaN(tSlotData3)){
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2,tSlotData3);
					}else {
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2);
				}
				if (!isNaN(tSlotData3)){
					tGraphics.restore();
				}
			}
		}
		if (this._aniMode==0){
			this._templet.setGrahicsDataWithCache(this._aniClipIndex,_clipIndex,tGraphics);
			}else if (this._aniMode==1){
			this._setGrahicsDataWithCache(this._aniClipIndex,_clipIndex,tGraphics);
		}
	}

	/**
	*设置deform数据
	*@param tDeformAniData
	*@param tDeformDic
	*@param _boneSlotArray
	*@param curTime
	*/
	__proto._setDeform=function(tDeformAniData,tDeformDic,_boneSlotArray,curTime){
		if (!tDeformAniData)return;
		var tDeformSlotData;
		var tDeformSlotDisplayData;
		var tDBBoneSlot;
		var i=0,n=0,j=0;
		if (tDeformAniData){
			for (i=0,n=tDeformAniData.deformSlotDataList.length;i < n;i++){
				tDeformSlotData=tDeformAniData.deformSlotDataList[i];
				for (j=0;j < tDeformSlotData.deformSlotDisplayList.length;j++){
					tDeformSlotDisplayData=tDeformSlotData.deformSlotDisplayList[j];
					tDBBoneSlot=_boneSlotArray[tDeformSlotDisplayData.slotIndex];
					tDeformSlotDisplayData.apply(curTime,tDBBoneSlot);
					if (!tDeformDic[tDeformSlotDisplayData.slotIndex]){
						tDeformDic[tDeformSlotDisplayData.slotIndex]={};
					}
					tDeformDic[tDeformSlotDisplayData.slotIndex][tDeformSlotDisplayData.attachment]=tDeformSlotDisplayData.deformData;
				}
			}
		}
	}

	/**
	*得到当前动画的数量
	*@return 当前动画的数量
	*/
	__proto.getAnimNum=function(){
		return this._templet.getAnimationCount();
	}

	/**
	*得到指定动画的名字
	*@param index 动画的索引
	*/
	__proto.getAniNameByIndex=function(index){
		return this._templet.getAniNameByIndex(index);
	}

	/**
	*通过名字得到插槽的引用
	*@param name 动画的名字
	*@return 插槽的引用
	*/
	__proto.getSlotByName=function(name){
		return this._boneSlotDic[name];
	}

	/**
	*通过名字显示一套皮肤
	*@param name 皮肤的名字
	*@param freshSlotIndex 是否将插槽纹理重置到初始化状态
	*/
	__proto.showSkinByName=function(name,freshSlotIndex){
		(freshSlotIndex===void 0)&& (freshSlotIndex=true);
		this.showSkinByIndex(this._templet.getSkinIndexByName(name),freshSlotIndex);
	}

	/**
	*通过索引显示一套皮肤
	*@param skinIndex 皮肤索引
	*@param freshSlotIndex 是否将插槽纹理重置到初始化状态
	*/
	__proto.showSkinByIndex=function(skinIndex,freshSlotIndex){
		(freshSlotIndex===void 0)&& (freshSlotIndex=true);
		for (var i=0;i < this._boneSlotArray.length;i++){
			(this._boneSlotArray [i]).showSlotData(null,freshSlotIndex);
		}
		if (this._templet.showSkinByIndex(this._boneSlotDic,skinIndex,freshSlotIndex)){
			var tSkinData=this._templet.skinDataArray[skinIndex];
			this._skinIndex=skinIndex;
			this._skinName=tSkinData.name;
		}
		this._clearCache();
	}

	/**
	*设置某插槽的皮肤
	*@param slotName 插槽名称
	*@param index 插糟皮肤的索引
	*/
	__proto.showSlotSkinByIndex=function(slotName,index){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.showDisplayByIndex(index);
		}
		this._clearCache();
	}

	/**
	*设置某插槽的皮肤
	*@param slotName 插槽名称
	*@param name 皮肤名称
	*/
	__proto.showSlotSkinByName=function(slotName,name){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.showDisplayByName(name);
		}
		this._clearCache();
	}

	/**
	*替换插槽贴图名
	*@param slotName 插槽名称
	*@param oldName 要替换的贴图名
	*@param newName 替换后的贴图名
	*/
	__proto.replaceSlotSkinName=function(slotName,oldName,newName){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.replaceDisplayByName(oldName,newName);
		}
		this._clearCache();
	}

	/**
	*替换插槽的贴图索引
	*@param slotName 插槽名称
	*@param oldIndex 要替换的索引
	*@param newIndex 替换后的索引
	*/
	__proto.replaceSlotSkinByIndex=function(slotName,oldIndex,newIndex){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.replaceDisplayByIndex(oldIndex,newIndex);
		}
		this._clearCache();
	}

	/**
	*设置自定义皮肤
	*@param name 插糟的名字
	*@param texture 自定义的纹理
	*/
	__proto.setSlotSkin=function(slotName,texture){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.replaceSkin(texture);
		}
		this._clearCache();
	}

	/**
	*换装的时候，需要清一下缓冲区
	*/
	__proto._clearCache=function(){
		if (this._aniMode==1){
			for (var i=0,n=this._graphicsCache.length;i < n;i++){
				for (var j=0,len=this._graphicsCache[i].length;j < len;j++){
					var gp=this._graphicsCache[i][j];
					if (gp !=this.graphics){
						GraphicsAni.recycle(gp);
					}
				}
				this._graphicsCache[i].length=0;
			}
		}
	}

	/**
	*播放动画
	*
	*@param nameOrIndex 动画名字或者索引
	*@param loop 是否循环播放
	*@param force false,如果要播的动画跟上一个相同就不生效,true,强制生效
	*@param start 起始时间
	*@param end 结束时间
	*@param freshSkin 是否刷新皮肤数据
	*@param playAudio 是否播放音频
	*/
	__proto.play=function(nameOrIndex,loop,force,start,end,freshSkin,playAudio){
		(force===void 0)&& (force=true);
		(start===void 0)&& (start=0);
		(end===void 0)&& (end=0);
		(freshSkin===void 0)&& (freshSkin=true);
		(playAudio===void 0)&& (playAudio=true);
		this._playAudio=playAudio;
		this._indexControl=false;
		var index=-1;
		var duration=NaN;
		if (loop){
			duration=2147483647;
			}else {
			duration=0;
		}
		if ((typeof nameOrIndex=='string')){
			for (var i=0,n=this._templet.getAnimationCount();i < n;i++){
				var animation=this._templet.getAnimation(i);
				if (animation && nameOrIndex==animation.name){
					index=i;
					break ;
				}
			}
			}else {
			index=nameOrIndex;
		}
		if (index >-1 && index < this.getAnimNum()){
			this._aniClipIndex=index;
			if (force || this._pause || this._currAniIndex !=index){
				this._currAniIndex=index;
				this._curOriginalData=new Float32Array(this._templet.getTotalkeyframesLength(index));
				this._drawOrder=null;
				this._eventIndex=0;
				this._player.play(index,this._player.playbackRate,duration,start,end);
				if (freshSkin)
					this._templet.showSkinByIndex(this._boneSlotDic,this._skinIndex);
				if (this._pause){
					this._pause=false;
					this._lastTime=Browser.now();
					this.timer.frameLoop(1,this,this._update,null,true);
				}
				this._update();
			}
		}
	}

	/**
	*停止动画
	*/
	__proto.stop=function(){
		if (!this._pause){
			this._pause=true;
			if (this._player){
				this._player.stop(true);
			}
			if (this._soundChannelArr.length > 0){
				this._onAniSoundStoped(true);
			}
			this.timer.clear(this,this._update);
		}
	}

	/**
	*设置动画播放速率
	*@param value 1为标准速率
	*/
	__proto.playbackRate=function(value){
		if (this._player){
			this._player.playbackRate=value;
		}
	}

	/**
	*暂停动画的播放
	*/
	__proto.paused=function(){
		if (!this._pause){
			this._pause=true;
			if (this._player){
				this._player.paused=true;
			}
			if (this._soundChannelArr.length > 0){
				var _soundChannel;
				for (var len=this._soundChannelArr.length,i=0;i < len;i++){
					_soundChannel=this._soundChannelArr[i];
					if (!_soundChannel.isStopped){
						_soundChannel.pause();
					}
				}
			}
			this.timer.clear(this,this._update);
		}
	}

	/**
	*恢复动画的播放
	*/
	__proto.resume=function(){
		this._indexControl=false;
		if (this._pause){
			this._pause=false;
			if (this._player){
				this._player.paused=false;
			}
			if (this._soundChannelArr.length > 0){
				var _soundChannel;
				for (var len=this._soundChannelArr.length,i=0;i < len;i++){
					_soundChannel=this._soundChannelArr[i];
					if (_soundChannel.audioBuffer){
						_soundChannel.resume();
					}
				}
			}
			this._lastTime=Browser.now();
			this.timer.frameLoop(1,this,this._update,null,true);
		}
	}

	/**
	*@private
	*得到缓冲数据
	*@param aniIndex
	*@param frameIndex
	*@return
	*/
	__proto._getGrahicsDataWithCache=function(aniIndex,frameIndex){
		return this._graphicsCache[aniIndex][frameIndex];
	}

	/**
	*@private
	*保存缓冲grahpics
	*@param aniIndex
	*@param frameIndex
	*@param graphics
	*/
	__proto._setGrahicsDataWithCache=function(aniIndex,frameIndex,graphics){
		this._graphicsCache[aniIndex][frameIndex]=graphics;
	}

	/**
	*销毁当前动画
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._templet=null;
		if (this._player)this._player.offAll();
		this._player=null;
		this._curOriginalData=null;
		this._boneMatrixArray.length=0;
		this._lastTime=0;
		this.timer.clear(this,this._update);
		if (this._soundChannelArr.length > 0){
			this._onAniSoundStoped(true);
		}
	}

	/**
	*设置动画路径
	*/
	/**
	*得到资源的URL
	*/
	__getset(0,__proto,'url',function(){
		return this._aniPath;
		},function(path){
		this.load(path);
	});

	/**
	*@private
	*设置帧索引
	*/
	/**
	*@private
	*得到帧索引
	*/
	__getset(0,__proto,'index',function(){
		return this._index;
		},function(value){
		if (this.player){
			this._index=value;
			this._player.currentTime=this._index *1000 / this._player.cacheFrameRate;
			this._indexControl=true;
			this._update(false);
		}
	});

	/**
	*得到总帧数据
	*/
	__getset(0,__proto,'total',function(){
		if (this._templet && this._player){
			this._total=Math.floor(this._templet.getAniDuration(this._player.currentAnimationClipIndex)/ 1000 *this._player.cacheFrameRate);
			}else {
			this._total=-1;
		}
		return this._total;
	});

	/**
	*得到动画模板的引用
	*/
	__getset(0,__proto,'templet',function(){
		return this._templet;
	});

	/**
	*得到播放器的引用
	*/
	__getset(0,__proto,'player',function(){
		return this._player;
	});

	Skeleton.useSimpleMeshInCanvas=false;
	return Skeleton;
})(Sprite)


/**
*<p> <code>MovieClip</code> 用于播放经过工具处理后的 swf 动画。</p>
*/
//class laya.ani.swf.MovieClip extends laya.display.Sprite
var MovieClip=(function(_super){
	function MovieClip(parentMovieClip){
		/**@private 数据起始位置。*/
		this._start=0;
		/**@private 当前位置。*/
		this._Pos=0;
		/**@private 数据。*/
		this._data=null;
		/**@private */
		this._curIndex=0;
		/**@private */
		this._preIndex=0;
		/**@private */
		this._playIndex=0;
		/**@private */
		this._playing=false;
		/**@private */
		this._ended=true;
		/**@private 总帧数。*/
		this._count=0;
		/**@private id_data起始位置表*/
		this._ids=null;
		/**@private */
		this._loadedImage={};
		/**@private id_实例表*/
		this._idOfSprite=null;
		/**@private 父mc*/
		this._parentMovieClip=null;
		/**@private 需要更新的movieClip表*/
		this._movieClipList=null;
		/**@private */
		this._labels=null;
		/**资源根目录。*/
		this.basePath=null;
		/**@private */
		this._atlasPath=null;
		/**@private */
		this._url=null;
		/**@private */
		this._isRoot=false;
		/**@private */
		this._completeHandler=null;
		/**@private */
		this._endFrame=-1;
		/**播放间隔(单位：毫秒)。*/
		this.interval=30;
		/**是否循环播放 */
		this.loop=false;
		MovieClip.__super.call(this);
		this._ids={};
		this._idOfSprite=[];
		this._reset();
		this._playing=false;
		this._parentMovieClip=parentMovieClip;
		if (!parentMovieClip){
			this._movieClipList=[this];
			this._isRoot=true;
			this._setUpNoticeType(/*laya.display.Node.NOTICE_DISPLAY*/0x1);
			}else {
			this._isRoot=false;
			this._movieClipList=parentMovieClip._movieClipList;
			this._movieClipList.push(this);
		}
	}

	__class(MovieClip,'laya.ani.swf.MovieClip',_super);
	var __proto=MovieClip.prototype;
	/**
	*<p>销毁此对象。以及销毁引用的Texture</p>
	*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._clear();
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**@private */
	__proto._setDisplay=function(value){
		_super.prototype._setDisplay.call(this,value);
		if (this._isRoot){
			this._$3__onDisplay(value);
		}
	}

	/**@private */
	__proto._$3__onDisplay=function(value){
		if (value)this.timer.loop(this.interval,this,this.updates,null,true);
		else this.timer.clear(this,this.updates);
	}

	/**@private 更新时间轴*/
	__proto.updates=function(){
		if (this._parentMovieClip)return;
		var i=0,len=0;
		len=this._movieClipList.length;
		for (i=0;i < len;i++){
			this._movieClipList[i]&&this._movieClipList[i]._update();
		}
	}

	/**
	*增加一个标签到index帧上，播放到此index后会派发label事件
	*@param label 标签名称
	*@param index 索引位置
	*/
	__proto.addLabel=function(label,index){
		if (!this._labels)this._labels={};
		this._labels[index]=label;
	}

	/**
	*删除某个标签
	*@param label 标签名字，如果label为空，则删除所有Label
	*/
	__proto.removeLabel=function(label){
		if (!label)this._labels=null;
		else if (!this._labels){
			for (var name in this._labels){
				if (this._labels[name]===label){
					delete this._labels[name];
					break ;
				}
			}
		}
	}

	/**
	*@private
	*动画的帧更新处理函数。
	*/
	__proto._update=function(){
		if (!this._data)return;
		if (!this._playing)return;
		this._playIndex++;
		if (this._playIndex >=this._count){
			if (!this.loop){
				this._playIndex--;
				this.stop();
				return;
			}
			this._playIndex=0;
		}
		this._parse(this._playIndex);
		if (this._labels && this._labels[this._playIndex])this.event(/*laya.events.Event.LABEL*/"label",this._labels[this._playIndex]);
		if (this._endFrame!=-1&&this._endFrame==this._playIndex){
			this._endFrame=-1;
			if (this._completeHandler !=null){
				var handler=this._completeHandler;
				this._completeHandler=null;
				handler.run();
			}
			this.stop();
		}
	}

	/**
	*停止播放动画。
	*/
	__proto.stop=function(){
		this._playing=false;
	}

	/**
	*跳到某帧并停止播放动画。
	*@param frame 要跳到的帧
	*/
	__proto.gotoAndStop=function(index){
		this.index=index;
		this.stop();
	}

	/**
	*@private
	*清理。
	*/
	__proto._clear=function(){
		this.stop();
		this._idOfSprite.length=0;
		if (!this._parentMovieClip){
			this.timer.clear(this,this.updates);
			var i=0,len=0;
			len=this._movieClipList.length;
			for (i=0;i < len;i++){
				if (this._movieClipList[i] !=this)
					this._movieClipList[i]._clear();
			}
			this._movieClipList.length=0;
		}
		if (this._atlasPath){
			Loader.clearRes(this._atlasPath);
		};
		var key;
		for (key in this._loadedImage){
			if (this._loadedImage[key]){
				Loader.clearRes(key);
				this._loadedImage[key]=false;
			}
		}
		this.removeChildren();
		this.graphics=null;
		this._parentMovieClip=null;
	}

	/**
	*播放动画。
	*@param index 帧索引。
	*/
	__proto.play=function(index,loop){
		(index===void 0)&& (index=0);
		(loop===void 0)&& (loop=true);
		this.loop=loop;
		this._playing=true;
		if (this._data)
			this._displayFrame(index);
	}

	/**@private */
	__proto._displayFrame=function(frameIndex){
		(frameIndex===void 0)&& (frameIndex=-1);
		if (frameIndex !=-1){
			if (this._curIndex > frameIndex)this._reset();
			this._parse(frameIndex);
		}
	}

	/**@private */
	__proto._reset=function(rm){
		(rm===void 0)&& (rm=true);
		if (rm && this._curIndex !=1)this.removeChildren();
		this._preIndex=this._curIndex=-1;
		this._Pos=this._start;
	}

	/**@private */
	__proto._parse=function(frameIndex){
		var curChild=this;
		var mc,sp,key=0,type=0,tPos=0,ttype=0,ifAdd=false;
		var _idOfSprite=this._idOfSprite,_data=this._data,eStr;
		if (this._ended)this._reset();
		_data.pos=this._Pos;
		this._ended=false;
		this._playIndex=frameIndex;
		if (this._curIndex > frameIndex&&frameIndex<this._preIndex){
			this._reset(true);
			_data.pos=this._Pos;
		}
		while ((this._curIndex <=frameIndex)&& (!this._ended)){
			type=_data.getUint16();
			switch (type){
				case 12:
					key=_data.getUint16();
					tPos=this._ids[_data.getUint16()];
					this._Pos=_data.pos;
					_data.pos=tPos;
					if ((ttype=_data.getUint8())==0){
						var pid=_data.getUint16();
						sp=_idOfSprite[key]
						if (!sp){
							sp=_idOfSprite[key]=new Sprite();
							var spp=new Sprite();
							spp.loadImage(this.basePath+pid+".png");
							this._loadedImage[this.basePath+pid+".png"]=true;
							sp.addChild(spp);
							spp.size(_data.getFloat32(),_data.getFloat32());
							var mat=_data._getMatrix();
							spp.transform=mat;
						}
						sp.alpha=1;
						}else if (ttype==1){
						mc=_idOfSprite[key]
						if (!mc){
							_idOfSprite[key]=mc=new MovieClip(this);
							mc.interval=this.interval;
							mc._ids=this._ids;
							mc.basePath=this.basePath;
							mc._setData(_data,tPos);
							mc._initState();
							mc.play(0);
						}
						mc.alpha=1;
					}
					_data.pos=this._Pos;
					break ;
				case 3:;
					var node=_idOfSprite[ _data.getUint16()];
					if (node){
						this.addChild(node);
						node.zOrder=_data.getUint16();
						ifAdd=true;
					}
					break ;
				case 4:
					node=_idOfSprite[ _data.getUint16()];
					node && node.removeSelf();
					break ;
				case 5:
					_idOfSprite[_data.getUint16()][MovieClip._ValueList[_data.getUint16()]]=(_data.getFloat32());
					break ;
				case 6:
					_idOfSprite[_data.getUint16()].visible=(_data.getUint8()> 0);
					break ;
				case 7:
					sp=_idOfSprite[ _data.getUint16()];
					var mt=sp.transform || Matrix.create();
					mt.setTo(_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32());
					sp.transform=mt;
					break ;
				case 8:
					_idOfSprite[_data.getUint16()].setPos(_data.getFloat32(),_data.getFloat32());
					break ;
				case 9:
					_idOfSprite[_data.getUint16()].setSize(_data.getFloat32(),_data.getFloat32());
					break ;
				case 10:
					_idOfSprite[ _data.getUint16()].alpha=_data.getFloat32();
					break ;
				case 11:
					_idOfSprite[_data.getUint16()].setScale(_data.getFloat32(),_data.getFloat32());
					break ;
				case 98:
					eStr=_data.getString();
					this.event(eStr);
					if (eStr=="stop")this.stop();
					break ;
				case 99:
					this._curIndex=_data.getUint16();
					ifAdd && this.updateZOrder();
					break ;
				case 100:
					this._count=this._curIndex+1;
					this._ended=true;
					if (this._playing){
						this.event(/*laya.events.Event.FRAME*/"enterframe");
						this.event(/*laya.events.Event.END*/"end");
						this.event(/*laya.events.Event.COMPLETE*/"complete");
					}
					this._reset(false);
					break ;
				}
		}
		if (this._playing&&!this._ended)this.event(/*laya.events.Event.FRAME*/"enterframe");
		this._Pos=_data.pos;
	}

	/**@private */
	__proto._setData=function(data,start){
		this._data=data;
		this._start=start+3;
	}

	/**
	*加载资源。
	*@param url swf 资源地址。
	*@param atlas 是否使用图集资源
	*@param atlasPath 图集路径，默认使用与swf同名的图集
	*/
	__proto.load=function(url,atlas,atlasPath){
		(atlas===void 0)&& (atlas=false);
		this._url=url;
		if(atlas)this._atlasPath=atlasPath?atlasPath:url.split(".swf")[0]+".json";
		this.stop();
		this._clear();
		this._movieClipList=[this];
		var urls;
		urls=[ {url:url,type:/*laya.net.Loader.BUFFER*/"arraybuffer" }];
		if (this._atlasPath){
			urls.push({url:this._atlasPath,type:/*laya.net.Loader.ATLAS*/"atlas" });
		}
		Laya.loader.load(urls,Handler.create(this,this._onLoaded));
	}

	/**@private */
	__proto._onLoaded=function(){
		var data;
		data=Loader.getRes(this._url);
		if (!data){
			this.event(/*laya.events.Event.ERROR*/"error","file not find");
			return;
		}
		if (this._atlasPath && !Loader.getAtlas(this._atlasPath)){
			this.event(/*laya.events.Event.ERROR*/"error","Atlas not find");
			return;
		}
		this.basePath=this._atlasPath?Loader.getAtlas(this._atlasPath).dir:this._url.split(".swf")[0]+"/image/";
		this._initData(data);
	}

	/**@private */
	__proto._initState=function(){
		this._reset();
		this._ended=false;
		var preState=this._playing;
		this._playing=false;
		this._curIndex=0;
		while (!this._ended)this._parse(++this._curIndex);
		this._playing=preState;
	}

	/**@private */
	__proto._initData=function(data){
		this._data=new Byte(data);
		var i=0,len=this._data.getUint16();
		for (i=0;i < len;i++)this._ids[this._data.getInt16()]=this._data.getInt32();
		this.interval=1000 / this._data.getUint16();
		this._setData(this._data,this._ids[32767]);
		this._initState();
		this.play(0);
		this.event(/*laya.events.Event.LOADED*/"loaded");
		if (!this._parentMovieClip)this.timer.loop(this.interval,this,this.updates,null,true);
	}

	/**
	*从开始索引播放到结束索引，结束之后出发complete回调
	*@param start 开始索引
	*@param end 结束索引
	*@param complete 结束回调
	*/
	__proto.playTo=function(start,end,complete){
		this._completeHandler=complete;
		this._endFrame=end;
		this.play(start,false);
	}

	/**当前播放索引。*/
	__getset(0,__proto,'index',function(){
		return this._playIndex;
		},function(value){
		this._playIndex=value;
		if (this._data)
			this._displayFrame(this._playIndex);
		if (this._labels && this._labels[value])this.event(/*laya.events.Event.LABEL*/"label",this._labels[value]);
	});

	/**
	*帧总数。
	*/
	__getset(0,__proto,'count',function(){
		return this._count;
	});

	/**
	*是否在播放中
	*/
	__getset(0,__proto,'playing',function(){
		return this._playing;
	});

	/**
	*资源地址。
	*/
	__getset(0,__proto,'url',null,function(path){
		this.load(path);
	});

	MovieClip._ValueList=["x","y","width","height","scaleX","scaleY","rotation","alpha"];
	return MovieClip;
})(Sprite)


/**
*动画模板类
*/
//class laya.ani.bone.Templet extends laya.ani.AnimationTemplet
var Templet=(function(_super){
	function Templet(){
		this._mainTexture=null;
		this._textureJson=null;
		this._graphicsCache=[];
		/**存放原始骨骼信息 */
		this.srcBoneMatrixArr=[];
		/**IK数据 */
		this.ikArr=[];
		/**transform数据 */
		this.tfArr=[];
		/**path数据 */
		this.pathArr=[];
		/**存放插槽数据的字典 */
		this.boneSlotDic={};
		/**绑定插槽数据的字典 */
		this.bindBoneBoneSlotDic={};
		/**存放插糟数据的数组 */
		this.boneSlotArray=[];
		/**皮肤数据 */
		this.skinDataArray=[];
		/**皮肤的字典数据 */
		this.skinDic={};
		/**存放纹理数据 */
		this.subTextureDic={};
		/**是否解析失败 */
		this.isParseFail=false;
		/**反转矩阵，有些骨骼动画要反转才能显示 */
		this.yReverseMatrix=null;
		/**渲染顺序动画数据 */
		this.drawOrderAniArr=[];
		/**事件动画数据 */
		this.eventAniArr=[];
		/**@private 索引对应的名称 */
		this.attachmentNames=null;
		/**顶点动画数据 */
		this.deformAniArr=[];
		/**是否需要解析audio数据 */
		this._isParseAudio=false;
		this._isDestroyed=false;
		this._rate=30;
		this.isParserComplete=false;
		this.aniSectionDic={};
		this._skBufferUrl=null;
		this._textureDic={};
		this._loadList=null;
		this._path=null;
		/**@private */
		this.tMatrixDataLen=0;
		this.mRootBone=null;
		Templet.__super.call(this);
		this.skinSlotDisplayDataArr=[];
		this.mBoneArr=[];
	}

	__class(Templet,'laya.ani.bone.Templet',_super);
	var __proto=Templet.prototype;
	__proto.loadAni=function(url){
		this._skBufferUrl=url;
		Laya.loader.load(url,Handler.create(this,this.onComplete),null,/*laya.net.Loader.BUFFER*/"arraybuffer");
	}

	__proto.onComplete=function(content){
		if (this._isDestroyed){
			this.destroy();
			return;
		};
		var tSkBuffer=Loader.getRes(this._skBufferUrl);
		if (!tSkBuffer){
			this.event(/*laya.events.Event.ERROR*/"error","load failed:"+this._skBufferUrl);
			return;
		}
		this._path=this._skBufferUrl.slice(0,this._skBufferUrl.lastIndexOf("/"))+"/";
		this.parseData(null,tSkBuffer);
	}

	/**
	*解析骨骼动画数据
	*@param texture 骨骼动画用到的纹理
	*@param skeletonData 骨骼动画信息及纹理分块信息
	*@param playbackRate 缓冲的帧率数据（会根据帧率去分帧）
	*/
	__proto.parseData=function(texture,skeletonData,playbackRate){
		(playbackRate===void 0)&& (playbackRate=30);
		if(!this._path&&this.url)this._path=this.url.slice(0,this.url.lastIndexOf("/"))+"/";
		this._mainTexture=texture;
		if (this._mainTexture){
			if (Render.isWebGL && texture.bitmap){
				texture.bitmap.enableMerageInAtlas=false;
			}
		}
		this._rate=playbackRate;
		this.parse(skeletonData);
	}

	/**
	*创建动画
	*0,使用模板缓冲的数据，模板缓冲的数据，不允许修改 （内存开销小，计算开销小，不支持换装）
	*1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装）
	*2,使用动态方式，去实时去画 （内存开销小，计算开销大，支持换装,不建议使用）
	*@param aniMode 0 动画模式，0:不支持换装,1,2支持换装
	*@return
	*/
	__proto.buildArmature=function(aniMode){
		(aniMode===void 0)&& (aniMode=0);
		return new Skeleton(this,aniMode);
	}

	/**
	*@private
	*解析动画
	*@param data 解析的二进制数据
	*@param playbackRate 帧率
	*/
	__proto.parse=function(data){
		_super.prototype.parse.call(this,data);
		this._endLoaded();
		if (this._aniVersion===Templet.LAYA_ANIMATION_VISION){
			this._isParseAudio=true;
			}else if (this._aniVersion !=Templet.LAYA_ANIMATION_160_VISION){
			console.log("[Error] 版本不一致，请使用IDE版本配套的重新导出"+this._aniVersion+"->"+Templet.LAYA_ANIMATION_VISION);
			this._loaded=false;
		}
		if (this.loaded){
			if (this._mainTexture){
				this._parsePublicExtData();
				}else {
				this._parseTexturePath();
			}
			}else {
			this.event(/*laya.events.Event.ERROR*/"error",this);
			this.isParseFail=true;
		}
	}

	__proto._parseTexturePath=function(){
		if (this._isDestroyed){
			this.destroy();
			return;
		};
		var i=0;
		this._loadList=[];
		var tByte=new Byte(this.getPublicExtData());
		var tX=0,tY=0,tWidth=0,tHeight=0;
		var tFrameX=0,tFrameY=0,tFrameWidth=0,tFrameHeight=0;
		var tTempleData=0;
		var tTextureLen=tByte.getInt32();
		var tTextureName=tByte.readUTFString();
		var tTextureNameArr=tTextureName.split("\n");
		var tTexture;
		var tSrcTexturePath;
		for (i=0;i < tTextureLen;i++){
			tSrcTexturePath=this._path+tTextureNameArr[i *2];
			tTextureName=tTextureNameArr[i *2+1];
			tX=tByte.getFloat32();
			tY=tByte.getFloat32();
			tWidth=tByte.getFloat32();
			tHeight=tByte.getFloat32();
			tTempleData=tByte.getFloat32();
			tFrameX=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameY=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameWidth=isNaN(tTempleData)? tWidth :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameHeight=isNaN(tTempleData)? tHeight :tTempleData;
			if (this._loadList.indexOf(tSrcTexturePath)==-1){
				this._loadList.push(tSrcTexturePath);
			}
		}
		Laya.loader.load(this._loadList,Handler.create(this,this._textureComplete));
	}

	/**
	*纹理加载完成
	*/
	__proto._textureComplete=function(){
		var tTexture;
		var tTextureName;
		for (var i=0,n=this._loadList.length;i < n;i++){
			tTextureName=this._loadList[i];
			tTexture=this._textureDic[tTextureName]=Loader.getRes(tTextureName);
			if (Render.isWebGL && tTexture && tTexture.bitmap){
				tTexture.bitmap.enableMerageInAtlas=false;
			}
		}
		this._parsePublicExtData();
	}

	/**
	*解析自定义数据
	*/
	__proto._parsePublicExtData=function(){
		var i=0,j=0,k=0,l=0,n=0;
		for (i=0,n=this.getAnimationCount();i < n;i++){
			this._graphicsCache.push([]);
		};
		var isSpine=false;
		isSpine=this._aniClassName !="Dragon";
		var tByte=new Byte(this.getPublicExtData());
		var tX=0,tY=0,tWidth=0,tHeight=0;
		var tFrameX=0,tFrameY=0,tFrameWidth=0,tFrameHeight=0;
		var tTempleData=0;
		var tTextureLen=tByte.getInt32();
		var tTextureName=tByte.readUTFString();
		var tTextureNameArr=tTextureName.split("\n");
		var tTexture;
		var tSrcTexturePath;
		for (i=0;i < tTextureLen;i++){
			tTexture=this._mainTexture;
			tSrcTexturePath=this._path+tTextureNameArr[i *2];
			tTextureName=tTextureNameArr[i *2+1];
			if (this._mainTexture==null){
				tTexture=this._textureDic[tSrcTexturePath];
			}
			if (!tTexture){
				this.event(/*laya.events.Event.ERROR*/"error",this);
				this.isParseFail=true;
				return;
			}
			tX=tByte.getFloat32();
			tY=tByte.getFloat32();
			tWidth=tByte.getFloat32();
			tHeight=tByte.getFloat32();
			tTempleData=tByte.getFloat32();
			tFrameX=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameY=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameWidth=isNaN(tTempleData)? tWidth :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameHeight=isNaN(tTempleData)? tHeight :tTempleData;
			this.subTextureDic[tTextureName]=Texture.create(tTexture,tX,tY,tWidth,tHeight,-tFrameX,-tFrameY,tFrameWidth,tFrameHeight);
		}
		this._mainTexture=tTexture;
		var tAniCount=tByte.getUint16();
		var tSectionArr;
		for (i=0;i < tAniCount;i++){
			tSectionArr=[];
			tSectionArr.push(tByte.getUint16());
			tSectionArr.push(tByte.getUint16());
			tSectionArr.push(tByte.getUint16());
			tSectionArr.push(tByte.getUint16());
			this.aniSectionDic[i]=tSectionArr;
		};
		var tBone;
		var tParentBone;
		var tName;
		var tParentName;
		var tBoneLen=tByte.getInt16();
		var tBoneDic={};
		var tRootBone;
		for (i=0;i < tBoneLen;i++){
			tBone=new Bone();
			if (i==0){
				tRootBone=tBone;
				}else {
				tBone.root=tRootBone;
			}
			tBone.d=isSpine?-1:1;
			tName=tByte.readUTFString();
			tParentName=tByte.readUTFString();
			tBone.length=tByte.getFloat32();
			if (tByte.getByte()==1){
				tBone.inheritRotation=false;
			}
			if (tByte.getByte()==1){
				tBone.inheritScale=false;
			}
			tBone.name=tName;
			if (tParentName){
				tParentBone=tBoneDic[tParentName];
				if (tParentBone){
					tParentBone.addChild(tBone);
					}else {
					this.mRootBone=tBone;
				}
			}
			tBoneDic[tName]=tBone;
			this.mBoneArr.push(tBone);
		}
		this.tMatrixDataLen=tByte.getUint16();
		var tLen=tByte.getUint16();
		var parentIndex=0;
		var boneLength=Math.floor(tLen / this.tMatrixDataLen);
		var tResultTransform;
		var tMatrixArray=this.srcBoneMatrixArr;
		for (i=0;i < boneLength;i++){
			tResultTransform=new Transform();
			tResultTransform.scX=tByte.getFloat32();
			tResultTransform.skX=tByte.getFloat32();
			tResultTransform.skY=tByte.getFloat32();
			tResultTransform.scY=tByte.getFloat32();
			tResultTransform.x=tByte.getFloat32();
			tResultTransform.y=tByte.getFloat32();
			if (this.tMatrixDataLen===8){
				tResultTransform.skewX=tByte.getFloat32();
				tResultTransform.skewY=tByte.getFloat32();
			}
			tMatrixArray.push(tResultTransform);
			tBone=this.mBoneArr[i];
			tBone.transform=tResultTransform;
		};
		var tIkConstraintData;
		var tIkLen=tByte.getUint16();
		var tIkBoneLen=0;
		for (i=0;i < tIkLen;i++){
			tIkConstraintData=new IkConstraintData();
			tIkBoneLen=tByte.getUint16();
			for (j=0;j < tIkBoneLen;j++){
				tIkConstraintData.boneNames.push(tByte.readUTFString());
				tIkConstraintData.boneIndexs.push(tByte.getInt16());
			}
			tIkConstraintData.name=tByte.readUTFString();
			tIkConstraintData.targetBoneName=tByte.readUTFString();
			tIkConstraintData.targetBoneIndex=tByte.getInt16();
			tIkConstraintData.bendDirection=tByte.getFloat32();
			tIkConstraintData.mix=tByte.getFloat32();
			tIkConstraintData.isSpine=isSpine;
			this.ikArr.push(tIkConstraintData);
		};
		var tTfConstraintData;
		var tTfLen=tByte.getUint16();
		var tTfBoneLen=0;
		for (i=0;i < tTfLen;i++){
			tTfConstraintData=new TfConstraintData();
			tTfBoneLen=tByte.getUint16();
			for (j=0;j < tTfBoneLen;j++){
				tTfConstraintData.boneIndexs.push(tByte.getInt16());
			}
			tTfConstraintData.name=tByte.getUTFString();
			tTfConstraintData.targetIndex=tByte.getInt16();
			tTfConstraintData.rotateMix=tByte.getFloat32();
			tTfConstraintData.translateMix=tByte.getFloat32();
			tTfConstraintData.scaleMix=tByte.getFloat32();
			tTfConstraintData.shearMix=tByte.getFloat32();
			tTfConstraintData.offsetRotation=tByte.getFloat32();
			tTfConstraintData.offsetX=tByte.getFloat32();
			tTfConstraintData.offsetY=tByte.getFloat32();
			tTfConstraintData.offsetScaleX=tByte.getFloat32();
			tTfConstraintData.offsetScaleY=tByte.getFloat32();
			tTfConstraintData.offsetShearY=tByte.getFloat32();
			this.tfArr.push(tTfConstraintData);
		};
		var tPathConstraintData;
		var tPathLen=tByte.getUint16();
		var tPathBoneLen=0;
		for (i=0;i < tPathLen;i++){
			tPathConstraintData=new PathConstraintData();
			tPathConstraintData.name=tByte.readUTFString();
			tPathBoneLen=tByte.getUint16();
			for (j=0;j < tPathBoneLen;j++){
				tPathConstraintData.bones.push(tByte.getInt16());
			}
			tPathConstraintData.target=tByte.readUTFString();
			tPathConstraintData.positionMode=tByte.readUTFString();
			tPathConstraintData.spacingMode=tByte.readUTFString();
			tPathConstraintData.rotateMode=tByte.readUTFString();
			tPathConstraintData.offsetRotation=tByte.getFloat32();
			tPathConstraintData.position=tByte.getFloat32();
			tPathConstraintData.spacing=tByte.getFloat32();
			tPathConstraintData.rotateMix=tByte.getFloat32();
			tPathConstraintData.translateMix=tByte.getFloat32();
			this.pathArr.push(tPathConstraintData);
		};
		var tDeformSlotLen=0;
		var tDeformSlotDisplayLen=0;
		var tDSlotIndex=0;
		var tDAttachment;
		var tDeformTimeLen=0;
		var tDTime=NaN;
		var tDeformVecticesLen=0;
		var tDeformAniData;
		var tDeformSlotData;
		var tDeformSlotDisplayData;
		var tDeformVectices;
		var tDeformAniLen=tByte.getInt16();
		for (i=0;i < tDeformAniLen;i++){
			var tDeformSkinLen=tByte.getUint8();
			var tSkinDic={};
			this.deformAniArr.push(tSkinDic);
			for (var f=0;f < tDeformSkinLen;f++){
				tDeformAniData=new DeformAniData();
				tDeformAniData.skinName=tByte.getUTFString();
				tSkinDic[tDeformAniData.skinName]=tDeformAniData;
				tDeformSlotLen=tByte.getInt16();
				for (j=0;j < tDeformSlotLen;j++){
					tDeformSlotData=new DeformSlotData();
					tDeformAniData.deformSlotDataList.push(tDeformSlotData);
					tDeformSlotDisplayLen=tByte.getInt16();
					for (k=0;k < tDeformSlotDisplayLen;k++){
						tDeformSlotDisplayData=new DeformSlotDisplayData();
						tDeformSlotData.deformSlotDisplayList.push(tDeformSlotDisplayData);
						tDeformSlotDisplayData.slotIndex=tDSlotIndex=tByte.getInt16();
						tDeformSlotDisplayData.attachment=tDAttachment=tByte.getUTFString();
						tDeformTimeLen=tByte.getInt16();
						for (l=0;l < tDeformTimeLen;l++){
							if (tByte.getByte()==1){
								tDeformSlotDisplayData.tweenKeyList.push(true);
								}else {
								tDeformSlotDisplayData.tweenKeyList.push(false);
							}
							tDTime=tByte.getFloat32();
							tDeformSlotDisplayData.timeList.push(tDTime);
							tDeformVectices=[];
							tDeformSlotDisplayData.vectices.push(tDeformVectices);
							tDeformVecticesLen=tByte.getInt16();
							for (n=0;n < tDeformVecticesLen;n++){
								tDeformVectices.push(tByte.getFloat32());
							}
						}
					}
				}
			}
		};
		var tDrawOrderArr;
		var tDrawOrderAniLen=tByte.getInt16();
		var tDrawOrderLen=0;
		var tDrawOrderData;
		var tDoLen=0;
		for (i=0;i < tDrawOrderAniLen;i++){
			tDrawOrderLen=tByte.getInt16();
			tDrawOrderArr=[];
			for (j=0;j < tDrawOrderLen;j++){
				tDrawOrderData=new DrawOrderData();
				tDrawOrderData.time=tByte.getFloat32();
				tDoLen=tByte.getInt16();
				for (k=0;k < tDoLen;k++){
					tDrawOrderData.drawOrder.push(tByte.getInt16());
				}
				tDrawOrderArr.push(tDrawOrderData);
			}
			this.drawOrderAniArr.push(tDrawOrderArr);
		};
		var tEventArr;
		var tEventAniLen=tByte.getInt16();
		var tEventLen=0;
		var tEventData;
		for (i=0;i < tEventAniLen;i++){
			tEventLen=tByte.getInt16();
			tEventArr=[];
			for (j=0;j < tEventLen;j++){
				tEventData=new EventData();
				tEventData.name=tByte.getUTFString();
				if (this._isParseAudio)tEventData.audioValue=tByte.getUTFString();
				tEventData.intValue=tByte.getInt32();
				tEventData.floatValue=tByte.getFloat32();
				tEventData.stringValue=tByte.getUTFString();
				tEventData.time=tByte.getFloat32();
				tEventArr.push(tEventData);
			}
			this.eventAniArr.push(tEventArr);
		};
		var tAttachmentLen=tByte.getInt16();
		if (tAttachmentLen > 0){
			this.attachmentNames=[];
			for (i=0;i < tAttachmentLen;i++){
				this.attachmentNames.push(tByte.getUTFString());
			}
		};
		var tBoneSlotLen=tByte.getInt16();
		var tDBBoneSlot;
		var tDBBoneSlotArr;
		for (i=0;i < tBoneSlotLen;i++){
			tDBBoneSlot=new BoneSlot();
			tDBBoneSlot.name=tByte.readUTFString();
			tDBBoneSlot.parent=tByte.readUTFString();
			tDBBoneSlot.attachmentName=tByte.readUTFString();
			tDBBoneSlot.srcDisplayIndex=tDBBoneSlot.displayIndex=tByte.getInt16();
			tDBBoneSlot.templet=this;
			this.boneSlotDic[tDBBoneSlot.name]=tDBBoneSlot;
			tDBBoneSlotArr=this.bindBoneBoneSlotDic[tDBBoneSlot.parent];
			if (tDBBoneSlotArr==null){
				this.bindBoneBoneSlotDic[tDBBoneSlot.parent]=tDBBoneSlotArr=[];
			}
			tDBBoneSlotArr.push(tDBBoneSlot);
			this.boneSlotArray.push(tDBBoneSlot);
		};
		var tNameString=tByte.readUTFString();
		var tNameArray=tNameString.split("\n");
		var tNameStartIndex=0;
		var tSkinDataLen=tByte.getUint8();
		var tSkinData,tSlotData,tDisplayData;
		var tSlotDataLen=0,tDisplayDataLen=0;
		var tUvLen=0,tWeightLen=0,tTriangleLen=0,tVerticeLen=0,tLengthLen=0;
		for (i=0;i < tSkinDataLen;i++){
			tSkinData=new SkinData();
			tSkinData.name=tNameArray[tNameStartIndex++];
			tSlotDataLen=tByte.getUint8();
			for (j=0;j < tSlotDataLen;j++){
				tSlotData=new SlotData();
				tSlotData.name=tNameArray[tNameStartIndex++];
				tDBBoneSlot=this.boneSlotDic[tSlotData.name];
				tDisplayDataLen=tByte.getUint8();
				for (k=0;k < tDisplayDataLen;k++){
					tDisplayData=new SkinSlotDisplayData();
					this.skinSlotDisplayDataArr.push(tDisplayData);
					tDisplayData.name=tNameArray[tNameStartIndex++];
					tDisplayData.attachmentName=tNameArray[tNameStartIndex++];
					tDisplayData.transform=new Transform();
					tDisplayData.transform.scX=tByte.getFloat32();
					tDisplayData.transform.skX=tByte.getFloat32();
					tDisplayData.transform.skY=tByte.getFloat32();
					tDisplayData.transform.scY=tByte.getFloat32();
					tDisplayData.transform.x=tByte.getFloat32();
					tDisplayData.transform.y=tByte.getFloat32();
					tSlotData.displayArr.push(tDisplayData);
					tDisplayData.width=tByte.getFloat32();
					tDisplayData.height=tByte.getFloat32();
					tDisplayData.type=tByte.getUint8();
					tDisplayData.verLen=tByte.getUint16();
					tBoneLen=tByte.getUint16();
					if (tBoneLen > 0){
						tDisplayData.bones=[];
						for (l=0;l < tBoneLen;l++){
							var tBoneId=tByte.getUint16();
							tDisplayData.bones.push(tBoneId);
						}
					}
					tUvLen=tByte.getUint16();
					if (tUvLen > 0){
						tDisplayData.uvs=[];
						for (l=0;l < tUvLen;l++){
							tDisplayData.uvs.push(tByte.getFloat32());
						}
					}
					tWeightLen=tByte.getUint16();
					if (tWeightLen > 0){
						tDisplayData.weights=[];
						for (l=0;l < tWeightLen;l++){
							tDisplayData.weights.push(tByte.getFloat32());
						}
					}
					tTriangleLen=tByte.getUint16();
					if (tTriangleLen > 0){
						tDisplayData.triangles=[];
						for (l=0;l < tTriangleLen;l++){
							tDisplayData.triangles.push(tByte.getUint16());
						}
					}
					tVerticeLen=tByte.getUint16();
					if (tVerticeLen > 0){
						tDisplayData.vertices=[];
						for (l=0;l < tVerticeLen;l++){
							tDisplayData.vertices.push(tByte.getFloat32());
						}
					}
					tLengthLen=tByte.getUint16();
					if (tLengthLen > 0){
						tDisplayData.lengths=[];
						for (l=0;l < tLengthLen;l++){
							tDisplayData.lengths.push(tByte.getFloat32());
						}
					}
				}
				tSkinData.slotArr.push(tSlotData);
			}
			this.skinDic[tSkinData.name]=tSkinData;
			this.skinDataArray.push(tSkinData);
		};
		var tReverse=tByte.getUint8();
		if (tReverse==1){
			this.yReverseMatrix=new Matrix(1,0,0,-1,0,0);
			if (tRootBone){
				tRootBone.setTempMatrix(this.yReverseMatrix);
			}
			}else {
			if (tRootBone){
				tRootBone.setTempMatrix(new Matrix());
			}
		}
		this.showSkinByIndex(this.boneSlotDic,0);
		this.isParserComplete=true;
		this.event(/*laya.events.Event.COMPLETE*/"complete",this);
	}

	/**
	*得到指定的纹理
	*@param name 纹理的名字
	*@return
	*/
	__proto.getTexture=function(name){
		var tTexture=this.subTextureDic[name];
		if (!tTexture){
			tTexture=this.subTextureDic[name.substr(0,name.length-1)];
		}
		if (tTexture==null){
			return this._mainTexture;
		}
		return tTexture;
	}

	/**
	*@private
	*显示指定的皮肤
	*@param boneSlotDic 插糟字典的引用
	*@param skinIndex 皮肤的索引
	*@param freshDisplayIndex 是否重置插槽纹理
	*/
	__proto.showSkinByIndex=function(boneSlotDic,skinIndex,freshDisplayIndex){
		(freshDisplayIndex===void 0)&& (freshDisplayIndex=true);
		if (skinIndex < 0 && skinIndex >=this.skinDataArray.length)return false;
		var i=0,n=0;
		var tBoneSlot;
		var tSlotData;
		var tSkinData=this.skinDataArray[skinIndex];
		if (tSkinData){
			for (i=0,n=tSkinData.slotArr.length;i < n;i++){
				tSlotData=tSkinData.slotArr[i];
				if (tSlotData){
					tBoneSlot=boneSlotDic[tSlotData.name];
					if (tBoneSlot){
						tBoneSlot.showSlotData(tSlotData,freshDisplayIndex);
						if (freshDisplayIndex&&tBoneSlot.attachmentName !="undefined" && tBoneSlot.attachmentName !="null"){
							tBoneSlot.showDisplayByName(tBoneSlot.attachmentName);
							}else {
							tBoneSlot.showDisplayByIndex(tBoneSlot.displayIndex);
						}
					}
				}
			}
			return true;
		}
		return false;
	}

	/**
	*通过皮肤名字得到皮肤索引
	*@param skinName 皮肤名称
	*@return
	*/
	__proto.getSkinIndexByName=function(skinName){
		var tSkinData;
		for (var i=0,n=this.skinDataArray.length;i < n;i++){
			tSkinData=this.skinDataArray[i];
			if (tSkinData.name==skinName){
				return i;
			}
		}
		return-1;
	}

	/**
	*@private
	*得到缓冲数据
	*@param aniIndex 动画索引
	*@param frameIndex 帧索引
	*@return
	*/
	__proto.getGrahicsDataWithCache=function(aniIndex,frameIndex){
		if (this._graphicsCache[aniIndex] && this._graphicsCache[aniIndex][frameIndex]){
			return this._graphicsCache[aniIndex][frameIndex];
		}
		return null;
	}

	/**
	*@private
	*保存缓冲grahpics
	*@param aniIndex 动画索引
	*@param frameIndex 帧索引
	*@param graphics 要保存的数据
	*/
	__proto.setGrahicsDataWithCache=function(aniIndex,frameIndex,graphics){
		this._graphicsCache[aniIndex][frameIndex]=graphics;
	}

	/**
	*释放纹理
	*/
	__proto.destroy=function(){
		this._isDestroyed=true;
		var tTexture;
		/*for each*/for(var $each_tTexture in this.subTextureDic){
			tTexture=this.subTextureDic[$each_tTexture];
			if(tTexture)
				tTexture.destroy();
		}
		var $each_tTexture;
		/*for each*/for($each_tTexture in this._textureDic){
			tTexture=this._textureDic[$each_tTexture];
			if(tTexture)
				tTexture.destroy();
		};
		var tSkinSlotDisplayData;
		for (var i=0,n=this.skinSlotDisplayDataArr.length;i < n;i++){
			tSkinSlotDisplayData=this.skinSlotDisplayDataArr[i];
			tSkinSlotDisplayData.destory();
		}
		this.skinSlotDisplayDataArr.length=0;
		if (this.url){
			delete Templet.TEMPLET_DICTIONARY[this.url];
		}
		laya.resource.Resource.prototype.destroy.call(this);
	}

	/**
	*通过索引得动画名称
	*@param index
	*@return
	*/
	__proto.getAniNameByIndex=function(index){
		var tAni=this.getAnimation(index);
		if (tAni)return tAni.name;
		return null;
	}

	__getset(0,__proto,'rate',function(){
		return this._rate;
		},function(v){
		this._rate=v;
	});

	Templet.LAYA_ANIMATION_160_VISION="LAYAANIMATION:1.6.0";
	Templet.LAYA_ANIMATION_VISION="LAYAANIMATION:1.7.0";
	Templet.TEMPLET_DICTIONARY=null;
	return Templet;
})(AnimationTemplet)



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