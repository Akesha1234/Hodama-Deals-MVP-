import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutGrid, 
    Tag, 
    Plus, 
    User, 
    LogOut, 
    Home,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './ClientSidebar.css';

const ClientSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        if (path === '/client/dashboard' && location.pathname === '/client/dashboard') return true;
        if (path !== '/client/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <aside className={`client-sidebar-new ${isOpen ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header-new">
                <div className="brand-logo-circle">
                    <img src="/logo2.png" alt="Hodama Deals" />
                </div>
                <button className="sidebar-mobile-close" onClick={toggleSidebar}>
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-nav-new">
                <button 
                    className={`nav-item-new ${isActive('/client/dashboard') ? 'active' : ''}`}
                    onClick={() => navigate('/client/dashboard')}
                >
                    <LayoutGrid size={22} className="nav-icon" />
                    <span>Dashboard</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/manage-deals') ? 'active' : ''}`}
                    onClick={() => navigate('/client/manage-deals')}
                >
                    <Tag size={22} className="nav-icon" />
                    <span>Manage Deals</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/add-deal') ? 'active' : ''}`}
                    onClick={() => navigate('/client/add-deal')}
                >
                    <Plus size={22} className="nav-icon" />
                    <span>Add New Deal</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/profile') ? 'active' : ''}`}
                    onClick={() => navigate('/client/profile')}
                >
                    <User size={22} className="nav-icon" />
                    <span>Profile & Store</span>
                </button>
            </nav>

            <div className="sidebar-footer-new">
                <button className="nav-item-new logout-item" onClick={handleLogout}>
                    <LogOut size={22} className="nav-icon" />
                    <span>Logout</span>
                </button>
                <button className="nav-item-new home-item" onClick={() => navigate('/')}>
                    <Home size={22} className="nav-icon" />
                    <span>Go to Home</span>
                </button>
            </div>
        </aside>
    );
};

export default ClientSidebar;
