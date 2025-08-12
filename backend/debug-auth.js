// Debug authentication status
const jwt = require('jsonwebtoken');

// Test JWT token verification
function testJWT() {
  console.log('Testing JWT verification...');
  
  // Check if JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    console.log('❌ JWT_SECRET is not set!');
    return;
  }
  
  console.log('✅ JWT_SECRET is set');
  
  // Create a test token
  const testPayload = {
    userId: 4,
    role: 'admin',
    email: 'admin@test.com'
  };
  
  try {
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Token created successfully');
    console.log('Token:', token.substring(0, 20) + '...');
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);
    
  } catch (error) {
    console.log('❌ JWT error:', error.message);
  }
}

testJWT(); 