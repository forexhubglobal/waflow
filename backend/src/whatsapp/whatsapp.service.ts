import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private prisma: PrismaService) {}

  async handleIncomingMessage(entry: any) {
    try {
      for (const e of entry) {
        for (const change of e.changes) {
          if (change.value && change.value.messages) {
            
            const waPhoneNumberId = change.value.metadata.phone_number_id;
            
            // Find the tenant (Company) this message belongs to
            const company = await this.prisma.company.findUnique({
              where: { waPhoneNumberId }
            });
            
            if (!company) {
               this.logger.warn(`Received message for unknown waPhoneNumberId: ${waPhoneNumberId}`);
               // Fallback for MVP local testing if you haven't set the ID yet
               // Continue anyway for the first company in DB
            }
            
            const tenantId = company?.id || (await this.prisma.company.findFirst())?.id;
            if (!tenantId) continue;

            for (const message of change.value.messages) {
              const customerPhone = message.from; 
              const messageBody = message.text?.body || '';
              const messageId = message.id;

              this.logger.log(`Received message from ${customerPhone}: ${messageBody}`);

              // 1. Find or Auto-create Customer
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
                 
                 // Auto-create Lead for new customer
                 await this.prisma.lead.create({
                   data: {
                     companyId: tenantId,
                     customerId: customer.id,
                     title: `New Inquiry via WhatsApp`,
                     source: 'WhatsApp',
                     status: 'NEW',
                     score: 5 // V1 Lead scoring rule: New lead = +5
                   }
                 });
              }

              // 2. Find or Create Conversation
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

              // 3. Store Message
              await this.prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  senderType: 'CUSTOMER',
                  content: messageBody,
                  waMessageId: messageId,
                  status: 'DELIVERED'
                }
              });
              
              // Update conversation timestamp
              await this.prisma.conversation.update({
                where: { id: conversation.id },
                data: { lastMessageAt: new Date() }
              });
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error handling incoming WhatsApp message', error);
    }
  }

  async sendMessage(to: string, text: string) {
    // TODO: Implement actual fetch/axios call to Meta Graph API
    this.logger.log(`Sending message to ${to}: ${text}`);
    return { success: true };
  }
}
