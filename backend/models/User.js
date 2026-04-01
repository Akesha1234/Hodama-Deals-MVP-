const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['customer', 'seller', 'admin'],
            default: 'customer',
        },
        avatar: {
            type: String,
            default: '',
        },
        address: {
            street: String,
            city: String,
            province: String,
            postalCode: String,
            country: { type: String, default: 'Sri Lanka' },
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Deal',
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        emailVerificationToken: String,
        emailVerificationExpire: Date,
        sellerProfile: {
            businessName: String,
            businessType: String,
            category: String,
            websiteLink: String,
        },
        resetPasswordOTP: String,
        resetPasswordOTPExpire: Date,
        loginOTP: String,
        loginOTPExpire: Date,
    },
    {
        timestamps: true,
    }
);

// ── Hash password before saving ──
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        const salt = bcrypt.genSaltSync(12);
        this.password = bcrypt.hashSync(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// ── Compare entered password with hashed password ──
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ── Generate JWT token ──
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// ── Generate and hash email verification token ──
UserSchema.methods.getEmailVerificationToken = function () {
    const crypto = require('crypto');
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to emailVerificationToken field
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // Set expire (e.g. 10 minutes)
    this.emailVerificationExpire = Date.now() + 10 * 60 * 1000;

    return verificationToken;
};

// ── Generate Reset Password OTP ──
UserSchema.methods.getResetPasswordOTP = function () {
    const crypto = require('crypto');
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash it and set to resetPasswordOTP field
    this.resetPasswordOTP = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    // Set expire (e.g. 10 minutes)
    this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;

    return otp; // Return unhashed OTP to send via email
};

// ── Generate Login OTP ──
UserSchema.methods.getLoginOTP = function () {
    const crypto = require('crypto');
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash it and set to loginOTP field
    this.loginOTP = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    // Set expire (e.g. 10 minutes)
    this.loginOTPExpire = Date.now() + 10 * 60 * 1000;

    return otp; // Return unhashed OTP to send via email
};

module.exports = mongoose.model('User', UserSchema);
