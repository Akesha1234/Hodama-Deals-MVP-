import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    MessageSquare,
    Store,
    LogOut,
    Bell,
    Search,
    Plus,
    User,
    ChevronRight,
    UploadCloud,
    X,
    Menu,
    Image as ImageIcon,
    Tag,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Home,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStoredCategories } from '../../utils/categoryUtils';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './AddDeals.css';

const AddDeals = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Form States
    const [globalCategories, setGlobalCategories] = useState([]);
    useEffect(() => {
        setGlobalCategories(getStoredCategories());
    }, []);

    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [condition, setCondition] = useState('New');
    const [brand, setBrand] = useState('');

    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountRatio, setDiscountRatio] = useState(0);

    const [stock, setStock] = useState('');
    const [availability, setAvailability] = useState('In Stock');

    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Design Support Modal States
    const [isDesignSupportOpen, setIsDesignSupportOpen] = useState(false);
    const [designDetails, setDesignDetails] = useState('');
    const [designFiles, setDesignFiles] = useState([]);

    const handleDesignSupportSubmit = (e) => {
        e.preventDefault();
        const existingTickets = JSON.parse(localStorage.getItem('hodamaAdminSupportTickets_v3') || '[]');
        const newTicket = {
            id: 'TCK' + Math.floor(1000 + Math.random() * 9000),
            user: user?.name || 'Client',
            email: user?.email || 'client@hodamadeals.lk',
            phone: 'N/A',
            type: 'Design Team Support',
            message: designDetails,
            status: 'Open',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            attachment: designFiles.length > 0 ? `${designFiles.length} file(s) attached` : null,
            history: []
        };
        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify([newTicket, ...existingTickets]));
        
        alert('Your design request has been sent to our team! We will handle the rest.');
        setIsDesignSupportOpen(false);
        setDesignDetails('');
        setDesignFiles([]);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Calculate Discount dynamically
    useEffect(() => {
        if (price && discountPrice) {
            const p = parseFloat(price);
            const d = parseFloat(discountPrice);
            if (p > 0 && d < p) {
                const ratio = Math.round(((p - d) / p) * 100);
                setDiscountRatio(ratio);
            } else {
                setDiscountRatio(0);
            }
        } else {
            setDiscountRatio(0);
        }
    }, [price, discountPrice]);

    // Handle Image Upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...images, ...files].slice(0, 5); // Max 5 images
            setImages(newImages);

            const previews = newImages.map(file => URL.createObjectURL(file));
            setPreviewImages(previews);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Product published successfully! (Mock Action)');
        navigate('/client/manage-deals');
    };

    const handleSaveDraft = () => {
        alert('Draft saved successfully! (Mock Action)');
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                {/* View Container */}
                <div className="dashboard-view-container ap-scroll-container">
                    <div className="ap-wrapper fade-in">

                        {/* 1. Breadcrumb */}
                        <div className="ap-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Add New Deal</span>
                        </div>

                        {/* 2. Page Header */}
                        <div className="ap-page-header">
                            <div>
                                <h1><Plus size={28} className="text-blue-500" /> Create New Deal</h1>
                                <p>Fill the details below to publish your offer in Hodama Deals marketplace.</p>
                            </div>
                            <div className="ap-instructions">
                                <AlertCircle size={16} className="text-blue-500" />
                                <span>Add vibrant images to attract more deal clicks.</span>
                            </div>
                        </div>

                        {/* Design Team Support CTA */}
                        <div 
                            className="ap-design-support-cta" 
                            onClick={() => setIsDesignSupportOpen(true)}
                            style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', 
                                padding: '16px 24px', backgroundColor: '#f0f9ff', border: '1px dashed #3b82f6', 
                                borderRadius: '12px', marginBottom: '25px', cursor: 'pointer',
                                transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(59,130,246,0.1)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ backgroundColor: '#bfdbfe', padding: '12px', borderRadius: '50%', color: '#1d4ed8' }}>
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: '600' }}>
                                        I need help managing my deals (Design Team Support)
                                    </h4>
                                    <p style={{ margin: 0, color: '#3b82f6', fontSize: '13px' }}>
                                        Don't have time to create banners or fill forms? Send us your raw details and photos, and we'll design and publish it for you!
                                    </p>
                                </div>
                            </div>
                            <button style={{ backgroundColor: '#1d4ed8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                Request Support
                            </button>
                        </div>

                        <form className="ap-form-container" onSubmit={handleSubmit}>

                            <div className="ap-grid-layout">
                                {/* Left Column: Main Details */}
                                <div className="ap-main-col">

                                    {/* 3. Deal Information */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <Package size={20} />
                                            <h3>Deal Information</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Deal Title <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Sunday Seafood Buffet – 15% OFF"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Short Subtitle</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Grab 8 crispy Peri Peri drumsticks for just LKR 2,600"
                                            />
                                        </div>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Category <span className="req">*</span></label>
                                                <select
                                                    value={category}
                                                    onChange={(e) => {
                                                        setCategory(e.target.value);
                                                        setSubCategory('');
                                                    }}
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {globalCategories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                    <option value="Salon">Salon</option>
                                                    <option value="Restaurant">Restaurant</option>
                                                    <option value="Hotel">Hotel</option>
                                                    <option value="Fitness">Fitness</option>
                                                    <option value="Spa">Spa</option>
                                                    <option value="Fashion">Fashion</option>
                                                    <option value="Grocery">Grocery</option>
                                                    <option value="Electronics">Electronics</option>
                                                    <option value="Entertainment">Entertainment</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Sub Category</label>
                                                <select
                                                    value={subCategory}
                                                    onChange={(e) => setSubCategory(e.target.value)}
                                                    disabled={!category || category === 'other'}
                                                >
                                                    <option value="">Select Sub Category</option>
                                                    {category && category !== 'other' && globalCategories.find(c => c.name === category)?.subcategories?.map(sub => (
                                                        <option key={sub} value={sub}>{sub}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Business / Brand Name <span className="req">*</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Spa Ceylon, Pizza Hut"
                                                    required
                                                />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Deal Type</label>
                                                <select>
                                                    <option value="">Select Deal Type</option>
                                                    <option>Lunch Buffet Specials</option>
                                                    <option>Buy 1 Get 1 (BOGO)</option>
                                                    <option>Credit Card Offers</option>
                                                    <option>Combo Deals</option>
                                                    <option>High Tea Specials</option>
                                                    <option>Early Bird Discounts</option>
                                                    <option>Happy Hour</option>
                                                    <option>Seasonal Sale</option>
                                                    <option>Flash Deal</option>
                                                    <option>Limited Time Offer</option>
                                                    <option>Exclusive Web Discount</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. Deal Images Upload */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <ImageIcon size={20} />
                                            <h3>Deal Banner/Images <span className="req">*</span></h3>
                                        </div>
                                        <p className="ap-helper-text">Upload up to 5 images. First image will be the primary offer thumbnail. Use a branded banner for best results.</p>

                                        <div className="ap-upload-zone">
                                            <input
                                                type="file"
                                                id="ap-img-upload"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="ap-img-upload" className="ap-upload-trigger">
                                                <UploadCloud size={40} className="text-gray-400" />
                                                <span className="upload-link">Click to upload</span>
                                                <span className="upload-hint">or drag and drop</span>
                                                <span className="upload-req">PNG, JPG (max. 5MB per image)</span>
                                            </label>
                                        </div>

                                        {previewImages.length > 0 && (
                                            <div className="ap-image-preview-list">
                                                {previewImages.map((src, index) => (
                                                    <div key={index} className="preview-item">
                                                        <img src={src} alt={`Preview ${index}`} />
                                                        <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}>
                                                            <X size={14} />
                                                        </button>
                                                        {index === 0 && <span className="cover-badge">Cover</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* 8. Deal Description */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <AlertCircle size={20} />
                                            <h3>Deal Description <span className="req">*</span></h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <textarea
                                                className="ap-desc-area"
                                                placeholder="Describe the deal in detail. Include what's included, terms of use, how to claim it, etc."
                                                rows="6"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Deal Highlights (one per line)</label>
                                            <textarea
                                                className="ap-desc-area"
                                                placeholder={"100% Natural ingredients\nAward-winning brand\n60-day money back guarantee"}
                                                rows="4"
                                            ></textarea>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Terms &amp; Conditions</label>
                                            <textarea
                                                className="ap-desc-area"
                                                placeholder="e.g. Valid for dine-in only. Cannot be combined with other offers. Present digital voucher at checkout."
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Pricing & Meta */}
                                <div className="ap-side-col">

                                    {/* 4. Pricing & Discount */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <Tag size={20} />
                                            <h3>Pricing &amp; Discount</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Original Price (LKR) <span className="req">*</span></label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Offer / Deal Price (LKR) <span className="req">*</span></label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={discountPrice}
                                                onChange={(e) => setDiscountPrice(e.target.value)}
                                            />
                                        </div>
                                        {discountRatio > 0 && (
                                            <div className="ap-discount-calc fade-in">
                                                <span className="calc-label">Auto-Calculated Discount:</span>
                                                <span className="calc-badge">{discountRatio}% OFF</span>
                                            </div>
                                        )}
                                        <div className="ap-form-group">
                                            <label>Coupon Code (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. HODAMA20"
                                            />
                                            <p className="ap-helper-text mt-2">Leave blank if no coupon code is required.</p>
                                        </div>
                                    </div>

                                    {/* Affiliate / Website Details */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <Store size={20} />
                                            <h3>Website &amp; Affiliate</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Business Website URL <span className="req">*</span></label>
                                            <input
                                                type="url"
                                                placeholder="https://spaceylon.com"
                                                required
                                            />
                                            <p className="ap-helper-text mt-2">Users will be redirected here when they click "Visit Website".</p>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Business Phone (Optional)</label>
                                            <input
                                                type="tel"
                                                placeholder="+94 11 234 5678"
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Business Logo URL (Optional)</label>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>
                                    </div>

                                    {/* Availability Details */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <CheckCircle2 size={20} />
                                            <h3>Availability</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Deal Status</label>
                                            <select
                                                value={availability}
                                                onChange={(e) => setAvailability(e.target.value)}
                                            >
                                                <option value="In Stock">Active</option>
                                                <option value="Out of Stock">Expired</option>
                                                <option value="Draft">Draft / Scheduled</option>
                                            </select>
                                        </div>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Expiry Date</label>
                                                <input type="date" />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Available Hours</label>
                                                <input type="text" placeholder="e.g. 9AM – 10PM" />
                                            </div>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Stock / Quantity Available</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 50"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <MapPin size={20} />
                                            <h3>Location</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>City / District <span className="req">*</span></label>
                                            <select
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                required
                                            >
                                                <option value="">Select City</option>
                                                <option value="Colombo">Colombo</option>
                                                <option value="Gampaha">Gampaha</option>
                                                <option value="Kandy">Kandy</option>
                                                <option value="Galle">Galle</option>
                                                <option value="Negombo">Negombo</option>
                                                <option value="Matara">Matara</option>
                                                <option value="Jaffna">Jaffna</option>
                                                <option value="Anuradhapura">Anuradhapura</option>
                                                <option value="Nationwide">Island-wide / Online</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* 9. Submit Buttons */}
                            <div className="ap-action-bar">
                                <button type="button" className="ap-btn-cancel" onClick={() => navigate('/client/dashboard')}>Cancel</button>
                                <div className="ap-action-right">
                                    <button type="button" className="ap-btn-draft" onClick={handleSaveDraft}>Save Draft</button>
                                    <button type="submit" className="ap-btn-publish">
                                        <CheckCircle2 size={18} /> Publish Deal
                                    </button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </main>

            {/* Design Support Modal */}
            {isDesignSupportOpen && (
                <div className="ap-modal-overlay" onClick={() => setIsDesignSupportOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="ap-modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '550px', maxWidth: '95%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#3b82f6' }}><MessageSquare size={22} /></div>
                                Design Team Support
                            </h3>
                            <button onClick={() => setIsDesignSupportOpen(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#64748b' }}><X size={20} /></button>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                            Skip the forms! Upload your raw photos, documents, and type in basic info (original price, discount, conditions). Our staff will professionally design the banners and publish the deal on your behalf.
                        </p>
                        <form onSubmit={handleDesignSupportSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Deal Details & Instructions</label>
                                <textarea 
                                    required
                                    value={designDetails}
                                    onChange={e => setDesignDetails(e.target.value)}
                                    placeholder="E.g. I want to offer an exclusive 20% off on my Sunday Buffet. The regular price is Rs. 5000. This is valid till end of next month. Please make it look premium!"
                                    style={{ width: '100%', height: '120px', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '10px', resize: 'vertical', fontSize: '14px', color: '#334155', outline: 'none', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Raw Images / Logos</label>
                                <div style={{ border: '2px dashed #cbd5e1', padding: '30px 20px', textAlign: 'center', borderRadius: '10px', backgroundColor: '#f8fafc', transition: 'all 0.2s', cursor: 'pointer' }}
                                     onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                                     onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}>
                                    <input 
                                        type="file" 
                                        multiple 
                                        onChange={e => setDesignFiles(Array.from(e.target.files))}
                                        style={{ display: 'none' }}
                                        id="raw-files"
                                    />
                                    <label htmlFor="raw-files" style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
                                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><UploadCloud size={28} /></div>
                                        <span>Click to browse files (Photos, Logos, Docs)</span>
                                    </label>
                                    {designFiles.length > 0 && (
                                        <div style={{ marginTop: '16px', fontSize: '14px', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <CheckCircle2 size={18} /> {designFiles.length} file(s) selected
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', transition: 'background-color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#1d4ed8'}>
                                Send Request to Admin Team
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AddDeals;

