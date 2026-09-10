import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { HydratedUser } from "../../models/user.model";
export interface SocketAuthType extends Socket {
    handshake: Socket['handshake'] & {
        auth: {
            token?: string;
        };
    };
    data: {
        user: HydratedUser;
        verifiedToken: JwtPayload;
    };
}
