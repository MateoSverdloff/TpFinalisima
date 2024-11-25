import React, { createContext, useState, useContext } from 'react';
import { login as loginService, registerTo, getUser } from './services/UserServices.js';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await loginService(username, password);
      if (response.success) {
        setIsAuthenticated(true);
        const decodedUser = jwtDecode(response.token);
        console.log(decodedUser)
        setUser({ ...decodedUser, token: response.token });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (firstName, lastName, username, password) => {
    try {
      const response = await registerTo(firstName, lastName, username, password);
      if (response) {
        await login(username, password);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
