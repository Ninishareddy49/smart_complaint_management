import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  User, 
  AlertCircle,
  Send,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  UserPlus,
  PlayCircle,
  CheckCircle,
  HandMetal
} from 'lucide-react';
import API from '../services/api';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [closureNotes, setClosureNotes] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.roles?.includes('ROLE_ADMIN');
  const isStaff = user.roles?.includes('ROLE_STAFF') || isAdmin;
  const isOwner = complaint?.userName === user.name;

  useEffect(() => {
    fetchComplaint();
    if (isAdmin) {
      fetchStaff();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/api/complaints/${id}`);
      setComplaint(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      console.error("Error fetching complaint details", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await API.get('/api/admin/staff');
      setStaffList(res.data);
    } catch (err) {
      console.error("Error fetching staff list", err);
    }
  };

  const handleUpdateStatus = async (e, statusOverride = null, commentOverride = null) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const statusToShip = statusOverride || newStatus;
      const commentToShip = commentOverride || comment;

      await API.put(`/api/complaints/${id}/status`, {
        status: statusToShip,
        comment: commentToShip
      });
      setComment('');
      fetchComplaint();
    } catch (err) {
      console.error("Error updating status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;
    setIsAssigning(true);
    try {
      await API.put(`/api/complaints/${id}/assign`, {
        staffId: selectedStaff
      });
      fetchComplaint();
    } catch (err) {
      console.error("Error assigning staff", err);
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) return <Layout><div className="flex items-center justify-center h-[60vh]"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="rounded-full h-12 w-12 border-b-2 border-primary-600"></motion.div></div></Layout>;
  
  if (!complaint) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle size={48} className="text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900">Complaint not found</h2>
        <button onClick={() => navigate(-1)} className="text-primary-600 font-bold hover:underline">Go Back</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black px-3 py-1 bg-primary-100 text-primary-700 rounded-full uppercase tracking-widest shadow-sm">
                      {complaint.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Clock size={14} /> Submitted {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">{complaint.title}</h1>
                </div>
                <div className={`shrink-0 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm border ${
                  complaint.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  complaint.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {complaint.status.replace('_', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-slate-50">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporter</p>
                  <p className="font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={14} />
                    </div>
                    {complaint.userName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <MapPin size={14} />
                    </div>
                    {complaint.location}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</p>
                  <p className="font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <AlertCircle size={14} />
                    </div>
                    <span className={complaint.priority === 'URGENT' ? 'text-red-600' : ''}>{complaint.priority}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mt-2">Complaint Details</h3>
                <div className="bg-slate-50 p-6 rounded-[24px] text-slate-600 leading-relaxed font-medium text-lg border border-slate-100">
                  {complaint.description}
                </div>
              </div>

              {complaint.assignedStaffName && (
                <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl text-white">
                    <div className="bg-blue-500/20 p-2 rounded-xl">
                        <UserPlus size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Specialist</p>
                        <p className="font-bold">{complaint.assignedStaffName}</p>
                    </div>
                </div>
              )}
            </div>

            {/* Timeline/History */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <TrendingUp size={20} />
                </div>
                Activity Timeline
              </h2>
              <div className="relative space-y-10 pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                <AnimatePresence mode="popLayout">
                  {complaint.history && complaint.history.length > 0 ? (
                    complaint.history.map((update, idx) => (
                      <motion.div 
                        key={update.id || idx} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-12"
                      >
                        <div className="absolute left-[-1.5px] top-1.5 w-[11px] h-[11px] rounded-full bg-blue-600 ring-4 ring-blue-100 z-10 shadow-sm" />
                        <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[9px] px-3 py-1 bg-slate-900 rounded-full text-white uppercase tracking-widest shadow-sm">
                              {update.status.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {new Date(update.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <p className="text-slate-700 font-bold text-lg leading-tight">{update.comment}</p>
                          <div className="flex items-center gap-2 pt-1">
                              <User size={12} className="text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Updated by {update.updatedBy}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="pl-12 text-slate-400 font-bold text-sm bg-slate-50 py-4 px-6 rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">
                        Fresh Request — Initializing Process
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-8">
            {/* Admin Assignment Section */}
            {isAdmin && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                    <UserPlus size={20} />
                  </div>
                  Assign Resolver
                </h2>
                <form onSubmit={handleAssignStaff} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Staff Member</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.25rem_center]"
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      required
                    >
                      <option value="">Choose resolver...</option>
                      {staffList.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name} ({staff.email})</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit"
                    disabled={isAssigning || !selectedStaff}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-[20px] font-black text-xs text-white uppercase tracking-widest transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Status Update Section (Staff/Admin) */}
            {isStaff && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-300 space-y-8"
              >
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                    <CheckCircle2 size={20} />
                  </div>
                  Case Management
                </h2>

                <div className="space-y-4">
                    {/* Primary Workflow Buttons */}
                    {!complaint.assignedStaffName && (
                        <button 
                            onClick={() => handleUpdateStatus(null, 'ASSIGNED', 'I am taking charge of this case.')}
                            disabled={isUpdating}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <HandMetal size={18} /> Accept Task
                        </button>
                    )}

                    {complaint.status === 'ASSIGNED' && (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1 text-center">Next Objective</p>
                            <button 
                                onClick={() => handleUpdateStatus(null, 'IN_PROGRESS', 'I have initiated the investigation and am actively working on the resolution.')}
                                disabled={isUpdating}
                                className="w-full bg-purple-600 hover:bg-purple-700 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-900/40 active:scale-95"
                            >
                                <PlayCircle size={20} /> Deploy Start Protocol
                            </button>
                        </div>
                    )}

                    {complaint.status === 'IN_PROGRESS' && (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1 text-center">Case Conclusion</p>
                            <button 
                                onClick={() => {
                                    if (comment.trim()) {
                                        handleUpdateStatus(null, 'RESOLVED', comment);
                                    } else {
                                        setNewStatus('RESOLVED');
                                        document.getElementById('resolution-comment')?.focus();
                                    }
                                }}
                                disabled={isUpdating}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/40 active:scale-95"
                            >
                                <CheckCircle size={20} /> Mark Task as Completed
                            </button>
                        </div>
                    )}
                </div>

                {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
                    <div className="border-t border-slate-800 pt-6">
                        <form onSubmit={handleUpdateStatus} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Action</label>
                            <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            >
                            <option value="OPEN">Initialization</option>
                            <option value="ASSIGNED">Assignment Locked</option>
                            <option value="IN_PROGRESS">Execution Phase</option>
                            <option value="RESOLVED">Resolution Verified</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Case Notes / Briefing</label>
                            <textarea 
                            id="resolution-comment"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                            placeholder="Detail actions taken for this state transition..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            ></textarea>
                        </div>
                        <button 
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                        >
                            {isUpdating ? 'Synchronizing...' : <>Update Case Data <Send size={16} /></>}
                        </button>
                        </form>
                    </div>
                )}

                {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') && (
                    <div className="bg-slate-800/50 p-6 rounded-[24px] border border-slate-700 text-center space-y-3">
                        <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={24} className="text-emerald-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Processed</p>
                        <p className="text-sm font-medium text-slate-300">This intelligence report has been finalized and no further updates are required.</p>
                    </div>
                )}
              </motion.div>
            )}

            {/* Support section for users (Original Reporter) */}
            {isOwner && complaint.status !== 'CLOSED' && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="glass rounded-[32px] p-8 text-slate-900 shadow-xl border border-white space-y-6"
               >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl text-white">
                        <MessageSquare size={20} />
                    </div>
                    <h3 className="text-xl font-extrabold">Reporter Actions</h3>
                </div>

                {complaint.status === 'RESOLVED' ? (
                    <div className="space-y-4">
                        <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                            A specialist has marked this case as resolved. If you are satisfied with the outcome, please finalize and close this case.
                        </p>
                        <textarea 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                          placeholder="Final feedback (optional)..."
                          value={closureNotes}
                          onChange={(e) => setClosureNotes(e.target.value)}
                        ></textarea>
                        <button 
                            onClick={async () => {
                                setIsClosing(true);
                                try {
                                    await API.put(`/api/complaints/${id}/status`, {
                                        status: 'CLOSED',
                                        comment: closureNotes || 'User confirmed resolution and closed the case.'
                                    });
                                    fetchComplaint();
                                } catch (err) {
                                    console.error("Error closing case", err);
                                } finally {
                                    setIsClosing(false);
                                }
                            }}
                            disabled={isClosing}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-[20px] text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isClosing ? 'Finalizing...' : <>Finalize & Close Case <CheckCircle size={18} /></>}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                            Need to provide more context? Our support team is here to assist you while your case is being reviewed.
                        </p>
                        <button className="w-full bg-slate-900 text-white font-black py-4 rounded-[20px] text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-bold">
                        Internal Support
                        </button>
                    </div>
                )}
              </motion.div>
            )}

            {/* Admin specific control for unresolved or stuck cases */}
            {isAdmin && complaint.status === 'RESOLVED' && !isOwner && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 rounded-[32px] p-8 text-red-900 border border-red-100 shadow-lg space-y-4"
                >
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                        <AlertCircle size={24} className="text-red-600" /> Administrative Closure
                    </h3>
                    <p className="text-sm font-medium opacity-80">As an Admin, you can manually close this case if the reporter is unresponsive.</p>
                    <button 
                        onClick={async () => {
                            try {
                                await API.put(`/api/complaints/${id}/status`, {
                                    status: 'CLOSED',
                                    comment: 'Administrative closure (Automatic).'
                                });
                                fetchComplaint();
                            } catch (err) {
                                console.error("Error closing case", err);
                            }
                        }}
                        className="w-full bg-red-600 text-white font-black py-4 rounded-[20px] text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                    >
                        Force Close Case
                    </button>
                </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
