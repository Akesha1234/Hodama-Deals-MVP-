const Category = require('../models/Category');

// ═══════════════════════════════════════════
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
// ═══════════════════════════════════════════
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('dealCount')
            .sort('sortOrder');

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
// ═══════════════════════════════════════════
exports.getCategory = async (req, res, next) => {
    try {
        let category;

        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(req.params.id).populate('dealCount');
        } else {
            category = await Category.findOne({ slug: req.params.id }).populate('dealCount');
        }

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Create a category
// @route   POST /api/categories
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
