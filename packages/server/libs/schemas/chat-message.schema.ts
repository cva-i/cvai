import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import GraphQLJSON from 'graphql-type-json';

export enum ProposedActionType {
  UPDATE_FIELD = 'update_field',
  ADD_ENTRY = 'add_entry',
  DELETE_ENTRY = 'delete_entry',
  REORDER_ENTRIES = 'reorder_entries',
  CLARIFYING_QUESTION = 'clarifying_question',
}

registerEnumType(ProposedActionType, {
  name: 'ProposedActionType',
  description: 'Type of proposed action from AI',
});

export enum ProposedActionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

registerEnumType(ProposedActionStatus, {
  name: 'ProposedActionStatus',
  description: 'Status of a proposed action',
});

export enum ChatMessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

registerEnumType(ChatMessageRole, {
  name: 'ChatMessageRole',
  description: 'Role of the message sender',
});

@ObjectType()
export class ProposedAction {
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

@Schema({ timestamps: true })
@ObjectType()
export class ChatMessage {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  @Field(() => ID)
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  @Field(() => ID)
  conversationId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  @Field(() => ID)
  cvId!: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  userId!: string;

  @Prop({ required: true, enum: ChatMessageRole })
  @Field(() => ChatMessageRole)
  role!: ChatMessageRole;

  @Prop({ required: true })
  @Field()
  content!: string;

  @Prop({ type: [Object], default: [] })
  @Field(() => [ProposedAction])
  proposedActions!: ProposedAction[];

  @Prop()
  @Field({ nullable: true })
  cvVersionIdAtCreation?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}

export type ChatMessageDocument = ChatMessage & Document;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
