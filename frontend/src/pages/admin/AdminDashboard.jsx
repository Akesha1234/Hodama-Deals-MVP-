import React, { useState } from 'react';
import {
    Users,
    Store,
    Package,
    ShoppingBag,
    TrendingUp,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    Bell,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'order', 'client', 'ticket', 'return'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Local state for approval simulation
    const [localClients, setLocalClients] = useState([
        { name: 'Amal', store: 'Amal Store', date: 'May 10', status: 'Pending', email: 'amal@store.com', phone: '+94 77 121 2121', city: 'Colombo' },
        { name: 'Bimal', store: 'Bimal Gadgets', date: 'May 12', status: 'Approved', email: 'bimal@gadgets.lk', phone: '+94 71 333 4444', city: 'Kandy' },
        { name: 'Nuwan', store: 'Nuwan Tech', date: 'May 15', status: 'Pending', email: 'nuwan@tech.lk', phone: '+94 76 555 6666', city: 'Galle' }
    ]);
    // Mock Data for statistics
    const stats = [
        { label: 'Total Users', value: '1,250', trend: '+12%', isUp: true, icon: <Users size={24} />, color: '#143ae6' },
        { label: 'Verified Partners', value: '320', trend: '+5%', isUp: true, icon: <Store size={24} />, color: '#7c3aed' },
        { label: 'Active Deals', value: '4,560', trend: '+8%', isUp: true, icon: <Package size={24} />, color: '#10b981' },
        { label: 'Marketplace Clicks', value: '12,340', trend: '+15%', isUp: true, icon: <ShoppingBag size={24} />, color: '#f59e0b' },
        { label: 'Partner Revenue', value: 'Rs 3,250,000', trend: '+20%', isUp: true, icon: <TrendingUp size={24} />, color: '#071356' },
        { label: 'Daily Deal Limit', value: '500', trend: 'Stable', isUp: true, icon: <RefreshCw size={24} />, color: '#6366f1' }
    ];

    const dealOverview = [
        { label: 'Pending Approval', count: 45, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Active Deals', count: 3200, color: '#143ae6', bg: '#eff6ff' },
        { label: 'Expired', count: 85, color: '#7c3aed', bg: '#f5f3ff' },
        { label: 'Featured', count: 12, color: '#10b981', bg: '#f0fdf4' }
    ];

    const recentPartners = [
        { id: 'PRT1023', partner: 'Amal', store: 'Amal Store', category: 'Electronics', location: 'Colombo', status: 'Pending', date: '10 Mar 2026' },
        { id: 'PRT1024', partner: 'Bimal', store: 'Bimal Gadgets', category: 'Tech', location: 'Kandy', status: 'Approved', date: '09 Mar 2026' },
    ];

    const recentClients = [
        { name: 'Amal', store: 'Amal Store', date: 'May 10', status: 'Pending' },
        { name: 'Bimal', store: 'Bimal Gadgets', date: 'May 12', status: 'Approved' },
        { name: 'Nuwan', store: 'Nuwan Tech', date: 'May 15', status: 'Pending' }
    ];

    const topDeals = [
        { name: 'Headphones Promo', partner: 'TechStore', clicks: 3400, savings: 'Rs 500k', rating: 4.8 },
        { name: 'Smart Watch Offer', partner: 'GadgetHub', clicks: 2100, savings: 'Rs 800k', rating: 4.5 },
        { name: 'Sunglasses Deal', partner: 'FashionHub', clicks: 1800, savings: 'Rs 200k', rating: 4.7 }
    ];

    const supportTickets = [
        { id: 'TCK102', user: 'Nimal', issue: 'Broken Deal Link', status: 'Open', date: '10 Mar' },
        { id: 'TCK103', user: 'Sunil', issue: 'Misleading Price', status: 'Pending', date: '09 Mar' },
        { id: 'TCK104', user: 'Kamal', issue: 'Account hacked', status: 'Resolved', date: '08 Mar' }
    ];

    const verificationRequests = [
        { id: 'VER102', partnerId: 'PRT1023', deal: 'iPhone 14 Promo', partner: 'Amal', status: 'Pending' },
        { id: 'VER103', partnerId: 'PRT1010', deal: 'Samsung S23 Deal', partner: 'Nuwan', status: 'Action Required' }
    ];

    const notifications = [
        { id: 1, title: 'New Partner Request', desc: 'Amal Store is waiting for verification', time: '10 mins ago', type: 'client' },
        { id: 3, title: 'System Healthy', desc: 'All services are running smoothly', time: '1 hour ago', type: 'system' }
    ];

    const handleViewItem = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleApproveClient = (name) => {
        setLocalClients(prev => prev.map(s => s.name === name ? { ...s, status: 'Approved' } : s));
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Report exported successfully!');
        }, 1500);
    };

    return (
        <div className="adash-wrapper animate-fade-in">
            {/* 1. Page Header */}
            <div className="adash-header">
                <div className="adash-header-left">
                    <h1 className="adash-title">Admin Dashboard</h1>
                    <p className="adash-subtitle">Overview of your marketplace performance and system activities</p>
                </div>
                <div className="adash-header-right">
                    <div className="adash-actions">
                        <button className="adash-btn-filter"><Filter size={18} /> Last 30 Days</button>
                        <button
                            className={`adash-btn-primary ${isExporting ? 'loading' : ''}`}
                            onClick={handleExport}
                            disabled={isExporting}
                        >
                            {isExporting ? <RefreshCw size={18} className="spin" /> : <Download size={18} />}
                            {isExporting ? 'Exporting...' : 'Export Report'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Summary Cards Section */}
            <div className="adash-stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="adash-stat-card">
                        <div className="adash-stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="adash-stat-info">
                            <span className="adash-stat-value">{stat.value}</span>
                            <span className="adash-stat-label">{stat.label}</span>
                        </div>
                        <div className={`adash-stat-trend ${stat.isUp ? 'up' : 'down'}`}>
                            {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="adash-main-content">
                <div className="adash-left-column">
                    {/* 3. Sales Analytics Chart (Placeholder Container) */}
                    <div className="adash-card adash-sales-chart-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Sales Analytics Overview</h3>
                            <div className="adash-chart-tabs">
                                <button className="active">Clicks</button>
                                <button>Engagement</button>
                                <button>Partner Growth</button>
                            </div>
                        </div>
                        <div className="adash-chart-placeholder">
                            {/* In a real app, integrate Recharts or Chart.js here */}
                            <div className="adash-bar-chart">
                                {[40, 65, 45, 90, 60, 85, 55, 75, 40, 65, 80, 50].map((h, i) => (
                                    <div key={i} className="adash-bar-wrapper">
                                        <div className="adash-bar" style={{ height: `${h}%`, backgroundColor: i === 6 ? '#143ae6' : '#e2e8f0' }}></div>
                                        <span className="adash-bar-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. Deal Overview Section */}
                    <div className="adash-orders-overview-grid">
                        {dealOverview.map((item, idx) => (
                            <div key={idx} className="adash-order-type-card" style={{ backgroundColor: item.bg }}>
                                <div className="adash-order-count" style={{ color: item.color }}>{item.count}</div>
                                <div className="adash-order-label">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 5. Recent Partners Table */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Pending Partner Verifications</h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/partners')}>View All Partners</button>
                        </div>
                        <div className="adash-table-container">
                            <table className="adash-table">
                                <thead>
                                    <tr>
                                        <th>Partner ID</th>
                                        <th>Store / Contact</th>
                                        <th>Category</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPartners.map((partner, idx) => (
                                        <tr key={idx}>
                                            <td className="adash-td-id">{partner.id}</td>
                                            <td>
                                                <div className="adash-td-dual">
                                                    <span className="adash-td-primary">{partner.store}</span>
                                                    <span className="adash-td-secondary">{partner.partner}</span>
                                                </div>
                                            </td>
                                            <td className="adash-val-bold">{partner.category}</td>
                                            <td className="adash-val-bold">{partner.location}</td>
                                            <td>
                                                <span className={`adash-status-pill ${partner.status.toLowerCase()}`}>
                                                    {partner.status}
                                                </span>
                                            </td>
                                            <td>{partner.date}</td>
                                            <td>
                                                <button className="adash-btn-icon" onClick={() => handleViewItem(partner, 'partner')}><Eye size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 7. Top Deals */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Top Performing Deals</h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/inventory')}>Marketplace Insights</button>
                        </div>
                        <div className="adash-table-container">
                            <table className="adash-table">
                                <thead>
                                    <tr>
                                        <th>Deal Name</th>
                                        <th>Partner</th>
                                        <th>Clicks</th>
                                        <th>Est. Savings</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topDeals.map((deal, idx) => (
                                        <tr key={idx}>
                                            <td className="adash-val-bold">{deal.name}</td>
                                            <td>{deal.partner}</td>
                                            <td>{deal.clicks} Clicks</td>
                                            <td className="adash-price">{deal.savings}</td>
                                            <td>⭐ {deal.rating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="adash-right-column">
                    {/* 10. Notifications Section */}
                    <div className="adash-card adash-sticky-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title"><Bell size={20} color="#143ae6" /> System Alerts</h3>
                            <span className="adash-badge-num">3 New</span>
                        </div>
                        <div className="adash-notif-list">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="adash-notif-item">
                                    <div className={`adash-notif-icon ${notif.type}`}>
                                        {notif.type === 'client' && <Store size={16} />}
                                        {notif.type === 'return' && <RefreshCw size={16} />}
                                        {notif.type === 'system' && <CheckCircle size={16} />}
                                    </div>
                                    <div className="adash-notif-body">
                                        <h4 className="adash-notif-title">{notif.title}</h4>
                                        <p className="adash-notif-desc">{notif.desc}</p>
                                        <span className="adash-notif-time">{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="adash-btn-notif-all" onClick={() => navigate('/admin/support')}>View All Notifications</button>
                    </div>

                    {/* 6. Recent Partner Section */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">New Partner Registrations</h3>
                        </div>
                        <div className="adash-client-list">
                            {localClients.map((client, idx) => (
                                <div key={idx} className="adash-client-item">
                                    <div className="adash-client-info" onClick={() => handleViewItem(client, 'partner')} style={{ cursor: 'pointer' }}>
                                        <h4>{client.store}</h4>
                                        <p>{client.name} • {client.date}</p>
                                    </div>
                                    <div className="adash-client-actions">
                                        {client.status === 'Pending' ? (
                                            <button className="adash-btn-approve" onClick={() => handleApproveClient(client.name)}>Approve</button>
                                        ) : (
                                            <span className="adash-status-approved">Verified</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 8. Recent Support Tickets */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Support Tickets</h3>
                        </div>
                        <div className="adash-ticket-list">
                            {supportTickets.map((ticket, idx) => (
                                <div key={idx} className="adash-ticket-item" onClick={() => handleViewItem(ticket, 'ticket')} style={{ cursor: 'pointer' }}>
                                    <div className="adash-ticket-main">
                                        <h4 className="adash-val-bold">{ticket.issue}</h4>
                                        <p>{ticket.user} • {ticket.id}</p>
                                    </div>
                                    <span className={`adash-status-pill ${ticket.status.toLowerCase()}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 9. Deal Verification Queue */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Deal Verification Queue</h3>
                        </div>
                        <div className="adash-return-list">
                            {verificationRequests.map((req, idx) => (
                                <div key={idx} className="adash-return-item">
                                    <div className="adash-ret-info">
                                        <span className="adash-td-primary">{req.deal}</span>
                                        <span className="adash-td-secondary">{req.partner} • {req.id}</span>
                                    </div>
                                    <span className={`adash-status-pill ${req.status.toLowerCase().replace(' ', '-')}`}>
                                        {req.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {isModalOpen && (
                <div className="adash-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="adash-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="adash-modal-header">
                            <h3>{modalType?.toUpperCase()} DETAILS</h3>
                            <button className="adash-modal-close" onClick={() => setIsModalOpen(false)}><XCircle size={24} /></button>
                        </div>
                        <div className="adash-modal-body">
                            {modalType === 'client' && (
                                <div className="adash-details-view">
                                    <div className="detail-row"><span>Store Name:</span> <strong>{selectedItem.store}</strong></div>
                                    <div className="detail-row"><span>Client:</span> <strong>{selectedItem.name}</strong></div>
                                    <div className="detail-row"><span>Email:</span> <strong>{selectedItem.email}</strong></div>
                                    <div className="detail-row"><span>Phone:</span> <strong>{selectedItem.phone}</strong></div>
                                    <div className="detail-row"><span>City:</span> <strong>{selectedItem.city}</strong></div>
                                    <div className="detail-row"><span>Joined:</span> <strong>{selectedItem.date}</strong></div>
                                </div>
                            )}
                            {modalType === 'ticket' && (
                                <div className="adash-details-view">
                                    <div className="detail-row"><span>Ticket ID:</span> <strong>{selectedItem.id}</strong></div>
                                    <div className="detail-row"><span>User:</span> <strong>{selectedItem.user}</strong></div>
                                    <div className="detail-row"><span>Issue:</span> <strong>{selectedItem.issue}</strong></div>
                                    <div className="detail-row"><span>Date:</span> <strong>{selectedItem.date}</strong></div>
                                    <div className="detail-row"><span>Status:</span> <span className={`adash-status-pill ${selectedItem.status.toLowerCase()}`}>{selectedItem.status}</span></div>
                                </div>
                            )}
                        </div>
                        <div className="adash-modal-footer">
                            <button className="adash-btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                            {modalType === 'client' && selectedItem.status === 'Pending' && <button className="adash-btn-primary" onClick={() => { handleApproveClient(selectedItem.name); setIsModalOpen(false); }}>Approve Store</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
