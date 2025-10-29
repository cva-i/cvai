import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Comment {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  @Field()
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  @Field()
  cvId!: Types.ObjectId;

  @Prop({ required: true })
  @Field()
  cvVersionId!: string;

  @Prop({ required: true })
  @Field()
  blockId!: string;

  @Prop({ required: true })
  @Field()
  text!: string;

  @Prop()
  @Field({ nullable: true })
  suggestedText?: string;

  @Prop()
  @Field({ nullable: true })
  startOffset?: number;

  @Prop()
  @Field({ nullable: true })
  endOffset?: number;

  @Prop({ enum: ['open', 'resolved', 'rejected'], default: 'open' })
  @Field()
  status!: 'open' | 'resolved' | 'rejected';

  @Prop({ default: 'AI Assistant' })
  @Field()
  authorName!: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);

// Keep backward compatibility aliases
export const Suggestion = Comment;
export type SuggestionDocument = CommentDocument;
export const SuggestionSchema = CommentSchema;
