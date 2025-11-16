import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { getMenuByRestaurant } from '../../services/api/restaurantApi';
import { MenuItem } from '../../types/api';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<CustomerStackParamList, 'RestaurantDetail'>;

export const RestaurantDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await getMenuByRestaurant(restaurantId);
        setMenu(data);
      } catch (e) {
        console.log('getMenuByRestaurant error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(restaurantId, item);
    Alert.alert('Đã thêm vào giỏ', item.name);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      <Button title="Xem giỏ hàng" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '600' },
  desc: { color: '#555', marginTop: 4 },
  price: { marginTop: 4, fontWeight: 'bold' },
  button: {
    marginTop: 8,
    backgroundColor: '#2e86de',
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
});
