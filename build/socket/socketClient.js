"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const process_1 = require("process");
class SocketClient {
    constructor() {
        this.socket = null;
        this.events = {};
    }
    connect(host, port, callback) {
        this.socket = new net_1.Socket();
        this.setupSocket();
        this.socket.connect({ host, port }, callback);
    }
    ready(callback) {
        if (!this.socket)
            return;
        this.socket.on('ready', callback);
    }
    on(event, eventAction) {
        this.events[event] = eventAction;
    }
    join(room, username) {
        this.sendEvent('join', { room, username });
    }
    leave(room, username) {
        this.sendEvent('leave', { room, username });
    }
    emit(event, room, data) {
        this.sendEvent('emit', { room, event, data });
    }
    disconnect() {
        if (!this.socket)
            return;
        this.socket.end();
        console.log('Connection closed');
        (0, process_1.exit)();
    }
    sendEvent(event, data) {
        if (!this.socket)
            return;
        const request = { event, data };
        const jsonString = JSON.stringify(request);
        this.socket.write(jsonString);
    }
    setupSocket() {
        if (!this.socket)
            return;
        this.socket.on('data', buffer => {
            const jsonString = buffer.toString();
            const request = JSON.parse(jsonString);
            if (!this.events[request.event])
                return;
            this.events[request.event](request.data);
        });
    }
}
exports.default = SocketClient;
