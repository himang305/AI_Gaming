import { tank, updateTank, drawTank, fireBullet } from './tank.js';
import { drawMap } from './map.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const keys = {};

document.addEventListener("keydown", e => {
    // console.log("keydown", e.key);
  keys[e.key] = true;

  // Fire bullet on spacebar
  if (e.key === " ") {
    console.log("Firing bullet");
    fireBullet();
  }
});

document.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(ctx);
  updateTank(keys);
  drawTank(ctx);
  requestAnimationFrame(gameLoop);
}

gameLoop();
