import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  User,
  MapPin,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import API from '../services/api';

export default function StaffTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, ASSIGNED, IN_PROGRESS, RESOLVED

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/api/complaints');
      if (res.data && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'ASSIGNED': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'IN_PROGRESS': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CLOSED': return 'bg-slate-50 text-slate-700 border-slate-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const filteredTasks = filter === 'ALL' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

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
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Resolver Queue</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Manage and resolve high-priority intelligence reports.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
             <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all w-72 text-sm font-bold shadow-sm"
              />
            </div>
            <select 
              className="px-6 py-3.5 bg-white border border-slate-200 rounded-[20px] hover:bg-slate-50 transition-colors font-black text-xs text-slate-600 outline-none shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.25rem_center] pr-12 uppercase tracking-widest"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All States</option>
              <option value="OPEN">New / Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">Executing</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-primary-600"></motion.div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div variants={itemVariants} className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ClipboardList size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Queue Empty</h3>
            <p className="text-slate-400 mt-2 font-bold max-w-sm mx-auto">Standby for incoming intelligence reports. No tasks assigned currently.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTasks.map((task) => (
              <motion.div 
                key={task.id} 
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.005 }}
                className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all group overflow-hidden relative"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                  task.priority === 'URGENT' ? 'bg-red-500' : 
                  task.priority === 'HIGH' ? 'bg-amber-500' : 
                  'bg-primary-500'
                }`} />
                
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border ${getStatusColor(task.status)} shadow-sm`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                          <Clock size={14} className="text-slate-300" /> Received {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight">{task.title}</h3>
                      <p className="text-slate-500 text-base line-clamp-2 leading-relaxed font-medium">{task.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                       <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl uppercase tracking-widest">
                        <User size={14} className="text-primary-500" />
                        {task.userName}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl uppercase tracking-widest">
                        <MapPin size={14} className="text-emerald-500" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl uppercase tracking-widest">
                        <AlertCircle size={14} className="text-amber-500" />
                        {task.priority} Priority
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center lg:border-l border-slate-50 lg:pl-10">
                    <Link 
                      to={`/complaints/${task.id}`}
                      className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-100 transition-all active:scale-95 group-hover:translate-x-1"
                    >
                      Update Case <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
