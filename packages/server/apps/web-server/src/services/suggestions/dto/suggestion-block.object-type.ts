import { ObjectType, Field } from '@nestjs/graphql';
import { CommentObjectType } from './suggestion.object-type';

@ObjectType()
export class CommentBlockObjectType {
  @Field()
  blockId!: string;

  @Field(() => [CommentObjectType])
  comments!: CommentObjectType[];
}

// Backward compatibility alias
export const SuggestionBlockObjectType = CommentBlockObjectType;
