import dotenv from "dotenv";
dotenv.config();

export const secretKey = process.env.ACCESS_TOKEN_SECRET;
export const refreshKey = process.env.REFRESS_TOKEN_SECRET;
export const expiresIn = process.env.EXPIRES_IN;
export const OTPexpiresIn = process.env.OTP_EXPIRES_IN;