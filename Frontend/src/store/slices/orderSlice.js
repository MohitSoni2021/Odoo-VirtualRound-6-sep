import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../libs/routeHandler';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (token) => {
    const response = await api.GetMyOrders(token);
    return response;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async ({ orderId, token }) => {
    const response = await api.GetOrderById(orderId, token);
    return response;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ orderData, token }) => {
    const response = await api.CreateOrder(orderData, token);
    return response;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, token }) => {
    const response = await api.CancelOrder(orderId, token);
    return response;
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload || {};
        state.orders = data.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload || {};
        state.currentOrder = data.order || null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload || {};
        if (data.order) state.orders.unshift(data.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload || {};
        const updated = data.order;
        if (updated) {
          const index = state.orders.findIndex((order) => order._id === updated._id);
          if (index !== -1) state.orders[index] = updated;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
