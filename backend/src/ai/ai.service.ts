import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  // Abstraction for LLM Call (OpenAI/Anthropic/Gemini)
  private async callLlm(prompt: string, context: any = {}): Promise<string> {
    this.logger.log(`Calling LLM with prompt: ${prompt.substring(0, 50)}...`);
    // MOCK implementation for MVP
    return "This is an AI-generated response based on the context.";
  }

  // AI #1: Suggested Reply
  async generateSuggestedReply(customerMessage: string, companyContext: any) {
    const prompt = `Generate a polite, localized (Malaysian context) reply to: "${customerMessage}". Context: ${JSON.stringify(companyContext)}`;
    
    // Hardcoded mock to show the UI works exactly like the PRD
    if (customerMessage.toLowerCase().includes('rm50k') && customerMessage.toLowerCase().includes('renovation')) {
        return "Boleh boss. Untuk budget RM50k kami boleh cadangkan scope renovation yang sesuai, termasuk kabinet dapur dan lantai ruang tamu.";
    }

    return await this.callLlm(prompt);
  }

  // AI #2: Conversation Summary
  async summarizeConversation(messages: any[]) {
    const prompt = `Summarize this conversation: ${JSON.stringify(messages)}`;
    // Mock
    return "Customer interested in full renovation. Estimated budget RM50k. Location JB. Requested quotation.";
  }

  // AI #3 & #4: Intent Detection & Lead Score
  async analyzeIntentAndScore(customerMessage: string) {
    // Basic logic mapping for V1, can be passed to LLM
    const msg = customerMessage.toLowerCase();
    
    let intent = 'GENERAL';
    let scoreMod = 0;
    let recommendedStatus = 'CONTACTED';

    if (msg.includes('berapa') || msg.includes('harga') || msg.includes('price')) {
      intent = 'PRICE_ENQUIRY';
      scoreMod = 10;
    } else if (msg.includes('budget') || msg.includes('rm')) {
      intent = 'BUDGET_GIVEN';
      scoreMod = 20;
    } else if (msg.includes('quotation') || msg.includes('sebut harga')) {
      intent = 'QUOTATION_REQUEST';
      scoreMod = 25;
      recommendedStatus = 'QUOTATION';
    }

    return {
      intent,
      scoreAdjustment: scoreMod,
      recommendedStatus,
      isHot: scoreMod >= 20
    };
  }
}
