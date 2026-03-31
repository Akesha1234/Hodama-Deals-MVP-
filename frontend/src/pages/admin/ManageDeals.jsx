import React, { useState } from 'react';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Search,
    Filter,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Tag,
    Store,
    DollarSign,
    Layers,
    ArrowLeft,
    Star,
    MessageSquare,
    Info,
    MoreVertical,
    Check
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import './ManageDeals.css';

const AdminManageDeals = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null });

    // Mock Data for Deals
    const [products, setProducts] = useState([
        { id: 'D1024', name: 'Wireless Headphones Offer', client: 'TechStore', category: 'Electronics', price: 'Rs 4,500', stock: 1250, status: 'Approved', image: '🎧', rating: 4.8, reviews: 15 },
        { id: 'D1025', name: 'Smart Watch Z Deal', client: 'GadgetHub', category: 'Gadgets', price: 'Rs 12,000', stock: 450, status: 'Pending', image: '⌚', rating: 0, reviews: 0 },
        { id: 'D1026', name: 'Premium Leather Bag Sale', client: 'FashionHub', category: 'Fashion', price: 'Rs 8,500', stock: 890, status: 'Approved', image: '👜', rating: 4.5, reviews: 22 },
        { id: 'D1027', name: 'Portable BT Speaker Promo', client: 'SoundBox', category: 'Audio', price: 'Rs 3,200', stock: 320, status: 'Disabled', image: '🔊', rating: 3.9, reviews: 8 },
        { id: 'D1028', name: 'USB-C Fast Charger Offer', client: 'TechStore', category: 'Electronics', price: 'Rs 1,500', stock: 2100, status: 'Pending', image: '🔌', rating: 0, reviews: 0 },
    ]);

    const stats = {
        total: 4560,
        pending: 45,
        approved: 4420,
        disabled: 95
    };

    const handleAction = (id, newStatus) => {
        setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
        if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct({ ...selectedProduct, status: newStatus });
        }
    };

    const handleDelete = (id) => {
        setConfirmDelete({ isOpen: true, productId: id });
    };

    const confirmDeleteAction = () => {
        if (confirmDelete.productId) {
            setProducts(products.filter(p => p.id !== confirmDelete.productId));
            setConfirmDelete({ isOpen: false, productId: null });
            setSelectedProduct(null);
        }
    };

    return (
        <div className="amp-page-wrapper">
            {/* 1. Page Header */}
            <div className="amp-header">
                <div className="amp-header-left">
                    <h1 className="amp-title">Manage Deals</h1>
                    <p className="amp-subtitle">Monitor and review all active offers and seasonal deals</p>
                </div>
                <div className="amp-header-right">
                    <div className="amp-mini-stats">
                        <div className="amp-ms-item"><span>Total</span><strong>{stats.total}</strong></div>
                        <div className="amp-ms-item"><span>Pending</span><strong className="text-yellow">{stats.pending}</strong></div>
                    </div>
                </div>
            </div>

            {/* 2. Summary Cards */}
            <div className="amp-summary-grid">
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-blue"><Package size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.total}</span>
                        <span className="amp-stat-label">Total Listings</span>
                    </div>
                </div>
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-yellow"><Clock size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.pending}</span>
                        <span className="amp-stat-label">Pending Approval</span>
                    </div>
                </div>
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-green"><CheckCircle size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.approved}</span>
                        <span className="amp-stat-label">Active Deals</span>
                    </div>
                </div>
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-red"><XCircle size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.disabled}</span>
                        <span className="amp-stat-label">Expired Deals</span>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Search & Filters */}
            <div className="amp-controls-card adlay-shadow">
                <div className="amp-search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by product name, client or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="amp-filters">
                    <div className="amp-filter-item">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                    <div className="amp-filter-item">
                        <select>
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Gadgets</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 5. Products Table */}
            <div className="amp-table-card adlay-shadow">
                <div className="amp-table-container">
                    <table className="amp-table">
                        <thead>
                            <tr>
                                <th>Deal Info</th>
                                <th>Partner</th>
                                <th>Category</th>
                                <th>Deal Price</th>
                                <th>Views</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                                .filter(p => (statusFilter === 'All' || p.status === statusFilter))
                                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="amp-product-cell">
                                                <div className="amp-product-img">{product.image}</div>
                                                <div className="amp-product-info">
                                                    <span className="amp-product-name">{product.name}</span>
                                                    <span className="amp-product-id">{product.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="amp-val-bold">{product.client}</td>
                                        <td><span className="amp-cat-tag">{product.category}</span></td>
                                        <td className="amp-price">{product.price}</td>
                                        <td>
                                            <span className="amp-stock-tag">
                                                {product.stock} Views
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`amp-status-pill ${product.status.toLowerCase()}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="amp-table-actions">
                                                <button className="amp-btn-icon" onClick={() => setSelectedProduct(product)} title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                {product.status === 'Pending' && (
                                                    <button className="amp-btn-icon success" onClick={() => handleAction(product.id, 'Approved')} title="Approve">
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {product.status !== 'Disabled' && (
                                                    <button className="amp-btn-icon warn" onClick={() => handleAction(product.id, 'Disabled')} title="Disable">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                                <button className="amp-btn-icon danger" onClick={() => handleDelete(product.id)} title="Remove Product">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* 9. Pagination */}
                <div className="amp-pagination">
                    <span className="amp-pager-info">Showing 1–{products.length} of {stats.total} products</span>
                    <div className="amp-pager-controls">
                        <button className="amp-pager-nav disabled"><ChevronLeft size={18} /></button>
                        <button className="amp-pager-num active">1</button>
                        <button className="amp-pager-num">2</button>
                        <button className="amp-pager-nav"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* 8. Product Details Modal */}
            {selectedProduct && (
                <div className="amp-modal-overlay">
                    <div className="amp-modal-content animate-slide-in">
                        <header className="amp-modal-header">
                            <button className="amp-btn-back" onClick={() => setSelectedProduct(null)}>
                                <ArrowLeft size={20} /> Back to Products
                            </button>
                            <div className="amp-header-actions">
                                {selectedProduct.status === 'Pending' ? (
                                    <button className="amp-btn-main bg-green" onClick={() => handleAction(selectedProduct.id, 'Approved')}>Verify Deal</button>
                                ) : (
                                    <button className="amp-btn-main bg-red" onClick={() => handleAction(selectedProduct.id, 'Disabled')}>Expire Deal</button>
                                )}
                                <button className="amp-btn-main bg-light-red" onClick={() => handleDelete(selectedProduct.id)}>Remove Deal</button>
                            </div>
                        </header>

                        <div className="amp-modal-body">
                            <div className="amp-details-grid">
                                {/* Left: Images & Basic Info */}
                                <div className="amp-col-left">
                                    <section className="amp-details-card">
                                        <div className="amp-product-visual">
                                            <div className="amp-main-img-box">{selectedProduct.image}</div>
                                            <div className="amp-thumb-strip">
                                                <div className="amp-thumb active">{selectedProduct.image}</div>
                                                <div className="amp-thumb">{selectedProduct.image}</div>
                                                <div className="amp-thumb">{selectedProduct.image}</div>
                                            </div>
                                        </div>
                                        <div className="amp-product-heading">
                                            <h2>{selectedProduct.name}</h2>
                                            <div className="amp-rating-strip">
                                                <div className="amp-stars">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= Math.floor(selectedProduct.rating) ? "#f8c205" : "none"} color="#f8c205" />)}
                                                    <span className="amp-rating-val">{selectedProduct.rating}</span>
                                                </div>
                                                <span className="amp-review-count">({selectedProduct.reviews} User Reviews)</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="amp-details-card mt-4">
                                        <h3 className="amp-card-title"><Info size={20} /> Deal Information</h3>
                                        <div className="amp-info-list">
                                            <div className="amp-info-item">
                                                <Tag size={18} />
                                                <div className="amp-ii-text"><span>Category</span><strong>{selectedProduct.category}</strong></div>
                                            </div>
                                            <div className="amp-info-item">
                                                <DollarSign size={18} />
                                                <div className="amp-ii-text"><span>Deal Price</span><strong className="amp-price-large">{selectedProduct.price}</strong></div>
                                            </div>
                                            <div className="amp-info-item">
                                                <Layers size={18} />
                                                <div className="amp-ii-text"><span>Deal Engagement</span><strong>{selectedProduct.stock} Clicks</strong></div>
                                            </div>
                                            <div className="amp-info-item">
                                                <Store size={18} />
                                                <div className="amp-ii-text"><span>Business Partner</span><strong>{selectedProduct.client}</strong></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right: Description & Reviews */}
                                <div className="amp-col-right">
                                    <section className="amp-details-card">
                                        <h3 className="amp-card-title">Deal Description & Terms</h3>
                                        <p className="amp-description-text">
                                            This is a high-value {selectedProduct.name} from {selectedProduct.client}.
                                            Users will be redirected to the partner website to grab this deal.
                                            Clients are required to provide accurate terms of use and validity dates.
                                        </p>
                                    </section>

                                    <section className="amp-details-card mt-4">
                                        <div className="amp-card-header-flex">
                                            <h3 className="amp-card-title"><MessageSquare size={20} /> User Feedback</h3>
                                            <button className="amp-link-btn">View All</button>
                                        </div>
                                        <div className="amp-review-list">
                                            <div className="amp-review-item">
                                                <div className="amp-rev-top">
                                                    <strong>Nimal P.</strong>
                                                    <div className="amp-stars-mini">⭐⭐⭐⭐⭐</div>
                                                </div>
                                                <p>Excellent deal! Successfully claimed the offer at the store.</p>
                                                <span className="amp-rev-date">02 Mar 2026</span>
                                            </div>
                                            <div className="amp-review-item">
                                                <div className="amp-rev-top">
                                                    <strong>Kamal S.</strong>
                                                    <div className="amp-stars-mini">⭐⭐⭐⭐</div>
                                                </div>
                                                <p>Good offer, but the coupon code was a bit difficult to apply on the website.</p>
                                                <span className="amp-rev-date">28 Feb 2026</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Premium Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, productId: null })}
                onConfirm={confirmDeleteAction}
                title="Remove Deal?"
                message="Are you sure you want to permanently remove this deal? This will delete the offer from the marketplace."
                confirmText="Remove Deal"
                type="danger"
            />
        </div>
    );
};

export default AdminManageDeals;
