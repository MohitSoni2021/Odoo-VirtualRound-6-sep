## 📌 General Notes
- Place pages inside `src/pages` and components inside `src/components`.
- Use modular structure: services, hooks, contexts, and components.
- All API requests go through a centralized `api.js` (Axios/Fetch wrapper).
- **routerHandler.js**: Maintain a central routing registry for all pages.
- Use `Authorization: Bearer <token>` where required.
- Always handle success + error responses gracefully with toast/alert + redirect.
- Maintain loading and error states for all components.

---

# 🚀 Execution Plan (Phased Tasks)

---

## **Phase 1: Foundation (Profile, Users, Categories, Products)**

### 1. Profile
**Components/Pages**
- `ProfilePage.jsx`
  - API: `GET /profiles/me`
  - State: `profileData`, `loading`, `error`
  - Show user details, profile image, email, phone.
- `EditProfileForm.jsx`
  - API: `PATCH /profiles/me`
  - Fields: `fullName`, `bio`, `profileImage`
  - Props: initial data from ProfilePage.
- `SettingsPage.jsx`
  - API: `PUT /auth/change-password`
  - Fields: `oldPassword`, `newPassword`, `confirmPassword`
  - State: form validation.

### 2. User Management (Admin)
**Components/Pages**
- `AdminUsersPage.jsx`
  - API: `GET /users`
  - Filters: role, status (active/deleted), search by name/email.
  - Table view with pagination.
- `UserDetailsPage.jsx`
  - API: `GET /users/:id`
  - Show full user profile + addresses.
- `EditUserForm.jsx`
  - API: `PATCH /users/:id`
  - Fields: `role`, `status`, `fullName`.

### 3. Categories
**Components/Pages**
- `CategoriesListPage.jsx`
  - API: `GET /categories`
  - Public view: card/grid layout.
- `AdminCategoriesPage.jsx`
  - APIs: `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`
  - CRUD UI with validation.

### 4. Products
**Components/Pages**
- `ProductsPage.jsx`
  - API: `GET /products`
  - Filters: category, min/max price, status, seller.
  - Grid view with pagination + search.
- `ProductDetailsPage.jsx`
  - API: `GET /products/:id`
  - Show images, description, stock, reviews, seller info.
- `AddProductPage.jsx`
  - API: `POST /products`
  - Fields: `title`, `description`, `price`, `category`, `images`, `stock`.
- `EditProductPage.jsx`
  - API: `PATCH /products/:id`
- `AdminProductsPage.jsx`
  - API: `GET /products?all=true`
  - Admin-only control with delete + status change.

---

## **Phase 2: Shopping Flow (Cart, Addresses, Orders, Payments)**

### 5. Cart
**Components/Pages**
- `CartPage.jsx`
  - API: `GET /carts/me`, `PATCH /carts/me`, `DELETE /carts/me/:productId`
  - Show items, update quantity, remove product.
- `CheckoutPage.jsx`
  - Uses cart + address
  - API: `POST /orders`
  - Select payment option → trigger Payment API.

### 6. Addresses
**Components/Pages**
- `AddressesPage.jsx`
  - API: `GET /addresses/me`
  - List with "Set Primary" option.
- `AddEditAddressForm.jsx`
  - API: `POST /addresses/me`, `PATCH /addresses/me/:id`
  - Fields: street, city, state, country, postalCode.

### 7. Orders
**Components/Pages**
- `MyOrdersPage.jsx`
  - API: `GET /orders/me`
  - Show orders with status badges.
- `OrderDetailsPage.jsx`
  - API: `GET /orders/:id`
  - Show items, payment status, tracking info.
- `AdminOrdersPage.jsx`
  - API: `GET /orders`, `PATCH /orders/:id/status`
  - Status options: pending, shipped, delivered, cancelled.

### 8. Payments
**Components/Pages**
- `MyPaymentsPage.jsx`
  - API: `GET /payments/me`
  - List of transactions with status.
- `PaymentDetailsPage.jsx`
  - API: `GET /payments/order/:orderId`
- `AdminPaymentsPage.jsx`
  - API: `GET /payments`, `PATCH /payments/:id`

---

## **Phase 3: Engagement (Wishlist, Reviews, Messaging, Notifications)**

### 9. Wishlist
**Components/Pages**
- `WishlistPage.jsx`
  - APIs: `GET /wishlists/me`, `POST /wishlists`, `DELETE /wishlists/:productId`
  - Show product cards, remove button.

### 10. Reviews
**Components/Pages**
- `ReviewsSection.jsx` (inside ProductDetailsPage)
  - APIs: `GET /reviews/product/:productId`, `POST /reviews`
  - Display stars, comment, date.
- `MyReviewsPage.jsx`
  - API: `GET /reviews/me`
- `AdminReviewsPage.jsx`
  - API: `DELETE /reviews/admin/:id`

### 11. Messages
**Components/Pages**
- `InboxPage.jsx`
  - API: `GET /messages/inbox`
  - List of conversations sorted by latest message.
- `ChatPage.jsx`
  - APIs: `GET /messages/with/:userId`, `POST /messages`
  - Real-time WebSocket integration (optional).

### 12. Notifications
**Components/Pages**
- `NotificationsPage.jsx`
  - API: `GET /notifications/me`
  - Show as list, allow mark-read/unread.
- `AdminSendNotificationPage.jsx`
  - APIs: `POST /notifications`, `POST /notifications/bulk`

---

## **Phase 4: Admin Dashboard (Control Panel)**

### 13. AdminDashboard.jsx
- Quick overview cards (Users, Orders, Products, Payments).
- API: `GET /stats` (optional endpoint).
- Links to all management pages.

---

# ✅ Route Declaration Example (`routerHandler.js`)
```js
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import CartPage from "@/pages/CartPage";
import MyOrdersPage from "@/pages/MyOrdersPage";
// ...other imports

export const routes = [
  { path: "/products", element: <ProductsPage /> },
  { path: "/products/:id", element: <ProductDetailsPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/orders", element: <MyOrdersPage /> },
  // continue for all pages...
];
```

---

## 📂 Suggested Folder Structure
```
src/
 ┣ pages/
 ┃ ┣ ProfilePage.jsx
 ┃ ┣ SettingsPage.jsx
 ┃ ┣ ProductsPage.jsx
 ┃ ┣ ProductDetailsPage.jsx
 ┃ ┣ CartPage.jsx
 ┃ ┣ CheckoutPage.jsx
 ┃ ┣ MyOrdersPage.jsx
 ┃ ┣ OrderDetailsPage.jsx
 ┃ ┣ AdminOrdersPage.jsx
 ┃ ┣ WishlistPage.jsx
 ┃ ┣ NotificationsPage.jsx
 ┃ ┗ AdminDashboard.jsx
 ┣ components/
 ┃ ┣ forms/
 ┃ ┣ modals/
 ┃ ┣ common/
 ┣ services/
 ┃ ┣ userService.js
 ┃ ┣ productService.js
 ┃ ┣ cartService.js
 ┃ ┣ orderService.js
 ┃ ┗ api.js
 ┣ routerHandler.js
 ┗ store/
```

---
