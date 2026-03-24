import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  Database,
  Search, 
  Trash2,
  Calendar,
  AlertCircle,
  Tag,
  Clock,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get('/api/admin/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching all complaints", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this complaint and all its updates? This action cannot be undone.")) return;
    
    try {
      await API.delete(`/api/admin/complaints/${id}`);
      setComplaints(complaints.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting complaint", err);
      alert("Failed to delete complaint. It may be protected or linked to critical data.");
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
                <Database className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global Network Complaints</h1>
                <p className="text-slate-500 font-bold mt-1 text-lg">System-wide surveillance and data removal matrix.</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
             <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[var(--color-primary-600)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search case logs..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all w-72 text-sm font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Master Ledger Vault</h2>
            <div className="flex gap-2">
                <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest">{filteredComplaints.length} Total Logs</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-red-600"></motion.div>
              <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing global records...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-lg">No complaint signatures match your parameters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredComplaints.map((complaint) => (
                <motion.div 
                  key={complaint.id} 
                  whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
                  className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-xl border ${
                      complaint.status === 'CLOSED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      complaint.status === 'RESOLVED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      #{complaint.id}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link to={`/complaints/${complaint.id}`} className="text-xl font-extrabold text-slate-900 tracking-tight hover:text-primary-600 transition-colors">
                          {complaint.title}
                        </Link>
                        <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border bg-slate-50 text-slate-500 border-slate-200 flex items-center gap-1">
                          <Tag size={10} /> {complaint.category.replace(/_/g, ' ')}
                        </span>
                        {complaint.priority === 'HIGH' && (
                          <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border bg-red-50 text-red-600 border-red-100">
                            Urgent Priority
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-5 text-xs font-bold text-slate-400 uppercase tracking-wide flex-wrap">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300" /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                        {complaint.user && (
                           <span className="flex items-center gap-1.5 select-all">User: {complaint.user.email}</span>
                        )}
                        <span className="flex items-center gap-1.5">
                          Status: <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{complaint.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <Link to={`/complaints/${complaint.id}`} className="p-3 bg-white border border-slate-200 rounded-[18px] text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all shadow-sm active:scale-95" title="View Secure Log">
                      <Eye size={20} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteComplaint(complaint.id)}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-[18px] text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95"
                      title="Permanently Delete Evidence"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
