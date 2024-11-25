import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'https://wholly-intense-kiwi.ngrok-free.app/api/user/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('https://wholly-intense-kiwi.ngrok-free.app/api/user/login', {
      username: username,
      password: password,
    });
    const token = response.data.token;
    const getUserFromToken = (token) => {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
      } catch (error) {
        console.log('Error decoding token:', error);
        return null;
      }
    };

    if (response.data.success) {
      const user = getUserFromToken(token);
      
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};




export const registerTo = async (first_name, last_name, username, password) => {
  try {
    const response = await api.post('https://wholly-intense-kiwi.ngrok-free.app/api/user/', {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
    });

    if (response.status === 201 || response.status === 200) {
      return response.data; 
    } else {
      throw new Error(response.data?.message || 'Registration failed');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};


export const getUser = async (id) => {
  try {
    const response = await api.get(`https://wholly-intense-kiwi.ngrok-free.app/api/user/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error al traer el usuario:', error);
    throw new Error('Error al traer el usuario');
  }
};

