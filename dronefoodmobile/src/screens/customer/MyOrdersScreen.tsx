import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { getMyOrders } from '../../services/api/orderApi';
import { Order } from '../../types/api';

type Props = NativeStackScreenProps<CustomerStackParamList, 'MyOrders'>;

const statusLabel: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  PREPARING: 'Nhà hàng đang chuẩn bị',
  DELIVERING: 'Đang giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

export const MyOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
    } catch (e) {
      console.log('getMyOrders error', e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => {
    const created = new Date(item.createdAt);
    const statusText = statusLabel[item.status] ?? item.status;

    return (
        <TouchableOpacity
        style={styles.card}
        onPress={() =>
            navigation.navigate('OrderTracking', { orderId: item.id })
        }
        >
        <Text style={styles.orderId}>Đơn #{item.id}</Text>
        {item.restaurant && (
            <Text style={styles.restaurant}>{item.restaurant.name}</Text>
        )}
        <Text>
            Ngày:{' '}
            {created.toLocaleString('vi-VN', {
            hour12: false,
            })}
        </Text>
        <Text>
            Tổng:{' '}
            {item.totalAmount.toLocaleString('vi-VN')} đ
        </Text>
        <Text style={styles.status}>Trạng thái: {statusText}</Text>
        {item.paymentCode && (
            <Text>Mã thanh toán: {item.paymentCode}</Text>
        )}
        <Text style={{ marginTop: 4, color: '#2e86de' }}>
            Nhấn để xem tracking
        </Text>
        </TouchableOpacity>
    );
    };


  if (loading && orders.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text>Chưa có đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  restaurant: { marginTop: 4, fontWeight: '600' },
  status: { marginTop: 4, fontStyle: 'italic' },
});
