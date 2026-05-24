import type { SoapDraft } from "@/lib/schemas/soap";

export type SoapGenerationInput = {
  systemPrompt: string;
  userPrompt: string;
  model: string;
};

export type SoapGenerationResult = {
  soap: SoapDraft;
  model: string;
  usedFallback: boolean;
};

export interface AiProvider {
  generateStructuredSoap(input: SoapGenerationInput): Promise<SoapGenerationResult>;
}
