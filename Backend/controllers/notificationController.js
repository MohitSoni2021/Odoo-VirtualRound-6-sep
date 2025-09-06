import Notification from '../models/Notification.js';
import { successResponse, sendError } from '../utils/response.js';

// GET /notifications/me
const listMyNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { onlyUnread } = req.query;
    const filter = { user: userId, is_deleted: false };
    if (onlyUnread) filter.is_read = false;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(successResponse('Notifications', { notifications }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /notifications/:id/read
const markRead = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { is_read: true } },
      { new: true }
    );
    if (!notif) return sendError(res, 'Notification not found', 404);
    return res.status(200).json(successResponse('Marked read', { notification: notif }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /notifications/:id/unread
const markUnread = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { is_read: false } },
      { new: true }
    );
    if (!notif) return sendError(res, 'Notification not found', 404);
    return res.status(200).json(successResponse('Marked unread', { notification: notif }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /notifications/:id
const deleteMyNotification = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { is_deleted: true } },
      { new: true }
    );
    if (!notif) return sendError(res, 'Notification not found', 404);
    return res.status(200).json(successResponse('Notification deleted', { notification: notif }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: POST /notifications (create for a user)
const adminCreateNotification = async (req, res) => {
  try {
    const role = req.body?.role;
    if (role !== 'admin') return sendError(res, 'Forbidden', 403);

    const { user, type, content } = req.body;
    if (!user || !type || !content) return sendError(res, 'user, type, content are required', 400);

    const notif = await Notification.create({ user, type, content });
    return res.status(201).json(successResponse('Notification created', { notification: notif }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: POST /notifications/bulk (create for multiple users)
const adminCreateBulk = async (req, res) => {
  try {
    const role = req.body?.role;
    if (role !== 'admin') return sendError(res, 'Forbidden', 403);

    const { users, type, content } = req.body;
    if (!Array.isArray(users) || users.length === 0 || !type || !content) {
      return sendError(res, 'users[], type, content are required', 400);
    }

    const docs = users.map((u) => ({ user: u, type, content }));
    const inserted = await Notification.insertMany(docs);
    return res.status(201).json(successResponse('Notifications created', { count: inserted.length }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { listMyNotifications, markRead, markUnread, deleteMyNotification, adminCreateNotification, adminCreateBulk };
