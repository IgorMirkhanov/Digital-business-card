import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly string[]): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
