import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn'],
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService = app.get(ConfigService);
  await app.listen(+configService.get('PORT') || 3000, () => {
    Logger.log(`Server is listening on port ${configService.get('PORT') || 3000}`, 'Main');
  });
}
bootstrap();
