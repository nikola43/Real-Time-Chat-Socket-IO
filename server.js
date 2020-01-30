const io = require('socket.io')(3000);

const users = {};
const colors = {};

io.on('connection', socket => {

    socket.on('new-user', (name, color) => {
        users[socket.id] = name;
        colors[socket.id] = color;

        const data = {
            name: name,
            color: color,
        };
        console.log(data);
        socket.broadcast.emit('user-connected', data);
    });

    socket.on('send-chat-message', (message) => {
        const data = {
            message: message,
            name: users[socket.id],
            color: colors[socket.id]
        };
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('disconnect', () => {
        const data = {
            name: users[socket.id],
            color: colors[socket.id]
        };

        socket.broadcast.emit('user-disconnected', data);
        delete users[socket.id]
    })
});
