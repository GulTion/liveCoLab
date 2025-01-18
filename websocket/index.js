// server/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const { findUser, createUser, validateCredentials } = require('./users');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// ----------------------------
// 1) AUTH ENDPOINTS
// ----------------------------

// Sign Up
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  
  // Basic checks
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Check if user already exists
  if (findUser(username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Create new user
  createUser({ username, password });
  return res.status(201).json({ message: 'User created successfully' });
});

// Login (very naive, for demonstration)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  if (validateCredentials(username, password)) {
    // In a real app: generate a token/session
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ----------------------------
// 2) SOCKET.IO
// ----------------------------
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Listen for a "join-room" event
  socket.on('join-room', ({ roomId, username }) => {
    console.log(`${username} (${socket.id}) joined room: ${roomId}`);
    socket.join(roomId);

    // Notify other members in the room
    socket.to(roomId).emit('user-joined', { 
      message: `User "${username}" joined room "${roomId}"`, 
      username
    });
  });

  // Listen for "send-message" event
  socket.on('send-message', ({ roomId, message, username }) => {
    console.log(`Message from ${username} in room ${roomId}: ${message}`);
    // Emit to everyone in the room
    io.to(roomId).emit('receive-message', {
      message,
      senderName: username,
      roomId
    });
  });

  // On client disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
