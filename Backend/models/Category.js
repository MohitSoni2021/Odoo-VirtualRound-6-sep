import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Ensure unique index on name
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
