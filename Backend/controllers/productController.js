import Product from '../models/Product.js';
import { successResponse, sendError } from '../utils/response.js';

// Helpers
const isOwnerOrAdmin = (req, product) => {
  const userId = String(req.userId || '');
  const role = req.body?.role; // set by tokenValidations
  return role === 'admin' || (product?.user && String(product.user) === userId);
};

// GET /products
const listProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      status,
      user,
      minPrice,
      maxPrice,
      includeDeleted,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (!includeDeleted) filter.is_deleted = false;
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (user) filter.user = user;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate('user', 'name email role')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json(
      successResponse('Products fetched', {
        items,
        page: Number(page),
        limit: Number(limit),
        total,
      })
    );
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('user', 'name email role')
      .populate('category', 'name');
    if (!product || product.is_deleted) return sendError(res, 'Product not found', 404);
    return res.status(200).json(successResponse('Product fetched', { product }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /products
const createProduct = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const {
      category,
      title,
      description,
      price,
      stock_quantity,
      status,
      details,
      images,
    } = req.body;

    if (!category || !title || price === undefined || stock_quantity === undefined) {
      return sendError(res, 'category, title, price, stock_quantity are required', 400);
    }

    const product = await Product.create({
      user: userId,
      category,
      title,
      description,
      price,
      stock_quantity,
      status,
      details,
      images,
    });

    return res.status(201).json(successResponse('Product created', { product }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /products/:id
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return sendError(res, 'Product not found', 404);

    if (!isOwnerOrAdmin(req, product)) return sendError(res, 'Forbidden', 403);

    const allowed = [
      'category',
      'title',
      'description',
      'price',
      'stock_quantity',
      'status',
      'details',
      'images',
      'is_deleted',
    ];
    const update = {};
    for (const key of allowed) if (key in req.body) update[key] = req.body[key];

    const updated = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });
    return res.status(200).json(successResponse('Product updated', { product: updated }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /products/:id (soft delete)
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return sendError(res, 'Product not found', 404);

    if (!isOwnerOrAdmin(req, product)) return sendError(res, 'Forbidden', 403);

    product.is_deleted = true;
    await product.save();

    return res.status(200).json(successResponse('Product soft-deleted', { product }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { listProducts, getProductById, createProduct, updateProductById, deleteProductById };
