"use strict";
exports.__esModule = true;
var net_1 = require("net");
var process_1 = require("process");
var SocketClient = /** @class */ (function () {
    function SocketClient() {
        this.socket = null;
        this.events = {};
    }
    SocketClient.prototype.connect = function (host, port, callback) {
        this.socket = new net_1.Socket();
        this.setupSocket();
        this.socket.connect({ host: host, port: port }, callback);
    };
    SocketClient.prototype.ready = function (callback) {
        if (!this.socket)
            return;
        this.socket.on('ready', callback);
    };
    SocketClient.prototype.on = function (event, eventAction) {
        this.events[event] = eventAction;
    };
    SocketClient.prototype.join = function (room, username) {
        this.sendEvent('join', { room: room, username: username });
    };
    SocketClient.prototype.leave = function (room, username) {
        this.sendEvent('leave', { room: room, username: username });
    };
    SocketClient.prototype.emit = function (event, room, data) {
        this.sendEvent('emit', { room: room, event: event, data: data });
    };
    SocketClient.prototype.disconnect = function () {
        if (!this.socket)
            return;
        this.socket.end();
        console.log('Connection closed');
        (0, process_1.exit)();
    };
    SocketClient.prototype.sendEvent = function (event, data) {
        if (!this.socket)
            return;
        var request = { event: event, data: data };
        var jsonString = JSON.stringify(request);
        this.socket.write(jsonString);
    };
    SocketClient.prototype.setupSocket = function () {
        var _this = this;
        if (!this.socket)
            return;
        this.socket.on('data', function (buffer) {
            var jsonString = buffer.toString();
            var request = JSON.parse(jsonString);
            if (!_this.events[request.event])
                return;
            _this.events[request.event](request.data);
        });
    };
    return SocketClient;
}());
exports["default"] = SocketClient;
