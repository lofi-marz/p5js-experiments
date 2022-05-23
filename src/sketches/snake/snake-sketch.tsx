import React from 'react';

import P5 from 'p5';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5'), {
    ssr: false,
});
enum Direction {
    None,
    Up,
    Right,
    Down,
    Left,
}

interface Position {
    x: number;
    y: number;
}

const directions = [
    [0, 0],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

const opposites = [
    Direction.None,
    Direction.Down,
    Direction.Left,
    Direction.Up,
    Direction.Right,
];

class Snake {
    segments: Position[];
    currentDirection: Direction;
    newDirection: Direction;
    hasLost: boolean;
    constructor(startX: number, startY: number) {
        this.segments = [{ x: startX, y: startY }];
        this.currentDirection = Direction.Down;
        this.newDirection = Direction.Down;
        this.hasLost = false;

        for (let i = 1; i < 3; i++) {
            this.segments.push({ x: startX, y: startY - i });
        }
    }

    update() {
        const dir = directions[this.newDirection];

        const nextHead = {
            x: this.segments[0].x + dir[0],
            y: this.segments[0].y + dir[1],
        };
        if (this.newDirection == opposites[this.currentDirection]) {
            return;
        }

        this.currentDirection = this.newDirection;

        //Get the tail off the top
        this.segments.pop();

        //Add a new head on in the direction of the snake

        this.segments.unshift(nextHead);
    }

    draw(p5: P5, size: number) {
        p5.background('#212529');
        p5.noFill();
        p5.stroke('#94d82d');
        p5.strokeWeight(size);

        p5.strokeJoin(p5.ROUND);

        p5.beginShape();

        for (let i = 0; i < this.segments.length; i++) {
            /*const progress = p5.map(timeElapsed, 0, UPDATE_RATE, 0, 1, true);
            const curr = snake.segments[i];
            const next = (i == 0) ? [curr[0] + dir[0], curr[1] + dir[1]] : snake.segments[i-1];

            const xProgress = p5.map(timeElapsed, 0, UPDATE_RATE, curr[0], next[0]);
            const yProgress = p5.map(timeElapsed, 0, UPDATE_RATE, curr[1], next[1]);*/

            p5.vertex(
                this.segments[i].x * size + size / 2,
                this.segments[i].y * size + size / 2
            );
        }
        p5.endShape();
    }

    contains(pos: Position) {
        return this.segments.includes(pos);
    }
}

export const SnakeSketch: React.FC = () => {
    const CELLS = 20;
    let actionQueue: Direction[] = [];
    let cellSize: number;

    let fruitPos: Position;
    let snake: Snake = new Snake(3, 3);
    const UPDATE_RATE = 250;
    let timeElapsed = 0;

    const getNewFruitPos = (p5: P5) => {
        let newPos = {
            x: p5.round(p5.random(CELLS - 1)),
            y: p5.round(p5.random(CELLS - 1)),
        };
        while (snake.contains(newPos)) {
            newPos = {
                x: p5.round(p5.random(CELLS - 1)),
                y: p5.round(p5.random(CELLS - 1)),
            };
        }
        return newPos;
    };

    const startGame = (p5: P5) => {
        actionQueue = [];
        fruitPos = getNewFruitPos(p5);
        snake = new Snake(3, 3);
    };
    //See annotations in JS for more information

    const setup = (p5: P5, canvasParentRef: Element) => {
        console.log('Setup');
        p5.createCanvas(250, 250).parent(canvasParentRef);
        cellSize = p5.width / CELLS; //Assuming the cells are square
        fruitPos = getNewFruitPos(p5);

        //const newStars: Star[] = [];
    };

    const onGetFruit = (p5: P5) => {
        const lastSegment = snake.segments[snake.segments.length - 1];
        const dir = directions[snake.currentDirection];
        fruitPos = {
            x: p5.round(p5.random(CELLS - 1)),
            y: p5.round(p5.random(CELLS - 1)),
        };
        snake.segments.push({
            x: lastSegment.x - dir[0],
            y: lastSegment.y - dir[1],
        });
    };

    const draw = (p5: P5) => {
        p5.clear();
        p5.background('black');
        timeElapsed += p5.deltaTime;
        const nextInput = actionQueue.shift();
        if (nextInput) snake.newDirection = nextInput;
        if (snake.newDirection == opposites[snake.currentDirection]) {
            snake.newDirection = snake.currentDirection;
        }

        //const progress = p5.map(timeElapsed, 0, UPDATE_RATE, 0, CELL_SIZE, true);

        if (timeElapsed >= UPDATE_RATE) {
            timeElapsed -= UPDATE_RATE;

            snake.update();
            const head = snake.segments[0];
            for (let i = 1; i < snake.segments.length; i++) {
                if (
                    snake.segments[i].x == head.x &&
                    snake.segments[i].y == head.y
                )
                    startGame(p5);
            }

            if (head.x < 0 || head.x >= CELLS || head.y < 0 || head.y >= CELLS)
                startGame(p5);

            if (head.x == fruitPos.x && head.y == fruitPos.y) {
                onGetFruit(p5);
            }
        }

        snake.draw(p5, cellSize);
        p5.noStroke();
        p5.fill('#e03131');
        p5.circle(
            fruitPos.x * cellSize + cellSize / 2,
            fruitPos.y * cellSize + cellSize / 2,
            cellSize / 2
        );
    };

    const onKeyPressed = (p5: P5) => {
        if (p5.keyCode >= 37 && p5.keyCode <= 40) {
            if (actionQueue.length > 2) return;
            actionQueue.push(((p5.keyCode - 34) % 4) + 1);
        }
    };

    return <Sketch setup={setup} draw={draw} keyPressed={onKeyPressed} />;
};
