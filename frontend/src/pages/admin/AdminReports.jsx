import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    Calendar,
    Download,
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    FileText,
    FileSpreadsheet,
    Package,
    Store,
    RefreshCcw,
    ChevronDown
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminReports.css';

const AdminReports = () => {
    const [timeRange, setTimeRange] = useState('This Month');
    const [isExporting, setIsExporting] = useState(null); // 'csv' or 'pdf'
    const [customRangeDisplay, setCustomRangeDisplay] = useState('Mar 01 - Mar 07, 2026');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [tempDates, setTempDates] = useState({ start: '2026-03-01', end: '2026-03-07' });

    // Date mapping
    const dateRanges = {
        'Today': 'Mar 07, 2026',
        'This Week': 'Mar 01 - Mar 07, 2026',
        'This Month': 'Mar 01 - Mar 31, 2026',
        'Custom': customRangeDisplay
    };

    const handleCalendarClick = () => {
        if (timeRange === 'Custom') {
            setIsDatePickerOpen(true);
        }
    };

    const handleApplyCustomRange = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
        };
        const displayString = `${formatDate(tempDates.start)} - ${formatDate(tempDates.end)}, 2026`;
        setCustomRangeDisplay(displayString);
        setIsDatePickerOpen(false);
    };

    const handleExport = (type) => {
        setIsExporting(type);
        setTimeout(() => {
            setIsExporting(null);

            const reportDateRange = timeRange === 'Custom' ? customRangeDisplay : dateRanges[timeRange];
            const safeRangeName = reportDateRange.replace(/[^a-zA-Z0-9]/g, '_');

            if (type === 'csv') {
                let csvContent = "";

                csvContent += "Top Clicked Deals\nDeal,Partner,Clicks,Revenue\n";
                topProducts.forEach(p => {
                    const revNum = p.revenue.replace(/,/g, '').replace('Rs ', '');
                    csvContent += `"${p.name}","${p.client}",${p.sales},${revNum}\n`;
                });

                csvContent += "\nTop Performing Partners\nPartner Store,Owner,Total Clicks,Platform Revenue\n";
                topClients.forEach(s => {
                    const revNum = s.revenue.replace(/,/g, '').replace('Rs ', '');
                    csvContent += `"${s.store}","${s.client}",${s.clicks},${revNum}\n`;
                });

                csvContent += "\nMost Reported Deals\nDeal Name,Reports,Primary Reason\n";
                returnedProducts.forEach(r => {
                    csvContent += `"${r.name}",${r.returnCount},"${r.reason}"\n`;
                });

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `HodamaDeals_Report_${safeRangeName}.csv`;
                a.click();
            } else if (type === 'pdf') {
                const doc = new jsPDF();

                doc.setFontSize(22);
                doc.setTextColor(20, 58, 230);
                doc.text("Hodama Deals - Analytics Report", 14, 22);

                doc.setFontSize(11);
                doc.setTextColor(100, 100, 100);
                doc.text(`Report Period: ${reportDateRange}`, 14, 30);

                doc.setFontSize(14);
                doc.setTextColor(40, 40, 40);
                doc.text("Top Clicked Deals", 14, 45);

                autoTable(doc, {
                    startY: 50,
                    head: [['Deal Name', 'Partner', 'Clicks', 'Platform Revenue']],
                    body: topProducts.map(p => [p.name, p.client, p.sales, p.revenue]),
                    headStyles: { fillColor: [20, 58, 230] }
                });

                doc.text("Top Performing Clients", 14, doc.lastAutoTable.finalY + 15);
                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [['Partner Store', 'Owner', 'Total Clicks', 'Platform Revenue']],
                    body: topClients.map(s => [s.store, s.client, s.clicks, s.revenue]),
                    headStyles: { fillColor: [16, 185, 129] }
                });

                doc.text("Most Reported Deals", 14, doc.lastAutoTable.finalY + 15);
                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [['Deal Name', 'Reports', 'Primary Reason']],
                    body: returnedProducts.map(r => [r.name, r.returnCount, r.reason]),
                    headStyles: { fillColor: [239, 68, 68] }
                });

                doc.save(`HodamaDeals_Report_${safeRangeName}.pdf`);
            }
        }, 1200);
    };

    // Mock Data for Charts
    const salesData = [
        { name: 'Mon', sales: 4000, revenue: 2400 },
        { name: 'Tue', sales: 3000, revenue: 1398 },
        { name: 'Wed', sales: 2000, revenue: 9800 },
        { name: 'Thu', sales: 2780, revenue: 3908 },
        { name: 'Fri', sales: 1890, revenue: 4800 },
        { name: 'Sat', sales: 2390, revenue: 3800 },
        { name: 'Sun', sales: 3490, revenue: 4300 },
    ];

    const revenueTrendData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: 67000 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Fashion', value: 300 },
        { name: 'Home', value: 300 },
        { name: 'Beauty', value: 200 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const topProducts = [
        { id: '1', name: 'Wireless Headphones', client: 'TechStore', sales: 340, revenue: 'Rs 1,530,000' },
        { id: '2', name: 'Smart Watch Series 7', client: 'GadgetHub', sales: 210, revenue: 'Rs 2,520,000' },
        { id: '3', name: 'Premium Leather Bag', client: 'FashionHub', sales: 185, revenue: 'Rs 1,572,500' },
        { id: '4', name: 'Bluetooth Speaker', client: 'SoundBox', sales: 150, revenue: 'Rs 480,000' },
    ];

    const topClients = [
        { id: '1', store: 'TechStore', client: 'Nimal Perera', clicks: 12500, revenue: 'Rs 562,500' },
        { id: '2', store: 'FashionHub', client: 'Hashni Rehana', clicks: 8400, revenue: 'Rs 336,000' },
        { id: '3', store: 'GadgetHub', client: 'Kamal Silva', clicks: 6200, revenue: 'Rs 744,000' },
    ];

    const returnedProducts = [
        { id: '1', name: 'AirPods Pro Replica', returnCount: 45, reason: 'Broken Affiliate Link' },
        { id: '2', name: 'MacBook Scam Deal', returnCount: 32, reason: 'Misleading Offer' },
        { id: '3', name: 'Gaming Mouse', returnCount: 28, reason: 'Code Expired' },
    ];

    return (
        <div className="ar-page-wrapper">
            {/* 1. Page Header */}
            <div className="ar-header">
                <div className="ar-header-left">
                    <h1 className="ar-title">Reports & Analytics</h1>
                    <p className="ar-subtitle">Comprehensive insights into marketplace performance and growth trends</p>
                </div>
                <div className="ar-header-right">
                    <div className="ar-export-group">
                        <button
                            className={`ar-btn-outline ${isExporting === 'csv' ? 'loading' : ''}`}
                            onClick={() => handleExport('csv')}
                            disabled={isExporting}
                        >
                            {isExporting === 'csv' ? <RefreshCcw className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
                            {isExporting === 'csv' ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button
                            className={`ar-btn-outline ${isExporting === 'pdf' ? 'loading' : ''}`}
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting}
                        >
                            {isExporting === 'pdf' ? <RefreshCcw className="animate-spin" size={18} /> : <FileText size={18} />}
                            {isExporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Date Filters & Quick Stats */}
            <div className="ar-controls-bar">
                <div className="ar-range-picker">
                    {['Today', 'This Week', 'This Month', 'Custom'].map(range => (
                        <button
                            key={range}
                            className={`ar-range-btn ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range}
                        </button>
                    ))}
                    <div className={`ar-calendar-indicator ${timeRange === 'Custom' ? 'interactive' : ''}`} onClick={handleCalendarClick}>
                        <Calendar size={18} />
                        <span>{dateRanges[timeRange]}</span>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>

            {/* Analytics Hero Section */}
            <div className="ar-stats-row">
                <div className="ar-stat-card adlay-shadow">
                    <div className="ar-card-body">
                        <div className="ar-stat-info">
                            <span className="ar-label">Total Revenue</span>
                            <div className="ar-val-row">
                                <h2 className="ar-value">Rs 14.2M</h2>
                                <span className="ar-trend up"><ArrowUpRight size={14} /> 12.5%</span>
                            </div>
                        </div>
                        <div className="ar-icon-box bg-blue"><DollarSign size={24} /></div>
                    </div>
                </div>
                <div className="ar-stat-card adlay-shadow">
                    <div className="ar-card-body">
                        <div className="ar-stat-info">
                            <span className="ar-label">Deal Clicks</span>
                            <div className="ar-val-row">
                                <h2 className="ar-value">2,340</h2>
                                <span className="ar-trend up"><ArrowUpRight size={14} /> 8.2%</span>
                            </div>
                        </div>
                        <div className="ar-icon-box bg-green"><ShoppingBag size={24} /></div>
                    </div>
                </div>
                <div className="ar-stat-card adlay-shadow">
                    <div className="ar-card-body">
                        <div className="ar-stat-info">
                            <span className="ar-label">Active Users</span>
                            <div className="ar-val-row">
                                <h2 className="ar-value">12.5K</h2>
                                <span className="ar-trend up"><ArrowUpRight size={14} /> 5.1%</span>
                            </div>
                        </div>
                        <div className="ar-icon-box bg-purple"><Users size={24} /></div>
                    </div>
                </div>
                <div className="ar-stat-card adlay-shadow">
                    <div className="ar-card-body">
                        <div className="ar-stat-info">
                            <span className="ar-label">Conversion Rate</span>
                            <div className="ar-val-row">
                                <h2 className="ar-value">3.42%</h2>
                                <span className="ar-trend down"><ArrowDownRight size={14} /> 0.8%</span>
                            </div>
                        </div>
                        <div className="ar-icon-box bg-yellow"><TrendingUp size={24} /></div>
                    </div>
                </div>
            </div>

            {/* 3. Analytics Charts */}
            <div className="ar-charts-grid">
                {/* Sales Performance */}
                <div className="ar-chart-card adlay-shadow">
                    <div className="ar-chart-header">
                        <h3><ShoppingBag size={20} /> Sales Performance</h3>
                        <Filter size={18} />
                    </div>
                    <div className="ar-chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Trends */}
                <div className="ar-chart-card adlay-shadow">
                    <div className="ar-chart-header">
                        <h3><DollarSign size={20} /> Revenue Trends</h3>
                        <Download size={18} />
                    </div>
                    <div className="ar-chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueTrendData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="ar-chart-card adlay-shadow">
                    <div className="ar-chart-header">
                        <h3>Category Sales</h3>
                    </div>
                    <div className="ar-chart-container pie">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 4. Reports Tables */}
            <div className="ar-tables-row">
                {/* Top Deals */}
                <div className="ar-table-card adlay-shadow">
                    <div className="ar-card-header">
                        <h3><Package size={20} /> Top Clicked Deals</h3>
                        <button className="ar-link-btn" onClick={() => alert('Viewing all deals...')}>View All</button>
                    </div>
                    <table className="ar-data-table">
                        <thead>
                            <tr>
                                <th>Deal Name</th>
                                <th>Partner</th>
                                <th>Clicks</th>
                                <th className="text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map(p => (
                                <tr key={p.id}>
                                    <td><strong>{p.name}</strong></td>
                                    <td><span className="ar-store-tag">{p.client}</span></td>
                                    <td>{p.sales}</td>
                                    <td className="text-right ar-val-bold">{p.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Clients */}
                <div className="ar-table-card adlay-shadow">
                    <div className="ar-card-header">
                        <h3><Store size={20} /> Top Performing Clients</h3>
                        <button className="ar-link-btn" onClick={() => alert('Viewing all clients...')}>View All</button>
                    </div>
                    <table className="ar-data-table">
                        <thead>
                            <tr>
                                <th>Store</th>
                                <th>Owner</th>
                                <th>Deal Clicks</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topClients.map(s => (
                                <tr key={s.id}>
                                    <td><strong>{s.store}</strong></td>
                                    <td>{s.client}</td>
                                    <td>{s.clicks}</td>
                                    <td className="text-right ar-val-bold">{s.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Reporting Analysis */}
                <div className="ar-table-card adlay-shadow">
                    <div className="ar-card-header">
                        <h3><RefreshCcw size={20} /> Most Reported Deals</h3>
                    </div>
                    <table className="ar-data-table">
                        <thead>
                            <tr>
                                <th>Deal Name</th>
                                <th>Reports</th>
                                <th>Primary Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnedProducts.map(rp => (
                                <tr key={rp.id}>
                                    <td><strong>{rp.name}</strong></td>
                                    <td><span className="ar-count-pill">{rp.returnCount}</span></td>
                                    <td><span className="ar-reason-text">{rp.reason}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. Custom Date Picker Modal */}
            {isDatePickerOpen && (
                <div className="ar-modal-overlay" onClick={() => setIsDatePickerOpen(false)}>
                    <div className="ar-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="ar-modal-header">
                            <h3><Calendar size={20} /> Select Custom Range</h3>
                            <button className="ar-close-btn" onClick={() => setIsDatePickerOpen(false)}>&times;</button>
                        </div>
                        <div className="ar-modal-body">
                            <div className="ar-date-inputs">
                                <div className="ar-input-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={tempDates.start}
                                        onChange={e => setTempDates({ ...tempDates, start: e.target.value })}
                                    />
                                </div>
                                <div className="ar-input-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={tempDates.end}
                                        onChange={e => setTempDates({ ...tempDates, end: e.target.value })}
                                    />
                                </div>
                            </div>
                            <p className="ar-modal-hint">Analyze data for a specific period of your choice.</p>
                        </div>
                        <div className="ar-modal-footer">
                            <button className="ar-btn-cancel" onClick={() => setIsDatePickerOpen(false)}>Cancel</button>
                            <button className="ar-btn-apply" onClick={handleApplyCustomRange}>Apply Range</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
