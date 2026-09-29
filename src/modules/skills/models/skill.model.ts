import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '@prisma/client';

registerEnumType(SkillCategory, { name: 'SkillCategory' });

@ObjectType({ description: 'A professional skill or technology' })
export class Skill {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;
}

@ObjectType({ description: 'Skills grouped by category, in display order' })
export class SkillGroup {
  @Field(() => SkillCategory)
  category: SkillCategory;

  @Field(() => [Skill])
  skills: Skill[];
}
