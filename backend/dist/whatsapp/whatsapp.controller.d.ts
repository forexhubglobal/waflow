import { WhatsappService } from './whatsapp.service';
import type { Response } from 'express';
export declare class WhatsappController {
    private readonly whatsappService;
    private readonly VERIFY_TOKEN;
    constructor(whatsappService: WhatsappService);
    verifyWebhook(mode: string, token: string, challenge: string, res: Response): void;
    handleIncoming(body: any, res: Response): Promise<void>;
}
