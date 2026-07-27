
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
/**
*...
*@author dongketao
*/
//class PathFinding.core.DiagonalMovement
var DiagonalMovement=(function(){
	function DiagonalMovement(){}
	__class(DiagonalMovement,'PathFinding.core.DiagonalMovement');
	DiagonalMovement.Always=1;
	DiagonalMovement.Never=2;
	DiagonalMovement.IfAtMostOneObstacle=3;
	DiagonalMovement.OnlyWhenNoObstacles=4;
	return DiagonalMovement;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.core.Grid
var Grid=(function(){
	function Grid(width_or_matrix,height,matrix){
		this.width=0;
		this.height=0;
		this.nodes=null;
		var width=0;
		if ((typeof width_or_matrix=='number')){
			width=width_or_matrix;
		}
		else{
			height=width_or_matrix.length;
			width=width_or_matrix[0].length;
			matrix=width_or_matrix;
		}
		this.width=width;
		this.height=height;
		this.nodes=this._buildNodes(width,height,matrix);
	}

	__class(Grid,'PathFinding.core.Grid');
	var __proto=Grid.prototype;
	/**
	*Build and return the nodes.
	*@private
	*@param {number}width
	*@param {number}height
	*@param {Array<Array<number|boolean>>}[matrix]-A 0-1 matrix representing
	*the walkable status of the nodes.
	*@see Grid
	*/
	__proto._buildNodes=function(width,height,matrix){
		var i=0,j=0,nodes=[];
		for (i=0;i < height;++i){
			nodes[i]=[];
			for (j=0;j < width;++j){
				nodes[i][j]=new Node$1(j,i);
			}
		}
		if (matrix==null){
			return nodes;
		}
		if (matrix.length !=height || matrix[0].length !=width){
			throw new Error('Matrix size does not fit');
		}
		for (i=0;i < height;++i){
			for (j=0;j < width;++j){
				if (matrix[i][j]){
					nodes[i][j].walkable=false;
				}
			}
		}
		return nodes;
	}

	__proto.getNodeAt=function(x,y){
		return this.nodes[y][x];
	}

	/**
	*Determine whether the node at the given position is walkable.
	*(Also returns false if the position is outside the grid.)
	*@param {number}x-The x coordinate of the node.
	*@param {number}y-The y coordinate of the node.
	*@return {boolean}-The walkability of the node.
	*/
	__proto.isWalkableAt=function(x,y){
		return this.isInside(x,y)&& this.nodes[y][x].walkable;
	}

	/**
	*Determine whether the position is inside the grid.
	*XXX:`grid.isInside(x,y)` is wierd to read.
	*It should be `(x,y)is inside grid`,but I failed to find a better
	*name for this method.
	*@param {number}x
	*@param {number}y
	*@return {boolean}
	*/
	__proto.isInside=function(x,y){
		return (x >=0 && x < this.width)&& (y >=0 && y < this.height);
	}

	/**
	*Set whether the node on the given position is walkable.
	*NOTE:throws exception if the coordinate is not inside the grid.
	*@param {number}x-The x coordinate of the node.
	*@param {number}y-The y coordinate of the node.
	*@param {boolean}walkable-Whether the position is walkable.
	*/
	__proto.setWalkableAt=function(x,y,walkable){
		this.nodes[y][x].walkable=walkable;
	}

	/**
	*Get the neighbors of the given node.
	*
	*offsets diagonalOffsets:
	*+---+---+---++---+---+---+
	*| | 0 | | | 0 | | 1 |
	*+---+---+---++---+---+---+
	*| 3 | | 1 | | | | |
	*+---+---+---++---+---+---+
	*| | 2 | | | 3 | | 2 |
	*+---+---+---++---+---+---+
	*
	*When allowDiagonal is true,if offsets[i] is valid,then
	*diagonalOffsets[i] and
	*diagonalOffsets[(i+1)% 4] is valid.
	*@param {Node}node
	*@param {diagonalMovement}diagonalMovement
	*/
	__proto.getNeighbors=function(node,diagonalMovement){
		var x=node.x,y=node.y,neighbors=[],s0=false,d0=false,s1=false,d1=false,s2=false,d2=false,s3=false,d3=false,nodes=this.nodes;
		if (this.isWalkableAt(x,y-1)){
			neighbors.push(nodes[y-1][x]);
			s0=true;
		}
		if (this.isWalkableAt(x+1,y)){
			neighbors.push(nodes[y][x+1]);
			s1=true;
		}
		if (this.isWalkableAt(x,y+1)){
			neighbors.push(nodes[y+1][x]);
			s2=true;
		}
		if (this.isWalkableAt(x-1,y)){
			neighbors.push(nodes[y][x-1]);
			s3=true;
		}
		if (diagonalMovement==DiagonalMovement.Never){
			return neighbors;
		}
		if (diagonalMovement==DiagonalMovement.OnlyWhenNoObstacles){
			d0=s3 && s0;
			d1=s0 && s1;
			d2=s1 && s2;
			d3=s2 && s3;
		}
		else if (diagonalMovement==DiagonalMovement.IfAtMostOneObstacle){
			d0=s3 || s0;
			d1=s0 || s1;
			d2=s1 || s2;
			d3=s2 || s3;
		}
		else if (diagonalMovement==DiagonalMovement.Always){
			d0=true;
			d1=true;
			d2=true;
			d3=true;
		}
		else{
			throw new Error('Incorrect value of diagonalMovement');
		}
		if (d0 && this.isWalkableAt(x-1,y-1)){
			neighbors.push(nodes[y-1][x-1]);
		}
		if (d1 && this.isWalkableAt(x+1,y-1)){
			neighbors.push(nodes[y-1][x+1]);
		}
		if (d2 && this.isWalkableAt(x+1,y+1)){
			neighbors.push(nodes[y+1][x+1]);
		}
		if (d3 && this.isWalkableAt(x-1,y+1)){
			neighbors.push(nodes[y+1][x-1]);
		}
		return neighbors;
	}

	/**
	*Get a clone of this grid.
	*@return {Grid}Cloned grid.
	*/
	__proto.clone=function(){
		var i=0,j=0,
		width=this.width,height=this.height,thisNodes=this.nodes,
		newGrid=new Grid(width,height),newNodes=[];
		for (i=0;i < height;++i){
			newNodes[i]=[];
			for (j=0;j < width;++j){
				newNodes[i][j]=new Node$1(j,i,thisNodes[i][j].walkable);
			}
		}
		newGrid.nodes=newNodes;
		return newGrid;
	}

	__proto.reset=function(){
		var _node;
		for (var i=0;i < this.height;++i){
			for (var j=0;j < this.width;++j){
				_node=this.nodes[i][j];
				_node.g=0;
				_node.f=0;
				_node.h=0;
				_node.by=0;
				_node.parent=null;
				_node.opened=null;
				_node.closed=null;
				_node.tested=null;
			}
		}
	}

	Grid.createGridFromAStarMap=function(texture){
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var pixelsInfo=texture.getPixels();
		var aStarArr=[];
		var index=0;
		for (var w=0;w < textureWidth;w++){
			var colaStarArr=aStarArr[w]=[];
			for (var h=0;h < textureHeight;h++){
				var r=pixelsInfo[index++];
				var g=pixelsInfo[index++];
				var b=pixelsInfo[index++];
				var a=pixelsInfo[index++];
				if (r==255 && g==255 && b==255 && a==255)
					colaStarArr[h]=1;
				else {
					colaStarArr[h]=0;
				}
			}
		};
		var gird=new Grid(textureWidth,textureHeight,aStarArr);
		return gird;
	}

	return Grid;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.core.Heuristic
var Heuristic=(function(){
	function Heuristic(){}
	__class(Heuristic,'PathFinding.core.Heuristic');
	Heuristic.manhattan=function(dx,dy){
		return dx+dy;
	}

	Heuristic.euclidean=function(dx,dy){
		return Math.sqrt(dx *dx+dy *dy);
	}

	Heuristic.octile=function(dx,dy){
		var F=Math.SQRT2-1;
		return (dx < dy)? F *dx+dy :F *dy+dx;
	}

	Heuristic.chebyshev=function(dx,dy){
		return Math.max(dx,dy);
	}

	return Heuristic;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.core.Node
var Node$1=(function(){
	function Node(x,y,walkable){
		this.x=0;
		this.y=0;
		this.g=0;
		this.f=0;
		this.h=0;
		this.by=0;
		this.parent=null;
		this.opened=null;
		this.closed=null;
		this.tested=null;
		this.retainCount=null;
		this.walkable=false;
		(walkable===void 0)&& (walkable=true);
		this.x=x;
		this.y=y;
		this.walkable=walkable;
	}

	__class(Node,'PathFinding.core.Node',null,'Node$1');
	return Node;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.core.Util
var Util=(function(){
	function Util(){}
	__class(Util,'PathFinding.core.Util');
	Util.backtrace=function(node){
		var path=[[node.x,node.y]];
		while (node.parent){
			node=node.parent;
			path.push([node.x,node.y]);
		}
		return path.reverse();
	}

	Util.biBacktrace=function(nodeA,nodeB){
		var pathA=Util.backtrace(nodeA),pathB=Util.backtrace(nodeB);
		return pathA.concat(pathB.reverse());
	}

	Util.pathLength=function(path){
		var i=0,sum=0,a=0,b=0,dx=0,dy=0;
		for (i=1;i < path.length;++i){
			a=path[i-1];
			b=path[i];
			dx=a[0]-b[0];
			dy=a[1]-b[1];
			sum+=Math.sqrt(dx *dx+dy *dy);
		}
		return sum;
	}

	Util.interpolate=function(x0,y0,x1,y1){
		var abs=Math.abs,line=[],sx=0,sy=0,dx=0,dy=0,err=0,e2=0;
		dx=abs(x1-x0);
		dy=abs(y1-y0);
		sx=(x0 < x1)? 1 :-1;
		sy=(y0 < y1)? 1 :-1;
		err=dx-dy;
		while (true){
			line.push([x0,y0]);
			if (x0==x1 && y0==y1){
				break ;
			}
			e2=2 *err;
			if (e2 >-dy){
				err=err-dy;
				x0=x0+sx;
			}
			if (e2 < dx){
				err=err+dx;
				y0=y0+sy;
			}
		}
		return line;
	}

	Util.expandPath=function(path){
		var expanded=[],len=path.length,coord0,coord1,interpolated,interpolatedLen=0,i=0,j=0;
		if (len < 2){
			return expanded;
		}
		for (i=0;i < len-1;++i){
			coord0=path[i];
			coord1=path[i+1];
			interpolated=Util.interpolate(coord0[0],coord0[1],coord1[0],coord1[1]);
			interpolatedLen=interpolated.length;
			for (j=0;j < interpolatedLen-1;++j){
				expanded.push(interpolated[j]);
			}
		}
		expanded.push(path[len-1]);
		return expanded;
	}

	Util.smoothenPath=function(grid,path){
		var len=path.length,x0=path[0][0],
		y0=path[0][1],
		x1=path[len-1][0],
		y1=path[len-1][1],
		sx=0,sy=0,
		ex=0,ey=0,
		newPath,i=0,j=0,coord,line,testCoord,blocked=false,lastValidCoord;
		sx=x0;
		sy=y0;
		newPath=[[sx,sy]];
		for (i=2;i < len;++i){
			coord=path[i];
			ex=coord[0];
			ey=coord[1];
			line=Util.interpolate(sx,sy,ex,ey);
			blocked=false;
			for (j=1;j < line.length;++j){
				testCoord=line[j];
				if (!grid.isWalkableAt(testCoord[0],testCoord[1])){
					blocked=true;
					break ;
				}
			}
			if (blocked){
				lastValidCoord=path[i-1];
				newPath.push(lastValidCoord);
				sx=lastValidCoord[0];
				sy=lastValidCoord[1];
			}
		}
		newPath.push([x1,y1]);
		return newPath;
	}

	Util.compressPath=function(path){
		if (path.length < 3){
			return path;
		};
		var compressed=[],sx=path[0][0],
		sy=path[0][1],
		px=path[1][0],
		py=path[1][1],
		dx=px-sx,
		dy=py-sy,
		lx=0,ly=0,ldx=0,ldy=0,sq=NaN,i=0;
		sq=Math.sqrt(dx *dx+dy *dy);
		dx /=sq;
		dy /=sq;
		compressed.push([sx,sy]);
		for (i=2;i < path.length;i++){
			lx=px;
			ly=py;
			ldx=dx;
			ldy=dy;
			px=path[i][0];
			py=path[i][1];
			dx=px-lx;
			dy=py-ly;
			sq=Math.sqrt(dx *dx+dy *dy);
			dx /=sq;
			dy /=sq;
			if (dx!==ldx || dy!==ldy){
				compressed.push([lx,ly]);
			}
		}
		compressed.push([px,py]);
		return compressed;
	}

	return Util;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.finders.AStarFinder
var AStarFinder=(function(){
	function AStarFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.heuristic=null;
		this.weight=0;
		this.diagonalMovement=0;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.weight=opt.weight || 1;
		this.diagonalMovement=opt.diagonalMovement;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
		if (this.diagonalMovement===DiagonalMovement.Never){
			this.heuristic=opt.heuristic || Heuristic.manhattan;
		}
		else{
			this.heuristic=opt.heuristic || Heuristic.octile;
		}
	}

	__class(AStarFinder,'PathFinding.finders.AStarFinder');
	var __proto=AStarFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=new Heap(function(nodeA,nodeB){
			return nodeA.f-nodeB.f;
		}),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,diagonalMovement=this.diagonalMovement,weight=this.weight,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i=0,l=0,x=0,y=0,ng=0;
		startNode.g=0;
		startNode.f=0;
		openList.push(startNode);
		startNode.opened=true;
		while (!openList.empty()){
			node=openList.pop();
			node.closed=true;
			if (node===endNode){
				return Util.backtrace(endNode);
			}
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng;
					neighbor.h=neighbor.h || weight *heuristic(abs(x-endX),abs(y-endY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						openList.push(neighbor);
						neighbor.opened=true;
					}
					else{
						openList.updateItem(neighbor);
					}
				}
			}
		}
		return [];
	}

	return AStarFinder;
})()


/**
*...
*@author ...
*/
//class PathFinding.finders.BiAStarFinder
var BiAStarFinder=(function(){
	function BiAStarFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.diagonalMovement=0;
		this.heuristic=null;
		this.weight=0;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.diagonalMovement=opt.diagonalMovement;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.weight=opt.weight || 1;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
		if (this.diagonalMovement==DiagonalMovement.Never){
			this.heuristic=opt.heuristic || Heuristic.manhattan;
		}
		else{
			this.heuristic=opt.heuristic || Heuristic.octile;
		}
	}

	__class(BiAStarFinder,'PathFinding.finders.BiAStarFinder');
	var __proto=BiAStarFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var cmp=function (nodeA,nodeB){
			return nodeA.f-nodeB.f;
		};
		var startOpenList=new Heap(cmp),endOpenList=new Heap(cmp),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,diagonalMovement=this.diagonalMovement,weight=this.weight,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i=0,l=0,x=0,y=0,ng=0,BY_START=1,BY_END=2;
		startNode.g=0;
		startNode.f=0;
		startOpenList.push(startNode);
		startNode.opened=BY_START;
		endNode.g=0;
		endNode.f=0;
		endOpenList.push(endNode);
		endNode.opened=BY_END;
		while (!startOpenList.empty()&& !endOpenList.empty()){
			node=startOpenList.pop();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened===BY_END){
					return Util.biBacktrace(node,neighbor);
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng;
					neighbor.h=neighbor.h || weight *heuristic(abs(x-endX),abs(y-endY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						startOpenList.push(neighbor);
						neighbor.opened=BY_START;
					}
					else{
						startOpenList.updateItem(neighbor);
					}
				}
			}
			node=endOpenList.pop();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened===BY_START){
					return Util.biBacktrace(neighbor,node);
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng;
					neighbor.h=neighbor.h || weight *heuristic(abs(x-startX),abs(y-startY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						endOpenList.push(neighbor);
						neighbor.opened=BY_END;
					}
					else{
						endOpenList.updateItem(neighbor);
					}
				}
			}
		}
		return [];
	}

	return BiAStarFinder;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.finders.BiBreadthFirstFinder
var BiBreadthFirstFinder=(function(){
	function BiBreadthFirstFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.heuristic=null;
		this.weight=0;
		this.diagonalMovement=0;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.diagonalMovement=opt.diagonalMovement;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
	}

	__class(BiBreadthFirstFinder,'PathFinding.finders.BiBreadthFirstFinder');
	var __proto=BiBreadthFirstFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),startOpenList=[],endOpenList=[],neighbors,neighbor,node,diagonalMovement=this.diagonalMovement,BY_START=0,BY_END=1,i=0,l=0;
		startOpenList.push(startNode);
		startNode.opened=true;
		startNode.by=BY_START;
		endOpenList.push(endNode);
		endNode.opened=true;
		endNode.by=BY_END;
		while (startOpenList.length && endOpenList.length){
			node=startOpenList.shift();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened){
					if (neighbor.by===BY_END){
						return Util.biBacktrace(node,neighbor);
					}
					continue ;
				}
				startOpenList.push(neighbor);
				neighbor.parent=node;
				neighbor.opened=true;
				neighbor.by=BY_START;
			}
			node=endOpenList.shift();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened){
					if (neighbor.by===BY_START){
						return Util.biBacktrace(neighbor,node);
					}
					continue ;
				}
				endOpenList.push(neighbor);
				neighbor.parent=node;
				neighbor.opened=true;
				neighbor.by=BY_END;
			}
		}
		return [];
	}

	return BiBreadthFirstFinder;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.finders.BreadthFirstFinder
var BreadthFirstFinder=(function(){
	function BreadthFirstFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.heuristic=null;
		this.weight=0;
		this.diagonalMovement=0;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.diagonalMovement=opt.diagonalMovement;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
	}

	__class(BreadthFirstFinder,'PathFinding.finders.BreadthFirstFinder');
	var __proto=BreadthFirstFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=[],diagonalMovement=this.diagonalMovement,startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),neighbors,neighbor,node,i=0,l=0;
		openList.push(startNode);
		startNode.opened=true;
		while (openList.length){
			node=openList.shift();
			node.closed=true;
			if (node===endNode){
				return Util.backtrace(endNode);
			}
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed || neighbor.opened){
					continue ;
				}
				openList.push(neighbor);
				neighbor.opened=true;
				neighbor.parent=node;
			}
		}
		return [];
	}

	return BreadthFirstFinder;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.finders.IDAStarFinder
var IDAStarFinder=(function(){
	function IDAStarFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.heuristic=null;
		this.weight=0;
		this.diagonalMovement=0;
		this.trackRecursion=false;
		this.timeLimit=NaN;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.diagonalMovement=opt.diagonalMovement;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.weight=opt.weight || 1;
		this.trackRecursion=opt.trackRecursion || false;
		this.timeLimit=opt.timeLimit || Infinity;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
		if (this.diagonalMovement===DiagonalMovement.Never){
			this.heuristic=opt.heuristic || Heuristic.manhattan;
		}
		else{
			this.heuristic=opt.heuristic || Heuristic.octile;
		}
	}

	__class(IDAStarFinder,'PathFinding.finders.IDAStarFinder');
	var __proto=IDAStarFinder.prototype;
	/**
	*Find and return the the path. When an empty array is returned,either
	*no path is possible,or the maximum execution time is reached.
	*
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var _$this=this;
		var nodesVisited=0;
		var startTime=new Date().getTime();
		var h=function (a,b){
			return _$this.heuristic(Math.abs(b.x-a.x),Math.abs(b.y-a.y));
		};
		var cost=function (a,b){
			return (a.x===b.x || a.y===b.y)? 1 :Math.SQRT2;
		};
		var search=function (node,g,cutoff,route,depth){
			nodesVisited++;
			if (_$this.timeLimit > 0 && new Date().getTime()-startTime > _$this.timeLimit *1000){
				return Infinity;
			};
			var f=g+h(node,end)*_$this.weight;
			if (f > cutoff){
				return f;
			}
			if (node==end){
				route[depth]=[node.x,node.y];
				return node;
			};
			var min=0,t=0,k=0,neighbour;
			var neighbours=grid.getNeighbors(node,_$this.diagonalMovement);
			for (k=0,min=Infinity;neighbour=neighbours[k];++k){
				if (_$this.trackRecursion){
					neighbour.retainCount=neighbour.retainCount+1 || 1;
					if (neighbour.tested !=true){
						neighbour.tested=true;
					}
				}
				t=search(neighbour,g+cost(node,neighbour),cutoff,route,depth+1);
				if ((t instanceof PathFinding.core.Node )){
					route[depth]=[node.x,node.y];
					return t;
				}
				if (_$this.trackRecursion && (--neighbour.retainCount)===0){
					neighbour.tested=false;
				}
				if (t < min){
					min=t;
				}
			}
			return min;
		};
		var start=grid.getNodeAt(startX,startY);
		var end=grid.getNodeAt(endX,endY);
		var cutOff=h(start,end);
		var j=0,route,t=0;
		for (j=0;true;++j){
			route=[];
			t=search(start,0,cutOff,route,0);
			if (t==Infinity){
				route=[];
				break ;
			}
			if ((t instanceof PathFinding.core.Node )){
				break ;
			}
			cutOff=t;
		}
		return route;
	}

	return IDAStarFinder;
})()


/**
*...
*@author ...
*/
//class PathFinding.finders.JumpPointFinderBase
var JumpPointFinderBase=(function(){
	function JumpPointFinderBase(opt){
		this.grid=null;
		this.openList=null;
		this.startNode=null;
		this.endNode=null;
		this.heuristic=null;
		this.trackJumpRecursion=false;
		opt=opt || {};
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.trackJumpRecursion=opt.trackJumpRecursion || false;
	}

	__class(JumpPointFinderBase,'PathFinding.finders.JumpPointFinderBase');
	var __proto=JumpPointFinderBase.prototype;
	/**
	*Find and return the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=this.openList=new Heap(function(nodeA,nodeB){
			return nodeA.f-nodeB.f;
		}),startNode=this.startNode=grid.getNodeAt(startX,startY),endNode=this.endNode=grid.getNodeAt(endX,endY),node;
		this.grid=grid;
		startNode.g=0;
		startNode.f=0;
		openList.push(startNode);
		startNode.opened=true;
		while (!openList.empty()){
			node=openList.pop();
			node.closed=true;
			if (node==endNode){
				return Util.expandPath(Util.backtrace(endNode));
			}
			this._identifySuccessors(node);
		}
		return [];
	}

	/**
	*Identify successors for the given node. Runs a jump point search in the
	*direction of each available neighbor,adding any points found to the open
	*list.
	*@protected
	*/
	__proto._identifySuccessors=function(node){
		var grid=this.grid,heuristic=this.heuristic,openList=this.openList,endX=this.endNode.x,endY=this.endNode.y,neighbors,neighbor,jumpPoint,i=0,l=0,x=node.x,y=node.y,jx=0,jy=0,dx=0,dy=0,d=0,ng=0,jumpNode,abs=Math.abs,max=Math.max;
		neighbors=this._findNeighbors(node);
		for (i=0,l=neighbors.length;i < l;++i){
			neighbor=neighbors[i];
			jumpPoint=this._jump(neighbor[0],neighbor[1],x,y);
			if (jumpPoint){
				jx=jumpPoint[0];
				jy=jumpPoint[1];
				jumpNode=grid.getNodeAt(jx,jy);
				if (jumpNode.closed){
					continue ;
				}
				d=Heuristic.octile(abs(jx-x),abs(jy-y));
				ng=node.g+d;
				if (!jumpNode.opened || ng < jumpNode.g){
					jumpNode.g=ng;
					jumpNode.h=jumpNode.h || heuristic(abs(jx-endX),abs(jy-endY));
					jumpNode.f=jumpNode.g+jumpNode.h;
					jumpNode.parent=node;
					if (!jumpNode.opened){
						openList.push(jumpNode);
						jumpNode.opened=true;
					}
					else{
						openList.updateItem(jumpNode);
					}
				}
			}
		}
	}

	__proto._jump=function(x,y,px,py){
		return [];
	}

	__proto._findNeighbors=function(node){
		return [];
	}

	return JumpPointFinderBase;
})()


/**
*...
*@author ...
*/
//class PathFinding.finders.JumpPointFinder
var JumpPointFinder=(function(){
	/**
	*Path finder using the Jump Point Search algorithm
	*@param {Object}opt
	*@param {function}opt.heuristic Heuristic function to estimate the distance
	*(defaults to manhattan).
	*@param {DiagonalMovement}opt.diagonalMovement Condition under which diagonal
	*movement will be allowed.
	*/
	function JumpPointFinder(opt){}
	__class(JumpPointFinder,'PathFinding.finders.JumpPointFinder');
	return JumpPointFinder;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.finders.TraceFinder
var TraceFinder=(function(){
	function TraceFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.diagonalMovement=0;
		this.heuristic=null;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.diagonalMovement=opt.diagonalMovement;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
		if (this.diagonalMovement==DiagonalMovement.Never){
			this.heuristic=opt.heuristic || Heuristic.manhattan;
		}
		else{
			this.heuristic=opt.heuristic || Heuristic.octile;
		}
	}

	__class(TraceFinder,'PathFinding.finders.TraceFinder');
	var __proto=TraceFinder.prototype;
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=new Heap(function(nodeA,nodeB){
			return nodeA.f-nodeB.f;
		}),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,allowDiagonal=this.allowDiagonal,dontCrossCorners=this.dontCrossCorners,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i=0,l=0,x=0,y=0,ng=0;
		startNode.g=0;
		startNode.f=0;
		openList.push(startNode);
		startNode.opened=true;
		while (!openList.empty()){
			node=openList.pop();
			node.closed=true;
			if (node===endNode){
				return Util.backtrace(endNode);
			}
			neighbors=grid.getNeighbors(node,this.diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng *l / 9;
					neighbor.h=neighbor.h || heuristic(abs(x-endX),abs(y-endY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						openList.push(neighbor);
						neighbor.opened=true;
					}
					else{
						openList.updateItem(neighbor);
					}
				}
			}
		}
		return [];
	}

	return TraceFinder;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.libs.Heap
var Heap=(function(){
	function Heap(cmp){
		this.cmp=null;
		this.nodes=null;
		this.heapFunction=new HeapFunction();
		this.cmp=cmp !=null ? cmp :this.heapFunction.defaultCmp;
		this.nodes=[];
	}

	__class(Heap,'PathFinding.libs.Heap');
	var __proto=Heap.prototype;
	__proto.push=function(x){
		return this.heapFunction.heappush(this.nodes,x,this.cmp);
	}

	__proto.pop=function(){
		return this.heapFunction.heappop(this.nodes,this.cmp);
	}

	__proto.peek=function(){
		return this.nodes[0];
	}

	__proto.contains=function(x){
		return this.nodes.indexOf(x)!==-1;
	}

	__proto.replace=function(x){
		return this.heapFunction.heapreplace(this.nodes,x,this.cmp);
	}

	__proto.pushpop=function(x){
		return this.heapFunction.heappushpop(this.nodes,x,this.cmp);
	}

	__proto.heapify=function(){
		return this.heapFunction.heapify(this.nodes,this.cmp);
	}

	__proto.updateItem=function(x){
		return this.heapFunction.updateItem(this.nodes,x,this.cmp);
	}

	__proto.clear=function(){
		return this.nodes=[];
	}

	__proto.empty=function(){
		return this.nodes.length===0;
	}

	__proto.size=function(){
		return this.nodes.length;
	}

	__proto.clone=function(){
		var heap=new Heap();
		heap.nodes=this.nodes.slice(0);
		return heap;
	}

	__proto.toArray=function(){
		return this.nodes.slice(0);
	}

	return Heap;
})()


/**
*...
*@author dongketao
*/
//class PathFinding.libs.HeapFunction
var HeapFunction=(function(){
	function HeapFunction(){
		//};
		this.defaultCmp=function(x,y){
			if (x < y){
				return-1;
			}
			if (x > y){
				return 1;
			}
			return 0;
		}
	}

	__class(HeapFunction,'PathFinding.libs.HeapFunction');
	var __proto=HeapFunction.prototype;
	//};
	__proto.insort=function(a,x,lo,hi,cmp){
		var mid=NaN;
		if (lo==null){
			lo=0;
		}
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		if (lo < 0){
			throw new Error('lo must be non-negative');
		}
		if (hi==null){
			hi=a.length;
		}
		while (lo < hi){
			mid=Math.floor((lo+hi)/ 2);
			if (cmp(x,a[mid])< 0){
				hi=mid;
			}
			else{
				lo=mid+1;
			}
		}
		return ([].splice.apply(a,[lo,lo-lo].concat(x)),x);
	}

	//};
	__proto.heappush=function(array,item,cmp){
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		array.push(item);
		return this._siftdown(array,0,array.length-1,cmp);
	}

	//};
	__proto.heappop=function(array,cmp){
		var lastelt,returnitem;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		lastelt=array.pop();
		if (array.length){
			returnitem=array[0];
			array[0]=lastelt;
			this._siftup(array,0,cmp);
		}
		else{
			returnitem=lastelt;
		}
		return returnitem;
	}

	//};
	__proto.heapreplace=function(array,item,cmp){
		var returnitem;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		returnitem=array[0];
		array[0]=item;
		this._siftup(array,0,cmp);
		return returnitem;
	}

	//};
	__proto.heappushpop=function(array,item,cmp){
		var _ref;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		if (array.length && cmp(array[0],item)< 0){
			_ref=[array[0],item],item=_ref[0],array[0]=_ref[1];
			this._siftup(array,0,cmp);
		}
		return item;
	}

	//};
	__proto.heapify=function(array,cmp){
		var i=0,_i=0,_j=0,_len=0,_ref,_ref1,_results,_results1;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		_ref1=(function(){
			_results1=[];
			for (_j=0,_ref=Math.floor(array.length / 2);0 <=_ref ? _j < _ref :_j > _ref;0 <=_ref ? _j++:_j--){
				_results1.push(_j);
			}
			return _results1;
		}).apply(this).reverse();
		_results=[];
		for (_i=0,_len=_ref1.length;_i < _len;_i++){
			i=_ref1[_i];
			_results.push(this._siftup(array,i,cmp));
		}
		return _results;
	}

	//};
	__proto.updateItem=function(array,item,cmp){
		var pos=0;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		pos=array.indexOf(item);
		if (pos===-1){
			return null;
		}
		this._siftdown(array,0,pos,cmp);
		return this._siftup(array,pos,cmp);
	}

	//};
	__proto.nlargest=function(array,n,cmp){
		var elem,result,_i=0,_len=0,_ref;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		result=array.slice(0,n);
		if (!result.length){
			return result;
		}
		this.heapify(result,cmp);
		_ref=array.slice(n);
		for (_i=0,_len=_ref.length;_i < _len;_i++){
			elem=_ref[_i];
			this.heappushpop(result,elem,cmp);
		}
		return result.sort(cmp).reverse();
	}

	//};
	__proto.nsmallest=function(array,n,cmp){
		var elem,i,los,result,_i=0,_j=0,_len,_ref,_ref1,_results;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		if (n *10 <=array.length){
			result=array.slice(0,n).sort(cmp);
			if (!result.length){
				return result;
			}
			los=result[result.length-1];
			_ref=array.slice(n);
			for (_i=0,_len=_ref.length;_i < _len;_i++){
				elem=_ref[_i];
				if (cmp(elem,los)< 0){
					this.insort(result,elem,0,null,cmp);
					result.pop();
					los=result[result.length-1];
				}
			}
			return result;
		}
		this.heapify(array,cmp);
		_results=[];
		for (i=_j=0,_ref1=Math.min(n,array.length);0 <=_ref1 ? _j < _ref1 :_j > _ref1;i=0 <=_ref1 ?++_j :--_j){
			_results.push(this.heappop(array,cmp));
		}
		return _results;
	}

	//};
	__proto._siftdown=function(array,startpos,pos,cmp){
		var newitem,parent,parentpos=0;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		newitem=array[pos];
		while (pos > startpos){
			parentpos=(pos-1)>> 1;
			parent=array[parentpos];
			if (cmp(newitem,parent)< 0){
				array[pos]=parent;
				pos=parentpos;
				continue ;
			}
			break ;
		}
		return array[pos]=newitem;
	}

	//};
	__proto._siftup=function(array,pos,cmp){
		var childpos=0,endpos=0,newitem,rightpos=0,startpos=0;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		endpos=array.length;
		startpos=pos;
		newitem=array[pos];
		childpos=2 *pos+1;
		while (childpos < endpos){
			rightpos=childpos+1;
			if (rightpos < endpos && !(cmp(array[childpos],array[rightpos])< 0)){
				childpos=rightpos;
			}
			array[pos]=array[childpos];
			pos=childpos;
			childpos=2 *pos+1;
		}
		array[pos]=newitem;
		return this._siftdown(array,startpos,pos,cmp);
	}

	return HeapFunction;
})()


/**
*...
*@author ...
*/
//class PathFinding.finders.BestFirstFinder extends PathFinding.finders.AStarFinder
var BestFirstFinder=(function(_super){
	function BestFirstFinder(opt){
		BestFirstFinder.__super.call(this,opt);
		var orig=this.heuristic;
		this.heuristic=function (dx,dy){
			return orig(dx,dy)*1000000;
		};
	}

	__class(BestFirstFinder,'PathFinding.finders.BestFirstFinder',_super);
	return BestFirstFinder;
})(AStarFinder)


/**
*...
*@author ...
*/
//class PathFinding.finders.BiBestFirstFinder extends PathFinding.finders.BiAStarFinder
var BiBestFirstFinder=(function(_super){
	function BiBestFirstFinder(opt){
		BiBestFirstFinder.__super.call(this,opt);
		var orig=this.heuristic;
		this.heuristic=function (dx,dy){
			return orig(dx,dy)*1000000;
		};
	}

	__class(BiBestFirstFinder,'PathFinding.finders.BiBestFirstFinder',_super);
	return BiBestFirstFinder;
})(BiAStarFinder)


/**
*...
*@author ...
*/
//class PathFinding.finders.BiDijkstraFinder extends PathFinding.finders.BiAStarFinder
var BiDijkstraFinder=(function(_super){
	function BiDijkstraFinder(opt){
		BiDijkstraFinder.__super.call(this,opt);
		this.heuristic=function (dx,dy){
			return 0;
		};
	}

	__class(BiDijkstraFinder,'PathFinding.finders.BiDijkstraFinder',_super);
	return BiDijkstraFinder;
})(BiAStarFinder)


/**
*...
*@author ...
*/
//class PathFinding.finders.DijkstraFinder extends PathFinding.finders.AStarFinder
var DijkstraFinder=(function(_super){
	function DijkstraFinder(opt){
		DijkstraFinder.__super.call(this,opt);
		this.heuristic=function (dx,dy){
			return 0;
		};
	}

	__class(DijkstraFinder,'PathFinding.finders.DijkstraFinder',_super);
	return DijkstraFinder;
})(AStarFinder)


/**
*...
*@author ...
*/
//class PathFinding.finders.JPFAlwaysMoveDiagonally extends PathFinding.finders.JumpPointFinderBase
var JPFAlwaysMoveDiagonally=(function(_super){
	function JPFAlwaysMoveDiagonally(opt){
		JPFAlwaysMoveDiagonally.__super.call(this,opt);
	}

	__class(JPFAlwaysMoveDiagonally,'PathFinding.finders.JPFAlwaysMoveDiagonally',_super);
	var __proto=JPFAlwaysMoveDiagonally.prototype;
	/**
	*Search recursively in the direction (parent-> child),stopping only when a
	*jump point is found.
	*@protected
	*@return {Array<Array<number>>}The x,y coordinate of the jump point
	*found,or null if not found
	*/
	__proto._jump=function(x,y,px,py){
		var grid=this.grid,dx=x-px,dy=y-py;
		if (!grid.isWalkableAt(x,y)){
			return null;
		}
		if (this.trackJumpRecursion==true){
			grid.getNodeAt(x,y).tested=true;
		}
		if (grid.getNodeAt(x,y)==this.endNode){
			return [x,y];
		}
		if (dx!==0 && dy!==0){
			if ((grid.isWalkableAt(x-dx,y+dy)&& !grid.isWalkableAt(x-dx,y))|| (grid.isWalkableAt(x+dx,y-dy)&& !grid.isWalkableAt(x,y-dy))){
				return [x,y];
			}
			if (this._jump(x+dx,y,x,y)|| this._jump(x,y+dy,x,y)){
				return [x,y];
			}
		}
		else{
			if (dx!==0){
				if ((grid.isWalkableAt(x+dx,y+1)&& !grid.isWalkableAt(x,y+1))|| (grid.isWalkableAt(x+dx,y-1)&& !grid.isWalkableAt(x,y-1))){
					return [x,y];
				}
			}
			else{
				if ((grid.isWalkableAt(x+1,y+dy)&& !grid.isWalkableAt(x+1,y))|| (grid.isWalkableAt(x-1,y+dy)&& !grid.isWalkableAt(x-1,y))){
					return [x,y];
				}
			}
		}
		return this._jump(x+dx,y+dy,x,y);
	}

	/**
	*Find the neighbors for the given node. If the node has a parent,
	*prune the neighbors based on the jump point search algorithm,otherwise
	*return all available neighbors.
	*@return {Array<Array<number>>}The neighbors found.
	*/
	__proto._findNeighbors=function(node){
		var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px=0,py=0,nx=0,ny=0,dx=0,dy=0,neighbors=[],neighborNodes,neighborNode,i=0,l=0;
		if (parent){
			px=parent.x;
			py=parent.y;
			dx=(x-px)/ Math.max(Math.abs(x-px),1);
			dy=(y-py)/ Math.max(Math.abs(y-py),1);
			if (dx!==0 && dy!==0){
				if (grid.isWalkableAt(x,y+dy)){
					neighbors.push([x,y+dy]);
				}
				if (grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y]);
				}
				if (grid.isWalkableAt(x+dx,y+dy)){
					neighbors.push([x+dx,y+dy]);
				}
				if (!grid.isWalkableAt(x-dx,y)){
					neighbors.push([x-dx,y+dy]);
				}
				if (!grid.isWalkableAt(x,y-dy)){
					neighbors.push([x+dx,y-dy]);
				}
			}
			else{
				if (dx===0){
					if (grid.isWalkableAt(x,y+dy)){
						neighbors.push([x,y+dy]);
					}
					if (!grid.isWalkableAt(x+1,y)){
						neighbors.push([x+1,y+dy]);
					}
					if (!grid.isWalkableAt(x-1,y)){
						neighbors.push([x-1,y+dy]);
					}
				}
				else{
					if (grid.isWalkableAt(x+dx,y)){
						neighbors.push([x+dx,y]);
					}
					if (!grid.isWalkableAt(x,y+1)){
						neighbors.push([x+dx,y+1]);
					}
					if (!grid.isWalkableAt(x,y-1)){
						neighbors.push([x+dx,y-1]);
					}
				}
			}
		}
		else{
			neighborNodes=grid.getNeighbors(node,DiagonalMovement.Always);
			for (i=0,l=neighborNodes.length;i < l;++i){
				neighborNode=neighborNodes[i];
				neighbors.push([neighborNode.x,neighborNode.y]);
			}
		}
		return neighbors;
	}

	return JPFAlwaysMoveDiagonally;
})(JumpPointFinderBase)


/**
*...
*@author ...
*/
//class PathFinding.finders.JPFMoveDiagonallyIfAtMostOneObstacle extends PathFinding.finders.JumpPointFinderBase
var JPFMoveDiagonallyIfAtMostOneObstacle=(function(_super){
	function JPFMoveDiagonallyIfAtMostOneObstacle(opt){
		JPFMoveDiagonallyIfAtMostOneObstacle.__super.call(this,opt);
	}

	__class(JPFMoveDiagonallyIfAtMostOneObstacle,'PathFinding.finders.JPFMoveDiagonallyIfAtMostOneObstacle',_super);
	var __proto=JPFMoveDiagonallyIfAtMostOneObstacle.prototype;
	/**
	*Search recursively in the direction (parent-> child),stopping only when a
	*jump point is found.
	*@protected
	*@return {Array<Array<number>>}The x,y coordinate of the jump point
	*found,or null if not found
	*/
	__proto._jump=function(x,y,px,py){
		var grid=this.grid,dx=x-px,dy=y-py;
		if (!grid.isWalkableAt(x,y)){
			return null;
		}
		if (this.trackJumpRecursion===true){
			grid.getNodeAt(x,y).tested=true;
		}
		if (grid.getNodeAt(x,y)==this.endNode){
			return [x,y];
		}
		if (dx!==0 && dy!==0){
			if ((grid.isWalkableAt(x-dx,y+dy)&& !grid.isWalkableAt(x-dx,y))|| (grid.isWalkableAt(x+dx,y-dy)&& !grid.isWalkableAt(x,y-dy))){
				return [x,y];
			}
			if (this._jump(x+dx,y,x,y)|| this._jump(x,y+dy,x,y)){
				return [x,y];
			}
		}
		else{
			if (dx!==0){
				if ((grid.isWalkableAt(x+dx,y+1)&& !grid.isWalkableAt(x,y+1))|| (grid.isWalkableAt(x+dx,y-1)&& !grid.isWalkableAt(x,y-1))){
					return [x,y];
				}
			}
			else{
				if ((grid.isWalkableAt(x+1,y+dy)&& !grid.isWalkableAt(x+1,y))|| (grid.isWalkableAt(x-1,y+dy)&& !grid.isWalkableAt(x-1,y))){
					return [x,y];
				}
			}
		}
		if (grid.isWalkableAt(x+dx,y)|| grid.isWalkableAt(x,y+dy)){
			return this._jump(x+dx,y+dy,x,y);
		}
		else{
			return null;
		}
	}

	/**
	*Find the neighbors for the given node. If the node has a parent,
	*prune the neighbors based on the jump point search algorithm,otherwise
	*return all available neighbors.
	*@return {Array<Array<number>>}The neighbors found.
	*/
	__proto._findNeighbors=function(node){
		var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px=0,py=0,nx=0,ny=0,dx=0,dy=0,neighbors=[],neighborNodes,neighborNode,i=0,l=0;
		if (parent){
			px=parent.x;
			py=parent.y;
			dx=(x-px)/ Math.max(Math.abs(x-px),1);
			dy=(y-py)/ Math.max(Math.abs(y-py),1);
			if (dx!==0 && dy!==0){
				if (grid.isWalkableAt(x,y+dy)){
					neighbors.push([x,y+dy]);
				}
				if (grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y]);
				}
				if (grid.isWalkableAt(x,y+dy)|| grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y+dy]);
				}
				if (!grid.isWalkableAt(x-dx,y)&& grid.isWalkableAt(x,y+dy)){
					neighbors.push([x-dx,y+dy]);
				}
				if (!grid.isWalkableAt(x,y-dy)&& grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y-dy]);
				}
			}
			else{
				if (dx===0){
					if (grid.isWalkableAt(x,y+dy)){
						neighbors.push([x,y+dy]);
						if (!grid.isWalkableAt(x+1,y)){
							neighbors.push([x+1,y+dy]);
						}
						if (!grid.isWalkableAt(x-1,y)){
							neighbors.push([x-1,y+dy]);
						}
					}
				}
				else{
					if (grid.isWalkableAt(x+dx,y)){
						neighbors.push([x+dx,y]);
						if (!grid.isWalkableAt(x,y+1)){
							neighbors.push([x+dx,y+1]);
						}
						if (!grid.isWalkableAt(x,y-1)){
							neighbors.push([x+dx,y-1]);
						}
					}
				}
			}
		}
		else{
			neighborNodes=grid.getNeighbors(node,DiagonalMovement.IfAtMostOneObstacle);
			for (i=0,l=neighborNodes.length;i < l;++i){
				neighborNode=neighborNodes[i];
				neighbors.push([neighborNode.x,neighborNode.y]);
			}
		}
		return neighbors;
	}

	return JPFMoveDiagonallyIfAtMostOneObstacle;
})(JumpPointFinderBase)


/**
*...
*@author ...
*/
//class PathFinding.finders.JPFMoveDiagonallyIfNoObstacles extends PathFinding.finders.JumpPointFinderBase
var JPFMoveDiagonallyIfNoObstacles=(function(_super){
	function JPFMoveDiagonallyIfNoObstacles(opt){
		JPFMoveDiagonallyIfNoObstacles.__super.call(this,opt);
	}

	__class(JPFMoveDiagonallyIfNoObstacles,'PathFinding.finders.JPFMoveDiagonallyIfNoObstacles',_super);
	var __proto=JPFMoveDiagonallyIfNoObstacles.prototype;
	/**
	*Search recursively in the direction (parent-> child),stopping only when a
	*jump point is found.
	*@protected
	*@return {Array<Array<number>>}The x,y coordinate of the jump point
	*found,or null if not found
	*/
	__proto._jump=function(x,y,px,py){
		var grid=this.grid,dx=x-px,dy=y-py;
		if (!grid.isWalkableAt(x,y)){
			return null;
		}
		if (this.trackJumpRecursion===true){
			grid.getNodeAt(x,y).tested=true;
		}
		if (grid.getNodeAt(x,y)===this.endNode){
			return [x,y];
		}
		if (dx!==0 && dy!==0){
			if (this._jump(x+dx,y,x,y)|| this._jump(x,y+dy,x,y)){
				return [x,y];
			}
		}
		else{
			if (dx!==0){
				if ((grid.isWalkableAt(x,y-1)&& !grid.isWalkableAt(x-dx,y-1))|| (grid.isWalkableAt(x,y+1)&& !grid.isWalkableAt(x-dx,y+1))){
					return [x,y];
				}
			}
			else if (dy!==0){
				if ((grid.isWalkableAt(x-1,y)&& !grid.isWalkableAt(x-1,y-dy))|| (grid.isWalkableAt(x+1,y)&& !grid.isWalkableAt(x+1,y-dy))){
					return [x,y];
				}
			}
		}
		if (grid.isWalkableAt(x+dx,y)&& grid.isWalkableAt(x,y+dy)){
			return this._jump(x+dx,y+dy,x,y);
		}
		else{
			return null;
		}
	}

	/**
	*Find the neighbors for the given node. If the node has a parent,
	*prune the neighbors based on the jump point search algorithm,otherwise
	*return all available neighbors.
	*@return {Array<Array<number>>}The neighbors found.
	*/
	__proto._findNeighbors=function(node){
		var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px=0,py=0,nx=0,ny=0,dx=0,dy=0,neighbors=[],neighborNodes,neighborNode,i=0,l=0;
		if (parent){
			px=parent.x;
			py=parent.y;
			dx=(x-px)/ Math.max(Math.abs(x-px),1);
			dy=(y-py)/ Math.max(Math.abs(y-py),1);
			if (dx!==0 && dy!==0){
				if (grid.isWalkableAt(x,y+dy)){
					neighbors.push([x,y+dy]);
				}
				if (grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y]);
				}
				if (grid.isWalkableAt(x,y+dy)&& grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y+dy]);
				}
			}
			else{
				var isNextWalkable=false;
				if (dx!==0){
					isNextWalkable=grid.isWalkableAt(x+dx,y);
					var isTopWalkable=grid.isWalkableAt(x,y+1);
					var isBottomWalkable=grid.isWalkableAt(x,y-1);
					if (isNextWalkable){
						neighbors.push([x+dx,y]);
						if (isTopWalkable){
							neighbors.push([x+dx,y+1]);
						}
						if (isBottomWalkable){
							neighbors.push([x+dx,y-1]);
						}
					}
					if (isTopWalkable){
						neighbors.push([x,y+1]);
					}
					if (isBottomWalkable){
						neighbors.push([x,y-1]);
					}
				}
				else if (dy!==0){
					isNextWalkable=grid.isWalkableAt(x,y+dy);
					var isRightWalkable=grid.isWalkableAt(x+1,y);
					var isLeftWalkable=grid.isWalkableAt(x-1,y);
					if (isNextWalkable){
						neighbors.push([x,y+dy]);
						if (isRightWalkable){
							neighbors.push([x+1,y+dy]);
						}
						if (isLeftWalkable){
							neighbors.push([x-1,y+dy]);
						}
					}
					if (isRightWalkable){
						neighbors.push([x+1,y]);
					}
					if (isLeftWalkable){
						neighbors.push([x-1,y]);
					}
				}
			}
		}
		else{
			neighborNodes=grid.getNeighbors(node,DiagonalMovement.OnlyWhenNoObstacles);
			for (i=0,l=neighborNodes.length;i < l;++i){
				neighborNode=neighborNodes[i];
				neighbors.push([neighborNode.x,neighborNode.y]);
			}
		}
		return neighbors;
	}

	return JPFMoveDiagonallyIfNoObstacles;
})(JumpPointFinderBase)


/**
*...
*@author ...
*/
//class PathFinding.finders.JPFNeverMoveDiagonally extends PathFinding.finders.JumpPointFinderBase
var JPFNeverMoveDiagonally=(function(_super){
	function JPFNeverMoveDiagonally(opt){
		JPFNeverMoveDiagonally.__super.call(this,opt);
	}

	__class(JPFNeverMoveDiagonally,'PathFinding.finders.JPFNeverMoveDiagonally',_super);
	var __proto=JPFNeverMoveDiagonally.prototype;
	/**
	*Search recursively in the direction (parent-> child),stopping only when a
	*jump point is found.
	*@protected
	*@return {Array<Array<number>>}The x,y coordinate of the jump point
	*found,or null if not found
	*/
	__proto._jump=function(x,y,px,py){
		var grid=this.grid,dx=x-px,dy=y-py;
		if (!grid.isWalkableAt(x,y)){
			return null;
		}
		if (this.trackJumpRecursion===true){
			grid.getNodeAt(x,y).tested=true;
		}
		if (grid.getNodeAt(x,y)==this.endNode){
			return [x,y];
		}
		if (dx!==0){
			if ((grid.isWalkableAt(x,y-1)&& !grid.isWalkableAt(x-dx,y-1))|| (grid.isWalkableAt(x,y+1)&& !grid.isWalkableAt(x-dx,y+1))){
				return [x,y];
			}
		}
		else if (dy!==0){
			if ((grid.isWalkableAt(x-1,y)&& !grid.isWalkableAt(x-1,y-dy))|| (grid.isWalkableAt(x+1,y)&& !grid.isWalkableAt(x+1,y-dy))){
				return [x,y];
			}
			if (this._jump(x+1,y,x,y)|| this._jump(x-1,y,x,y)){
				return [x,y];
			}
		}
		else{
			throw new Error("Only horizontal and vertical movements are allowed");
		}
		return this._jump(x+dx,y+dy,x,y);
	}

	/**
	*Find the neighbors for the given node. If the node has a parent,
	*prune the neighbors based on the jump point search algorithm,otherwise
	*return all available neighbors.
	*@return {Array<Array<number>>}The neighbors found.
	*/
	__proto._findNeighbors=function(node){
		var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px=0,py=0,nx=0,ny=0,dx=0,dy=0,neighbors=[],neighborNodes,neighborNode,i=0,l=0;
		if (parent){
			px=parent.x;
			py=parent.y;
			dx=(x-px)/ Math.max(Math.abs(x-px),1);
			dy=(y-py)/ Math.max(Math.abs(y-py),1);
			if (dx!==0){
				if (grid.isWalkableAt(x,y-1)){
					neighbors.push([x,y-1]);
				}
				if (grid.isWalkableAt(x,y+1)){
					neighbors.push([x,y+1]);
				}
				if (grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y]);
				}
			}
			else if (dy!==0){
				if (grid.isWalkableAt(x-1,y)){
					neighbors.push([x-1,y]);
				}
				if (grid.isWalkableAt(x+1,y)){
					neighbors.push([x+1,y]);
				}
				if (grid.isWalkableAt(x,y+dy)){
					neighbors.push([x,y+dy]);
				}
			}
		}
		else{
			neighborNodes=grid.getNeighbors(node,DiagonalMovement.Never);
			for (i=0,l=neighborNodes.length;i < l;++i){
				neighborNode=neighborNodes[i];
				neighbors.push([neighborNode.x,neighborNode.y]);
			}
		}
		return neighbors;
	}

	return JPFNeverMoveDiagonally;
})(JumpPointFinderBase)



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