import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(req: any, createLeadDto: any): Promise<{
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
        assignedTo: {
            id: string;
            email: string;
            companyId: string;
            name: string;
            phone: string | null;
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
        assignedTo: {
            id: string;
            email: string;
            companyId: string;
            name: string;
            phone: string | null;
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
    update(req: any, id: string, updateLeadDto: any): Promise<{
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
