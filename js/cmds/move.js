// deps: cmd-constant.js, cmd.js

'use strict';

function MoveCommand(id) {
  Command.call(this, id);
}
MoveCommand.prototype = Object.create(Command.prototype);
MoveCommand.prototype.constructor = Command;