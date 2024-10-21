const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const PORT = 8000;
const server = app.listen(PORT, () => {
    console.log('Server working on port:', PORT);
});
const io = socket(server);

let tasks = [
    { id: 1, name: 'Shopping' },
    { id: 2, name: 'Go out with a dog' }
];

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        io.emit('addTask', task);
    });

    socket.on('removeTask', (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        io.emit('removeTask', taskId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});