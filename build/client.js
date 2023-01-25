"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const socketEvent_1 = require("./constants/socketEvent");
const socketClient_1 = __importDefault(require("./socket/socketClient"));
const readline = __importStar(require("readline"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const main = () => {
    const [, , host] = process.argv;
    console.clear();
    const socketClient = new socketClient_1.default();
    socketClient.connect(host, 3000, () => {
        console.log('Server connected!');
    });
    socketClient.on(socketEvent_1.SocketEvent.onMessage, (data) => {
        console.log(`\n${data.username}: ${data.message}`);
    });
    socketClient.on(socketEvent_1.SocketEvent.onException, (data) => {
        console.log(`ERROR: ${data.message}`);
        (0, process_1.exit)();
    });
    socketClient.ready(() => __awaiter(void 0, void 0, void 0, function* () {
        const username = yield askInput('Type your username: ');
        socketClient.join('general', username);
        console.log(`Welcome ${username}`);
        while (true) {
            yield sleep(100);
            const message = yield askInput('Type your message: ');
            if (message == 'EXIT') {
                console.log('Exit from room');
                socketClient.leave('general', username);
                socketClient.disconnect();
                break;
            }
            socketClient.emit(socketEvent_1.SocketEvent.sendMessage, 'general', {
                message,
                username,
            });
        }
    }));
    const askInput = (question) => {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question(question, (message) => {
                rl.close();
                resolve(message);
            });
        });
    };
};
main();
