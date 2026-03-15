import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Bell, 
  Settings, 
  LogOut, 
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.roles?.[0] || 'ROLE_USER';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/dashboard',
      roles: ['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN']
    },
    { 
      title: 'Submit Complaint', 
      icon: <PlusCircle size={20} />, 
      path: '/submit',
      roles: ['ROLE_USER']
    },
    { 
      title: 'My Complaints', 
      icon: <FileText size={20} />, 
      path: '/my-complaints',
      roles: ['ROLE_USER']
    },
    { 
      title: 'Assigned Tasks', 
      icon: <ClipboardList size={20} />, 
      path: '/tasks',
      roles: ['ROLE_STAFF']
    },
    { 
      title: 'System Management', 
      icon: <ShieldCheck size={20} />, 
      path: '/admin',
      roles: ['ROLE_ADMIN']
    },
    { 
      title: 'Notifications', 
      icon: <Bell size={20} />, 
      path: '/notifications',
      roles: ['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN']
    },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">SCMS</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-blue-400' : 'group-hover:text-white transition-colors'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.title}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 font-medium group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
