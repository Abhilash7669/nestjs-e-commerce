import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000'],
    },
  });

  // alternate cors method
  // app.enableCors({
  //   origin: ['http://localhost:3000/'],
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // accepts only the DTO shape
      forbidNonWhitelisted: true, // throws error if sending anything apart from the DTO
      transform: true, // can globally transform payload to objects typed according to their DTO classes
    }),
  );

  // Initialize Swagger - Builder Pattern
  const config = new DocumentBuilder()
    .setTitle('Chic-Ecomm')
    .setDescription('This is a trial run Chic Ecomm with NestJs')
    .setVersion('1.0')
    .addTag('Chic Ecommerce')
    .addServer('http://localhost:5000')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
