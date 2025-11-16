// src/screens/RestaurantHomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RestaurantHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Dashboard</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Xem danh sách đơn hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Quản lý thực đơn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cập nhật trạng thái đơn hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  }
});
