import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@server/entities';

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user!: User;

  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}