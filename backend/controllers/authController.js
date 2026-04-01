const crypto = require('crypto');
const path = require('path');
const axios = require('axios');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ── Helper: send token response ──
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
        },
    });
};
 
// ── Branding Helpers for Emails ──
const BRAND_HEADER_HTML = `
    <!-- Force Light Mode Colors to prevent auto-inversion by mobile generic dark modes -->
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #edf2f7;">
        <h1 style="margin: 0; color: #0056D2; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            HODAMA <span style="color: #FFC107;">DEALS</span>
        </h1>
    </div>
`;

// ═══════════════════════════════════════════
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ═══════════════════════════════════════════
exports.register = async (req, res, next) => {
    console.log('--- REGISTER REQUEST RECEIVED ---');
    console.log('Body:', req.body);
    try {
        const { name, email, password, phone, role, sellerProfile, captchaToken } = req.body;

        // Verify ReCAPTCHA
        if (!captchaToken) {
            return res.status(400).json({
                success: false,
                message: 'Please complete the reCAPTCHA verification',
            });
        }

        try {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFojJ4WifJ0jv'; // TEST SECRET KEY
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
            const response = await axios.post(verifyUrl);
            
            if (!response.data.success) {
                return res.status(400).json({
                    success: false,
                    message: 'ReCAPTCHA verification failed. Please try again.',
                });
            }
        } catch (error) {
            console.error('ReCAPTCHA error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during reCAPTCHA verification',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        const roleAssigned = role || 'customer';

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: roleAssigned,
            isVerified: roleAssigned === 'customer', // Auto-verify customers implicitly
            ...(sellerProfile && { sellerProfile }),
        });

        // ── Real World: Send Verification Email to Sellers Only ──
        if (roleAssigned === 'seller') {
            const verificationToken = user.getEmailVerificationToken();
            await user.save({ validateBeforeSave: false });

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;
            
            const message = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 12px; background-color: #fff;">
                    ${BRAND_HEADER_HTML}
                    <h2 style="color: #1a202c; text-align: center; font-size: 24px;">Welcome to Hodama Deals!</h2>
                    <p style="color: #4a5568!important; line-height: 1.6;">You're receiving this email because you've successfully registered a Business/Seller account on our platform.</p>
                    <p style="color: #4a5568!important; line-height: 1.6;">Please click the button below to verify your email address and activate your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyUrl}" style="background-color: #0056D2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 16px;">VERIFY EMAIL ADDRESS</a>
                    </div>
                    <p style="font-size: 13px; color: #718096; margin-top: 20px;">Or copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; background: #edf2f7; padding: 10px; border-radius: 4px; word-break: break-all;"><a href="${verifyUrl}" style="color: #0056D2;">${verifyUrl}</a></p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #a0aec0; text-align: center;">&copy; 2026 Hodama Deals - Your Trusted Deals Marketplace. All rights reserved.</p>
                </div>
            `;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Hodama Deals - Verify Your Seller Email',
                    html: message
                });
            } catch (error) {
                console.error('Email send failed:', error);
                user.emailVerificationToken = undefined;
                user.emailVerificationExpire = undefined;
                await user.save({ validateBeforeSave: false });
                
                return res.status(500).json({ 
                    success: false, 
                    message: 'Account created, but email send failed: ' + error.message 
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Registration successful! Please check your email to verify your seller account.'
            });
        }

        // For ordinary customers, they are auto-verified implicitly
        res.status(201).json({
            success: true,
            message: 'Registration successful! You can now safely log in.'
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ═══════════════════════════════════════════
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.',
            });
        }

        // Check if user has verified their email
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email address to log in.',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.googleLogin = async (req, res, next) => {
    try {
        const { access_token } = req.body;
        if (!access_token) {
            return res.status(400).json({ success: false, message: 'Google authentication failed. No access token provided.' });
        }

        // Fetch user profile from Google directly
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, name, picture, sub: googleId } = response.data;

        // Check if user exists in Hodama Deals DB
        let user = await User.findOne({ email });

        if (!user) {
            // Auto Register new user seamlessly via Google Context (Auto-Signup)
            user = await User.create({
                name,
                email,
                password: crypto.randomBytes(20).toString('hex') + 'G@1x', // Immutable dummy secure password
                role: 'customer', // Defaults to standard customer user
                isVerified: true, // Inherits verification implicitly from Google
                avatar: picture,
            });
        } else if (!user.isVerified) {
            // Auto verify if user existed but was unverified
            user.isVerified = true;
            await user.save();
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.',
            });
        }

        // Return JWT session context payload
        sendTokenResponse(user, 200, res);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Google authentication failed internally',
        });
    }
};

// ═══════════════════════════════════════════
// @desc    Login/Register via Facebook OAuth
// @route   POST /api/auth/facebook
// @access  Public
// ═══════════════════════════════════════════
exports.facebookLogin = async (req, res, next) => {
    try {
        const { accessToken } = req.body;
        
        // Fetch user profile from Facebook directly to verify authenticity
        const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
        
        const { email, name, picture } = response.data;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Your Facebook account does not have a public email associated with it.',
            });
        }

        // Check if user exists in Hodama Deals DB
        let user = await User.findOne({ email });

        if (!user) {
            // Auto Register new user seamlessly via Facebook Context (Auto-Signup)
            user = await User.create({
                name,
                email,
                password: crypto.randomBytes(20).toString('hex') + 'F@1x', // Immutable dummy secure password
                role: 'customer', // Defaults to standard customer user
                isVerified: true, // Inherits verification implicitly from Facebook
                avatar: picture?.data?.url || '',
            });
        } else if (!user.isVerified) {
            // Auto verify if user existed but was unverified
            user.isVerified = true;
            await user.save();
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Facebook authentication failed internally',
        });
    }
};

// ═══════════════════════════════════════════
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ═══════════════════════════════════════════
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ═══════════════════════════════════════════
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            avatar: req.body.avatar,
            address: req.body.address,
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(
            (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
// ═══════════════════════════════════════════
exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Verify Email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
// ═══════════════════════════════════════════
exports.verifyEmail = async (req, res, next) => {
    try {
        console.log('--- VERIFY EMAIL HIT ---');
        console.log('Raw Token params:', req.params.token);

        // Get hashed token from URL params
        const emailVerificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        console.log('Hashed Token Computed:', emailVerificationToken);

        // Find user by token and ensure token hasn't expired
        const user = await User.findOne({
            emailVerificationToken,
            emailVerificationExpire: { $gt: Date.now() },
        });

        if (!user) {
            console.log('User NOT found or Token EXPIRED!');
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token',
            });
        }

        console.log('User found! Verifying...', user.email);

        // Set user as verified and clear tokens
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save({ validateBeforeSave: false });

        console.log('Success verifying!');

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        console.error('VerifyEmail Error:', error);
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgotpassword
// @access  Public
// ═══════════════════════════════════════════
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email',
            });
        }

        // Get OTP
        const otp = user.getResetPasswordOTP();
        await user.save({ validateBeforeSave: false });

        // Send Email
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 12px; background-color: #fff;">
                ${BRAND_HEADER_HTML}
                <h2 style="color: #1a202c; text-align: center; font-size: 24px;">Reset Password Request</h2>
                <p style="color: #4a5568!important; line-height: 1.6;">You've requested a password reset for your Hodama Deals account.</p>
                <p style="color: #4a5568!important; line-height: 1.6;">Please use the following 6-digit OTP code to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <h1 style="background: #f7fafc; padding: 20px; display: inline-block; letter-spacing: 12px; border-radius: 8px; color: #0056D2; font-size: 36px; border: 1px dashed #cbd5e0; margin: 0;">${otp}</h1>
                </div>
                <p style="font-size: 14px; font-weight: bold; color: #e53e3e; text-align: center;">This code will expire in 10 minutes.</p>
                <p style="font-size: 13px; color: #718096; margin-top: 25px; text-align: center;">If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                <p style="font-size: 12px; color: #a0aec0; text-align: center;">&copy; 2026 Hodama Deals - Your Trusted Deals Marketplace. All rights reserved.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Hodama Deals - Password Reset OTP',
                html: message
            });

            res.status(200).json({
                success: true,
                message: 'OTP sent to email',
            });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent',
            });
        }
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Verify OTP
// @route   POST /api/auth/verifyotp
// @access  Public
// ═══════════════════════════════════════════
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP Verified',
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Reset Password
// @route   PUT /api/auth/resetpassword
// @access  Public
// ═══════════════════════════════════════════
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP. Please request a new one.',
            });
        }

        // Set New Password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset completely. You can now login.',
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Upgrade Customer to Seller (Partner)
// @route   PUT /api/auth/become-seller
// @access  Private
// ═══════════════════════════════════════════
exports.becomeSeller = async (req, res, next) => {
    try {
        const { businessName, businessType, category, websiteLink } = req.body;

        if (!businessName || !category) {
            return res.status(400).json({
                success: false,
                message: 'Business Name and Category are required to become a seller',
            });
        }

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'seller' || user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'You are already a Partner' });
        }

        user.role = 'seller';
        user.sellerProfile = {
            businessName,
            businessType: businessType || 'Individual',
            category,
            websiteLink: websiteLink || '',
        };

        await user.save({ validateBeforeSave: false }); // Bypass specific validations if testing locally

        sendTokenResponse(user, 200, res); // Resend updated token matching seller session
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Send Login OTP (Magic Link)
// @route   POST /api/auth/send-login-otp
// @access  Public
// ═══════════════════════════════════════════
exports.sendLoginOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email' });
        }

        let user = await User.findOne({ email });

        // Auto-Register on the spot if user doesn't exist
        let isNewUser = false;
        if (!user) {
            user = await User.create({
                name: email.split('@')[0], // Extract name from email
                email,
                password: crypto.randomBytes(20).toString('hex') + 'O@1x', // Dummy secure password
                role: 'customer',
                isVerified: true, // We will verify them through OTP implicitly
            });
            isNewUser = true;
        }

        // Generate Login OTP
        const otp = user.getLoginOTP();
        await user.save({ validateBeforeSave: false });
        
        // Log OTP to console for easy local testing when emails aren't working
        console.log(`\n===========================================`);
        console.log(`🚀 [MAGIC LINK OTP] for ${email}: ${otp}`);
        console.log(`===========================================\n`);

        // Send Email
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 12px; background-color: #fff;">
                ${BRAND_HEADER_HTML}
                <h2 style="color: #1a202c; text-align: center; font-size: 24px;">${isNewUser ? 'Welcome to Hodama Deals!' : 'Secure Login Code'}</h2>
                <p style="color: #4a5568!important; line-height: 1.6;">Use the following 6-digit code to securely log in to your account. No password required!</p>
                <div style="text-align: center; margin: 30px 0;">
                    <h1 style="background: #f0fff4; padding: 20px; display: inline-block; letter-spacing: 12px; border-radius: 8px; color: #2F855A; font-size: 36px; border: 1px dashed #9AE6B4; margin: 0;">${otp}</h1>
                </div>
                <p style="font-size: 14px; font-weight: bold; color: #e53e3e; text-align: center;">This code will expire in 10 minutes.</p>
                <p style="font-size: 13px; color: #718096; margin-top: 25px; text-align: center;">If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                <p style="font-size: 12px; color: #a0aec0; text-align: center;">&copy; 2026 Hodama Deals - Your Trusted Deals Marketplace. All rights reserved.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Hodama Deals - Your Login Code',
                html: message
            });

            res.status(200).json({
                success: true,
                message: 'Login code sent to email',
                isNewUser
            });
        } catch (error) {
            user.loginOTP = undefined;
            user.loginOTPExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent',
            });
        }
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Verify Login OTP
// @route   POST /api/auth/verify-login-otp
// @access  Public
// ═══════════════════════════════════════════
exports.verifyLoginOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            loginOTP: hashedOTP,
            loginOTPExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired code',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated.',
            });
        }

        // Implicitly set user as verified if they weren't
        if (!user.isVerified) {
            user.isVerified = true;
        }

        // Clear OTP on successful login
        user.loginOTP = undefined;
        user.loginOTPExpire = undefined;
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};
