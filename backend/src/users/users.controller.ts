import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getStaff(@Request() req) {
    return this.usersService.findByCompanyId(req.user.companyId);
  }

  @Post('invite')
  async inviteStaff(@Request() req, @Body() body: any) {
    // In MVP, we just create the user directly with the provided password
    // In production, we'd send an email with an invite link
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return this.usersService.createUser({
      email: body.email,
      name: body.name,
      password: hashedPassword,
      role: body.role || 'SALESPERSON',
      companyId: req.user.companyId
    });
  }
}
