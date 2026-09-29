import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type SkillWithProjectId = Skill & { projectId: string };

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly string[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }

  /** Skills used in the given projects, flattened as (projectId, skill) pairs. */
  async findByProjectIds(projectIds: readonly string[]): Promise<SkillWithProjectId[]> {
    const projects = await this.prisma.project.findMany({
      where: { id: { in: [...projectIds] } },
      select: { id: true, technologies: { orderBy: { position: 'asc' } } },
    });
    return projects.flatMap(({ id, technologies }) =>
      technologies.map((skill) => ({ ...skill, projectId: id })),
    );
  }
}
