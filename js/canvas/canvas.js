'use strict';

function Canvas(canvasId, width, height) {
  this.canvas = document.getElementById(canvasId);

  // set size, due to by default on chrome canvas has 300,150 size if not explicitly set in DOM
  if (this.canvas) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext("2d");
    if(this.ctx) console.log('canvas 2d is ready');
  }

  this.ctx.save();
}

Canvas.prototype.drawRect = function(x, y, width, height, color) {
  this.ctx.rect(x,y,width,height);
  this.ctx.fillStyle = color;
  this.ctx.fill();
  this.ctx.restore();
}