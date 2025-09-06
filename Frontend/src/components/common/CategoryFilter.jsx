import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory } from '../../store/slices/productSlice';

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { selectedCategory } = useSelector((state) => state.products);

  const handleCategoryChange = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryChange('')}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            selectedCategory === '' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryChange(category._id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === category._id 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
