import { Application } from "pixi.js";
import { checkCollision } from "../utils.js";
import { Field } from "./Field.js";
import { Food } from "./Food.js";
import { Snake } from "./Snake.js";

export class Game {
  app = new Application();
  field = new Field();
  snake = new Snake();
  food = new Food();
  walls = [];

  score = 0;
  isPlaying = false;
  moveTimer = 0;
  moveInterval = 150;

  constructor(gui) {
    this.gui = gui;
    this.initWalls();
  }

  async init() {
    const { cellSize, cols, rows } = this.field;
    await this.app.init({
      width: cellSize * cols,
      height: cellSize * rows,
      backgroundColor: "gray",
    });

    const canvasContainer = document.getElementById("game-canvas");
    canvasContainer.appendChild(this.app.canvas);

    this.app.stage.addChild(this.field.view);

    this.field.drawWalls(this.walls);
    this.field.drawSnake(this.snake.body);

    this.app.ticker.add((ticker) => {
      this.update(ticker.deltaMS);
    });
  }

  start(mode) {
    this.isPlaying = true;
    this.snake.initControls();
    const { cols, rows } = this.field;
    this.food.spawn([...this.walls, ...this.snake.body], cols, rows);
  }

  stop() {
    this.isPlaying = false;
    this.snake.removeControls();
  }

  reset() {
    this.moveTimer = 0;
    this.snake = new Snake();
    this.field.drawSnake(this.snake.body);
    this.gui.resetCurrentScore();
  }

  gameOver() {
    if (this.gui) this.gui.togglePlayingState();
    alert("Game Over!");
    this.stop();
    this.reset();
  }

  update(deltaMS) {
    if (!this.isPlaying) return;

    this.moveTimer += deltaMS;

    if (this.moveTimer >= this.moveInterval) {
      this.moveTimer = 0;
      this.snake.move();

      if (this.checkDeadCollision()) return this.gameOver();

      if (this.checkFoodCollision()) {
        this.snake.grow();
        this.gui.setScore(this.score++);
        const { cols, rows } = this.field;
        this.food.spawn([...this.walls, ...this.snake.body], cols, rows);
      }
      this.field.drawSnake(this.snake.body);
      this.field.drawFood(this.food);
    }
  }

  checkDeadCollision() {
    const head = this.snake.body[0];
    return (
      checkCollision(this.walls, head) ||
      checkCollision(this.snake.body.slice(1), head)
    );
  }

  checkFoodCollision() {
    return checkCollision([this.food], this.snake.body[0]);
  }

  addWall(x, y) {
    this.walls.push({ x, y });
    this.field.drawWalls(this.walls);
  }

  initWalls() {
    const { rows, cols } = this.field;

    for (let x = 0; x < cols; x++) {
      this.walls.push({ x: x, y: 0 });
      this.walls.push({ x: x, y: rows - 1 });
    }

    for (let y = 1; y < rows - 1; y++) {
      this.walls.push({ x: 0, y: y });
      this.walls.push({ x: cols - 1, y: y });
    }
  }
}
