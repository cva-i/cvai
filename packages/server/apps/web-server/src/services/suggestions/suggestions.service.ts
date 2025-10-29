import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Suggestion, SuggestionDocument, CvFieldMetadata, CvFieldMetadataDocument } from '../../../../../libs/schemas';
import { CvService } from '../cv/cv.service';
import { LlmCommunicationService } from '../llm-communication/llm-communication.service';
import { CvFormatter } from '../llm-integration/utils';
import { CvManagerMethodProps } from '../cv/types';
import { commentResponseSchema } from './types';
import { cvSuggestionsSystemPrompt } from './system-prompt';
import { CommentBlockObjectType, UpdateSuggestionStatusInput } from './dto';
import { tryCatch, entries } from '@server/common/utils';
import { createCvDataMetadata } from '../cv/metadata.utils';

@Injectable()
export class SuggestionsService {
  private readonly logger = new Logger(SuggestionsService.name);

  constructor(
    @InjectModel(Suggestion.name)
    private readonly suggestionModel: Model<SuggestionDocument>,
    @InjectModel(CvFieldMetadata.name)
    private readonly cvFieldMetadataModel: Model<CvFieldMetadataDocument>,
    private readonly cvService: CvService,
    private readonly llmService: LlmCommunicationService
  ) {}

  private groupSuggestionsByBlock(
    suggestions: SuggestionDocument[]
  ): CommentBlockObjectType[] {
    const groupedByBlock = suggestions.reduce(
      (acc, suggestion) => {
        const blockId = suggestion.blockId;
        return {
          ...acc,
          [blockId]: [...(acc[blockId] ?? []), suggestion],
        };
      },
      {} as Record<string, SuggestionDocument[]>
    );

    return entries(groupedByBlock).map(([blockId, suggestions]) => ({
      blockId: String(blockId),
      comments: suggestions.map((s) => ({
        _id: s._id.toString(),
        cvId: s.cvId.toString(),
        cvVersionId: s.cvVersionId,
        blockId: s.blockId,
        text: s.text,
        suggestedText: s.suggestedText,
        highlightType: s.highlightType,
        sentenceIndex: s.sentenceIndex,
        startOffset: s.startOffset,
        endOffset: s.endOffset,
        status: s.status,
        authorName: s.authorName,
        createdAt: s.createdAt ?? new Date(),
        updatedAt: s.updatedAt ?? new Date(),
      })),
    }));
  }

  async getSuggestionsForCv({ cvId, userId }: CvManagerMethodProps) {
    await this.cvService.getCv({ cvId, userId });

    const suggestions = await this.suggestionModel
      .find({
        cvId: new Types.ObjectId(cvId),
        status: { $in: ['open', 'resolved'] },
      })
      .sort({ createdAt: -1 })
      .exec();

    return this.groupSuggestionsByBlock(suggestions);
  }

  async generateSuggestionsForCv({ cvId, userId }: CvManagerMethodProps) {
    const cv = await this.cvService.getCv({ cvId, userId });
    let metadata = await this.cvService.getCvFieldMetadata({ cvId, userId });

    if (!metadata) {
      this.logger.log(`No metadata found for CV ${cvId}, generating from CV data...`);

      const cvData = {
        title: cv.title,
        name: cv.name,
        aboutMe: cv.aboutMe,
        educationEntries: (cv.educationEntries ?? []).reduce((acc, entry, idx) => ({
          ...acc,
          [entry._id]: entry,
        }), {}),
        workExperienceEntries: (cv.workExperienceEntries ?? []).reduce((acc, entry, idx) => ({
          ...acc,
          [entry._id]: entry,
        }), {}),
        projectEntries: (cv.projectEntries ?? []).reduce((acc, entry, idx) => ({
          ...acc,
          [entry._id]: entry,
        }), {}),
        skillEntries: (cv.skillEntries ?? []).reduce((acc, entry, idx) => ({
          ...acc,
          [entry._id]: entry,
        }), {}),
        contactInfoEntries: (cv.contactInfoEntries ?? []).reduce((acc, entry, idx) => ({
          ...acc,
          [entry._id]: entry,
        }), {}),
      };

      const generatedMetadata = createCvDataMetadata(cvData as any);

      const metadataDocument = await this.cvFieldMetadataModel.create({
        cvId: new Types.ObjectId(cvId),
        userId,
        metadata: generatedMetadata,
      });

      metadata = metadataDocument;
      this.logger.log(`Generated and saved metadata for CV ${cvId}`);
    }

    await this.suggestionModel.deleteMany({
      cvId: new Types.ObjectId(cvId),
    });

    this.logger.log(`Generating suggestions for CV ${cvId}`);

    const completionParams = {
      systemPrompt: cvSuggestionsSystemPrompt,
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 4096,
      userContent: [
        {
          type: 'text' as const,
          text: CvFormatter.cvToJsonCodeBlock(cv),
        },
        {
          type: 'text' as const,
          text: `\n\nField Metadata (use these field IDs in your suggestions):\n\`\`\`json\n${JSON.stringify(metadata.metadata, null, 2)}\n\`\`\``,
        },
      ],
    };

    const [response, error] = await tryCatch(
      this.llmService.createStructuredResponse(completionParams, {
        commentResponseSchema,
      })
    );

    if (error) {
      this.logger.error(
        `Error generating suggestions for CV ${cvId}: ${error.message}`
      );
      throw new Error(`Failed to generate suggestions: ${error.message}`);
    }

    this.logger.log(`Generated ${response.comments.length} suggestions`);

    const createdSuggestions = await Promise.all(
      response.comments.map(async (commentItem) => {
        const offsets = this.computeOffsetsFromHighlightInfo(
          commentItem,
          this.getFieldTextByBlockId(cv, metadata.metadata, commentItem.blockId)
        );

        return this.suggestionModel.create({
          cvId: new Types.ObjectId(cvId),
          cvVersionId: cv.versionId,
          blockId: commentItem.blockId,
          text: commentItem.text,
          suggestedText: commentItem.suggestedText,
          highlightType: commentItem.highlightType,
          sentenceIndex: commentItem.sentenceIndex,
          startOffset: offsets.startOffset,
          endOffset: offsets.endOffset,
          status: 'open',
          authorName: 'AI Assistant',
        });
      })
    );

    return this.groupSuggestionsByBlock(createdSuggestions);
  }

  async updateSuggestionStatus(
    { suggestionId, status }: UpdateSuggestionStatusInput,
    userId: string
  ) {
    const suggestion = await this.suggestionModel.findById(new Types.ObjectId(suggestionId));

    if (!suggestion) {
      throw new NotFoundException(
        `Suggestion with ID ${suggestionId} not found`
      );
    }

    await this.cvService.getCv({
      cvId: suggestion.cvId.toString(),
      userId,
    });

    suggestion.status = status;
    await suggestion.save();

    return {
      _id: suggestion._id.toString(),
      cvId: suggestion.cvId.toString(),
      cvVersionId: suggestion.cvVersionId,
      blockId: suggestion.blockId,
      text: suggestion.text,
      startOffset: suggestion.startOffset,
      endOffset: suggestion.endOffset,
      status: suggestion.status,
      authorName: suggestion.authorName,
      createdAt: suggestion.createdAt,
      updatedAt: suggestion.updatedAt,
    };
  }

  async deleteSuggestion(suggestionId: string, userId: string) {
    const suggestion = await this.suggestionModel.findById(new Types.ObjectId(suggestionId));

    if (!suggestion) {
      throw new NotFoundException(
        `Suggestion with ID ${suggestionId} not found`
      );
    }

    await this.cvService.getCv({
      cvId: suggestion.cvId.toString(),
      userId,
    });

    await this.suggestionModel.deleteOne({ _id: new Types.ObjectId(suggestionId) });

    return true;
  }

  async clearAllSuggestionsForCv({ cvId, userId }: CvManagerMethodProps) {
    await this.cvService.getCv({ cvId, userId });

    await this.suggestionModel.deleteMany({
      cvId: new Types.ObjectId(cvId),
    });

    return true;
  }

  private splitIntoSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  }

  private computeOffsetsFromHighlightInfo(
    commentItem: { highlightType: string; sentenceIndex: number | null; startOffset: number | null; endOffset: number | null },
    fieldText: string | null
  ): { startOffset: number | null; endOffset: number | null } {
    if (!fieldText) {
      return { startOffset: null, endOffset: null };
    }

    if (commentItem.highlightType === 'section') {
      return { startOffset: 0, endOffset: fieldText.length };
    }

    if (commentItem.highlightType === 'sentence' && commentItem.sentenceIndex !== null) {
      const sentences = this.splitIntoSentences(fieldText);
      if (commentItem.sentenceIndex < sentences.length) {
        let offset = 0;
        for (let i = 0; i < commentItem.sentenceIndex; i++) {
          offset += sentences[i].length;
        }
        return {
          startOffset: offset,
          endOffset: offset + sentences[commentItem.sentenceIndex].length,
        };
      }
    }

    if (commentItem.highlightType === 'chunk' && commentItem.startOffset !== null && commentItem.endOffset !== null) {
      return {
        startOffset: commentItem.startOffset,
        endOffset: commentItem.endOffset,
      };
    }

    return { startOffset: null, endOffset: null };
  }

  private getFieldTextByBlockId(cv: any, metadata: any, blockId: string): string | null {
    const fieldPath = this.findFieldPathByFieldId(metadata, blockId);
    if (!fieldPath) return null;

    let current = cv;
    for (const part of fieldPath) {
      if (!current) return null;
      current = current[part];
    }

    return typeof current === 'string' ? current : null;
  }

  private findFieldPathByFieldId(metadata: any, fieldId: string, path: string[] = []): string[] | null {
    if (!metadata || typeof metadata !== 'object') return null;

    for (const [key, value] of Object.entries(metadata)) {
      if (value && typeof value === 'object') {
        if ('fieldId' in value && value.fieldId === fieldId) {
          return [...path, key];
        }

        const result = this.findFieldPathByFieldId(value, fieldId, [...path, key]);
        if (result) return result;
      }
    }

    return null;
  }
}
