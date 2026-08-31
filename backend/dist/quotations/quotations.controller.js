"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsController = void 0;
const common_1 = require("@nestjs/common");
const quotations_service_1 = require("./quotations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let QuotationsController = class QuotationsController {
    quotationsService;
    constructor(quotationsService) {
        this.quotationsService = quotationsService;
    }
    create(req, createQuotationDto) {
        return this.quotationsService.create(req.user.companyId, createQuotationDto);
    }
    findAll(req) {
        return this.quotationsService.findAll(req.user.companyId);
    }
    findOne(req, id) {
        return this.quotationsService.findOne(id, req.user.companyId);
    }
    async generatePdf(req, id, res) {
        const quote = await this.quotationsService.findOne(id, req.user.companyId);
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
    updateStatus(req, id, status) {
        return this.quotationsService.updateStatus(id, req.user.companyId, status);
    }
};
exports.QuotationsController = QuotationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "generatePdf", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "updateStatus", null);
exports.QuotationsController = QuotationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('quotations'),
    __metadata("design:paramtypes", [quotations_service_1.QuotationsService])
], QuotationsController);
//# sourceMappingURL=quotations.controller.js.map