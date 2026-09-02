"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const redis_module_1 = require("../../common/services/Redis/redis.module");
const security_module_1 = require("../../Security/security.module");
const user_module_1 = require("../user/user.module");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const token_service_1 = require("../../common/services/token.service");
const Email_services_1 = require("../../common/services/Email.services");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../../models/user.model");
const user_repo_1 = require("../../Repo/user.repo");
const google_strategy_1 = require("./strategy/google.strategy");
const google_oauth_guard_1 = require("./guard/google-oauth.guard");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            redis_module_1.RedisModule,
            security_module_1.SecurityModule,
            passport_1.PassportModule.register({ session: false }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: user_model_1.User.name,
                    schema: user_model_1.userSchema,
                },
            ]),
        ],
        providers: [
            auth_service_1.AuthService,
            token_service_1.TokenService,
            Email_services_1.EmailService,
            user_repo_1.UserRepo,
            google_strategy_1.GoogleStrategy,
            google_oauth_guard_1.GoogleOAuthGuard,
            authentication_guard_1.AuthGuard,
        ],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map