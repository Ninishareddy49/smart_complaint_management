import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { StatusChart, CategoryChart } from '../components/Charts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, in_progress: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAdmin) {
                    const analyticsRes = await api.get('/admin/analytics');
                    setStats({
                        total: analyticsRes.data.totalComplaints,
                        open: analyticsRes.data.openComplaints,
                        resolved: analyticsRes.data.resolvedComplaints,
                        in_progress: 0 // Mocking for now from analytics DTO
                    });
                }
                const complaintsRes = await api.get('/complaints');
                setRecentComplaints(complaintsRes.data.slice(0, 5));
                
                if (!isAdmin) {
                    const data = complaintsRes.data;
                    setStats({
                        total: data.length,
                        open: data.filter(c => c.status === 'OPEN').length,
                        resolved: data.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
                        in_progress: data.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length,
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin]);

    if (loading) {
        return <div className="text-gray-600 dark:text-gray-300">Loading dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Complaints', value: stats.total, icon: <FileText className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { title: 'Open', value: stats.open, icon: <AlertCircle className="w-8 h-8 text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { title: 'In Progress', value: stats.in_progress, icon: <Clock className="w-8 h-8 text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { title: 'Resolved', value: stats.resolved, icon: <CheckCircle className="w-8 h-8 text-green-500" />, bg: 'bg-green-50 dark:bg-green-900/20' },
    ];

    // Mock data for charts
    const statusData = [
        { name: 'Open/Assigned', value: stats.open + stats.in_progress || 10 },
        { name: 'Resolved', value: stats.resolved || 5 },
    ];

    const categoryData = [
        { name: 'Electrical', count: 12 },
        { name: 'Plumbing', count: 8 },
        { name: 'Internet', count: 24 },
        { name: 'Cleaning', count: 10 },
        { name: 'Other', count: 5 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-transform hover:scale-105 duration-200">
                        <div className={`p-4 rounded-lg ${card.bg}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {isAdmin && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complaints by Status</h3>
                        <StatusChart data={statusData} />
                    </div>
                    <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complaints by Category</h3>
                        <CategoryChart data={categoryData} />
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-darkSidebar text-xs uppercase text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No recent complaints found.</td>
                                </tr>
                            ) : (
                                recentComplaints.map((complaint) => (
                                    <tr key={complaint.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-darkSidebar/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{complaint.title}</td>
                                        <td className="px-6 py-4">{complaint.category}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 dark:text-gray-300">{complaint.status}</span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(complaint.createdAt).toLocaleDateString()}</td>
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

export default Dashboard;
