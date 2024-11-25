import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator.js'; 
import LoginScreen from '../screens/LoginScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js'; 
import EventDetailScreen from '../screens/EventDetailScreen';
import EventCategoryDetail from '../screens/EventCategoryDetail';
import { useAuth } from '../AuthContext.js';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EventDetail" 
            component={EventDetailScreen} 
            options={{ title: 'Detalles del Evento' }}
          />
          <Stack.Screen 
            name="EventCategoryDetail" 
            component={EventCategoryDetail} 
            options={{ title: 'Eventos por Categoría' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
