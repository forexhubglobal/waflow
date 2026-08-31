export declare class AiService {
    private readonly logger;
    private openai;
    constructor();
    generateSuggestedReply(customerMessage: string, companyContext: any): Promise<string>;
    summarizeConversation(messages: any[]): Promise<string>;
    analyzeIntentAndScore(customerMessage: string): Promise<{
        intent: any;
        scoreAdjustment: any;
        recommendedStatus: any;
        isHot: any;
    }>;
}
