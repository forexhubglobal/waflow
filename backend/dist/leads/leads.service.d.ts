import { PrismaService } from '../prisma/prisma.service';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, data: any): Promise<{
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        customerId: string | null;
        assignedToId: string | null;
    }>;
    findAll(companyId: string): Promise<({
        customer: {
            name: string;
            email: string | null;
            phone: string;
            id: string;
            companyId: string;
            createdAt: Date;
            address: string | null;
            source: string | null;
            tags: string | null;
        };
        assignedTo: {
            name: string;
            email: string;
            phone: string | null;
            id: string;
            companyId: string;
            passwordHash: string;
            role: string;
            status: string;
            createdAt: Date;
        };
    } & {
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        customerId: string | null;
        assignedToId: string | null;
    })[]>;
    findOne(id: string, companyId: string): Promise<{
        customer: {
            name: string;
            email: string | null;
            phone: string;
            id: string;
            companyId: string;
            createdAt: Date;
            address: string | null;
            source: string | null;
            tags: string | null;
        };
        assignedTo: {
            name: string;
            email: string;
            phone: string | null;
            id: string;
            companyId: string;
            passwordHash: string;
            role: string;
            status: string;
            createdAt: Date;
        };
    } & {
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        customerId: string | null;
        assignedToId: string | null;
    }>;
    update(id: string, companyId: string, data: any): Promise<{
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        customerId: string | null;
        assignedToId: string | null;
    }>;
}
