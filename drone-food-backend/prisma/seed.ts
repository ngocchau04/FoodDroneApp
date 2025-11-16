import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash password 123456
  const password = await bcrypt.hash('123456', 10);

  // Admin
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      fullName: 'Admin Server',
      password: password,
      role: Role.ADMIN_SV,
    },
  });

  // Restaurant Owner
  const restaurantOwner = await prisma.user.create({
    data: {
      email: 'restaurant@example.com',
      fullName: 'Restaurant Owner',
      password: password,
      role: Role.RESTAURANT,
    },
  });

  // Create restaurant for restaurant owner
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Drone Food Restaurant',
      address: '123 Main Street',
      lat: 10.1234,
      lng: 106.1234,
      phone: '0123456789',
      isActive: true,
    },
  });

  // Gán restaurantId vào user owner
  await prisma.user.update({
    where: { id: restaurantOwner.id },
    data: { restaurantId: restaurant.id },
  });

  // Customer
  await prisma.user.create({
    data: {
      email: 'customer@example.com',
      fullName: 'Customer Demo',
      password: password,
      role: Role.CUSTOMER,
    },
  });

  console.log('Seed dữ liệu thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
