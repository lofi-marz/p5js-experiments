import React, {useState} from 'react';
import Sketch from 'react-p5';
import P5 from 'p5';
import { Color } from 'p5';




class Star {
    x: number;
    y: number;
    z: number;

    constructor(startX: number, startY: number, startZ = 0) {
        this.x = startX;
        this.y = startY;
        this.z = startZ;
    }


}


function gradientLine(p5:P5, x1: number, y1: number, x2: number, y2: number, c1: Color, c2: Color) {
    p5.noStroke();
    const lineLength = Math.sqrt((x1-x2) ** 2 + (y1-y2) ** 2);
    for (let i = 0; i < lineLength; i += 0.5) {
        const progress = i/lineLength;
        const color = p5.lerpColor(c1, c2, progress);
        p5.fill(color);
        p5.circle(p5.lerp(x1, x2, progress), p5.lerp(y1, y2, progress), 0.5);
    }
}


const ShootingStarsSketch: React.FC = () => {

    const [stars, setStars] = useState<Star[]>([]);
    const [speed, setSpeed] = useState(0.2);
    const trailLength = 50;
    //See annotations in JS for more information
    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth/2, p5.windowHeight/2).parent(canvasParentRef);
        const newStars: Star[] = [];
        for (let i = 0; i < 10; i++) {
            const x = p5.random(p5.width);
            const y = p5.random(p5.height);
            const z = p5.random(-1,1);
            newStars.push(new Star(x,y, z));
        }
        setStars(newStars);
    };

    const drawStar = (s: Star, p5: P5) => {
        const trailColor: Color = p5.color(255,255,255);
        const trailEnd = p5.color(255,255,255, 0);

        gradientLine(p5, s.x, s.y, s.x + trailLength, s.y - trailLength,trailColor, trailEnd);
        p5.fill('white');
        p5.ellipse(s.x, s.y, 5, 5);
    };

    const updateStar = (s: Star, p5: P5) => {
        s.x += -speed*p5.deltaTime;
        s.y += speed*p5.deltaTime;
        if (s.x < -trailLength || s.y > p5.height + trailLength) {
            //We can't just put it in a random position since then the stars will just magically pop out of nowhere
            if (p5.random() > 0.5) {
                s.x = p5.random(p5.width);
                s.y = 0;
            } else {
                s.x = p5.width;
                s.y = p5.random(p5.height);
            }
        }
    };

    const draw = (p5: P5) => {
        p5.background(0,0,0,127);
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            drawStar(s, p5);
            updateStar(s, p5);
        }
    };

    const onMouseMove = (p5: P5) => {
        setSpeed(p5.mouseX/2000);
    };

    const onWindowResize = (p5: P5) => {
        p5.resizeCanvas(p5.windowWidth/2, p5.windowHeight/2);
    };

    return <Sketch setup={setup} mouseMoved={onMouseMove} windowResized={onWindowResize} draw={draw} />;
};

export default ShootingStarsSketch;