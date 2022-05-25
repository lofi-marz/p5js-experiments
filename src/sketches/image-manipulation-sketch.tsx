import React from 'react';
import Sketch from 'react-p5';
import P5, { Color } from 'p5';
import rubyImage from './rubysquare.png';

interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    d: number;
    color: Color;
}

const ImageManipulationSketch: React.FC = () => {
    let img: P5.Image;
    let elapsedTime = 0;
    const particles: Particle[] = [];
    const size = 16;
    const resolution = size / 4;

    const preload = (p5: P5) => {
        img = p5.loadImage(rubyImage);
    };

    const setup = (p5: P5, canvasParentRef: Element) => {
        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        p5.createCanvas(250, 250).parent(canvasParentRef);

        //p5.pixelDensity(1);
        img.loadPixels();

        for (let x = 0; x < img.width; x += resolution) {
            for (let y = 0; y < img.height; y += resolution) {
                const i = (x + y * img.width) * 4;
                const r = img.pixels[i];
                const g = img.pixels[i + 1];
                const b = img.pixels[i + 2];

                //const magnitude = ((r+g+b)/3)/255;

                particles.push({
                    x,
                    y,
                    dx: 0,
                    dy: 0,
                    d: size,
                    color: p5.color(r, g, b),
                });
                //particles.push({x,y,dx:0, dy:0, d:size/4, color: p5.color('white')});
            }
        }
    };

    const draw = (p5: P5) => {
        p5.clear();
        elapsedTime += p5.deltaTime / 500;

        particles.forEach((p) => {
            const d = p5.dist(p.x, p.y, 125, 125);
            p.dx = 0 * p5.sin(elapsedTime + d / 64) * 5;
            p.dy = p5.cos(elapsedTime + d / 64) * 5;

            //p.y += p5.cos(elapsedTime) * 5;

            p5.fill(p5.color(p.color));
            p5.noStroke();
            p5.square(p.x + p.dx, p.y + p.dy, p.d);
        });

        //TODO: Make this more efficient

        p5.updatePixels();
    };

    /*const onWindowResize = (p5: P5) => {
        p5.resizeCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE);
    };*/

    return <Sketch preload={preload} setup={setup} draw={draw} />;
};

export default ImageManipulationSketch;
