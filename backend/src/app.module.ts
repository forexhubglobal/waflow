import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { WhatsappModule } from './whatsapp/whatsapp.module.js';
import { QuotationsModule } from './quotations/quotations.module.js';
import { AiModule } from './ai/ai.module.js';
import { AdminModule } from './admin/admin.module.js';
import { CronModule } from './cron/cron.module.js';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, LeadsModule, WhatsappModule, QuotationsModule, AiModule, AdminModule, CronModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
