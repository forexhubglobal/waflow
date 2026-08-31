"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
let AiService = AiService_1 = class AiService {
    logger = new common_1.Logger(AiService_1.name);
    openai;
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || 'sk-mock',
        });
    }
    async generateSuggestedReply(customerMessage, companyContext) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_KEY')) {
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
        }
        catch (error) {
            this.logger.error('OpenAI Error generating reply', error);
            return "Maaf, sistem AI sedang sibuk sebentar.";
        }
    }
    async summarizeConversation(messages) {
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
        }
        catch (error) {
            this.logger.error('OpenAI Error summarizing', error);
            return "Summary failed.";
        }
    }
    async analyzeIntentAndScore(customerMessage) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_KEY')) {
            const msg = customerMessage.toLowerCase();
            let intent = 'GENERAL';
            let scoreMod = 0;
            let recommendedStatus = 'CONTACTED';
            if (msg.includes('berapa') || msg.includes('harga') || msg.includes('price')) {
                intent = 'PRICE_ENQUIRY';
                scoreMod = 10;
            }
            else if (msg.includes('budget') || msg.includes('rm')) {
                intent = 'BUDGET_GIVEN';
                scoreMod = 20;
            }
            else if (msg.includes('quotation') || msg.includes('sebut harga')) {
                intent = 'QUOTATION_REQUEST';
                scoreMod = 25;
                recommendedStatus = 'QUOTATION';
            }
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
        }
        catch (error) {
            this.logger.error('OpenAI Error detecting intent', error);
            return { intent: 'GENERAL', scoreAdjustment: 0, recommendedStatus: 'CONTACTED', isHot: false };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map