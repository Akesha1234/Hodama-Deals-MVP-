const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Deal = require('./models/Deal');

const connectDB = require('./config/db');

// ═══════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════

const categories = [
    {
        name: 'Salon',
        icon: 'scissors',
        description: 'Hair, beauty, and grooming deals',
        subcategories: [
            { name: 'Hair Styling' },
            { name: 'Manicure & Pedicure' },
            { name: 'Facial Treatments' },
        ],
        sortOrder: 1,
    },
    {
        name: 'Restaurant',
        icon: 'utensils',
        description: 'Dining and food offers',
        subcategories: [
            { name: 'Fine Dining' },
            { name: 'Casual Dining' },
            { name: 'Fast Food' },
            { name: 'Cafe & Coffee' },
        ],
        sortOrder: 2,
    },
    {
        name: 'Hotel',
        icon: 'hotel',
        description: 'Hotel stays and vacation packages',
        subcategories: [
            { name: 'Luxury Hotels' },
            { name: 'Budget Hotels' },
            { name: 'Resorts' },
        ],
        sortOrder: 3,
    },
    {
        name: 'Electronics',
        icon: 'smartphone',
        description: 'Gadgets, phones, and tech accessories',
        subcategories: [
            { name: 'Smartphones' },
            { name: 'Laptops' },
            { name: 'Accessories' },
            { name: 'Audio' },
        ],
        sortOrder: 4,
    },
    {
        name: 'Health & Beauty',
        icon: 'sparkles',
        description: 'Health, wellness, and beauty products',
        subcategories: [
            { name: 'Skincare' },
            { name: 'Supplements' },
            { name: 'Makeup' },
        ],
        sortOrder: 5,
    },
    {
        name: 'Groceries',
        icon: 'shopping-cart',
        description: 'Daily essentials and grocery deals',
        subcategories: [
            { name: 'Fresh Produce' },
            { name: 'Dairy' },
            { name: 'Snacks & Beverages' },
        ],
        sortOrder: 6,
    },
    {
        name: 'Spa',
        icon: 'spa',
        description: 'Spa and wellness experiences',
        subcategories: [
            { name: 'Massage Therapy' },
            { name: 'Aromatherapy' },
            { name: 'Steam & Sauna' },
        ],
        sortOrder: 7,
    },
    {
        name: 'Fashion',
        icon: 'shirt',
        description: 'Clothing, shoes, and accessories',
        subcategories: [
            { name: "Men's Wear" },
            { name: "Women's Wear" },
            { name: 'Shoes' },
            { name: 'Accessories' },
        ],
        sortOrder: 8,
    },
];

const seedDB = async () => {
    try {
        await connectDB();

        console.log('🗑  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Deal.deleteMany({})
        ]);

        // ── Seed Admin User ──
        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@hodamadeals.lk',
            password: 'admin123',
            role: 'admin',
            isVerified: true,
        });

        // ── Seed Seller User ──
        console.log('👤 Creating seller user...');
        const seller = await User.create({
            name: 'Salon Elegance',
            email: 'seller@hodamadeals.lk',
            password: 'seller123',
            role: 'seller',
            isVerified: true,
        });

        // ── Seed Customer User ──
        console.log('👤 Creating customer user...');
        const customer = await User.create({
            name: 'Kiara Fernando',
            email: 'kiara@example.com',
            password: 'customer123',
            role: 'customer',
            isVerified: true,
        });

        // ── Seed Categories ──
        console.log('📂 Seeding categories...');
        const createdCategories = [];
        for (const cat of categories) {
            const createdCat = await Category.create(cat);
            createdCategories.push(createdCat);
        }
        console.log(`✅ ${createdCategories.length} categories seeded`);

        // ── Seed Sample Deals ──
        console.log('🏷  Seeding sample deals...');
        const sampleDeals = [
            {
                title: 'Premium Hair Styling Package',
                description: 'Complete hair styling including wash, cut, blow dry, and styling at Salon Elegance.',
                shortDescription: 'Full hair makeover package',
                category: createdCategories[0]._id,
                seller: seller._id,
                storeName: 'Salon Elegance',
                originalPrice: 5000,
                dealPrice: 3500,
                dealType: 'percentage',
                images: [{ url: '/placeholder-deal.jpg', alt: 'Hair Styling' }],
                location: { city: 'Colombo', province: 'Western' },
                tags: ['salon', 'hair', 'styling', 'colombo'],
                status: 'approved',
                isFeatured: true,
            },
            {
                title: 'iPhone 15 Series - Up to 15% OFF',
                description: 'Get the latest iPhone 15 at an exclusive discounted price. Limited time offer!',
                shortDescription: 'iPhone 15 exclusive discount',
                category: createdCategories[3]._id,
                seller: seller._id,
                storeName: 'TechZone LK',
                originalPrice: 350000,
                dealPrice: 297500,
                dealType: 'percentage',
                images: [{ url: '/placeholder-deal.jpg', alt: 'iPhone 15' }],
                location: { city: 'Colombo', province: 'Western' },
                tags: ['electronics', 'iphone', 'smartphone'],
                status: 'approved',
                isFeatured: true,
                isNewArrival: true,
            },
            {
                title: 'Luxury Spa Day - Full Body Treatment',
                description: 'Enjoy a full day of pampering with our spa package. Includes massage, facial, and steam.',
                shortDescription: 'Complete spa day experience',
                category: createdCategories[6]._id,
                seller: seller._id,
                storeName: 'Zen Spa Colombo',
                originalPrice: 12000,
                dealPrice: 8500,
                dealType: 'percentage',
                images: [{ url: '/placeholder-deal.jpg', alt: 'Spa Treatment' }],
                location: { city: 'Colombo', province: 'Western' },
                tags: ['spa', 'massage', 'wellness', 'relaxation'],
                status: 'approved',
                isFeatured: true,
            },
            {
                title: 'Fine Dining Experience for Two',
                description: 'Exclusive 3-course meal for two at The Grand Pavilion. Includes appetizer, main course, and dessert.',
                shortDescription: 'Romantic dinner package',
                category: createdCategories[1]._id,
                seller: seller._id,
                storeName: 'The Grand Pavilion',
                originalPrice: 8000,
                dealPrice: 5500,
                dealType: 'percentage',
                images: [{ url: '/placeholder-deal.jpg', alt: 'Fine Dining' }],
                location: { city: 'Kandy', province: 'Central' },
                tags: ['restaurant', 'dining', 'fine-dining', 'kandy'],
                status: 'approved',
            },
            {
                title: 'Weekend Getaway - Beach Resort',
                description: '2 nights stay at a luxury beach resort in Mirissa with complimentary breakfast.',
                shortDescription: 'Beach resort weekend deal',
                category: createdCategories[2]._id,
                seller: seller._id,
                storeName: 'Paradise Beach Resort',
                originalPrice: 45000,
                dealPrice: 32000,
                dealType: 'percentage',
                images: [{ url: '/placeholder-deal.jpg', alt: 'Beach Resort' }],
                location: { city: 'Mirissa', province: 'Southern' },
                tags: ['hotel', 'resort', 'beach', 'mirissa', 'vacation'],
                status: 'approved',
                isNewArrival: true,
            },
        ];

        await Deal.create(sampleDeals);

        console.log(`
╔══════════════════════════════════════════════╗
║  ✅ Database Seeded Successfully!            ║
╠══════════════════════════════════════════════╣
║  Users      : 3 (admin, seller, customer)    ║
║  Categories : ${String(createdCategories.length).padEnd(31)}║
║  Deals      : ${String(sampleDeals.length).padEnd(31)}║
╠══════════════════════════════════════════════╣
║  Login Credentials:                          ║
║  Admin    : admin@hodamadeals.lk / admin123  ║
║  Seller   : seller@hodamadeals.lk / seller123║
║  Customer : kiara@example.com / customer123  ║
╚══════════════════════════════════════════════╝
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeder Error:', error);
        process.exit(1);
    }
};

seedDB();
