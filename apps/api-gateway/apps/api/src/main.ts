import { NestFactory } from '@nestjs/core';
import { MainModule } from './infra/ioc/main.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
  logger.log(`Loading OpenAPI spec from: ${openapiPath}`);

  if (!fs.existsSync(openapiPath)) {
    logger.error(`OpenAPI file not found at: ${openapiPath}`);
    throw new Error(`OpenAPI specification file not found at ${openapiPath}`);
  }

  const openapiFile = fs.readFileSync(openapiPath, 'utf8');
  const swaggerDocument = yaml.load(openapiFile) as any;

  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: 'Jungle Gaming Challenge API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<string>('PORT');

  await app.listen(port);

  logger.log(`API Gateway running on http://localhost:${port}/api`);
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}
void bootstrap();
