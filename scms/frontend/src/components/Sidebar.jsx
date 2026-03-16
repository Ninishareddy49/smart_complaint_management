import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Send, Users, Activity, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    
    // Check if user has specific roles
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isStaff = user?.roles?.includes('ROLE_STAFF');
    const isUser = user?.roles?.includes('ROLE_USER');

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" />, show: true },
        { name: 'Submit Complaint', path: '/submit', icon: <Send className="w-5 h-5" />, show: isUser },
        { name: 'My Complaints', path: '/my-complaints', icon: <FileText className="w-5 h-5" />, show: isUser },
        { name: 'Assigned Tasks', path: '/tasks', icon: <Activity className="w-5 h-5" />, show: isStaff },
        { name: 'All Complaints', path: '/admin/complaints', icon: <FileText className="w-5 h-5" />, show: isAdmin },
        { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" />, show: isAdmin },
        { name: 'Analytics', path: '/admin/analytics', icon: <Activity className="w-5 h-5" />, show: isAdmin },
    ];

    return (
        <aside className="w-64 flex flex-col bg-white dark:bg-darkSidebar shadow-lg z-20 transition-colors duration-300">
            <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-xl tracking-wider font-bold text-primary-light dark:text-primary-dark uppercase">Smart CMS</h1>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.filter(item => item.show).map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-primary-light text-white shadow-md font-medium' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
