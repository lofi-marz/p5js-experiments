import React from 'react';
import P5 from 'p5';
import Sketch from 'react-p5';

//Something to map the x y point to another

const xCount = 20;
const yCount = 20;
const cellWidth = 500 / xCount;
const cellHeight = 500 / yCount;

class Path {
    start: P5.Vector;

    constructor(startPos: P5.Vector) {
        this.start = startPos;
    }

    draw(p5: P5, flowField: number[][]) {
        const pos = this.start;
        //When starting off, immediately set to the angle we're at, otherwise lerp towards it
        let thetaSet = false;
        let theta = 0;

        p5.noFill();
        p5.beginShape();

        for (let i = 0; i < 500; i++) {
            p5.vertex(pos.x, pos.y);
            const fieldX = p5.floor(p5.map(pos.x, 0, 500, 0, xCount, true));
            const fieldY = p5.floor(p5.map(pos.y, 0, 500, 0, yCount, true));
            if (fieldX < 0 || fieldX >= xCount) break;
            if (fieldY < 0 || fieldY >= yCount) break;
            const flowTheta = flowField[fieldY][fieldX];
            if (!thetaSet) {
                theta = flowTheta;
                thetaSet = true;
            } else {
                theta = p5.lerp(theta, flowTheta, 0.1);
            }
            const xStrength = p5.cos(theta);
            const yStrength = p5.sin(theta);
            pos.x += (xStrength * cellWidth) / 20;
            pos.y += (yStrength * cellHeight) / 20;
        }
        p5.endShape();
    }
}

const VectorFieldSketch: React.FC = () => {
    const flowField: number[][] = [];
    const paths: Path[] = [];

    const drawField = false;

    function generateAngle(p5: P5, x: number, y: number): number {
        return 2 * Math.PI - p5.atan2(y - yCount / 2, x - xCount / 2);
        //return p5.map(x * y, 0, xCount * yCount, -Math.PI, Math.PI);
        //return p5.map(x - y, 0, xCount + yCount, 0, Math.PI);
    }

    const setup = (p5: P5, canvasParentRef: Element) => {
        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        p5.createCanvas(500, 500).parent(canvasParentRef);

        for (let y = 0; y < yCount; y++) {
            if (!flowField[y]) flowField[y] = [];
            for (let x = 0; x < xCount; x++) {
                flowField[y].push(generateAngle(p5, x, y));
                paths.push(new Path(p5.createVector(x * 20, y * 20)));
            }
        }
        console.log(flowField);

        p5.noLoop();
    };

    const draw = (p5: P5) => {
        p5.clear();
        p5.translate(cellWidth / 2, cellHeight / 2);
        p5.stroke('white');
        if (drawField) {
            for (let y = 0; y < yCount; y++) {
                const realY = p5.map(y, 0, yCount, 0, 500);
                for (let x = 0; x < xCount; x++) {
                    const realX = p5.map(x, 0, xCount, 0, 500);
                    const theta = flowField[y][x];
                    const newX = realX + (cellWidth / 2) * p5.cos(theta);
                    const newY = realY + (cellWidth / 2) * p5.sin(theta);
                    p5.circle(realX, realY, 4);
                    p5.line(realX, realY, newX, newY);
                }
            }
        }
        for (const p of paths) {
            p.draw(p5, flowField);
        }
    };

    return <Sketch setup={setup} draw={draw} />;
};

export default VectorFieldSketch;
