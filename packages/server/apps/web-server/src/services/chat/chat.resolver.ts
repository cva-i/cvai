import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth/gql-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { DecodedUserObjectType } from '../../auth/dto';
import { ChatService } from './chat.service';
import {
  ChatMessageObjectType,
  ProposedActionObjectType,
  SendChatMessageInput,
  ActionResponseInput,
} from './dto';

@UseGuards(GqlAuthGuard)
@Resolver(() => ChatMessageObjectType)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [ChatMessageObjectType])
  async getChatMessages(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('cvId', { type: () => ID }) cvId: string,
    @Args('conversationId', { type: () => ID, nullable: true })
    conversationId?: string
  ): Promise<ChatMessageObjectType[]> {
    return this.chatService.getConversationMessages({
      userId,
      cvId,
      conversationId,
    });
  }

  @Mutation(() => ChatMessageObjectType)
  async sendChatMessage(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('input') input: SendChatMessageInput
  ): Promise<ChatMessageObjectType> {
    return this.chatService.sendMessage({
      userId,
      cvId: input.cvId,
      content: input.content,
      conversationId: input.conversationId,
    });
  }

  @Mutation(() => ProposedActionObjectType)
  async respondToProposedAction(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('input') input: ActionResponseInput
  ): Promise<ProposedActionObjectType> {
    return this.chatService.respondToAction({
      userId,
      messageId: input.messageId,
      actionId: input.actionId,
      accept: input.accept,
    });
  }

  @Mutation(() => Boolean)
  async clearChatConversation(
    @CurrentUser() { client_id: userId }: DecodedUserObjectType,
    @Args('conversationId', { type: () => ID }) conversationId: string
  ): Promise<boolean> {
    return this.chatService.clearConversation({
      userId,
      conversationId,
    });
  }
}
