import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { getRestaurants } from '../../services/api/restaurantApi';
import { Restaurant } from '../../types/api';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<CustomerStackParamList, 'CustomerHome'>;

export const CustomerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (e) {
        console.log('getRestaurants error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('RestaurantDetail', {
          restaurantId: item.id,
          restaurantName: item.name,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.phone}>☎ {item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.welcome}>Xin chào, {user?.fullName}</Text>
        <Button title="Đăng xuất" onPress={logout} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      {/* <View style={styles.cartButtonContainer}>
        <Button title="Xem giỏ hàng" onPress={() => navigation.navigate('Cart')} />
      </View> */}
      <View style={styles.footerButtons}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Button title="Xem giỏ hàng" onPress={() => navigation.navigate('Cart')} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Button title="Đơn của tôi" onPress={() => navigation.navigate('MyOrders')} />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  welcome: { fontSize: 16, fontWeight: '600' },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  address: { color: '#555' },
  phone: { marginTop: 4, color: '#333' },
  cartButtonContainer: {
    marginTop: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },

});
