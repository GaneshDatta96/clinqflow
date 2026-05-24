import { soapDraftSchema, type SoapDraft } from "@/lib/schemas/soap";
import type { AiProvider, SoapGenerationInput, SoapGenerationResult } from "@/lib/ai/provider";
import { env } from "@/lib/env";

const MAX_ATTEMPTS = 3;

export class OpenRouterProvider implements AiProvider {
  async generateStructuredSoap(input: SoapGenerationInput): Promise<SoapGenerationResult> {
    const apiKey = env.openRouterApiKey;

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: input.model,
            messages: [
              { role: "system", content: input.systemPrompt },
              { role: "user", content: input.userPrompt },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenRouter error: ${response.status}`);
        }

        const payload = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };

        const content = payload.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("Empty model response");
        }

        const parsed = soapDraftSchema.parse(JSON.parse(content));

        return {
          soap: parsed,
          model: input.model,
          usedFallback: false,
        };
      } catch (error) {
        lastError = error;
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 500));
        }
      }
    }

    throw lastError instanceof Error ? lastError : new Error("AI generation failed");
  }
}

export function createDefaultAiProvider(): AiProvider {
  return new OpenRouterProvider();
}
