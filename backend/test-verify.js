require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('./models/User');

const testHash = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    console.log('Plain Token:', verificationToken);

    const hashedToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    console.log('Hashed Token:', hashedToken);

    // Save user
    const user = new User({
        name: 'Test Verify',
        email: 'testtest123@xyz.com',
        password: 'password123',
        emailVerificationToken: hashedToken,
        emailVerificationExpire: Date.now() + 10 * 60 * 1000
    });
    await user.save({ validateBeforeSave: false });

    console.log('User saved to DB with hash!');

    // Now try to fetch it back!
    const searchHash = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    console.log('Searching using hash:', searchHash);

    const foundUser = await User.findOne({
        emailVerificationToken: searchHash,
        emailVerificationExpire: { $gt: Date.now() }
    });

    if (foundUser) {
        console.log('SUCCESS: User found with matching token and valid expire date!');
        await User.deleteOne({ email: 'testtest123@xyz.com' });
    } else {
        console.log('FAIL: User NOT found!');
    }
    
    process.exit(0);
};

testHash();
