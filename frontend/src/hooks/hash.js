// hash_password.js
const bcrypt = require('bcryptjs');

const passwordToHash = 'admin'; // <--- CHOOSE A STRONG ADMIN PASSWORD

bcrypt.hash(passwordToHash, 10)
  .then(hash => {
    console.log('Hashed Password:', hash);
  })
  .catch(err => console.error(err));