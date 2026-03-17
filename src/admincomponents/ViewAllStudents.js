import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

function ViewAllStudents() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        year: '',
        degree: '',
        branch: '',
        section: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [students, searchTerm, filters]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:5000/admin/students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setStudents(data.students || []);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load students' });
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...students];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.personal?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.personal?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.contact?.primaryMobile?.includes(searchTerm)
            );
        }

        // Year filter
        if (filters.year) {
            filtered = filtered.filter(s => s.academic?.admissionYear === parseInt(filters.year));
        }

        // Degree filter
        if (filters.degree) {
            filtered = filtered.filter(s => s.academic?.degree === filters.degree);
        }

        // Branch filter
        if (filters.branch) {
            filtered = filtered.filter(s => s.academic?.branch === filters.branch);
        }

        // Section filter
        if (filters.section) {
            filtered = filtered.filter(s => s.academic?.section === filters.section);
        }

        setFilteredStudents(filtered);
        setCurrentPage(1);
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/admin/students/${studentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Student deleted successfully' });
                fetchStudents();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to delete student' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error deleting student' });
        }
    };

    const exportToCSV = () => {
        const headers = ['Student ID', 'Name', 'Degree', 'Branch', 'Section', 'Year', 'Mobile', 'Email'];
        const rows = filteredStudents.map(s => [
            s.studentId,
            `${s.personal?.firstName} ${s.personal?.lastName}`,
            s.academic?.degree,
            s.academic?.branch,
            s.academic?.section,
            s.academic?.admissionYear,
            s.contact?.primaryMobile,
            s.universityEmail
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'students_list.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Students</h2>
                    <p className="text-gray-600 mt-1">
                        Showing {filteredStudents.length} of {students.length} students
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchStudents}
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

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, name, or mobile..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <select
                            value={filters.year}
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Years</option>
                            {[2024, 2023, 2022, 2021, 2020].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Degree Filter */}
                    <div>
                        <select
                            value={filters.degree}
                            onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Degrees</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="MBA">MBA</option>
                        </select>
                    </div>

                    {/* Section Filter */}
                    <div>
                        <select
                            value={filters.section}
                            onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Sections</option>
                            {['A', 'B', 'C', 'D', 'E'].map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading students...</p>
                    </div>
                ) : currentItems.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-600">No students found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Degree
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Section
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
                                    {currentItems.map((student) => (
                                        <tr key={student.studentId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {student.studentId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.personal?.firstName} {student.personal?.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.academic?.degree}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.academic?.branchCode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.academic?.section}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.contact?.primaryMobile}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${student.account?.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {student.account?.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student.studentId)}
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} results
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

export default ViewAllStudents;
