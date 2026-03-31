const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Deal title is required'],
            trim: true,
            maxlength: [120, 'Title cannot exceed 120 characters'],
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        shortDescription: {
            type: String,
            maxlength: [200, 'Short description cannot exceed 200 characters'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        subcategory: {
            type: String,
            trim: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller is required'],
        },
        storeName: {
            type: String,
            trim: true,
        },

        // ── Pricing ──
        originalPrice: {
            type: Number,
            required: [true, 'Original price is required'],
            min: [0, 'Price cannot be negative'],
        },
        dealPrice: {
            type: Number,
            required: [true, 'Deal price is required'],
            min: [0, 'Price cannot be negative'],
        },
        discountPercentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        currency: {
            type: String,
            default: 'LKR',
        },

        // ── Media ──
        images: [
            {
                url: String,
                alt: String,
            },
        ],
        thumbnail: {
            type: String,
            default: '',
        },

        // ── Deal Details ──
        dealType: {
            type: String,
            enum: ['percentage', 'fixed', 'bogo', 'freebie'],
            default: 'percentage',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isNewArrival: {
            type: Boolean,
            default: true,
        },

        // ── Location ──
        location: {
            address: String,
            city: String,
            province: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },

        // ── Stats ──
        views: {
            type: Number,
            default: 0,
        },
        totalSold: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },

        // ── Stock ──
        stock: {
            type: Number,
            default: -1, // -1 means unlimited
        },

        // ── Tags ──
        tags: [String],

        // ── Terms ──
        termsAndConditions: {
            type: String,
            default: '',
        },

        // ── Status ──
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'expired'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ── Auto-generate slug from title ──
DealSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            + '-' + Date.now().toString(36);
    }

    // Auto-calculate discount percentage
    if (this.isModified('originalPrice') || this.isModified('dealPrice')) {
        if (this.originalPrice > 0) {
            this.discountPercentage = Math.round(
                ((this.originalPrice - this.dealPrice) / this.originalPrice) * 100
            );
        }
    }
});

// ── Virtual: isExpired ──
DealSchema.virtual('isExpired').get(function () {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
});

// ── Indexes for performance ──
DealSchema.index({ category: 1, status: 1 });
DealSchema.index({ seller: 1 });
DealSchema.index({ createdAt: -1 });
DealSchema.index({ dealPrice: 1 });
DealSchema.index({ tags: 1 });

module.exports = mongoose.model('Deal', DealSchema);
