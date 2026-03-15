import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  Send, 
  MapPin, 
  Tag, 
  AlertTriangle,
  Image as ImageIcon,
  ChevronRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import API from '../services/api';

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ELECTRICAL',
    priority: 'MEDIUM',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await API.post('/api/complaints', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Breadcrumb / Nav */}
        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
          <span>Home</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-primary-600">Case Initialization</span>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-10 bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-500/20 p-2 rounded-xl backdrop-blur-md">
                        <Sparkles size={20} className="text-primary-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Secure Protocol</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Report Intelligence</h1>
                <p className="text-slate-400 mt-2 font-bold opacity-90 max-w-md">Provide detailed observations to facilitate rapid resolution by our specialized units.</p>
            </div>
            <HelpCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5 -rotate-12" />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 text-red-600 p-5 rounded-[20px] text-sm font-bold border border-red-100 flex items-center gap-3"
              >
                <AlertTriangle size={20} />
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.15em]">Descriptive Headline</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 placeholder-slate-400"
                placeholder="e.g., HVAC System Malfunction - North Wing"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Tag size={14} className="text-primary-500" /> Case Category
                </label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.25rem_center]"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  value={formData.category}
                >
                  <option value="ELECTRICAL">Infrastructure / Electrical</option>
                  <option value="PLUMBING">Hydraulics / Plumbing</option>
                  <option value="INTERNET">Network Operations / IT</option>
                  <option value="CLEANING">Maintenance / Sanitation</option>
                  <option value="OTHER">General Classification</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Urgent Levels
                </label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.25rem_center]"
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  value={formData.priority}
                >
                  <option value="LOW">Routine / Low</option>
                  <option value="MEDIUM">Standard / Medium</option>
                  <option value="HIGH">Elevated / High</option>
                  <option value="URGENT">Critical / Immediate Response</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" /> Operational Sector
              </label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 placeholder-slate-400"
                placeholder="e.g., Block B, Executive Suite 402"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.15em]">Technical Intelligence</label>
              <textarea
                rows="6"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-800 placeholder-slate-400 resize-none leading-relaxed"
                placeholder="Specify parameters and current status..."
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="pt-6 flex items-center justify-end gap-6 border-t border-slate-50">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 text-white px-10 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-200 hover:bg-primary-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:pointer-events-none active:scale-95"
              >
                {isLoading ? 'Processing...' : (
                  <>
                    Initialize Report <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}
