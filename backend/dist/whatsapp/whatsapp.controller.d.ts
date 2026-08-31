import { WhatsappService } from './whatsapp.service';
import type { Response } from 'express';
export declare class WhatsappController {
    private readonly whatsappService;
    private readonly VERIFY_TOKEN;
    constructor(whatsappService: WhatsappService);
    verifyWebhook(mode: string, token: string, challenge: string, res: Response): void;
    handleIncoming(body: any, res: Response): Promise<void>;
    sendOutboundMessage(body: {
        to: string;
        text: string;
        conversationId: string;
    }): Promise<{
        success: boolean;
        mocked: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        mocked?: undefined;
    }>;
    broadcastMessage(req: any, body: {
        leadIds: string[];
        message: string;
    }): Promise<{
        success: boolean;
        sentCount: number;
    }>;
}
