import { Injectable } from '@nestjs/common';
import { Achievement, Experience } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Current jobs first, then the most recent ones. */
  findByProfileIds(profileIds: readonly string[]): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ endDate: { sort: 'desc', nulls: 'first' } }, { startDate: 'desc' }],
    });
  }

  findAchievementsByExperienceIds(experienceIds: readonly string[]): Promise<Achievement[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
