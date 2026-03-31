export const INITIAL_CATEGORIES = [
    {
        id: "electronics",
        name: "Electronics",
        icon: "Smartphone",
        subcategories: ["Smartphones", "Feature Phones", "Tablets", "Smart Watches", "Cameras", "Gaming Consoles", "Headphones & Earbuds", "Speakers", "Power Banks", "Chargers & Cables", "TV & Smart TVs", "Projectors"]
    },
    {
        id: "computers",
        name: "Computers",
        icon: "Laptop",
        subcategories: ["Laptops", "Desktop Computers", "Monitors", "Keyboards", "Mouse", "Laptop Bags", "Hard Drives (HDD)", "SSD Storage", "USB Flash Drives", "Printers & Scanners", "Networking Devices", "Graphics Cards"]
    },
    {
        id: "fashion",
        name: "Fashion",
        icon: "Shirt",
        subcategories: ["T-Shirts", "Shirts", "Jeans", "Shorts", "Jackets", "Suits", "Shoes", "Sandals", "Dresses", "Tops", "Skirts", "Sarees", "Handbags", "Jewelry", "Boys Clothing", "Girls Clothing", "Kids Shoes", "School Uniforms"]
    },
    {
        id: "homeLifestyle",
        name: "Home & Lifestyle",
        icon: "Home",
        subcategories: ["Furniture", "Kitchen Appliances", "Cookware", "Home Decor", "Lighting", "Bedding & Mattresses", "Curtains", "Carpets & Rugs", "Storage & Organization", "Garden & Outdoor"]
    },
    {
        id: "groceries",
        name: "Groceries",
        icon: "ShoppingBag",
        subcategories: ["Fruits & Vegetables", "Rice & Grains", "Flour & Baking Ingredients", "Dairy Products", "Snacks & Biscuits", "Beverages", "Frozen Foods", "Spices & Seasonings", "Cooking Oils", "Instant Foods"]
    },
    {
        id: "healthBeauty",
        name: "Health & Beauty",
        icon: "Sparkles",
        subcategories: ["Skincare", "Makeup", "Hair Care", "Perfumes & Fragrances", "Personal Care", "Men's Grooming", "Beauty Tools", "Vitamins & Supplements"]
    },
    {
        id: "sportsFitness",
        name: "Sports & Fitness",
        icon: "Dumbbell",
        subcategories: ["Exercise Equipment", "Dumbbells & Weights", "Yoga Mats", "Fitness Trackers", "Sportswear", "Football", "Cricket Gear", "Badminton Equipment", "Cycling Gear", "Camping Equipment"]
    },
    {
        id: "babyKids",
        name: "Baby & Kids",
        icon: "Baby",
        subcategories: ["Baby Clothing", "Diapers & Wipes", "Baby Feeding Bottles", "Baby Toys", "Baby Skincare", "Strollers & Walkers", "Baby Furniture", "School Supplies"]
    },
    {
        id: "automotive",
        name: "Automotive",
        icon: "Car",
        subcategories: ["Car Accessories", "Motorcycle Accessories", "Car Electronics", "Car Care Products", "Engine Oils", "Tires & Wheels", "Car Tools", "Helmets"]
    }
];

export const getStoredCategories = () => {
    try {
        const stored = localStorage.getItem('hodama_categories');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load categories from local storage", e);
    }
    return INITIAL_CATEGORIES;
};

export const saveCategories = (categories) => {
    localStorage.setItem('hodama_categories', JSON.stringify(categories));
};

export const addCustomCategory = (name, subcategories = []) => {
    const cats = getStoredCategories();
    // Generate a simple ID
    const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Check if it already exists
    const exists = cats.find(c => c.id === newId || c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        // Just update subcategories
        exists.subcategories = Array.from(new Set([...exists.subcategories, ...subcategories]));
        saveCategories(cats);
        return cats;
    }

    cats.push({
        id: newId,
        name,
        icon: "Tag", // default icon
        subcategories
    });
    saveCategories(cats);
    return cats;
};
