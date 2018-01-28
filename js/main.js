var startTime = null;
var prevTime = null;
var accumulatedTime = 0.0;
var kFixedRate = 30; // frame per second

// canvas
var b = document.querySelector('.battleground-area');
var canvas = new Canvas("mainCanvas", b.offsetWidth, b.offsetHeight);

// tilemap
var tilemap = new Tilemap(10, 10, gameSettings.tileWidth, gameSettings.tileHeight);
tilemap.bgColor = '#DDDDDD';
tilemap.scale(canvas.canvas.width, canvas.canvas.height);
tilemap.centerAgainst(canvas.canvas.width, canvas.canvas.height);

// test player
var you = new Pawn(tilemap.tileWidth - 40, tilemap.tileHeight - 40, '#ff0000');
var opponent = new Pawn(tilemap.tileWidth - 40, tilemap.tileHeight - 40, '#00ff00');
//player1.setPosToTilemapLocIfPossible(2,9,tilemap);
//console.log(tilemap.getTileLocationFromLocalPos(player1.x, player1.y));

function update(delta) {
}

function render() {
  tilemap.draw(canvas.ctx);
  you.draw(canvas.ctx)
  opponent.draw(canvas.ctx)
}

function loop(currentTime) {
  var elapsedTime = 0;

  if (startTime == null) {
    startTime = currentTime;
    prevTime = currentTime;
  }
  else {
    // calculate elapsed time
    elapsedTime = currentTime - prevTime;
    prevTime = currentTime;
  }

  // fixed rate
  accumulatedTime += elapsedTime;
  if (accumulatedTime >= 1.0 / kFixedRate * 1000) {
    update(1.0 / kFixedRate * 1000);
    accumulatedTime = 0.0;
  }
  // always render
  render();
  
  // loop again
  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);