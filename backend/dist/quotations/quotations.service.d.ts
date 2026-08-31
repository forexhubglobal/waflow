import { PrismaService } from '../prisma/prisma.service';
export declare class QuotationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, data: any): Promise<{
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            quotationId: string;
        }[];
    } & {
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
        discount: number;
        subtotal: number;
        total: number;
        validUntil: Date | null;
    }>;
    findAll(companyId: string): Promise<({
        customer: {
            id: string;
            email: string | null;
            companyId: string;
            name: string;
            phone: string;
            createdAt: Date;
            address: string | null;
            source: string | null;
            tags: string | null;
        };
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            quotationId: string;
        }[];
    } & {
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
        discount: number;
        subtotal: number;
        total: number;
        validUntil: Date | null;
    })[]>;
    findOne(id: string, companyId: string): Promise<{
        customer: {
            id: string;
            email: string | null;
            companyId: string;
            name: string;
            phone: string;
            createdAt: Date;
            address: string | null;
            source: string | null;
            tags: string | null;
        };
        items: {
            id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            quotationId: string;
        }[];
    } & {
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
        discount: number;
        subtotal: number;
        total: number;
        validUntil: Date | null;
    }>;
    updateStatus(id: string, companyId: string, status: string): Promise<{
        id: string;
        companyId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
        discount: number;
        subtotal: number;
        total: number;
        validUntil: Date | null;
    }>;
}
