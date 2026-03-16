import React, { useContext } from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-darkCard shadow-sm z-10 transition-colors duration-300">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Welcome back, {user?.name || 'User'}
                </h2>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-darkCard"></span>
                </button>
                
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-bold text-shadow">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
