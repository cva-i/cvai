import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import {
  AboutMe,
  ContactInfo,
  Cv,
  CvData,
  CvVersion,
  Education,
  Project,
  Skill,
  WorkExperience,
} from '../../../../../../libs/schemas';
import { mapToArray, mapToArrayNormalized } from '../utils';
import { cvKeys } from './types';

@ObjectType()
export class CvObjectType {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => AboutMe, { nullable: true })
  aboutMe?: AboutMe;

  @Field(() => [Education], { nullable: true })
  educationEntries?: Education[];

  @Field(() => [WorkExperience], { nullable: true })
  workExperienceEntries?: WorkExperience[];

  @Field(() => [Project], { nullable: true })
  projectEntries?: Project[];

  @Field(() => [Skill], { nullable: true })
  skillEntries?: Skill[];

  @Field(() => [ContactInfo], { nullable: true })
  contactInfoEntries?: ContactInfo[];

  @Field(() => ID)
  versionId!: string;

  @Field(() => Number)
  versionNumber!: number;

  @Field(() => Date)
  versionCreatedAt!: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;
}

export const convertMappedEntriesToItemizedEntries = (
  mappedEntries: Pick<CvData, (typeof cvKeys.mappedEntries)[number]>
) => ({
  educationEntries: mapToArrayNormalized(mappedEntries.educationEntries),
  workExperienceEntries: mapToArrayNormalized(mappedEntries.workExperienceEntries),
  projectEntries: mapToArrayNormalized(mappedEntries.projectEntries),
  skillEntries: mapToArrayNormalized(mappedEntries.skillEntries),
  contactInfoEntries: mapToArray(mappedEntries.contactInfoEntries),
});

export const createObjectType = ({
  cv,
  cvVersion,
}: {
  cv: Cv;
  cvVersion: CvVersion;
}): CvObjectType => {
  return {
    _id: String(cv._id),
    name: cvVersion.data.name,
    userId: cv.userId,
    title: cvVersion.data.title,
    aboutMe: cvVersion.data.aboutMe,
    versionId: cvVersion._id.toString(),
    versionNumber: cvVersion.versionNumber,
    versionCreatedAt: cvVersion.createdAt,
    ...convertMappedEntriesToItemizedEntries(cvVersion.data),
  };
};
