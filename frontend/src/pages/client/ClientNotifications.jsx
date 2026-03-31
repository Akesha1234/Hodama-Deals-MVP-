import React, { useState } from 'react';
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
    Home,
    Check,
    CheckCheck,
    AlertTriangle,
    Info,
    Truck,
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

    // Mock Notifications Data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'Orders',
            title: 'New Order Received',
            message: 'Order #ORD12345 has been placed by Nimal Perera.',
            time: '2 minutes ago',
            isRead: false,
            actionText: 'View Order',
            actionLink: '/client/orders',
            icon: ShoppingBag,
            color: 'blue'
        },
        {
            id: 2,
            type: 'Alerts',
            title: 'Low Stock Alert',
            message: 'Wireless Headphones is running low on stock (Only 2 left).',
            time: '1 hour ago',
            isRead: false,
            actionText: 'Update Stock',
            actionLink: '/client/manage-deals',
            icon: AlertTriangle,
            color: 'yellow'
        },
        {
            id: 3,
            type: 'Orders',
            title: 'Order Delivered',
            message: 'Order #ORD12340 has been successfully delivered.',
            time: 'Yesterday at 3:45 PM',
            isRead: true,
            actionText: 'View Details',
            actionLink: '/client/orders',
            icon: Truck,
            color: 'green'
        },
        {
            id: 4,
            type: 'Products',
            title: 'Product Approved',
            message: 'Your product "Smart Watch Series 8" has been approved and is now live.',
            time: 'Yesterday at 1:20 PM',
            isRead: true,
            actionText: 'View Product',
            actionLink: '/client/manage-deals',
            icon: Check,
            color: 'purple'
        },
        {
            id: 5,
            type: 'System',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur on March 15th from 2:00 AM to 4:00 AM.',
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

    const filters = ['All', 'Orders', 'Products', 'Alerts', 'System'];
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

                        {/* Header */}
                        <div className="notif-page-header">
                            <div className="notif-header-info">
                                <h1><Bell size={32} /> Notifications</h1>
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

