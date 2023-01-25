"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const socketEvent_1 = __importDefault(require("../constants/socketEvent"));
class SocketServer {
    constructor() {
        this.server = null;
        this.events = {};
        this.rooms = {};
        this.usernames = new Set();
    }
    on(event, eventAction) {
        this.events[event] = eventAction;
    }
    listen(port, callback) {
        this.server = new net_1.Server();
        this.setupServer();
        this.server.listen(port, callback);
    }
    setupServer() {
        if (!this.server)
            return;
        this.server.on('connection', (socket) => {
            socket.on('data', buffer => {
                const jsonString = buffer.toString();
                const request = JSON.parse(jsonString);
                switch (request.event) {
                    case 'join':
                        this.addSocketToRoom(request.data, socket);
                        return;
                    case 'leave':
                        this.removeSocketFromRoom(request.data, socket);
                        return;
                    case 'emit':
                        this.emitToRoom(request.data.room, request.data.data);
                        return;
                    default:
                        if (!this.events[request.event])
                            return;
                        this.events[request.event](socket, request.data);
                }
            });
        });
    }
    addSocketToRoom({ room, username }, socket) {
        if (this.usernames.has(username)) {
            this.sendException({ message: 'Username is already taken' }, socket);
            socket.destroy();
            return;
        }
        ;
        if (!this.rooms[room])
            this.rooms[room] = [];
        this.rooms[room].push(socket);
        this.usernames.add(username);
        console.log(`${username} is joining`);
    }
    removeSocketFromRoom({ room, username }, socket) {
        if (!this.rooms[room])
            return;
        this.rooms[room] = this.rooms[room].filter(s => s !== socket);
        this.usernames.delete(username);
        console.log(`${username} is leaving`);
    }
    emitToRoom(room, data) {
        if (!this.rooms[room])
            return;
        this.rooms[room].forEach(socket => {
            socket.write(JSON.stringify({ event: socketEvent_1.default.onMessage, data }));
        });
        console.log(`[${room}]: ${data.username} -> ${data.message}`);
    }
    sendException(data, socket) {
        socket.write(JSON.stringify({ event: socketEvent_1.default.onException, data }));
    }
}
exports.default = SocketServer;
