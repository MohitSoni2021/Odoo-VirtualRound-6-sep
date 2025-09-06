import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterUser } from '../../libs/routeHandler';

function Signup() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVerificationUrl('');
    setIsLoading(true);

    try {
      const response = await RegisterUser({ name, email, password, role });

      console.log('Registration response:', response);

      if (response.success) {
        if (response.data && response.data.verificationUrl) {
          setVerificationUrl(response.data.verificationUrl);
        } else if (response.verificationUrl) {
          setVerificationUrl(response.verificationUrl);
        } else {
          setVerificationUrl('#');
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="text-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v-1.5a2.5 2.5 0 00-5 0v1.5a9 9 0 105.707 11.293M12 12h1.5a2.5 2.5 0 015 0h-1.5A9 9 0 0112 12z" />
          </svg>
          <h2 className="text-2xl font-bold mt-2">Create Account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <span className="block text-gray-700 font-bold mb-2">Role</span>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Buyer</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Seller</span>
              </label>
            </div>
          </div>

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
          <div className="mb-4">
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
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mx-2">Creating Account...</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="animate-spin h-5 w-5">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                </svg>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
          {verificationUrl && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p className="font-bold">Registration successful!</p>
              <p>An OTP has been sent to your email. {verificationUrl !== '#' ? (
                <a href={verificationUrl} className="underline">Click here</a>
              ) : (
                'Please check your email and use the verification link or OTP to complete registration.'
              )}</p>
            </div>
          )}
          <div className="text-center mt-4">
            <p className="text-gray-500">Already have an account?</p>
            <Link to="/" className="text-blue-500 text-decoration-none">Login</Link>
          </div>
          <p className="text-center text-gray-500 text-sm mt-3">By signing up, you agree to our terms and conditions.</p>
        </form>
      </div>
    </div>
  );
}

export default Signup;