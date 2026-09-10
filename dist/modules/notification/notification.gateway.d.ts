import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthType } from "../../common/interfaces/socket.interface";
import { TokenService } from "../../common/services/token.service";
export declare class NotificationGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly tokenService;
    server: Server;
    constructor(tokenService: TokenService);
    private readonly logger;
    handleConnection(client: SocketAuthType): Promise<void>;
    getUserRoom(userId: string): string;
    handleDisconnect(client: SocketAuthType): void;
    sendToUser(userId: string, payload: unknown): void;
}
