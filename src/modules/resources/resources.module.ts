import { Module } from '@nestjs/common';
import { ResourcesController } from 'src/modules/resources/api/resources.controller';
import { RESOURCE_REPOSITORY } from 'src/modules/resources/tokens';
import { PrismaResourceRepository } from 'src/modules/resources/infrastructure/prisma/prisma-resource.repository';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Module({
  controllers: [ResourcesController],
  providers: [
    PrismaService,
    { provide: RESOURCE_REPOSITORY, useClass: PrismaResourceRepository },
  ],
})
export class ResourcesModule {}
