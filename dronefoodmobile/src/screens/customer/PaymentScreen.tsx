// src/screens/customer/PaymentScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import {
  createPayment,
  confirmPayment,
  PaymentMethod,
} from '../../services/api/paymentApi';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Payment'>;

export const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId, totalAmount } = route.params;
  const [method, setMethod] = useState<PaymentMethod>('MOMO');
  const [paymentCode, setPaymentCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);



  const handleCreatePayment = async () => {
    try {
      setCreating(true);
      const res = await createPayment({
        orderId,
        method,
        amount: totalAmount,
      });

      console.log('payment res:', res);

      setPaymentCode(res.paymentCode);
      setQrImage(res.qrImage);

      Alert.alert(
        'Tạo giao dịch thành công',
        `Mã thanh toán: ${res.paymentCode}\nSố tiền: ${res.amount.toLocaleString('vi-VN')} đ`,
      );
    } catch (e: any) {
      console.log(e.response?.data || e.message);
      Alert.alert(
        'Lỗi',
        'Không tạo được giao dịch thanh toán. Kiểm tra lại kết nối / backend.',
      );
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentCode) {
      Alert.alert('Chưa có mã thanh toán', 'Vui lòng tạo giao dịch trước.');
      return;
    }

    try {
      setConfirming(true);
      const res = await confirmPayment(paymentCode);

      Alert.alert(
        'Thanh toán thành công',
        `Đơn hàng #${res.orderId} đã được thanh toán.\nMã xác nhận: ${res.paymentCode}`,
        [
          {
            text: 'Về trang chính',
            onPress: () => navigation.navigate('CustomerHome'),
          },
        ],
      );
    } catch (e: any) {
      console.log(e.response?.data || e.message);
      Alert.alert(
        'Lỗi',
        'Xác nhận thanh toán thất bại. Kiểm tra lại mã hoặc backend.',
      );
    } finally {
      setConfirming(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán đơn #{orderId}</Text>
      <Text style={styles.amount}>
        Số tiền: {totalAmount.toLocaleString('vi-VN')} đ
      </Text>

      <Text style={styles.label}>Chọn phương thức thanh toán:</Text>

      <View style={styles.methodRow}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            method === 'MOMO' && styles.methodButtonActive,
          ]}
          onPress={() => setMethod('MOMO')}
        >
          <Text
            style={[
              styles.methodText,
              method === 'MOMO' && styles.methodTextActive,
            ]}
          >
            MoMo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            method === 'VNPAY' && styles.methodButtonActive,
          ]}
          onPress={() => setMethod('VNPAY')}
        >
          <Text
            style={[
              styles.methodText,
              method === 'VNPAY' && styles.methodTextActive,
            ]}
          >
            VNPay
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Button
          title={creating ? 'Đang tạo giao dịch...' : 'Tạo giao dịch thanh toán'}
          onPress={handleCreatePayment}
        />
      </View>

      {paymentCode && (
        <View style={styles.section}>
          <Text style={styles.codeLabel}>Mã thanh toán của bạn:</Text>
          <Text style={styles.codeValue}>{paymentCode}</Text>
        </View>
      )}

      <View style={styles.container}>
        {qrImage && (
          <Image
            source={{ uri: qrImage }}
            style={{ width: 200, height: 200, alignSelf: 'center', marginVertical: 20 }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Button
          title={confirming ? 'Đang xác nhận...' : 'Xác nhận đã thanh toán'}
          onPress={handleConfirmPayment}
        />
      </View>
      
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  amount: { fontSize: 16, marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 8 },
  methodRow: { flexDirection: 'row', marginBottom: 16 },
  methodButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#2e86de',
    borderColor: '#2e86de',
  },
  methodText: { color: '#333', fontWeight: '500' },
  methodTextActive: { color: '#fff' },
  section: { marginTop: 16 },
  codeLabel: { fontWeight: '600', marginBottom: 6 },
  codeValue: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
});
