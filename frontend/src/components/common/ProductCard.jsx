import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    // If no product is passed, load dummy fallback data from BRD mockup requirements
    const item = product || {
        id: 101,
        name: "Standard Placeholder Product for Testing Display Logic",
        price: 4990,
        oldPrice: 5990,
        condition: "New",
        discount: "15% OFF",
        rating: 4.8,
        reviews: 124,
        sales: "1.2k sold",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300"
    };

    return (
        <Link to={`/deal/${item.id}`} className="pc-card">

            <div className="pc-image-container">
                <img src={item.image} alt={item.name} className="pc-image" />

                <div className="pc-badges">
                    {item.discount && (
                        <span className="pc-badge pc-badge-discount">{item.discount}</span>
                    )}
                    <span className={`pc-badge ${item.condition === 'New' ? 'pc-badge-new' : 'pc-badge-used'}`}>
                        {item.condition}
                    </span>
                </div>

                <button className="pc-overlay-action" onClick={(e) => { e.preventDefault(); /* Handle Wishlist Logic */ }}>
                    <Heart size={16} />
                </button>
            </div>

            <div className="pc-info">
                <h3 className="pc-title">{item.name}</h3>

                <div className="pc-price-wrap">
                    {item.oldPrice && <span className="pc-old-price">LKR {item.oldPrice.toLocaleString()}</span>}
                    <div className="pc-price">LKR {item.price.toLocaleString()}</div>
                </div>

                <div className="pc-footer border-t border-gray-100 pt-2">
                    <div className="pc-rating">
                        <Star size={12} fill="#FDB913" />
                        {item.rating || 4.5}
                        <span className="text-gray-400 ml-1">({item.reviews || 89})</span>
                    </div>
                    <span className="pc-sales">{item.sales || '45 sold'}</span>
                </div>
            </div>

        </Link>
    );
};

export default ProductCard;
