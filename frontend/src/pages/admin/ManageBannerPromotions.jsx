import React, { useState, useEffect } from 'react';
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Search, 
    Eye, 
    Check, 
    X,
    Filter,
    Calendar,
    ArrowUpRight,
    Image as ImageIcon
} from 'lucide-react';
import './ManageBannerPromotions.css';

const ManageBannerPromotions = () => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
        setRequests(stored);
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = requests.map(req => 
            req.id === id ? { ...req, status: newStatus } : req
        );
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        setRequests(updated);
        setSelectedBanner(null);
        alert(`Banner request ${newStatus} successfully!`);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            req.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="mbp-admin-wrapper">
            <header className="mbp-header">
                <div>
                    <h1><ShoppingBag size={28} /> Banner Promotions</h1>
                    <p>Review and manage partner banner submissions for the homepage.</p>
                </div>
            </header>

            <div className="mbp-stats">
                <div className="mbp-stat-card">
                    <span className="label">Total Submissions</span>
                    <span className="value">{requests.length}</span>
                </div>
                <div className="mbp-stat-card pending">
                    <span className="label">Pending Review</span>
                    <span className="value">{requests.filter(r => r.status === 'Pending').length}</span>
                </div>
                <div className="mbp-stat-card approved">
                    <span className="label">Live on Home</span>
                    <span className="value">{requests.filter(r => r.status === 'Approved').length}</span>
                </div>
            </div>

            <div className="mbp-controls">
                <div className="mbp-search">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mbp-filter">
                    <Filter size={18} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="mbp-table-card">
                <table className="mbp-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id}>
                                <td className="font-bold">{req.id}</td>
                                <td>
                                    <span className="type-tag">{req.type}</span>
                                </td>
                                <td>
                                    <div className="desc-cell">{req.description}</div>
                                </td>
                                <td>{req.date}</td>
                                <td>
                                    <span className={`status-tag ${req.status.toLowerCase()}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button className="view-btn" onClick={() => setSelectedBanner(req)}>
                                        <Eye size={18} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-400">No banner requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {selectedBanner && (
                <div className="mbp-modal-overlay" onClick={() => setSelectedBanner(null)}>
                    <div className="mbp-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="mbp-modal-header">
                            <h3>Review Banner Submission</h3>
                            <button className="close-btn" onClick={() => setSelectedBanner(null)}><X size={20} /></button>
                        </div>
                        <div className="mbp-modal-body">
                            <div className="req-meta">
                                <span><strong>ID:</strong> {selectedBanner.id}</span>
                                <span><strong>Date:</strong> {selectedBanner.date}</span>
                            </div>
                            <div className="banner-preview-box">
                                {selectedBanner.image ? (
                                    <img src={selectedBanner.image} alt="Banner Preview" className="full-preview" />
                                ) : (
                                    <div className="no-image">
                                        <ImageIcon size={48} />
                                        <p>No image attached (Design Request)</p>
                                    </div>
                                )}
                            </div>
                            <div className="info-section">
                                <label>Description / Instruction</label>
                                <p>{selectedBanner.description}</p>
                            </div>
                        </div>
                        <div className="mbp-modal-footer">
                            {selectedBanner.status === 'Pending' && (
                                <>
                                    <button className="reject-btn" onClick={() => updateStatus(selectedBanner.id, 'Rejected')}>
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button className="approve-btn" onClick={() => updateStatus(selectedBanner.id, 'Approved')}>
                                        <CheckCircle2 size={18} /> Approve & Go Live
                                    </button>
                                </>
                            )}
                            {selectedBanner.status !== 'Pending' && (
                                <button className="reset-btn" onClick={() => updateStatus(selectedBanner.id, 'Pending')}>
                                    Reset to Pending
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBannerPromotions;
