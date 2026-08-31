import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotationsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: any) {
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

  async findAll(companyId: string) {
    return this.prisma.quotation.findMany({
      where: { companyId },
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, companyId: string) {
    const quote = await this.prisma.quotation.findFirst({
      where: { id, companyId },
      include: { customer: true, items: true }
    });
    if (!quote) throw new NotFoundException('Quotation not found');
    return quote;
  }

  async updateStatus(id: string, companyId: string, status: string) {
    await this.findOne(id, companyId);
    return this.prisma.quotation.update({
      where: { id },
      data: { status }
    });
  }
}
