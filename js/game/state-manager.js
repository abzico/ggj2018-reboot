'use strict';

function StateManager() {
  this.entities = [];
}

StateManager.prototype.registerEntity = function(arbitraryObj) {
  // interested object should be defined
  if (arbitraryObj.__objType != null && arbitraryObj.__objType != undefined) {
    if (arbitraryObj.__objType === 'Tilemap') {
      this.entities.unshift(arbitraryObj);
    }
    else if (arbitraryObj.__objType === 'Pawn') {
      this.entities.push(arbitraryObj);
    }
  }
}