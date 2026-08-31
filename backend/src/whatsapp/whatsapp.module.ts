import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller.js';
import { WhatsappService } from './whatsapp.service.js';
import { AuthModule } from '../auth/auth.module.js';

import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [EventsModule, AuthModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService]
})
export class WhatsappModule {}
