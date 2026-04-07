const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/library-management-system')
  .then(async () => {
    // Delete if already exists to avoid duplicate logic
    await User.deleteMany({ email: 'admin@lms.com' });

    const admin = new User({
        name: 'Master Admin',
        email: 'admin@lms.com',
        password: 'password123',
        role: 'admin'
    });
    
    await admin.save();
    console.log("SUCCESS: Default Admin account created!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
