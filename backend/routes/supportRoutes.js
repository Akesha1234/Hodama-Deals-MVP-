const express = require('express');
const router = express.Router();
const {
    createTicket,
    getUserTickets,
    getSingleTicket,
    addTicketReply
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

// Support Ticket Routes (All Private - Must be logged in to create/view tickets)
router.route('/')
    .post(protect, createTicket)
    .get(protect, getUserTickets);

router.route('/:id')
    .get(protect, getSingleTicket);

router.route('/:id/reply')
    .post(protect, addTicketReply);

module.exports = router;
