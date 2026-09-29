import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors();

  const port = app.get(ConfigService<EnvironmentVariables, true>).get('PORT', { infer: true });
  await app.listen(port, '0.0.0.0');
  Logger.log(`GraphQL (Apollo Sandbox) is available at http://localhost:${port}/graphql`, 'Bootstrap');
}

void bootstrap();
