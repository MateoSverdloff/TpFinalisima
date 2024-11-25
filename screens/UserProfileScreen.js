import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../AuthContext';
import { getUser } from '../services/UserServices.js'

const UserProfileScreen = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser(user.id);
        setUserData(data);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nombre: {userData?.first_name}</Text>
      <Text style={styles.text}>Apellido: {userData?.last_name}</Text>
      <Text style={styles.text}>Correo: {userData?.username}</Text>
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
