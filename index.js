import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());


const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const users = [];
app.get("/get-users", (req, res) => {
    res.send(users)
})
app.post('/add-user', (req, res) => {
    const user = req.body;
    users.push(user);
    console.log(users);
    io.emit('new-user', user); // Emit new user info to all connected Socket.IO clients
    res.status(201).send(user);
});

// Use the HTTP server to listen, not the Express application
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
