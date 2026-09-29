import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Experience as ExperienceEntity } from '@prisma/client';
import { GraphQLContext } from '../../graphql/graphql-context';
import { ExperienceService } from './experience.service';
import { Experience } from './models/experience.model';
import { Period } from './models/period.model';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @ResolveField(() => Period)
  period(@Parent() experience: ExperienceEntity): Period {
    return this.experienceService.getPeriod(experience);
  }

  @ResolveField(() => [String])
  achievements(
    @Parent() experience: ExperienceEntity,
    @Context() { loaders }: GraphQLContext,
  ): Promise<string[]> {
    return this.experienceService.findAchievements(loaders, experience.id);
  }
}
