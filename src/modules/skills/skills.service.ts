import { Injectable } from '@nestjs/common';
import { Skill, SkillCategory } from '@prisma/client';
import { createOneToManyLoader, LoaderRegistry } from '../../graphql/loaders/loader-registry';
import { SkillsRepository } from './skills.repository';

const SKILLS_BY_PROFILE = Symbol('skillsByProfile');
const SKILLS_BY_PROJECT = Symbol('skillsByProject');

export interface SkillGroupData {
  category: SkillCategory;
  skills: Skill[];
}

@Injectable()
export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  async findByProfile(
    loaders: LoaderRegistry,
    profileId: string,
    category?: SkillCategory,
  ): Promise<Skill[]> {
    const skills = await loaders
      .get(SKILLS_BY_PROFILE, () =>
        createOneToManyLoader(
          (ids) => this.repository.findByProfileIds(ids),
          (skill) => skill.profileId,
        ),
      )
      .load(profileId);
    return category ? skills.filter((skill) => skill.category === category) : skills;
  }

  async groupByCategory(loaders: LoaderRegistry, profileId: string): Promise<SkillGroupData[]> {
    return SkillsService.group(await this.findByProfile(loaders, profileId));
  }

  findByProject(loaders: LoaderRegistry, projectId: string): Promise<Skill[]> {
    return loaders
      .get(SKILLS_BY_PROJECT, () =>
        createOneToManyLoader(
          (ids) => this.repository.findByProjectIds(ids),
          (skill) => skill.projectId,
        ),
      )
      .load(projectId);
  }

  /** Groups skills by category; groups follow the enum order, skills keep their own order. */
  static group(skills: Skill[]): SkillGroupData[] {
    return Object.values(SkillCategory)
      .map((category) => ({
        category,
        skills: skills.filter((skill) => skill.category === category),
      }))
      .filter((group) => group.skills.length > 0);
  }
}
