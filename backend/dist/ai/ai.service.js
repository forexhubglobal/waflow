"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = AiService_1 = class AiService {
    logger = new common_1.Logger(AiService_1.name);
    async callLlm(prompt, context = {}) {
        this.logger.log(`Calling LLM with prompt: ${prompt.substring(0, 50)}...`);
        return "This is an AI-generated response based on the context.";
    }
    async generateSuggestedReply(customerMessage, companyContext) {
        const prompt = `Generate a polite, localized (Malaysian context) reply to: "${customerMessage}". Context: ${JSON.stringify(companyContext)}`;
        if (customerMessage.toLowerCase().includes('rm50k') && customerMessage.toLowerCase().includes('renovation')) {
            return "Boleh boss. Untuk budget RM50k kami boleh cadangkan scope renovation yang sesuai, termasuk kabinet dapur dan lantai ruang tamu.";
        }
        return await this.callLlm(prompt);
    }
    async summarizeConversation(messages) {
        const prompt = `Summarize this conversation: ${JSON.stringify(messages)}`;
        return "Customer interested in full renovation. Estimated budget RM50k. Location JB. Requested quotation.";
    }
    async analyzeIntentAndScore(customerMessage) {
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
        return {
            intent,
            scoreAdjustment: scoreMod,
            recommendedStatus,
            isHot: scoreMod >= 20
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map