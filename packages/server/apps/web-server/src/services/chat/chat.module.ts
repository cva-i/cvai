import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { CvModule } from '../cv/cv.module';
import { LlmCommunicationModule } from '../llm-communication/llm-communication.module';
import {
  ChatConversation,
  ChatConversationSchema,
  ChatMessage,
  ChatMessageSchema,
} from '../../../../../libs/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatConversation.name, schema: ChatConversationSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    CvModule,
    LlmCommunicationModule,
  ],
  providers: [ChatService, ChatResolver],
  exports: [ChatService],
})
export class ChatModule {}
