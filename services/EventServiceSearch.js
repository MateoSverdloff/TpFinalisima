import axios from 'axios';
import { useAuth } from '../AuthContext';

const api = axios.create({
  baseURL: 'https://wholly-intense-kiwi.ngrok-free.app/api/event/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = async () => {
    try {
            const response = await api.get('https://wholly-intense-kiwi.ngrok-free.app/api/event-category/');
            if (response.status === 200) {
                    return response.data;
                    }
                } catch (error) {
                    throw error;
                }
};

export const getEventsByCategory = async (id) => {
    try {
        const response = await api.get(`https://wholly-intense-kiwi.ngrok-free.app/api/event/category/${id}`);
        if (response.status === 200) {
            return response.data.response;
        }
    } catch (error) {
        throw error;
    }
};

