import React, { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    Tag,
    Plus,
    User,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    Home,
    Eye,
    TrendingUp,
    BarChart,
    Clock,
    TrendingUp as ChartIcon,
    BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './ClientDashboard.css';

const ClientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const stats = [
        { label: 'Live Deals', value: '45', trend: '+5', icon: <Tag size={20} />, color: '#71717a' },
        { label: 'Deal Views', value: '128', trend: '+12%', icon: <Eye size={20} />, color: '#ed8936' },
        { label: 'Total Deals', value: '10', trend: '+5', icon: <BarChart3 size={20} />, color: '#48bb78' },
        { label: 'Active Promotions', value: '03', trend: 'Hot', icon: <Clock size={20} />, color: '#9f7aea' },
    ];

    const chartData = [
        { label: '1 Mar', value: 30 },
        { label: '2 Mar', value: 60 },
        { label: '3 Mar', value: 50 },
        { label: '4 Mar', value: 90 },
        { label: '5 Mar', value: 70 },
        { label: '6 Mar', value: 85 },
        { label: '7 Mar', value: 45 },
        { label: '8 Mar', value: 75 },
        { label: '9 Mar', value: 55 },
        { label: '10 Mar', value: 80 },
    ];

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                <div className="dashboard-view-container">

                    {/* Welcome Banner */}
                    <div className="welcome-banner fade-in">
                        <div className="welcome-info">
                            <h1>👋 Welcome back, {user?.name?.split(' ')[0] || 'John Deo'}</h1>
                            <p>Manage your deals and connect with potential customers.</p>
                        </div>
                        <div className="today-summary">
                            <span className="label">Today's Deal Clicks</span>
                            <span className="value">142</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="stats-container fade-in">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card">
                                <div className="stat-card-inner">
                                    <div className="stat-info">
                                        <p className="stat-label">{stat.label}</p>
                                        <h3 className="stat-value">{stat.value}</h3>
                                        <div className="stat-meta">
                                            <span className={`trend-indicator ${stat.trend === 'Hot' ? 'hot' : 'positive'}`}>
                                                {stat.trend}
                                            </span>
                                            <span className="meta-text">performance</span>
                                        </div>
                                    </div>
                                    <div className="stat-icon-box" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-grid-main fade-in">
                        {/* Analytics Section */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <h3>Deal Views Over Time</h3>
                                <div className="chart-actions">
                                    <button className="chart-tab active">Daily</button>
                                    <button className="chart-tab">Weekly</button>
                                </div>
                            </div>
                            <div className="chart-box">
                                <div className="chart-viz">
                                    {chartData.map((data, i) => (
                                        <div key={i} className="chart-bar-wrapper">
                                            <div className="chart-bar" style={{ height: `${data.value}%` }}></div>
                                            <span className="bar-label">{data.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions-section">
                            <h3>Quick Actions</h3>
                            <div className="actions-grid">
                                <div className="action-tile" onClick={() => navigate('/client/add-deal')}>
                                    <div className="tile-icon p-bg"><Plus size={20} /></div>
                                    <span>Add Deal</span>
                                </div>
                                <div className="action-tile" onClick={() => navigate('/client/manage-deals')}>
                                    <div className="tile-icon y-bg"><Tag size={20} /></div>
                                    <span>Manage Deals</span>
                                </div>
                                <div className="action-tile" onClick={() => navigate('/client/profile')}>
                                    <div className="tile-icon g-bg"><User size={20} /></div>
                                    <span>Profile</span>
                                </div>
                                <div className="action-tile" onClick={() => navigate('/client/notifications')}>
                                    <div className="tile-icon pur-bg"><Bell size={20} /></div>
                                    <span>Notifications</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid-sub fade-in">
                        {/* Latest Live Deals */}
                        <div className="recent-deals-card">
                            <div className="section-header">
                                <h3>Latest Live Deals</h3>
                                <button className="text-btn" onClick={() => navigate('/client/manage-deals')}>View All</button>
                            </div>
                            <table className="client-table">
                                <thead>
                                    <tr>
                                        <th>DEAL REF</th>
                                        <th>DEAL TITLE</th>
                                        <th>CATEGORY</th>
                                        <th>PRICE</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#DL1054</td>
                                        <td>
                                            <div className="deal-cell">
                                                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop" alt="Deal" className="deal-thumb" />
                                                <span>MID WEEK SPECIALS</span>
                                            </div>
                                        </td>
                                        <td>Restaurant</td>
                                        <td>Total Bill: 25% OFF</td>
                                        <td><span className="badge active">Active</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Top Performing Deals */}
                        <div className="top-selling-card">
                            <div className="section-header">
                                <h3>Highest Performing Deals</h3>
                            </div>
                            <div className="top-products-list">
                                <div className="top-product-item">
                                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop" alt="Deal" />
                                    <div className="tp-info">
                                        <span className="tp-name">FLASH SALE ALERT!</span>
                                        <span className="tp-sold">Grab Clicks: 624</span>
                                    </div>
                                    <div className="tp-growth-badge">
                                        <TrendingUp size={14} /> +15%
                                    </div>
                                </div>
                                <div className="top-product-item">
                                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop" alt="Deal" />
                                    <div className="tp-info">
                                        <span className="tp-name">MID WEEK SPECIALS</span>
                                        <span className="tp-sold">Grab Clicks: 456</span>
                                    </div>
                                    <div className="tp-growth-badge">
                                        <TrendingUp size={14} /> +8%
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

export default ClientDashboard;

