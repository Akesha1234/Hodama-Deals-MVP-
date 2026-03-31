import React, { useState, useEffect } from 'react';
import {
    Paintbrush,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Eye,
    MessageSquare,
    XCircle,
    ChevronLeft,
    ChevronRight,
    User,
    Mail,
    Phone,
    Paperclip,
    Send,
    Layers,
    UploadCloud,
    ExternalLink,
    TrendingUp,
    FileText,
    MoreVertical
} from 'lucide-react';
import './ManageDesignRequests.css';

const ManageDesignRequests = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'view', 'message', 'upload'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [replyText, setReplyText] = useState('');

    // Load data from support tickets specifically for Design
    const [requests, setRequests] = useState(() => {
        const saved = localStorage.getItem('hodamaAdminSupportTickets_v3');
        const allTickets = saved ? JSON.parse(saved) : [];
        return allTickets.filter(t => t.type === 'Design Team Support');
    });

    useEffect(() => {
        // When updating design requests locally, also update the main storage
        const saved = localStorage.getItem('hodamaAdminSupportTickets_v3');
        const allTickets = saved ? JSON.parse(saved) : [];
        const otherTickets = allTickets.filter(t => t.type !== 'Design Team Support');
        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify([...requests, ...otherTickets]));
    }, [requests]);

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Open').length,
        inProgress: requests.filter(r => r.status === 'In Progress').length,
        finished: requests.filter(r => r.status === 'Resolved' || r.status === 'Closed').length
    };

    const handleStatusChange = (id, newStatus) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedRequest && selectedRequest.id === id) {
            setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedRequest) return;
        const newReply = { sender: 'admin', text: replyText, date: 'Today' };
        const updatedHistory = [...(selectedRequest.history || []), newReply];
        setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, history: updatedHistory, status: 'In Progress' } : r));
        setSelectedRequest({ ...selectedRequest, status: 'In Progress', history: updatedHistory });
        setReplyText('');
    };

    return (
        <div className="mdsr-page-wrapper">
            {/* 1. Page Header */}
            <div className="mdsr-header">
                <div className="mdsr-header-left">
                    <h1 className="mdsr-title">Design Team Support</h1>
                    <p className="mdsr-subtitle">Manage graphic design requests, banner creation and deal setup tasks</p>
                </div>
                <div className="mdsr-header-right">
                    <div className="mdsr-active-badge">
                        <TrendingUp size={16} /> <span>Active Queue</span>
                    </div>
                </div>
            </div>

            {/* 2. Project Stats */}
            <div className="mdsr-stats-grid">
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-indigo"><Layers size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.total}</strong>
                        <span>Total Requests</span>
                    </div>
                </div>
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-amber"><Clock size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.pending}</strong>
                        <span>New Requests</span>
                    </div>
                </div>
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-blue"><Paintbrush size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.inProgress}</strong>
                        <span>Designing</span>
                    </div>
                </div>
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-emerald"><CheckCircle size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.finished}</strong>
                        <span>Finished</span>
                    </div>
                </div>
            </div>

            {/* 3. Controls */}
            <div className="mdsr-controls">
                <div className="mdsr-search">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search project name or partner..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="mdsr-filters">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Open">Pending</option>
                        <option value="In Progress">Designing</option>
                        <option value="Resolved">Finished</option>
                    </select>
                </div>
            </div>

            {/* 4. Requests List */}
            <div className="mdsr-list-card">
                <div className="mdsr-table-container">
                    <table className="mdsr-table">
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>Partner Name</th>
                                <th>Instructions Highlight</th>
                                <th>Deadline / Date</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.filter(r => (statusFilter === 'All' || r.status === statusFilter))
                                .filter(r => r.user.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((req) => (
                                <tr key={req.id}>
                                    <td className="mdsr-td-id">{req.id}</td>
                                    <td>
                                        <div className="mdsr-partner-info">
                                            <span className="p-name">{req.user}</span>
                                            <span className="p-email">{req.email}</span>
                                        </div>
                                    </td>
                                    <td><p className="mdsr-msg-snip">{req.message.substring(0, 50)}...</p></td>
                                    <td><span className="mdsr-date-tag">{req.date}</span></td>
                                    <td>
                                        <span className={`mdsr-status-pill ${req.status.toLowerCase().replace(' ', '-')}`}>
                                            {req.status === 'Open' ? 'New' : req.status === 'In Progress' ? 'Designing' : 'Finished'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="mdsr-actions">
                                            <button className="mdsr-btn-act" onClick={() => { setSelectedRequest(req); setActiveModal('view'); }}><Eye size={18} /></button>
                                            <button className="mdsr-btn-act chat" onClick={() => { setSelectedRequest(req); setActiveModal('message'); }}><MessageSquare size={18} /></button>
                                            <button className="mdsr-btn-act upload" onClick={() => { setSelectedRequest(req); setActiveModal('upload'); }}><UploadCloud size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'view' && selectedRequest && (
                <div className="mdsr-modal-ov" onClick={() => setActiveModal(null)}>
                    <div className="mdsr-modal-cn small" onClick={e => e.stopPropagation()}>
                        <header className="mdsr-modal-hr">
                            <h3>Design Project View</h3>
                            <button className="close-x" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                        </header>
                        <div className="mdsr-modal-br">
                            <div className="mdsr-project-header">
                                <div className="p-icon"><Paintbrush size={32} /></div>
                                <div className="p-title">
                                    <h4>Request from {selectedRequest.user}</h4>
                                    <span>Added on {selectedRequest.date} • {selectedRequest.id}</span>
                                </div>
                            </div>

                            <div className="mdsr-detail-item mt-4">
                                <label><FileText size={16} /> Partner Instructions</label>
                                <div className="p-bubble">{selectedRequest.message}</div>
                            </div>

                            {selectedRequest.attachment && (
                                <div className="mdsr-detail-item mt-3">
                                    <label><Paperclip size={16} /> Raw Materials / Logos</label>
                                    <div className="attach-box">
                                        <span>{selectedRequest.attachment}</span>
                                        <button className="btn-dl">Download</button>
                                    </div>
                                </div>
                            )}

                            <div className="mdsr-workflow-actions mt-5 pt-4">
                                <h4 className="w-title">Production Actions</h4>
                                <div className="w-grid">
                                    <button className="w-btn p" onClick={() => handleStatusChange(selectedRequest.id, 'In Progress')}>
                                        <Paintbrush size={16} /> Mark as "Designing"
                                    </button>
                                    <button className="w-btn s" onClick={() => setActiveModal('upload')}>
                                        <UploadCloud size={16} /> Upload Finished Work
                                    </button>
                                    <button className="w-btn o" style={{ gridColumn: 'span 2' }}>
                                        <ExternalLink size={16} /> Create Deal for Partner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'message' && selectedRequest && (
                <div className="mdsr-modal-ov" onClick={() => setActiveModal(null)}>
                    <div className="mdsr-modal-cn medium" onClick={e => e.stopPropagation()}>
                        <header className="mdsr-modal-hr">
                            <h3>Contact Partner</h3>
                            <button className="close-x" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                        </header>
                        <div className="mdsr-chat-view">
                            <div className="mdsr-history">
                                <div className="chat-bubble user">
                                    <div className="meta"><strong>{selectedRequest.user}</strong> <span>{selectedRequest.date}</span></div>
                                    <p>{selectedRequest.message}</p>
                                </div>
                                {selectedRequest.history?.map((msg, i) => (
                                    <div key={i} className={`chat-bubble ${msg.sender === 'admin' ? 'admin' : 'user'}`}>
                                        <div className="meta"><strong>{msg.sender === 'admin' ? 'Design Team' : selectedRequest.user}</strong> <span>{msg.date}</span></div>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mdsr-reply">
                                <textarea 
                                    placeholder="Type message to partner..." 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                                <div className="reply-btns">
                                    <button className="btn-attach"><Paperclip size={18} /></button>
                                    <button className="btn-send" onClick={handleSendReply}><Send size={18} /> Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeModal === 'upload' && (
                <div className="mdsr-modal-ov" onClick={() => setActiveModal(null)}>
                    <div className="mdsr-modal-cn small" onClick={e => e.stopPropagation()}>
                        <header className="mdsr-modal-hr">
                            <h3>Upload Finished Asset</h3>
                            <button className="close-x" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                        </header>
                        <div className="mdsr-modal-body p-5">
                            <div className="upload-zone">
                                <UploadCloud size={48} color="#143ae6" />
                                <h5>Click to upload finished banner</h5>
                                <span>Supported formats: PNG, JPG, WEBP (Max 5MB)</span>
                            </div>
                            <div className="upload-actions mt-4">
                                <button className="w-btn s w-full" onClick={() => { handleStatusChange(selectedRequest.id, 'Resolved'); setActiveModal(null); alert('Work delivered to partner!'); }}>Verify & Send to Partner</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDesignRequests;
