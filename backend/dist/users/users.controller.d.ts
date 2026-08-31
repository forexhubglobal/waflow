import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getStaff(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: Date;
    }[]>;
    inviteStaff(req: any, body: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>;
}
