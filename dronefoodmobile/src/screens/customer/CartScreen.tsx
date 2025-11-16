import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/api/orderApi';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { items, totalAmount, restaurantId, removeFromCart, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const handleCreateOrder = async () => {
    if (!restaurantId || items.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Hãy chọn món trước khi đặt.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        restaurantId,
        totalAmount,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          unitPrice: i.menuItem.price,
        })),
      };

      const order = await createOrder(payload);

      clearCart();

      Alert.alert(
        'Đặt hàng thành công',
        `Mã đơn: ${order.id}\nTổng tiền: ${order.totalAmount.toLocaleString('vi-VN')} đ`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerHome'),
          },
        ],
      );
    } catch (e: any) {
      console.log(e.response?.data || e.message);
      Alert.alert('Lỗi', 'Không thể tạo đơn hàng, kiểm tra lại server / kết nối.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <Text>Giỏ hàng đang trống</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.menuItem.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View>
                  <Text style={styles.itemName}>{item.menuItem.name}</Text>
                  <Text>
                    {item.quantity} x {item.menuItem.price.toLocaleString('vi-VN')} đ
                  </Text>
                </View>
                <Button
                  title="Xóa"
                  onPress={() => removeFromCart(item.menuItem.id)}
                />
              </View>
            )}
          />

          <View style={styles.summary}>
            <Text style={styles.total}>
              Tổng: {totalAmount.toLocaleString('vi-VN')} đ
            </Text>
            <Button
              title={submitting ? 'Đang đặt...' : 'Đặt hàng'}
              onPress={handleCreateOrder}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  itemName: { fontWeight: '600' },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
    marginTop: 12,
  },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});
