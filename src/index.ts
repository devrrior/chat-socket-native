import SocketServer from "./socket/socketServer";

const socket = new SocketServer();

socket.listen(3000, () => {
  console.clear();
  console.log('Socket is running!');
});