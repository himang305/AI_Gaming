// map.js
export const mapData = {
    width: 800,
    height: 600,
    blocks: [
      { x: 200, y: 200, w: 100, h: 50 },
      { x: 500, y: 300, w: 80, h: 80 },
      { x: 300, y: 400, w: 120, h: 30 }
    ]
  };
  
  export function drawMap(ctx) {
    ctx.fillStyle = 'grey';
    mapData.blocks.forEach(block => {
      ctx.fillRect(block.x, block.y, block.w, block.h);
    });
  }



  