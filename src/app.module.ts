import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { ResourcesModule } from 'src/modules/resources/resources.module';

@Module({
  imports: [BookingsModule, ResourcesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
