import { Container, Graphics } from "pixi.js";
import { CELL_SIZE, FIELD_COLS, FIELD_ROWS } from "../constants";

export class Field {
  view = new Container();

  staticLayer = new Graphics();
  dynamicLayer = new Graphics();

  constructor(cellSize = CELL_SIZE, rows = FIELD_ROWS, cols = FIELD_COLS) {
    this.cellSize = cellSize;
    this.rows = rows;
    this.cols = cols;

    this.view.addChild(this.staticLayer);
    this.view.addChild(this.dynamicLayer);
  }

  drawCell(layer, x, y, color, borderColor = null) {
    layer
      .rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
      .fill(color)
      .stroke(borderColor || "transparent", 1);
  }

  drawWalls(walls = []) {
    walls.forEach(({ x, y }) =>
      this.drawCell(this.staticLayer, x, y, "#fcb21c", "#ed9e00"),
    );
  }

  drawSnake(snake = []) {
    this.dynamicLayer.clear();
    snake.forEach(({ x, y }, index) => {
      const color = index === 0 ? "#4caf50" : "#8bc34a";
      this.drawCell(this.dynamicLayer, x, y, color, "#388e3c");
    });
  }

  drawFood(food) {
    this.drawCell(this.dynamicLayer, food.x, food.y, "#e91e63", "#c2185b");
  }
}
