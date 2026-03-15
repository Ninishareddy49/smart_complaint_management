import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  MailOpen,
  Mail,
  Check,
  CheckCircle
} from 'lucide-react';
import API from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n => API.put(`/api/notifications/${n.id}/read`)));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  const getIcon = (title) => {
    if (title.toLowerCase().includes('resolved')) return <CheckCircle2 className="text-emerald-500" />;
    if (title.toLowerCase().includes('assigned') || title.toLowerCase().includes('task')) return <AlertCircle className="text-purple-500" />;
    return <Bell className="text-blue-500" />;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Log</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Stay updated with your case developments.</p>
          </motion.div>
          {notifications.some(n => !n.read) && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-[20px] text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <CheckCircle size={16} className="text-emerald-500" />
              Mark all as read
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               className="rounded-full h-12 w-12 border-b-2 border-primary-600"
            ></motion.div>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm"
          >
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Bell size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">All caught up</h3>
            <p className="text-slate-400 mt-2 font-bold max-w-sm mx-auto">No new notifications at the moment. We'll alert you as soon as something happens.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, idx) => (
                <motion.div 
                  key={notification.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative bg-white p-8 rounded-[32px] border transition-all cursor-pointer ${
                    notification.read 
                    ? 'border-slate-100 opacity-75 shadow-none' 
                    : 'border-white shadow-xl shadow-slate-200/50'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-6">
                    <div className={`shrink-0 p-4 rounded-2xl transition-all ${
                      notification.read ? 'bg-slate-100' : 'bg-slate-50 shadow-sm group-hover:bg-white'
                    }`}>
                      {getIcon(notification.title)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xl font-extrabold tracking-tight ${notification.read ? 'text-slate-500' : 'text-slate-900 group-hover:text-primary-600'} transition-colors`}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                          <Clock size={12} /> {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`font-medium leading-relaxed ${notification.read ? 'text-slate-400' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                    </div>

                    {!notification.read && (
                        <div className="self-center flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                }}
                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-100 shadow-sm"
                                title="Mark as read"
                            >
                                <Check size={20} />
                            </motion.button>
                        </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
