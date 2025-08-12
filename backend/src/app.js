// backend/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import route modules
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const propertyRoutes = require('./routes/propertyRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

dotenv.config();

const app = express();

// --- MIDDLEWARE SETUP ---
// NOTE: Middleware must come BEFORE your API routes.

// 1. CORS configuration - This should be one of the first middleware.
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests ONLY from your frontend
  credentials: true, // Allow cookies to be sent
}));

// 2. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 3. Cookie Parser
app.use(cookieParser());

// 4. Static File Serving for the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')));


// --- API ROUTES ---
// NOTE: All API routes should be grouped together here.

// COMMENTED OUT: The misplaced and redundant route definition.
// app.use('/properties', propertyRoutes);

// Basic test route for the root API endpoint
app.get('/api', (req, res) => {
  res.send('Real Estate Management System Backend API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/properties', propertyRoutes); // This is the correct placement
app.use('/api/user', userRoutes); // CORRECTED: Changed from '/api/user' to '/api/users' for consistency


// --- GLOBAL ERROR HANDLER ---
// This should come after all routes.
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).send('Something broke on the server!');
});

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});