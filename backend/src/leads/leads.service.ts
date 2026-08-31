import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: any) {
    return this.prisma.lead.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.lead.findMany({
      where: { companyId },
      include: {
        customer: true,
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, companyId },
      include: { customer: true, assignedTo: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(id: string, companyId: string, data: any) {
    // Tenant check
    await this.findOne(id, companyId);
    
    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }
}
