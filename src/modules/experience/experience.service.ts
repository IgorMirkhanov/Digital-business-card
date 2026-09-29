import { Injectable } from '@nestjs/common';
import { Experience } from '@prisma/client';
import { createOneToManyLoader, LoaderRegistry } from '../../graphql/loaders/loader-registry';
import { ExperienceRepository } from './experience.repository';
import { Period } from './models/period.model';
import { buildPeriod } from './period';

const EXPERIENCE_BY_PROFILE = Symbol('experienceByProfile');
const ACHIEVEMENTS_BY_EXPERIENCE = Symbol('achievementsByExperience');

@Injectable()
export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  findByProfile(loaders: LoaderRegistry, profileId: string): Promise<Experience[]> {
    return loaders
      .get(EXPERIENCE_BY_PROFILE, () =>
        createOneToManyLoader(
          (ids) => this.repository.findByProfileIds(ids),
          (job) => job.profileId,
        ),
      )
      .load(profileId);
  }

  async findAchievements(loaders: LoaderRegistry, experienceId: string): Promise<string[]> {
    const achievements = await loaders
      .get(ACHIEVEMENTS_BY_EXPERIENCE, () =>
        createOneToManyLoader(
          (ids) => this.repository.findAchievementsByExperienceIds(ids),
          (achievement) => achievement.experienceId,
        ),
      )
      .load(experienceId);
    return achievements.map((achievement) => achievement.text);
  }

  getPeriod(experience: Pick<Experience, 'startDate' | 'endDate'>): Period {
    return buildPeriod(experience.startDate, experience.endDate);
  }
}
