import React, { useState, useEffect } from 'react';
import {
    LayoutGrid,
    Plus,
    Search,
    Edit3,
    Trash2,
    X,
    Upload,
    Palette,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import ConfirmModal from '../../components/common/ConfirmModal';
import './ManageCategories.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        color: '#1B3BFF',
        image: '',
        icon: '',
        isActive: true
    });

    const API_URL = 'http://localhost:5000/api/categories';

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({
                name: cat.name,
                color: cat.color || '#1B3BFF',
                image: cat.image || '',
                icon: cat.icon || '',
                isActive: cat.isActive !== undefined ? cat.isActive : true
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                color: '#1B3BFF',
                image: '',
                icon: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`${API_URL}/${editingCategory._id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category. Make sure the name is unique.');
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        try {
            await axios.delete(`${API_URL}/${confirmDelete.id}`);
            setConfirmDelete({ isOpen: false, id: null });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mcat-page-wrapper">
            {/* 1. Page Header */}
            <div className="mcat-header">
                <div className="mcat-header-left">
                    <h1 className="mcat-title">Manage Categories</h1>
                    <p className="mcat-subtitle">Create and organize business categories for the marketplace</p>
                </div>
                <button className="mcat-add-btn" onClick={() => handleOpenModal()}>
                    <Plus size={20} /> Add New Category
                </button>
            </div>

            {/* 2. Stats Bar */}
            <div className="mcat-stats-row">
                <div className="mcat-stat-card">
                    <div className="mcat-stat-icon blue"><LayoutGrid size={22} /></div>
                    <div className="mcat-stat-info">
                        <strong>{categories.length}</strong>
                        <span>Total Categories</span>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="mcat-search-area adlay-shadow">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Search category by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* 3. Table */}
            <div className="mcat-table-card adlay-shadow">
                <div className="mcat-table-wrap">
                    <table className="mcat-table">
                        <thead>
                            <tr>
                                <th>Category Structure</th>
                                <th>Visual Theme</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-10">Loading categories...</td></tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-10">No categories found.</td></tr>
                            ) : (
                                filteredCategories.map(cat => (
                                    <tr key={cat._id}>
                                        <td>
                                            <div className="mcat-info-cell">
                                                <div className="mcat-img-box">
                                                    {cat.image ? <img src={cat.image} alt={cat.name} /> : < ImageIcon size={24} color="#94a3b8" />}
                                                </div>
                                                <div className="mcat-name-box">
                                                    <span className="mcat-name">{cat.name}</span>
                                                    <span className="mcat-slug">URL: /{cat.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mcat-theme-cell">
                                                <div className="mcat-color-dot" style={{ backgroundColor: cat.color }}></div>
                                                <div className="mcat-icon-preview">
                                                    {cat.icon ? <img src={cat.icon} alt="icon" /> : <LayoutGrid size={16} />}
                                                </div>
                                                <span className="mcat-color-code">{cat.color || '#1B3BFF'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`mcat-status-pill ${cat.isActive ? 'active' : 'inactive'}`}>
                                                {cat.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                {cat.isActive ? 'Live' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="mcat-actions">
                                                <button className="mcat-icon-btn edit" title="Edit" onClick={() => handleOpenModal(cat)}>
                                                    <Edit3 size={18} />
                                                </button>
                                                <button className="mcat-icon-btn delete" title="Delete" onClick={() => setConfirmDelete({ isOpen: true, id: cat._id })}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Add/Edit Modal */}
            {isModalOpen && (
                <div className="mcat-modal-overlay">
                    <div className="mcat-modal-container animate-slide-up">
                        <header className="mcat-modal-header">
                            <div className="mcat-mh-left">
                                <div className="mcat-icon-circle">
                                    <LayoutGrid size={22} color="#1B3BFF" />
                                </div>
                                <div>
                                    <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
                                    <p>Configure the look and feel of the marketplace category</p>
                                </div>
                            </div>
                            <button className="mcat-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </header>

                        <form className="mcat-form" onSubmit={handleSubmit}>
                            <div className="mcat-modal-body-flex">
                                {/* Left Side: Form Fields */}
                                <div className="mcat-form-main-fields">
                                    <div className="mcat-form-grid">
                                        <div className="mcat-form-group span-2">
                                            <label>Category Name</label>
                                            <div className="mcat-input-wrap">
                                                <LayoutGrid size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Salon, Restaurant, Electronics" 
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group">
                                            <label>Theme Color</label>
                                            <div className="mcat-color-input-wrap">
                                                <Palette size={18} />
                                                <input 
                                                    type="color" 
                                                    value={formData.color}
                                                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                                                />
                                                <span className="mcat-color-label">{formData.color}</span>
                                            </div>
                                        </div>

                                        <div className="mcat-form-group">
                                            <label>Status</label>
                                            <div className="mcat-toggle-wrap">
                                                <button 
                                                    type="button"
                                                    className={`mcat-toggle-btn ${formData.isActive ? 'active' : ''}`}
                                                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                                >
                                                    <div className="mcat-toggle-thumb"></div>
                                                </button>
                                                <span>{formData.isActive ? 'Active' : 'Hidden'}</span>
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2">
                                            <label>Thumbnail Image URL</label>
                                            <div className="mcat-input-wrap">
                                                <ImageIcon size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="https://example.com/image.png" 
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2">
                                            <label>Icon Image URL</label>
                                            <div className="mcat-input-wrap">
                                                <Upload size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="https://example.com/icon.svg" 
                                                    value={formData.icon}
                                                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Preview Panel */}
                                <div className="mcat-modal-preview-panel">
                                    <div className="mcat-preview-section">
                                        <h4>Live Preview</h4>
                                        <div className="mcat-preview-box">
                                            <div className="cat-premium-card" style={{ maxWidth: '180px', margin: '0' }}>
                                                <div className="cat-circle-frame">
                                                    <div className="cat-img-inner-circle">
                                                        {formData.image ? <img src={formData.image} alt="preview" /> : <div className="img-placeholder"></div>}
                                                    </div>
                                                </div>
                                                <div className="cat-label-box" style={{ 
                                                    backgroundColor: formData.color + '15',
                                                    borderColor: formData.color + '40'
                                                }}>
                                                    <div className="cat-card-icon-wrap">
                                                        {formData.icon ? <img src={formData.icon} alt="icon" style={{width:'18px', height: '18px'}}/> : <LayoutGrid size={16} color={formData.color}/>}
                                                    </div>
                                                    <span className="cat-label-text">{formData.name || 'Category'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mcat-preview-hint">Real-time storefront appearance</p>
                                    </div>
                                </div>
                            </div>

                            <footer className="mcat-modal-footer">
                                <button type="button" className="mcat-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="mcat-btn-save">
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmModal 
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Category?"
                message="Are you sure you want to permanently delete this category? This will also affect deals assigned to it."
                confirmText="Delete Permanently"
                type="danger"
            />
        </div>
    );
};

export default ManageCategories;
