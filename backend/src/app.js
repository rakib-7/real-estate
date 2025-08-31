const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
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
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});


// MIDDLEWARE SETUP 
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
//app.use('/api/chat', chatRoutes); // ADDED: Use the chat routes


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



// --- API ROUTES ---
app.get('/api', (req, res) => {
    res.send('Real Estate Management System Backend API is running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes); 


// GLOBAL ERROR HANDLER 
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something broke on the server!');
});


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
