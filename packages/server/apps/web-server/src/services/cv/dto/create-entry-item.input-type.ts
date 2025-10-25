import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateWorkExperienceInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  position?: string;

  @Field(() => String, { nullable: true })
  duration?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => Int, { nullable: true })
  positionIndex?: number;
}

@InputType()
export class CreateSkillInput {
  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => Int, { nullable: true })
  positionIndex?: number;
}

@InputType()
export class CreateEducationInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  degree?: string;

  @Field(() => String, { nullable: true })
  duration?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => Int, { nullable: true })
  positionIndex?: number;
}

@InputType()
export class CreateProjectInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => Int, { nullable: true })
  positionIndex?: number;
}

@InputType()
export class CreateContactInfoInput {
  @Field(() => String, { nullable: true })
  linkName?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Field(() => Int, { nullable: true })
  positionIndex?: number;
}
