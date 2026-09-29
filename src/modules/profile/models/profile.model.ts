import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Experience } from '../../experience/models/experience.model';
import { Project } from '../../projects/models/project.model';
import { Skill, SkillGroup } from '../../skills/models/skill.model';
import { Link } from './link.model';

@ObjectType({ description: 'Professional profile — the root of the business card' })
export class Profile {
  @Field(() => ID)
  id: string;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field({ description: 'One-line title, e.g. "Backend Developer"' })
  headline: string;

  @Field({ description: 'Short professional summary' })
  description: string;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => [Link])
  links: Link[];

  @Field(() => [Skill])
  skills: Skill[];

  @Field(() => [SkillGroup])
  skillGroups: SkillGroup[];

  @Field(() => [Experience], { description: 'Current jobs first, then most recent' })
  experience: Experience[];

  @Field(() => [Project])
  projects: Project[];
}
