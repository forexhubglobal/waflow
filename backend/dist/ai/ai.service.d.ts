export declare class AiService {
    private readonly logger;
    private callLlm;
    generateSuggestedReply(customerMessage: string, companyContext: any): Promise<string>;
    summarizeConversation(messages: any[]): Promise<string>;
    analyzeIntentAndScore(customerMessage: string): Promise<{
        intent: string;
        scoreAdjustment: number;
        recommendedStatus: string;
        isHot: boolean;
    }>;
}
