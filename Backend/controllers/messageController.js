import Message from '../models/Message.js';
import { successResponse, sendError } from '../utils/response.js';

// POST /messages
const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    if (!senderId) return sendError(res, 'Unauthorized', 401);

    const { receiver, product, message } = req.body;
    if (!receiver || !message) return sendError(res, 'receiver and message are required', 400);

    const msg = await Message.create({ sender: senderId, receiver, product, message });
    return res.status(201).json(successResponse('Message sent', { message: msg }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /messages/with/:userId
const listMessagesWithUser = async (req, res) => {
  try {
    const me = req.userId;
    if (!me) return sendError(res, 'Unauthorized', 401);
    const { userId } = req.params;

    const msgs = await Message.find({
      is_deleted: false,
      $or: [
        { sender: me, receiver: userId },
        { sender: userId, receiver: me },
      ],
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .populate('product', 'title images price')
      .sort({ createdAt: 1 });

    return res.status(200).json(successResponse('Conversation', { messages: msgs }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /messages/:id/archive
const archiveMessage = async (req, res) => {
  try {
    const me = req.userId;
    if (!me) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const msg = await Message.findById(id);
    if (!msg || msg.is_deleted) return sendError(res, 'Message not found', 404);
    if (String(msg.sender) !== String(me) && String(msg.receiver) !== String(me)) {
      return sendError(res, 'Forbidden', 403);
    }

    msg.archived = true;
    await msg.save();
    return res.status(200).json(successResponse('Message archived', { message: msg }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /messages/:id/unarchive
const unarchiveMessage = async (req, res) => {
  try {
    const me = req.userId;
    if (!me) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const msg = await Message.findById(id);
    if (!msg || msg.is_deleted) return sendError(res, 'Message not found', 404);
    if (String(msg.sender) !== String(me) && String(msg.receiver) !== String(me)) {
      return sendError(res, 'Forbidden', 403);
    }

    msg.archived = false;
    await msg.save();
    return res.status(200).json(successResponse('Message unarchived', { message: msg }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /messages/:id (soft)
const deleteMessage = async (req, res) => {
  try {
    const me = req.userId;
    if (!me) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const msg = await Message.findById(id);
    if (!msg) return sendError(res, 'Message not found', 404);
    if (String(msg.sender) !== String(me) && String(msg.receiver) !== String(me)) {
      return sendError(res, 'Forbidden', 403);
    }

    msg.is_deleted = true;
    await msg.save();
    return res.status(200).json(successResponse('Message deleted', { message: msg }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { sendMessage, listMessagesWithUser, archiveMessage, unarchiveMessage, deleteMessage };
