import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class ChatConversation {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  @Field(() => ID)
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  @Field(() => ID)
  cvId!: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  userId!: string;

  @Prop({ default: true })
  @Field()
  isActive!: boolean;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}

export type ChatConversationDocument = ChatConversation & Document;
export const ChatConversationSchema =
  SchemaFactory.createForClass(ChatConversation);
