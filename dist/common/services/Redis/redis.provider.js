"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = void 0;
const config_1 = require("@nestjs/config");
const redis_constant_1 = require("./redis.constant");
const ioredis_1 = __importDefault(require("ioredis"));
exports.RedisProvider = {
    provide: redis_constant_1.Redis_Client,
    useFactory: (ConfigService) => {
        const redis = new ioredis_1.default({
            host: ConfigService.get('REDIS_HOST'),
            port: Number(ConfigService.get('REDIS_PORT')),
            db: Number(ConfigService.get('REDIS_DB')),
            password: ConfigService.get('REDIS_PASSWORD'),
        });
        redis.on('connect', () => {
            console.log('redis connected successfully');
        });
        redis.on('error', (error) => {
            console.log(error);
        });
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=redis.provider.js.map