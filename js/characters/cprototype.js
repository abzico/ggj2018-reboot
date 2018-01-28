/* prototype of character contains basic functionality to use */
/*
  dependencies
    - tilemap.js
*/
'use strict';

function CPrototype(width, height, color) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.color = color;
  this.visible = false;
}

CPrototype.prototype.draw = function(ctx) {
  if (!this.visible) return;
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height, this.color);
  ctx.restore();
}

CPrototype.prototype.setPosToTilemapLocIfPossible = function(locx, locy, tilemap) {
  if (locx >= 0 && locx < tilemap.tilemapBlockWidth &&
      locy >= 0 && locy < tilemap.tilemapBlockHeight) {
    var pos = tilemap.getLocalPosFromTileLocation(locx, locy);
    this.x = pos.x + tilemap.tileWidth/2.0 - this.width/2.0;
    this.y = pos.y + tilemap.tileHeight/2.0 - this.height/2.0;
  }
}

CPrototype.prototype.goUp = function(tilemap) {
  var currLoc = tilemap.getTileLocationFromLocalPos(
    this.x + this.width/2.0 - tilemap.tileWidth/2.0 - tilemap.offsetX/2, 
    this.y + this.height/2.0 - tilemap.tileHeight/2.0 - tilemap.offsetY/2);
  currLoc.y--;
  console.log(currLoc.y);
  this.setPosToTilemapLocIfPossible(currLoc.x, currLoc.y, tilemap);
}