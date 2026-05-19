export function checkCollision(collisionObjs, head) {
  return collisionObjs.some((obj) => obj.x === head.x && obj.y === head.y);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getSafeRandomCell(unsafeCells = [], rows, cols) {
  const freeCells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isUnsafe = unsafeCells.some((v) => v.x === j && v.y === i);
      if (!isUnsafe) freeCells.push({ x: j, y: i });
    }
  }

  if (freeCells.length > 0) {
    const randomIndex = getRandomInt(0, freeCells.length - 1);
    return freeCells[randomIndex];
  }

  return null;
}
