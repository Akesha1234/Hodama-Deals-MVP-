const Ticket = require('../models/Ticket');

// @desc    Create new support ticket
// @route   POST /api/support
// @access  Private
exports.createTicket = async (req, res, next) => {
    try {
        const { fullName, email, category, dealId, description, attachments } = req.body;

        if (!fullName || !email || !category || !description) {
            return res.status(400).json({ success: false, message: 'Please fill out all required fields.' });
        }

        const ticket = await Ticket.create({
            user: req.user.id,
            fullName,
            email,
            category,
            dealId,
            description,
            attachments: attachments || []
        });

        res.status(201).json({
            success: true,
            message: 'Support request submitted successfully.',
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's tickets
// @route   GET /api/support
// @access  Private
exports.getUserTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).sort('-createdAt');
        
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single ticket
// @route   GET /api/support/:id
// @access  Private
exports.getSingleTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // Make sure user owns ticket or is admin
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to view this ticket.' });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a reply to a ticket
// @route   POST /api/support/:id/reply
// @access  Private
exports.addTicketReply = async (req, res, next) => {
    try {
        const { message } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // Determine sender
        const isOwner = ticket.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(401).json({ success: false, message: 'Not authorized.' });
        }

        const reply = {
            sender: isAdmin ? 'Admin' : 'User',
            message
        };

        ticket.replies.push(reply);

        // If user replies to a closed ticket, reopen it
        if (!isAdmin && ticket.status === 'Closed') {
            ticket.status = 'Open';
        } 
        // If admin replies, status can visually change to In Progress
        else if (isAdmin && ticket.status === 'Open') {
            ticket.status = 'In Progress';
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};
