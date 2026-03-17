import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

function ViewAllFaculty() {
    const [faculty, setFaculty] = useState([]);
    const [filteredFaculty, setFilteredFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        designation: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchFaculty();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [faculty, searchTerm, filters]);

    const fetchFaculty = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:5000/admin/faculty', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setFaculty(data.faculty || []);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load faculty' });
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...faculty];

        if (searchTerm) {
            filtered = filtered.filter(fac =>
                fac.facultyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fac.personal?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fac.personal?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fac.contact?.primaryMobile?.includes(searchTerm)
            );
        }

        if (filters.department) {
            filtered = filtered.filter(f => f.professional?.department === filters.department);
        }

        if (filters.designation) {
            filtered = filtered.filter(f => f.professional?.designation === filters.designation);
        }

        setFilteredFaculty(filtered);
        setCurrentPage(1);
    };

    const handleDelete = async (facultyId) => {
        if (!window.confirm('Are you sure you want to delete this faculty member?')) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/admin/faculty/${facultyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Faculty deleted successfully' });
                fetchFaculty();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to delete faculty' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error deleting faculty' });
        }
    };

    const exportToCSV = () => {
        const headers = ['Faculty ID', 'Name', 'Department', 'Designation', 'Mobile', 'Email', 'Joining Year'];
        const rows = filteredFaculty.map(f => [
            f.facultyId,
            `${f.personal?.firstName} ${f.personal?.lastName}`,
            f.professional?.department,
            f.professional?.designation,
            f.contact?.primaryMobile,
            f.universityEmail,
            f.professional?.joiningYear
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'faculty_list.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Faculty</h2>
                    <p className="text-gray-600 mt-1">
                        Showing {filteredFaculty.length} of {faculty.length} faculty members
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchFaculty}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, name, or mobile..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={filters.designation}
                            onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">All Designations</option>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading faculty...</p>
                    </div>
                ) : currentItems.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-600">No faculty found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Faculty ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Designation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mobile
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map((fac) => (
                                        <tr key={fac.facultyId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {fac.facultyId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {fac.personal?.firstName} {fac.personal?.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {fac.professional?.departmentCode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {fac.professional?.designation}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {fac.contact?.primaryMobile}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${fac.account?.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {fac.account?.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(fac.facultyId)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFaculty.length)} of {filteredFaculty.length} results
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-1 text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewAllFaculty;
