import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const cors = require('cors');
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  dotenv.config();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
