// Centralized API Route Handler
// Uses env vars when available
const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:9999';
const API_PREFIX = import.meta?.env?.VITE_API_PREFIX || '/auth';

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
});

async function request(method, path, body = null, token = null) {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const headers = defaultHeaders();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// Example mapping: '/api/user/login' -> LoginUser
export async function LoginUser(email, password) {
  return request('POST', `${API_PREFIX}/login`, { email, password });
}

// Example mapping: '/api/user/register' -> RegisterUser
export async function RegisterUser({ name, email, password, role }) {
  return request('POST', `${API_PREFIX}/register`, { name, email, password, role });
}

export async function ResendAccountOtp(email) {
  return request('POST', `${API_PREFIX}/register/resendOtp`, { email });
}

export async function VerifyAccountWithOtp(email, otp) {
  return request('POST', `${API_PREFIX}/register/verify-account`, { email, otp });
}

export async function ForgetPassword(email) {
  return request('POST', `${API_PREFIX}/forget-password`, { email });
}

export async function ResendForgetOtp(email) {
  return request('POST', `${API_PREFIX}/forget-password/resendOtp`, { email });
}

export async function VerifyForgetOtp(email, otp) {
  return request('POST', `${API_PREFIX}/forget-password/verifyOtp`, { email, otp });
}

export async function ResetPassword(email, otp, password) {
  return request('POST', `${API_PREFIX}/forget-password/resetPassword`, { email, otp, password });
}

export async function ShowInfo(token) {
  return request('GET', `${API_PREFIX}/showInfo`, null, token);
}
