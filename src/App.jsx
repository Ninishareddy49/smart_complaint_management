import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import Notifications from './pages/Notifications';
import StaffTasks from './pages/StaffTasks';
import ComplaintDetail from './pages/ComplaintDetail';
import Admin from './pages/Admin';
import AdminComplaints from './pages/AdminComplaints';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/submit" 
          element={
            <ProtectedRoute>
              <SubmitComplaint />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/my-complaints" 
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <StaffTasks />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/complaints/:id" 
          element={
            <ProtectedRoute>
              <ComplaintDetail />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
              <Admin />
            </RoleBasedRoute>
          } 
        />
        
        <Route 
          path="/admin/complaints" 
          element={
            <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminComplaints />
            </RoleBasedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
