import { mapData } from './map.js';

export const tank = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 2,
  width: 30,
  height: 20
};

export const bullets = [];

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

  // Collision with walls
  if (checkCollisionWithBlocks()) {
    tank.x = prevX;
    tank.y = prevY;
  }

  updateBullets();
}

function checkCollisionWithBlocks() {
  const tankBox = {
    x: tank.x - tank.width / 2,
    y: tank.y - tank.height / 2,
    w: tank.width,
    h: tank.height
  };

  return mapData.blocks.some(block => isColliding(tankBox, block));
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
  ctx.fillRect(-15, -10, 30, 20); // body
  ctx.fillStyle = "green";
  ctx.fillRect(0, -3, 20, 6);     // cannon
  ctx.restore();

  drawBullets(ctx);
}

// 🟡 Bullet logic
function updateBullets() {
  bullets.forEach(bullet => {
    bullet.x += Math.cos(bullet.angle) * bullet.speed;
    bullet.y += Math.sin(bullet.angle) * bullet.speed;
  });

  // Remove bullets that go out of bounds or hit blocks
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (
      b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600 ||
      mapData.blocks.some(block =>
        isColliding({ x: b.x - 2, y: b.y - 2, w: 4, h: 4 }, block))
    ) {
      bullets.splice(i, 1);
    }
  }
}

export function drawBullets(ctx) {
  ctx.fillStyle = "red";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  });
}

export function fireBullet() {
  bullets.push({
    x: tank.x + Math.cos(tank.angle) * 20,
    y: tank.y + Math.sin(tank.angle) * 20,
    angle: tank.angle,
    speed: 5
  });
}
