import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
export declare class WhatsappService {
    private prisma;
    private eventsGateway;
    private readonly logger;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    handleIncomingMessage(entry: any): Promise<void>;
    sendMessage(to: string, text: string): Promise<{
        success: boolean;
        mocked: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        mocked?: undefined;
    }>;
    broadcastMessage(tenantId: string, leadIds: string[], messageText: string): Promise<{
        success: boolean;
        sentCount: number;
    }>;
}
