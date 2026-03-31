import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    Heart, Share2, CheckCircle,
    Clock, ExternalLink, Tag, Star,
    MapPin, ChevronRight, Calendar,
    AlertCircle, Flame, Copy, Phone,
    Globe, ArrowRight, ShoppingBag, Eye
} from 'lucide-react';
import './DealsDetail.css';

const DealsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeImg, setActiveImg] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    // ── MOCK DEAL DATA (matches client add deal fields) ──
    const deal = {
        id: id || 1,
        badge: "AIRIBU SALE",
        name: "Fruit Paradise Wellness & Beauty Collection",
        businessName: "Spa Ceylon",
        businessLogo: "https://images.unsplash.com/photo-1614032686099-b785e4d52b0b?w=100",
        category: "Health & Beauty",
        dealType: "Limited Time Offer",
        currentPrice: 15900,
        originalPrice: 27000,
        discount: 41,
        rating: 5.0,
        reviewCount: 13,
        location: "Spa Ceylon, Sri Lanka",
        availability: "In Stock",
        stockLeft: 4,
        totalStock: 15,
        sellingFast: true,
        websiteUrl: "https://spaceylon.com",
        couponCode: "HODAMA20",
        expiryDate: "21st April 2026",
        terms: "Made with natural fruit-based ingredients, these products are for external use only. Perform a patch test before use, avoid contact with eyes, and discontinue if irritation occurs. Results may vary depending on skin type.",
        availability2: "Daily 9.00 AM to 10.00 PM",
        description: "Celebrate the joyful Celorieve Summer with these 15 wellness & beauty treats designed to pamper you from head to toe. Each carefully crafted formula is infused with powerful ayurvedic micronutrients, floral extracts & pure aromatic essential oils to naturally soothe, calm & revive your body, mind & soul.\n\nFull list includes:\n- White Rose – Age Control Facial Cleansing Milk - 25g\n- White Rose – Replenishing Facial Refresher - 75g\n- Lavender – Soothing Body Lotion - 65ml\n- Rasavinda – Nourishing Body Cleanser - 100ml\n- Virgin Coconut – 75% Rich Body Cream - 30g\n- Aromi Rose – Vanilla Oil - 5ml",
        highlights: [
            "100% Natural ingredients – No harsh chemicals",
            "Made with traditional Ayurvedic recipes",
            "Award-winning Sri Lankan luxury brand",
            "60-day money back guarantee",
            "Suitable for all skin types"
        ],
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
        ],
        client: {
            name: "SPA CEYLON",
            logo: "https://images.unsplash.com/photo-1614032686099-b785e4d52b0b?w=150",
            rating: 5.0,
            totalDeals: 32,
            verified: true,
            websiteUrl: "https://spaceylon.com",
            phone: "+94 11 234 5678"
        }
    };

    // Other deals from this client
    const otherDeals = [
        { id: 11, title: "Hair Care", badge: "35%", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300", business: "Spa Ceylon", price: "LKR 2,400", oldPrice: "LKR 3,600", rating: 4.8, location: "Spa Ceylon, Sri Lanka", bg: "bg-green" },
        { id: 12, title: "Facial Masoure", badge: "42%", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", business: "Spa Ceylon", price: "LKR 1,900", oldPrice: "LKR 3,200", rating: 4.2, location: "Spa Ceylon, Sri Lanka", bg: "bg-red" },
        { id: 13, title: "Musc One", badge: "35%", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=300", business: "Spa Ceylon", price: "LKR 6,500", oldPrice: "LKR 10,000", rating: 4.6, location: "Spa Ceylon, Sri Lanka", bg: "bg-blue" },
        { id: 14, title: "Fragrances", badge: "40%", image: "https://images.unsplash.com/photo-1583467875263-d50dee373707?w=300", business: "Spa Ceylon", price: "LKR 5,500", oldPrice: "LKR 9,166", rating: 4.7, location: "Spa Ceylon, Sri Lanka", bg: "bg-yellow" },
        { id: 15, title: "Facial Wash", badge: "41%", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300", business: "Spa Ceylon", price: "LKR 2,400", oldPrice: "LKR 4,000", rating: 4.1, location: "Spa Ceylon, Sri Lanka", bg: "bg-green" },
    ];

    useEffect(() => {
        const handleScroll = () => setShowStickyBar(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyCoupon = () => {
        navigator.clipboard.writeText(deal.couponCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };

    const stockPct = (deal.stockLeft / deal.totalStock) * 100;

    return (
        <div className="dd-page">
            <div className="container">

                {/* ── BREADCRUMB ── */}
                <div className="dd-breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/categories">Categories</Link>
                    <ChevronRight size={14} />
                    <Link to={`/category/${deal.category.toLowerCase().replace(/ & /g, '-')}`}>{deal.category}</Link>
                    <ChevronRight size={14} />
                    <span>{deal.name}</span>
                </div>

                {/* ── MAIN 2-COLUMN LAYOUT ── */}
                <div className="dd-main">

                    {/* LEFT: Image Gallery */}
                    <div className="dd-gallery">
                        <div className="dd-main-img-wrap">
                            {deal.badge && <span className="dd-img-badge">{deal.badge}</span>}
                            <button
                                className={`dd-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart size={20} fill={isWishlisted ? 'white' : 'none'} />
                            </button>
                            <img src={deal.images[activeImg]} alt={deal.name} className="dd-main-img" />
                            <div className="dd-discount-badge">
                                <span>{deal.discount}% OFF</span>
                            </div>
                        </div>
                        <div className="dd-thumbs">
                            {deal.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`dd-thumb ${activeImg === i ? 'active' : ''}`}
                                    onClick={() => setActiveImg(i)}
                                >
                                    <img src={img} alt={`Thumb ${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Deal Info */}
                    <div className="dd-info">

                        {/* Business + Category */}
                        <div className="dd-biz-row">
                            <span className="dd-category-pill">
                                <Tag size={12} /> {deal.category}
                            </span>
                        </div>
                        <h1 className="dd-title">{deal.name}</h1>

                        {/* Business name + rating + location */}
                        <div className="dd-meta">
                            <span className="dd-biz-name">
                                <ShoppingBag size={14} /> {deal.businessName}
                            </span>
                            <div className="dd-rating-row">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.round(deal.rating) ? "#f8c205" : "none"} color={i < Math.round(deal.rating) ? "#f8c205" : "#cbd5e1"} />
                                ))}
                                <span className="dd-rating-num">{deal.rating}</span>
                                <span className="dd-reviews">({deal.reviewCount} reviews)</span>
                            </div>
                            <span className="dd-location"><MapPin size={14} /> {deal.location}</span>
                        </div>

                        {/* Price */}
                        <div className="dd-price-block">
                            <span className="dd-current-price">LKR {deal.currentPrice.toLocaleString()}</span>
                            <span className="dd-old-price">LKR {deal.originalPrice.toLocaleString()}</span>
                            <span className="dd-discount-pill">{deal.discount}% OFF</span>
                        </div>

                        {/* Urgency Signals */}
                        <div className="dd-urgency-row">
                            {deal.sellingFast && (
                                <span className="dd-urgency-badge selling-fast">
                                    <Flame size={12} /> Selling fast!
                                </span>
                            )}
                            <span className="dd-in-stock">IN STOCK</span>
                            <span className="dd-stock-left">Only {deal.stockLeft} items left</span>
                        </div>
                        <div className="dd-stock-bar">
                            <div className="dd-stock-fill" style={{ width: `${stockPct}%` }} />
                        </div>

                        {/* Deal Details Card */}
                        <div className="dd-details-card">
                            <h4 className="dd-details-title">Deal Details</h4>
                            <div className="dd-detail-row">
                                <Calendar size={18} className="dd-detail-icon" />
                                <div>
                                    <span className="dd-detail-label">Expires On</span>
                                    <span className="dd-detail-val">{deal.expiryDate}</span>
                                </div>
                            </div>
                            <div className="dd-detail-row">
                                <AlertCircle size={18} className="dd-detail-icon" />
                                <div>
                                    <span className="dd-detail-label">Terms</span>
                                    <span className="dd-detail-val dd-terms">{deal.terms}</span>
                                </div>
                            </div>
                            <div className="dd-detail-row">
                                <Clock size={18} className="dd-detail-icon" />
                                <div>
                                    <span className="dd-detail-label">Available</span>
                                    <span className="dd-detail-val">{deal.availability2}</span>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Code (if any) */}
                        {deal.couponCode && (
                            <div className="dd-coupon-row">
                                <span className="dd-coupon-label">Coupon Code:</span>
                                <span className="dd-coupon-code">{deal.couponCode}</span>
                                <button className="dd-coupon-copy" onClick={handleCopyCoupon}>
                                    <Copy size={14} /> {codeCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="dd-actions">
                            <a
                                href={deal.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dd-btn-primary"
                            >
                                <Globe size={18} /> Visit Website
                            </a>
                            <button
                                className={`dd-btn-wishlist ${isWishlisted ? 'active' : ''}`}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                                {isWishlisted ? 'Saved' : 'Add to Wishlist'}
                            </button>
                        </div>

                    </div>
                </div>

                {/* ── BOTTOM 2-COLUMN ── */}
                <div className="dd-lower">
                    {/* LEFT: Description */}
                    <div className="dd-description-col">
                        <div className="dd-desc-box">
                            <div className="dd-desc-header">
                                <CheckCircle size={20} className="dd-green-icon" />
                                <h3>Deal Description</h3>
                            </div>
                            <p className="dd-desc-text">{deal.description}</p>
                        </div>
                        <div className="dd-highlights-box">
                            <h4>Highlights</h4>
                            <ul>
                                {deal.highlights.map((h, i) => (
                                    <li key={i}><CheckCircle size={14} className="dd-green-icon" /> {h}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT: Client Card */}
                    <div className="dd-client-col">
                        <div className="dd-client-card">
                            <div className="dd-client-header">
                                <span className="dd-client-label">About Website</span>
                                <div className="dd-client-rating">
                                    <Star size={14} fill="#f8c205" color="#f8c205" />
                                    <span>{deal.client.rating}</span>
                                </div>
                            </div>
                            <div className="dd-client-profile">
                                <img src={deal.client.logo} alt={deal.client.name} className="dd-client-logo" />
                                <div>
                                    <h4 className="dd-client-name">{deal.client.name}</h4>
                                    {deal.client.verified && (
                                        <span className="dd-verified-badge">
                                            <CheckCircle size={12} /> Verified Client
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="dd-client-desc">
                                {deal.client.name} is a luxury Ayurvedic wellness brand from Sri Lanka, inspired by the island's heritage of natural healing and traditional wisdom.
                            </p>
                            <div className="dd-client-meta">
                                <div className="dd-client-stat">
                                    <ShoppingBag size={14} />
                                    <span>{deal.client.totalDeals} Active Deals</span>
                                </div>
                                {deal.client.phone && (
                                    <div className="dd-client-stat">
                                        <Phone size={14} />
                                        <span>{deal.client.phone}</span>
                                    </div>
                                )}
                            </div>
                            <a
                                href={deal.client.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dd-client-visit-btn"
                            >
                                <ExternalLink size={16} /> Visit Website
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── OTHER DEALS FROM THIS CLIENT ── */}
                <div className="dd-other-deals">
                    <div className="dd-section-header">
                        <h2>Other Deals in {deal.client.name}</h2>
                        <button className="dd-view-all-btn" onClick={() => navigate('/deals-listing')}>
                            View All <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="dd-other-grid">
                        {otherDeals.map(item => (
                            <div key={item.id} className="dd-other-card" onClick={() => navigate(`/deal/${item.id}`)}>
                                <div className="dd-other-img-wrap">
                                    <img src={item.image} alt={item.title} />
                                    <span className="dd-other-badge">{item.badge} OFF</span>
                                    <button className="dd-other-wish"><Heart size={14} /></button>
                                </div>
                                <div className="dd-other-body">
                                    <div className="dd-other-category">Health & Beauty</div>
                                    <div className="dd-other-biz"><ShoppingBag size={11} /> {item.business}</div>
                                    <h4 className="dd-other-title">{item.title}</h4>
                                    <div className="dd-other-rating">
                                        <Star size={12} fill="#f8c205" color="#f8c205" />
                                        <span>{item.rating}</span>
                                        <span className="dd-other-loc"><MapPin size={11} /> {item.location}</span>
                                    </div>
                                    <div className="dd-other-pricing">
                                        <span className="dd-other-price">{item.price}</span>
                                        <span className="dd-other-old">{item.oldPrice}</span>
                                    </div>
                                    <button className="dd-other-btn">View Deal</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ── STICKY BAR ── */}
            <div className={`dd-sticky ${showStickyBar ? 'visible' : ''}`}>
                <div className="container dd-sticky-inner">
                    <div className="dd-sticky-left">
                        <img src={deal.images[0]} alt="Deal" />
                        <div>
                            <p className="dd-sticky-name">{deal.name}</p>
                            <span className="dd-sticky-price">LKR {deal.currentPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <a href={deal.websiteUrl} target="_blank" rel="noopener noreferrer" className="dd-sticky-btn">
                        <Globe size={16} /> Grab Deal
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DealsDetail;
