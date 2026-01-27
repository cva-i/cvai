import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SendChatMessageInput {
  @Field(() => ID)
  cvId!: string;

  @Field()
  content!: string;

  @Field(() => ID, { nullable: true })
  conversationId?: string;
}
