import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';
import { AuthNavigator } from './navigation/AuthNavigator';
import { CustomerNavigator } from './navigation/CustomerNavigator';
import { RestaurantNavigator } from './navigation/RestaurantNavigator';
import { AdminNavigator } from './navigation/AdminNavigator';

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'CUSTOMER' ? (
        <CustomerNavigator />
      ) : user.role === 'RESTAURANT' ? (
        <RestaurantNavigator />
      ) : (
        <AdminNavigator />
      )}
    </NavigationContainer>
  );
};
