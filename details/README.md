# Backend API Documentation

- Base URL: `http://localhost:3000`
- All JSON bodies must be sent with header: `Content-Type: application/json`
- Authenticated endpoints require header: `Authorization: Bearer <JWT>`

The server mounts routes in `Backend/index.js`:
- `/auth` -> `authRoutes`
- `/users` -> `userRoutes` (admin-restricted where noted)
- `/profiles` -> `profileRoutes`
- `/categories` -> `categoryRoutes`
- `/products` -> `productRoutes`

## Authentication & Tokens
- JWT secret and expiration defined in `Backend/config/jwt.js`.
- Token middleware: `Backend/middlewares/tokenValidations.js`.
  - `verifyToken` expects header `Authorization: Bearer <JWT>`.
  - `verifyTempToken` accepts `Authorization: Bearer <tempToken>` OR query param `?tempToken=...` for OTP flows.

---

## Auth Routes (`/auth`)

1) POST `/auth/register`
- Body: `{ name: string, email: string, password: string, role: 'user' | 'admin' }`
- Response: `201` with verification URL for OTP flow.
- Notes: Sends 6-digit OTP to email.

2) POST `/auth/register/resendOtp`
- Body: `{ email: string }`
- Response: `200` with `newTempToken`.

3) POST `/auth/register/verify-account`
- Body: `{ email: string, otp: string(6 digits) }`
- Response: `200` with `{ token, user }` on success (account verified).

4) GET `/auth/register/verify-account`
- Temp token: Header `Authorization: Bearer <tempToken>` OR Query `?tempToken=<tempToken>`
- Response: `200` `{ success, message, email }` to prompt entering OTP.

5) POST `/auth/login`
- Body: `{ email: string, password: string }`
- Response: `200` with `{ token, user }`.

6) GET `/auth/showInfo`
- Auth: Bearer JWT
- Response: `200` with `{ user }` for the logged-in user.

7) PUT `/auth/change-password`
- Auth: Bearer JWT
- Body: `{ currentPassword: string, newPassword: string }`
- Response: `200` on password change.

Forgot Password Flow
8) POST `/auth/forget-password`
- Body: `{ email: string }`
- Response: `200` with `{ tempToken }` and OTP emailed.

9) POST `/auth/forget-password/resendOtp`
- Body: `{ email: string }`
- Response: `200` with `{ newTempToken }`.

10) POST `/auth/forget-password/verifyOtp`
- Body: `{ email: string, otp: string }`
- Response: `200` if OTP valid (sets `isOtpVerified` server-side for reset step).

11) POST `/auth/forget-password/resetPassword`
- Body: `{ email: string, otp: string, password: string }`
- Response: `200` on successful reset.

12) POST `/auth/verify-token`
- Auth: Bearer JWT
- Response: `200` if token is valid.

---

## User Routes (`/users`) — Admin-only where noted

1) GET `/users`
- Auth: Bearer JWT + role `admin`
- Query params (optional):
  - `role`: filter by user role
  - `q`: search by name/email (case-insensitive)
  - `includeDeleted`: if truthy, include soft-deleted users
- Response: `200` with `{ users }`.

2) GET `/users/:id`
- Auth: Bearer JWT + role `admin`
- Params: `id` (Mongo ObjectId)
- Response: `200` with `{ user }`.

3) PATCH `/users/:id`
- Auth: Bearer JWT + role `admin`
- Params: `id`
- Body (any subset allowed): `{ name?, role?, darkMode?, profilePicture?, is_deleted? }`
- Response: `200` with updated `{ user }`.

4) DELETE `/users/:id` (soft delete)
- Auth: Bearer JWT + role `admin`
- Params: `id`
- Response: `200` with soft-deleted `{ user }`.

5) GET `/users/me/current`
- Auth: Bearer JWT
- Response: `200` with current `{ user }`.

6) PATCH `/users/me/current`
- Auth: Bearer JWT
- Body (any subset): `{ name?, darkMode?, profilePicture? }`
- Response: `200` with updated `{ user }`.

---

## Profile Routes (`/profiles`)

1) POST `/profiles/me`
- Auth: Bearer JWT
- Body (any subset): `{ full_name?, bio?, profile_image? }`
- Response: `201` with created `{ profile }`.

2) GET `/profiles/me`
- Auth: Bearer JWT
- Response: `200` with `{ profile }` (populated `user` without password).

3) PATCH `/profiles/me`
- Auth: Bearer JWT
- Body (any subset): `{ full_name?, bio?, profile_image? }`
- Response: `200` with updated `{ profile }`.

4) DELETE `/profiles/me` (soft delete)
- Auth: Bearer JWT
- Response: `200` with soft-deleted `{ profile }`.

5) GET `/profiles/:userId` — Admin only
- Auth: Bearer JWT + role `admin`
- Params: `userId` (Mongo ObjectId)
- Response: `200` with `{ profile }` for that user.

---

## Category Routes (`/categories`)

1) GET `/categories`
- Query params (optional):
  - `q`: search by name (case-insensitive)
  - `includeDeleted`: if truthy, include soft-deleted categories
- Auth: public
- Response: `{ categories: Category[] }`

2) GET `/categories/:id`
- Params: `id` (Mongo ObjectId)
- Auth: public
- Response: `{ category: Category }`

3) POST `/categories`
- Auth: Bearer JWT + role `admin`
- Body: `{ name: string }`
- Response: `201` `{ category }` (or restored if previously soft-deleted)

4) PATCH `/categories/:id`
- Auth: Bearer JWT + role `admin`
- Params: `id`
- Body (any subset): `{ name?, is_deleted? }`
- Response: `{ category }`

5) DELETE `/categories/:id` (soft delete)
- Auth: Bearer JWT + role `admin`
- Params: `id`
- Response: `{ category }`

---

## Product Routes (`/products`)

1) GET `/products`
- Query params (optional):
  - `q`: full-text search (title, description, details.brand, details.model)
  - `category`: Category ID
  - `status`: one of `available|sold|reserved`
  - `user`: Seller (User) ID
  - `minPrice`, `maxPrice`: number
  - `page`, `limit`: pagination (default 1, 20)
  - `includeDeleted`: include soft-deleted
- Auth: public
- Response: `{ items: Product[], page, limit, total }`

2) GET `/products/:id`
- Params: `id` (Mongo ObjectId)
- Auth: public
- Response: `{ product: Product }`

3) POST `/products`
- Auth: Bearer JWT (seller)
- Body (required): `{ category, title, price, stock_quantity }`
- Body (optional): `{ description, status, details, images }`
- Response: `201` `{ product }`

4) PATCH `/products/:id`
- Auth: Bearer JWT (owner or admin)
- Params: `id`
- Body (any subset): `{ category?, title?, description?, price?, stock_quantity?, status?, details?, images?, is_deleted? }`
- Response: `{ product }`

5) DELETE `/products/:id` (soft delete)
- Auth: Bearer JWT (owner or admin)
- Params: `id`
- Response: `{ product }`

---

## Cart Routes (`/carts`)

1) GET `/carts/me`
- Auth: Bearer JWT
- Response: `{ cart }` (items populated with product summary)

2) POST `/carts/me/items`
- Auth: Bearer JWT
- Body: `{ product: ObjectId, quantity: number >=1 }`
- Response: `{ cart }`

3) PATCH `/carts/me/items/:productId`
- Auth: Bearer JWT
- Params: `productId`
- Body: `{ quantity: number >=1 }`
- Response: `{ cart }`

4) DELETE `/carts/me/items/:productId`
- Auth: Bearer JWT
- Response: `{ cart }`

5) DELETE `/carts/me`
- Auth: Bearer JWT
- Response: `{ cart }`

6) GET `/carts/user/:userId` — Admin
- Auth: Bearer JWT + role `admin`
- Params: `userId`
- Response: `{ cart }`

---

## Cart Model
- Collection: `carts`

Fields
- `user` (ObjectId, ref: "User", required, unique)
- `items` (Array of `{ product, quantity }`)
- `is_deleted` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

Relationships
- One cart per user; items reference `Product`

---

## Address Routes (`/addresses`)

1) GET `/addresses/me`
- Auth: Bearer JWT
- Response: `{ addresses: Address[] }`

2) POST `/addresses/me`
- Auth: Bearer JWT
- Body: `{ street?, city?, state?, postal_code?, country?, is_primary? }`
- Response: `201` `{ address }`

3) PATCH `/addresses/me/:id`
- Auth: Bearer JWT
- Params: `id`
- Body: partial update; if `is_primary: true` it will unset others.
- Response: `{ address }`

4) DELETE `/addresses/me/:id` (soft delete)
- Auth: Bearer JWT
- Params: `id`
- Response: `{ address }`

5) POST `/addresses/me/:id/make-primary`
- Auth: Bearer JWT
- Params: `id`
- Response: `{ address }`

6) GET `/addresses/user/:userId` — Admin
- Auth: Bearer JWT + role `admin`
- Params: `userId`
- Response: `{ addresses }`

---

## Address Model
- Collection: `addresses`

Fields
- `user` (ObjectId, ref: "User", required)
- `street`, `city`, `state`, `postal_code`, `country`
- `is_primary` (Boolean, default: false)
- `is_deleted` (Boolean, default: false)
- `createdAt`, `updatedAt`

Relationships
- Belongs to `User`; used for shipping/billing on orders

---

## Order Routes (`/orders`)

1) POST `/orders`
- Auth: Bearer JWT
- Body: `{ items: [{ product, quantity, price }...], addresses?: [{ street, city, state, postal_code, country }...] }`
- Response: `201` `{ order }`

2) GET `/orders/me`
- Auth: Bearer JWT
- Response: `{ orders: Order[] }`

3) GET `/orders/:id`
- Auth: Bearer JWT (owner or admin)
- Params: `id`
- Response: `{ order }`

4) POST `/orders/:id/cancel`
- Auth: Bearer JWT (owner)
- Response: `{ order }` (status becomes `cancelled` if allowed)

5) GET `/orders` — Admin
- Auth: Bearer JWT + role `admin`
- Query: `user?`, `status?`, `page?`, `limit?`
- Response: `{ items, page, limit, total }`

6) PATCH `/orders/:id/status` — Admin
- Auth: Bearer JWT + role `admin`
- Body: `{ status: 'pending'|'shipped'|'delivered'|'cancelled' }`
- Response: `{ order }`

---

## Order Model
- Collection: `orders`

Fields
- `user` (ObjectId, ref: "User", required)
- `items` (Array of `{ product, quantity, price }`)
- `total_amount` (Number, required)
- `status` (Enum: pending|shipped|delivered|cancelled, default pending)
- `addresses` (Array of `{ street, city, state, postal_code, country }`)
- `is_deleted` (Boolean, default: false)
- `createdAt`, `updatedAt`

Relationships
- Belongs to `User`; contains multiple `Product`s; linked with `Payment`

---

## Payment Routes (`/payments`)

1) POST `/payments`
- Auth: Bearer JWT (owner or admin)
- Body: `{ order: ObjectId, amount: number, method: 'card'|'upi'|'wallet'|'cod', transaction_id? }`
- Response: `201` `{ payment }`

2) GET `/payments/me`
- Auth: Bearer JWT
- Response: `{ payments: Payment[] }`

3) GET `/payments/order/:orderId`
- Auth: Bearer JWT (owner or admin)
- Params: `orderId`
- Response: `{ payments }`

4) GET `/payments` — Admin
- Auth: Bearer JWT + role `admin`
- Query: `user?`, `order?`, `status?`, `method?`, `page?`, `limit?`
- Response: `{ items, page, limit, total }`

5) PATCH `/payments/:id` — Admin
- Auth: Bearer JWT + role `admin`
- Body: `{ status?, transaction_id?, amount?, method?, is_deleted? }`
- Response: `{ payment }`

---

## Payment Model
- Collection: `payments`

Fields
- `order` (ObjectId, ref: "Order", required)
- `user` (ObjectId, ref: "User", required)
- `amount` (Number, required)
- `method` (Enum: card|upi|wallet|cod)
- `status` (Enum: pending|completed|failed, default pending)
- `transaction_id` (String, unique, optional)
- `is_deleted` (Boolean, default: false)
- `createdAt`, `updatedAt`

Relationships
- Belongs to `Order` and `User`

---

## Category Model
- Collection: `categories`

Fields
- `name` (String, required, unique)
- `is_deleted` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

Indexes
- Unique index on `name`

Relationships
- Referenced by Product (each product belongs to one category)

---

## Product Model
- Collection: `products`

Fields
- `user` (ObjectId, ref: "User", required) — seller
- `category` (ObjectId, ref: "Category", required)
- `title` (String, required)
- `description` (String)
- `price` (Number, required, min: 0)
- `stock_quantity` (Number, required, min: 0)
- `status` (String, enum: [available, sold, reserved], default: available)
- `details` (embedded):
  - `condition` (String, enum: [new, used, refurbished], required)
  - `year_of_manufacture` (Number)
  - `brand` (String)
  - `model` (String)
  - `dimensions` (`length_cm`, `width_cm`, `height_cm`)
  - `weight_kg` (Number)
  - `material` (String)
  - `color` (String)
  - `original_packaging` (Boolean, default: false)
  - `manual_included` (Boolean, default: false)
  - `working_condition_description` (String)
- `images` (Array):
  - `url` (String, required)
  - `is_primary` (Boolean, default: false)
  - `position` (Number, default: 0)
- `is_deleted` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

Indexes
- Text index: `title`, `description`, `details.brand`, `details.model`

Relationships
- Belongs to `User` (seller)
- Belongs to `Category`
- Referenced by Cart, Order, Wishlist, Review, Message

---

## Wishlist Routes (`/wishlists`)

1) GET `/wishlists/me`
- Auth: Bearer JWT
- Response: `{ items: [{ product, createdAt }] }`

2) POST `/wishlists`
- Auth: Bearer JWT
- Body: `{ product: ObjectId }`
- Response: `201` `{ wishlist }` (revives if previously soft-deleted)

3) DELETE `/wishlists/:productId`
- Auth: Bearer JWT
- Params: `productId`
- Response: `{ wishlist }`

---

## Wishlist Model
- Collection: `wishlists`

Fields
- `user` (ObjectId, ref: "User", required)
- `product` (ObjectId, ref: "Product", required)
- `createdAt` (Date)
- `is_deleted` (Boolean, default: false)

Indexes
- Unique compound index on `{ user, product }`

Relationships
- Belongs to `User` and `Product`

---

## Review Routes (`/reviews`)

1) GET `/reviews/product/:productId`
- Public
- Response: `{ reviews: Review[] }`

2) GET `/reviews/me`
- Auth: Bearer JWT
- Response: `{ reviews: Review[] }`

3) POST `/reviews`
- Auth: Bearer JWT
- Body: `{ product: ObjectId, rating: 1..5, comment? }`
- Response: `201` `{ review }` (upsert own review)

4) DELETE `/reviews/:productId`
- Auth: Bearer JWT (owner)
- Response: `{ review }`

5) DELETE `/reviews/admin/:id` — Admin
- Auth: Bearer JWT + role `admin`
- Response: `{ review }`

---

## Review Model
- Collection: `reviews`

Fields
- `user` (ObjectId, ref: "User", required)
- `product` (ObjectId, ref: "Product", required)
- `rating` (Number, required, min: 1, max: 5)
- `comment` (String, optional)
- `createdAt` (Date)
- `is_deleted` (Boolean, default: false)

Indexes
- Unique compound index on `{ user, product }`

Relationships
- Belongs to `User` and `Product`

---

## Message Routes (`/messages`)

1) POST `/messages`
- Auth: Bearer JWT
- Body: `{ receiver: ObjectId, product?: ObjectId, message: string }`
- Response: `201` `{ message }`

2) GET `/messages/with/:userId`
- Auth: Bearer JWT
- Response: `{ messages: Message[] }` (both directions between current user and `userId`)

3) PATCH `/messages/:id/archive`
- Auth: Bearer JWT (sender or receiver)
- Response: `{ message }`

4) PATCH `/messages/:id/unarchive`
- Auth: Bearer JWT (sender or receiver)
- Response: `{ message }`

5) DELETE `/messages/:id`
- Auth: Bearer JWT (sender or receiver)
- Response: `{ message }`

---

## Message Model
- Collection: `messages`

Fields
- `sender` (ObjectId, ref: "User", required)
- `receiver` (ObjectId, ref: "User", required)
- `product` (ObjectId, ref: "Product", optional)
- `message` (String, required)
- `createdAt` (Date)
- `archived` (Boolean, default: false)
- `is_deleted` (Boolean, default: false)

Relationships
- User-to-User messaging, optionally linked to a `Product`

---

## Notification Routes (`/notifications`)

1) GET `/notifications/me`
- Auth: Bearer JWT
- Query: `onlyUnread?`
- Response: `{ notifications: Notification[] }`

2) PATCH `/notifications/:id/read`
- Auth: Bearer JWT
- Response: `{ notification }`

3) PATCH `/notifications/:id/unread`
- Auth: Bearer JWT
- Response: `{ notification }`

4) DELETE `/notifications/:id`
- Auth: Bearer JWT
- Response: `{ notification }`

5) POST `/notifications` — Admin
- Auth: Bearer JWT + role `admin`
- Body: `{ user: ObjectId, type: string, content: string }`
- Response: `201` `{ notification }`

6) POST `/notifications/bulk` — Admin
- Auth: Bearer JWT + role `admin`
- Body: `{ users: ObjectId[], type: string, content: string }`
- Response: `201` `{ count }`

---

## Notification Model
- Collection: `notifications`

Fields
- `user` (ObjectId, ref: "User", required)
- `type` (String, e.g., "order", "message", "system")
- `content` (String)
- `is_read` (Boolean, default: false)
- `createdAt` (Date)
- `is_deleted` (Boolean, default: false)

Relationships
- Belongs to `User`

---

## Common Responses
- Success shape: `{ success: true, message: string, data?: object }`
- Error shape: `{ success: false, message: string }`

See helpers in `Backend/utils/response.js` for exact shape.

---

## CORS & Frontend
- Allowed origins configured in `Backend/index.js` include:
  - `http://localhost:5173`, `5174`, `5175`, `5176`, `5177`, and `http://localhost:3000`.
- Ensure requests include `credentials: true` when needed by your frontend client if cookies are involved.

---

## Quick Examples

Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret"
}
```

Authenticated fetch current user
```http
GET /users/me/current
Authorization: Bearer <JWT>
```

Create my profile
```http
POST /profiles/me
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "full_name": "John Doe",
  "bio": "Hi there",
  "profile_image": "https://..."
}
```

Create a new category
```http
POST /categories
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "name": "Electronics"
}
```

Create a new product
```http
POST /products
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "category": "Electronics",
  "title": "Apple iPhone",
  "price": 999,
  "stock_quantity": 10
}
