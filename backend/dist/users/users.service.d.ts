import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        companyId: string;
        name: string;
        phone: string | null;
        passwordHash: string;
        role: string;
        status: string;
        createdAt: Date;
    }>;
    findByCompanyId(companyId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: Date;
    }[]>;
    createUser(data: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>;
}
