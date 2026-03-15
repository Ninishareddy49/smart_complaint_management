import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  Mail, 
  Calendar,
  UserCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import API from '../services/api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Management</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Manage personnel and system access protocols.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
             <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[var(--color-primary-600)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search identifiers..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all w-72 text-sm font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-[20px] hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </motion.div>
        </div>

        {/* User Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="bg-blue-50 p-4 rounded-2xl">
                    <Users size={24} className="text-blue-600" />
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900">{users.length}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Entities</p>
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="bg-purple-50 p-4 rounded-2xl">
                    <UserCheck size={24} className="text-purple-600" />
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900">
                        {users.filter(u => u.role === 'ROLE_STAFF').length}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Specialized Resolvers</p>
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600 to-primary-700 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                    <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                    <h4 className="text-3xl font-black">94%</h4>
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mt-1">System Efficiency</p>
                </div>
            </motion.div>
        </div>

        {/* User Table Alternative (Card Grid) */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Control List</h2>
            <div className="flex gap-2">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">Live Syncing</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-primary-600"></motion.div>
              <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Retrieving encrypted data...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-lg">No identifiers match your signature.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <motion.div 
                  key={user.id} 
                  whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
                  className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[20px] bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl border border-slate-200">
                      {user.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">{user.name}</h4>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                          user.role === 'ROLE_ADMIN' ? 'bg-red-50 text-red-600 border-red-100' :
                          user.role === 'ROLE_STAFF' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-300" /> {user.email}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-[18px] text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                      View Profile
                    </button>
                    <button className="p-3 bg-slate-50 border border-slate-200 rounded-[18px] text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all">
                      <ShieldCheck size={20} />
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
