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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../events/events.gateway");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    prisma;
    eventsGateway;
    logger = new common_1.Logger(WhatsappService_1.name);
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async handleIncomingMessage(entry) {
        try {
            for (const e of entry) {
                for (const change of e.changes) {
                    if (change.value && change.value.messages) {
                        const waPhoneNumberId = change.value.metadata.phone_number_id;
                        const company = await this.prisma.company.findUnique({
                            where: { waPhoneNumberId }
                        });
                        if (!company) {
                            this.logger.warn(`Received message for unknown waPhoneNumberId: ${waPhoneNumberId}`);
                        }
                        const tenantId = company?.id || (await this.prisma.company.findFirst())?.id;
                        if (!tenantId)
                            continue;
                        for (const message of change.value.messages) {
                            const customerPhone = message.from;
                            const messageBody = message.text?.body || '';
                            const messageId = message.id;
                            this.logger.log(`Received message from ${customerPhone}: ${messageBody}`);
                            let customer = await this.prisma.customer.findFirst({
                                where: { phone: customerPhone, companyId: tenantId }
                            });
                            if (!customer) {
                                const customerName = message.profile?.name || 'Unknown';
                                customer = await this.prisma.customer.create({
                                    data: {
                                        companyId: tenantId,
                                        phone: customerPhone,
                                        name: customerName,
                                        source: 'WhatsApp'
                                    }
                                });
                                await this.prisma.lead.create({
                                    data: {
                                        companyId: tenantId,
                                        customerId: customer.id,
                                        title: `New Inquiry via WhatsApp`,
                                        source: 'WhatsApp',
                                        status: 'NEW',
                                        score: 5
                                    }
                                });
                            }
                            let conversation = await this.prisma.conversation.findFirst({
                                where: { customerId: customer.id, companyId: tenantId, status: 'OPEN' }
                            });
                            if (!conversation) {
                                conversation = await this.prisma.conversation.create({
                                    data: {
                                        companyId: tenantId,
                                        customerId: customer.id,
                                        status: 'OPEN'
                                    }
                                });
                            }
                            const newMessage = await this.prisma.message.create({
                                data: {
                                    conversationId: conversation.id,
                                    senderType: 'CUSTOMER',
                                    content: messageBody,
                                    waMessageId: messageId,
                                    status: 'DELIVERED'
                                }
                            });
                            await this.prisma.conversation.update({
                                where: { id: conversation.id },
                                data: { lastMessageAt: new Date() }
                            });
                            this.eventsGateway.emitNewMessage(tenantId, {
                                ...newMessage,
                                conversation
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('Error handling incoming WhatsApp message', error);
        }
    }
    async sendMessage(to, text) {
        const token = process.env.META_ACCESS_TOKEN;
        const phoneId = process.env.META_PHONE_NUMBER_ID;
        if (!token || !phoneId || token === 'EAA_YOUR_META_TOKEN_HERE') {
            this.logger.warn(`Mock sending message to ${to}: ${text} (Meta API not configured)`);
            return { success: true, mocked: true };
        }
        try {
            const response = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: { body: text }
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(JSON.stringify(data));
            }
            this.logger.log(`Successfully sent message to ${to}`);
            return { success: true, data };
        }
        catch (error) {
            this.logger.error(`Failed to send WhatsApp message to ${to}:`, error);
            throw error;
        }
    }
    async broadcastMessage(tenantId, leadIds, messageText) {
        const leads = await this.prisma.lead.findMany({
            where: { id: { in: leadIds }, companyId: tenantId },
            include: { customer: true }
        });
        let sentCount = 0;
        for (const lead of leads) {
            if (lead.customer && lead.customer.phone) {
                try {
                    await this.sendMessage(lead.customer.phone, messageText);
                    sentCount++;
                }
                catch (e) {
                    this.logger.error(`Failed to broadcast to ${lead.customer.phone}`);
                }
            }
        }
        return { success: true, sentCount };
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map