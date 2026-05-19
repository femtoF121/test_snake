export class Snake {
  direction = { x: 1, y: 0 };
  directionQueue = [];

  constructor(startX = 10, startY = 10) {
    this.body = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
  }

  handleKeyDown = (event) => {
    let newDir = null;
    switch (event.key) {
      case "ArrowUp":
      case "w":
        newDir = { x: 0, y: -1 };
        break;
      case "ArrowDown":
      case "s":
        newDir = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
      case "a":
        newDir = { x: -1, y: 0 };
        break;
      case "ArrowRight":
      case "d":
        newDir = { x: 1, y: 0 };
        break;
    }

    if (newDir) {
      const lastPlannedDir =
        this.directionQueue.length > 0
          ? this.directionQueue[this.directionQueue.length - 1]
          : this.direction;

      const isOpposite =
        lastPlannedDir.x + newDir.x === 0 && lastPlannedDir.y + newDir.y === 0;

      if (!isOpposite && this.directionQueue.length < 2) {
        this.directionQueue.push(newDir);
      }
    }
  };

  initControls() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  removeControls() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  move() {
    if (this.directionQueue.length > 0) {
      this.direction = this.directionQueue.shift();
    }

    const head = this.body[0];
    this.body.unshift({
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    });
    this.body.pop();
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ x: tail.x, y: tail.y });
  }
}
