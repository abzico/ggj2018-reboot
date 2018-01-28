/* first type of character player can choose to play from */
/*
  dep:
    - cprototype.js
*/
'use strict';

function Pawn(width, height, color) {
  CPrototype.call(this, width, height, color);
  this.__objType = 'Pawn';
}
Pawn.prototype = Object.create(CPrototype.prototype);
Pawn.prototype.constructor = CPrototype;