// deps: network/networkws-cmd-constants.js, network/networkws.js, game/settings.js, main.js
// use you, and opponent from main.js

var codingArea = document.querySelector(".coding-area");
var codeta = document.getElementById("code-textarea");
var cspa = document.getElementById("console-panel");
var welcomeDiv = document.querySelector(".welcome-text-wrapper");
var battlegroundCanvas = document.querySelector(".battleground-canvas");
var kFrontStr = "<span class='front'>:</span> ";
var isInitialized = false;
var isConnectedToWS = false;
var isJoinedRoom = false;
var isGameReady = false;
var playerId = null;
var heartbeatInterval = null;

var networkWS = new NetworkWS(gameSettings.wsEndpointURL, networkws_onopen, networkws_onmessage, networkws_onerror, networkws_onclose);

function onCodeFocus(e) {
  console.log('on code focus');
  // if not found, then add it
  if (codeta.value == "") {
    codeta.value = "> ";
  }
}

function onCodeBlur(e) {
  if (codeta.value === "> ") {
    codeta.value = "";
  }
}

function onCodeKeyPress(e) {
  // split newline and get the last line
  var lines = codeta.value.split("\n");
  var input = lines[lines.length - 1];

  // enter key
  if (e.keyCode == 13) {
    var response = validate(input);
    if (response.ok) {
      if (response.desc)
        cspa.innerHTML += kFrontStr + response.desc + "<br>";
    }
    else {
      cspa.innerHTML += kFrontStr + "<span class='error'>" + response.desc + "</span><br>"
    }

    // scroll console to bottom
    cspa.scrollTop = cspa.scrollHeight;
    // prefix with front symbol
    setTimeout(() => {
      codeta.value += "> ";
    }, 10);
  }
}

function validate(input) {
  // strip out > first if need
  var tokens = null;
  var less = null;
  if (input.search("> ") != -1) {
    less = input.substring(2);
    tokens = less.split(" ");
  }

  // command with no parameters
  switch(less) {
    case "init":
      if (isInitialized) {
        return { ok: false, desc: "System is already initialized."};
      }

      welcomeDiv.className = "welcome-text-wrapper hide";
      battlegroundCanvas.className = "battleground-canvas show";

      isInitialized = true;
      return { ok: true, desc: "Successfully initialized the system."};
    case "deinit":
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }

      welcomeDiv.className = "welcome-text-wrapper show";
      battlegroundCanvas.className = "battleground-canvas hide";
      playerId = null;

      isInitialized = false;
      isGameReady = false;
      playerId = null;
      
      return { ok: true, desc: "Deinitialized the system."};
    case "ws connect abzi.co": // i know it right? :)
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }
      if (isConnectedToWS) {
        return { ok: false, desc: "Already connected to <span class='white'>abzi.co</span>."};
      }

      networkWS.connect();
      return { ok: true, desc: "Connecting to remote server..."};
    case "ws ping":
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }

      if (!isConnectedToWS) {
        return { ok: false, desc: "Not connect to remote server yet."};
      }

      networkWS.ping();
      return { ok: true, desc: "Sending <span class='white'>PING</span>..."};
    case "ws listroom":
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }

      if (!isConnectedToWS) {
        return { ok: false, desc: "Not connect to remote server yet."};
      }

      networkWS.listRoom();
      return { ok: true, desc: "Listing available room..."};
    case "ws quitroom":
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }

      if (!isConnectedToWS) {
        return { ok: false, desc: "Not connect to remote server yet."};
      }

      networkWS.quitRoom();

      isGameReady = false;

      return { ok: true, desc: "Quiting room..."};
    case "ws close":
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }
      if (!isConnectedToWS) {
        return { ok: false, desc: "Not connect to remote server yet."};
      }

      networkWS.close();

      isConnectedToWS = false;
      isGameReady = false;
      playerId = null;

      return { ok: true, desc: "Closing connection..."};
    case "clear":
      codeta.value = "";
      codeta.selectionEnd = 0;
      return { ok: true, desc: "Cleared screen"};
    case "clear output console":
      cspa.innerHTML = "";
      return { ok: true, desc: null};
    case "show output console":
      cspa.className = "show-block";
      codingArea.className = "coding-area show-separator";
      return { ok: true, desc: "Show output console panel"};
    case "hide output console":
      cspa.className = "hide";
      codingArea.className = "coding-area hide-separator";
      return {ok: true, desc: "Hide output console panel"};
    
    // game commands
    case "game go up":
      if (!isInitialized) {
        return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
      }

      if (!isConnectedToWS) {
        return { ok: false, desc: "Not connect to remote server yet."};
      }

      networkWS.gameGoUp();
      return {ok: true, desc: "Going up..."};
  }

  // commands with parameter
  if (tokens.length > 0) {
    if (tokens[0] === "ws") {
      if (tokens[1] === "createroom") {
        if (!isInitialized) {
          return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
        }
  
        if (!isConnectedToWS) {
          return { ok: false, desc: "Not connect to remote server yet."};
        }

        if (!playerId) {
          return { ok: false, desc: "You are not assigned player id yet."};
        }
        
        networkWS.createRoom(playerId);
        return { ok: true, desc: "Creating a room..."};
      }
      else if (tokens[1] === "joinroom") {
        // not enough parameter
        if (tokens.length < 3) {
          return { ok: false, desc: "Missing parameter <room-id>. Usage ws joinroom <room-id>"};
        }
        // parse parameter
        else {
          var roomId = parseInt(tokens[2]);
          if (isNaN(roomId)) {
            return { ok: false, desc: "Wrong type of parameter. It need to be number. Check your input."};
          }
          else {
            if (!isInitialized) {
              return { ok: false, desc: "System is not initialized yet. Initialize it with <span class='white'>init</span>"};
            }
      
            if (!isConnectedToWS) {
              return { ok: false, desc: "Not connect to remote server yet."};
            }

            networkWS.joinRoom(roomId);
            return { ok: true, desc: "Joining room " + roomId + "..."};
          }
        }
      }
    }
  }

  // otherwise
  return {ok: false, desc: "Command not recognized"};
}

function networkws_onopen(event) {
  isConnectedToWS = true;
  cspa.innerHTML += kFrontStr + "Connected to <span class='white'>abzi.co</span><br>";
  // scroll console to bottom
  cspa.scrollTop = cspa.scrollHeight;

  // start doing heartbeat
  heartbeatInterval = setInterval(function() {
    networkWS.heartbeat();
    console.log('hearbeat');
  }, gameSettings.heartbeatInterval);
}

function networkws_onmessage(event) {
  var data = JSON.parse(event.data);
  if (!data.ok) {
    cspa.innerHTML += kFrontStr + "<span class='error'>Error '" + data.response + "'</span><br>";
  }
  else {
    if (data.cmd === kNetworkWSCommand_listRoom) {
      var rooms = data.response;
      if (rooms.length <= 0) {
        cspa.innerHTML += kFrontStr + "There are no available room to join right now. Try again later.<br>";
      }
      else {
        cspa.innerHTML += kFrontStr + "Available rooms to join as follows<br>";
        for (var i=0; i<rooms.length; i++) {
          cspa.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;RoomId: <span class='white'>" + rooms[i].roomId + "</span><br>";
        }
      }
    }
    else if (data.cmd === kNetworkWSCommand_createRoom) {
      var roomId = data.response.roomId;
      cspa.innerHTML += kFrontStr + "Room id <span class='white'>" + roomId + "</span> was created, and you joined this room, waiting for another player.<br>";
    }
    else if (data.cmd == kInitialConnection) {
      // save id to use for whole session of live connection
      playerId = data.response;
      cspa.innerHTML += kFrontStr + "Get assigned player id as <span class='white'>" + playerId + "</span><br>";
    }
    else if (data.cmd == kNetworkWSCommand_quitRoom) {
      cspa.innerHTML += kFrontStr + "You've quited the room.<br>";
    }
    else if (data.cmd == kNetworkWSCommand_joinRoom) {
      if (data.response.ready != undefined && data.response.ready != null) {
        cspa.innerHTML += kFrontStr + "Another player joined the room. Ready to begin the game now.<br>";
        isGameReady = true;
        
        // set both player to visible
        you.visible = true;
        opponent.visible = true;

        console.log(data.response.loc1, data.response.loc2);
        var loc1 = data.response.loc1;
        var loc2 = data.response.loc2;
        var color1 = data.response.color1;
        var color2 = data.response.color2;
        you.setPosToTilemapLocIfPossible(loc1.x, loc1.y, tilemap);
        you.color = color1;
        opponent.setPosToTilemapLocIfPossible(loc2.x, loc2.y, tilemap);
        opponent.color = color2;
      }
      else {
        cspa.innerHTML += kFrontStr + "Successfully joined room<br>";
        isGameReady = true;

        // set both player to visible
        you.visible = true;
        opponent.visible = true;

        // set position
        console.log(data.response.loc1, data.response.loc2);
        var loc1 = data.response.loc1;
        var loc2 = data.response.loc2;
        var color1 = data.response.color1;
        var color2 = data.response.color2;
        you.setPosToTilemapLocIfPossible(loc2.x, loc2.y, tilemap);
        you.color = color2;
        opponent.setPosToTilemapLocIfPossible(loc1.x, loc1.y, tilemap);
        opponent.color = color1;
      }
    }
    else if (data.cmd == kNetworkWSCommand_goUp) {
      if (data.response.you) {
        cspa.innerHTML += kFrontStr + "You went up 1 block<br>";

        you.goUp(tilemap);
      }
      else {
        cspa.innerHTML += kFrontStr + "Opponent went up 1 block<br>";

        opponent.goUp(tilemap);
      }
    }
    else if (data.cmd != kNetworkWSCommand_heartbeat && typeof data.response === "string") {
      // not to pollute heartbeat message in console panel
      cspa.innerHTML += kFrontStr + "Received <span class='white'>" + data.response + "</span> from remote server<br>";
    }
    else if (typeof data.response === "object") {
      cspa.innerHTML += kFrontStr + "<span class='error'>Unrecognized data format of response " + data.response + "from remote server</span><br>";
    }
  }

  // scroll console to bottom
  cspa.scrollTop = cspa.scrollHeight;
}

function networkws_onerror(event) {
  cspa.innerHTML += kFrontStr + "<span class='error'>Network error</span><br>";
  // scroll console to bottom
  cspa.scrollTop = cspa.scrollHeight;
}

function networkws_onclose(event) {
  isConnectedToWS = false;
  isJoinedRoom = false;
  isGameReady = false;
  playerId = null;
  cspa.innerHTML += kFrontStr + "Connection to <span class='white'>abzi.co</span> is closed<br>";
  // scroll console to bottom
  cspa.scrollTop = cspa.scrollHeight;
  // clear interval
  clearInterval(heartbeatInterval);
  heartbeatInterval = null;
}