import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Heart, Star, MapPin, Sparkles, Utensils, Shirt, Monitor, 
    Scissors, Building2, ShoppingBasket, Wind 
} from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import './DesignCard.css';

const DesignCard = ({ deal }) => {
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const hasSpace = deal.badge && deal.badge.includes(' ');
    const badgeTop = hasSpace ? deal.badge.split(' ')[0] : deal.badge;
    const badgeBot = hasSpace ? deal.badge.substring(deal.badge.indexOf(' ') + 1) : '';

    // Standardized Category Mapping
    const catList = deal.category ? deal.category.toLowerCase() : '';
    let catColor = '#be123c'; // Salon Redish
    let catIcon = Sparkles; // Fallback

    if (catList.includes('salon')) {
        catColor = '#be123c';
        catIcon = "/assets/images/Salon.png";
    } else if (catList.includes('restaurant') || catList.includes('food')) {
        catColor = '#c2410c';
        catIcon = "/assets/images/Restaurant.png";
    } else if (catList.includes('hotel')) {
        catColor = '#6d28d9';
        catIcon = "/assets/images/Hotel.png";
    } else if (catList.includes('fashion') || catList.includes('clothing')) {
        catColor = '#047857';
        catIcon = "/assets/images/Fashion.png";
    } else if (catList.includes('electronics') || catList.includes('gadget')) {
        catColor = '#76a81eff';
        catIcon = "/assets/images/electronics.png";
    } else if (catList.includes('grocer')) {
        catColor = '#b45309';
        catIcon = "/assets/images/Groceries.png";
    } else if (catList.includes('spa')) {
        catColor = '#1d4ed8';
        catIcon = "/assets/images/Spa.png";
    } else if (catList.includes('beauty')) {
        catColor = '#be185d';
        catIcon = "/assets/images/Health&Beauty.png";
    }

    return (
        <div key={deal.id} className="hd-prod-card-standard" onClick={() => navigate(`/deal/${deal.id}`)}>
            <div className="hd-prod-img-box">
                {deal.badge && (
                    <div className="hd-badge-top-left">
                        <span className="badge-top">{badgeTop}</span>
                        {badgeBot && <span className="badge-bot">{badgeBot}</span>}
                    </div>
                )}
                <button 
                    className={`hd-wishlist-btn ${isInWishlist(deal.id) ? 'active' : ''}`} 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleWishlist(deal);
                    }}
                >
                    <Heart size={20} fill={isInWishlist(deal.id) ? "#ffffff" : "none"} color={isInWishlist(deal.id) ? "#ffffff" : "currentColor"} />
                </button>
                <img src={deal.img} alt={deal.name} className="hd-prod-img" />
            </div>

            <div className="hd-prod-content">
                <div className="hd-cat-line" style={{ 
                    backgroundColor: (catColor.slice(0, 7)) + '12',
                    borderColor: (catColor.slice(0, 7)) + '25',
                    border: `1px solid ${(catColor.slice(0, 7))}25`
                }}>
                    <div className="hd-cat-icon" style={{ backgroundColor: catColor }}>
                        {typeof catIcon === 'string' ? (
                            <img 
                                src={catIcon} 
                                alt="icon" 
                                style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} 
                            />
                        ) : (
                            <catIcon size={10} color="#fff" />
                        )}
                    </div>
                    <span className="hd-cat-text" style={{ color: catColor }}>{deal.category || "Health & Beauty"}</span>
                </div>

                <h3 className="hd-prod-name">{deal.name}</h3>
                {deal.description && <p className="hd-prod-subtitle">{deal.description}</p>}

                <div className="hd-store-line">
                    <img src={deal.storeImg || "https://uvce.lk/wp-content/uploads/2022/10/Luv-Essence-Logo.png"} alt="Store" />
                    <span className="hd-store-name">{deal.storeName}</span>
                </div>

                <div className="hd-meta-row">
                    <div className="hd-rating-box">
                        <Star size={18} fill="#facc15" color="#facc15" />
                        <span className="hd-rating-val">{deal.rating}</span>
                        <span className="hd-rating-count">({deal.ratingCount})</span>
                    </div>
                    <div className="hd-loc-box">
                        <MapPin size={14} color="#64748b" />
                        <span className="hd-loc-text">{deal.location}</span>
                    </div>
                </div>

                <div className="hd-price-row">
                    <div className="hd-price-left">
                        <span className="hd-price-now">
                            {deal.price.includes('LKR') || deal.price.includes('%') || deal.price.includes('Total') ? deal.price : `LKR ${deal.price}`}
                        </span>
                        {deal.oldPrice && <span className="hd-price-was">LKR {deal.oldPrice}</span>}
                    </div>
                    <span className={
                        deal.dealType === 'LIMITED OFFER' ? 'hd-limited-badge' :
                            deal.dealType === 'SALE' ? 'hd-sale-badge' :
                                (deal.dealType === 'DISCOUNT' ? 'hd-discount-badge' : 'hd-offer-badge')
                    }>{deal.dealType || "OFFER"}</span>
                </div>

                <div className="hd-separator-line"></div>

                <div className="hd-cta-row">
                    <button className="hd-yellow-deal-btn">View Deal</button>
                </div>
            </div>
        </div>
    );
};

export default DesignCard;
