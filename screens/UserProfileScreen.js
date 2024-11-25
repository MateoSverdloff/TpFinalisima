import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../AuthContext';
import {getUser} from '../services/UserServices.js'

const UserProfileScreen = async () => {
  const { user } = useAuth();
  console.log('user', user);
  const datoUser = await getUser(user.id); 
  console.log('datoUSer', datoUser);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nombre: {datoUser?.first_name}</Text>
      <Text style={styles.text}>Apellido: {datoUser?.last_name}</Text>
      <Text style={styles.text}>Correo: {datoUser?.username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
  },
});

export default UserProfileScreen;
