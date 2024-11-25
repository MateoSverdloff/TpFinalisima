import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../AuthContext';
import  { registerTo }  from '../services/UserServices.js'

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (firstName && lastName && username && password) {
      try {
        await register(firstName, lastName, username, password);
        Alert.alert('Registration successful');
        navigation.goBack();
      } catch (error) {
        Alert.alert(`Registration failed: ${error.message}`);
      }
    } else {
      Alert.alert('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Register</Text>
      <TextInputExample value={firstName} onChangeText={setFirstName} placeholder="First Name" />
      <TextInputExample value={lastName} onChangeText={setLastName} placeholder="Last Name" />
      <TextInputExample value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInputExample value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={true} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const TextInputExample = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
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

export default RegisterScreen;
