import Category from '../models/Category.js';
import { successResponse, sendError } from '../utils/response.js';

// GET /categories
const listCategories = async (req, res) => {
  try {
    const { q, includeDeleted } = req.query;
    const filter = {};
    if (!includeDeleted) filter.is_deleted = false;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const categories = await Category.find(filter).sort({ name: 1 });
    return res.status(200).json(successResponse('Categories fetched', { categories }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /categories/:id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category || category.is_deleted) return sendError(res, 'Category not found', 404);
    return res.status(200).json(successResponse('Category fetched', { category }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /categories
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return sendError(res, 'Name is required', 400);

    const exists = await Category.findOne({ name });
    if (exists && !exists.is_deleted) return sendError(res, 'Category already exists', 400);

    // If exists but soft-deleted, we can revive it
    if (exists && exists.is_deleted) {
      exists.is_deleted = false;
      await exists.save();
      return res.status(201).json(successResponse('Category restored', { category: exists }));
    }

    const category = await Category.create({ name });
    return res.status(201).json(successResponse('Category created', { category }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /categories/:id
const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_deleted } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (is_deleted !== undefined) update.is_deleted = is_deleted;

    const category = await Category.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!category) return sendError(res, 'Category not found', 404);

    return res.status(200).json(successResponse('Category updated', { category }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /categories/:id (soft delete)
const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true } },
      { new: true }
    );
    if (!category) return sendError(res, 'Category not found', 404);
    return res.status(200).json(successResponse('Category soft-deleted', { category }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { listCategories, getCategoryById, createCategory, updateCategoryById, deleteCategoryById };
