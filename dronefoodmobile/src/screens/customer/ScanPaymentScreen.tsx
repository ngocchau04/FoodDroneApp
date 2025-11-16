// import React from 'react';
// import { View, Text, Alert } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { confirmPayment } from '../../services/api/paymentApi';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
// import { QRScanEvent } from '../../types/qr';

// type Props = NativeStackScreenProps<CustomerStackParamList, 'ScanPayment'>;

// export const ScanPaymentScreen: React.FC<Props> = ({ navigation }) => {

//     const onScan = async (e: QRScanEvent) => {
//     const data = e.data;

//     if (!data.startsWith("PAYMENT:")) {
//         Alert.alert("QR không hợp lệ");
//         return;
//     }

//     const code = data.replace("PAYMENT:", "");

//     try {
//         const res = await confirmPayment(code);
//         Alert.alert("Thanh toán thành công", `Đơn #${res.orderId}`);
//         navigation.navigate("CustomerHome");
//     } catch (err) {
//         Alert.alert("Thanh toán thất bại");
//     }
//     };


//   return (
//     <QRCodeScanner
//       onRead={onScan}
//       topContent={<Text>Quét mã thanh toán</Text>}
//     />
//   );
// };
