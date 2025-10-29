import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth/gql-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { DecodedUserObjectType } from '../../auth/dto';
import { SuggestionsService } from './suggestions.service';
import {
  CommentObjectType,
  CommentBlockObjectType,
  UpdateSuggestionStatusInput,
} from './dto';

@UseGuards(GqlAuthGuard)
@Resolver(() => CommentObjectType)
export class SuggestionsResolver {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Query(() => [CommentBlockObjectType])
  async getSuggestionsForCv(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('cvId', { type: () => ID }) cvId: string
  ) {
    return this.suggestionsService.getSuggestionsForCv({ cvId, userId });
  }

  @Mutation(() => [CommentBlockObjectType])
  async generateSuggestionsForCv(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('cvId', { type: () => ID }) cvId: string
  ) {
    return this.suggestionsService.generateSuggestionsForCv({ cvId, userId });
  }

  @Mutation(() => CommentObjectType)
  async updateSuggestionStatus(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('input') input: UpdateSuggestionStatusInput
  ) {
    return this.suggestionsService.updateSuggestionStatus(input, userId);
  }

  @Mutation(() => Boolean)
  async deleteSuggestion(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('suggestionId', { type: () => ID }) suggestionId: string
  ) {
    return this.suggestionsService.deleteSuggestion(suggestionId, userId);
  }

  @Mutation(() => Boolean)
  async clearAllSuggestionsForCv(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('cvId', { type: () => ID }) cvId: string
  ) {
    return this.suggestionsService.clearAllSuggestionsForCv({ cvId, userId });
  }
}
