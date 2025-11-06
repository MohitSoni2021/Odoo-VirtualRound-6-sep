// Authentication constants
export const OTP_EXPIRY_MINUTES = process.env.OTP_EXPIRY_MINUTES || 10;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// User roles
export const ROLES = {
    ADMIN: 'admin',
    SELLER: 'seller',
    BUYER: 'buyer'
};

// Token types
export const TOKEN_TYPES = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail'
};
