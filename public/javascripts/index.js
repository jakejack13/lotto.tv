const socket = io();

socket.on('winner', (msg) => {
  console.log(msg);
});

socket.emit('winner', '');
