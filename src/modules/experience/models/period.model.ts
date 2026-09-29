import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Employment period with derived, display-ready values' })
export class Period {
  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true, description: 'null for the current job' })
  endDate: Date | null;

  @Field()
  isCurrent: boolean;

  @Field(() => Int, { description: 'Whole calendar months, both ends inclusive' })
  durationMonths: number;

  @Field({ description: 'Human-readable period, e.g. "Mar 2026 – present"' })
  label: string;
}
