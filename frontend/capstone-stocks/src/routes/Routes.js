import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from '../homepage/Homepage';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import UserDetails from '../homepage/UserDetails';

function MainRoutes({ login, logout, signup, currentUser }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage currentUser={currentUser} />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      {currentUser && (
        <Route path="/user_details" element={<UserDetails currentUser={currentUser} logout={logout} />} />
      )}
 
    </Routes>
  );
}

export default MainRoutes;
