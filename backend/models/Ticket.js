const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Deal Inquiry', 'Partnership', 'Account Support', 'Report a Problem', 'Other']
    },
    dealId: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    attachments: [{
        type: String // URLs or Paths to uploaded files
    }],
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    replies: [{
        sender: {
            type: String,
            enum: ['User', 'Admin'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
