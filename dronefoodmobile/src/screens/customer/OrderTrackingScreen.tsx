import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { getTrackingHistory, TrackingPoint } from '../../services/api/trackingApi';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../config/env';
import { SOCKET_URL } from '../../config/env';

type Props = NativeStackScreenProps<CustomerStackParamList, 'OrderTracking'>;

interface Coordinate {
  latitude: number;
  longitude: number;
}

export const OrderTrackingScreen: React.FC<Props> = ({ route }) => {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<TrackingPoint[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Lấy history ban đầu
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTrackingHistory(orderId);
        setPoints(data);

        if (data.length > 0) {
          const last = data[data.length - 1];
          setRegion({
            latitude: last.lat,
            longitude: last.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (e) {
        console.log('getTrackingHistory error', e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [orderId]);

  // Kết nối Socket.IO
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to tracking socket');
      socket.emit('joinOrder', { orderId });
    });

    socket.on('trackingUpdate', (data: TrackingPoint) => {
      setPoints((prev) => [...prev, data]);
      setRegion({
        latitude: data.lat,
        longitude: data.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const coordinates: Coordinate[] = points.map((p) => ({
    latitude: p.lat,
    longitude: p.lng,
  }));

  const lastPoint = points[points.length - 1];

  if (loading && points.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Đang tải dữ liệu tracking...</Text>
      </View>
    );
  }

  if (!region && points.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Chưa có dữ liệu tracking cho đơn này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {coordinates.length > 0 && (
            <Polyline
              coordinates={coordinates}
              strokeWidth={3}
            />
          )}

          {lastPoint && (
            <Marker
              coordinate={{
                latitude: lastPoint.lat,
                longitude: lastPoint.lng,
              }}
              title="Drone hiện tại"
              description={lastPoint.status}
            />
          )}
        </MapView>
      )}

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Đơn #{orderId}</Text>
        {lastPoint ? (
          <>
            <Text>Trạng thái: {lastPoint.status}</Text>
            <Text>
              Vị trí: {lastPoint.lat.toFixed(5)}, {lastPoint.lng.toFixed(5)}
            </Text>
          </>
        ) : (
          <Text>Chưa có điểm tracking nào.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7,
  },
  info: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
});
