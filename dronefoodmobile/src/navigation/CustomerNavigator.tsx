import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { RestaurantDetailScreen } from '../screens/customer/RestaurantDetailScreen';
import { CartScreen } from '../screens/customer/CartScreen';
import { PaymentScreen } from '../screens/customer/PaymentScreen';
import { MyOrdersScreen } from '../screens/customer/MyOrdersScreen';
import { OrderTrackingScreen } from '../screens/customer/OrderTrackingScreen';

export type CustomerStackParamList = {
  CustomerHome: undefined;
  RestaurantDetail: { restaurantId: number; restaurantName: string };
  Cart: undefined;
  // ScanPayment: undefined;
  MyOrders: undefined;
  OrderTracking: { orderId: number };
  Payment: { orderId: number; totalAmount: number };
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
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Thanh toán' }}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{ title: 'Đơn của tôi' }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Theo dõi đơn hàng' }}
      />
    </Stack.Navigator>
  );
};
