import React, { useState } from 'react';
import {
    LayoutDashboard,
    Tag,
    User,
    LogOut,
    Bell,
    MessageSquare,
    Search,
    Plus,
    Menu,
    X,
    Home,
    Check,
    CheckCheck,
    Clock,
    TrendingUp,
    CheckCircle2,
    Info,
    ChevronRight,
    Circle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './ClientNotifications.css';

const ClientNotifications = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    // Mock Notifications Data - Rebranded for Deal Metrics (No Orders/Delivery)
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'Performance',
            title: 'Deal Click Spike!',
            message: 'Your deal "Smart Watch Series 8" has received 50+ clicks in the last hour.',
            time: '2 minutes ago',
            isRead: false,
            actionText: 'View Stats',
            actionLink: '/client/dashboard',
            icon: TrendingUp,
            color: 'blue'
        },
        {
            id: 2,
            type: 'Alerts',
            title: 'Approval Pending',
            message: 'Your new deal submission "Organic Tea Hamper" is currently being reviewed by admin.',
            time: '1 hour ago',
            isRead: false,
            actionText: 'Manage Deals',
            actionLink: '/client/manage-deals',
            icon: Clock,
            color: 'yellow'
        },
        {
            id: 3,
            type: 'Performance',
            title: 'Trending Deal',
            message: 'Congratulations! Your deal "Summer Sunglasses Collection" is currently trending on the homepage.',
            time: 'Yesterday at 3:45 PM',
            isRead: true,
            actionText: 'View Dashboard',
            actionLink: '/client/dashboard',
            icon: CheckCircle2,
            color: 'green'
        },
        {
            id: 4,
            type: 'Deals',
            title: 'Deal Approved',
            message: 'Your deal "Professional DSLR Camera" has been approved and is now live for customers.',
            time: 'Yesterday at 1:20 PM',
            isRead: true,
            actionText: 'View Deal',
            actionLink: '/client/manage-deals',
            icon: Check,
            color: 'purple'
        },
        {
            id: 5,
            type: 'System',
            title: 'System Optimization',
            message: 'We have optimized the Deal Dashboard for faster performance and better analytics.',
            time: '2 days ago',
            isRead: true,
            actionText: '',
            actionLink: '',
            icon: Info,
            color: 'gray'
        }
    ]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filters = ['All', 'Deals', 'Performance', 'Alerts', 'System'];
    const filteredNotifications = activeFilter === 'All'
        ? notifications
        : notifications.filter(n => n.type === activeFilter);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                <div className="dashboard-view-container notifications-scroll-container">
                    <div className="notifications-wrapper fade-in">
                        
                        {/* Breadcrumb */}
                        <div className="mp-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Notifications</span>
                        </div>

                        {/* Page Header */}
                        <div className="notif-page-header">
                            <div className="notif-header-info">
                                <h1><Bell size={28} /> Notifications</h1>
                                <p>Stay updated with your store activities and important alerts.</p>
                                {unreadCount > 0 && (
                                    <div className="notif-count-badge">You have {unreadCount} new notifications</div>
                                )}
                            </div>
                            <div className="notif-header-actions">
                                <button className="btn-mark-all" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                                    <CheckCheck size={18} />
                                    Mark All as Read
                                </button>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="notif-filter-bar">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    className={`n-filter-tab ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Notifications List */}
                        <div className="notifications-list">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(notif => {
                                    const Icon = notif.icon;
                                    return (
                                        <div key={notif.id} className={`notification-card ${!notif.isRead ? 'unread' : ''}`}>
                                            {!notif.isRead && <div className="unread-dot"><Circle size={10} fill="currentColor" /></div>}

                                            <div className={`n-icon n-icon-${notif.color}`}>
                                                <Icon size={20} />
                                            </div>

                                            <div className="n-content">
                                                <div className="n-top-row">
                                                    <h4>{notif.title}</h4>
                                                    <span className="n-time">{notif.time}</span>
                                                </div>
                                                <p className="n-message">{notif.message}</p>

                                                <div className="n-actions">
                                                    {notif.actionText && (
                                                        <button
                                                            className="n-btn-primary"
                                                            onClick={() => navigate(notif.actionLink)}
                                                        >
                                                            {notif.actionText}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="n-card-actions">
                                                {!notif.isRead && (
                                                    <button
                                                        className="n-action-icon text-muted"
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                        title="Mark as Read"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    className="n-action-icon text-danger"
                                                    onClick={() => deleteNotification(notif.id)}
                                                    title="Delete"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="empty-notifications">
                                    <div className="empty-icon">
                                        <Bell size={48} className="text-gray-300" />
                                    </div>
                                    <h3>No notifications yet</h3>
                                    <p>You will receive updates about your store here.</p>
                                    <button className="btn-back-dash" onClick={() => navigate('/client/dashboard')}>
                                        Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientNotifications;

