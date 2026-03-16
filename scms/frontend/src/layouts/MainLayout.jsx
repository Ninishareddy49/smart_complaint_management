import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const MainLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-darkBg dark:text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-darkBg overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col w-full">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-darkBg p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
