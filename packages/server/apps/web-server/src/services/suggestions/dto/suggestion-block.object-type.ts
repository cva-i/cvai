import { ObjectType, Field } from '@nestjs/graphql';
import { SuggestionObjectType } from './suggestion.object-type';

@ObjectType()
export class SuggestionBlockObjectType {
  @Field()
  blockId!: string;

  @Field(() => [SuggestionObjectType])
  suggestions!: SuggestionObjectType[];
}
