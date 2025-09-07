# E‑Commerce Backend API (Node.js, Express, MongoDB)

![Database Structure]([blob:https://web.whatsapp.com/5586328e-3b1d-4519-aaf4-3d0e5c3984ac](https://res.cloudinary.com/dbc5dhyru/image/upload/v1757160916/WhatsApp_Image_2025-09-06_at_5.40.16_PM_fbvhsx.jpg))


A production‑ready backend powering authentication, user management, product catalog, shopping cart, orders, payments, and user engagement (wishlist, reviews, messaging, notifications). This README highlights the backend features, architecture, setup, and usage.

- Base URL: `http://localhost:3000`
- Content type: `Content-Type: application/json`
- Auth header: `Authorization: Bearer <JWT>`


## Key Features

- Authentication and Authorization
  - Email OTP account verification with temporary token support
  - JWT login/session with token verification endpoint
  - Password change and full forgot‑password flow (OTP + reset)
  - Role‑based access control (`user`, `admin`)
- User & Profile
  - Admin user management with soft delete and search
  - Self service for viewing/updating own user and profile
- Catalog
  - Categories CRUD (admin)
  - Products CRUD with advanced filters, full‑text search, soft delete
- Shopping
  - Cart management for each user (add, update, remove, clear)
  - Addresses with primary address handling
  - Orders creation, list, details, cancel; admin status updates
  - Payments creation and listing, admin moderation
- Engagement
  - Wishlist add/remove/list with unique constraint per product/user
  - Reviews (upsert own review, list by product/user, admin moderation)
  - Messaging between users (optional product link), archive/unarchive
  - Notifications (user list, mark read/unread, admin send & bulk)
- Platform Capabilities
  - Consistent success/error response shapes
  - Soft delete support across major resources
  - Pagination and query filters on list endpoints
  - CORS configured for local frontend ports (5173‑5177) and 3000


## Tech Stack

- Node.js, Express.js
- MongoDB with Mongoose
- JWT for auth, Nodemailer (for OTP emails)


## Project Structure

```
Backend/
 ┣ config/
 ┃ ┣ db.js              # Mongo connection
 ┃ ┗ jwt.js             # JWT secret & expiry
 ┣ controllers/         # Route handlers (auth, users, profiles, ...)
 ┣ middlewares/
 ┃ ┣ roleCheck.js       # Role‑based access control
 ┃ ┗ tokenValidations.js# verifyToken / verifyTempToken
 ┣ models/              # Mongoose models (User, Product, Order, ...)
 ┣ routes/              # Express routers mounted in index.js
 ┣ utils/               # helpers (response, etc.)
 ┣ index.js             # App bootstrap, CORS, route mounting
 ┗ README.md            # This file
```

Routers mounted in `Backend/index.js`:
- `/auth` → authentication flows
- `/users` → admin & self service
- `/profiles` → current user profile CRUD
- `/categories` → catalog categories
- `/products` → catalog products
- `/carts` → shopping cart
- `/addresses` → user addresses
- `/orders` → order lifecycle
- `/payments` → payments
- `/wishlists` → wishlist
- `/reviews` → product reviews
- `/messages` → user messaging
- `/notifications` → user notifications


## Security & Middleware

- JWT configuration in `config/jwt.js`
- Token middleware in `middlewares/tokenValidations.js`
  - `verifyToken` expects `Authorization: Bearer <JWT>`
  - `verifyTempToken` supports temp token via header or `?tempToken=` (OTP flows)
- Role middleware in `middlewares/roleCheck.js`
- Input validation middleware where applicable


## API Overview (Highlights)

- Auth (`/auth`): register + email OTP verify, login, showInfo, change‑password, forgot‑password (otp, resend, reset), verify‑token
- Users (`/users`) [admin]: list/search, get by id, patch, soft delete; self: `/users/me/current` get/patch
- Profiles (`/profiles`): me create/get/patch/delete; admin get by userId
- Categories (`/categories`): public list/get; admin create/patch/delete
- Products (`/products`): public list/get with filters (q, category, price range, status, seller); auth create/patch/delete
- Carts (`/carts`): me get; add item; update qty; remove item; clear; admin get by user
- Addresses (`/addresses`): me list/create/patch/delete/make‑primary; admin get by user
- Orders (`/orders`): create; my orders; get by id; cancel; admin list + patch status
- Payments (`/payments`): create; my payments; by order; admin list/patch
- Wishlist (`/wishlists`): me list; add; delete
- Reviews (`/reviews`): by product; my reviews; add/upsert; delete (self); admin delete
- Messages (`/messages`): send; fetch conversation with a user; archive/unarchive; delete
- Notifications (`/notifications`): my list (with onlyUnread); mark read/unread; delete; admin send/bulk

For detailed request/response shapes, see `details/README.md`.


## Data Models (Key Fields)

- Category: `name`, soft delete, timestamps (unique name)
- Product: `user`, `category`, `title`, `price`, `stock_quantity`, `details{...}`, `images[]`, `status`, soft delete, text index on title/description/brand/model
- Cart: `user` (unique), `items[{ product, quantity }]`, soft delete
- Address: `user`, fields (street, city, state, postal_code, country), `is_primary`, soft delete
- Order: `user`, `items[{ product, quantity, price }]`, `total_amount`, `status`, `addresses[]`, soft delete
- Payment: `order`, `user`, `amount`, `method`, `status`, `transaction_id?`, soft delete
- Wishlist: unique `{ user, product }`, soft delete
- Review: `{ user, product }` unique pair, `rating`, `comment?`, soft delete
- Message: `sender`, `receiver`, `product?`, `message`, `archived`, soft delete
- Notification: `user`, `type`, `content`, `is_read`, soft delete


## Response Format

- Success: `{ success: true, message: string, data?: object }`
- Error: `{ success: false, message: string }`

See helpers in `Backend/utils/response.js` (if present) for exact shapes.


## CORS & Frontend

- Allowed origins (configured in `index.js`):
  - `http://localhost:5173` to `5177`, and `http://localhost:3000`
- If using cookies, ensure frontend sets `credentials: true`


## Environment Variables (.env)

Create a `.env` in `Backend/` similar to:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
EMAIL_FROM=noreply@example.com
```


## Getting Started

1. Install dependencies
   - Backend: `npm install`
2. Configure environment
   - Create `.env` as above
3. Run the server
   - Dev: `npm run dev`
   - Prod: `npm start`
4. Test a basic flow
   - `POST /auth/register` → receive verification link/temp token
   - `POST /auth/register/verify-account` with OTP → get `{ token, user }`
   - Use `Authorization: Bearer <token>` for protected endpoints


## Example Requests

- Login
```http
POST /auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secret" }
```

- Current user
```http
GET /users/me/current
Authorization: Bearer <JWT>
```

- Create product
```http
POST /products
Authorization: Bearer <JWT>
Content-Type: application/json

{ "category": "<CategoryId>", "title": "Apple iPhone", "price": 999, "stock_quantity": 10 }
```


## Frontend Overview

This repository also contains a React frontend under `Frontend/` that consumes the above APIs.

- Tech: React, React Router, Vite, Tailwind (as applicable)
- API Access: Centralized API wrapper (e.g., `src/services/api.js`) that attaches `Authorization: Bearer <token>` when available
- State: Each page/component maintains `loading` and `error` states; success/error surfaced via toasts/alerts
- Routing: Central registry (e.g., `src/routerHandler.js`) declares all routes

### Major Pages mapped to Backend Endpoints

- Profile
  - `GET /profiles/me` (view profile)
  - `PATCH /profiles/me` (edit profile)
  - `PUT /auth/change-password` (settings)
- Users (Admin)
  - `GET /users` (list + filters), `GET /users/:id`, `PATCH /users/:id`
- Categories
  - `GET /categories` (public)
  - Admin: `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`
- Products
  - `GET /products`, `GET /products/:id`
  - `POST /products`, `PATCH /products/:id`
- Cart & Checkout
  - `GET /carts/me`, `POST /carts/me/items`, `PATCH /carts/me/items/:productId`, `DELETE /carts/me/items/:productId`
  - Checkout uses `POST /orders` then `POST /payments` (as applicable)
- Addresses
  - `GET /addresses/me`, `POST /addresses/me`, `PATCH /addresses/me/:id`, `POST /addresses/me/:id/make-primary`
- Orders
  - `GET /orders/me`, `GET /orders/:id`, Admin: `GET /orders`, `PATCH /orders/:id/status`
- Payments
  - `GET /payments/me`, `GET /payments/order/:orderId`, Admin: `GET /payments`, `PATCH /payments/:id`
- Wishlist
  - `GET /wishlists/me`, `POST /wishlists`, `DELETE /wishlists/:productId`
- Reviews
  - `GET /reviews/product/:productId`, `POST /reviews`, `GET /reviews/me`, Admin delete
- Messages
  - `GET /messages/with/:userId`, `POST /messages`
- Notifications
  - `GET /notifications/me`, mark read/unread, Admin send/bulk

### Suggested Frontend Structure

```
Frontend/
 ┣ src/
 ┃ ┣ pages/
 ┃ ┃ ┣ ProfilePage.jsx
 ┃ ┃ ┣ SettingsPage.jsx
 ┃ ┃ ┣ ProductsPage.jsx
 ┃ ┃ ┣ ProductDetailsPage.jsx
 ┃ ┃ ┣ CartPage.jsx
 ┃ ┃ ┣ CheckoutPage.jsx
 ┃ ┃ ┣ MyOrdersPage.jsx
 ┃ ┃ ┣ OrderDetailsPage.jsx
 ┃ ┃ ┣ AdminOrdersPage.jsx
 ┃ ┃ ┣ WishlistPage.jsx
 ┃ ┃ ┣ NotificationsPage.jsx
 ┃ ┃ ┗ AdminDashboard.jsx
 ┃ ┣ components/
 ┃ ┣ services/
 ┃ ┃ ┣ api.js
 ┃ ┃ ┣ userService.js
 ┃ ┃ ┣ productService.js
 ┃ ┃ ┣ cartService.js
 ┃ ┃ ┣ orderService.js
 ┃ ┃ ┗ authService.js
 ┃ ┗ routerHandler.js
```

### Frontend Setup

1. Install dependencies
   - Frontend: `cd Frontend && npm install`
2. Environment variables (optional)
   - Create `Frontend/.env` with `VITE_API_BASE_URL=http://localhost:3000`
3. Run the dev server
   - `npm run dev` (Vite default port `5173`)
4. Authentication
   - On login, store the JWT (e.g., localStorage) and attach it as `Authorization: Bearer <token>` in the API client


## Notes

- Most list endpoints support `page`, `limit`, and resource‑specific filters
- Most resources implement soft delete to preserve history
- Admin‑only endpoints are guarded by role middleware
