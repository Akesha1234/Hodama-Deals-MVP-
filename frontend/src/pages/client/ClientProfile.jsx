import React, { useState, useRef } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    User,
    LogOut,
    Bell,
    MessageSquare,
    Search,
    Plus,
    Menu,
    X,
    Edit2,
    Shield,
    Image as ImageIcon,
    Save,
    Camera,
    ChevronRight,
    MapPin,
    Smartphone,
    Mail,
    Store,
    Lock,
    Eye,
    EyeOff,
    Home,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './ClientProfile.css';

const ClientProfile = () => {
    const { user: authUser, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // For sidebar highlighting

    const [user, setUser] = useState({
        name: authUser?.name || 'Client User',
        email: authUser?.email || 'client@hodamadeals.com',
        phone: '077 123 4567',
        role: 'Client',
        storeName: 'Hodama Tech Store',
        storeDescription: 'Your one-stop shop for all tech gadgets.',
        storeCategory: 'Electronics',
        address: 'Colombo',
        city: 'Colombo',
        joinedDate: '2026',
        profilePic: null,
        storeLogo: null
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [notifications, setNotifications] = useState({
        orders: true,
        messages: true,
        promos: false
    });

    const profilePicRef = useRef(null);
    const storeLogoRef = useRef(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleToggleNotify = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        alert('Profile saved successfully!');
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('Passwords do not match!');
            return;
        }
        alert('Password updated successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                <div className="dashboard-view-container profile-scroll-container">
                    <div className="profile-wrapper fade-in">

                        {/* Breadcrumb & Header */}
                        <div className="profile-page-header">
                            <div className="header-info">
                                <h1><User size={32} /> Client Profile</h1>
                                <p>Manage your client account information and store details.</p>
                            </div>
                            <div className="header-actions">
                                <button className="btn-secondary" onClick={() => navigate('/client/dashboard')}>Cancel</button>
                                <button className="btn-primary" onClick={handleSaveChanges}>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>

                        <div className="profile-content-grid">

                            {/* Left Column: Summary & Stats */}
                            <div className="profile-left-col">

                                {/* 2. Client Profile Summary Card */}
                                <div className="profile-summary-card">
                                    <div className="summary-bg-pattern"></div>

                                    <div className="summary-avatar-section">
                                        <div className="summary-avatar" onClick={() => profilePicRef.current.click()}>
                                            <img src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=f8c205&color=fff&size=120`} alt="Profile" />
                                            <div className="avatar-edit-overlay">
                                                <Camera size={20} />
                                            </div>
                                        </div>
                                        <input type="file" ref={profilePicRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'profilePic')} />

                                        <h2 className="summary-name">{user.name}</h2>
                                        <div className="summary-store-badge">
                                            <Store size={14} /> {user.storeName}
                                        </div>
                                    </div>

                                    <div className="summary-details">
                                        <div className="detail-row">
                                            <Mail size={16} />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Smartphone size={16} />
                                            <span>{user.phone}</span>
                                        </div>
                                        <div className="detail-row">
                                            <MapPin size={16} />
                                            <span>{user.city}, Sri Lanka</span>
                                        </div>
                                    </div>

                                    <div className="summary-actions">
                                        <button className="summary-btn btn-outline" onClick={() => profilePicRef.current.click()}>
                                            <Camera size={16} /> Change Photo
                                        </button>
                                    </div>
                                </div>

                                {/* 6. Client Performance Summary */}
                                <div className="profile-stats-card">
                                    <h3 className="card-title">Store Performance</h3>

                                    <div className="stats-mini-grid">
                                        <div className="stat-mini-box">
                                            <div className="s-icon text-blue"><Package size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">85</span>
                                                <span className="s-lbl">Active Deals</span>
                                            </div>
                                        </div>
                                        <div className="stat-mini-box">
                                            <div className="s-icon text-yellow"><Eye size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">4.5K</span>
                                                <span className="s-lbl">Deal Views</span>
                                            </div>
                                        </div>
                                        <div className="stat-mini-box">
                                            <div className="s-icon text-green"><Store size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">4.8</span>
                                                <span className="s-lbl">Rating</span>
                                            </div>
                                        </div>
                                        <div className="stat-mini-box">
                                            <div className="s-icon text-purple"><LayoutDashboard size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">782</span>
                                                <span className="s-lbl">Redirect Clicks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Forms */}
                            <div className="profile-right-col">

                                <form onSubmit={handleSaveChanges} className="profile-forms-wrapper">

                                    {/* 3. Store Information Section */}
                                    <div className="profile-form-card">
                                        <div className="card-header">
                                            <Store size={20} className="text-primary" />
                                            <h3>Store Information</h3>
                                        </div>

                                        <div className="form-grid">
                                            <div className="form-group span-2">
                                                <label>Store Logo</label>
                                                <div className="logo-upload-box" onClick={() => storeLogoRef.current.click()}>
                                                    {user.storeLogo ? (
                                                        <img src={user.storeLogo} alt="Store Logo" className="logo-preview" />
                                                    ) : (
                                                        <div className="logo-placeholder">
                                                            <ImageIcon size={32} />
                                                            <span>Click to upload store logo</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input type="file" ref={storeLogoRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'storeLogo')} />
                                            </div>

                                            <div className="form-group span-2">
                                                <label>Store Name</label>
                                                <input type="text" name="storeName" value={user.storeName} onChange={handleInputChange} placeholder="e.g. TechZone Store" required />
                                            </div>

                                            <div className="form-group span-2">
                                                <label>Store Category</label>
                                                <select name="storeCategory" value={user.storeCategory} onChange={handleInputChange}>
                                                    <option value="Electronics">Electronics Store</option>
                                                    <option value="Fashion">Fashion Store</option>
                                                    <option value="Home">Home Appliances</option>
                                                    <option value="Beauty">Health & Beauty</option>
                                                    <option value="Sports">Sports & Outdoors</option>
                                                    <option value="Other">Other (Please Specify)</option>
                                                </select>
                                            </div>

                                            {user.storeCategory === 'Other' && (
                                                <div className="form-group span-2" style={{ animation: 'fadeIn 0.3s ease' }}>
                                                    <label>Specify Store Category</label>
                                                    <input
                                                        type="text"
                                                        name="customCategory"
                                                        value={user.customCategory || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Type your category here..."
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <div className="form-group span-2">
                                                <label>Store Description</label>
                                                <textarea name="storeDescription" value={user.storeDescription} onChange={handleInputChange} placeholder="Brief description of your store..."></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Contact Information Section */}
                                    <div className="profile-form-card">
                                        <div className="card-header">
                                            <Mail size={20} className="text-primary" />
                                            <h3>Contact Details</h3>
                                        </div>

                                        <div className="form-grid">
                                            <div className="form-group span-2">
                                                <label>Client Name</label>
                                                <input type="text" name="name" value={user.name} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input type="email" name="email" value={user.email} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input type="tel" name="phone" value={user.phone} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-group span-2">
                                                <label>Business Address</label>
                                                <input type="text" name="address" value={user.address} onChange={handleInputChange} placeholder="Street address" required />
                                            </div>

                                            <div className="form-group">
                                                <label>City / District</label>
                                                <select name="city" value={user.city} onChange={handleInputChange}>
                                                    <option value="Colombo">Colombo</option>
                                                    <option value="Gampaha">Gampaha</option>
                                                    <option value="Kandy">Kandy</option>
                                                    <option value="Galle">Galle</option>
                                                    <option value="Negombo">Negombo</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Changes Bottom */}
                                    <div className="form-bottom-actions">
                                        <button type="button" className="btn-outline" onClick={() => navigate('/client/dashboard')}>❌ Cancel</button>
                                        <button type="submit" className="btn-primary">💾 Save Changes</button>
                                    </div>
                                </form>

                                {/* 5. Client Account Settings & Security */}
                                <div className="profile-form-card security-card">
                                    <div className="card-header">
                                        <Lock size={20} className="text-primary" />
                                        <h3>Account Settings & Security</h3>
                                    </div>

                                    <form onSubmit={handleUpdatePassword} className="security-form">
                                        <h4 className="sub-title">Change Password</h4>
                                        <div className="form-grid">
                                            <div className="form-group span-2">
                                                <label>Current Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword.current ? 'text' : 'password'}
                                                        name="current"
                                                        value={passwords.current}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Enter current password"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => togglePasswordVisibility('current')}>
                                                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group flex-1">
                                                <label>New Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword.new ? 'text' : 'password'}
                                                        name="new"
                                                        value={passwords.new}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Enter new password"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => togglePasswordVisibility('new')}>
                                                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group flex-1">
                                                <label>Confirm Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword.confirm ? 'text' : 'password'}
                                                        name="confirm"
                                                        value={passwords.confirm}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Confirm new password"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => togglePasswordVisibility('confirm')}>
                                                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-outline-primary mt-4">Update Password</button>
                                    </form>

                                    {/* Notifications Toggle (Optional modern feature) */}
                                    <div className="notifications-toggle-section">
                                        <h4 className="sub-title">Notifications</h4>
                                        <div className="toggle-list">
                                            <div className="toggle-item" onClick={() => handleToggleNotify('orders')}>
                                                <div className="t-info">
                                                    <p className="t-name">Deal Expiry Alerts</p>
                                                    <p className="t-desc">Get notified when a deal is about to expire</p>
                                                </div>
                                                <div className={`modern-toggle ${notifications.orders ? 'active' : ''}`}></div>
                                            </div>
                                            <div className="toggle-item" onClick={() => handleToggleNotify('messages')}>
                                                <div className="t-info">
                                                    <p className="t-name">Approval Alerts</p>
                                                    <p className="t-desc">Get notified when admin approves your deal</p>
                                                </div>
                                                <div className={`modern-toggle ${notifications.messages ? 'active' : ''}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientProfile;

