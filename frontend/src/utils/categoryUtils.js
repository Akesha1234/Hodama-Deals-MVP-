export const INITIAL_CATEGORIES = [
    { id: "salon", name: "Salon", icon: "Scissors", subcategories: [] },
    { id: "restaurant", name: "Restaurant", icon: "Utensils", subcategories: [] },
    { id: "electronics", name: "Electronics", icon: "Smartphone", subcategories: [] },
    { id: "hotel", name: "Hotel", icon: "Building2", subcategories: [] },
    { id: "groceries", name: "Groceries", icon: "ShoppingBasket", subcategories: [] },
    { id: "health-beauty", name: "Health & Beauty", icon: "Sparkles", subcategories: [] },
    { id: "spa", name: "Spa", icon: "Wind", subcategories: [] },
    { id: "fashion", name: "Fashion", icon: "Shirt", subcategories: [] }
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
