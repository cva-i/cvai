import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsResolver } from './suggestions.resolver';
import { CvModule } from '../cv/cv.module';
import { LlmCommunicationModule } from '../llm-communication/llm-communication.module';
import { LlmIntegrationModule } from '../llm-integration/llm-integration.module';
import { Suggestion, SuggestionSchema, CvFieldMetadata, CvFieldMetadataSchema } from "../../../../../libs/schemas";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: CvFieldMetadata.name, schema: CvFieldMetadataSchema },
    ]),
    CvModule,
    LlmCommunicationModule,
    LlmIntegrationModule,
  ],
  providers: [SuggestionsService, SuggestionsResolver],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
