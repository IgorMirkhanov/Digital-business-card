import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Skill } from '../../skills/models/skill.model';

@ObjectType({ description: 'A project with links to the demo and/or source code' })
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true, description: 'Live demo / product page' })
  url: string | null;

  @Field(() => String, { nullable: true, description: 'Source code repository' })
  repositoryUrl: string | null;

  @Field(() => [Skill], { description: 'Skills applied in the project' })
  technologies: Skill[];
}
