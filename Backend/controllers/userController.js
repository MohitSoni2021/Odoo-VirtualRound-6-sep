import User from "../models/User.js";
import { successResponse, sendError } from "../utils/response.js";

// GET /users
const listUsers = async (req, res) => {
  try {
    const { role, q, includeDeleted } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (!includeDeleted) filter.is_deleted = false;
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];

    const users = await User.find(filter).select('-password');
    return res.status(200).json(successResponse('Users fetched', { users }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    return res.status(200).json(successResponse('User fetched', { user }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /users/:id
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ['name', 'role', 'darkMode', 'profilePicture', 'is_deleted'];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    return res.status(200).json(successResponse('User updated', { user }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /users/:id (soft delete)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { $set: { is_deleted: true } }, { new: true }).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    return res.status(200).json(successResponse('User soft-deleted', { user }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /users/me
const getMe = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const user = await User.findById(userId).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    return res.status(200).json(successResponse('Current user', { user }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /users/me
const updateMe = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const allowed = ['name', 'darkMode', 'profilePicture'];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    return res.status(200).json(successResponse('Profile updated', { user }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { listUsers, getUserById, updateUserById, deleteUserById, getMe, updateMe };
