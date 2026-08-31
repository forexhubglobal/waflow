import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Request() req, @Body() createLeadDto: any) {
    // Inject tenant ID from JWT payload
    return this.leadsService.create(req.user.companyId, createLeadDto);
  }

  @Get()
  findAll(@Request() req) {
    // Only fetch leads for the user's tenant
    return this.leadsService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.leadsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateLeadDto: any) {
    return this.leadsService.update(id, req.user.companyId, updateLeadDto);
  }
}
