import React, { createContext, useState } from 'react';
import { TOKEN_STORAGE_ID } from '../auth/Config';
import StocksApi from '../api/Api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);


const logout = () => {
  console.log("Logging out"); // working?
  setCurrentUser(null);
  setToken(null);
  localStorage.removeItem(TOKEN_STORAGE_ID);
  StocksApi.token = null;
  window.location.href = '/login'; 
};


  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken, logout }}> 
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
