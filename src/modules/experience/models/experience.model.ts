import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Period } from './period.model';

@ObjectType({ description: 'A position held at a company' })
export class Experience {
  @Field(() => ID)
  id: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => Period)
  period: Period;

  @Field(() => [String], { description: 'Key achievements in display order' })
  achievements: string[];
}
