import { Injectable } from '@nestjs/common';
import { Project, Skill } from '@prisma/client';
import { createOneToManyLoader, LoaderRegistry } from '../../graphql/loaders/loader-registry';
import { SkillsService } from '../skills/skills.service';
import { ProjectsRepository } from './projects.repository';

const PROJECTS_BY_PROFILE = Symbol('projectsByProfile');

@Injectable()
export class ProjectsService {
  constructor(
    private readonly repository: ProjectsRepository,
    private readonly skillsService: SkillsService,
  ) {}

  findByProfile(loaders: LoaderRegistry, profileId: string): Promise<Project[]> {
    return loaders
      .get(PROJECTS_BY_PROFILE, () =>
        createOneToManyLoader(
          (ids) => this.repository.findByProfileIds(ids),
          (project) => project.profileId,
        ),
      )
      .load(profileId);
  }

  findTechnologies(loaders: LoaderRegistry, projectId: string): Promise<Skill[]> {
    return this.skillsService.findByProject(loaders, projectId);
  }
}
