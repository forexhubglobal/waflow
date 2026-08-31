import type { Response } from 'express';
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
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
    generatePdf(req: any, id: string, res: Response): Promise<void>;
    updateStatus(req: any, id: string, status: string): Promise<{
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
