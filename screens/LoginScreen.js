import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        const user = await login(username, password);
        Alert.alert('Login successful');
        console.log('Logged in user:', user);
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert(`Login failed: ${error.message}`);
      }
    } else {
      Alert.alert('Please enter both username and password');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInputExample value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInputExample value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={true} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
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

export default LoginScreen;
