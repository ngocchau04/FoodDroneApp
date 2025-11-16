import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('123456');

  const onSubmit = async () => {
    try {
      await login(email, password);
    } catch (e: any) {
      console.log(e.response?.data || e.message);
      Alert.alert('Đăng nhập thất bại', 'Kiểm tra lại email/mật khẩu hoặc server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
