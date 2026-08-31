import { PrismaService } from '../prisma/prisma.service';
export declare class WhatsappService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleIncomingMessage(entry: any): Promise<void>;
    sendMessage(to: string, text: string): Promise<{
        success: boolean;
    }>;
}
