import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '@prisma/client';

registerEnumType(LinkKind, { name: 'LinkKind' });

@ObjectType({ description: 'Link to a professional resource (GitHub, LinkedIn, ...)' })
export class Link {
  @Field(() => ID)
  id: string;

  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  label: string;

  @Field()
  url: string;
}
