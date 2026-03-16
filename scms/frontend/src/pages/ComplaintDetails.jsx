import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { AuthContext } from '../context/AuthContext';

const ComplaintDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await api.get(`/complaints/${id}`);
            setComplaint(res.data);
            setStatusUpdate(res.data.status);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/complaints/${id}/status`, {
                status: statusUpdate,
                comment: comment
            });
            setComment('');
            fetchComplaint(); // Refresh data
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-gray-600 dark:text-gray-300">Loading details...</div>;
    if (!complaint) return <div className="p-8 text-red-500">Complaint not found.</div>;

    const isStaffOrAdmin = user?.roles?.includes('ROLE_STAFF') || user?.roles?.includes('ROLE_ADMIN');

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Details #{complaint.id}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h2>
                                <p className="text-gray-500 text-sm mt-1">Submitted by {complaint.userName} on {new Date(complaint.createdAt).toLocaleString()}</p>
                            </div>
                            <StatusBadge status={complaint.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-darkSidebar p-3 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Category</span>
                                <span className="font-medium text-gray-900 dark:text-white">{complaint.category}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-darkSidebar p-3 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Priority</span>
                                <PriorityBadge priority={complaint.priority} />
                            </div>
                            <div className="bg-gray-50 dark:bg-darkSidebar p-3 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Location</span>
                                <span className="font-medium text-gray-900 dark:text-white">{complaint.location}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-darkSidebar p-3 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Assigned To</span>
                                <span className="font-medium text-gray-900 dark:text-white">{complaint.assignedStaffName || 'Unassigned'}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                        </div>
                    </div>

                    {isStaffOrAdmin && (
                        <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Status</h3>
                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Status</label>
                                    <select 
                                        value={statusUpdate}
                                        onChange={(e) => setStatusUpdate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="ASSIGNED">Assigned</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment / Update Note</label>
                                    <textarea 
                                        rows="3"
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                                        placeholder="Add a note about this update..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-blue-600 font-medium">
                                    Save Update
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">History Timeline</h3>
                        <div className="space-y-6">
                            {!complaint.history || complaint.history.length === 0 ? (
                                <p className="text-gray-500 text-sm">No updates yet.</p>
                            ) : (
                                complaint.history.map((update, idx) => (
                                    <div key={idx} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary-light border-4 border-white dark:border-darkCard"></span>
                                        <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(update.timestamp).toLocaleString()} by {update.updatedBy}
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white mb-2">
                                            Status updated to <StatusBadge status={update.status} />
                                        </div>
                                        {update.comment && (
                                            <div className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-darkSidebar p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                                {update.comment}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
