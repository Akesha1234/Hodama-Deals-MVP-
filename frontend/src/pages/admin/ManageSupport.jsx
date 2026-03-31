import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LifeBuoy,
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
    FileText,
    Paperclip,
    Send,
    ArrowLeft,
    MoreVertical,
    Activity
} from 'lucide-react';
import './ManageSupport.css';

const ManageSupport = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'view', 'message', 'close'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const location = useLocation();
    const [typeFilter, setTypeFilter] = useState('All Issue Types');
    const [replyText, setReplyText] = useState('');

    // Initialize State from LocalStorage to link with User HelpCenter
    const [tickets, setTickets] = useState(() => {
        const saved = localStorage.getItem('hodamaAdminSupportTickets_v3');
        if (saved) return JSON.parse(saved);

        const initial = [
            { id: 'TCK1024', user: 'Nimal Perera', email: 'nimal@email.com', phone: '077 123 4567', type: 'Broken Deal Link', message: 'The link for the headphones deal goes to a 404 page.', status: 'Open', date: '05 Mar 2026', attachment: 'deal_screenshot.png', history: [] },
            { id: 'TCK1025', user: 'Hashni Rehana', email: 'hashni@email.com', phone: '071 987 6543', type: 'Misleading Price', message: 'The deal says Rs 400 but the partner cart shows Rs 800.', status: 'In Progress', date: '06 Mar 2026', attachment: null, history: [{ sender: 'admin', text: 'We are reaching out to the partner store.', date: '06 Mar 2026' }] },
            { id: 'TCK1026', user: 'Kamal Silva', email: 'kamal@email.com', phone: '075 444 3333', type: 'Scam Report', message: 'Requesting ban for a scammy deal offering free iPhones.', status: 'Resolved', date: '04 Mar 2026', attachment: 'scam_photo.jpg', history: [] },
            { id: 'TCK1027', user: 'Sunil Rathnayaka', email: 'sunil@email.com', phone: '070 111 2222', type: 'Account Access', message: 'Cannot login to my partner account.', status: 'Open', date: '07 Mar 2026', attachment: null, history: [] },
            { id: 'TCK1028', user: 'Bimali Cooray', email: 'bimali@email.com', phone: '072 555 6666', type: 'Other', message: 'How do I submit my own shop promotions?', status: 'Closed', date: '02 Mar 2026', attachment: null, history: [{ sender: 'admin', text: 'You can apply via the Partner registration page.', date: '02 Mar 2026' }] }
        ];

        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify(initial));
        return initial;
    });

    useEffect(() => {
        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify(tickets));
    }, [tickets]);

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length
    };

    const handleStatusChange = (id, newStatus) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === id) {
            setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedTicket) return;

        const newReply = {
            sender: 'admin',
            text: replyText,
            date: 'Today'
        };

        const updatedHistory = [...(selectedTicket.history || []), newReply];

        setTickets(tickets.map(t =>
            t.id === selectedTicket.id
                ? { ...t, history: updatedHistory, status: t.status === 'Open' ? 'In Progress' : t.status }
                : t
        ));

        setSelectedTicket({
            ...selectedTicket,
            status: selectedTicket.status === 'Open' ? 'In Progress' : selectedTicket.status,
            history: updatedHistory
        });

        setReplyText('');
    };

    const confirmCloseTicket = () => {
        handleStatusChange(selectedTicket.id, 'Closed');
        setActiveModal(null);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('All');
        setTypeFilter('All Issue Types');
    };

    return (
        <div className="amsup-page-wrapper">
            {/* 1. Page Header */}
            <div className="amsup-header">
                <div className="amsup-header-left">
                    <h1 className="amsup-title">Customer Support</h1>
                    <p className="amsup-subtitle">Manage customer issues, resolve disputes and track support tickets</p>
                </div>
                <div className="amsup-header-right">
                    <div className="amsup-mini-counts">
                        <div className="amsup-mc-item"><span>Open Requests</span><strong className="text-yellow">{stats.open}</strong></div>
                        <div className="amsup-mc-item"><span>Resolved Today</span><strong>12</strong></div>
                    </div>
                </div>
            </div>

            {/* 2. Summary Cards */}
            <div className="amsup-summary-grid">
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-blue"><LifeBuoy size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.total}</span>
                        <span className="amsup-stat-label">Total Tickets</span>
                    </div>
                </div>
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-yellow"><AlertCircle size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.open}</span>
                        <span className="amsup-stat-label">Open Tickets</span>
                    </div>
                </div>
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-cyan"><Activity size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.inProgress}</span>
                        <span className="amsup-stat-label">In Progress</span>
                    </div>
                </div>
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-green"><CheckCircle size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.resolved}</span>
                        <span className="amsup-stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Search & Filters */}
            <div className="amsup-controls-card adlay-shadow">
                <div className="amsup-search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by Ticket ID, user, email or issue..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="amsup-filters">
                    <div className="amsup-filter-item">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="amsup-filter-item">
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="All Issue Types">All Issue Types</option>
                            <option value="Broken Deal Link">Broken Deal Link</option>
                            <option value="Misleading Price">Misleading Price</option>
                            <option value="Scam Report">Scam Report</option>
                            <option value="Account Access">Account Access</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {(searchQuery || statusFilter !== 'All' || typeFilter !== 'All Issue Types') && (
                        <button className="amsup-btn-reset" onClick={resetFilters}>
                            <XCircle size={16} /> Reset
                        </button>
                    )}
                </div>
            </div>

            {/* 5. Support Tickets Table */}
            <div className="amsup-table-card adlay-shadow">
                <div className="amsup-table-container">
                    <table className="amsup-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>User Info</th>
                                <th>Issue Type</th>
                                <th>Message Snippet</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets
                                .filter(t => (statusFilter === 'All' || t.status === statusFilter))
                                .filter(t => (typeFilter === 'All Issue Types' || t.type === typeFilter))
                                .filter(t =>
                                    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.message.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td className="amsup-td-id">{ticket.id}</td>
                                        <td>
                                            <div className="amsup-user-cell">
                                                <span className="amsup-u-name">{ticket.user}</span>
                                                <span className="amsup-u-email">{ticket.email}</span>
                                            </div>
                                        </td>
                                        <td><span className="amsup-type-tag">{ticket.type}</span></td>
                                        <td><p className="amsup-msg-snippet">{ticket.message.substring(0, 40)}...</p></td>
                                        <td>
                                            <span className={`amsup-status-pill ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td>{ticket.date}</td>
                                        <td className="text-right">
                                            <div className="amsup-table-actions">
                                                <button className="amsup-btn-icon" onClick={() => { setSelectedTicket(ticket); setActiveModal('view'); }} title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="amsup-btn-icon reply" onClick={() => { setSelectedTicket(ticket); setActiveModal('message'); }} title="Send Reply">
                                                    <MessageSquare size={18} />
                                                </button>
                                                {ticket.status !== 'Closed' && (
                                                    <button className="amsup-btn-icon close" onClick={() => { setSelectedTicket(ticket); setActiveModal('close'); }} title="Close Ticket">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* 9. Pagination */}
                <div className="amsup-pagination">
                    <span className="amsup-pager-info">Showing 1–{tickets.length} of {stats.total} tickets</span>
                    <div className="amsup-pager-controls">
                        <button className="amsup-pager-nav disabled"><ChevronLeft size={18} /></button>
                        <button className="amsup-pager-num active">1</button>
                        <button className="amsup-pager-num">2</button>
                        <button className="amsup-pager-nav"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Modals Container */}
            {activeModal === 'view' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content view-only" onClick={e => e.stopPropagation()}>
                        <header className="amsup-modal-header">
                            <h3 className="amsup-card-title m-0"><User size={20} /> Ticket Details</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="amsup-status-updater">
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                                        className={`amsup-status-select ${selectedTicket.status.toLowerCase().replace(' ', '-')}`}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                <button className="amsup-close-btn" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                            </div>
                        </header>
                        <div className="amsup-modal-body">
                            <div className="amsup-profile-info mb-4">
                                <div className="amsup-p-item">
                                    <User size={18} />
                                    <div className="amsup-pi-text"><span>Full Name</span><strong>{selectedTicket.user}</strong></div>
                                </div>
                                <div className="amsup-p-item">
                                    <Mail size={18} />
                                    <div className="amsup-pi-text"><span>Email Address</span><strong>{selectedTicket.email}</strong></div>
                                </div>
                                <div className="amsup-p-item">
                                    <Phone size={18} />
                                    <div className="amsup-pi-text"><span>Phone Number</span><strong>{selectedTicket.phone}</strong></div>
                                </div>
                            </div>
                            <div className="amsup-issue-summary mt-4 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                                <div className="amsup-is-row"><span>Ticket ID:</span><strong>{selectedTicket.id}</strong></div>
                                <div className="amsup-is-row"><span>Type:</span><strong>{selectedTicket.type}</strong></div>
                                <div className="amsup-is-row"><span>Status:</span>
                                    <strong className={`amsup-status-pill ${selectedTicket.status.toLowerCase().replace(' ', '-')}`}>
                                        {selectedTicket.status}
                                    </strong>
                                </div>
                            </div>
                             <div className="amsup-issue-desc mt-4">
                                <strong>Description:</strong>
                                <p>{selectedTicket.message}</p>
                            </div>
                            
                            {selectedTicket.attachment && (
                                <div className="amsup-attachment-box mt-3">
                                    <Paperclip size={18} />
                                    <span>{selectedTicket.attachment}</span>
                                    <button className="amsup-btn-link">Download</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'message' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content message-only" onClick={e => e.stopPropagation()}>
                        <header className="amsup-modal-header">
                            <h3 className="amsup-card-title m-0"><MessageSquare size={20} /> Reply to {selectedTicket.user}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="amsup-status-updater">
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                                        className={`amsup-status-select ${selectedTicket.status.toLowerCase().replace(' ', '-')}`}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                <button className="amsup-close-btn" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                            </div>
                        </header>
                        <div className="amsup-modal-body" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
                            <div className="amsup-chat-history">
                                <div className="amsup-msg-bubble user">
                                    <div className="amsup-msg-meta"><strong>{selectedTicket.user}</strong><span>{selectedTicket.date}</span></div>
                                    <p>{selectedTicket.message}</p>
                                </div>
                                {selectedTicket.history && selectedTicket.history.map((msg, index) => (
                                    <div key={index} className={`amsup-msg-bubble ${msg.sender === 'admin' ? 'admin' : 'user'}`}>
                                        <div className="amsup-msg-meta">
                                            <strong>{msg.sender === 'admin' ? 'Support Team' : selectedTicket.user}</strong>
                                            <span>{msg.date}</span>
                                        </div>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="amsup-reply-section mt-auto">
                                <textarea
                                    placeholder="Type your reply here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                                <div className="amsup-reply-actions">
                                    <button className="amsup-btn-attach"><Paperclip size={18} /> Attach File</button>
                                    <button className="amsup-btn-send" onClick={handleSendReply}>
                                        <Send size={18} /> Send Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'close' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content small-prompt" onClick={e => e.stopPropagation()}>
                        <div className="amsup-prompt-icon">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="amsup-prompt-title">Close Ticket?</h3>
                        <p className="amsup-prompt-text">
                            Are you sure you want to close ticket <strong>{selectedTicket.id}</strong>?
                            This will mark the issue as permanently resolved.
                        </p>
                        <div className="amsup-prompt-actions">
                            <button className="amsup-btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                            <button className="amsup-btn-confirm" onClick={confirmCloseTicket}>Close Ticket</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSupport;
