import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SuggestionObjectType {
  @Field()
  _id!: string;

  @Field()
  cvId!: string;

  @Field()
  cvVersionId!: string;

  @Field()
  blockId!: string;

  @Field()
  text!: string;

  @Field(() => Int, { nullable: true })
  startOffset?: number;

  @Field(() => Int, { nullable: true })
  endOffset?: number;

  @Field()
  status!: 'open' | 'resolved' | 'rejected';

  @Field()
  authorName!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
