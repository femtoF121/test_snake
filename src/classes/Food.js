import { getSafeRandomCell } from "../utils";

export class Food {
  x = 0;
  y = 0;

  newCoords(unsafeCells, cols, rows) {
    const safeCell = getSafeRandomCell(unsafeCells, rows, cols);

    if (!safeCell) return alert("You win!");

    this.x = safeCell.x;
    this.y = safeCell.y;
  }
}
