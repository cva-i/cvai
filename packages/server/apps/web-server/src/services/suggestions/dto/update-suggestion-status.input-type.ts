import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSuggestionStatusInput {
  @Field()
  suggestionId!: string;

  @Field()
  status!: 'open' | 'resolved' | 'rejected';
}
