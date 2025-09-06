import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';

function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract email from the tempToken in URL params
    const tempToken = searchParams.get('tempToken');
    if (tempToken) {
      try {
        // Decode the JWT token to get email (this is a simple approach)
        const payload = JSON.parse(atob(tempToken.split('.')[1]));
        setEmail(payload.email);
      } catch (error) {
        setErrorMessage('Invalid verification link');
      }
    }
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Validate OTP format
      if (!otp || !/^\d{6}$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      console.log('Verifying OTP:', { email, otp });
      const response = await ApiService.makeRequest(
        'POST',
        ApiService.endpoints.verifyAccount,
        { email, otp }
      );

      if (response.success) {
        setSuccessMessage('Account verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const data = await ApiService.makeRequest(
        'POST',
        ApiService.endpoints.resendOtp,
        { email }
      );

      setSuccessMessage('OTP resent successfully! Please check your email.');
      // If the backend returns a new tempToken, update the URL
      if (data.data && data.data.newTempToken) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tempToken', data.data.newTempToken);
        window.history.replaceState({}, '', newUrl);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrorMessage(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-bold mb-4'>Invalid Verification Link</h2>
          <p className='text-gray-500'>The verification link is invalid or has expired.</p>
          <button 
            onClick={() => navigate('/signup')} 
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4'
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-bold mb-4'>Verify Your Account</h2>
        <p className='text-gray-500'>Enter the OTP sent to {email}</p>
        
        {errorMessage && (
          <div className='bg-red-200 border-l-4 border-red-500 text-red-700 p-4 mb-4'>
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className='bg-green-200 border-l-4 border-green-500 text-green-700 p-4 mb-4'>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleVerify}>
          <div className='mb-4'>
            <label htmlFor='otp' className='block text-gray-700'>OTP Code</label>
            <input
              type='text'
              id='otp'
              placeholder='Enter 6-digit OTP'
              className='border border-gray-300 rounded-lg py-2 px-4 w-full mt-2'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <small className='text-gray-500'>Enter the 6-digit code sent to your email</small>
          </div>
          
          <button 
            type='submit' 
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4'
            disabled={isLoading}
          >
            {isLoading ? <><i className='fas fa-spinner fa-spin me-2'></i>Verifying...</> : <><i className='fas fa-check-circle me-2'></i>Verify Account</>}
          </button>
          
          <div className='flex justify-between'>
            <button 
              type='button' 
              onClick={handleResendOTP}
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded'
              disabled={isLoading}
            >
              Resend OTP
            </button>
            
            <button 
              type='button' 
              onClick={() => navigate('/')} 
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded'
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyAccount;
