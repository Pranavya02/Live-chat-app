const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('✅ A user connected');

  socket.on('join', username => {
    socket.username = username;
    socket.broadcast.emit('chat message', `📢 ${username} joined the chat`);
  });

  socket.on('chat message', msg => {
    const timestamp = new Date().toLocaleTimeString();
    io.emit('chat message', `[${timestamp}] ${socket.username}: ${msg}`);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', `${socket.username} is typing...`);
  });

  socket.on('disconnect', () => {
    io.emit('chat message', `👋 ${socket.username || 'Someone'} left the chat`);
  });
});

http.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});