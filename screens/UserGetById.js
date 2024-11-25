import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Alert } from 'react-native';
import { getById } from '../services/UserServices';

const UserGetById = () => {
  const [search, setSearch] = useState('');

  const handleSearch = async () => {
    if (search.trim() !== '') {
      try {
        const response = await getById(search);
        Alert.alert(`Nombre: ${response.first_name} ${response.last_name}`);
      } catch (error) {
        Alert.alert('Error al buscar usuario');
      }
    } else {
      Alert.alert('Please enter a valid ID');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Inserte un ID para buscar:</Text>
      <TextInputExample value={search} onChangeText={setSearch} placeholder="ID" keyboardType="numeric" />
      <Button title="Buscar" onPress={handleSearch} />
    </View>
  );
};

const TextInputExample = ({ value, onChangeText, placeholder, keyboardType }) => {
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default UserGetById;