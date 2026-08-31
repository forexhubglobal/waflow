import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    private requireSuperAdmin;
    getStats(req: any): Promise<{
        totalCompanies: number;
        activeCompanies: number;
        totalUsers: number;
        totalLeads: number;
        mrr: number;
    }>;
    getCompanies(req: any): Promise<({
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
    updateStatus(req: any, id: string, status: string): Promise<{
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
