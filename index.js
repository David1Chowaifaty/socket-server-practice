import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';


const app = express();
app.use(cors());
const server = http.createServer(app); // Create HTTP server for Express
const io = new Server(server); // Attach Socket.IO to the server

// Middleware to parse JSON bodies
app.use(express.json());

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

app.post('/add-user', (req, res) => {
    const user = req.body;
    users.push(user);
    console.log(users)
    io.emit('new-user', user); // Emit new user info to all connected Socket.IO clients
    res.status(201).send(user);
});

// Use the HTTP server to listen, not the Express application
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
