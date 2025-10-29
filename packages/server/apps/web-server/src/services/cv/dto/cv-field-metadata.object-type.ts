import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { CvDataMetadata } from '../../../../../../libs/schemas';

@ObjectType()
export class FieldMetadataObjectType {
  @Field(() => String)
  fieldId!: string;

  @Field(() => Date, { nullable: true })
  lastEditedAt?: Date;
}

@ObjectType()
export class CvFieldMetadataObjectType {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  cvId!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => GraphQLJSONObject)
  metadata!: CvDataMetadata;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
