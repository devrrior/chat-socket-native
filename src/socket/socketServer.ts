import { Server, Socket } from "net";
import HashTable from "./types/hashTable";
import Callback from "./types/callback";
import RequestEvent from "./types/requestEvent";
import FunctionEvent from "./types/functionEvent";
import RoomEventParameters from "./types/roomEventParameters";
import SocketEvent from "../constants/socketEvent";

export default class SocketServer {
  private server: Server | null = null;
  private events: HashTable<FunctionEvent> = {};
  private rooms: HashTable<Socket[]> = {};
  private usernames: Set<string> = new Set();

  public on(event: string, eventAction: FunctionEvent): void {
    this.events[event] = eventAction;
  }

  public listen(port: number, callback: Callback): void {
    this.server = new Server();
    this.setupServer();
    this.server.listen(port, callback);
  }

  private setupServer(): void {
    if(!this.server) return

    this.server.on('connection', (socket) => {
      socket.on('data', buffer => {
        const jsonString = buffer.toString()
        const request: RequestEvent = JSON.parse(jsonString);

        switch(request.event) {
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
            if(!this.events[request.event]) return
            this.events[request.event](socket, request.data);
        }

      });
    });
  }

  private addSocketToRoom({ room, username }: RoomEventParameters, socket: Socket): void {
    if(this.usernames.has(username)) {
      this.sendException({ message: 'Username is already taken' }, socket);
      socket.destroy();
      return;
    };

    if(!this.rooms[room]) this.rooms[room] = [];
    this.rooms[room].push(socket);
    this.usernames.add(username);

    console.log(`${username} is joining`);
  }

  private removeSocketFromRoom({ room, username }: RoomEventParameters, socket: Socket): void {
    if(!this.rooms[room]) return;
    this.rooms[room] = this.rooms[room].filter(s => s !== socket);
    this.usernames.delete(username);
    console.log(`${username} is leaving`);
  }

  private emitToRoom(room: string, data: any): void {
    if(!this.rooms[room]) return;
    this.rooms[room].forEach(socket => {
      socket.write(JSON.stringify({ event: SocketEvent.onMessage, data }));
    });

    console.log(`[${room}]: ${data.username} -> ${data.message}`);
  }

  private sendException(data: any, socket: Socket): void {
    socket.write(JSON.stringify({event: SocketEvent.onException, data}));
  }
}
