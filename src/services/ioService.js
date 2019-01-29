import io from 'socket.io-client';
 
const socket = io('http://localhost:4000');

export default class IoService {
  static sendMessage(msg) {
    socket.emit('send', msg);
  }

  static onMessage(callback) {
    socket.on('receive', (msg) => {
      callback(msg);
    });
  }
}