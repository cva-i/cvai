import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import {
  ProposedActionType,
  ProposedActionStatus,
  ChatMessageRole,
} from '../../../../../../libs/schemas';

@ObjectType()
export class ProposedActionObjectType {
  @Field(() => ID)
  _id!: string;

  @Field(() => ProposedActionType)
  type!: ProposedActionType;

  @Field()
  description!: string;

  @Field(() => GraphQLJSON)
  payload!: Record<string, unknown>;

  @Field(() => ProposedActionStatus)
  status!: ProposedActionStatus;
}

@ObjectType()
export class ChatMessageObjectType {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  conversationId!: string;

  @Field(() => ID)
  cvId!: string;

  @Field()
  userId!: string;

  @Field(() => ChatMessageRole)
  role!: ChatMessageRole;

  @Field()
  content!: string;

  @Field(() => [ProposedActionObjectType])
  proposedActions!: ProposedActionObjectType[];

  @Field({ nullable: true })
  cvVersionIdAtCreation?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
