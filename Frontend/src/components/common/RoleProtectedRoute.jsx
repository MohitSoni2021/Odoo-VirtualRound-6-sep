import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RoleProtectedRoute
 * Wrap routes that require specific roles.
 * Usage:
 * <RoleProtectedRoute allowedRoles={["buyer","seller","admin"]}>
 *   <YourComponent />
 * </RoleProtectedRoute>
 */
export default function RoleProtectedRoute({ allowedRoles = [], children }) {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userRaw);
  } catch (_) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  const role = user?.role;
  const isAllowed = allowedRoles.length === 0 || (role && allowedRoles.includes(role));

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">403 - Not Authorized</h1>
        <p className="text-gray-600">Your account role does not have access to this page.</p>
        <p className="mt-2 text-gray-600">Required: {allowedRoles.join(', ')} | Your role: {role || 'unknown'}</p>
        <a href="/" className="mt-6 inline-flex items-center rounded bg-blue-600 text-white px-4 py-2">Go to Login</a>
      </div>
    );
  }

  return children;
}
