import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import wishlistReducer from './slices/wishlistSlice';
import reviewReducer from './slices/reviewSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
    reviews: reviewReducer,
    categories: categoryReducer,
    auth: authReducer,
  },
});

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */
