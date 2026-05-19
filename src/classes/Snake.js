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

  move(teleportX = 0, teleportY = 0) {
    if (this.directionQueue.length > 0) {
      this.direction = this.directionQueue.shift();
    }

    const head = this.body[0];
    this.body.unshift({
      x: head.x + this.direction.x + teleportX,
      y: head.y + this.direction.y + teleportY,
    });
    this.body.pop();
  }

  fieldWrap(cols, rows) {
    const head = this.body[0];

    if (head.x <= 0) head.x = cols - 2;
    else if (head.x >= cols - 1) head.x = 1;

    if (head.y <= 0) head.y = rows - 2;
    else if (head.y >= rows - 1) head.y = 1;
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ x: tail.x, y: tail.y });
  }
}
