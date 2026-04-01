import React, { useState, useEffect } from 'react';
import { 
    Home, 
    Search, 
    Filter, 
    CheckCircle, 
    XCircle, 
    Clock, 
    ExternalLink, 
    Calendar, 
    Tag, 
    Mail, 
    Store 
} from 'lucide-react';
import './AdminHomeRequests.css';

const AdminHomeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Fetch requests from localStorage
    const fetchRequests = () => {
        const stored = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
        setRequests(stored);
    };

    useEffect(() => {
        fetchRequests();
        window.addEventListener('storage', fetchRequests);
        return () => window.removeEventListener('storage', fetchRequests);
    }, []);

    const handleApprove = (email) => {
        // 1. Update requests status
        const updatedRequests = requests.map(r => r.ownerEmail === email ? { ...r, status: 'Approved' } : r);
        setRequests(updatedRequests);
        localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));

        // 2. Update global store list
        const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
        const updatedStores = storedStores.map(s => s.ownerEmail === email ? { ...s, status: 'Approved' } : s);
        localStorage.setItem('hodama_all_stores_v1', JSON.stringify(updatedStores));

        // 3. Update client profile
        const savedUser = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
        if (savedUser.email === email) {
            savedUser.homeRequestStatus = 'Approved';
            localStorage.setItem('hodama_client_user_v1', JSON.stringify(savedUser));
        }

        alert('Store listing approved for Home Page!');
    };

    const handleReject = (email) => {
        if(window.confirm('Are you sure you want to reject this request?')) {
            const updatedRequests = requests.map(r => r.ownerEmail === email ? { ...r, status: 'Rejected' } : r);
            setRequests(updatedRequests);
            localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));
            alert('Request rejected.');
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = (req.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (req.ownerEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        approved: requests.filter(r => r.status === 'Approved').length
    };

    return (
        <div className="ahr-page animate-fade-in">
            {/* Header Area */}
            <div className="ahr-header">
                <div className="ahr-header-left">
                    <h1>Home Page Listing Requests</h1>
                    <p>Review and manage stores that are requesting to be listed on the "Top Stores" section of the Home Page.</p>
                </div>
                <div className="ahr-stats">
                    <div className="ahr-stat-item">
                        <span className="ahr-stat-label">Total</span>
                        <strong className="ahr-stat-val">{stats.total}</strong>
                    </div>
                    <div className="ahr-stat-item">
                        <span className="ahr-stat-label">Pending</span>
                        <strong className="ahr-stat-val text-yellow">{stats.pending}</strong>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="ahr-controls">
                <div className="ahr-search">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Search store name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="ahr-filters">
                    <div className="ahr-filter-group">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Pending">Only Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="ahr-table-card">
                {filteredRequests.length === 0 ? (
                    <div className="ahr-empty">
                        <Home size={64} color="#e2e8f0" />
                        <h3>No Requests Found</h3>
                        <p>Adjust your filters or search terms to find what you are looking for.</p>
                    </div>
                ) : (
                    <div className="ahr-table-container">
                        <table className="ahr-table">
                            <thead>
                                <tr>
                                    <th>Store Details</th>
                                    <th>Link / URL</th>
                                    <th>Category</th>
                                    <th>Date Requested</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req, idx) => (
                                    <tr key={idx || req.ownerEmail}>
                                        <td>
                                            <div className="ahr-store-cell">
                                                <div className="ahr-store-logo">
                                                    <img src={req.img || "/assets/images/placeholder_store.png"} alt="Logo" />
                                                </div>
                                                <div className="ahr-store-info">
                                                    <span className="ahr-sn">{req.name}</span>
                                                    <span className="ahr-se"><Mail size={12}/> {req.ownerEmail}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {req.url ? (
                                                <a href={req.url} target="_blank" rel="noreferrer" className="ahr-link">
                                                    Visit Website <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <span className="ahr-no-link">No Link</span>
                                            )}
                                        </td>
                                        <td><span className="ahr-cat-pill">{req.category}</span></td>
                                        <td>
                                            <div className="ahr-date-cell">
                                                <Calendar size={14} /> {req.requestDate || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`ahr-status-chip ${req.status.toLowerCase()}`}>
                                                {req.status === 'Pending' && <Clock size={14} />}
                                                {req.status === 'Approved' && <CheckCircle size={14} />}
                                                {req.status === 'Rejected' && <XCircle size={14} />}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="ahr-actions">
                                                {req.status === 'Pending' && (
                                                    <>
                                                        <button className="ahr-btn-action approve" onClick={() => handleApprove(req.ownerEmail)} title="Approve Listing">
                                                            <CheckCircle size={18} /> Approve
                                                        </button>
                                                        <button className="ahr-btn-action reject" onClick={() => handleReject(req.ownerEmail)} title="Reject Listing">
                                                            <XCircle size={18} /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {req.status === 'Approved' && (
                                                    <span className="ahr-msg-success">Ready on Home Page</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHomeRequests;
