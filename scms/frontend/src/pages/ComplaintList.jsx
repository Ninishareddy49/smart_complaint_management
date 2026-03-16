import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { Search } from 'lucide-react';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading complaints...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints</h1>
                <Link to="/submit" className="px-4 py-2 bg-primary-light text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                    New Complaint
                </Link>
            </div>

            <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 relative">
                    <Search className="w-5 h-5 absolute top-6 left-6 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-darkSidebar border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-darkSidebar text-xs uppercase text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4">Title & Location</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No complaints found.</td>
                                </tr>
                            ) : (
                                filteredComplaints.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-darkSidebar/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{c.location}</p>
                                        </td>
                                        <td className="px-6 py-4">{c.category}</td>
                                        <td className="px-6 py-4"><PriorityBadge priority={c.priority} /></td>
                                        <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                        <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/complaint/${c.id}`} className="font-medium text-primary-light hover:text-primary-dark">
                                                View API
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComplaintList;
