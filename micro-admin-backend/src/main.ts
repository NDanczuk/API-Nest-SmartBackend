import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://dev:devpass@localhost:5672/smartranking'],
      queue: 'admin-backend',
    },
  });

  await app.listen();
}
bootstrap();
