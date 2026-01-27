import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ActionResponseInput {
  @Field(() => ID)
  messageId!: string;

  @Field(() => ID)
  actionId!: string;

  @Field()
  accept!: boolean;
}
