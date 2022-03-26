const express = require('express');
const http = require('http');
const socketio = require('socket.io')
const cors = require('cors');

const PORT = 8081;

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        status: "Server is Running!"
    });
});

io.on("connection", (socket) => {
    socket.emit('me', socket.id);
    
    socket.on("disconnect", () => {
        socket.broadcast.emit('callended');
    });
    
    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('calluser', { signal: signalData, from, name });
    });
    
    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal);
    })
});

server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
