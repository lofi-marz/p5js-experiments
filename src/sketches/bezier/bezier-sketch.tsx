import React from 'react';
import P5 from 'p5';
import Sketch from 'react-p5';

function point(x: number, y: number) {
    return { x, y };
}

type Point = ReturnType<typeof point>;

function generatePoints(oldPoints: Point[][]): Point[][] {
    let ps = [...oldPoints];
    if (ps.length == 0) return oldPoints;
    ps = [ps[0]];
    while (ps[ps.length - 1].length > 1) {
        const lastGen = ps[ps.length - 1];
        const nextGen = [];
        for (let i = 0; i < lastGen.length - 1; i++) {
            nextGen.push(lastGen[i]);
        }
        ps.push(nextGen);
    }
    return ps;
}

function nearestPoint(p5: P5, ps: Point[][]) {
    return ps[0].reduce((curr, next) => {
        const distToCurr = p5.dist(curr.x, curr.y, p5.mouseX, p5.mouseY);
        const distToNext = p5.dist(next.x, next.y, p5.mouseX, p5.mouseY);
        if (distToCurr < distToNext) {
            return curr;
        } else {
            return next;
        }
    });
}

function drawPoints(p5: P5, points: Point[], gen: number) {
    const hue = p5.map(gen, 0, points.length, 0, 255);
    p5.fill(hue, 100, 100);
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p5.circle(p.x, p.y, 10);

        if (i === points.length - 1) continue;
        p5.line(p.x, p.y, points[i + 1].x, points[i + 1].y);
    }
}

export const BezierSketch: React.FC = () => {
    let t = 0;
    let ps: Point[][] = [];
    let curvePoints: Point[] = [];
    let movingPoint: Point | null;
    let ctx: P5.Renderer;

    const setup = (p5: P5, canvasParentRef: Element) => {
        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        p5.createCanvas(500, 500).parent(canvasParentRef);

        p5.colorMode(p5.HSB);
        ps.push([
            point(200, 200),
            point(250, 200),
            point(300, 300),
            point(100, 300),
        ]);
        ps = generatePoints(ps);
        console.log(ps);
    };

    const draw = (p5: P5) => {
        p5.background(220);
        t += 1 / 120;
        if (t >= 1) {
            curvePoints = [];
            t %= 1;
        }
        p5.text(p5.round(t, 2), 50, 50);
        if (ps.length == 0) return;
        if (movingPoint) {
            movingPoint.x = p5.mouseX;
            movingPoint.y = p5.mouseY;
        }

        for (let i = 1; i < ps.length; i++) {
            const points = ps[i];
            for (let j = 0; j < points.length; j++) {
                const start = ps[i - 1][j];
                const end = ps[i - 1][j + 1];
                const x = p5.lerp(start.x, end.x, t);
                const y = p5.lerp(start.y, end.y, t);
                points[j] = point(x, y);
            }
        }

        for (let i = 0; i < ps.length; i++) {
            const points = ps[i];
            drawPoints(p5, points, i);
        }

        curvePoints.push(ps[ps.length - 1][0]);
        if (!movingPoint) {
            p5.push();
            p5.noFill();
            p5.strokeWeight(5);
            p5.beginShape();
            curvePoints.forEach((p) => p5.vertex(p.x, p.y));
            p5.endShape();
            p5.pop();
        }
    };

    const onMousePressed = (p5: P5) => {
        if (p5.keyIsDown(p5.SHIFT)) {
            ps[0].pop();
        } else if (p5.keyIsDown(p5.ALT)) {
            ps[0].push(point(p5.mouseX, p5.mouseY));
        } else {
            if (movingPoint) {
                movingPoint = null;
            } else {
                movingPoint = nearestPoint(p5, ps);
            }
        }
        console.log(movingPoint);
        ps = generatePoints(ps);
    };

    return <Sketch setup={setup} draw={draw} mousePressed={onMousePressed} />;
};
