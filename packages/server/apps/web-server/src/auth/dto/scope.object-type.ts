import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ScopeObjectType {
  @Field(() => String, { nullable: true })
  public googleId?: string | null;
}
