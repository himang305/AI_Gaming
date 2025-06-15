// // tank.js

import { mapData } from './map.js';

export const tank = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 2,
  width: 30,
  height: 20
};

export function updateTank(keys) {
  let prevX = tank.x;
  let prevY = tank.y;

  if (keys["ArrowLeft"]) tank.angle -= 0.05;
  if (keys["ArrowRight"]) tank.angle += 0.05;

  if (keys["ArrowUp"]) {
    tank.x += Math.cos(tank.angle) * tank.speed;
    tank.y += Math.sin(tank.angle) * tank.speed;
  }

  if (keys["ArrowDown"]) {
    tank.x -= Math.cos(tank.angle) * tank.speed;
    tank.y -= Math.sin(tank.angle) * tank.speed;
  }

  // Prevent out-of-bounds movement
  tank.x = Math.max(0, Math.min(800, tank.x));
  tank.y = Math.max(0, Math.min(600, tank.y));

  // Collision detection
  if (checkCollisionWithBlocks()) {
    tank.x = prevX;
    tank.y = prevY;
  }
}

function checkCollisionWithBlocks() {
  const tankBox = {
    x: tank.x - tank.width / 2,
    y: tank.y - tank.height / 2,
    w: tank.width,
    h: tank.height
  };

  return mapData.blocks.some(block => {
    return isColliding(tankBox, block);
  });
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function drawTank(ctx) {
  ctx.save();
  ctx.translate(tank.x, tank.y);
  ctx.rotate(tank.angle);
  ctx.fillStyle = "lime";
  ctx.fillRect(-15, -10, 30, 20); // 30x20 tank
  ctx.fillStyle = "green";
  ctx.fillRect(0, -3, 20, 6);     // cannon
  ctx.restore();
}
