import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalCompanies = await this.prisma.company.count();
    const activeCompanies = await this.prisma.company.count({ where: { status: 'ACTIVE' } });
    const totalUsers = await this.prisma.user.count();
    const totalLeads = await this.prisma.lead.count();

    // Mock MRR
    const mrr = activeCompanies * 99; // Assume $99/mo per active company

    return { totalCompanies, activeCompanies, totalUsers, totalLeads, mrr };
  }

  async getCompanies() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: { users: true, leads: true }
        }
      }
    });
  }

  async updateCompanyStatus(id: string, status: string) {
    return this.prisma.company.update({
      where: { id },
      data: { status }
    });
  }
}
