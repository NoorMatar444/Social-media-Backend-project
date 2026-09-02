"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMulterModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_enum_1 = require("../enums/multer.enum");
const multer_config_1 = require("./multer.config");
let CustomMulterModule = class CustomMulterModule {
};
exports.CustomMulterModule = CustomMulterModule;
exports.CustomMulterModule = CustomMulterModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.registerAsync({
                useFactory: () => (0, multer_config_1.multerOptions)({
                    allowedFormat: multer_config_1.allowedFileFormats.image,
                    storageApproach: multer_enum_1.StorageApproachEnum.MEMORY,
                    fileSize: 5,
                }),
            }),
        ],
        exports: [platform_express_1.MulterModule],
    })
], CustomMulterModule);
//# sourceMappingURL=multer.module.js.map