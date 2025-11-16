import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { RestaurantDetailScreen } from '../screens/customer/RestaurantDetailScreen';
import { CartScreen } from '../screens/customer/CartScreen';

export type CustomerStackParamList = {
  CustomerHome: undefined;
  RestaurantDetail: { restaurantId: number; restaurantName: string };
  Cart: undefined;
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export const CustomerNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerHome"
        component={CustomerHomeScreen}
        options={{ title: 'Danh sách cửa hàng' }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={({ route }) => ({ title: route.params.restaurantName })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Giỏ hàng' }}
      />
    </Stack.Navigator>
  );
};
