import './App.css';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgetPassword from './components/Auth/ForgetPassword';
import VerifyAccount from './components/Auth/VerifyAccount';
import Dashboard from './components/Dashboard';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/forget-password' element={<ForgetPassword/>}></Route>
        <Route path='/verify-account' element={<VerifyAccount/>}></Route>
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;