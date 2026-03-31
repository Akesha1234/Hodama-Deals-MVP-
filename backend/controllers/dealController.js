const Deal = require('../models/Deal');

// ═══════════════════════════════════════════
// @desc    Get all deals (with filtering, sorting, pagination)
// @route   GET /api/deals
// @access  Public
// ═══════════════════════════════════════════
exports.getDeals = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            sort = '-createdAt',
            category,
            search,
            minPrice,
            maxPrice,
            status = 'approved',
            featured,
            newArrival,
        } = req.query;

        // Build filter
        const filter = { status };

        if (category) filter.category = category;
        if (featured === 'true') filter.isFeatured = true;
        if (newArrival === 'true') filter.isNewArrival = true;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }

        if (minPrice || maxPrice) {
            filter.dealPrice = {};
            if (minPrice) filter.dealPrice.$gte = Number(minPrice);
            if (maxPrice) filter.dealPrice.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [deals, total] = await Promise.all([
            Deal.find(filter)
                .populate('category', 'name slug')
                .populate('seller', 'name avatar')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit)),
            Deal.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: deals.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            deals,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get single deal by ID or slug
// @route   GET /api/deals/:id
// @access  Public
// ═══════════════════════════════════════════
exports.getDeal = async (req, res, next) => {
    try {
        let deal;

        // Try by ID first, then by slug
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            deal = await Deal.findById(req.params.id)
                .populate('category', 'name slug')
                .populate('seller', 'name avatar phone');
        } else {
            deal = await Deal.findOne({ slug: req.params.id })
                .populate('category', 'name slug')
                .populate('seller', 'name avatar phone');
        }

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found',
            });
        }

        // Increment views
        deal.views += 1;
        await deal.save();

        res.status(200).json({
            success: true,
            deal,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Create a new deal
// @route   POST /api/deals
// @access  Private (seller, admin)
// ═══════════════════════════════════════════
exports.createDeal = async (req, res, next) => {
    try {
        // Attach seller
        req.body.seller = req.user.id;

        const deal = await Deal.create(req.body);

        res.status(201).json({
            success: true,
            deal,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Update a deal
// @route   PUT /api/deals/:id
// @access  Private (seller-owner, admin)
// ═══════════════════════════════════════════
exports.updateDeal = async (req, res, next) => {
    try {
        let deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found',
            });
        }

        // Only owner or admin can update
        if (
            deal.seller.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this deal',
            });
        }

        deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            deal,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private (seller-owner, admin)
// ═══════════════════════════════════════════
exports.deleteDeal = async (req, res, next) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found',
            });
        }

        // Only owner or admin
        if (
            deal.seller.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this deal',
            });
        }

        await deal.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Deal deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get deals by seller
// @route   GET /api/deals/seller/:sellerId
// @access  Public
// ═══════════════════════════════════════════
exports.getDealsBySeller = async (req, res, next) => {
    try {
        const deals = await Deal.find({
            seller: req.params.sellerId,
            status: 'approved',
        })
            .populate('category', 'name slug')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: deals.length,
            deals,
        });
    } catch (error) {
        next(error);
    }
};
