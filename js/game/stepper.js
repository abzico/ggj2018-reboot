// deps: state-manager.js, cmd.js (et all)

'use strict';

function Stepper() {
  this.stateManager = new StateManager();
  this.cmds = [];
  this._isTurnProcessingStarted = false;
  this._isTurnProcessingCompleted = false;  // each turn might have serveral cycles to complete
}

Stepper.prototype._processCmd = function(cmd, typedObj) {
  if (typedObj.__objType !== 'Pawn') return;

  var tilemap = this.stateManager.entities[0];

  if (cmd.id === kCommand_moveUp) {
    var loc = tilemap.getTileLocationFromLocalPos(typedObj.x, typedObj.y);
    // TODO: add bumping into the wall animation, and back sequence here

  }
  else if (cmd.id === kCommand_moveLeft) {

  }
  else if (cmd.id === kCommand_moveRight) {

  }
  else if (cmd.id === kCommand_moveDown) {

  }
  else if (cmd.id === kCommand_shoot) {

  }
}

Stepper.prototype.addCmd = function(cmd, typedObj) {
  this.cmds.push({
    cmd: cmd,
    obj: typedObj
  });
}

Stepper.prototype.step = function() {
  this._isTurnStarted = true;

  var i = 0;

  var cmdWrapped = this.cmds[i];
  this._processCmd(cmdWrapped.cmd, cmdWrapped.typedObj);
}