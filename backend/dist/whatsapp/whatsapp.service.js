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
let WhatsappService = WhatsappService_1 = class WhatsappService {
    prisma;
    logger = new common_1.Logger(WhatsappService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
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
                            await this.prisma.message.create({
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
        this.logger.log(`Sending message to ${to}: ${text}`);
        return { success: true };
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map