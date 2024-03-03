
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './routes/Routes';
import { UserProvider } from './auth/UserContext';
import useLocalStorage from './hooks/useLocalStorage'; 
import StocksApi from './api/Api';
import jwtDecode from 'jwt-decode';
//import LoginForm from './auth/LoginForm';
import Navbar from './components/NavBar';

import { TOKEN_STORAGE_ID } from './auth/Config';

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID, null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadUserInfo() {
      if (token) {
        try {
          let decodedToken = jwtDecode(token);
          if (decodedToken && decodedToken.username) {
            let { username, exp } = decodedToken;
            const currentTime = Math.floor(Date.now() / 1000);
            if (exp > currentTime) {
              StocksApi.token = token;
              let currentUser = await StocksApi.getCurrentUser(username);
              setCurrentUser(currentUser);
            } else {
              setCurrentUser(null);
              setToken(null);
            }
          } else {
            setCurrentUser(null);
            setToken(null);
          }
        } catch (err) {
          setCurrentUser(null);
          setToken(null);
        }
      }
    }
    
    loadUserInfo();
  }, [token, setToken]);
  
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    StocksApi.token = null;  
    // Direct navigation to "/login" is not done here due to useNavigate hook restrictions
  };
  
  const login = async (loginData) => {
    try {
      let response = await StocksApi.login(loginData);
      if (response && response.access_token) {
        setToken(response.access_token);
        let currentUser = await StocksApi.getCurrentUser(loginData.username);
        setCurrentUser(currentUser);
        return { success: true, token: response.access_token };
      } else {
        console.error('Login failed: Invalid response');
        return { success: false, errors: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, errors: error };
    }
  };

  const signup = async (signupData) => {
    try {
      let response = await StocksApi.signup(signupData);
      if (response && response.access_token) {
        setToken(response.access_token);
        let currentUser = await StocksApi.getCurrentUser(signupData.username);
        setCurrentUser(currentUser);
        return { success: true, token: response.access_token };
      } else {
        console.error('Signup failed: Invalid response');
        return { success: false, errors: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, errors: error };
    }
  };

  return (
    <BrowserRouter>
      <UserProvider value={{ currentUser, logout, login, signup }}>
        <Navbar />
        <div className="App">
          <MainRoutes 
            currentUser={currentUser}
            login={login}
            signup={signup}
            logout={logout}
          />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
