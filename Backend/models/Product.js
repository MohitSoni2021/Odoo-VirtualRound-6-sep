import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    is_primary: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
  },
  { _id: false }
);

const dimensionsSchema = new mongoose.Schema(
  {
    length_cm: { type: Number },
    width_cm: { type: Number },
    height_cm: { type: Number },
  },
  { _id: false }
);

const productDetailsSchema = new mongoose.Schema(
  {
    condition: { type: String, enum: ['new', 'used', 'refurbished'], required: true },
    year_of_manufacture: { type: Number },
    brand: { type: String },
    model: { type: String },
    dimensions: dimensionsSchema,
    weight_kg: { type: Number },
    material: { type: String },
    color: { type: String },
    original_packaging: { type: Boolean, default: false },
    manual_included: { type: Boolean, default: false },
    working_condition_description: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock_quantity: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available', index: true },
    details: productDetailsSchema,
    images: [productImageSchema],
    is_deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ title: 'text', description: 'text', 'details.brand': 'text', 'details.model': 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
