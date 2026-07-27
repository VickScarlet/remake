var Browser = laya.utils.Browser;

var Composite = Matter.Composite;
var Events = Matter.Events;
var Bounds = Matter.Bounds;
var Common = Matter.Common;
var Vertices = Matter.Vertices;
var Vector = Matter.Vector;
var Sleeping = Matter.Sleeping;
var Axes = Matter.Axes;
var Body = Matter.Body;
var SAT = Matter.SAT;
var Contact = Matter.Contact;
var Pair = Matter.Pair;
var Detector = Matter.Detector;
var Grid = Matter.Grid;

var LayaRender = {};

(function()
{
    var graphics,
        spriteCon,
        graphicsCon;

    LayaRender.create = function(options)
    {
        var defaults = {
            controller: LayaRender,
            element: null,
            canvas: null,
            mouse: null,
            options:
            {
                width: 800,
                height: 600,
                pixelRatio: 1,
                background: '#fafafa',
                wireframeBackground: '#222',
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

        render.canvas = laya.renders.Render.canvas;
        render.context = laya.renders.Render.context.ctx;

        render.textures = {};

        render.bounds = render.bounds ||
        {
            min:
            {
                x: 0,
                y: 0
            },
            max:
            {
                x: Laya.stage.width,
                y: Laya.stage.height
            }
        };

        createContainer(render);
        setBackground(render);
        setPixelRatio();

        return render;
    };

    function createContainer(render)
    {
        var con = render.container;

        spriteCon = new Laya.Sprite();
        graphicsCon = new Laya.Sprite();

        render.spriteContainer = spriteCon;
        render.graphicsContainer = graphicsCon;

        con.addChild(spriteCon);
        con.addChild(graphicsCon);

        graphics = graphicsCon.graphics;
    }

    // 设置背景
    function setBackground(render)
    {
        var bg = render.options.background;
        //  纯色背景
        if (bg.length == 7 && bg[0] == '#')
        {
            spriteCon.graphics.drawRect(
                0, 0,
                render.options.width, render.options.height,
                bg);
        }
        // 图片背景
        else
        {
            spriteCon.loadImage(bg);
        }
    }

    function setPixelRatio()
    {
        var pixelRatio;
		pixelRatio = 1;
        Laya.Render.canvas.setAttribute('data-pixel-ratio', pixelRatio);
    }

    /**
     * Renders the given `engine`'s `Matter.World` object.
     * This is the entry point for all rendering and should be called every time the scene changes.
     * @method world
     * @param {engine} engine
     */
    LayaRender.world = function(engine)
    {
        var render = engine.render,
            world = engine.world,
            options = render.options,
            allConstraints = Composite.allConstraints(world),
            bodies = Composite.allBodies(world),
            constraints = [],
            i;

        // handle bounds
        if (options.hasBounds)
        {
            var boundsWidth = render.bounds.max.x - render.bounds.min.x,
                boundsHeight = render.bounds.max.y - render.bounds.min.y,
                boundsScaleX = boundsWidth / options.width,
                boundsScaleY = boundsHeight / options.height;

            // filter out bodies that are not in view
            for (i = 0; i < bodies.length; i++)
            {
                var body = bodies[i];
                body.render.sprite.visible = Bounds.overlaps(body.bounds, render.bounds);
            }

            // filter out constraints that are not in view
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

            // transform the view
            // context.scale(1 / boundsScaleX, 1 / boundsScaleY);
            // context.translate(-render.bounds.min.x, -render.bounds.min.y);
        }
        else
        {
            constraints = allConstraints;
        }

        graphics.clear();
        for (i = 0; i < bodies.length; i++)
            LayaRender.body(engine, bodies[i]);

        for (i = 0; i < constraints.length; i++)
            LayaRender.constraint(engine, constraints[i]);
    };
    LayaRender.body = function(engine, body)
    {
        var render = engine.render,
            bodyRender = body.render;

        if (!bodyRender.visible)
        {
            return;
        }

        var spInfo = bodyRender.sprite;
        var sp = body.sprite;
        if (bodyRender.sprite && bodyRender.sprite.texture)
        {
            // initialize body sprite if not existing
            if (!sp)
            {
                sp = body.sprite = createBodySprite(spInfo.xOffset, spInfo.yOffset);
                sp.loadImage(spInfo.texture);
            }

            sp.scale(spInfo.xScale, spInfo.yScale);
            sp.pos(body.position.x, body.position.y);
            sp.rotation = body.angle * 180 / Math.PI;
        }
        else
        {
            var options = render.options;
            // handle compound parts
            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++)
            {
                part = body.parts[k];

                if (!part.render.visible)
                    continue;

                var fillStyle = options.wireframes ? null : part.render.fillStyle;
                var lineWidth = part.render.lineWidth;
                var strokeStyle = part.render.strokeStyle;
                // part polygon
                if (part.circleRadius)
                {
                    graphics.drawCircle(part.position.x, part.position.y, part.circleRadius, fillStyle, strokeStyle, lineWidth);
                }
                else
                {
                    var path = [];
                    path.push(part.vertices[0].x, part.vertices[0].y);

                    for (var j = 1; j < part.vertices.length; j++)
                    {
                        if (!part.vertices[j - 1].isInternal || showInternalEdges)
                        {
                            path.push(part.vertices[j].x, part.vertices[j].y);
                        }
                        else
                        {
                            path.push(part.vertices[j].x, part.vertices[j].y);
                        }

                        if (part.vertices[j].isInternal && !showInternalEdges)
                        {
                            path.push(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                        }
                    }

                    graphics.drawPoly(0, 0, path, fillStyle, strokeStyle, lineWidth);
                }
            }
        }
    };

    LayaRender.constraint = function(engine, constraint)
    {
        var sx, sy, ex, ey;
        if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
        {
            return;
        }

        var bodyA = constraint.bodyA,
            bodyB = constraint.bodyB;

        if (bodyA)
        {
            sx = bodyA.position.x + constraint.pointA.x;
            sy = bodyA.position.y + constraint.pointA.y;
        }
        else
        {
            sx = constraint.pointA.x;
            sy = constraint.pointA.y;
        }

        if (bodyB)
        {
            ex = bodyB.position.x + constraint.pointB.x;
            ey = bodyB.position.y + constraint.pointB.y;
        }
        else
        {
            ex = constraint.pointB.x;
            ey = constraint.pointB.y;
        }

        graphics.drawLine(
            sx, sy, ex, ey,
            constraint.render.strokeStyle,
            constraint.render.lineWidth);
    };

    function createBodySprite(xOffset, yOffset)
    {
        var sp = new Laya.Sprite();

        sp.pivot(xOffset, yOffset);
        sp.pos(-9999, -9999);
        spriteCon.addChild(sp);

        return sp;
    }
})();