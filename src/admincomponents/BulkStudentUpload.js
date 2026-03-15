import React, { useState } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, FileSpreadsheet, RefreshCw } from 'lucide-react';

function BulkStudentUpload({ onSuccess }) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
            setFile(droppedFile);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Please upload only .xlsx or .csv files' });
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage({ type: '', text: '' });
        }
    };

    const downloadTemplate = () => {
        // Create CSV template
        const headers = [
            'admissionYear', 'degree', 'branch', 'section', 'regulation',
            'firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender',
            'bloodGroup', 'category', 'nationality',
            'primaryMobile', 'personalEmail',
            'tenthBoard', 'tenthPercentage', 'tenthYear',
            'twelfthBoard', 'twelfthPercentage', 'twelfthYear', 'twelfthStream',
            'entranceExam', 'entranceRank', 'entranceScore'
        ];

        const sampleData = [
            '2024', 'B.Tech', 'Computer Science & Engineering', 'A', 'R22',
            'John', 'Kumar', 'Doe', '2005-08-15', 'Male',
            'A+', 'General', 'Indian',
            '9876543210', 'john.doe@email.com',
            'CBSE', '95.5', '2021',
            'State Board', '92.3', '2023', 'MPC',
            'EAMCET', '1234', '145.5'
        ];

        const csvContent = headers.join(',') + '\n' + sampleData.join(',');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'student_upload_template.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const processFile = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a file first' });
            return;
        }

        setIsProcessing(true);
        setMessage({ type: '', text: '' });
        setResults(null);

        try {
            // Read file content
            const fileContent = await file.text();
            const lines = fileContent.split('\n');
            const headers = lines[0].split(',');

            const students = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const values = lines[i].split(',');
                    const student = {};
                    headers.forEach((header, index) => {
                        student[header.trim()] = values[index]?.trim();
                    });
                    students.push(student);
                }
            }

            // Send to backend
            const response = await fetch('http://localhost:5000/admin/bulk-upload-students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ students })
            });

            const data = await response.json();

            if (data.success) {
                setResults(data.results);
                setMessage({
                    type: 'success',
                    text: `Upload completed! ${data.results.successful} students added successfully.`
                });
                if (onSuccess) onSuccess();
            } else {
                setMessage({ type: 'error', text: data.error || 'Upload failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error processing file. Please check the format.' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Students</h2>
                    <p className="text-gray-600 mt-1">Upload multiple students at once using Excel or CSV file</p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Download Template */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Step 1: Download Template</h3>
                            <p className="text-sm text-blue-700">Download the Excel template and fill in student details</p>
                        </div>
                        <button
                            onClick={downloadTemplate}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Template</span>
                        </button>
                    </div>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Step 2: Upload Filled Template</h3>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium mb-2">
                            Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Supports .xlsx and .csv files (Max 5MB)</p>
                        <input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Choose File</span>
                        </label>

                        {file && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-block">
                                <p className="text-sm text-green-700">
                                    <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Process Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            setFile(null);
                            setResults(null);
                            setMessage({ type: '', text: '' });
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={processFile}
                        disabled={!file || isProcessing}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                <span>Upload & Process</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Results */}
                {results && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Upload Results</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                                <p className="text-2xl font-bold text-gray-900">{results.total}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-600 mb-1">Successful</p>
                                <p className="text-2xl font-bold text-green-700">{results.successful}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-600 mb-1">Failed</p>
                                <p className="text-2xl font-bold text-red-700">{results.failed}</p>
                            </div>
                        </div>

                        {results.errors && results.errors.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {results.errors.map((error, index) => (
                                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                                            <p className="text-red-700">
                                                <strong>Row {error.row}:</strong> {error.name || ''} - {error.error}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BulkStudentUpload;
