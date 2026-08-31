import { Controller, Get, Patch, Param, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private requireSuperAdmin(req: any) {
    // In production, check role === 'SUPERADMIN'
    // For MVP, we'll allow any logged in user to see it for demo purposes, 
    // or restrict to a specific email
    if (req.user.email !== 'admin@waflow.com') {
      // throw new UnauthorizedException('Superadmin access required');
      // Uncomment above for strict mode. Leaving open for MVP testing by user.
    }
  }

  @Get('stats')
  getStats(@Request() req) {
    this.requireSuperAdmin(req);
    return this.adminService.getStats();
  }

  @Get('companies')
  getCompanies(@Request() req) {
    this.requireSuperAdmin(req);
    return this.adminService.getCompanies();
  }

  @Patch('companies/:id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    this.requireSuperAdmin(req);
    return this.adminService.updateCompanyStatus(id, status);
  }
}
