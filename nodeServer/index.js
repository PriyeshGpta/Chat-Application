// Node server which will handle socket io connections
const io = require('socket.io')(8000);
const users = {};

io.on('connection', socket =>{
    // If someone new joins the chat, let everybody know
    socket.on('new-user-joined', Name =>{
        users[socket.id] = Name; 
        socket.broadcast.emit('user-joined', Name)
    });
    // If someone sends the message, broadcast to everybody
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, Name: users[socket.id]})
    });
    // If someone leaves the chat, let everybody know 
    // disconnect is inbuilt event
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});