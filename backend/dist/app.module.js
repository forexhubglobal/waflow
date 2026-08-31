"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_js_1 = require("./app.controller.js");
const app_service_js_1 = require("./app.service.js");
const prisma_module_js_1 = require("./prisma/prisma.module.js");
const users_module_js_1 = require("./users/users.module.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const leads_module_js_1 = require("./leads/leads.module.js");
const whatsapp_module_js_1 = require("./whatsapp/whatsapp.module.js");
const quotations_module_js_1 = require("./quotations/quotations.module.js");
const ai_module_js_1 = require("./ai/ai.module.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_js_1.PrismaModule, users_module_js_1.UsersModule, auth_module_js_1.AuthModule, leads_module_js_1.LeadsModule, whatsapp_module_js_1.WhatsappModule, quotations_module_js_1.QuotationsModule, ai_module_js_1.AiModule],
        controllers: [app_controller_js_1.AppController],
        providers: [app_service_js_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map