import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  Experience as ExperienceEntity,
  Link as LinkEntity,
  Profile as ProfileEntity,
  Project as ProjectEntity,
  Skill as SkillEntity,
  SkillCategory,
} from '@prisma/client';
import { GraphQLContext } from '../../graphql/graphql-context';
import { ExperienceService } from '../experience/experience.service';
import { Experience } from '../experience/models/experience.model';
import { Project } from '../projects/models/project.model';
import { ProjectsService } from '../projects/projects.service';
import { Skill, SkillGroup } from '../skills/models/skill.model';
import { SkillGroupData, SkillsService } from '../skills/skills.service';
import { Link } from './models/link.model';
import { Profile } from './models/profile.model';
import { ProfileService } from './profile.service';

/**
 * Thin GraphQL layer: maps the schema onto services. Nested collections are
 * resolved lazily (only when requested) and batched through DataLoaders.
 */
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly skillsService: SkillsService,
    private readonly experienceService: ExperienceService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Query(() => Profile, { description: 'Profile by slug; the business card owner by default' })
  profile(
    @Args('slug', { type: () => String, nullable: true }) slug?: string,
  ): Promise<ProfileEntity> {
    return this.profileService.getBySlug(slug ?? undefined);
  }

  @Query(() => [Profile], { description: 'All profiles stored in the database' })
  profiles(): Promise<ProfileEntity[]> {
    return this.profileService.findAll();
  }

  @ResolveField(() => [Link])
  links(@Parent() profile: ProfileEntity, @Context() { loaders }: GraphQLContext): Promise<LinkEntity[]> {
    return this.profileService.findLinks(loaders, profile.id);
  }

  @ResolveField(() => [Skill])
  skills(
    @Parent() profile: ProfileEntity,
    @Context() { loaders }: GraphQLContext,
    @Args('category', { type: () => SkillCategory, nullable: true }) category?: SkillCategory,
  ): Promise<SkillEntity[]> {
    return this.skillsService.findByProfile(loaders, profile.id, category ?? undefined);
  }

  @ResolveField(() => [SkillGroup])
  skillGroups(
    @Parent() profile: ProfileEntity,
    @Context() { loaders }: GraphQLContext,
  ): Promise<SkillGroupData[]> {
    return this.skillsService.groupByCategory(loaders, profile.id);
  }

  @ResolveField(() => [Experience])
  experience(
    @Parent() profile: ProfileEntity,
    @Context() { loaders }: GraphQLContext,
  ): Promise<ExperienceEntity[]> {
    return this.experienceService.findByProfile(loaders, profile.id);
  }

  @ResolveField(() => [Project])
  projects(
    @Parent() profile: ProfileEntity,
    @Context() { loaders }: GraphQLContext,
  ): Promise<ProjectEntity[]> {
    return this.projectsService.findByProfile(loaders, profile.id);
  }
}
