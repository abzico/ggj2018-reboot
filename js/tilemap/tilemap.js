'use strict';

function Tilemap(tilemapBlockWidth, tilemapBlockHeight, tileWidth, tileHeight) {
  this.tilemapBlockWidth= tilemapBlockWidth;
  this.tilemapBlockHeight = tilemapBlockHeight;
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this._tiles = [];
  this._bgColor = '#ffffff';
  this._x = 0;
  this._y = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.__objType = 'Tilemap';

  this.visible = true;

  this._constructTilemapsFromTiles();
}

Object.defineProperty(Tilemap.prototype, "x", {
  get: function x() {
    return this._x;
  },
  set: function x(val) {
    if (this._tiles.length > 0) {
      // update all tiles
      for (var j=0; j<this.tilemapBlockHeight; j++) {
        for (var i=0; i<this.tilemapBlockWidth; i++) {
          var tile = this._tiles[j * this.tilemapBlockWidth + i];
          tile.x = val + i*this.tileWidth;
        }
      }
    }
  }
});

Object.defineProperty(Tilemap.prototype, "y", {
  get: function y() {
    return this._y;
  },
  set: function y(val) {
    if (this._tiles.length > 0) {
      // update all tiles
      for (var j=0; j<this.tilemapBlockHeight; j++) {
        for (var i=0; i<this.tilemapBlockWidth; i++) {
          var tile = this._tiles[j * this.tilemapBlockWidth + i];
          tile.y = val + i*this.tilemapBlockHeight;
        }
      }
    }
  }
});

Object.defineProperty(Tilemap.prototype, "bgColor", {
  get: function bgColor() {
    return this._bgColor;
  },
  set: function bgColor(color) {
    // update all tiles
    this._tiles.forEach((tile) => {
      tile.color = color;
    })
  }
});

Tilemap.prototype._constructTilemapsFromTiles = function() {
  for (var j=0; j<this.tilemapBlockHeight; j++) {
    for (var i=0; i<this.tilemapBlockWidth; i++) {

      // create a new tile from properties of tilemap as a who`le
      var tile = new Tile(
        this.tileWidth, 
        this.tileHeight, 
        i*this.tileWidth, 
        j*this.tileHeight, 
        this.bgColor);
      this._tiles.push(tile);
    }
  }
}

Tilemap.prototype.drawAllTiles = function(ctx) {
  this._tiles.forEach((tile) => {
    tile.draw(ctx);
  })
}

Tilemap.prototype.draw = function(ctx) {
  if (!this.visible)
    return
  
  this.drawAllTiles(ctx);
}

/**
 * Convert from index-based location of tile-map to local position of Tilemap
 * 
 * (0,0) is at the top-left most
 * (N,N) is at the bottom-right most
 * @param {Number} x Tilemap's location at x (index-based)
 * @param {Number} y Tilemap's location at y (index-based)
 * @returns {Object} Return {posX, posY} which each element is the converted local position.
 */
Tilemap.prototype.getLocalPosFromTileLocation = function(x, y) {
  return {
    x: x * this.tileWidth + this.offsetX,
    y: y * this.tileHeight + this.offsetY
  }
}

/**
 * Convert from local position of Tilemap to index-based location of tile-map
 * @param {Number} posX Local position x to convert
 * @param {Number} posY Local position y to convert
 * @returns {Object} Return {x, y} whose each element is index-based tilemap location
 */
Tilemap.prototype.getTileLocationFromLocalPos = function(posX, posY) {
  return {
    x: Math.floor(posX / this.tileWidth),
    y: Math.floor(posY / this.tileHeight)
  }
}

/**
 * Scale tilemap to target width, and height.
 * @param {number} width Target width to scale tilemap to
 * @param {number} height Target height to scale tilemap to
 */
Tilemap.prototype.scale = function(targetWidth, targetHeight) {

  var tilemapWidth = this.tilemapBlockWidth * this.tileWidth;
  var tilemapHeight = this.tilemapBlockHeight * this.tileHeight;

  var factor;

  // scale from width-side
  if (tilemapWidth <= tilemapHeight) {
    if (targetWidth <= targetHeight) {
      factor = targetWidth * 1.0 / tilemapWidth;
    }
    else {
      factor = targetHeight * 1.0 / tilemapHeight;
    }
  }
  // scale from height-side
  else {
    if (targetWidth <= targetHeight) {
      factor = targetWidth * 1.0 / tilemapWidth;
    }
    else {
      factor = targetHeight * 1.0 / tilemapHeight;
    }
  }

  // update tilemap's tile size
  this.tileWidth *= factor;
  this.tileHeight *= factor;

  // loop through all of tiles and scale each one
  for (var j=0; j<this.tilemapBlockHeight; j++) {
    for (var i=0; i<this.tilemapBlockWidth; i++) {

      // get tile
      var tile = this._tiles[j * this.tilemapBlockWidth + i];
      // modify its width, and height (thus mean scale it)
      tile.width *= factor;
      tile.height *= factor;
      // modify its position x,y
      tile.x = i * this.tileWidth;
      tile.y = j * this.tileHeight;
    }
  }
}

Tilemap.prototype.centerAgainst = function(width, height) {
  var tilemapWidth = this.tilemapBlockWidth * this.tileWidth;
  var tilemapHeight = this.tilemapBlockHeight * this.tileHeight;

  // center along x-axis
  if (tilemapWidth != width && tilemapWidth <= width) {
    var remain = width - tilemapWidth;
    this.offsetX = remain / 2.0;
    this.x += this.offsetX;
  }
  // center along y-axis
  else if (tilemapHeight != height && tilemapHeight <= height) {
    var remain = height - tilemapHeight;
    this.offsetY = remain / 2.0;   
    this.y += this.offsetY;
  }
}