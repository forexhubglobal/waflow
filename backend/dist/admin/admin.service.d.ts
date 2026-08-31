import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalCompanies: number;
        activeCompanies: number;
        totalUsers: number;
        totalLeads: number;
        mrr: number;
    }>;
    getCompanies(): Promise<({
        _count: {
            users: number;
            leads: number;
        };
    } & {
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        industry: string | null;
        country: string | null;
        address: string | null;
        waPhoneNumberId: string | null;
        updatedAt: Date;
    })[]>;
    updateCompanyStatus(id: string, status: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        industry: string | null;
        country: string | null;
        address: string | null;
        waPhoneNumberId: string | null;
        updatedAt: Date;
    }>;
}
