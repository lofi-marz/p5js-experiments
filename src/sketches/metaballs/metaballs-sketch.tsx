import React from 'react';
import P5 from 'p5';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5'), {
    ssr: false,
});

const SCALE = 1;

class Metaball {
    x: number;
    y: number;
    r: number;

    startVx: number;
    startVy: number;

    vx: number;
    vy: number;

    constructor(
        startX: number,
        startY: number,
        radius: number,
        startVx: number,
        startVy: number
    ) {
        this.x = startX;
        this.y = startY;
        this.r = radius;

        this.startVx = startVx;
        this.startVy = startVy;

        this.vx = startVx;
        this.vy = startVy;
    }
}

/*function dist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}*/

function squaredDist(x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

export const MetaballsSketch: React.FC = () => {
    let metaballs: Metaball[];

    //See annotations in JS for more information
    const setup = (p5: P5, canvasParentRef: Element) => {
        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        p5.createCanvas(500, 500).parent(canvasParentRef);
        p5.pixelDensity(1);

        metaballs = [];

        for (let i = 0; i < 10; i++) {
            const x = p5.random(p5.width);
            const y = p5.random(p5.height);
            const r =
                p5.random(1) > 0.5
                    ? p5.random(-1000 * SCALE, -100 * SCALE)
                    : p5.random(100 * SCALE, 1000 * SCALE);
            const vx = p5.random(-5 * SCALE, 5 * SCALE);
            const vy = p5.random(-5 * SCALE, 5 * SCALE);
            metaballs.push(new Metaball(x, y, r, vx, vy));
        }
    };

    const draw = (p5: P5) => {
        p5.loadPixels();
        p5.clear();

        //TODO: Make this more efficient

        for (let x = 0; x < p5.width; x++) {
            for (let y = 0; y < p5.height; y++) {
                let density = 0;

                const i = 4 * (x + y * p5.width);

                for (let j = 0; j < metaballs.length; j++) {
                    const m = metaballs[j];

                    //const d = dist(x,y, m.x, m.y);

                    density +=
                        ((p5.abs(m.r) / m.r) * (m.r * m.r)) /
                        squaredDist(x, y, m.x, m.y);

                    //density = p5.map(density, 0, 100, 0, 255, true);
                    //if (density > 0) console.log(density);
                    //if (Math.round(d) == m.r) density = 255;
                }
                density = p5.map(density, -255, 255, 0, 255);
                //console.log(density);
                //if (i % 100 == 0) console.log(density);

                if (density > 240) {
                    density = 255;
                } else if (density < 15) {
                    density = 0;
                } else {
                    density = 50;
                }

                //if (density < slider.value()) density/=

                p5.pixels[i] = density;
                p5.pixels[i + 1] = density;
                p5.pixels[i + 2] = density;
                p5.pixels[i + 3] = 255;
            }
        }

        for (let i = 0; i < metaballs.length; i++) {
            const m = metaballs[i];
            m.x += m.vx;
            m.y += m.vy;

            if (m.x < 0) {
                m.x -= m.vx;
                m.vx = -m.vx;
            } else if (m.x > p5.width) {
                m.x -= m.vx;
                m.vx = -m.vx;
            }

            if (m.y < 0) {
                m.y -= m.vy;
                m.vy = -m.vy;
            } else if (m.y > p5.height) {
                m.y -= m.vy;
                m.vy = -m.vy;
            }
        }

        p5.updatePixels();
        const fps = p5.frameRate();
        p5.fill(255);
        p5.stroke(0);
        p5.text('FPS: ' + fps.toFixed(2), 10, p5.height - 10);
    };

    /*const onWindowResize = (p5: P5) => {
        p5.resizeCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE);
    };*/

    return <Sketch setup={setup} draw={draw} />;
};
