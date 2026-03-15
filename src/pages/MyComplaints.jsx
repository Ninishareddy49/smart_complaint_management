import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';
import API from '../services/api';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/complaints');
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-700';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700';
      case 'CLOSED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Complaints</h1>
            <p className="text-slate-500 font-medium mt-1">Track and manage your submitted issues.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm font-medium"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-sm text-slate-600">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No complaints found</h3>
            <p className="text-slate-500 mt-2 font-medium">You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${getStatusStyle(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={14} /> {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{complaint.title}</h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">{complaint.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <MapPin size={14} className="text-blue-500" />
                        {complaint.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <AlertCircle size={14} className="text-amber-500" />
                        {complaint.priority} Priority
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center md:border-l border-slate-50 md:pl-8">
                    <Link 
                      to={`/complaints/${complaint.id}`}
                      className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                    >
                      View Details <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
