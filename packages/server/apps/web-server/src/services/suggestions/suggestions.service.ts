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
import { suggestionResponseSchema } from './types';
import { cvSuggestionsSystemPrompt } from './system-prompt';
import { UpdateSuggestionStatusInput, SuggestionBlockObjectType } from './dto';
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
  ): SuggestionBlockObjectType[] {
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
      suggestions: suggestions.map((s) => ({
        _id: s._id.toString(),
        cvId: s.cvId.toString(),
        cvVersionId: s.cvVersionId,
        blockId: s.blockId,
        text: s.text,
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
        suggestionResponseSchema,
      })
    );

    if (error) {
      this.logger.error(
        `Error generating suggestions for CV ${cvId}: ${error.message}`
      );
      throw new Error(`Failed to generate suggestions: ${error.message}`);
    }

    this.logger.log(`Generated ${response.suggestions.length} suggestions`);

    const createdSuggestions = await Promise.all(
      response.suggestions.map((suggestionItem) =>
        this.suggestionModel.create({
          cvId: new Types.ObjectId(cvId),
          cvVersionId: cv.versionId,
          blockId: suggestionItem.blockId,
          text: suggestionItem.text,
          startOffset: suggestionItem.startOffset,
          endOffset: suggestionItem.endOffset,
          status: 'open',
          authorName: 'AI Assistant',
        })
      )
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
}
