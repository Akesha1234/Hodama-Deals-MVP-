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
import './ManageDeals.css';

const ManageDeals = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Design Requests State
    const [designRequests, setDesignRequests] = useState([]);
    useEffect(() => {
        const tickets = JSON.parse(localStorage.getItem('hodamaAdminSupportTickets_v3') || '[]');
        const myRequests = tickets.filter(t => t.type === 'Design Team Support' && t.user === (user?.name || 'Client'));
        setDesignRequests(myRequests);
    }, [user]);

    // MOCK DATA INITIAL STATE
    const initialProducts = [
        {
            id: "D101",
            name: "Apple iPhone 14 Pro Max 256GB - 20% OFF Deal",
            category: "electronics",
            subCategory: "smartphones",
            price: 295000,
            originalPrice: 310000,
            views: 1250,
            status: "Active",
            image: "https://images.unsplash.com/photo-1695048133142-1a20a5bf616a?w=100",
            brand: "Apple",
            condition: "New",
            description: "Genuine Apple iPhone offer. Grab at the physical store.",
            province: "Colombo",
            city: "Colombo 03"
        },
        {
            id: "D102",
            name: "Sony WH-1000XM4 Noise Canceling Headphones Offer",
            category: "electronics",
            subCategory: "headphones",
            price: 65000,
            originalPrice: 68000,
            views: 450,
            status: "Active",
            image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100",
            brand: "Sony",
            condition: "New",
            description: "Industry leading noise cancellation with exclusive discount.",
            province: "Gampaha",
            city: "Negombo"
        }
    ];

    const [products, setProducts] = useState(initialProducts);

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Latest');
    const [selectedProducts, setSelectedProducts] = useState([]);

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
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            const matchesSubCategory = subCategoryFilter === 'All' || product.subCategory === subCategoryFilter;
            const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
            return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
        });

        if (sortBy === 'PriceLow') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'PriceHigh') {
            result.sort((a, b) => b.price - a.price);
        }
        // 'Latest' and 'BestSelling' can be mock sorted normally (default order here)
        return result;
    }, [products, searchTerm, categoryFilter, subCategoryFilter, statusFilter, sortBy]);

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
                setProducts(products.filter(p => !selectedProducts.includes(p.id)));
                setSelectedProducts([]);
            }
        } else if (action === 'Disable') {
            setProducts(products.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'Disabled' } : p));
            setSelectedProducts([]);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
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
        setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
        closeModals();
        alert('Product updated successfully!');
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

                        {/* Design Requests Section */}
                        {designRequests.length > 0 && (
                            <div className="mp-design-requests-section" style={{ marginBottom: '30px', backgroundColor: '#e0e7ff', padding: '24px', borderRadius: '16px', border: '1px solid #c7d2fe', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: '600' }}>
                                        <div style={{ backgroundColor: '#bfdbfe', padding: '8px', borderRadius: '50%', color: '#1d4ed8' }}><MessageSquare size={20} /></div>
                                        Your Graphic Design & Setup Requests
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {designRequests.map(req => (
                                        <div key={req.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                    <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={14}/> {req.id}</span>
                                                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: req.status === 'Open' ? '#fef3c7' : req.status === 'Resolved' ? '#dcfce3' : '#dbeafe', color: req.status === 'Open' ? '#d97706' : req.status === 'Resolved' ? '#15803d' : '#1d4ed8', fontWeight: '600' }}>{req.status}</span>
                                                    <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><Archive size={14} /> {req.date}</span>
                                                </div>
                                                <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #cbd5e1', marginBottom: '12px' }}>
                                                    <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>{req.message}</p>
                                                </div>
                                                {req.attachment && (
                                                    <div style={{ fontSize: '13px', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', padding: '6px 12px', borderRadius: '6px', fontWeight: '500' }}>
                                                        <ImageIcon size={16} /> {req.attachment}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                                <span style={{ fontSize: '13px', color: '#64748b', textAlign: 'right' }}>Admin is notified and <br/>is reviewing your submission.</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                        <option value="electronics">Electronics</option>
                                        <option value="computers">Computers & Accessories</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="homeLifestyle">Home & Lifestyle</option>
                                        <option value="groceries">Groceries</option>
                                        <option value="healthBeauty">Health & Beauty</option>
                                        <option value="sportsFitness">Sports & Fitness</option>
                                        <option value="babyKids">Baby & Kids</option>
                                        <option value="automotive">Automotive</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item">
                                    <label>Sub Category</label>
                                    <select
                                        value={subCategoryFilter}
                                        onChange={(e) => setSubCategoryFilter(e.target.value)}
                                        disabled={categoryFilter === 'All' || categoryFilter === 'other'}
                                    >
                                        <option value="All">All Sub Categories</option>
                                        {categoryFilter === 'electronics' && (
                                            <>
                                                <option value="smartphones">Smartphones</option>
                                                <option value="feature-phones">Feature Phones</option>
                                                <option value="tablets">Tablets</option>
                                                <option value="watches">Smart Watches</option>
                                                <option value="cameras">Cameras</option>
                                                <option value="consoles">Gaming Consoles</option>
                                                <option value="headphones">Headphones & Earbuds</option>
                                                <option value="speakers">Speakers</option>
                                                <option value="power-banks">Power Banks</option>
                                                <option value="chargers">Chargers & Cables</option>
                                                <option value="tvs">TV & Smart TVs</option>
                                                <option value="projectors">Projectors</option>
                                            </>
                                        )}
                                        {categoryFilter === 'computers' && (
                                            <>
                                                <option value="laptops">Laptops</option>
                                                <option value="desktops">Desktop Computers</option>
                                                <option value="monitors">Monitors</option>
                                                <option value="keyboards">Keyboards</option>
                                                <option value="mouse">Mouse</option>
                                                <option value="laptop-bags">Laptop Bags</option>
                                                <option value="hdd">Hard Drives (HDD)</option>
                                                <option value="ssd">SSD Storage</option>
                                                <option value="usb">USB Flash Drives</option>
                                                <option value="printers">Printers & Scanners</option>
                                                <option value="networking">Networking Devices</option>
                                                <option value="graphics-cards">Graphics Cards</option>
                                            </>
                                        )}
                                        {categoryFilter === 'fashion' && (
                                            <>
                                                <option disabled className="font-bold bg-gray-100">Men's Fashion</option>
                                                <option value="mens-tshirts">T-Shirts</option>
                                                <option value="mens-shirts">Shirts</option>
                                                <option value="mens-jeans">Jeans</option>
                                                <option value="mens-shorts">Shorts</option>
                                                <option value="mens-jackets">Jackets</option>
                                                <option value="mens-suits">Suits</option>
                                                <option value="mens-shoes">Shoes</option>

                                                <option disabled className="font-bold bg-gray-100 mt-2">Women's Fashion</option>
                                                <option value="womens-dresses">Dresses</option>
                                                <option value="womens-tops">Tops & T-Shirts</option>
                                                <option value="womens-jeans">Jeans</option>
                                                <option value="womens-skirts">Skirts</option>
                                                <option value="womens-activewear">Activewear</option>
                                                <option value="womens-shoes">Shoes</option>
                                                <option value="womens-bags">Bags & Purses</option>

                                                <option disabled className="font-bold bg-gray-100 mt-2">Accessories</option>
                                                <option value="watches">Watches</option>
                                                <option value="sunglasses">Sunglasses</option>
                                                <option value="jewelry">Jewelry</option>
                                            </>
                                        )}
                                        {categoryFilter === 'homeLifestyle' && (
                                            <>
                                                <option value="furniture">Furniture</option>
                                                <option value="bedding">Bedding</option>
                                                <option value="bath">Bath</option>
                                                <option value="home-decor">Home Decor</option>
                                                <option value="lighting">Lighting</option>
                                                <option value="kitchen">Kitchen & Dining</option>
                                                <option value="appliances">Home Appliances</option>
                                                <option value="tools">Tools & Home Improvement</option>
                                            </>
                                        )}
                                        {categoryFilter === 'groceries' && (
                                            <>
                                                <option value="fresh-produce">Fresh Produce</option>
                                                <option value="dairy">Dairy & Eggs</option>
                                                <option value="meat">Meat & Seafood</option>
                                                <option value="bakery">Bakery</option>
                                                <option value="pantry">Pantry Staples</option>
                                                <option value="snacks">Snacks</option>
                                                <option value="beverages">Beverages</option>
                                            </>
                                        )}
                                        {categoryFilter === 'healthBeauty' && (
                                            <>
                                                <option value="skincare">Skincare</option>
                                                <option value="makeup">Makeup</option>
                                                <option value="haircare">Hair Care</option>
                                                <option value="bath-body">Bath & Body</option>
                                                <option value="fragrances">Fragrances</option>
                                                <option value="personal-care">Personal Care</option>
                                                <option value="vitamins">Vitamins & Supplements</option>
                                            </>
                                        )}
                                        {categoryFilter === 'sportsFitness' && (
                                            <>
                                                <option value="exercise-equipment">Exercise Equipment</option>
                                                <option value="activewear">Activewear</option>
                                                <option value="sports-gear">Sports Gear</option>
                                                <option value="outdoor-recreation">Outdoor Recreation</option>
                                                <option value="supplements">Sports Supplements</option>
                                            </>
                                        )}
                                        {categoryFilter === 'babyKids' && (
                                            <>
                                                <option value="diapering">Diapering</option>
                                                <option value="baby-gear">Baby Gear</option>
                                                <option value="nursery">Nursery</option>
                                                <option value="feeding">Feeding</option>
                                                <option value="toys">Toys</option>
                                                <option value="kids-clothing">Kids Clothing</option>
                                            </>
                                        )}
                                        {categoryFilter === 'automotive' && (
                                            <>
                                                <option value="car-care">Car Care</option>
                                                <option value="interior-accessories">Interior Accessories</option>
                                                <option value="exterior-accessories">Exterior Accessories</option>
                                                <option value="tools-equipment">Tools & Equipment</option>
                                                <option value="motorcycle-accessories">Motorcycle Accessories</option>
                                            </>
                                        )}
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
                                        <option value="BestSelling">Best Selling</option>
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
                                                    <span className={`mp-badge active`}>
                                                        <CheckCircle2 size={12} />
                                                        Active
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
                                                            title="View Product"
                                                            onClick={() => openViewModal(product)}
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
                            <h3><Edit2 size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Edit Product</h3>
                            <button className="mp-modal-close" onClick={closeModals}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleEditSave}>
                            <div className="mp-modal-body">

                                {/* 1. Basic Info Section */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Package size={20} />
                                        <h4>Product Information</h4>
                                    </div>
                                    <div className="mp-form-group">
                                        <label>Product Name</label>
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
                                                <option value="electronics">Electronics</option>
                                                <option value="computers">Computers & Accessories</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="homeLifestyle">Home & Lifestyle</option>
                                                <option value="groceries">Groceries</option>
                                                <option value="healthBeauty">Health & Beauty</option>
                                                <option value="sportsFitness">Sports & Fitness</option>
                                                <option value="babyKids">Baby & Kids</option>
                                                <option value="automotive">Automotive</option>
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
                                        <label>Product Description <span className="mp-req">*</span></label>
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
                                        <h4>Product Images <span className="mp-req">*</span></h4>
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

