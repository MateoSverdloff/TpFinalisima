import axios from 'axios';
import { useAuth } from '../AuthContext';

const api = axios.create({
  baseURL: 'https://wholly-intense-kiwi.ngrok-free.app/api/event/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getParticipants = async (eventId) => {
  try {
      const response = await api.get(`/${eventId}/enrollment`);
      if (response.status === 200) {
          return response.data;
      }
  } catch (error) {
      throw error;
  }
};
  
  export const subscribeToEvent = async (eventId, token) => {
    console.log('evento ', eventId);
    console.log('token ', token);
    try {
        if (!token) throw new Error('Token no disponible');
        const response = await api.post(`/${eventId}/enrollment`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error('Error en la inscripción');
        }
    } catch (error) {
        console.error('Error al inscribirse al evento:', error);
        throw error;
    }
};

export const unsubscribeFromEvent = async (eventId, token) => {
  try {
      if (!token) throw new Error('Token no disponible');
      const response = await api.delete(`/${eventId}/enrollment`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
          return response.data;
      } else {
          throw new Error('Error al desinscribirse'); 
      }
  } catch (error) {
      console.error('Error al desinscribirse del evento:', error);
      throw error;
  }
};

  
  export const getEvents = async () => {
    try {
      const response = await api.get('/');
      if (response.status === 200) {
        
        const events = response.data;
        const ids = events.map(event => event.id);
        const uniqueIds = new Set(ids);
  
        if (ids.length !== uniqueIds.size) {
          console.warn('Hay identificadores duplicados en los datos:', ids);
        }
  
        return events;
      }
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  };
  
  export const getEventById = async (id) => {
    try {
      const response = await api.get(`/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };