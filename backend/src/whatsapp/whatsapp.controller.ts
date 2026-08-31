import { Controller, Get, Post, Body, Query, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  // Hardcoded for MVP, in production use ConfigModule
  private readonly VERIFY_TOKEN = 'WAFLOW_GLOBAL_SECURE_TOKEN_2026';

  constructor(private readonly whatsappService: WhatsappService) {}

  // Meta Webhook Verification Endpoint
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ) {
    if (mode === 'subscribe' && token === this.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(HttpStatus.OK).send(challenge);
    } else {
      res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  // Meta Webhook Event Receiver (Incoming Messages, Status Updates)
  @Post('webhook')
  async handleIncoming(
    @Body() body: any,
    @Res() res: Response
  ) {
    // Acknowledge receipt immediately to prevent Meta from retrying
    res.sendStatus(HttpStatus.OK);

    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry.length > 0) {
        // Pass to service asynchronously (sync processing in MVP, but decoupled from HTTP response)
        this.whatsappService.handleIncomingMessage(body.entry).catch(console.error);
      }
    }
  }

  // Frontend API to send message
  @Post('send')
  async sendOutboundMessage(@Body() body: { to: string, text: string, conversationId: string }) {
    // 1. Send via Meta API
    const result = await this.whatsappService.sendMessage(body.to, body.text);
    
    // 2. We should ideally save this to Prisma in the service, but for MVP doing it here or in service is fine.
    // Assuming the service could be refactored to save it. 
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('broadcast')
  async broadcastMessage(@Request() req, @Body() body: { leadIds: string[], message: string }) {
    return this.whatsappService.broadcastMessage(req.user.companyId, body.leadIds, body.message);
  }
}
