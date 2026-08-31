import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Request() req, @Body() createQuotationDto: any) {
    return this.quotationsService.create(req.user.companyId, createQuotationDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.quotationsService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.quotationsService.findOne(id, req.user.companyId);
  }

  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.quotationsService.updateStatus(id, req.user.companyId, status);
  }
}
