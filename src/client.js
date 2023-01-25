"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var process_1 = require("process");
var socketEvent_1 = require("./constants/socketEvent");
var socketClient_1 = require("./socket/socketClient");
var readline = require("readline");
console.clear();
var socketClient = new socketClient_1["default"]();
socketClient.connect('localhost', 3000, function () {
    console.log('Server connected!');
});
socketClient.on(socketEvent_1.SocketEvent.onMessage, function (data) {
    console.log("\n".concat(data.username, ": ").concat(data.message));
});
socketClient.on(socketEvent_1.SocketEvent.onException, function (data) {
    console.log("ERROR: ".concat(data.message));
    (0, process_1.exit)();
});
socketClient.ready(function () { return __awaiter(void 0, void 0, void 0, function () {
    var username, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, askInput('Type your username: ')];
            case 1:
                username = _a.sent();
                socketClient.join('general', username);
                console.log("Welcome ".concat(username));
                _a.label = 2;
            case 2:
                if (!true) return [3 /*break*/, 5];
                return [4 /*yield*/, sleep(100)];
            case 3:
                _a.sent();
                return [4 /*yield*/, askInput('Type your message: ')];
            case 4:
                message = _a.sent();
                if (message == 'EXIT') {
                    console.log('Exit from room');
                    socketClient.leave('general', username);
                    socketClient.disconnect();
                    return [3 /*break*/, 5];
                }
                ;
                socketClient.emit(socketEvent_1.SocketEvent.sendMessage, 'general', { message: message, username: username });
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
var askInput = function (question) {
    return new Promise(function (resolve) {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, function (message) {
            rl.close();
            resolve(message);
        });
    });
};
var sleep = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
