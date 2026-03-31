import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    ArrowRight,
    LayoutGrid,
    Scissors,
    Utensils,
    Building2,
    Shirt,
    Sparkles,
    Wind,
    ShoppingBasket,
    Monitor
} from 'lucide-react';
import CategoryCard from '../../components/common/CategoryCard';
import './Categories.css';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback hardcoded list (mapping icon component to name)
    const iconMap = {
        'Salon': Scissors,
        'Restaurant': Utensils,
        'Hotel': Building2,
        'Fashion': Shirt,
        'Health & Beauty': Sparkles,
        'Groceries': ShoppingBasket,
        'Spa': Wind,
        'Electronics': Monitor
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success && res.data.categories.length > 0) {
                    // Map API categories to match component expectation
                    const mapped = res.data.categories.map(cat => ({
                        ...cat,
                        // If no image is provided, we use the name to find one or a fallback
                        image: cat.image || `/assets/images/${cat.name.replace(/ /g, '')}Cat.png`,
                        // Handle icon: if it's a component name, map it, otherwise it's just the URL
                        icon: iconMap[cat.name] || cat.icon
                    }));
                    setCategories(mapped);
                } else {
                    // Use Hardcoded if API is empty
                    useHardcoded();
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                useHardcoded();
            } finally {
                setLoading(false);
            }
        };

        const useHardcoded = () => {
            const list = [
                { id: 'salon', name: 'Salon', icon: "/assets/images/Salon.png", color: '#be123c', image: "/assets/images/SalonCat.png" },
                { id: 'restaurant', name: 'Restaurant', icon: "/assets/images/Restaurant.png", color: '#c2410c', image: "/assets/images/RestaurantCat.png" },
                { id: 'hotel', name: 'Hotel', icon: "/assets/images/Hotel.png", color: '#6d28d9', image: "/assets/images/HotelCat.png" },
                { id: 'fashion', name: 'Fashion', icon: "/assets/images/Fashion.png", color: '#047857', image: "/assets/images/FashionCat.jpg" },
                { id: 'electronics', name: 'Electronics', icon: "/assets/images/electronics.png", color: '#76a81e', image: "/assets/images/ElectronicsCat.png" },
                { id: 'beauty', name: 'Health & Beauty', icon: "/assets/images/Health&Beauty.png", color: '#be185d', image: "/assets/images/Health&BeautyCat.png" },
                { id: 'groceries', name: 'Groceries', icon: "/assets/images/Groceries.png", color: '#b45309', image: "/assets/images/GroceriesCat.png" },
                { id: 'spa', name: 'Spa', icon: "/assets/images/Spa.png", color: '#1d4ed8', image: "/assets/images/spaCat.png" },
            ];
            setCategories(list);
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName) => {
        navigate(`/category/${categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`);
    };

    return (
        <div className="cat-page-full-wrap">
            <div className="cat-container-max">
                {/* ── STANDARDIZED PREMIUM HEADER ── */}
                <div className="premium-header-container">
                    <button onClick={() => navigate(-1)} className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </button>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title">
                                <LayoutGrid size={28} strokeWidth={2.5} style={{ marginRight: '10px' }} />
                                Browse Categories
                            </h1>
                            <span className="p-header-badge">
                                {categories.length} CATEGORIES
                            </span>
                        </div>
                        <p className="p-header-subtitle">Find the best deals by category</p>
                    </div>
                </div>

                {/* Grid Grid */}
                <div className="cat-main-grid-layout">
                    {loading ? (
                        <div className="mcat-loading">Organizing categories...</div>
                    ) : (
                        categories.map((cat) => (
                            <CategoryCard
                                key={cat._id || cat.id}
                                category={cat}
                                onClick={() => handleCategoryClick(cat.name)}
                            />
                        ))
                    )}
                </div>

                {/* Explore Area */}
                <div className="cat-bottom-explore-card">
                    <div className="cat-explore-content">
                        <h2>Explore All Deals</h2>
                        <p>Discover amazing offers across all categories!</p>
                    </div>
                    <button className="cat-yellow-final-btn" onClick={() => navigate('/deals-listing')}>
                        Explore All Deal <ArrowRight size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Categories;
