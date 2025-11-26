import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class SetPasswordInput {
  @Field()
  @IsString()
  userId!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;
}