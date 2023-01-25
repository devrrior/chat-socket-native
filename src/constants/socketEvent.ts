export enum SocketEvent {
  onMessage = 'event_on_message',
  onException = 'event_on_exception',
  sendMessage = 'event_send_message',
  joinRoom = 'event_join_room',
  leaveRoom = 'event_leave_room',
}

export default SocketEvent;
