import Address from '../models/Address.js';
import { successResponse, sendError } from '../utils/response.js';

// GET /addresses/me
const listMyAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const addresses = await Address.find({ user: userId, is_deleted: false }).sort({ is_primary: -1, updatedAt: -1 });
    return res.status(200).json(successResponse('Addresses fetched', { addresses }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /addresses/me
const createMyAddress = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const payload = { ...req.body, user: userId };

    // If making primary, unset others
    if (payload.is_primary) {
      await Address.updateMany({ user: userId }, { $set: { is_primary: false } });
    }

    const address = await Address.create(payload);
    return res.status(201).json(successResponse('Address created', { address }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /addresses/me/:id
const updateMyAddress = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address || address.is_deleted) return sendError(res, 'Address not found', 404);

    const update = { ...req.body };

    // If setting primary true, unset others first
    if (update.is_primary === true) {
      await Address.updateMany({ user: userId }, { $set: { is_primary: false } });
    }

    const updated = await Address.findByIdAndUpdate(id, { $set: update }, { new: true });
    return res.status(200).json(successResponse('Address updated', { address: updated }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /addresses/me/:id (soft delete)
const deleteMyAddress = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const address = await Address.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { is_deleted: true } },
      { new: true }
    );

    if (!address) return sendError(res, 'Address not found', 404);
    return res.status(200).json(successResponse('Address soft-deleted', { address }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /addresses/me/:id/make-primary
const makeMyAddressPrimary = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId, is_deleted: false });
    if (!address) return sendError(res, 'Address not found', 404);

    await Address.updateMany({ user: userId }, { $set: { is_primary: false } });
    address.is_primary = true;
    await address.save();

    return res.status(200).json(successResponse('Primary address set', { address }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: GET /addresses/user/:userId
const listAddressesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ user: userId, is_deleted: false }).sort({ is_primary: -1, updatedAt: -1 });
    return res.status(200).json(successResponse('Addresses fetched', { addresses }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { listMyAddresses, createMyAddress, updateMyAddress, deleteMyAddress, makeMyAddressPrimary, listAddressesByUser };
