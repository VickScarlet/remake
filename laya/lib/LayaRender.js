/**
 * Matter.js 渲染器在 LayaAir 的实现。
 */
(function()
{
	var LayaRender = {};

	var Common = Matter.Common;
	var Composite = Matter.Composite;
	var Bounds = Matter.Bounds;
	var Events = Matter.Events;
	var Grid = Matter.Grid;
	var Vector = Matter.Vector;

	/**
	 * 创建新的渲染器。
	 * @param  {object} options 所有属性都有默认值，options中的属性会覆盖默认属性。
	 * @return {render}         返回创建的旋绕器
	 */
	LayaRender.create = function(options)
	{
		var defaults = {
			controller: LayaRender,
			engine: null,
			element: null,
			canvas: null,
			mouse: null,
			frameRequestId: null,
			options:
			{
				width: 800,
				height: 600,
				pixelRatio: 1,
				background: '#fafafa',
				wireframeBackground: '#222222',
				hasBounds: !!options.bounds,
				enabled: true,
				wireframes: true,
				showSleeping: true,
				showDebug: false,
				showBroadphase: false,
				showBounds: false,
				showVelocity: false,
				showCollisions: false,
				showSeparations: false,
				showAxes: false,
				showPositions: false,
				showAngleIndicator: false,
				showIds: false,
				showShadows: false,
				showVertexNumbers: false,
				showConvexHulls: false,
				showInternalEdges: false,
				showMousePosition: false
			}
		};
		var render = Common.extend(defaults, options);
		render.mouse = options.mouse;
		render.engine = options.engine;
		// 如果用户没有指定contaienr，默认使用stage
		render.container = render.container || Laya.stage;
		render.bounds = render.bounds ||
		{
			min:
			{
				x: 0,
				y: 0
			},
			max:
			{
				x: render.width,
				y: render.height
			}
		};

		return render;
	}

	/**
	 * 运行渲染器。
	 * @param  {render} render 渲染的目标是LayaRender.create()返回的对象
	 * @return {void}
	 */
	LayaRender.run = function(render)
	{
		Laya.timer.frameLoop(1, this, LayaRender.world, [render]);
		Events.on(render.engine.world, 'afterRemove', LayaRender.onRemoveSprite);
	};

	/**
	 * 停止渲染器。
	 * @param  {render} LayaRender.create()返回的对象
	 * @return {void}
	 */
	LayaRender.stop = function(render)
	{
		Laya.timer.clear(this, LayaRender.world);
		Events.off(render.engine.world, 'afterRemove', LayaRender.onRemoveSprite);
	}

	LayaRender.onRemoveSprite = function(args)
	{
		var sprite = args.object.layaSprite;
		if (sprite && sprite.parent)
			sprite.parent.removeChild(sprite);
	}

	/**
	 * 渲染给定的 engine 的 Matter.World 对象。
	 * 这是渲染的入口，每次场景改变时都应该被调用。
	 * @param  {render} render
	 * @return {void}
	 */
	LayaRender.world = function(render)
	{
		var engine = render.engine,
			world = engine.world,
			renderer = render.renderer,
			container = render.container,
			options = render.options,
			bodies = Composite.allBodies(world),
			allConstraints = Composite.allConstraints(world),
			constraints = [],
			i;

		if (options.wireframes)
		{
			LayaRender.setBackground(render, options.wireframeBackground);
		}
		else
		{
			LayaRender.setBackground(render, options.background);
		}

		// 处理 bounds
		var boundsWidth = render.bounds.max.x - render.bounds.min.x,
			boundsHeight = render.bounds.max.y - render.bounds.min.y,
			boundsScaleX = boundsWidth / render.options.width,
			boundsScaleY = boundsHeight / render.options.height;

		if (options.hasBounds)
		{
			// 隐藏不在视口内的bodies
			for (i = 0; i < bodies.length; i++)
			{
				var body = bodies[i];
				body.render.sprite.visible = Bounds.overlaps(body.bounds, render.bounds);
			}

			// 过滤掉不在视口内的 constraints
			for (i = 0; i < allConstraints.length; i++)
			{
				var constraint = allConstraints[i],
					bodyA = constraint.bodyA,
					bodyB = constraint.bodyB,
					pointAWorld = constraint.pointA,
					pointBWorld = constraint.pointB;

				if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
				if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

				if (!pointAWorld || !pointBWorld)
					continue;

				if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
					constraints.push(constraint);
			}

			// 改变视口
			container.scale(1 / boundsScaleX, 1 / boundsScaleY);
			container.pos(-render.bounds.min.x * (1 / boundsScaleX), -render.bounds.min.y * (1 / boundsScaleY));
		}
		else
		{
			constraints = allConstraints;
		}

		for (i = 0; i < bodies.length; i++)
			LayaRender.body(render, bodies[i]);

		for (i = 0; i < constraints.length; i++)
			LayaRender.constraint(render, constraints[i]);
	};

	/**
	 * 设置背景色或者背景图片。
	 * @param {render} render
	 * @param {string} background 16进制颜色字符串或者图片路径
	 */
	LayaRender.setBackground = function(render, background)
	{
		if (render.currentBackground !== background)
		{
			var isColor = background.indexOf && background.indexOf('#') !== -1;

			render.container.graphics.clear();

			if (isColor)
			{
				// 使用纯色背景
				render.container.bgColor = background;
			}
			else
			{
				render.container.loadImage(background);
				// 使用背景图片时把背景色设置为白色
				render.container.bgColor = "#FFFFFF";
			}

			render.currentBackground = background;
		}
	}

	/**
	 * 渲染 body
	 * @param  {render} render
	 * @param  {body} body
	 * @return {void}
	 */
	LayaRender.body = function(render, body)
	{
		var engine = render.engine,
			bodyRender = body.render;

		if (!bodyRender.visible)
			return;

		// 有纹理的body
		if (bodyRender.sprite && bodyRender.sprite.texture)
		{
			var spriteId = 'b-' + body.id,
				sprite = body.layaSprite,
				container = render.container;

			// 如果sprite不存在，则初始化一个
			if (!sprite)
				sprite = body.layaSprite = _createBodySprite(render, body);

			// 如果sprite未在显示列表，则添加至显示列表
			if (!container.contains(sprite))
				container.addChild(sprite);

			// 更新sprite位置
			sprite.x = body.position.x;
			sprite.y = body.position.y;
			sprite.rotation = body.angle * 180 / Math.PI;
			sprite.scaleX = bodyRender.sprite.xScale || 1;
			sprite.scaleY = bodyRender.sprite.yScale || 1;
		}
		else // 没有纹理的body
		{
			var primitiveId = 'b-' + body.id,
				sprite = body.layaSprite,
				container = render.container;

			// 如果sprite不存在，则初始化一个
			if (!sprite)
			{
				sprite = body.layaSprite = _createBodyPrimitive(render, body);
				sprite.initialAngle = body.angle;
			}

			// 如果sprite未在显示列表，则添加至显示列表
			if (!container.contains(sprite))
				container.addChild(sprite);
			// 更新sprite位置
			sprite.x = body.position.x;
			sprite.y = body.position.y;
			sprite.rotation = (body.angle - sprite.initialAngle) * 180 / Math.PI;
		}
	};

	/**
	 * 创建使用纹理的Sprite对象。
	 * @param  {render} render
	 * @param  {body} body
	 * @return {void}
	 */
	var _createBodySprite = function(render, body)
	{
		var bodyRender = body.render,
			texturePath = bodyRender.sprite.texture,
			sprite = new Laya.Sprite();

		sprite.loadImage(texturePath);
		sprite.pivotX = body.render.sprite.xOffset;
		sprite.pivotY = body.render.sprite.yOffset;

		return sprite;
	};

	/**
	 * 创建使用矢量绘图的Sprite对象。
	 * @param  {render} render
	 * @param  {body} body
	 * @return {void}
	 */
	var _createBodyPrimitive = function(render, body)
	{
		var bodyRender = body.render,
			options = render.options,
			sprite = new Laya.Sprite(),
			fillStyle, strokeStyle, lineWidth,
			part, points = [];

		var primitive = sprite.graphics;
		primitive.clear();

		// 处理 compound parts
		for (var k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++)
		{
			part = body.parts[k];

			if (!options.wireframes)
			{
				fillStyle = bodyRender.fillStyle;
				strokeStyle = bodyRender.strokeStyle;
				lineWidth = bodyRender.lineWidth;
			}
			else
			{
				fillStyle = null;
				strokeStyle = '#bbbbbb';
				lineWidth = 1;
			}

			points.push(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);

			for (var j = 1; j < part.vertices.length; j++)
			{
				points.push(part.vertices[j].x - body.position.x, part.vertices[j].y - body.position.y);
			}

			points.push(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);

			primitive.drawPoly(0, 0, points, fillStyle, strokeStyle, lineWidth);

			// 角度指示器
			if (options.showAngleIndicator || options.showAxes)
			{
				lineWidth = 1;
				if (options.wireframes)
				{
					strokeStyle = '#CD5C5C';
				}
				else
				{
					strokeStyle = bodyRender.strokeStyle;
				}

				primitive.drawLine(part.position.x - body.position.x, part.position.y - body.position.y,
					((part.vertices[0].x + part.vertices[part.vertices.length - 1].x) / 2 - body.position.x),
					((part.vertices[0].y + part.vertices[part.vertices.length - 1].y) / 2 - body.position.y));
			}
		}

		return sprite;
	};

	/**
	 * 绘制 constraint。
	 * @param  {render} render
	 * @param  {constraint} constraint
	 * @return {void}
	 */
	LayaRender.constraint = function(render, constraint)
	{
		var engine = render.engine,
			bodyA = constraint.bodyA,
			bodyB = constraint.bodyB,
			pointA = constraint.pointA,
			pointB = constraint.pointB,
			container = render.container,
			constraintRender = constraint.render,
			primitiveId = 'c-' + constraint.id,
			sprite = constraint.layaSprite;

		// 如果sprite不存在，则初始化一个
		if (!sprite)
			sprite = constraint.layaSprite = new Laya.Sprite();

		var primitive = sprite.graphics;

		// constraint 没有两个终点时不渲染
		if (!constraintRender.visible || !constraint.pointA || !constraint.pointB)
		{
			primitive.clear();
			return;
		}

		// 如果sprite未在显示列表，则添加至显示列表
		if (!container.contains(sprite))
			container.addChild(sprite);

		// 渲染 constraint
		primitive.clear();

		var fromX, fromY, toX, toY;
		if (bodyA)
		{
			fromX = bodyA.position.x + pointA.x;
			fromY = bodyA.position.y + pointA.y;
		}
		else
		{
			fromX = pointA.x;
			fromY = pointA.y;
		}

		if (bodyB)
		{
			toX = bodyB.position.x + pointB.x;
			toY = bodyB.position.y + pointB.y;
		}
		else
		{
			toX = pointB.x;
			toY = pointB.y;
		}

		primitive.drawLine(fromX, fromY, toX, toY, constraintRender.strokeStyle, constraintRender.lineWidth);
	};

	window.LayaRender = LayaRender;
})();