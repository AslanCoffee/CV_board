import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:8080', credentials: true, allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] },
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
