import Profile from "../models/Profile.js";
import { successResponse, sendError } from "../utils/response.js";

// POST /profiles (create profile for current user)
const createMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const exists = await Profile.findOne({ user: userId });
    if (exists) return sendError(res, 'Profile already exists', 400);

    const payload = {
      user: userId,
      full_name: req.body.full_name || '',
      bio: req.body.bio || '',
      profile_image: req.body.profile_image || '',
    };
    const profile = await Profile.create(payload);
    return res.status(201).json(successResponse('Profile created', { profile }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /profiles/me
const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const profile = await Profile.findOne({ user: userId, is_deleted: false }).populate('user', '-password');
    if (!profile) return sendError(res, 'Profile not found', 404);
    return res.status(200).json(successResponse('My profile', { profile }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /profiles/me
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const update = {};
    const allowed = ['full_name', 'bio', 'profile_image'];
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: update },
      { new: true }
    );
    if (!profile) return sendError(res, 'Profile not found', 404);
    return res.status(200).json(successResponse('Profile updated', { profile }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /profiles/me (soft delete)
const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { is_deleted: true } },
      { new: true }
    );
    if (!profile) return sendError(res, 'Profile not found', 404);
    return res.status(200).json(successResponse('Profile soft-deleted', { profile }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /profiles/:userId (admin or self via role middleware)
const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId, is_deleted: false }).populate('user', '-password');
    if (!profile) return sendError(res, 'Profile not found', 404);
    return res.status(200).json(successResponse('Profile fetched', { profile }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { createMyProfile, getMyProfile, updateMyProfile, deleteMyProfile, getProfileByUserId };
