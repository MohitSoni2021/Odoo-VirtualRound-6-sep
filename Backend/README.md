# E‑Commerce Backend API (Node.js, Express, MongoDB)

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


## Notes

- Most list endpoints support `page`, `limit`, and resource‑specific filters
- Most resources implement soft delete to preserve history
- Admin‑only endpoints are guarded by role middleware