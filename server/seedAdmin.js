// server/seedAdmin.js
// Run this ONCE to create an admin user in the database:
// → cd server && node seedAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'admin@eventhub.com' });
  if (existing) {
    console.log('✅ Admin already exists. Email: admin@eventhub.com / Password: admin123');
    process.exit();
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@eventhub.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('✅ Admin created!');
  console.log('   Email   : admin@eventhub.com');
  console.log('   Password: admin123');
  console.log('   Login at: http://localhost:3000/admin/login');
  process.exit();
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
