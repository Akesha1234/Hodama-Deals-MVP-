const User = require('../models/User');

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

// ═══════════════════════════════════════════
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ═══════════════════════════════════════════
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'customer',
        });

        sendTokenResponse(user, 201, res);
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

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
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
