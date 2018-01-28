// deps: networkws-cmd-constants.js

'use strict';

function NetworkWS(endpointURL, onopen, onmessage, onerror, onclose) {
  this.endpointURL = endpointURL;
  this.ws = null;
  this.callback = {
    onopen: onopen,
    onmessage: onmessage,
    onerror: onerror,
    onclose: onclose
  }
}

NetworkWS.prototype.connect = function() {
  this.ws = new WebSocket(this.endpointURL);

  var that = this;

  // hook up to all events
  this.ws.onopen = function(event) {
    console.log('ws onopen:', event);
    that.callback.onopen(event);
  }

  this.ws.onmessage = function(event) {
    //console.log('ws onmessage:', event);
    that.callback.onmessage(event);
  }

  this.ws.onerror = function(event) {
    console.log('ws onerror:', event);
    that.callback.onerror(event);
  }

  this.ws.onclose = function(event) {
    console.log('ws onclose:', event);
    that.callback.onclose(event);
  }
}

NetworkWS.prototype._createRequestMsgStr = function(cmd, data=null) {
  return JSON.stringify({ cmd: cmd, data: data });
}

NetworkWS.prototype.send = function(msg) {
  this.ws.send(msg);
}

NetworkWS.prototype.close = function() {
  this.ws.close();
}

NetworkWS.prototype.ping = function() {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_ping));
}

NetworkWS.prototype.heartbeat = function() {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_heartbeat));
}

NetworkWS.prototype.listRoom = function() {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_listRoom));
}

NetworkWS.prototype.createRoom = function(playerId) {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_createRoom, 
    {
      playerId: playerId
    }));
}

NetworkWS.prototype.quitRoom = function() {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_quitRoom));
}

NetworkWS.prototype.joinRoom = function(roomId) {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_joinRoom, {roomId: roomId}));
}

NetworkWS.prototype.gameGoUp = function() {
  this.ws.send(this._createRequestMsgStr(kNetworkWSCommand_goUp));
}