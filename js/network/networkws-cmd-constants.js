'use strict';

/*
  Design:
    request in JSON format
      {
        cmd: ws-cmd:<cmd-name>,
        <optional-param-name>: <value>
      }

    response in JSON format
      {
        ok: true/false,
        response: obj/string
      }
*/

// management commands
var kInitialConnection = "__initial";
var kNetworkWSCommand_createRoom = "createRoom";
// param: <room-id>
var kNetworkWSCommand_joinRoom = "joinRoom";
var kNetworkWSCommand_quitRoom = "quitRoom";
var kNetworkWSCommand_listRoom = "listRoom";
var kNetworkWSCommand_ping = "ping";
var kNetworkWSCommand_heartbeat = "heartbeat";

// game commands
var kNetworkWSCommand_goUp = "game:goUp";
var kNetworkWSCommand_goLeft = "game:goLeft";
var kNetworkWSCommand_goRight = "game:goRight";
var kNetworkWSCommand_goDown = "game:goDown";