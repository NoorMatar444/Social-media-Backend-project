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
var NotificationGateWay_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateWay = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const token_service_1 = require("../../common/services/token.service");
let NotificationGateWay = NotificationGateWay_1 = class NotificationGateWay {
    tokenService;
    server;
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    logger = new common_1.Logger(NotificationGateWay_1.name);
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (!token) {
                throw new common_1.BadRequestException('token not found');
            }
            const { user, verifiedToken } = await this.tokenService.checkToken(token);
            if (!user || !verifiedToken) {
                throw new common_1.NotFoundException('invalid token payload');
            }
            client.data = {
                user,
                verifiedToken,
            };
            const userId = user._id.toString();
            await client.join(this.getUserRoom(userId));
            this.logger.log(`client connected ${client.id} (user:${userId})`);
        }
        catch {
            this.logger.warn(`client disconnect ${client.id}`);
            client.disconnect();
        }
    }
    getUserRoom(userId) {
        return `userId:${userId}`;
    }
    handleDisconnect(client) {
        this.logger.log(`client disconnected ${client.id}`);
    }
    sendToUser(userId, payload) {
        this.server.to(this.getUserRoom(userId)).emit('notification', payload);
    }
};
exports.NotificationGateWay = NotificationGateWay;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateWay.prototype, "server", void 0);
exports.NotificationGateWay = NotificationGateWay = NotificationGateWay_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
        },
        namespace: '/notification',
    }),
    __metadata("design:paramtypes", [token_service_1.TokenService])
], NotificationGateWay);
//# sourceMappingURL=notification.gateway.js.map