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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let CronService = CronService_1 = class CronService {
    prisma;
    whatsappService;
    logger = new common_1.Logger(CronService_1.name);
    constructor(prisma, whatsappService) {
        this.prisma = prisma;
        this.whatsappService = whatsappService;
    }
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
            if (!lead.customer.phone)
                continue;
            this.logger.log(`Sending automated follow-up to ${lead.customer.name}`);
            const messageText = `Hi ${lead.customer.name}, ini mesej follow-up dari sistem kami. Adakah anda mempunyai sebarang soalan mengenai sebut harga (quotation) yang kami hantar 3 hari lepas?`;
            try {
                await this.whatsappService.sendMessage(lead.customer.phone, messageText);
            }
            catch (err) {
                this.logger.error(`Failed to send follow-up to ${lead.customer.phone}`, err);
            }
        }
        this.logger.log(`Follow-up job complete. Messaged ${staleLeads.length} leads.`);
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_10AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleStaleLeadsFollowup", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService])
], CronService);
//# sourceMappingURL=cron.service.js.map