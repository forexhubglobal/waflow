import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(req: any, createLeadDto: any): Promise<{
        id: string;
        title: string | null;
        status: string;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string | null;
        assignedToId: string | null;
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
        assignedTo: {
            id: string;
            status: string;
            createdAt: Date;
            companyId: string;
            name: string;
            phone: string | null;
            email: string;
            passwordHash: string;
            role: string;
        };
    } & {
        id: string;
        title: string | null;
        status: string;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string | null;
        assignedToId: string | null;
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
        assignedTo: {
            id: string;
            status: string;
            createdAt: Date;
            companyId: string;
            name: string;
            phone: string | null;
            email: string;
            passwordHash: string;
            role: string;
        };
    } & {
        id: string;
        title: string | null;
        status: string;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string | null;
        assignedToId: string | null;
    }>;
    update(req: any, id: string, updateLeadDto: any): Promise<{
        id: string;
        title: string | null;
        status: string;
        score: number;
        budget: number | null;
        source: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        customerId: string | null;
        assignedToId: string | null;
    }>;
}
