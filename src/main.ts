import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const prisma: PrismaService = app.get(PrismaService);
  prisma.enableShutdownHooks(app);
  await app.listen(process.env.PORT ?? 3476);
}
bootstrap().catch(console.error);
