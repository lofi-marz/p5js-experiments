import React from 'react';

import P5 from 'p5';
import Sketch from 'react-p5';

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
}


function smoothMax(a: number, b: number, k: number): number {
    return -smoothMin(-a, -b, k);
}*/

class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    //Idk how to make this useful
    public map(f: (...args: any[]) => number): Vector3 {
        return new Vector3(f(this.x), f(this.y), f(this.z));
    }

    public static mid(v1: Vector3, v2: Vector3) {
        const midX = (v1.x + v2.x) / 2;
        const midY = (v1.y + v2.y) / 2;
        const midZ = (v1.z + v2.z) / 2;
        return new Vector3(midX, midY, midZ);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize() {
        const length = this.length();
        const normalized = this.map((n) => n / length);
        this.x = normalized.x;
        this.y = normalized.y;
        this.z = normalized.z;
    }
}

function calcAngle(v: Vector3): number {
    let angle = 0;
    if (v.z > 0) {
        angle = Math.atan(v.x / v.z);
    } else if (v.z < 0 && v.x >= 0) {
        angle = Math.atan(v.x / v.z) + Math.PI;
    } else if (v.z < 0 && v.x < 0) {
        angle = Math.atan(v.x / v.z) - Math.PI;
    } else if (v.z == 0 && v.x > 0) {
        angle = Math.PI / 2;
    } else if (v.z == 0 && v.x < 0) {
        angle = -Math.PI / 2;
    }
    return Math.PI / 2 - angle;
}

function generateIcosahedronVertices(): Vector3[] {
    const phi = (1 + Math.sqrt(5)) / 2;
    //Generate the vertices
    const vertices: Vector3[] = [];

    vertices.push(new Vector3(-1, phi, 0));
    vertices.push(new Vector3(1, phi, 0));
    vertices.push(new Vector3(-1, -phi, 0));
    vertices.push(new Vector3(1, -phi, 0));

    vertices.push(new Vector3(0, -1, phi));
    vertices.push(new Vector3(0, 1, phi));
    vertices.push(new Vector3(0, -1, -phi));
    vertices.push(new Vector3(0, 1, -phi));

    vertices.push(new Vector3(phi, 0, -1));
    vertices.push(new Vector3(phi, 0, 1));
    vertices.push(new Vector3(-phi, 0, -1));
    vertices.push(new Vector3(-phi, 0, 1));
    vertices.push(new Vector3(0, 1, 0));
    vertices.push(new Vector3(1, 0, 0));
    vertices.push(new Vector3(0, 0, 1));

    // create 20 triangles of the icosahedron
    const faces: [number, number, number][] = [];

    // 5 faces around point 0
    faces.push([0, 11, 5]);
    faces.push([0, 5, 1]);
    faces.push([0, 1, 7]);
    faces.push([0, 7, 10]);
    faces.push([0, 10, 11]);
    // 5 adjacent faces
    faces.push([1, 5, 9]);
    faces.push([5, 11, 4]);
    faces.push([11, 10, 2]);
    faces.push([10, 7, 6]);
    faces.push([7, 1, 8]);

    // 5 faces around point 3
    faces.push([3, 9, 4]);
    faces.push([3, 4, 2]);
    faces.push([3, 2, 6]);
    faces.push([3, 6, 8]);
    faces.push([3, 8, 9]);

    // 5 adjacent faces
    faces.push([4, 9, 5]);
    faces.push([2, 4, 11]);
    faces.push([6, 2, 10]);
    faces.push([8, 6, 7]);
    faces.push([9, 8, 1]);

    const realVertexList: Vector3[] = [];
    faces.forEach((f) => {
        realVertexList.push(vertices[f[2]]);
        realVertexList.push(vertices[f[1]]);
        realVertexList.push(vertices[f[0]]);
    });
    return realVertexList;
}

function splitTriangles(vertices: Vector3[]): Vector3[] {
    const newVertices = [];

    for (let i = 0; i < vertices.length - 2; i += 3) {
        const point1 = vertices[i];
        const point2 = vertices[i + 1];
        const point3 = vertices[i + 2];
        const mid1 = Vector3.mid(point1, point2);
        const mid2 = Vector3.mid(point2, point3);
        const mid3 = Vector3.mid(point3, point1);

        const newPoints: Vector3[] = [
            point1,
            mid1,
            mid3,
            mid1,
            point2,
            mid2,
            mid3,
            mid2,
            point3,
            mid1,
            mid2,
            mid3,
        ];

        for (let j = 0; j < newPoints.length; j++) {
            newVertices.push(newPoints[j]);
        }
    }

    return newVertices;
}

function generateIcosphere(radius: number, divisions = 3): Vector3[] {
    let vertices = generateIcosahedronVertices();
    let uniqueVertices: Vector3[] = [];

    for (let i = 0; i < divisions; i++) {
        vertices = splitTriangles(vertices);
    }

    vertices.forEach((v) => {
        if (
            !uniqueVertices.some(
                (v2) => v.x == v2.x && v.y == v2.y && v.z == v2.z
            )
        )
            uniqueVertices.push(new Vector3(v.x, v.y, v.z));
    });

    uniqueVertices = uniqueVertices.map((v) => {
        v.normalize();
        return v.map((n) => n * radius);
    });
    const layers = new Map<number, Vector3[]>();
    uniqueVertices.forEach((v) => {
        if (!layers.has(v.y)) layers.set(v.y, []);

        const layer = layers.get(v.y);
        if (!layer) return;

        layer.push(v);

        layers.set(v.y, layer);
    });
    const sortedVertices: Vector3[] = [];
    console.log(layers);
    layers.forEach((l) => {
        sortedVertices.push(
            ...l.sort((a, b) => {
                const aTheta = calcAngle(a);
                const bTheta = calcAngle(b);
                return aTheta - bTheta;
            })
        );
    });

    console.log(sortedVertices[0]);
    console.log(sortedVertices[sortedVertices.length - 1]);
    return sortedVertices;
}

export const GlTestSketch: React.FC = () => {
    let hue1: number;
    let hue2: number;

    const rotationSpeed = Math.PI / 16;
    const vertices = generateIcosphere(200, 3);

    let elapsedTime = 0;

    const setup = (p5: P5, canvasParentRef: Element) => {
        //p5.createCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE).parent(canvasParentRef);
        p5.createCanvas(500, 500, p5.WEBGL).parent(canvasParentRef);
        p5.colorMode(p5.HSB, 255);

        //Get the colours from the palette
        //The modulo is because the start and end of hue are red
        //We want the end to avoid going through the whole colour wheel
        // |r oygbi v r| to go from v to r instead of r to v;
        hue2 = (100 + 255) % 256;
        hue1 = (120 + 255) % 256;
        if (hue1 > hue2) {
            const temp = hue1;
            hue1 = hue2;
            hue2 = temp;
        }
        console.log(hue1);
        console.log(hue2);
    };

    const draw = (p5: P5) => {
        elapsedTime += p5.deltaTime / 1000;
        p5.clear();

        //p5.translate(p5.width/2, p5.height/2, 0);
        p5.noStroke();

        //console.log(highlighted, vertices[highlighted]);
        /*
        const locX = p5.mouseX - p5.height / 2;
        const locY = p5.mouseY - p5.width / 2;
        p5.colorMode(p5.RGB);
        p5.ambientLight(255, 255, 255);
        p5.pointLight(255, 255, 255, locX, locY, 100);
        p5.colorMode(p5.HSB);*/
        //p5.rotateX(rotationSpeed * p5.millis()/1000);
        //p5.rotateX(p5.map(p5.mouseY, 0, p5.height, Math.PI/4, -Math.PI/8, true));

        p5.rotateZ(Math.PI / 4);
        p5.rotateY(rotationSpeed * elapsedTime);

        //console.log(highlighted);

        for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];

            p5.translate(v.x, v.y, v.z);
            //const val = p5.map(v.y * (Math.pow(p5.sin(p5.millis()/1000), 3)), -50, 50, 0, 255);
            //const val = p5.map(p5.sin(v.y/10 + p5.millis()/1000), -1, 1, 200, 255);
            //const mouseAngle = p5.map(p5.mouseX * p5.mouseY, 0, p5.width * p5.height, 0, 205, true);
            const yOffset = p5.map(v.y, -100, 100, 0, Math.PI);
            const val = p5.map(
                p5.sin(yOffset + elapsedTime),
                -1,
                1,
                hue1,
                hue2
            );
            //const index = p5.map(i, 0, vertices.length, 0,255);

            p5.fill(p5.color(val, 200, 223));

            //p5.box(2);
            //We don't actually need to render these with a lot of detail since they're so small
            p5.sphere(2, 8, 8);
            //p5.translate(-v.x, -v.y, -v.z);
            p5.translate(-v.x, -v.y, -v.z);
        }
    };

    /*const onWindowResize = (p5: P5) => {
        p5.resizeCanvas(p5.windowWidth * SCALE, p5.windowHeight * SCALE);
    };*/

    return <Sketch setup={setup} draw={draw} />;
};
