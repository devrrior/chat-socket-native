import { Socket } from 'net';
import HashTable from './types/hashTable';
import Callback from './types/callback';
import RequestEvent from './types/requestEvent';
import { exit } from 'process';

type FunctionEvent = (data: any) => void;

export default class SocketClient {

  private socket: Socket | null = null;
  private events: HashTable<FunctionEvent> = {};

  public connect(port: number, callback: Callback): void {
    this.socket = new Socket();
    this.setupSocket();
    this.socket.connect(port, callback);
  }

  public ready(callback: Callback): void {
    if(!this.socket) return;

    this.socket.on('ready', callback);
  }

  public on(event: string, eventAction: FunctionEvent): void {
    this.events[event] = eventAction;
  }

  public join(room: string, username: string): void {
    this.sendEvent('join', { room, username });
  }

  public leave(room: string, username: string): void {
    this.sendEvent('leave', { room, username });
  }

  public emit(event: string, room: string, data: any): void {
    this.sendEvent('emit', { room, event, data });
  }

  public disconnect(): void {
    if(!this.socket) return
    this.socket.end();

    console.log('Connection closed');
    exit();
  }

  private sendEvent(event: string, data: any): void {
    if(!this.socket) return
    const request: RequestEvent = { event, data };
    const jsonString = JSON.stringify(request);
    this.socket.write(jsonString);
  }

  private setupSocket(): void {
    if(!this.socket) return
    this.socket.on('data', buffer => {
      const jsonString = buffer.toString()
      const request: RequestEvent = JSON.parse(jsonString);
      if(!this.events[request.event]) return
      this.events[request.event](request.data);
    });
  }
}
