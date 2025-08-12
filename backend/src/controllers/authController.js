// backend/src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { email, password,name, phoneNumber, location } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER', // Default role for new registrations
        name,
        phoneNumber: phoneNumber || null,
        location: location || null,
      },
    });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    if (error.code === 'P2002') { // Prisma error code for unique constraint violation
      return res.status(409).json({ error: 'Email already exists.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  console.log('AuthController: Login attempt for email:', email);
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('AuthController: User not found');
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    console.log('AuthController: User found:', { id: user.id, email: user.email, role: user.role });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('AuthController: Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    console.log('AuthController: Password verified successfully');

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.log('AuthController: ERROR - JWT_SECRET is not set!');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    console.log('AuthController: JWT_SECRET is set, creating token...');

    const role = user.role.toString().toUpperCase();

    const token = jwt.sign(
      { userId: user.id, role , email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    console.log('AuthController: Token created successfully');

    // NEW: Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Cannot be accessed by client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'Lax', // Protects against CSRF in some cases
      maxAge: 3600000, // 1 hour (in milliseconds)
    });

    console.log('AuthController: Cookie set successfully');

    res.status(200).json({ token, role: user.role, userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in.' });
  }
};

// NEW: Logout endpoint
exports.logout = (req, res) => {
  res.clearCookie('token',{
    secure: process.env.NODE_ENV ==='production',
    sameSite: 'Lax',
  }); // Clear the HttpOnly cookie
  res.status(200).json({ message: 'Logged out successfully.' });
};