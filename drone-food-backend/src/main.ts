import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Đổi port sang 4000 cho chắc
  await app.listen(3000);
}
bootstrap();
