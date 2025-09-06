---
description: Repository Information Overview
alwaysApply: true
---

# E-Commerce Application Information

## Repository Summary
A full-stack e-commerce application with a React frontend and Express.js backend. The system provides comprehensive user authentication, product management, shopping cart functionality, order processing, and payment handling.

## Repository Structure
- **Backend**: Express.js API server with MongoDB integration
- **Frontend**: React-based single-page application using Vite
- **details**: Documentation for API endpoints and models

## Projects

### Backend (Express.js API)
**Configuration File**: package.json

#### Language & Runtime
**Language**: JavaScript (ES Modules)
**Version**: Node.js
**Database**: MongoDB with Mongoose ODM
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express (v5.1.0): Web framework
- mongoose (v8.17.1): MongoDB ODM
- jsonwebtoken (v9.0.2): Authentication
- bcryptjs (v3.0.2): Password hashing
- joi (v18.0.0): Validation
- nodemailer (v7.0.5): Email services
- dotenv (v17.2.1): Environment configuration

#### Build & Installation
```bash
cd Backend
npm install
npm run dev  # Development with nodemon
npm start    # Production
```

#### Main Files
- **index.js**: Application entry point
- **config/db.js**: MongoDB connection
- **config/jwt.js**: JWT configuration
- **routes/**: API endpoint definitions
- **controllers/**: Business logic
- **models/**: MongoDB schema definitions
- **middlewares/**: Request processing middleware

### Frontend (React SPA)
**Configuration File**: package.json

#### Language & Runtime
**Language**: JavaScript/JSX
**Version**: React 19
**Build System**: Vite 7
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react (v19.1.1): UI library
- react-dom (v19.1.1): DOM rendering
- react-router-dom (v7.8.2): Routing
- @reduxjs/toolkit (v2.9.0): State management
- react-redux (v9.2.0): React bindings for Redux
- tailwindcss (v4.1.13): CSS framework

**Development Dependencies**:
- vite (v7.1.2): Build tool
- eslint (v9.33.0): Code linting
- @vitejs/plugin-react (v5.0.0): React integration

#### Build & Installation
```bash
cd Frontend
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

#### Main Files
- **src/main.jsx**: Application entry point
- **src/App.jsx**: Root component
- **src/components/**: Reusable UI components
- **src/pages/**: Page components
- **src/store/**: Redux state management
- **src/services/**: API service integrations

## API Endpoints
The backend provides RESTful API endpoints for:
- User authentication and management
- Product catalog and search
- Shopping cart operations
- Order processing
- Payment handling
- User profiles and addresses
- Wishlists and reviews

## Database Models
MongoDB collections include:
- Users
- Products
- Categories
- Carts
- Orders
- Payments
- Profiles
- Addresses
- Wishlists
- Reviews
- Messages
- Notifications