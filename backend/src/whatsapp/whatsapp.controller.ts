import { Controller, Get, Post, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
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
}
