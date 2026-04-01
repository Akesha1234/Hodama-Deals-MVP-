require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().sort({ createdAt: -1 }).limit(3);
        console.log('Latest 3 Users:');
        users.forEach(u => {
            console.log(`- Email: ${u.email}`);
            console.log(`  isVerified: ${u.isVerified}`);
            console.log(`  VerifyToken: ${u.emailVerificationToken}`);
            console.log(`  TokenExpire: ${u.emailVerificationExpire}`);
            console.log(`  Is Expired?: ${u.emailVerificationExpire < new Date()}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
