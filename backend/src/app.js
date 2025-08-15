const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
// ADDED: Import the built-in 'http' module and 'Server' from 'socket.io'
const http = require('http');
const { Server } = require('socket.io');

// Import route modules
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const propertyRoutes = require('./routes/propertyRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');

dotenv.config();

const app = express();
// ADDED: Create an HTTP server instance from your Express app.
const server = http.createServer(app);

// ADDED: Initialize a new Socket.IO server and attach it to the HTTP server.
// This configures it to allow connections from your frontend.
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your frontend URL
        methods: ["GET", "POST"]
    }
});


// --- MIDDLEWARE SETUP ---
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
//app.use('/api/chat', chatRoutes); // ADDED: Use the chat routes

// --- REAL-TIME CHAT LOGIC ---
// This block listens for real-time events.
io.on('connection', (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    // Event for a client (user or admin) to join a specific chat room.
    // The room will be named after the user's ID for direct messaging.
    socket.on('join_chat', (userId) => {
        socket.join(userId.toString());
        console.log(`User with socket ID ${socket.id} joined chat room for user ID: ${userId}`);
    });

    // Event for when a new message is sent from a client.
    socket.on('send_message', (data) => {
        // 'data' will contain { content, senderId, chatId (which is the userId) }
        // In a full implementation, you would save this message to the database here.
        
        // Broadcast the received message to all clients in that specific room.
        // This ensures both the user and any listening admin receive the message instantly.
        socket.broadcast.to(data.chatId.toString()).emit('receive_message', data);
    });
    // Event for when a user disconnects.
    socket.on('disconnect', () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
    });
});
// --- END OF REAL-TIME LOGIC ---


// --- API ROUTES ---
app.get('/api', (req, res) => {
    res.send('Real Estate Management System Backend API is running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes); // ADDED: Use the chat routes


// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something broke on the server!');
});


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

// COMMENTED OUT: The original server startup logic.
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// CORRECTED: Use server.listen() to start both the Express app and the Socket.IO server.
server.listen(PORT, () => {
    console.log(`🚀 Server running and listening for real-time events on http://localhost:${PORT}`);
});