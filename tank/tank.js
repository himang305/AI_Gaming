import { mapData } from './map.js';

export const tank = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 5,
  width: 30,
  height: 20,
  hit: false,
  health: 10,
  maxHealth: 10
};

export const bullets = [];
export const enemyBullets = [];

export const enemyTank = {
  x: 600,
  y: 100,
  angle: 0,
  speed: 1.5,
  width: 30,
  height: 20,
  fireCooldown: 0,
  hit: false,
  health: 10,
  maxHealth: 10
};


export function updateTank(keys) {

  if (tank.health <= 0) return; // player dead — stop input

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

  // Update enemy tank
    updateEnemyTank();

    if (checkBulletHitPlayer()) {
    console.log("💥 Player Hit!");
    }

    checkBulletHitEnemy(); 
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
    // Draw player
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle);
    ctx.fillStyle = tank.hit ? "red" : "lime";
    ctx.fillRect(-15, -10, 30, 20);
    ctx.fillStyle = "green";
    ctx.fillRect(0, -3, 20, 6);
    ctx.restore();
  
    // health bar
    ctx.fillStyle = "red";
    ctx.fillRect(tank.x - 20, tank.y - 30, 40, 5);
    ctx.fillStyle = "lime";
    ctx.fillRect(tank.x - 20, tank.y - 30, 40 * (tank.health / tank.maxHealth), 5);


    // Draw enemy
    ctx.save();
    ctx.translate(enemyTank.x, enemyTank.y);
    ctx.rotate(enemyTank.angle);
    ctx.fillStyle = enemyTank.hit ? "red" : "orange";
    ctx.fillRect(-15, -10, 30, 20);
    ctx.fillStyle = "brown";
    ctx.fillRect(0, -3, 20, 6);
    ctx.restore();

    // health bar
    ctx.fillStyle = "red";
    ctx.fillRect(enemyTank.x - 20, enemyTank.y - 30, 40, 5);
    ctx.fillStyle = "orange";
    ctx.fillRect(enemyTank.x - 20, enemyTank.y - 30, 40 * (enemyTank.health / enemyTank.maxHealth), 5);
  
    drawBullets(ctx);
    drawEnemyBullets(ctx);
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

export function drawEnemyBullets(ctx) {
    ctx.fillStyle = "yellow";
    enemyBullets.forEach(b => {
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







// Enemy Tank Logic

function updateEnemyTank() {

    if (enemyTank.health <= 0) {
        updateEnemyBullets();
        return; 
    }

    // Aim at player
    const dx = tank.x - enemyTank.x;
    const dy = tank.y - enemyTank.y;
    enemyTank.angle = Math.atan2(dy, dx);
  
    // Move towards player
    const moveX = Math.cos(enemyTank.angle) * enemyTank.speed;
    const moveY = Math.sin(enemyTank.angle) * enemyTank.speed;
    const prevX = enemyTank.x;
    const prevY = enemyTank.y;
  
    enemyTank.x += moveX;
    enemyTank.y += moveY;
  
    // Collision with walls
    if (
      mapData.blocks.some(block =>
        isColliding(
          { x: enemyTank.x - enemyTank.width / 2, y: enemyTank.y - enemyTank.height / 2, w: enemyTank.width, h: enemyTank.height },
          block
        )
      )
    ) {
      enemyTank.x = prevX;
      enemyTank.y = prevY;
    }
  
    // Shoot every 100 frames
    enemyTank.fireCooldown++;
    if (enemyTank.fireCooldown > 100) {
      fireEnemyBullet();
      enemyTank.fireCooldown = 0;
    }
  
    updateEnemyBullets();
}
  
  function fireEnemyBullet() {
    enemyBullets.push({
      x: enemyTank.x + Math.cos(enemyTank.angle) * 20,
      y: enemyTank.y + Math.sin(enemyTank.angle) * 20,
      angle: enemyTank.angle,
      speed: 4
    });
  }
  
  function updateEnemyBullets() {
    enemyBullets.forEach(b => {
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed;
    });
  
    // Remove out of bounds or wall hit
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];
      if (
        b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600 ||
        mapData.blocks.some(block =>
          isColliding({ x: b.x - 2, y: b.y - 2, w: 4, h: 4 }, block))
      ) {
        enemyBullets.splice(i, 1);
      }
    }
  }
  
  function checkBulletHitPlayer() {
    const playerBox = {
        x: tank.x - tank.width / 2,
        y: tank.y - tank.height / 2,
        w: tank.width,
        h: tank.height
      };
    
      for (let i = 0; i < enemyBullets.length; i++) {
        const bulletBox = {
          x: enemyBullets[i].x - 2,
          y: enemyBullets[i].y - 2,
          w: 4,
          h: 4
        };
    
        if (isColliding(playerBox, bulletBox)) {
          enemyBullets.splice(i, 1); // Remove bullet
          tank.health = Math.max(0, tank.health - 1);
          tank.hit = true;
          return true;
        }
      }
    
      return false;
  }

  function checkBulletHitEnemy() {
    const enemyBox = {
      x: enemyTank.x - enemyTank.width / 2,
      y: enemyTank.y - enemyTank.height / 2,
      w: enemyTank.width,
      h: enemyTank.height
    };
  
    for (let i = 0; i < bullets.length; i++) {
      const bulletBox = {
        x: bullets[i].x - 2,
        y: bullets[i].y - 2,
        w: 4,
        h: 4
      };
  
      if (isColliding(enemyBox, bulletBox)) {
        bullets.splice(i, 1); // Remove our bullet
        enemyTank.health = Math.max(0, enemyTank.health - 1);
        enemyTank.hit = true;
        console.log("🎯 Enemy Hit!");
        return true;
      }
    }
  
    return false;
  }
  

  