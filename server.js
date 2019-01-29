const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const channel = 'chat'
const redis = require('redis')
  , subscriber = redis.createClient()
  , publisher  = redis.createClient();

subscriber.on('message', function(cha, message) {
  if (cha === channel) {
    io.emit('receive', message);
  }
});

subscriber.subscribe(channel);

app.use(express.static('build'));

app.get('/user/:userId', (req, res) => {
  res.send(
    {
      'id': req.params.userId,
      'username': 'Alfredo',
      'avatar': 'https://api.adorable.io/avatars/200/Alfredo.png',
      'bio': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras urna ante, sollicitudin sed placerat a, sagittis sit amet sem. Proin in euismod urna, vel vestibulum nibh. Integer dictum velit non.'
    }
  );
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

io.on('connection', function(client){
  client.on('send', (msg) => {
    publisher.publish(channel, msg);
  });
});