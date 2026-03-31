import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, 
    ArrowLeft, 
    ArrowLeftCircle,
    Star, 
    ChevronDown, 
    X, 
    MapPin,
    LayoutGrid,
    List,
    Heart,
    Sparkles,
    Search,
    Filter,
    Clock,
    Tag,
    Bed,
    ShoppingCart,
    Smartphone,
    Stethoscope,
    Scissors,
    Utensils,
    Building2,
    Shirt,
    Wind,
    ShoppingBasket,
    Monitor
} from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import DesignCard from '../../components/common/DesignCard';
import './CategoryView.css';

const CategoryView = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('Best Match');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter States
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedOffers, setSelectedOffers] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

    const [openFilters, setOpenFilters] = useState({ brands: true, offers: true, locations: true, ratings: true, price: true });
    const toggleAccordion = (key) => setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

    useEffect(() => {
        const allOpen = Object.values(openFilters).every(v => v);
        const allClosed = Object.values(openFilters).every(v => !v);
        if (allOpen) setViewMode('grid');
        else if (allClosed) setViewMode('list');
        else setViewMode('custom');
    }, [openFilters]);

    const sortOptions = ['Best Match', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'];

    const toggleFilter = (setter, val) => {
        setter(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    };

    const clearAll = () => {
        setSelectedBrands([]);
        setSelectedOffers([]);
        setSelectedLocations([]);
        setSelectedRating(null);
        setPriceRange({ min: 0, max: 100000 });
        setSortBy('Best Match');
    };

    // DYNAMIC DATA MAPPING BY CATEGORY
    const categoryData = {
        restaurant: {
            title: "Restaurant",
            deals: [
                { id: 401, name: "Buy 1 Burger & Get 1 Burger Free", price: "950", oldPrice: "1,500", img: "/assets/images/BurgerKing1.png", badge: "25% OFF", storeName: "BURGER KING", storeImg: "/assets/images/BurgerKingLogo.png", rating: "5.0", ratingCount: "18", location: "BURGER KING, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant", catColor: "#de7726", catInfo: "Dine-in / Takeaway" },
                { id: 402, name: "Our 4 for Rs.999 Pizza Mania offer", price: "999", oldPrice: "", img: "/assets/images/dominos1.png", badge: "Hot Deal", storeName: "Domino's Pizza", storeImg: "/assets/images/dominosLogo.png", rating: "4.4", ratingCount: "20", location: "Domino's Pizza", dealType: "OFFER", category: "Restaurant", catColor: "#de7726", catInfo: "Pizza / Delivery" },
                { id: 407, name: "FLASH SALE ALERT !", price: "50% OFF", oldPrice: "", img: "/assets/images/pizzahut1.png", badge: "50% OFF", storeName: "Pizza Hut", storeImg: "/assets/images/PizzahutLogo.png", rating: "4.9", ratingCount: "45", location: "Pizza Hut, Sri Lanka", dealType: "OFFER", category: "Restaurant", catColor: "#de7726", catInfo: "Cuisine: Italian" },
                { id: 403, name: "10 pc Hot & Crispy Chicken", price: "3,900", oldPrice: "4,950", img: "/assets/images/KFC1.png", badge: "20% OFF", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.8", ratingCount: "100", location: "KFC, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant", catColor: "#de7726", catInfo: "Fast Food" },
                { id: 404, name: "NEW YEAR CHICKEN COMBO", price: "3,990", oldPrice: "", img: "/assets/images/KFC2.png", badge: "New", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.1", ratingCount: "5", location: "KFC, Sri Lanka", dealType: "OFFER", category: "Restaurant", catColor: "#de7726", catInfo: "Family Pack" },
                { id: 408, name: "Barista COFFEE RUSH is back!", price: "50% OFF", oldPrice: "", img: "/assets/images/barista1.png", badge: "Hot Item", storeName: "Barista", storeImg: "/assets/images/baristaLogo.png", rating: "4.6", ratingCount: "43", location: "Barista, Sri Lanka", dealType: "OFFER", category: "Restaurant", catColor: "#de7726", catInfo: "Coffee & Snacks" },
            ],
            brands: ["Burger King", "KFC", "Domino's Pizza", "Pizza Hut", "Barista", "Java Lounge", "Café 64", "Perera & Sons"],
            sidebarTitle: "Restaurants & Cafes"
        },
        fashion: {
            title: "Fashion",
            deals: [
                { id: 501, name: "Seasonal Summer Collection - 40% OFF", price: "1,850", oldPrice: "2,950", img: "/assets/images/CP-Fashion1.png", badge: "40% OFF", storeName: "COOL PLANET", storeImg: "/assets/images/coolPlanetLogo.png", rating: "4.7", ratingCount: "112", location: "Cool Planet, SL", dealType: "SEASONAL", category: "Fashion", catColor: "#8b5cf6", catInfo: "Summer Wear" },
                { id: 502, name: "Luxury Silk Sarees - Wedding Special", price: "45,000", oldPrice: "60,000", img: "/assets/images/Fashion-Saree1.png", badge: "Premium", storeName: "Fashion Bug", storeImg: "/assets/images/fashionBugLogo.png", rating: "4.9", ratingCount: "56", location: "Fashion Bug, Colombo", dealType: "OFFER", category: "Fashion", catColor: "#8b5cf6", catInfo: "Ethnic Wear" },
                { id: 503, name: "Men's Casual Wear - Buy 2 Get 1 Free", price: "2,400", oldPrice: "", img: "/assets/images/Fashion-Men1.png", badge: "B2G1", storeName: "NOLIMIT", storeImg: "/assets/images/nolimitLogo.png", rating: "4.5", ratingCount: "230", location: "Nolimit Islandwide", dealType: "PROMO", category: "Fashion", catColor: "#8b5cf6", catInfo: "Casual Wear" },
            ],
            brands: ["Cool Planet", "House of Fashions", "Nolimit", "Fashion Bug", "Cotton Collection", "Odel", "Kandy"],
            sidebarTitle: "Clothing & Apparel"
        },
        salon: {
            title: "Salon",
            deals: [
                { id: 601, name: "Keratin Treatment Special Offer", price: "12,000", oldPrice: "18,000", img: "/assets/images/salon-keratin1.png", badge: "Best Value", storeName: "Salon LIYO", storeImg: "/assets/images/liyoLogo.png", rating: "4.9", ratingCount: "88", location: "Liyo, Kohuwala", dealType: "SERVICE", category: "Salon", catColor: "#dc2626" },
                { id: 602, name: "Full Bridal Package - Pre-Booking Open", price: "85,000", oldPrice: "110,000", img: "/assets/images/salon-bridal1.png", badge: "Wedding", storeName: "Chandani Bandara", storeImg: "/assets/images/CBLogo.png", rating: "4.8", ratingCount: "120", location: "Nugegoda Branch", dealType: "PRE-BOOK", category: "Salon", catColor: "#dc2626" },
            ],
            brands: ["Salon Liyo", "Chandani Bandara", "Crown Salon", "Cutting Station", "Ramani Fernando"],
            sidebarTitle: "Beauty & Grooming"
        },
        hotel: {
            title: "Hotel",
            deals: [
                { id: 701, name: "Luxury Weekend Getaway - 35% OFF", price: "45,000", oldPrice: "70,000", img: "/assets/images/hotel-getaway1.png", badge: "Getaway", storeName: "Cinnamon Hotels", storeImg: "/assets/images/cinnamonLogo.png", rating: "5.0", ratingCount: "240", location: "Cinnamon Bentota Beach", dealType: "VACATION", category: "Hotel", catColor: "#0ea5e9", catInfo: "Full Board" },
                { id: 702, name: "All-Inclusive Family Day Outing", price: "6,500", oldPrice: "9,000", img: "/assets/images/hotel-outing1.png", badge: "Day Out", storeName: "Jetwing Hotels", storeImg: "/assets/images/jetwingLogo.png", rating: "4.8", ratingCount: "95", location: "Jetwing Blue, Negombo", dealType: "COMBO", category: "Hotel", catColor: "#0ea5e9", catInfo: "Day Outing" },
                { id: 204, name: "Honors Discount Advance Purchase Pack", price: "30,000", oldPrice: "45,000", img: "/assets/images/honersPack.png", badge: "17% OFF", storeName: "Hilton", storeImg: "/assets/images/HiltonLogo.png", rating: "4.4", ratingCount: "35", location: "Colombo", dealType: "DISCOUNT", category: "Hotel", catColor: "#0ea5e9", catInfo: "Accommodation" },
            ],
            brands: ["Cinnamon", "Jetwing", "Heritance", "Hilton", "Shangri-La", "The Kingsbury"],
            sidebarTitle: "Hotels & Stays"
        },
        spa: {
            title: "Spa",
            deals: [
                { id: 801, name: "Fruit Paradise Wellness & Beauty Collection", price: "15,900", oldPrice: "27,000", img: "/assets/images/spaceylonOffer.png", badge: "50% Off", storeName: "Spa Ceylon", storeImg: "/assets/images/spaceylonLogo.png", rating: "5.0", ratingCount: "18", location: "Spa Ceylon, Sri Lanka", dealType: "SALE", category: "Spa", catColor: "#d63384", catInfo: "Treatment: Relaxing" },
                { id: 802, name: "Full Body Massage & Aromatherapy", price: "8,500", oldPrice: "12,000", img: "/assets/images/home_salon1.png", badge: "Hot Deal", storeName: "Spa Ceylon", storeImg: "/assets/images/spaceylonLogo.png", rating: "4.9", ratingCount: "42", location: "Colombo 07", dealType: "SERVICE", category: "Spa", catColor: "#d63384", catInfo: "Duration: 90 Mins" },
                { id: 803, name: "Luxury Facial & Skin Treatment", price: "5,500", oldPrice: "7,500", img: "/assets/images/home_skin1.png", badge: "25% OFF", storeName: "Janet", storeImg: "/assets/images/JanetLogo.png", rating: "4.7", ratingCount: "15", location: "Nugegoda", dealType: "OFFER", category: "Spa", catColor: "#d63384", catInfo: "Duration: 60 Mins" },
            ],
            brands: ["Spa Ceylon", "Janet", "Luv Esence", "Sanctuary", "White Lotus"],
            sidebarTitle: "Wellness & Spa"
        },
        groceries: {
            title: "Groceries",
            deals: [
                { id: 901, name: "Enjoy 10% off on Jagro fresh & frozen strawberries", price: "12,500", oldPrice: "16,000", img: "/assets/images/home_foodcity1.png", badge: "10% OFF", storeName: "Keells", storeImg: "/assets/images/KEELLSLogo.png", rating: "4.9", ratingCount: "67", location: "Keells, Sri Lanka", dealType: "SALE", category: "Groceries", catColor: "#10b981", catInfo: "Fresh Produce" },
                { id: 902, name: "Seasonal Fruits & Veggies Combo Pack", price: "3,500", oldPrice: "4,500", img: "/assets/images/GroceriesCat.png", badge: "Best Client", storeName: "Arpico", storeImg: "/assets/images/ARPICOSUPERCENTRELOGO.png", rating: "4.8", ratingCount: "150", location: "Arpico Supercentre", dealType: "COMBO", category: "Groceries", catColor: "#10b981", catInfo: "Pantry Staples" },
            ],
            brands: ["Keells", "Arpico", "Cargills Food City", "Sathosa", "Spar"],
            sidebarTitle: "Supermarkets & Grocery"
        },
        electronics: {
            title: "Electronics",
            deals: [
                { id: 1001, name: "Smart Watch Series 9 - 45mm", price: "85,000", oldPrice: "110,000", img: "/assets/images/electronic_banner.png", badge: "Hot Item", storeName: "Singer", storeImg: "https://seeklogo.com/images/S/singer-logo-3069F9B1E4-seeklogo.com.png", rating: "4.5", ratingCount: "42", location: "Colombo", dealType: "OFFER", category: "Electronics", catColor: "#76a81eff", catInfo: "Smart Gadgets" },
                { id: 1002, name: "Samsung Crystal UHD 43\" Smart TV", price: "285,000", oldPrice: "310,000", img: "https://images.unsplash.com/photo-1593359677770-4669582a8bfb?q=80&w=400", badge: "Premium", storeName: "Singer", storeImg: "https://seeklogo.com/images/S/singer-logo-3069F9B1E4-seeklogo.com.png", rating: "4.8", ratingCount: "25", location: "Islandwide", dealType: "SALE", category: "Electronics", catColor: "#76a81eff", catInfo: "Home Entertainment" },
            ],
            brands: ["Singer", "Abans", "Damro", "Softlogic", "Dialog", "Mobitel"],
            sidebarTitle: "Gadgets & Appliances"
        },
        "health-beauty": {
            title: "Health & Beauty",
            deals: [
                { id: 1101, name: "LUV Perfume Duo", price: "6,000", oldPrice: "7,000", img: "/assets/images/luv_perfume_duo.png", badge: "10% OFF", storeName: "Luv Esence", storeImg: "/assets/images/luvLogo.png", rating: "4.6", ratingCount: "15", location: "Luv Esence", dealType: "SALE", category: "Health & Beauty", catColor: "#d63384" },
                { id: 1102, name: "Dark Circle Remover Duo Offer", price: "1,400", oldPrice: "1,590", img: "/assets/images/janet1.png", badge: "5% Off", storeName: "Janet", storeImg: "/assets/images/JanetLogo.png", rating: "4.6", ratingCount: "23", location: "Janet, Sri Lanka", dealType: "SALE", category: "Health & Beauty", catColor: "#d63384" },
            ],
            brands: ["Spa Ceylon", "Janet", "Luv Esence", "Standard Homeopathy", "Healthguard"],
            sidebarTitle: "Organic & Beauty Care"
        }
    };

    // Mapping for Premium Header Icons & Subtitles
    const getCatHeaderInfo = (key) => {
        const mapping = {
            restaurant: { icon: Utensils, badge: 'DINE & TASTE', subtitle: 'Discover the best cuisines around you' },
            fashion: { icon: Shirt, badge: 'TRENDS & STYLE', subtitle: 'Step up your style with latest fashion deals' },
            salon: { icon: Scissors, badge: 'BEAUTY & HAIR', subtitle: 'Expert grooming and hair care offers' },
            hotel: { icon: Building2, badge: 'LUXURY STAYS', subtitle: 'Unwind at the finest hotels and resorts' },
            spa: { icon: Wind, badge: 'RELAX & REVIVE', subtitle: 'Premier wellness and spa treatments' },
            groceries: { icon: ShoppingBasket, badge: 'DAILY DEALS', subtitle: 'Fresh groceries and household essentials' },
            electronics: { icon: Monitor, badge: 'GADGETS & TECH', subtitle: 'Modern electronics at unbeatable prices' },
            'health-beauty': { icon: Sparkles, badge: 'WELLNESS & BEAUTY', subtitle: 'Everything you need to look and feel your best' }
        };
        return mapping[key.toLowerCase()] || { icon: Tag, badge: 'SPECIAL OFFERS', subtitle: 'Amazing deals waiting for you' };
    };

    const currentCatKey = Object.keys(categoryData).find(k => k.toLowerCase() === (slug || "").toLowerCase()) || 'restaurant';
    const currentCat = categoryData[currentCatKey];
    const currentDeals = currentCat.deals;
    const headerInfo = getCatHeaderInfo(currentCatKey);
    const CatIcon = headerInfo.icon;

    const filteredDeals = currentDeals.filter(p => {
        // Brands Filter
        if (selectedBrands.length > 0) {
            const hasBrand = selectedBrands.some(b => p.storeName.toLowerCase().includes(b.toLowerCase()) || p.name.toLowerCase().includes(b.toLowerCase()));
            if (!hasBrand) return false;
        }

        // Offers Filter
        if (selectedOffers.length > 0) {
            const hasOfferMatch = selectedOffers.some(o => {
                const dealLower = p.dealType ? p.dealType.toLowerCase() : "";
                const nameLower = p.name ? p.name.toLowerCase() : "";
                const badgeLower = p.badge ? p.badge.toLowerCase() : "";
                
                if (o === "Combo Meals") return dealLower.includes("combo") || nameLower.includes("combo") || dealLower.includes("pack");
                if (o === "Seasonal / Festival Offers") return dealLower.includes("season") || nameLower.includes("season") || dealLower.includes("fest");
                if (o === "Buy 1 Get 1 Free") return nameLower.includes("buy 1") || badgeLower.includes("b1g1") || badgeLower.includes("b2g1") || nameLower.includes("get 1") || nameLower.includes("buy 2");
                if (o === "Bank Card Discounts") return dealLower.includes("discount") || nameLower.includes("card") || badgeLower.includes("off");
                if (o === "Loyalty / Rewards Programs") return dealLower.includes("reward") || dealLower.includes("loyalty");
                if (o === "Limited-Time Promotions") return dealLower.includes("limited") || dealLower.includes("promo") || dealLower.includes("offer") || dealLower.includes("sale");
                return false;
            });
            if (!hasOfferMatch) return false;
        }

        // Locations Filter
        if (selectedLocations.length > 0) {
            const dealLocLower = p.location ? p.location.toLowerCase() : "";
            const isBroadLocation = dealLocLower.includes("islandwide") || dealLocLower.includes("sri lanka");
            const hasLocMatch = selectedLocations.some(l => dealLocLower.includes(l.toLowerCase()));
            if (!hasLocMatch && !isBroadLocation) return false;
        }

        // Rating Filter
        if (selectedRating !== null) {
            if (parseFloat(p.rating) < selectedRating) return false;
        }

        // Price Filter
        if (!p.price.includes('%') && !p.price.includes('Total') && p.price !== '') {
            const numPrice = parseFloat(p.price.replace(/,/g, ''));
            if (!isNaN(numPrice)) {
                if (numPrice < priceRange.min || numPrice > priceRange.max) return false;
            }
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === 'Price: Low to High') {
            const pa = parseFloat(a.price.replace(/,/g, '')) || 0;
            const pb = parseFloat(b.price.replace(/,/g, '')) || 0;
            return pa - pb;
        } else if (sortBy === 'Price: High to Low') {
            const pa = parseFloat(a.price.replace(/,/g, '')) || 0;
            const pb = parseFloat(b.price.replace(/,/g, '')) || 0;
            return pb - pa;
        } else if (sortBy === 'Highest Rated') {
            return parseFloat(b.rating) - parseFloat(a.rating);
        }
        return 0; // Best Match
    });

    // Deals have already been mapped and given fallback colors/icons inside DesignCard.

    return (
        <div className="cv-page-full">
            <div className="cv-container">
                <button onClick={() => navigate(-1)} className="back-btn-square" style={{ marginBottom: '25px' }}>
                    <div className="back-btn-circle-inner"><ArrowLeft size={16} strokeWidth={3} /></div>
                </button>

                {/* ── PREMIUM WHITE HEADER CONTAINER (Matching Support Page Style) ── */}
                <div className="cv-premium-header-card">
                    <div className="cv-header-main-info">
                        <div className="premium-header-content">
                            <div className="premium-header-title-row">
                                <h1 className="p-header-title">
                                    <CatIcon size={28} strokeWidth={2.5} style={{ marginRight: '10px' }} />
                                    {currentCat.title}
                                </h1>
                                <span className="p-header-badge">{currentDeals.length} Deals</span>
                            </div>
                            <p className="p-header-subtitle">{headerInfo.subtitle}</p>
                        </div>
                    </div>

                    <div className="cv-header-controls">
                        <div className="cv-mode-switch">
                            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setOpenFilters({ brands: true, offers: true, locations: true, ratings: true, price: true })}>
                                <LayoutGrid size={24} strokeWidth={2.5} />
                            </button>
                            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setOpenFilters({ brands: false, offers: false, locations: false, ratings: false, price: false })}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="5" cy="6" r="1.5" fill="currentColor" />
                                    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                                    <circle cx="5" cy="18" r="1.5" fill="currentColor" />
                                    <path d="M11 6h9M11 12h9M11 18h9" />
                                </svg>
                            </button>
                        </div>

                        <div className="cv-sort-container">
                            <div className="cv-sort-label">Sort by:</div>
                            <div className="cv-sort-trigger" onClick={() => setIsSortOpen(!isSortOpen)}>
                                {sortBy} <ChevronDown size={14} strokeWidth={3} />
                            </div>
                            {isSortOpen && (
                                <div className="cv-sort-dropdown">
                                    {sortOptions.map(opt => (
                                        <div 
                                            key={opt} 
                                            onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                                            className={`cv-sort-option ${sortBy === opt ? 'active' : ''}`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="cv-layout">
                    {/* ── 2. SIDEBAR ── */}
                    <aside className="cv-sidebar">
                        <div className="cv-filter-group">
                            <div className="cv-filter-head" onClick={() => toggleAccordion('brands')}>
                                <h3>{currentCat.sidebarTitle}</h3>
                                <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.brands ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                            </div>
                            {openFilters.brands && (
                                <div className="cv-filter-list">
                                    {currentCat.brands.map(itm => (
                                        <label key={itm} className={`cv-check-item ${selectedBrands.includes(itm) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleFilter(setSelectedBrands, itm); }}>
                                            <div className={`cv-sq-check ${selectedBrands.includes(itm) ? 'filled' : ''}`}>
                                                {selectedBrands.includes(itm) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <span>{itm}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="cv-filter-group">
                            <div className="cv-filter-head" onClick={() => toggleAccordion('offers')}>
                                <h3>Offers/ Deals</h3>
                                <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.offers ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                            </div>
                            {openFilters.offers && (
                                <div className="cv-filter-list">
                                    {["Combo Meals", "Seasonal / Festival Offers", "Buy 1 Get 1 Free", "Bank Card Discounts", "Loyalty / Rewards Programs", "Limited-Time Promotions"].map(itm => (
                                        <label key={itm} className={`cv-check-item ${selectedOffers.includes(itm) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleFilter(setSelectedOffers, itm); }}>
                                            <div className={`cv-sq-check ${selectedOffers.includes(itm) ? 'filled' : ''}`}>
                                                {selectedOffers.includes(itm) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <span>{itm}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="cv-filter-group">
                            <div className="cv-filter-head" onClick={() => toggleAccordion('locations')}>
                                <h3>Locations</h3>
                                <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.locations ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                            </div>
                            {openFilters.locations && (
                                <div className="cv-filter-list">
                                    <label className={`cv-check-item ${selectedLocations.length === 0 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedLocations([]); }}>
                                        <div className={`cv-sq-check ${selectedLocations.length === 0 ? 'filled' : ''}`}>
                                            {selectedLocations.length === 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </div>
                                        <span>Islandwide / All</span>
                                    </label>
                                    {["Colombo", "Kandy", "Galle", "Matara", "Matale", "Negombo"].map(itm => (
                                        <label key={itm} className={`cv-check-item ${selectedLocations.includes(itm) ? 'active' : ''}`} onClick={(e) => { 
                                                e.preventDefault(); 
                                                toggleFilter(setSelectedLocations, itm); 
                                            }}>
                                            <div className={`cv-sq-check ${selectedLocations.includes(itm) ? 'filled' : ''}`}>
                                                {selectedLocations.includes(itm) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <span>{itm}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="cv-filter-group">
                            <div className="cv-filter-head" onClick={() => toggleAccordion('ratings')}>
                                <h3>Ratings</h3>
                                <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.ratings ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                            </div>
                            {openFilters.ratings && (
                                <div className="cv-filter-list">
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <label key={r} className={`cv-check-item ${selectedRating === r ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedRating(selectedRating === r ? null : r); }}>
                                            <div className={`cv-sq-check ${selectedRating === r ? 'filled' : ''}`}>
                                                {selectedRating === r && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <div className="cv-stars">
                                                {Array(5).fill(0).map((_, i) => (
                                                    <Star key={i} size={14} fill={i < r ? "#facc15" : "none"} color={i < r ? "#facc15" : "#cbd5e1"} />
                                                ))}
                                                {r < 5 && <span className="cv-up-lab">{r}.0 & Up</span>}
                                                {r === 5 && <span className="cv-up-lab">5.0</span>}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="cv-filter-group no-border">
                            <div className="cv-filter-head" onClick={() => toggleAccordion('price')}>
                                <h3>Price</h3>
                                <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.price ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                            </div>
                            {openFilters.price && (
                                <div className="cv-price-slider">
                                    <div className="cv-price-inputs">
                                        <div className="cv-p-box" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            LKR <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={{ width: '60px', border: 'none', background: 'transparent', outline: 'none', color: '#323c82', fontWeight: 800, fontSize: '14px' }}/>
                                        </div>
                                        <div className="cv-p-box" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            LKR <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={{ width: '60px', border: 'none', background: 'transparent', outline: 'none', color: '#323c82', fontWeight: 800, fontSize: '14px' }}/>
                                        </div>
                                    </div>
                                    <div className="cv-slider-track">
                                        <div className="cv-track-fill" style={{ left: `${Math.min(100, Math.max(0, (priceRange.min / 100000) * 100))}%`, right: `${Math.min(100, Math.max(0, 100 - (priceRange.max / 100000) * 100))}%` }}></div>
                                        <input type="range" className="cv-range-input" min="0" max="100000" step="500" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Math.min(Number(e.target.value), priceRange.max - 1000)})} />
                                        <input type="range" className="cv-range-input" min="0" max="100000" step="500" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Math.max(Number(e.target.value), priceRange.min + 1000)})} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* ── 3. MAIN CONTENT ── */}
                    <main className="cv-content">
                        <div className="cv-active-bar" style={{ flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                                {selectedBrands.map(val => (
                                    <div key={`brand-${val}`} className="cv-active-tag">
                                        <span>{val}</span>
                                        <X size={14} onClick={() => toggleFilter(setSelectedBrands, val)} style={{ cursor: 'pointer' }}/>
                                    </div>
                                ))}
                                {selectedOffers.map(val => (
                                    <div key={`offer-${val}`} className="cv-active-tag">
                                        <span>{val}</span>
                                        <X size={14} onClick={() => toggleFilter(setSelectedOffers, val)} style={{ cursor: 'pointer' }}/>
                                    </div>
                                ))}
                                {selectedLocations.map(val => (
                                    <div key={`loc-${val}`} className="cv-active-tag">
                                        <span>{val}</span>
                                        <X size={14} onClick={() => toggleFilter(setSelectedLocations, val)} style={{ cursor: 'pointer' }}/>
                                    </div>
                                ))}
                                {selectedRating && (
                                    <div key={`rating-${selectedRating}`} className="cv-active-tag">
                                        <span>{selectedRating}.0 & Up</span>
                                        <X size={14} onClick={() => setSelectedRating(null)} style={{ cursor: 'pointer' }}/>
                                    </div>
                                )}
                                {selectedBrands.length === 0 && selectedOffers.length === 0 && selectedLocations.length === 0 && !selectedRating && (
                                    <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', alignSelf: 'center' }}>Showing all {filteredDeals.length} deals</span>
                                )}
                            </div>
                            
                            {(selectedBrands.length > 0 || selectedOffers.length > 0 || selectedLocations.length > 0 || selectedRating) && (
                                <button className="cv-clear-btn" onClick={clearAll}>
                                    <span>Clear All</span>
                                    <div className="cv-x-bg"><X size={12} /></div>
                                </button>
                            )}
                        </div>

                        <div className="cv-grid">
                            {filteredDeals.length > 0 ? filteredDeals.map(p => <DesignCard key={p.id} deal={p} />) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                                    <Search size={40} style={{ margin: '0 auto 15px', color: '#cbd5e1' }} />
                                    <h3 style={{ fontSize: '20px', color: '#323c82', marginBottom: '10px' }}>No exact matches found</h3>
                                    <p>Try clearing some filters to expand your search.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryView;
