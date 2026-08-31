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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuotationsService = class QuotationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, data) {
        const { items, customerId, leadId, discount = 0 } = data;
        let subtotal = 0;
        const quotationItems = items.map(item => {
            const totalPrice = item.unitPrice * (item.quantity || 1);
            subtotal += totalPrice;
            return {
                description: item.description,
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice,
                totalPrice
            };
        });
        const total = subtotal - discount;
        return this.prisma.quotation.create({
            data: {
                companyId,
                customerId,
                leadId,
                subtotal,
                discount,
                total,
                items: {
                    create: quotationItems
                }
            },
            include: { items: true }
        });
    }
    async findAll(companyId) {
        return this.prisma.quotation.findMany({
            where: { companyId },
            include: { customer: true, items: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id, companyId) {
        const quote = await this.prisma.quotation.findFirst({
            where: { id, companyId },
            include: { customer: true, items: true }
        });
        if (!quote)
            throw new common_1.NotFoundException('Quotation not found');
        return quote;
    }
    async updateStatus(id, companyId, status) {
        await this.findOne(id, companyId);
        return this.prisma.quotation.update({
            where: { id },
            data: { status }
        });
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map