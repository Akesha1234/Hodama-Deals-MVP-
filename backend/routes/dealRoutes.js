const express = require('express');
const router = express.Router();
const {
    getDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealsBySeller,
} = require('../controllers/dealController');
const { protect, authorize } = require('../middleware/auth');
const { createDealRules, mongoIdRule, validate } = require('../middleware/validators');

// Public
router.get('/', getDeals);
router.get('/:id', getDeal);
router.get('/seller/:sellerId', getDealsBySeller);

// Private (seller, admin)
router.post('/', protect, authorize('seller', 'admin'), createDealRules, validate, createDeal);
router.put('/:id', protect, authorize('seller', 'admin'), updateDeal);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteDeal);

module.exports = router;
