import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('PahamIn API — AI Learning Media Generator')
    .setDescription(
      'Backend REST API untuk platform **PahamIn** — Generator media pembelajaran terintegrasi AI (Presentasi TV Interaktif, LKPD Cetak, E-Book Web) untuk Interactive Flat Panel (TV Merah Putih) Sekolah Dasar.',
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'Registrasi, Login, dan Profil Guru')
    .addTag('Generator', 'AI Media Generator (Presentasi TV, LKPD, E-Book)')
    .addTag('Projects', 'Manajemen Projek Media Ajar, Public E-Book, dan LKPD Print')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan JWT Token dari endpoint /api/auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'PahamIn API Documentation',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`[PahamIn API] Berjalan di http://localhost:${port}`);
  console.log(`[Swagger Docs] http://localhost:${port}/api/docs`);
}
bootstrap();
