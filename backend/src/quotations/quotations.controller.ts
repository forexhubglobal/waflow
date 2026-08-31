import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
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

  @Get(':id/pdf')
  async generatePdf(@Request() req, @Param('id') id: string, @Res() res: Response) {
    const quote = await this.quotationsService.findOne(id, req.user.companyId);
    
    // For MVP, we send an HTML document that can be printed to PDF by the browser
    const html = `
      <html>
        <head>
          <title>Quotation ${quote.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 40px; }
            .title { font-size: 24px; font-weight: bold; }
            .details { margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .total-row { font-weight: bold; background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">QUOTATION</div>
            <div>Ref: ${quote.id}</div>
            <div>Date: ${quote.createdAt.toLocaleDateString()}</div>
          </div>
          <div class="details">
            <p><strong>To:</strong> Customer ID ${quote.customerId}</p>
          </div>
          <table>
            <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
            ${quote.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>RM ${item.unitPrice.toFixed(2)}</td>
                <td>RM ${item.totalPrice.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr><td colspan="3" style="text-align:right">Subtotal</td><td>RM ${quote.subtotal.toFixed(2)}</td></tr>
            <tr><td colspan="3" style="text-align:right">Discount</td><td>RM ${quote.discount.toFixed(2)}</td></tr>
            <tr class="total-row"><td colspan="3" style="text-align:right">Grand Total</td><td>RM ${quote.total.toFixed(2)}</td></tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    
    res.type('text/html').send(html);
  }

  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.quotationsService.updateStatus(id, req.user.companyId, status);
  }
}
