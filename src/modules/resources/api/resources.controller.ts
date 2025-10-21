import { Controller, Get, Inject, Query } from '@nestjs/common';
import type { ResourceRepository } from 'src/modules/resources/domain/ports/resource-repository';
import { RESOURCE_REPOSITORY } from 'src/modules/resources/tokens';

@Controller('resources')
export class ResourcesController {
  constructor(
    @Inject(RESOURCE_REPOSITORY) private readonly resources: ResourceRepository,
  ) {}

  @Get('available')
  async available(
    @Query('start') startISO: string,
    @Query('end') endISO: string,
  ) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    return await this.resources.listAvailable(start, end);
  }
}
