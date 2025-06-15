// map.js
export const mapData = {
    width: 800,
    height: 600,
    blocks: [
        { x: 200, y: 200, w: 100, h: 50 },
        { x: 500, y: 300, w: 80, h: 80 },
        { x: 300, y: 400, w: 120, h: 30 },
        { x: 120, y: 100, w: 60, h: 60 },
        { x: 600, y: 150, w: 120, h: 40 },
        { x: 150, y: 500, w: 100, h: 50 },
        { x: 400, y: 100, w: 80, h: 80 },
        { x: 700, y: 450, w: 90, h: 30 },
        { x: 350, y: 250, w: 100, h: 50 },
        { x: 250, y: 100, w: 60, h: 60 }
    ]
  };
  
  export function drawMap(ctx) {
    ctx.fillStyle = 'grey';
    mapData.blocks.forEach(block => {
      ctx.fillRect(block.x, block.y, block.w, block.h);
    });
  }



  