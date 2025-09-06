import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../libs/routeHandler';

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId) => {
    const response = await api.GetProductReviews(productId);
    return response;
  }
);

export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (token) => {
    const response = await api.GetMyReviews(token);
    return response;
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ reviewData, token }) => {
    const response = await api.CreateReview(reviewData, token);
    return response;
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ productId, token }) => {
    const response = await api.DeleteReview(productId, token);
    return response;
  }
);

const initialState = {
  productReviews: [],
  myReviews: [],
  loading: false,
  error: null
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProductReviews: (state) => {
      state.productReviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload.reviews || [];
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch My Reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload.reviews || [];
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.myReviews.findIndex(
          review => review.product._id === action.payload.review.product._id
        );
        if (existingIndex !== -1) {
          state.myReviews[existingIndex] = action.payload.review;
        } else {
          state.myReviews.unshift(action.payload.review);
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = state.myReviews.filter(
          review => review.product._id !== action.meta.arg.productId
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearProductReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
