import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './navigation/MainStackNavigator.js';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;