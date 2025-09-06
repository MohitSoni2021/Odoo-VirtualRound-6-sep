import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/slices/authSlice'

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Dispatch redux thunk to login and update auth state
      const action = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(action)) {
        const { user, token } = action.payload || {};

        // Persist for hard refreshes
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Store role separately for easier access
        if (user?.role) {
          localStorage.setItem('userRole', user.role);
        }

        setSuccessMessage('Login successful! Redirecting...');

        // Role-based redirect
        const role = user?.role;
        let target = '/dashboard';
        if (role === 'admin') target = '/admin/dashboard';
        else if (role === 'seller') target = '/seller/dashboard';
        else if (role === 'buyer') target = '/buyer/dashboard';

        setTimeout(() => {
          navigate(target, { replace: true });
        }, 600);
      } else {
        throw new Error(action.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input 
              type="email" 
              id="email"
              placeholder="Enter your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="Enter your password" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p className="font-bold">Error</p>
              <p>{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
          )}
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={isLoading}
          >
            {isLoading ? <><i className='fas fa-spinner fa-spin me-2'></i>Signing In...</> : <><i className='fas fa-sign-in-alt me-2'></i>Login</>}
          </button>
          <div className="flex justify-between mt-4">
            <Link to="/forget-password" className='text-blue-500 text-decoration-none'>Forgot Password?</Link>
            <Link to="/signup" className='text-blue-500 text-decoration-none'>Sign Up</Link>
          </div>
          <p className="text-center text-gray-500 text-sm mt-3">By logging in, you agree to our terms and conditions.</p>
        </form>
      </div>
    </div>
  )
}

export default Login