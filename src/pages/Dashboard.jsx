import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  Users, 
  User,
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  PlusCircle,
  FileText,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import API from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and recent complaints in parallel
        const [statsRes, complaintsRes] = await Promise.all([
          API.get('/api/complaints/stats'),
          API.get('/api/complaints')
        ]);

        if (statsRes.data) {
          setStats({
            total: statsRes.data.totalComplaints || 0,
            pending: statsRes.data.openComplaints || 0,
            resolved: statsRes.data.resolvedComplaints || 0,
            inProgress: (statsRes.data.openComplaints || 0) // Simplified
          });
        }
        
        if (complaintsRes.data && Array.isArray(complaintsRes.data)) {
          setRecentComplaints(complaintsRes.data.slice(0, 5)); // Show only top 5
        } else {
          setRecentComplaints([]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsCards = [
    { title: 'Total Cases', value: stats.total, icon: <LayoutDashboard className="text-blue-600" />, bg: 'bg-blue-100/50' },
    { title: 'Pending Support', value: stats.pending, icon: <Clock className="text-amber-600" />, bg: 'bg-amber-100/50' },
    { title: 'In Resolution', value: stats.inProgress, icon: <TrendingUp className="text-purple-600" />, bg: 'bg-purple-100/50' },
    { title: 'Resolved', value: stats.resolved, icon: <CheckCircle2 className="text-emerald-600" />, bg: 'bg-emerald-100/50' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Welcome back, <span className="text-primary-600">{user.name || 'User'}</span>.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search IDs or keywords..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all w-72 text-sm font-bold shadow-sm"
              />
            </div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-[20px] hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <button className="text-slate-300 hover:text-slate-500 transition-colors p-1">
                  <MoreVertical size={20} />
                </button>
              </div>
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.1em]">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{card.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity List */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Developments</h2>
              <button className="flex items-center gap-1.5 text-primary-600 font-black text-xs uppercase tracking-widest hover:text-primary-700 transition-colors">
                View Repository <ChevronRight size={16} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-12 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl"></div>)}
                </div>
              ) : recentComplaints.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">No active cases reported yet.</p>
                </div>
              ) : (
                recentComplaints.map((complaint) => (
                  <motion.div 
                    key={complaint.id} 
                    whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
                    className="p-8 flex items-start gap-6 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                  >
                    <div className="bg-primary-50 p-4 rounded-2xl group-hover:bg-primary-100 transition-colors">
                      <AlertCircle className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">{complaint.title}</h4>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${
                          complaint.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          complaint.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium text-base line-clamp-1 leading-relaxed">{complaint.description}</p>
                      <div className="flex items-center gap-6 mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 border-r border-slate-200 pr-6"><User size={14} className="text-primary-500" /> {complaint.userName}</span>
                        <span className="flex items-center gap-2"><Clock size={14} className="text-amber-500" /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Side Panels */}
          <div className="space-y-8">


            <motion.div 
              variants={itemVariants}
              className="glass p-8 rounded-[40px] space-y-6"
            >
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Priority Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/submit')}
                  className="w-full flex items-center justify-between p-5 rounded-[24px] bg-white border border-slate-100 text-slate-700 font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all group shadow-sm"
                >
                  <span className="flex items-center gap-3">
                    <PlusCircle size={20} className="text-primary-600 group-hover:text-white" />
                    Initialize Case
                  </span>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" />
                </button>

              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
