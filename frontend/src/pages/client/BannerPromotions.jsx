import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Image as ImageIcon, 
    Upload, 
    Send, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Info, 
    ChevronRight,
    LayoutDashboard,
    Plus,
    Palette,
    MessageSquare,
    X,
    UploadCloud
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './BannerPromotions.css';

const BannerPromotions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Design Support States
    const [isDesignSupportOpen, setIsDesignSupportOpen] = useState(false);
    const [designDetails, setDesignDetails] = useState('');
    const [designFiles, setDesignFiles] = useState([]);

    // Form States
    const [promotionType, setPromotionType] = useState('submission'); // 'submission' or 'request'
    const [description, setDescription] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Requests State
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = () => {
            const stored = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
            setRequests(stored);
        };
        fetchRequests();

        const handleStorage = (e) => {
            if (e.key === 'hodama_banner_requests_v1') {
                fetchRequests();
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newRequest = {
            id: `BR${Math.floor(1000 + Math.random() * 9000)}`,
            type: promotionType === 'submission' ? 'Banner Submission' : 'Design Request',
            description,
            image: promotionType === 'submission' ? bannerImage : null,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString()
        };

        const updatedRequests = [newRequest, ...requests];
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updatedRequests));
        
        // Mock delay
        setTimeout(() => {
            setRequests(updatedRequests);
            setIsSubmitting(false);
            setDescription('');
            setBannerImage(null);
            alert('Request submitted successfully! Admin will review it soon.');
        }, 1000);
    };

    const handleDesignSupportSubmit = (e) => {
        e.preventDefault();
        const existingTickets = JSON.parse(localStorage.getItem('hodamaAdminSupportTickets_v3') || '[]');
        const newTicket = {
            id: 'TCK' + Math.floor(1000 + Math.random() * 9000),
            user: user?.name || 'Client',
            email: user?.email || 'client@hodamadeals.lk',
            type: 'Design Team Support',
            message: designDetails,
            status: 'Open',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            attachment: designFiles.length > 0 ? `${designFiles.length} file(s)` : null,
        };
        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify([newTicket, ...existingTickets]));
        
        // Also add to banner requests if needed, but it's already a support ticket logic
        // For visibility, let's also add it to banner requests pool
        const bannerReq = {
            id: `BR-DS-${Math.floor(1000 + Math.random() * 9000)}`,
            type: 'Design Request (via Support)',
            description: designDetails,
            image: null,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify([bannerReq, ...requests]));
        setRequests([bannerReq, ...requests]);

        alert('Your design request has been sent! Our team will handle the rest.');
        setIsDesignSupportOpen(false);
        setDesignDetails('');
        setDesignFiles([]);
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />
                
                <div className="dashboard-view-container mp-scroll-container">
                    <div className="mp-wrapper fade-in">
                        
                        {/* Breadcrumb */}
                        <div className="mp-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Banner Promotions</span>
                        </div>

                        {/* Page Header */}
                        <div className="mp-page-header">
                            <div>
                                <h1><ImageIcon size={28} /> Banner Promotions</h1>
                                <p>Boost your visibility by placing professional banners on our homepage.</p>
                            </div>
                        </div>

                        {/* Design Team Support CTA - Moved from Add Deals */}
                        <div 
                            className="bp-design-support-cta" 
                            onClick={() => setIsDesignSupportOpen(true)}
                            style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', 
                                padding: '20px 30px', backgroundColor: '#f0f9ff', border: '1px dashed #3b82f6', 
                                borderRadius: '16px', marginBottom: '30px', cursor: 'pointer',
                                transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.1)',
                                marginTop: '10px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ backgroundColor: '#bfdbfe', padding: '14px', borderRadius: '50%', color: '#1d4ed8' }}>
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 6px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: '700' }}>
                                        I need help managing my deals (Design Team Support)
                                    </h4>
                                    <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px', opacity: 0.9 }}>
                                        Don't have time to create banners or fill forms? Send us your raw details and photos, and we'll design and publish it for you!
                                    </p>
                                </div>
                            </div>
                            <button style={{ backgroundColor: '#1d4ed8', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '15px' }}>
                                Request Support
                            </button>
                        </div>

                        <div className="bp-grid">
                            {/* Form Section */}
                            <div className="bp-form-card">
                                <h3><Plus size={20} /> Submit Your Banner</h3>
                                <p className="bp-form-intro">Upload your pre-designed banner here to be featured on our homepage Carousel.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mp-form-group">
                                        <label>Banner Title / Placement Note</label>
                                        <input 
                                            type="text"
                                            className="mp-form-input"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="e.g. Summer Sale Banner - Top Carousel"
                                            required
                                        />
                                    </div>

                                    <div className="mp-form-group">
                                        <label>Upload Banner Image</label>
                                        <div className="bp-upload-box" onClick={() => document.getElementById('banner-input').click()}>
                                            {bannerImage ? (
                                                <img src={bannerImage} alt="Preview" className="bp-preview" />
                                            ) : (
                                                <div className="bp-upload-placeholder">
                                                    <ImageIcon size={40} />
                                                    <span>Click to upload banner</span>
                                                    <small>Recommended size: 1200 x 400px (PNG, JPG)</small>
                                                </div>
                                            )}
                                            <input 
                                                id="banner-input"
                                                type="file" 
                                                hidden 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="bp-btn-submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Banner for Review</>}
                                    </button>
                                </form>
                            </div>

                            {/* Status Tracking Section */}
                            <div className="bp-status-card">
                                <h3><Clock size={20} /> Promotion Status</h3>
                                <div className="bp-status-list">
                                    {requests.length === 0 && (
                                        <div className="bp-empty-state">
                                            <Info size={40} />
                                            <p>No active promotion requests found.</p>
                                        </div>
                                    )}
                                    {requests.map(req => (
                                        <div key={req.id} className="bp-request-item">
                                            <div className="bp-request-header">
                                                <span className="bp-req-id">{req.id}</span>
                                                <span className={`bp-status-badge ${req.status.toLowerCase()}`}>
                                                    {req.status === 'Pending' && <Clock size={12} />}
                                                    {req.status === 'Approved' && <CheckCircle2 size={12} />}
                                                    {req.status === 'Rejected' && <XCircle size={12} />}
                                                    {req.status}
                                                </span>
                                            </div>
                                            <div className="bp-request-body">
                                                <div className="bp-req-type">
                                                    {req.type === 'Banner Submission' ? <Upload size={14} /> : <Palette size={14} />}
                                                    {req.type}
                                                </div>
                                                <p className="bp-req-desc">{req.description}</p>
                                                <span className="bp-req-date">{req.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Design Support Modal */}
            {isDesignSupportOpen && (
                <div className="ap-modal-overlay" onClick={() => setIsDesignSupportOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
                    <div className="ap-modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '20px', width: '600px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', fontWeight: '700' }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '10px', borderRadius: '10px', color: '#3b82f6' }}><Palette size={24} /></div>
                                Design Team Support
                            </h3>
                            <button onClick={() => setIsDesignSupportOpen(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '50%', color: '#64748b', transition: 'all 0.2s' }}><X size={20} /></button>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6' }}>
                            Skip the hard work! Upload your raw photos and info. Our designers will create high-quality banners and publish them for you.
                        </p>
                        <form onSubmit={handleDesignSupportSubmit}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: '#334155' }}>Deal Details & Instructions</label>
                                <textarea 
                                    required
                                    value={designDetails}
                                    onChange={e => setDesignDetails(e.target.value)}
                                    placeholder="Tell us about the deal, prices, and any specific preferences..."
                                    style={{ width: '100%', height: '140px', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', resize: 'none', fontSize: '15px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: '#334155' }}>Raw Images / Logos</label>
                                <div style={{ border: '2px dashed #cbd5e1', padding: '40px 20px', textAlign: 'center', borderRadius: '12px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                    <input 
                                        type="file" 
                                        multiple 
                                        onChange={e => setDesignFiles(Array.from(e.target.files))}
                                        style={{ display: 'none' }}
                                        id="raw-files-bp"
                                    />
                                    <label htmlFor="raw-files-bp" style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}><UploadCloud size={32} /></div>
                                        <span>Click to browse files (Photos, Logos, Docs)</span>
                                    </label>
                                    {designFiles.length > 0 && (
                                        <div style={{ marginTop: '20px', fontSize: '15px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <CheckCircle2 size={20} /> {designFiles.length} file(s) selected
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '18px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '17px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                Send Request to Design Team
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerPromotions;
