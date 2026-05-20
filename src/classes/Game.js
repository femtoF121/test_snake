import { Application } from "pixi.js";
import { MOVE_INTERVAL } from "../constants.js";
import { checkCollision, getSafeRandomCell } from "../utils.js";
import { Field } from "./Field.js";
import { Food } from "./Food.js";
import { Snake } from "./Snake.js";

export class Game {
  app = new Application();
  field = new Field();
  snake = new Snake();
  foods = [];
  walls = [];

  gamemode;
  score = 0;
  isPlaying = false;
  moveTimer = 0;
  moveInterval = MOVE_INTERVAL;

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
    this.gamemode = mode;
    this.isPlaying = true;
    this.snake.initControls();
    this.spawnFoods();
  }

  stop() {
    this.isPlaying = false;
    this.snake.removeControls();
  }

  reset() {
    this.field.clear();
    this.initWalls();
    this.field.drawWalls(this.walls);
    this.snake.reset();
    this.field.drawSnake(this.snake.body);
    this.gui.resetCurrentScore();
    this.score = 0;
    this.moveTimer = 0;
    this.moveInterval = MOVE_INTERVAL;
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

      if (this.gamemode === "god") {
        this.snake.fieldWrap(this.field.cols, this.field.rows);
      } else if (this.checkDeadCollision()) return this.gameOver();

      if (this.checkFoodCollision()) {
        const enterIndex = this.foods.findIndex(
          (f) => f.x === this.snake.body[0].x && f.y === this.snake.body[0].y,
        );
        const exitIndex = (enterIndex + 1) % 2;
        this.snake.grow();
        this.gui.setScore(++this.score);

        if (this.gamemode === "portal")
          this.snake.move(
            this.foods[exitIndex].x - this.foods[enterIndex].x,
            this.foods[exitIndex].y - this.foods[enterIndex].y,
          );
        if (this.gamemode === "walls") this.spawnRandomWall();
        if (this.gamemode === "speed") this.moveInterval *= 0.9;

        this.spawnFoods();
      }
      this.field.drawSnake(this.snake.body);
      this.field.drawFood(this.foods);
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
    return checkCollision(this.foods, this.snake.body[0]);
  }

  spawnRandomWall() {
    const safeCell = getSafeRandomCell(
      [...this.walls, ...this.snake.body],
      this.field.cols,
      this.field.rows,
    );
    if (!safeCell) return alert("You win!");
    this.walls.push({ x: safeCell.x, y: safeCell.y });
    this.field.drawWalls(this.walls);
  }

  spawnFoods() {
    this.foods = [];
    const foodCount = this.gamemode === "portal" ? 2 : 1;
    const food = new Food();

    for (let i = 0; i < foodCount; i++) {
      food.newCoords(
        [...this.walls, ...this.snake.body],
        this.field.cols,
        this.field.rows,
      );
      this.foods.push({ ...food });
    }
  }

  initWalls() {
    const { rows, cols } = this.field;
    this.walls = [];

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
