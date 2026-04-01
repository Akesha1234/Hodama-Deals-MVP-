import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Plus,
    ShoppingBag,
    User,
    LogOut,
    Menu,
    Search,
    Bell,
    MessageSquare,
    X,
    Filter,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Archive,
    Save,
    RotateCcw,
    Tag,
    Image as ImageIcon,
    UploadCloud,
    Home,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import { getStoredCategories } from '../../utils/categoryUtils';
import './ManageDeals.css';

const ManageDeals = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Load combined deals from localStorage
        const fetchDeals = () => {
            const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
            
            // Map the storage format to the UI format if necessary
            const mappedDeals = storedDeals.map(d => ({
                ...d,
                id: d.id.toString(),
                image: d.img || d.image || "/assets/images/placeholder_deal.png",
                originalPrice: d.oldPrice ? parseInt(d.oldPrice.toString().replace(/[^0-9]/g, '')) : 0,
                price: parseInt(d.price.toString().replace(/[^0-9]/g, '')),
                status: d.status || "Active",
                views: d.views || 0
            }));

            // Include initial mock products if needed, but for persistence we focus on storage
            setProducts([...mappedDeals]);
        };

        fetchDeals();
        // Listen for storage changes in other tabs
        window.addEventListener('storage', fetchDeals);
        return () => window.removeEventListener('storage', fetchDeals);
    }, []);

    // Sync state to localStorage whenever products change locally
    const updateStorage = (updatedProducts) => {
        const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        
        // Re-map back to the storage format expected by Home/Listing
        const finalDeals = updatedProducts.map(p => {
            const original = storedDeals.find(d => d.id.toString() === p.id.toString()) || {};
            return {
                ...original,
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price.toLocaleString(),
                oldPrice: p.originalPrice > 0 ? p.originalPrice.toLocaleString() : null,
                img: p.image,
                status: p.status,
                views: p.views
            };
        });

        localStorage.setItem('hodama_all_deals_v1', JSON.stringify(finalDeals));
        setProducts(updatedProducts);
    };

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Latest');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [globalCategories, setGlobalCategories] = useState([]);
    useEffect(() => {
        setGlobalCategories(getStoredCategories());
    }, []);

    // Category display helper mapping
    const categoryNames = {
        'electronics': 'Electronics',
        'computers': 'Computers & Accessories',
        'fashion': 'Fashion',
        'homeLifestyle': 'Home & Lifestyle',
        'groceries': 'Groceries',
        'healthBeauty': 'Health & Beauty',
        'sportsFitness': 'Sports & Fitness',
        'babyKids': 'Baby & Kids',
        'automotive': 'Automotive',
        'salon': 'Salon',
        'restaurant': 'Restaurant',
        'hotel': 'Hotel',
        'spa': 'Spa',
        'other': 'Other'
    };

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Derived State: Filtered & Sorted Products
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        if (sortBy === 'PriceLow') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'PriceHigh') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'Views') {
            result.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else if (sortBy === 'Latest') {
            result.sort((a, b) => b.id - a.id);
        }
        return result;
    }, [products, searchTerm, categoryFilter, statusFilter, sortBy]);

    // Statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'Active').length;
    const outOfStockProducts = products.filter(p => p.stock === 0 || p.status === 'Out of Stock').length;

    // Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleBulkAction = (action) => {
        if (selectedProducts.length === 0) return;
        if (action === 'Delete') {
            if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} items?`)) {
                const updated = products.filter(p => !selectedProducts.includes(p.id));
                updateStorage(updated);
                setSelectedProducts([]);
            }
        } else if (action === 'Disable') {
            const updated = products.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'Disabled' } : p);
            updateStorage(updated);
            setSelectedProducts([]);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this deal?')) {
            const updated = products.filter(p => p.id !== id);
            updateStorage(updated);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('All');
        setSubCategoryFilter('All');
        setStatusFilter('All');
        setSortBy('Latest');
    };

    const openViewModal = (product) => {
        setCurrentProduct(product);
        setIsViewModalOpen(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct({ ...product }); // create copy for editing
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentProduct(null);
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        const updated = products.map(p => p.id === currentProduct.id ? currentProduct : p);
        updateStorage(updated);
        closeModals();
        alert('Deal updated successfully!');
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                {/* View Container */}
                <div className="dashboard-view-container mp-scroll-container">
                    <div className="mp-wrapper fade-in">

                        {/* 0. Breadcrumb */}
                        <div className="mp-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Manage Deals</span>
                        </div>

                        {/* 1. Page Header */}
                        <div className="mp-page-header">
                            <div>
                                <h1><Archive size={28} /> Manage Deals</h1>
                                <p>View, edit, and manage all your active and upcoming offers.</p>
                            </div>
                            <button className="mp-btn-add" onClick={() => navigate('/client/add-deal')}>
                                <Plus size={20} /> Add New Deal
                            </button>
                        </div>

                        {/* 2. Quick Stats */}
                        <div className="mp-quick-stats">
                            <div className="mp-stat-card">
                                <div className="mp-stat-icon mp-stat-total"><Package size={24} /></div>
                                <div className="mp-stat-info">
                                    <span className="mp-stat-val">{totalProducts}</span>
                                    <span className="mp-stat-label">Total Deals</span>
                                </div>
                            </div>
                            <div className="mp-stat-card">
                                <div className="mp-stat-icon mp-stat-active"><CheckCircle2 size={24} /></div>
                                <div className="mp-stat-info">
                                    <span className="mp-stat-val">{activeProducts}</span>
                                    <span className="mp-stat-label">Active Deals</span>
                                </div>
                            </div>
                            <div className="mp-stat-card">
                                <div className="mp-stat-icon mp-stat-oos"><Eye size={24} /></div>
                                <div className="mp-stat-info">
                                    <span className="mp-stat-val">2.5k</span>
                                    <span className="mp-stat-label">Total Views</span>
                                </div>
                            </div>
                        </div>



                        {/* 3. Search & Filters */}
                        <div className="mp-filters-section">
                            <div className="mp-search-bar">
                                <Search size={20} color="#94a3b8" />
                                <input
                                    type="text"
                                    placeholder="Search products by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="mp-filter-grid">
                                <div className="mp-filter-item">
                                    <label><Filter size={14} className="inline mr-1" /> Category</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            setCategoryFilter(e.target.value);
                                            setSubCategoryFilter('All');
                                        }}
                                    >
                                        <option value="All">All Categories</option>
                                        {globalCategories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item">
                                    <label>Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Disabled">Disabled</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item">
                                    <label>Sort By</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="Latest">Latest Added</option>
                                        <option value="PriceLow">Price: Low to High</option>
                                        <option value="PriceHigh">Price: High to Low</option>
                                        <option value="Views">Most Viewed</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item mp-filter-reset">
                                    <button className="mp-btn-reset" onClick={resetFilters} title="Reset All Filters" type="button">
                                        <RotateCcw size={16} /> Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Products Table */}
                        <div className="mp-table-container">
                            {/* Bulk Actions */}
                            {selectedProducts.length > 0 && (
                                <div className="mp-bulk-actions fade-in">
                                    <span className="mp-bulk-label">{selectedProducts.length} Items Selected:</span>
                                    <button className="mp-bulk-btn delete" onClick={() => handleBulkAction('Delete')}>Delete Selected</button>
                                    <button className="mp-bulk-btn" onClick={() => handleBulkAction('Disable')}>Disable Products</button>
                                </div>
                            )}

                            <div className="mp-table-scroll">
                                <table className="mp-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px' }}>
                                                <input
                                                    type="checkbox"
                                                    className="mp-checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                                />
                                            </th>
                                            <th>Deal Info</th>
                                            <th>Price</th>
                                            <th>Grab Clicks</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-gray-500 font-bold">
                                                    No products found matching your search.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="mp-checkbox"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => handleSelectOne(product.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="mp-prod-col">
                                                        <img src={product.image} alt={product.name} className="mp-prod-img" />
                                                        <div className="mp-prod-info">
                                                            <span className="mp-prod-name">{product.name}</span>
                                                            <span className="mp-prod-cat">{categoryNames[product.category] || product.category} {product.subCategory && ` / ${product.subCategory}`} • ID: {product.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="mp-price">LKR {product.price.toLocaleString()}</div>
                                                </td>
                                                <td>
                                                    <div className="mp-stock">
                                                        {product.views || 0} Clicks
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`mp-badge ${product.status?.toLowerCase() || 'pending'}`}>
                                                        {product.status === 'Approved' || product.status === 'Active' ? <CheckCircle2 size={12} /> : 
                                                         product.status === 'Pending' ? <Clock size={12} /> : 
                                                         <AlertTriangle size={12} />}
                                                        {product.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="mp-actions-cell">
                                                        <button
                                                            className="mp-icon-btn edit"
                                                            title="Edit Product"
                                                            onClick={() => openEditModal(product)}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                         <button
                                                            className="mp-icon-btn"
                                                            title="View Deal Live"
                                                            onClick={() => window.open(`/deal/${product.id}`, '_blank')}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            className="mp-icon-btn delete"
                                                            title="Delete Product"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="mp-pagination">
                                <span className="text-sm font-bold text-gray-500 mr-4">Showing 1-{filteredProducts.length} of {filteredProducts.length}</span>
                                <button className="mp-page-btn" disabled><ChevronLeft size={18} /></button>
                                <button className="mp-page-btn active">1</button>
                                <button className="mp-page-btn" disabled><ChevronRight size={18} /></button>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* View Modal */}
            {isViewModalOpen && currentProduct && (
                <div className="mp-modal-overlay fade-in">
                    <div className="mp-modal-content">
                        <div className="mp-modal-header">
                            <h3>Product Details</h3>
                            <button className="mp-modal-close" onClick={closeModals}><X size={20} /></button>
                        </div>
                        <div className="mp-modal-body">
                            <img src={currentProduct.image} alt="product" className="mp-view-img" />
                            <h4 className="mp-view-title">{currentProduct.name}</h4>
                            <p className="mp-view-subtitle">ID: {currentProduct.id} • Category: {currentProduct.category}</p>

                            <div className="mp-view-badge-wrap">
                                <span className={`mp-badge ${currentProduct.status.replace(/ /g, '').toLowerCase()}`}>
                                    {currentProduct.status}
                                </span>
                            </div>

                            <div className="mp-view-details">
                                <div className="mp-vd-item">
                                    <span className="mp-vd-label">Price</span>
                                    <span className="mp-vd-val">LKR {currentProduct.price.toLocaleString()}</span>
                                </div>
                                <div className="mp-vd-item" style={{ textAlign: 'right' }}>
                                    <span className="mp-vd-label">Stock</span>
                                    <span className="mp-vd-val">{currentProduct.stock} Units</span>
                                </div>
                            </div>
                        </div>
                        <div className="mp-modal-footer">
                            <button className="mp-btn-outline w-full" onClick={closeModals}>Close View</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && currentProduct && (
                <div className="mp-modal-overlay fade-in">
                    <div className="mp-modal-content mp-modal-wide">
                        <div className="mp-modal-header">
                            <h3><Edit2 size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Edit Deal</h3>
                            <button className="mp-modal-close" onClick={closeModals}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleEditSave}>
                            <div className="mp-modal-body">

                                {/* 1. Basic Info Section */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Package size={20} />
                                        <h4>Deal Information</h4>
                                    </div>
                                    <div className="mp-form-group">
                                        <label>Deal Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="mp-form-input"
                                            value={currentProduct.name}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Category</label>
                                            <select
                                                className="mp-form-select"
                                                value={currentProduct.category}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value, subCategory: '' })}
                                            >
                                                {globalCategories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Sub Category</label>
                                            <select
                                                className="mp-form-select"
                                                value={currentProduct.subCategory}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, subCategory: e.target.value })}
                                                disabled={currentProduct.category === 'other'}
                                            >
                                                <option value="">Select Sub Category</option>
                                                {currentProduct.category === 'electronics' && (
                                                    <>
                                                        <option value="smartphones">Smartphones</option>
                                                        <option value="headphones">Headphones & Earbuds</option>
                                                        <option value="tvs">TV & Smart TVs</option>
                                                        <option value="cameras">Cameras</option>
                                                        <option value="watches">Smart Watches</option>
                                                    </>
                                                )}
                                                {currentProduct.category === 'fashion' && (
                                                    <>
                                                        <option value="mens-shoes">Men's Shoes</option>
                                                        <option value="womens-dresses">Women's Dresses</option>
                                                        <option value="handbags">Handbags</option>
                                                    </>
                                                )}
                                                {/* Simplified for brevity, matching mock data categories */}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Brand (Optional)</label>
                                            <input
                                                type="text"
                                                className="mp-form-input"
                                                placeholder="e.g. Sony, Apple"
                                                value={currentProduct.brand || ''}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                                            />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Condition <span className="mp-req">*</span></label>
                                            <div className="mp-cond-toggle">
                                                <label className={`mp-cond-btn ${currentProduct.condition === 'New' ? 'active new' : ''}`}>
                                                    <input type="radio" checked={currentProduct.condition === 'New'} onChange={() => setCurrentProduct({ ...currentProduct, condition: 'New' })} />
                                                    Brand New
                                                </label>
                                                <label className={`mp-cond-btn ${currentProduct.condition === 'Used' ? 'active used' : ''}`}>
                                                    <input type="radio" checked={currentProduct.condition === 'Used'} onChange={() => setCurrentProduct({ ...currentProduct, condition: 'Used' })} />
                                                    Used / Second Hand
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Pricing & Stock Section */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Tag size={20} />
                                        <h4>Pricing & Inventory</h4>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Original Price (Rs.) <span className="mp-req">*</span></label>
                                            <input
                                                type="number"
                                                className="mp-form-input"
                                                value={currentProduct.originalPrice || currentProduct.price}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, originalPrice: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Selling Price (Rs.) <span className="mp-req">*</span></label>
                                            <input
                                                type="number"
                                                required
                                                className="mp-form-input"
                                                value={currentProduct.price}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    {currentProduct.originalPrice > currentProduct.price && (
                                        <div className="mp-price-calc-box">
                                            <span>Current Discount Applied</span>
                                            <span className="mp-discount-badge">
                                                {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                    )}
                                    <div className="mp-field-row" style={{ marginTop: '20px' }}>
                                        <div className="mp-form-group">
                                            <label>Quantity Available <span className="mp-req">*</span></label>
                                            <input
                                                type="number"
                                                required
                                                className="mp-form-input"
                                                placeholder="e.g. 20"
                                                value={currentProduct.stock}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setCurrentProduct({
                                                        ...currentProduct,
                                                        stock: val,
                                                        status: val === 0 ? 'Out of Stock' : currentProduct.status === 'Out of Stock' ? 'In Stock' : currentProduct.status
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Status</label>
                                            <select
                                                className="mp-form-select"
                                                value={currentProduct.status === 'Active' ? 'In Stock' : currentProduct.status}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value === 'In Stock' ? 'Active' : 'Out of Stock' })}
                                            >
                                                <option value="In Stock">In Stock</option>
                                                <option value="Out of Stock">Out of Stock</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Detailed Info & Location */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <AlertCircle size={20} />
                                        <h4>Detailed Information</h4>
                                    </div>
                                    <div className="mp-form-group">
                                        <label>Deal Description <span className="mp-req">*</span></label>
                                        <textarea
                                            className="mp-form-textarea"
                                            rows="6"
                                            placeholder="Provide detailed specifications, features, and warranty details..."
                                            value={currentProduct.description || ''}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mp-form-group">
                                        <label>Client City <span className="mp-req">*</span></label>
                                        <select
                                            className="mp-form-select"
                                            value={currentProduct.city || ''}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, city: e.target.value })}
                                            required
                                        >
                                            <option value="">Select City</option>
                                            <option value="Colombo">Colombo</option>
                                            <option value="Gampaha">Gampaha</option>
                                            <option value="Negombo">Negombo</option>
                                            <option value="Kandy">Kandy</option>
                                            <option value="Galle">Galle</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 4. Images Section */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <ImageIcon size={20} />
                                        <h4>Deal Images <span className="mp-req">*</span></h4>
                                    </div>
                                    <p className="mp-helper-text" style={{ marginBottom: '15px' }}>Current featured image used for listings.</p>
                                    <div className="mp-edit-img-section" style={{ alignItems: 'flex-start' }}>
                                        <div className="mp-edit-img-wrapper">
                                            <img src={currentProduct.image} alt="product format" className="mp-edit-img-preview" />
                                            <div className="mp-edit-img-overlay">
                                                <label htmlFor="editImgUpload" className="mp-edit-img-btn">
                                                    Change Image
                                                </label>
                                                <input
                                                    type="file"
                                                    id="editImgUpload"
                                                    accept="image/*"
                                                    className="mp-hidden-input"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setCurrentProduct({ ...currentProduct, image: url });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mp-modal-footer">
                                <button type="button" className="mp-btn-outline" onClick={closeModals}>Cancel</button>
                                <button type="submit" className="mp-btn-primary"><Save size={18} /> Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDeals;

