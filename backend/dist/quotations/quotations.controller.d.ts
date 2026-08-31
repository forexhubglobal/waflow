import { QuotationsService } from './quotations.service';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    create(req: any, createQuotationDto: any): Promise<{
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string;
        subtotal: number;
        discount: number;
        total: number;
        validUntil: Date | null;
        leadId: string | null;
    }>;
    findAll(req: any): Promise<({
        customer: {
            id: string;
            source: string | null;
            createdAt: Date;
            companyId: string;
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string;
        subtotal: number;
        discount: number;
        total: number;
        validUntil: Date | null;
        leadId: string | null;
    })[]>;
    findOne(req: any, id: string): Promise<{
        customer: {
            id: string;
            source: string | null;
            createdAt: Date;
            companyId: string;
            name: string;
            phone: string;
            email: string | null;
            address: string | null;
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string;
        subtotal: number;
        discount: number;
        total: number;
        validUntil: Date | null;
        leadId: string | null;
    }>;
    updateStatus(req: any, id: string, status: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string;
        subtotal: number;
        discount: number;
        total: number;
        validUntil: Date | null;
        leadId: string | null;
    }>;
}
