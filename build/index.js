"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketServer_1 = __importDefault(require("./socket/socketServer"));
const socket = new socketServer_1.default();
socket.listen(3000, () => {
    console.clear();
    console.log('Socket is running!');
});
