import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService,
  ) {}

  // Run every day at 10 AM
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleStaleLeadsFollowup() {
    this.logger.log('Running daily follow-up job for stale QUOTATION leads');

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const staleLeads = await this.prisma.lead.findMany({
      where: {
        status: 'QUOTATION',
        updatedAt: {
          lt: threeDaysAgo
        }
      },
      include: { customer: true }
    });

    for (const lead of staleLeads) {
      if (!lead.customer.phone) continue;

      this.logger.log(`Sending automated follow-up to ${lead.customer.name}`);
      
      const messageText = `Hi ${lead.customer.name}, ini mesej follow-up dari sistem kami. Adakah anda mempunyai sebarang soalan mengenai sebut harga (quotation) yang kami hantar 3 hari lepas?`;
      
      try {
        await this.whatsappService.sendMessage(lead.customer.phone, messageText);
        // We could also record this as a Message in the Conversation if needed
      } catch (err) {
        this.logger.error(`Failed to send follow-up to ${lead.customer.phone}`, err);
      }
    }
    
    this.logger.log(`Follow-up job complete. Messaged ${staleLeads.length} leads.`);
  }
}
