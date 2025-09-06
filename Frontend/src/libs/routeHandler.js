// Centralized API Route Handler
// Uses env vars when available
const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:9999';

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
});

async function request(method, path, body = null, token = null) {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const headers = defaultHeaders();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// ==================== AUTH ROUTES ====================

export async function LoginUser(email, password) {
  return request('POST', '/auth/login', { email, password });
}

export async function RegisterUser({ name, email, password, role }) {
  return request('POST', '/auth/register', { name, email, password, role });
}

export async function ResendAccountOtp(email) {
  return request('POST', '/auth/register/resendOtp', { email });
}

export async function VerifyAccountWithOtp(email, otp) {
  return request('POST', '/auth/register/verify-account', { email, otp });
}

export async function ForgetPassword(email) {
  return request('POST', '/auth/forget-password', { email });
}

export async function ResendForgetOtp(email) {
  return request('POST', '/auth/forget-password/resendOtp', { email });
}

export async function VerifyForgetOtp(email, otp) {
  return request('POST', '/auth/forget-password/verifyOtp', { email, otp });
}

export async function ResetPassword(email, otp, password) {
  return request('POST', '/auth/forget-password/resetPassword', { email, otp, password });
}

export async function ShowInfo(token) {
  return request('GET', '/auth/showInfo', null, token);
}

export async function ChangePassword(currentPassword, newPassword, token) {
  return request('PUT', '/auth/change-password', { currentPassword, newPassword }, token);
}

export async function VerifyToken(token) {
  return request('POST', '/auth/verify-token', null, token);
}

export async function GetVerifyAccountPage(tempToken) {
  return request('GET', `/auth/register/verify-account?tempToken=${tempToken}`);
}

// ==================== USER ROUTES ====================

export async function GetAllUsers(token, queryParams = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const path = queryString ? `/users?${queryString}` : '/users';
  return request('GET', path, null, token);
}

export async function GetUserById(id, token) {
  return request('GET', `/users/${id}`, null, token);
}

export async function UpdateUserById(id, updateData, token) {
  return request('PATCH', `/users/${id}`, updateData, token);
}

export async function DeleteUserById(id, token) {
  return request('DELETE', `/users/${id}`, null, token);
}

export async function GetCurrentUser(token) {
  return request('GET', '/users/me/current', null, token);
}

export async function UpdateCurrentUser(updateData, token) {
  return request('PATCH', '/users/me/current', updateData, token);
}

// ==================== PROFILE ROUTES ====================

export async function CreateProfile(profileData, token) {
  return request('POST', '/profiles/me', profileData, token);
}

export async function GetMyProfile(token) {
  return request('GET', '/profiles/me', null, token);
}

export async function UpdateMyProfile(updateData, token) {
  return request('PATCH', '/profiles/me', updateData, token);
}

export async function DeleteMyProfile(token) {
  return request('DELETE', '/profiles/me', null, token);
}

export async function GetUserProfile(userId, token) {
  return request('GET', `/profiles/${userId}`, null, token);
}

// ==================== CATEGORY ROUTES ====================

export async function GetAllCategories(queryParams = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const path = queryString ? `/categories?${queryString}` : '/categories';
  return request('GET', path);
}

export async function GetCategoryById(id) {
  return request('GET', `/categories/${id}`);
}

export async function CreateCategory(name, token) {
  return request('POST', '/categories', { name }, token);
}

export async function UpdateCategory(id, updateData, token) {
  return request('PATCH', `/categories/${id}`, updateData, token);
}

export async function DeleteCategory(id, token) {
  return request('DELETE', `/categories/${id}`, null, token);
}

// ==================== PRODUCT ROUTES ====================

export async function GetAllProducts(queryParams = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const path = queryString ? `/products?${queryString}` : '/products';
  return request('GET', path);
}

export async function GetProductById(id) {
  return request('GET', `/products/${id}`);
}

export async function CreateProduct(productData, token) {
  return request('POST', '/products', productData, token);
}

export async function UpdateProduct(id, updateData, token) {
  return request('PATCH', `/products/${id}`, updateData, token);
}

export async function DeleteProduct(id, token) {
  return request('DELETE', `/products/${id}`, null, token);
}

// ==================== CART ROUTES ====================

export async function GetMyCart(token) {
  return request('GET', '/carts/me', null, token);
}

export async function AddToCart(productId, quantity, token) {
  return request('POST', '/carts/me/items', { product: productId, quantity }, token);
}

export async function UpdateCartItem(productId, quantity, token) {
  return request('PATCH', `/carts/me/items/${productId}`, { quantity }, token);
}

export async function RemoveFromCart(productId, token) {
  return request('DELETE', `/carts/me/items/${productId}`, null, token);
}

export async function ClearCart(token) {
  return request('DELETE', '/carts/me', null, token);
}

export async function GetUserCart(userId, token) {
  return request('GET', `/carts/user/${userId}`, null, token);
}

// ==================== ADDRESS ROUTES ====================

export async function GetMyAddresses(token) {
  return request('GET', '/addresses/me', null, token);
}

export async function CreateAddress(addressData, token) {
  return request('POST', '/addresses/me', addressData, token);
}

export async function UpdateAddress(id, updateData, token) {
  return request('PATCH', `/addresses/me/${id}`, updateData, token);
}

export async function DeleteAddress(id, token) {
  return request('DELETE', `/addresses/me/${id}`, null, token);
}

export async function MakeAddressPrimary(id, token) {
  return request('POST', `/addresses/me/${id}/make-primary`, null, token);
}

export async function GetUserAddresses(userId, token) {
  return request('GET', `/addresses/user/${userId}`, null, token);
}

// ==================== ORDER ROUTES ====================

export async function CreateOrder(orderData, token) {
  return request('POST', '/orders', orderData, token);
}

export async function GetMyOrders(token) {
  return request('GET', '/orders/me', null, token);
}

export async function GetOrderById(id, token) {
  return request('GET', `/orders/${id}`, null, token);
}

export async function CancelOrder(id, token) {
  return request('POST', `/orders/${id}/cancel`, null, token);
}

export async function GetAllOrders(queryParams = {}, token) {
  const queryString = new URLSearchParams(queryParams).toString();
  const path = queryString ? `/orders?${queryString}` : '/orders';
  return request('GET', path, null, token);
}

export async function UpdateOrderStatus(id, status, token) {
  return request('PATCH', `/orders/${id}/status`, { status }, token);
}

// ==================== PAYMENT ROUTES ====================

export async function CreatePayment(paymentData, token) {
  return request('POST', '/payments', paymentData, token);
}

export async function GetMyPayments(token) {
  return request('GET', '/payments/me', null, token);
}

export async function GetPaymentsByOrder(orderId, token) {
  return request('GET', `/payments/order/${orderId}`, null, token);
}

export async function GetAllPayments(queryParams = {}, token) {
  const queryString = new URLSearchParams(queryParams).toString();
  const path = queryString ? `/payments?${queryString}` : '/payments';
  return request('GET', path, null, token);
}

export async function UpdatePayment(id, updateData, token) {
  return request('PATCH', `/payments/${id}`, updateData, token);
}

// ==================== WISHLIST ROUTES ====================

export async function GetMyWishlist(token) {
  return request('GET', '/wishlists/me', null, token);
}

export async function AddToWishlist(productId, token) {
  return request('POST', '/wishlists', { product: productId }, token);
}

export async function RemoveFromWishlist(productId, token) {
  return request('DELETE', `/wishlists/${productId}`, null, token);
}

// ==================== REVIEW ROUTES ====================

export async function GetProductReviews(productId) {
  return request('GET', `/reviews/product/${productId}`);
}

export async function GetMyReviews(token) {
  return request('GET', '/reviews/me', null, token);
}

export async function CreateReview(reviewData, token) {
  return request('POST', '/reviews', reviewData, token);
}

export async function DeleteReview(productId, token) {
  return request('DELETE', `/reviews/${productId}`, null, token);
}

export async function DeleteReviewAdmin(id, token) {
  return request('DELETE', `/reviews/admin/${id}`, null, token);
}

// ==================== MESSAGE ROUTES ====================

export async function SendMessage(messageData, token) {
  return request('POST', '/messages', messageData, token);
}

export async function GetMessagesWithUser(userId, token) {
  return request('GET', `/messages/with/${userId}`, null, token);
}

export async function ArchiveMessage(id, token) {
  return request('PATCH', `/messages/${id}/archive`, null, token);
}

export async function UnarchiveMessage(id, token) {
  return request('PATCH', `/messages/${id}/unarchive`, null, token);
}

export async function DeleteMessage(id, token) {
  return request('DELETE', `/messages/${id}`, null, token);
}

// ==================== NOTIFICATION ROUTES ====================

export async function GetMyNotifications(queryParams = {}, token) {
  const queryString = new URLSearchParams(queryParams).toString();
  const path = queryString ? `/notifications/me?${queryString}` : '/notifications/me';
  return request('GET', path, null, token);
}

export async function MarkNotificationAsRead(id, token) {
  return request('PATCH', `/notifications/${id}/read`, null, token);
}

export async function MarkNotificationAsUnread(id, token) {
  return request('PATCH', `/notifications/${id}/unread`, null, token);
}

export async function DeleteNotification(id, token) {
  return request('DELETE', `/notifications/${id}`, null, token);
}

export async function CreateNotification(notificationData, token) {
  return request('POST', '/notifications', notificationData, token);
}

export async function CreateBulkNotification(notificationData, token) {
  return request('POST', '/notifications/bulk', notificationData, token);
}
