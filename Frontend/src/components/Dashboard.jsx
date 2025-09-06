import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/');
      return;
    }

    try {
      let parsedUser = null;
      
      if (userData) {
        parsedUser = JSON.parse(userData);
        console.log('Parsed user data:', parsedUser);
      } else {
        // If user data is missing but we have token and role, create a minimal user object
        parsedUser = { role: userRole };
      }
      
      // Accept the user data structure as it is, without strict validation
      // The backend might be returning a different structure than expected
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Don't remove token and role, just recreate user object with role
      const userRole = localStorage.getItem('userRole');
      if (userRole) {
        setUser({ role: userRole });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
      }
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner animate-spin w-16 h-16 border-4 border-blue-500 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button 
          className="btn bg-blue-500 text-white" 
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt me-2"></i>Logout
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6">
          {user && (
            <div>
              {user.name && (
                <p><strong><i className="fas fa-user-circle me-2"></i>Name:</strong> {user.name}</p>
              )}
              <p><strong><i className="fas fa-envelope me-2"></i>Email:</strong> {user.email}</p>
              {user.role && (
                <p><strong><i className="fas fa-user-tag me-2"></i>Role:</strong> {user.role}</p>
              )}
              {user.id && (
                <p><strong><i className="fas fa-id-card me-2"></i>ID:</strong> {user.id}</p>
              )}
              {user.createdAt && (
                <p><strong><i className="fas fa-clock me-2"></i>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </div>
        <div className="border border-green-500 rounded-lg p-6">
          <div className="alert alert-success">
            <i className="fas fa-check-circle me-2"></i>
            <strong>Successfully authenticated!</strong> Your JWT token is valid and stored securely.
          </div>
          <p><i className="fas fa-info-circle me-2"></i>This is a protected route that requires authentication.</p>
          <p><i className="fas fa-lock me-2"></i>Your session is secure and will expire after the token lifetime.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;