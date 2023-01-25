import { exit } from 'process';
import { SocketEvent } from './constants/socketEvent';
import SocketClient from './socket/socketClient';
import readline from 'readline';

console.clear();

const socketClient = new SocketClient();

socketClient.connect('localhost', 3000, () => {
  console.log('Server connected!');
});

socketClient.on(SocketEvent.onMessage, data => {
  console.log(`\n${data.username}: ${data.message}`);
});

socketClient.on(SocketEvent.onException, data => {
  console.log(`ERROR: ${data.message}`);
  exit();
});

socketClient.ready(async () => {

  const username = await askInput('Type your username: ');
  socketClient.join('general', username);
  console.log(`Welcome ${username}`);

  while(true) {

    await sleep(100);
    const message = await askInput('Type your message: ');
    if(message == 'EXIT') {
      console.log('Exit from room');
      socketClient.leave('general', username);
      socketClient.disconnect();
      break;
    };
    socketClient.emit(SocketEvent.sendMessage, 'general', {message, username});
  }

});


const askInput = (question: string): Promise<string> => {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, message => {
      rl.close();
      resolve(message);
    });
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));