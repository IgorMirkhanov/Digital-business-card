import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Liveness/readiness probe for Docker and hosting platforms. */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException('Database is unavailable');
    }
  }
}
