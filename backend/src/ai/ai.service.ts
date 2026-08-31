import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-mock',
    });
  }

  // AI #1: Suggested Reply
  async generateSuggestedReply(customerMessage: string, companyContext: any) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_KEY')) {
      // Hardcoded mock to show the UI works exactly like the PRD if API is not set
      if (customerMessage.toLowerCase().includes('rm50k') && customerMessage.toLowerCase().includes('renovation')) {
          return "Boleh boss. Untuk budget RM50k kami boleh cadangkan scope renovation yang sesuai, termasuk kabinet dapur dan lantai ruang tamu.";
      }
      return "Ini adalah respons AI sementara (Mock) kerana kunci API OpenAI belum dikonfigurasi.";
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful sales assistant for a Malaysian company. Reply politely in localized Malay or English based on the user's language. Keep it brief. Context about company: ${JSON.stringify(companyContext)}`
          },
          {
            role: 'user',
            content: customerMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      this.logger.error('OpenAI Error generating reply', error);
      return "Maaf, sistem AI sedang sibuk sebentar.";
    }
  }

  // AI #2: Conversation Summary
  async summarizeConversation(messages: any[]) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_KEY')) {
      return "Customer interested in full renovation. Estimated budget RM50k. Location JB. Requested quotation.";
    }

    try {
      const chatHistory = messages.map(m => `${m.senderType === 'CUSTOMER' ? 'Customer' : 'Agent'}: ${m.body}`).join('\n');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Summarize the following sales conversation concisely for a CRM.' },
          { role: 'user', content: chatHistory }
        ],
      });
      return response.choices[0].message.content || '';
    } catch (error) {
      this.logger.error('OpenAI Error summarizing', error);
      return "Summary failed.";
    }
  }

  // AI #3 & #4: Intent Detection & Lead Score
  async analyzeIntentAndScore(customerMessage: string) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_KEY')) {
      // Basic logic mapping for V1, can be passed to LLM
      const msg = customerMessage.toLowerCase();
      let intent = 'GENERAL';
      let scoreMod = 0;
      let recommendedStatus = 'CONTACTED';
      if (msg.includes('berapa') || msg.includes('harga') || msg.includes('price')) { intent = 'PRICE_ENQUIRY'; scoreMod = 10; } 
      else if (msg.includes('budget') || msg.includes('rm')) { intent = 'BUDGET_GIVEN'; scoreMod = 20; } 
      else if (msg.includes('quotation') || msg.includes('sebut harga')) { intent = 'QUOTATION_REQUEST'; scoreMod = 25; recommendedStatus = 'QUOTATION'; }
      return { intent, scoreAdjustment: scoreMod, recommendedStatus, isHot: scoreMod >= 20 };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Analyze the sales message and return a JSON object with:
            - "intent": String (e.g. "PRICE_ENQUIRY", "BUDGET_GIVEN", "QUOTATION_REQUEST", "GENERAL")
            - "scoreAdjustment": Integer (0 to 30 based on buying signal strength)
            - "recommendedStatus": String ("CONTACTED", "QUALIFIED", "QUOTATION", "WON", "LOST")
            - "isHot": Boolean (true if buying signal is very strong)`
          },
          { role: 'user', content: customerMessage }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        intent: result.intent || 'GENERAL',
        scoreAdjustment: result.scoreAdjustment || 0,
        recommendedStatus: result.recommendedStatus || 'CONTACTED',
        isHot: result.isHot || false
      };
    } catch (error) {
      this.logger.error('OpenAI Error detecting intent', error);
      return { intent: 'GENERAL', scoreAdjustment: 0, recommendedStatus: 'CONTACTED', isHot: false };
    }
  }
}
