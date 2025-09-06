import jwt from "jsonwebtoken";
import { secretKey } from "../config/jwt.js";
import User from "../models/User.js";
import { sendError } from "../utils/response.js";

const verifyToken = async (req, res, next) => {
  const tokenString = req.headers.authorization;
  if (!tokenString) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  const token = tokenString.split(" ")[1];
  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const { userId, tokenVersion } = decoded;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.tokenVersion !== tokenVersion) {
      return sendError(res, "Token has expired. Please reauthenticate.", 401);
    }
    console.log("Valid Token !");

    req.body = {
      ID: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      darkMode: user.darkMode,
      profilePicture: user.profilePicture,
    };
    req.userId = String(user._id);
    next();
  } catch (error) {
    return sendError(res, "Invalid token", 401);
  }
};

const verifyTempToken = async (req, res, next) => {
  let token = null;
  const tokenString = req.headers.authorization;

  if (tokenString && tokenString.startsWith('Bearer ')) {
    token = tokenString.split(" ")[1];
    console.log("Token found in Authorization header");
  }

  if (!token) {
    const { tempToken } = req.query;
    if (tempToken) {
      token = tempToken;
      console.log("Token found in query parameters");
    }
  }

  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }

  try {
    console.log("Verifying token...");
    const decoded = jwt.verify(token, secretKey);
    const { email } = decoded;
    console.log("Token decoded for email:", email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    
    req.body.email = email;
    console.log("Token verification passed");
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return sendError(res, "Invalid or expired token. Please try again.", 401);
  }
};

const otpVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP", 403);
    }

    req.body.user = user;
    next();
  } catch (error) {
    console.log("OTP iis not valid");
    console.log(error);
    return sendError(res, error.message, 500);
  }
};

export default {
  verifyToken,
  verifyTempToken,
  otpVerify,
};