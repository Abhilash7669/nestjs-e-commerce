import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
