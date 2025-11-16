# 🚁 Drone Food Delivery App

Hệ thống giao đồ ăn bằng drone với backend NestJS và mobile app React Native.

## 📁 Cấu trúc Project

```
FoodDroneApp/
├── drone-food-backend/     # NestJS Backend API
└── drone-food-mobile/      # React Native Mobile App
```

## 🚀 Backend (NestJS)

### Tính năng
- 🔐 JWT Authentication & Authorization
- 👥 User Management (Customer, Restaurant, Admin)
- 🏪 Restaurant & Menu Management
- 📦 Order Processing
- 💳 Payment Integration (MoMo, VNPay)
- 🚁 Drone Tracking
- 📡 Real-time Updates with WebSocket
- 📊 Admin Dashboard

### Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Payment**: MoMo, VNPay APIs
- **Validation**: class-validator
- **Testing**: Jest

### Cài đặt Backend
```bash
cd drone-food-backend
npm install
cp .env.example .env
# Cấu hình database trong .env
npx prisma migrate dev
npm run start:dev
```

## 📱 Mobile App (React Native)

### Tính năng
- 📱 Cross-platform (iOS & Android)
- 🔐 User Authentication
- 🏪 Browse Restaurants & Menu
- 🛒 Shopping Cart
- 📋 Order Management
- 💳 Multiple Payment Methods
- 🗺️ Real-time Order Tracking
- 📱 Push Notifications

### Tech Stack
- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client

### Cài đặt Mobile App
```bash
cd drone-food-mobile
npm install
# Cập nhật API_URL trong src/config/env.ts
expo start
```

## 🛠️ Development Setup

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd FoodDroneApp
   ```

2. **Setup Backend**
   ```bash
   cd drone-food-backend
   npm install
   cp .env.example .env
   # Cấu hình database và các biến môi trường
   npx prisma migrate dev
   npm run start:dev
   ```

3. **Setup Mobile App**
   ```bash
   cd drone-food-mobile
   npm install
   # Cài đặt Expo CLI nếu chưa có
   npm install -g @expo/cli
   expo start
   ```

## 📚 API Documentation

Backend API chạy tại: `http://localhost:3000`

### Auth Endpoints
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Refresh token

### User Endpoints
- `GET /users/profile` - Thông tin user
- `PUT /users/profile` - Cập nhật profile

### Restaurant Endpoints
- `GET /restaurants` - Danh sách nhà hàng
- `GET /restaurants/:id` - Chi tiết nhà hàng

### Order Endpoints
- `POST /orders` - Tạo đơn hàng
- `GET /orders` - Danh sách đơn hàng
- `GET /orders/:id/tracking` - Theo dõi đơn hàng

## 🌍 Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
MOMO_PARTNER_CODE="..."
VNPAY_TMN_CODE="..."
```

### Mobile App (src/config/env.ts)
```typescript
API_URL = "http://your-ip:3000/api"
SOCKET_URL = "http://your-ip:3000"
```

## 📋 Database Schema

- **Users**: Customer, Restaurant, Admin accounts
- **Restaurants**: Restaurant information
- **MenuItems**: Food items
- **Orders**: Order tracking
- **Payments**: Payment records
- **Drones**: Drone management

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Developer**: [Your Name]
- **Mobile Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]

## 📞 Contact

- Email: your.email@example.com
- Project Link: [https://github.com/yourusername/FoodDroneApp](https://github.com/yourusername/FoodDroneApp)
