import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChatConversation,
  ChatConversationDocument,
  ChatMessage,
  ChatMessageDocument,
  ChatMessageRole,
  ProposedAction,
  ProposedActionStatus,
  ProposedActionType,
} from '../../../../../libs/schemas';
import { CvService } from '../cv/cv.service';
import { LlmCommunicationService } from '../llm-communication/llm-communication.service';
import { CvFormatter } from '../llm-integration/utils';
import { chatSystemPrompt } from './system-prompt';
import {
  chatResponseSchema,
  ChatResponse,
  AddEntryPayload,
  DeleteEntryPayload,
  UpdateFieldPayload,
  ReorderEntriesPayload,
} from './types';
import { ChatMessageObjectType, ProposedActionObjectType } from './dto';
import { tryCatch } from '@server/common/utils';
import { CvEntryType } from '../cv/dto';
import { UpdateCvInput } from '../cv/dto/update-cv.input-type';

interface ChatServiceMethodProps {
  userId: string;
  cvId: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(ChatConversation.name)
    private readonly conversationModel: Model<ChatConversationDocument>,
    @InjectModel(ChatMessage.name)
    private readonly messageModel: Model<ChatMessageDocument>,
    private readonly cvService: CvService,
    private readonly llmService: LlmCommunicationService
  ) {}

  private mapMessageToObjectType(
    message: ChatMessageDocument
  ): ChatMessageObjectType {
    return {
      _id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      cvId: message.cvId.toString(),
      userId: message.userId,
      role: message.role,
      content: message.content,
      proposedActions: message.proposedActions.map(
        (action): ProposedActionObjectType => ({
          _id: action._id,
          type: action.type,
          description: action.description,
          payload: action.payload,
          status: action.status,
        })
      ),
      cvVersionIdAtCreation: message.cvVersionIdAtCreation,
      createdAt: message.createdAt ?? new Date(),
      updatedAt: message.updatedAt ?? new Date(),
    };
  }

  async getOrCreateConversation({
    userId,
    cvId,
    conversationId,
  }: ChatServiceMethodProps & { conversationId?: string }) {
    // Validate CV ownership
    await this.cvService.getCv({ cvId, userId });

    if (conversationId) {
      const conversation = await this.conversationModel
        .findOne({
          _id: new Types.ObjectId(conversationId),
          cvId: new Types.ObjectId(cvId),
          userId,
          isActive: true,
        })
        .exec();

      if (conversation) {
        return conversation;
      }
    }

    // Find existing active conversation for this CV
    const existingConversation = await this.conversationModel
      .findOne({
        cvId: new Types.ObjectId(cvId),
        userId,
        isActive: true,
      })
      .exec();

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    return this.conversationModel.create({
      cvId: new Types.ObjectId(cvId),
      userId,
      isActive: true,
    });
  }

  async getConversationMessages({
    userId,
    cvId,
    conversationId,
  }: ChatServiceMethodProps & {
    conversationId?: string;
  }): Promise<ChatMessageObjectType[]> {
    // Validate CV ownership
    await this.cvService.getCv({ cvId, userId });

    const query: Record<string, unknown> = {
      cvId: new Types.ObjectId(cvId),
      userId,
    };

    if (conversationId) {
      query.conversationId = new Types.ObjectId(conversationId);
    }

    const messages = await this.messageModel
      .find(query)
      .sort({ createdAt: 1 })
      .limit(50)
      .exec();

    return messages.map((msg) => this.mapMessageToObjectType(msg));
  }

  async sendMessage({
    userId,
    cvId,
    content,
    conversationId,
  }: ChatServiceMethodProps & {
    content: string;
    conversationId?: string;
  }): Promise<ChatMessageObjectType> {
    // Get CV data for context
    const cv = await this.cvService.getCv({ cvId, userId });

    // Get or create conversation
    const conversation = await this.getOrCreateConversation({
      userId,
      cvId,
      conversationId,
    });

    // Save user message
    await this.messageModel.create({
      conversationId: conversation._id,
      cvId: new Types.ObjectId(cvId),
      userId,
      role: ChatMessageRole.USER,
      content,
      proposedActions: [],
      cvVersionIdAtCreation: cv.versionId,
    });

    // Get recent conversation history for context
    const recentMessages = await this.messageModel
      .find({
        conversationId: conversation._id,
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    // Build conversation history for LLM (oldest first)
    const conversationHistory = recentMessages
      .reverse()
      .map((msg) => `${msg.role === ChatMessageRole.USER ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    // Get version history summary
    const versionHistory = await this.cvService.getCvVersionHistory({
      cvId,
      userId,
    });
    const versionSummary = `CV has ${versionHistory.paginationMetadata.totalItems} versions. Current version: ${cv.versionNumber}`;

    // Build user content for LLM
    const userContent = [
      {
        type: 'text' as const,
        text: `## Current CV Data\n${CvFormatter.cvToJsonCodeBlock(cv)}`,
      },
      {
        type: 'text' as const,
        text: `## Version History\n${versionSummary}`,
      },
      {
        type: 'text' as const,
        text: `## Recent Conversation\n${conversationHistory}`,
      },
      {
        type: 'text' as const,
        text: `## Current User Message\n${content}`,
      },
    ];

    this.logger.log(`Processing chat message for CV ${cvId}`);

    // Call LLM
    const [response, error] = await tryCatch(
      this.llmService.createStructuredResponse<ChatResponse>(
        {
          systemPrompt: chatSystemPrompt,
          model: 'gpt-4o-mini', // Using gpt-4o-mini as specified
          temperature: 0.7,
          maxTokens: 2048,
          userContent,
        },
        { chatResponseSchema }
      )
    );

    if (error) {
      this.logger.error(`Error calling LLM: ${error.message}`);
      throw new Error(`Failed to process message: ${error.message}`);
    }

    // Create proposed actions with IDs
    const proposedActions: ProposedAction[] = response.proposedActions.map(
      (action) => ({
        _id: new Types.ObjectId().toString(),
        type: this.mapActionType(action.type),
        description: action.description,
        payload: action.payload,
        status: ProposedActionStatus.PENDING,
      })
    );

    // Save assistant message
    const assistantMessage = await this.messageModel.create({
      conversationId: conversation._id,
      cvId: new Types.ObjectId(cvId),
      userId,
      role: ChatMessageRole.ASSISTANT,
      content: response.message,
      proposedActions,
      cvVersionIdAtCreation: cv.versionId,
    });

    this.logger.log(
      `Chat response generated with ${proposedActions.length} proposed actions`
    );

    return this.mapMessageToObjectType(assistantMessage);
  }

  private mapActionType(type: string): ProposedActionType {
    switch (type) {
      case 'update_field':
        return ProposedActionType.UPDATE_FIELD;
      case 'add_entry':
        return ProposedActionType.ADD_ENTRY;
      case 'delete_entry':
        return ProposedActionType.DELETE_ENTRY;
      case 'reorder_entries':
        return ProposedActionType.REORDER_ENTRIES;
      case 'clarifying_question':
        return ProposedActionType.CLARIFYING_QUESTION;
      default:
        return ProposedActionType.CLARIFYING_QUESTION;
    }
  }

  async respondToAction({
    userId,
    messageId,
    actionId,
    accept,
  }: {
    userId: string;
    messageId: string;
    actionId: string;
    accept: boolean;
  }): Promise<ProposedActionObjectType> {
    const message = await this.messageModel
      .findOne({
        _id: new Types.ObjectId(messageId),
        userId,
      })
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Validate CV ownership
    await this.cvService.getCv({
      cvId: message.cvId.toString(),
      userId,
    });

    const actionIndex = message.proposedActions.findIndex(
      (a) => a._id === actionId
    );

    if (actionIndex === -1) {
      throw new NotFoundException('Action not found');
    }

    const action = message.proposedActions[actionIndex];

    if (action.status !== ProposedActionStatus.PENDING) {
      throw new Error('Action has already been processed');
    }

    if (accept) {
      // Execute the action
      await this.executeAction({
        userId,
        cvId: message.cvId.toString(),
        action,
      });
      action.status = ProposedActionStatus.ACCEPTED;
    } else {
      action.status = ProposedActionStatus.REJECTED;
    }

    // Update the message with the new action status
    message.proposedActions[actionIndex] = action;
    await message.save();

    this.logger.log(
      `Action ${actionId} ${accept ? 'accepted' : 'rejected'} for message ${messageId}`
    );

    return {
      _id: action._id,
      type: action.type,
      description: action.description,
      payload: action.payload,
      status: action.status,
    };
  }

  private async executeAction({
    userId,
    cvId,
    action,
  }: {
    userId: string;
    cvId: string;
    action: ProposedAction;
  }) {
    switch (action.type) {
      case ProposedActionType.UPDATE_FIELD:
        await this.executeUpdateField({
          userId,
          cvId,
          payload: action.payload as unknown as UpdateFieldPayload,
        });
        break;
      case ProposedActionType.ADD_ENTRY:
        await this.executeAddEntry({
          userId,
          cvId,
          payload: action.payload as unknown as AddEntryPayload,
        });
        break;
      case ProposedActionType.DELETE_ENTRY:
        await this.executeDeleteEntry({
          userId,
          cvId,
          payload: action.payload as unknown as DeleteEntryPayload,
        });
        break;
      case ProposedActionType.REORDER_ENTRIES:
        await this.executeReorderEntries({
          userId,
          cvId,
          payload: action.payload as unknown as ReorderEntriesPayload,
        });
        break;
      case ProposedActionType.CLARIFYING_QUESTION:
        // No action needed for questions
        break;
    }
  }

  private async executeUpdateField({
    userId,
    cvId,
    payload,
  }: {
    userId: string;
    cvId: string;
    payload: UpdateFieldPayload;
  }) {
    const updateData: UpdateCvInput = {};

    if (payload.fieldPath === 'title') {
      updateData.title = payload.value as string;
    } else if (payload.fieldPath === 'name') {
      updateData.name = payload.value as string;
    } else if (payload.fieldPath === 'aboutMe' || payload.fieldPath === 'aboutMe.description') {
      updateData.aboutMe = {
        fieldName: 'aboutMe',
        description: typeof payload.value === 'string' ? payload.value : (payload.value as Record<string, unknown>).description as string,
      };
    } else if (payload.entryId && payload.fieldName) {
      // Update specific entry field
      const entryFieldName = payload.fieldPath as keyof Pick<
        UpdateCvInput,
        'workExperienceEntries' | 'educationEntries' | 'projectEntries' | 'skillEntries' | 'contactInfoEntries'
      >;

      if (entryFieldName && payload.entryId) {
        const entryUpdate = {
          _id: payload.entryId,
          [payload.fieldName]: payload.value,
        };

        // Type assertion needed because we're dynamically setting the key
        (updateData as Record<string, unknown[]>)[entryFieldName] = [entryUpdate];
      }
    }

    await this.cvService.updateCv({ cvId, userId, data: updateData });
  }

  private async executeAddEntry({
    userId,
    cvId,
    payload,
  }: {
    userId: string;
    cvId: string;
    payload: AddEntryPayload;
  }) {
    const entryTypeMap: Record<string, CvEntryType> = {
      workExperienceEntries: CvEntryType.WORK_EXPERIENCE,
      educationEntries: CvEntryType.EDUCATION,
      projectEntries: CvEntryType.PROJECT,
      skillEntries: CvEntryType.SKILL,
      contactInfoEntries: CvEntryType.CONTACT_INFO,
    };

    const entryType = entryTypeMap[payload.entryFieldName];
    if (!entryType) {
      throw new Error(`Unknown entry field name: ${payload.entryFieldName}`);
    }

    // Build entry data from payload fields
    const entryData: Record<string, unknown> = {};
    if (payload.name) entryData.name = payload.name;
    if (payload.position) entryData.position = payload.position;
    if (payload.degree) entryData.degree = payload.degree;
    if (payload.duration) entryData.duration = payload.duration;
    if (payload.location) entryData.location = payload.location;
    if (payload.description) entryData.description = payload.description;
    if (payload.skills) entryData.skills = payload.skills;
    if (payload.category) entryData.category = payload.category;
    if (payload.linkName) entryData.linkName = payload.linkName;
    if (payload.link) entryData.link = payload.link;

    await this.cvService.generateNewEntryItem({
      cvId,
      userId,
      entryFieldName: entryType,
      entryData,
    });
  }

  private async executeDeleteEntry({
    userId,
    cvId,
    payload,
  }: {
    userId: string;
    cvId: string;
    payload: DeleteEntryPayload;
  }) {
    const entryTypeMap: Record<string, CvEntryType> = {
      workExperienceEntries: CvEntryType.WORK_EXPERIENCE,
      educationEntries: CvEntryType.EDUCATION,
      projectEntries: CvEntryType.PROJECT,
      skillEntries: CvEntryType.SKILL,
      contactInfoEntries: CvEntryType.CONTACT_INFO,
    };

    const entryType = entryTypeMap[payload.entryFieldName];
    if (!entryType) {
      throw new Error(`Unknown entry field name: ${payload.entryFieldName}`);
    }

    await this.cvService.deleteEntryItem({
      cvId,
      userId,
      entryItemId: payload.entryId,
      entryFieldName: entryType,
    });
  }

  private async executeReorderEntries({
    userId,
    cvId,
    payload,
  }: {
    userId: string;
    cvId: string;
    payload: ReorderEntriesPayload;
  }) {
    const updateData: UpdateCvInput = {};

    // Process each reorder operation
    for (const reorder of payload.reorders) {
      const { entryFieldName, entryIds } = reorder;

      // Build update data with new positionIndex for each entry
      const entryUpdates = entryIds.map((entryId, index) => ({
        _id: entryId,
        positionIndex: index,
      }));

      (updateData as Record<string, unknown[]>)[entryFieldName] = entryUpdates;
    }

    await this.cvService.updateCv({ cvId, userId, data: updateData });
  }

  async clearConversation({
    userId,
    conversationId,
  }: {
    userId: string;
    conversationId: string;
  }): Promise<boolean> {
    const conversation = await this.conversationModel
      .findOne({
        _id: new Types.ObjectId(conversationId),
        userId,
      })
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Delete all messages in the conversation
    await this.messageModel
      .deleteMany({
        conversationId: new Types.ObjectId(conversationId),
      })
      .exec();

    // Mark conversation as inactive
    conversation.isActive = false;
    await conversation.save();

    this.logger.log(`Cleared conversation ${conversationId}`);

    return true;
  }
}
