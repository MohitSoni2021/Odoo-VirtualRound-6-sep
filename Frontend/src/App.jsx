import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken, getCurrentUser } from './store/slices/authSlice';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgetPassword from './components/Auth/ForgetPassword';
import VerifyAccount from './components/Auth/VerifyAccount';

// Buyer Pages
import HomePage from './pages/buyer/HomePage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import OrdersPage from './pages/buyer/OrdersPage';
import WishlistPage from './pages/buyer/WishlistPage';
import ReviewsPage from './pages/buyer/ReviewsPage';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

// Other Components
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(verifyToken(storedToken));
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/forget-password' element={<ForgetPassword/>} />
      <Route path='/verify-account' element={<VerifyAccount/>} />
      <Route path='/eco' element={<Landing/>} />
      
      {/* Buyer Dashboard Routes */}
      <Route 
        path='/' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <HomePage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/products/:id' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <ProductDetailPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/cart' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <CartPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/checkout' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <CheckoutPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/orders' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <OrdersPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/wishlist' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <WishlistPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/reviews/me' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
              <ReviewsPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        } 
      />
      
      {/* Explicit role-based dashboards to match Login redirects */}
      <Route 
        path='/buyer/dashboard'
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path='/seller/dashboard'
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["seller"]}>
              <Dashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path='/admin/dashboard'
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Legacy Dashboard Route */}
      <Route 
        path='/dashboard' 
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["buyer","seller","admin"]}>
              <Dashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;