import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RestaurantHomeScreen from '../screens/restaurant/RestaurantHomeScreen';

export type RestaurantStackParamList = {
  RestaurantHome: undefined;
};

const Stack = createNativeStackNavigator<RestaurantStackParamList>();

export const RestaurantNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RestaurantHome"
        component={RestaurantHomeScreen}
        options={{ title: 'Trang nhà hàng' }}
      />
    </Stack.Navigator>
  );
};
