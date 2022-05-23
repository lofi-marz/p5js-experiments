import React from 'react';
import P5 from 'p5';

import dynamic from 'next/dynamic';

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5'), {
    ssr: false,
});

interface Vertex {
    x: number;
    y: number;
}

const test = [];
test.push();

const fTheta = (theta: number, sides: number) => {
    const pin = Math.PI / sides;
    return Math.cos(pin) / Math.cos((theta % (2 * pin)) - pin);
};

const generateShape = (sides: number, resolution: number): Vertex[] => {
    const vertices: Vertex[] = [];

    if (sides == 0) sides = resolution; //Interpret 0 as a circle

    for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / resolution) {
        //const r = 200 * fTheta(theta, p5.map(p5.sin(elapsedTime), -1, 1, 3, 10));
        const r = 100 * fTheta(theta, sides);
        const x = r * Math.cos(theta - Math.PI / 2);
        const y = r * Math.sin(theta - Math.PI / 2);
        vertices.push({ x, y });
    }

    return vertices;
};

export const PolygonMorphSketch: React.FC = () => {
    let progress = 0;

    const solid = false;
    const res = 200;

    //Full rotations per second and full transitions per second
    const rotationSpeed = 1;
    const transitionSpeed = 1;

    const pauseTime = 1000;

    let remainingPauseTime = 0;

    let toCircle = true;

    let currSides = 0;
    let nextSides = 4;

    let curr = generateShape(currSides, res);
    let next = generateShape(nextSides, res);

    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.colorMode(p5.HSB, 255);
        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        if (canvasParentRef.children.length == 0)
            p5.createCanvas(500, 500).parent(canvasParentRef);
    };

    const draw = (p5: P5) => {
        p5.background(0, 150);
        p5.translate(p5.width / 2, p5.height / 2);

        if (remainingPauseTime > 0) {
            remainingPauseTime -= p5.deltaTime;
            //return;
        } else {
            //We want it to pause on the position and rotation
            progress += (transitionSpeed * p5.deltaTime) / 1000;
            //This looks silly I'm just using it as a clamp function

            p5.rotate(
                p5.map(progress, 0, 1, 0, rotationSpeed * 2 * Math.PI, true)
            );
        }

        if (progress >= 1) {
            toCircle = !toCircle;
            progress = 0;

            if (toCircle) remainingPauseTime = pauseTime;

            currSides = nextSides;
            nextSides = toCircle ? 0 : p5.round(p5.random(3, 10));

            curr = [...next];

            next = generateShape(nextSides, res);
        }

        if (solid) {
            p5.noStroke();
            p5.fill('white');
        } else {
            p5.noFill();
            p5.strokeWeight(10);
            p5.strokeJoin(p5.ROUND);

            //const hue = 200 + 55 * (p5.sin(progress * 2 * Math.PI) + 1);
            //p5.stroke(hue, 200, 223);

            p5.stroke('white');

            /*const currHue = p5.color(p5.map(currSides, 0, 10, 0, 255), 200, 200);
            const nextHue = p5.color(p5.map(nextSides, 0, 10, 0, 255), 200, 200);*/
        }

        // if (toCircle) p5.fill('blue');

        p5.beginShape();
        for (let i = 0; i < curr.length; i++) {
            const x = p5.lerp(curr[i].x, next[i].x, progress);
            const y = p5.lerp(curr[i].y, next[i].y, progress);
            p5.vertex(x, y);
        }

        p5.endShape();
    };

    /*const onWindowResize = (p5: P5) => {
        p5.resizeCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE);
    };*/

    return <Sketch setup={setup} draw={draw} />;
};
