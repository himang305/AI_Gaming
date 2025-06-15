// main.js
import { tank, updateTank, drawTank } from './tank.js';
import { mapData, drawMap } from './map.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawMap(ctx);
  updateTank(keys);
  drawTank(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
