/* buliding block of tilemap */
'use strict';

function Tile(width=0, height=0, x=0, y=0, color='#ffffff', tileGap=1) {
  this.x = x;
  this.y = y;
  this.visible = true;
  this.width = width;
  this.height = height;
  this.color = color;
  this.tileGap = 2;
  this.__objType = 'Tile';
}

Tile.prototype.draw = function(ctx) {
  if (!this.visible)
    return;
  
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x + this.tileGap, this.y + this.tileGap, this.width - this.tileGap, this.height - this.tileGap);
  ctx.restore();
}