import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, Package, Truck, Heart, MapPin,
    Bell, Settings, LogOut, ChevronRight,
    Clock, HelpCircle, CreditCard, ShoppingBag,
    Eye, Trash2, Plus, Edit2, List, Shield, EyeOff, LayoutDashboard, Store, Sparkles, History
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../../components/common/ProductCard';
import './Profile.css';

const Profile = () => {
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const { becomeSeller } = useAuth();
    const [partnerForm, setPartnerForm] = useState({ businessName: '', category: '', websiteLink: '' });
    const [regMessage, setRegMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleBecomePartner = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setRegMessage(null);
        try {
            await becomeSeller(partnerForm);
            setIsLoading(false);
            setRegMessage({ type: 'success', text: 'Success! You are now a Partner. Redirecting...' });
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            setRegMessage({ type: 'error', text: error.message });
        }
    };

    // Sample Data



    const recommendedDeals = [
        { id: 101, name: "Sony WH-1000XM4", price: 65000, oldPrice: 85000, rating: 4.8, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400" },
        { id: 102, name: "Dell XPS 13 Laptop", price: 245000, oldPrice: 285000, rating: 4.6, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400" },
        { id: 103, name: "Canon EOS R5", price: 850000, oldPrice: 950000, rating: 4.9, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
        { id: 104, name: "Adidas Ultraboost", price: 38000, oldPrice: 45000, rating: 4.7, image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400" },
    ];

    const recentlyViewed = [
        { id: 201, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
        { id: 202, image: 'https://images.unsplash.com/photo-1546868871-70c122467d3b?w=200' },
        { id: 203, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200' },
        { id: 204, image: 'https://images.unsplash.com/photo-1585333127302-d2924785f28a?w=200' },
    ];

    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || 'Hashni Rehana',
        phone: '077 123 4567',
        gender: 'female',
        bio: ''
    });

    const [notifications, setNotifications] = useState({
        orders: true,
        promos: true,
        deals: false,
        security: true
    });

    const [wishlistCount, setWishlistCount] = useState(2);

    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
    const [editingAddrId, setEditingAddrId] = useState(null);
    const [addrForm, setAddrForm] = useState({
        type: '', name: '', text: '', phone: '', isDefault: false
    });

    const handleAddAddress = () => {
        setEditingAddrId(null);
        setAddrForm({ type: 'Home', name: user?.name || '', text: '', phone: '', isDefault: false });
        setIsAddrModalOpen(true);
    };

    const handleEditAddress = (id) => {
        const addr = addresses.find(a => a.id === id);
        if (addr) {
            setEditingAddrId(id);
            setAddrForm({ ...addr });
            setIsAddrModalOpen(true);
        }
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        if (editingAddrId) {
            setAddresses(prev => prev.map(a => a.id === editingAddrId ? { ...addrForm, id: editingAddrId } : a));
        } else {
            setAddresses([...addresses, { ...addrForm, id: Date.now() }]);
        }
        setIsAddrModalOpen(false);
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            setAddresses(prev => prev.filter(a => a.id !== id));
        }
    };

    const fileInputRef = useRef(null);
    const [profilePic, setProfilePic] = useState(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handlePfpChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        alert('Profile updated successfully!');
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        alert('Password changed successfully!');
    };


    const handleToggleNotify = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const summaryStats = [
        { label: t('dashWishlistCount'), value: wishlistCount, icon: <Heart />, color: '#f98888ff', action: () => navigate('/wishlist', { state: { fromProfile: true } }) },
        { label: 'Saved Deals', value: 4, icon: <Sparkles />, color: '#f59e0b', action: () => setActiveTab('wishlist') },
    ];

    return (
        <div className="modern-profile-hub">
            <div className="container">
                <nav className="profile-breadcrumbs">
                    <Link to="/">{t('home')}</Link>
                    <ChevronRight size={14} className="separator" />
                    <span className="current">{t('dashboard')}</span>
                </nav>
                <div className="profile-grid">
                    {/* Sidebar Navigation */}
                    <aside className="profile-sidebar">
                        <div className="profile-header-card">
                            <div className="avatar-wrapper" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                                <img src={profilePic || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff`} alt="Profile" />
                                <button className="edit-pfp"><Edit2 size={12} /></button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handlePfpChange}
                                />
                            </div>
                            <div className="user-meta">
                                <h3>{user?.name || 'Hashni Rehana'}</h3>
                                <div className="user-badge">{user?.role || 'Buyer'} Account</div>
                                <p className="member-since">Member since 2026</p>
                            </div>
                        </div>

                        <nav className="profile-nav">
                            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                                <LayoutDashboard size={18} /> {t('overview')}
                            </button>
                            <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
                                <User size={18} /> Personal Info
                            </button>
                            <button className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveTab('wishlist')}>
                                <Heart size={18} /> Wishlist
                            </button>
                            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
                                <Shield size={18} /> Security
                            </button>
                            <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
                                <Bell size={18} /> Notifications
                            </button>
                            <hr />
                            {user?.role !== 'seller' && user?.role !== 'admin' && (
                                <button className={activeTab === 'partner' ? 'active upgrade-client-btn' : 'upgrade-client-btn'} onClick={() => setActiveTab('partner')}>
                                    <Store size={18} /> Become a Partner
                                </button>
                            )}
                            <button className="logout-btn" onClick={handleLogout}><LogOut size={18} /> Logout</button>
                        </nav>

                        <div className="profile-support-box">
                            <HelpCircle size={28} />
                            <h4>Need Support?</h4>
                            <div className="support-actions">
                                <button onClick={() => navigate('/contact')}>Contact Us</button>
                                <button onClick={() => navigate('/support')}>FAQs</button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="profile-main">
                        {/* Tab Switcher Logic */}

                        {activeTab === 'overview' && (
                            <div className="profile-view-section">
                                <header className="profile-hero">
                                    <div className="welcome-box">
                                        <h1>{t('dashWelcome', user?.name?.split(' ')[0] || 'Hashni')}</h1>
                                        <p>Manage your account and discover exclusive deals.</p>
                                    </div>
                                    <div className="quick-actions">
                                        <button className="icon-btn"><Bell size={20} /></button>
                                        <button className="icon-btn" onClick={() => setActiveTab('info')}><Settings size={20} /></button>
                                    </div>
                                </header>

                                {/* Summary Statistics */}
                                <div className="stats-row">
                                    {summaryStats.map((stat, idx) => (
                                        <div key={idx} className="stat-card" onClick={stat.action} style={{ cursor: 'pointer', '--accent-color': stat.color }}>
                                            <div className="icon-circle">{stat.icon}</div>
                                            <div className="stat-label-box">
                                                <span className="value">{stat.value}</span>
                                                <span className="label text-xs uppercase font-bold tracking-wider">{stat.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>




                                {/* Recommended for You */}
                                <div className="recent-orders-card">
                                    <div className="head">
                                        <h3><Sparkles size={18} className="text-yellow-500" /> Recommended for You</h3>
                                        <Link to="/deals-listing">Explore All</Link>
                                    </div>
                                    <div className="grid grid-cols-4 gap-6">
                                        {recommendedDeals.map(p => <ProductCard key={p.id} product={p} />)}
                                    </div>
                                </div>

                                {/* Recently Viewed Section */}
                                <div className="tracking-card">
                                    <div className="head">
                                        <h3><History size={18} className="text-blue-500" /> Pick up where you left off</h3>
                                    </div>
                                    <div className="viewed-scroll">
                                        {recentlyViewed.map(item => (
                                            <div key={item.id} className="viewed-circle" onClick={() => navigate(`/deal/${item.id}`)}>
                                                <img src={item.image} alt="" />
                                                <div className="hover-eye"><Eye size={18} /></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'info' && (
                            <div className="profile-edit-section">
                                <div className="section-head">
                                    <h2>Personal Information</h2>
                                    <p>Update your name, contact details and other basic info.</p>
                                </div>
                                <form className="modern-form" onSubmit={handleUpdateProfile}>
                                    <div className="form-grid">
                                        <div className="input-field">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                value={personalInfo.name}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Email Address</label>
                                            <input type="email" defaultValue={user?.email || 'hashni@example.com'} disabled />
                                        </div>
                                        <div className="input-field">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                value={personalInfo.phone}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Gender</label>
                                            <select
                                                value={personalInfo.gender}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="input-field span-full">
                                            <label>Bio (Optional)</label>
                                            <textarea
                                                placeholder="Tell us something about yourself..."
                                                value={personalInfo.bio}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="form-buttons">
                                        <button type="submit" className="save-btn shadow-blue">Update Profile</button>
                                        <button type="button" className="cancel-btn" onClick={() => setPersonalInfo({ name: user?.name, phone: '077 123 4567', gender: 'female', bio: '' })}>Reset</button>
                                    </div>
                                </form>
                            </div>
                        )}



                        {activeTab === 'wishlist' && (
                            <div className="profile-wishlist-section">
                                <div className="section-head flex justify-between items-center">
                                    <div>
                                        <h2>My Wishlist</h2>
                                        <p>Deals you have saved for later from the platform.</p>
                                    </div>
                                    <button className="add-new-btn border-blue cursor-pointer bg-white text-blue-600 border border-blue-600" onClick={() => navigate('/wishlist')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>Manage Page <ChevronRight size={16} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    {recommendedDeals.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="profile-security-section">
                                <div className="section-head">
                                    <h2>Security Settings</h2>
                                    <p>Manage your password and account security settings.</p>
                                </div>
                                <div className="security-content">
                                    <div className="security-card main-security">
                                        <h3 className="mb-4 font-bold flex items-center gap-2"><Shield size={18} className="text-blue-500" /> Change Password</h3>
                                        <form className="pass-form space-y-4 max-w-md" onSubmit={handlePasswordUpdate}>
                                            <div className="input-box">
                                                <label>Current Password</label>
                                                <div className="relative">
                                                    <input type={showCurrentPass ? "text" : "password"} placeholder="••••••••" required />
                                                    <button type="button" className="pass-toggle-btn" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                                                        {showCurrentPass ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="input-box">
                                                <label>New Password</label>
                                                <div className="relative">
                                                    <input type={showNewPass ? "text" : "password"} placeholder="Minimum 8 characters" required minLength={8} />
                                                    <button type="button" className="pass-toggle-btn" onClick={() => setShowNewPass(!showNewPass)}>
                                                        {showNewPass ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="input-box">
                                                <label>Confirm New Password</label>
                                                <div className="relative">
                                                    <input type={showConfirmPass ? "text" : "password"} placeholder="Re-type new password" required />
                                                    <button type="button" className="pass-toggle-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                                        {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="submit" className="update-pass-btn mt-4">Update Password</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="profile-notifications-section">
                                <div className="section-head">
                                    <h2>Notification Preferences</h2>
                                    <p>Select the kinds of notifications you get about activities on Hodama Deals.</p>
                                </div>
                                <div className="notify-switches mt-8 space-y-4">
                                    <div className="switch-card" onClick={() => handleToggleNotify('promos')}>
                                        <div className="text ml-4">
                                            <p className="font-bold">Promotional Emails</p>
                                            <p className="text-sm text-gray-500">Stay updated on flash sales, new arrivals and limited deals.</p>
                                        </div>
                                        <div className={`toggle-pill ${notifications.promos ? 'active' : ''}`}></div>
                                    </div>
                                    <div className="switch-card" onClick={() => handleToggleNotify('deals')}>
                                        <div className="text ml-4">
                                            <p className="font-bold">Deals Alerts</p>
                                            <p className="text-sm text-gray-500">Get alerted when prices drop on items in your wishlist.</p>
                                        </div>
                                        <div className={`toggle-pill ${notifications.deals ? 'active' : ''}`}></div>
                                    </div>
                                    <div className="switch-card" onClick={() => handleToggleNotify('security')}>
                                        <div className="text ml-4">
                                            <p className="font-bold">Account Security</p>
                                            <p className="text-sm text-gray-500">Important alerts regarding your account logins and security changes.</p>
                                        </div>
                                        <div className={`toggle-pill ${notifications.security ? 'active' : ''}`}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'partner' && (
                            <div className="profile-edit-section fade-in">
                                <div className="section-head">
                                    <h2>Become a Partner</h2>
                                    <p>Upgrade to a seller account to start posting and managing your own deals.</p>
                                </div>

                                {regMessage && (
                                    <div className={`message-banner ${regMessage.type}`} style={{
                                        padding: '15px', borderRadius: '8px', marginBottom: '20px',
                                        backgroundColor: regMessage.type === 'error' ? '#FFF5F5' : '#F0FFF4',
                                        color: regMessage.type === 'error' ? '#C53030' : '#2F855A',
                                        textAlign: 'center', fontWeight: '600'
                                    }}>
                                        {regMessage.text}
                                    </div>
                                )}

                                <form className="modern-form" onSubmit={handleBecomePartner}>
                                    <div className="form-grid">
                                        <div className="input-field span-full">
                                            <label>Business Name</label>
                                            <input
                                                type="text"
                                                placeholder="Your Store/Business Name"
                                                required
                                                value={partnerForm.businessName}
                                                onChange={e => setPartnerForm({ ...partnerForm, businessName: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-field span-full">
                                            <label>Business Category</label>
                                            <select
                                                required
                                                value={partnerForm.category}
                                                onChange={e => setPartnerForm({ ...partnerForm, category: e.target.value })}
                                                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', backgroundColor: '#F8F9FA' }}
                                            >
                                                <option value="" disabled>Select category</option>
                                                <option value="salon">Salon</option>
                                                <option value="restaurant">Restaurant</option>
                                                <option value="hotel">Hotel</option>
                                                <option value="electronics">Electronics</option>
                                                <option value="healthBeauty">Health & Beauty</option>
                                                <option value="groceries">Groceries</option>
                                                <option value="spa">Spa</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="other">Other Services</option>
                                            </select>
                                        </div>
                                        <div className="input-field span-full">
                                            <label>Website Link (Optional)</label>
                                            <input
                                                type="url"
                                                placeholder="https://yourwebsite.com"
                                                value={partnerForm.websiteLink}
                                                onChange={e => setPartnerForm({ ...partnerForm, websiteLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-buttons mt-6" style={{ marginTop: '20px' }}>
                                        <button type="submit" className="save-btn shadow-blue" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: "bold" }} disabled={isLoading}>
                                            {isLoading ? 'Processing...' : 'UPGRADE TO SELLER ACCOUNT'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;