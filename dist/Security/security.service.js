"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityServices = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const CryptoJS = __importStar(require("crypto-js"));
const crypto_1 = require("crypto");
let SecurityServices = class SecurityServices {
    ConfigService;
    constructor(ConfigService) {
        this.ConfigService = ConfigService;
    }
    hashOperation({ data, saltOrRounds = Number(this.ConfigService.get('SALT_OR_ROUNDS')), }) {
        return bcrypt.hash(data, saltOrRounds);
    }
    compareOperation({ data, encrypted, }) {
        return bcrypt.compare(data, encrypted);
    }
    encryptPhone({ phone }) {
        const key = this.ConfigService.get('ENCRYPTION_KEY');
        if (!key) {
            throw new common_1.BadRequestException("ENCRYPTION_KEY doesn't exist");
        }
        return CryptoJS.AES.encrypt(phone, key).toString();
    }
    decryptPhone({ encryptedPhone }) {
        const key = this.ConfigService.get('ENCRYPTION_KEY');
        if (!key) {
            throw new common_1.BadRequestException("ENCRYPTION_KEY doesn't exist");
        }
        const bytes = CryptoJS.AES.decrypt(encryptedPhone, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    generateOtp({ length = 6 } = {}) {
        if (length < 4 || length > 10) {
            throw new common_1.BadRequestException('OTP length must be between 4 and 10');
        }
        const min = 10 ** (length - 1);
        const max = 10 ** length;
        return (0, crypto_1.randomInt)(min, max).toString();
    }
};
exports.SecurityServices = SecurityServices;
exports.SecurityServices = SecurityServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SecurityServices);
//# sourceMappingURL=security.service.js.map