import React from 'react';
import P5 from 'p5';
import BackgroundSketch from '../components/BackgroundSketch';


/*
function clamp(min: number, val: number, max: number): number {

    //If val < min
    //Math.max returns min
    //Math.min(min, max) returns min
    //If val > max
    //Math.max returns val
    // Math.min val, max returns max

    return Math.min(Math.max(min, val), max);
}


function smoothMin(a: number, b: number, k: number): number {
    const h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return (a * h) + b * (1-h) - k*h*(1.0-h);
}*/

/*
function smoothMax(a: number, b: number, k: number): number {
    return -smoothMin(-a, -b, k);
}*/


interface Drawable {
    draw: (p5: P5, elapsedTime: number) => void;
}

class Layer implements Drawable{
    innerRadius: number;
    outerRadius: number;
    roughness: number;
    speed: number;

    constructor(innerRadius: number, outerRadius: number, roughness = 1, speed = 0.5) {
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.roughness = roughness;
        this.speed = speed;
    }

    calcR(p5: P5, theta: number, elapsedTime: number) {
        const phase = this.speed * elapsedTime/2;

        //phase controls rotation speed
        //xoff and yoff give a noise value to a specific point
        //zoff changes that through time

        const xoff =  p5.map(p5.cos(theta + phase), -1, 1, 0, this.roughness); //The x component of the value
        const yoff =  p5.map(p5.sin(theta + phase), -1, 1, 0, this.roughness); //The y component of the value
        const zoff = this.speed * elapsedTime/2;

        const noise = p5.noise(xoff, yoff, zoff);

        //let r = p5.map(noise, 0, 1, this.innerRadius,this.outerRadius);
        return (noise + 1)/2 * p5.map(p5.sin(6 * theta + phase), -1, 1, this.innerRadius, this.outerRadius);
    }

    draw(p5: P5, elapsedTime: number) {
        p5.beginShape();
        p5.strokeJoin(p5.ROUND);


        for (let theta = 0; theta < p5.TAU; theta += p5.TAU/1000) {

            //console.log({i, theta});
            const r = this.calcR(p5,theta, elapsedTime);
            const x = p5.cos(theta) * r;
            const y = p5.sin(theta) * r;
            




            p5.vertex(x, y);
        }
        p5.endShape(p5.CLOSE);
    }

}

class MultiLayer implements Drawable {
    layers: Layer[] = [];

    calcR(p5: P5, theta: number, elapsedTime: number) {
        const rs = this.layers.map(l => l.calcR(p5, theta, elapsedTime));
        return rs.reduce((acc, curr) => acc + curr)/rs.length;

    }


    draw(p5: P5, elapsedTime: number) {
        p5.beginShape();
        p5.strokeJoin(p5.ROUND);


        for (let theta = 0; theta < p5.TAU; theta += p5.TAU/1000) {

            //console.log({i, theta});
            const r = this.calcR(p5,theta, elapsedTime);
            const x = p5.cos(theta) * r;
            const y = p5.sin(theta) * r;





            p5.vertex(x, y);
        }
        p5.endShape(p5.CLOSE);
    }

    constructor(layers: Layer[]) {
        this.layers = layers;
    }

}

const VisualiserSketch: React.FC = () => {

    let elapsedTime = 0;

    const layers: Drawable[] = [];

    const setup = (p5: P5, canvasParentRef: Element) => {

        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        p5.createCanvas(500, 500).parent(canvasParentRef);
        layers.push(new Layer(150, 225));
        layers.push(new Layer(150, 225, 1, -0.5));
        layers.push(new MultiLayer([
            new Layer(150, 225),
            new Layer(200, 225, 1, 0.6)
        ]));
    };

    const draw = (p5: P5) => {
        elapsedTime += p5.deltaTime / 1000;
        p5.clear();
        p5.translate(p5.width/2, p5.height/2);

        p5.stroke(255,200);
        p5.strokeWeight(2);
        //p5.fill(255,200);
        layers.forEach(l => l.draw(p5, elapsedTime));

        p5.fill('black');
        p5.noStroke();
        //p5.circle(0,0, innerRadius * 2);




    };


    /*const onWindowResize = (p5: P5) => {
        p5.resizeCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE);
    };*/



    return <BackgroundSketch setup={setup} draw={draw} />;
};

export default VisualiserSketch;

