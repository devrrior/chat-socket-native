"use strict";
exports.__esModule = true;
exports.SocketEvent = void 0;
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["onMessage"] = "event_on_message";
    SocketEvent["onException"] = "event_on_exception";
    SocketEvent["sendMessage"] = "event_send_message";
    SocketEvent["joinRoom"] = "event_join_room";
    SocketEvent["leaveRoom"] = "event_leave_room";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
exports["default"] = SocketEvent;
