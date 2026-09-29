import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Project as ProjectEntity, Skill as SkillEntity } from '@prisma/client';
import { GraphQLContext } from '../../graphql/graphql-context';
import { Skill } from '../skills/models/skill.model';
import { Project } from './models/project.model';
import { ProjectsService } from './projects.service';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @ResolveField(() => [Skill])
  technologies(
    @Parent() project: ProjectEntity,
    @Context() { loaders }: GraphQLContext,
  ): Promise<SkillEntity[]> {
    return this.projectsService.findTechnologies(loaders, project.id);
  }
}
