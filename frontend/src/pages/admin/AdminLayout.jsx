import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingBag,
    RefreshCw,
    Headphones,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Search,
    ChevronDown,
    ChevronRight,
    Warehouse,
    ClipboardList,
    Truck,
    MapPin,
    Paintbrush,
    LayoutGrid,
    Home
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const [expandedMenus, setExpandedMenus] = useState(['operations']); // Operations expanded by default

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Home Requests', path: '/admin/home-requests', icon: <Home size={20} /> },
        { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Manage Partners', path: '/admin/clients', icon: <Store size={20} /> },
        { name: 'Manage Deals', path: '/admin/manage-deals', icon: <Package size={20} /> },
        { name: 'Manage Categories', path: '/admin/categories', icon: <LayoutGrid size={20} /> },
        { name: 'Banner Promotions', path: '/admin/banners', icon: <ShoppingBag size={20} /> },
        { name: 'Design Requests', path: '/admin/design-requests', icon: <Paintbrush size={20} /> },
        { name: 'Customer Support', path: '/admin/support', icon: <Headphones size={20} /> },
        { name: 'Reports', path: '/admin/reports', icon: <BarChart3 size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    useEffect(() => {
        navItems.forEach(item => {
            if (item.subItems && item.subItems.some(sub => location.pathname === sub.path)) {
                if (!expandedMenus.includes(item.id)) {
                    setExpandedMenus(prev => [...prev, item.id]);
                }
            }
        });
    }, [location.pathname]);

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    return (
        <div className={`adlay-wrapper ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {/* Sidebar Navigation */}
            <aside className="adlay-sidebar">
                <div className="adlay-logo-container">
                    <img src="/logo-admin.png" alt="Hodama Deals" className="adlay-logo" onError={(e) => e.target.style.display = 'none'} />
                    <span className="adlay-logo-text">Admin Panel</span>
                </div>

                <nav className="adlay-nav">
                    {navItems.map((item) => (
                        <div key={item.name || item.id} className="adlay-nav-group">
                            {item.subItems ? (
                                <>
                                    <button
                                        className={`adlay-nav-link adlay-menu-parent ${expandedMenus.includes(item.id) ? 'expanded' : ''}`}
                                        onClick={() => toggleMenu(item.id)}
                                    >
                                        <span className="adlay-nav-icon">{item.icon}</span>
                                        <span className="adlay-nav-name">{item.name}</span>
                                        <span className="adlay-menu-arrow">
                                            {expandedMenus.includes(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </span>
                                    </button>
                                    <div className={`adlay-sub-menu ${expandedMenus.includes(item.id) ? 'open' : ''}`}>
                                        {item.subItems.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                to={sub.path}
                                                className={`adlay-sub-nav-link ${location.pathname === sub.path ? 'active' : ''}`}
                                            >
                                                <span className="adlay-sub-nav-icon">{sub.icon}</span>
                                                <span className="adlay-sub-nav-name">{sub.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`adlay-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="adlay-nav-icon">{item.icon}</span>
                                    <span className="adlay-nav-name">{item.name}</span>
                                </Link>
                            )}
                        </div>
                    ))}

                    <button className="adlay-nav-link adlay-logout mt-auto" onClick={() => {/* handle logout */ }}>
                        <span className="adlay-nav-icon"><LogOut size={20} /></span>
                        <span className="adlay-nav-name">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="adlay-main">
                {/* Top Navbar */}
                <header className="adlay-navbar">
                    <div className="adlay-nav-left">
                        <button className="adlay-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="adlay-search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Search for data, orders or users..." />
                        </div>
                    </div>

                    <div className="adlay-nav-right">
                        <button className="adlay-nav-btn">
                            <Bell size={20} />
                            <span className="adlay-badge">3</span>
                        </button>
                        <div className="adlay-user-profile">
                            <div className="adlay-user-info">
                                <span className="adlay-user-name">Hashni Rehana</span>
                                <span className="adlay-user-role">Super Admin</span>
                            </div>
                            <div className="adlay-user-avatar">HR</div>
                        </div>
                    </div>
                </header>

                <div className="adlay-content-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
