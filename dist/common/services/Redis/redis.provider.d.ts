import { ConfigService } from '@nestjs/config';
export declare const RedisProvider: {
    provide: symbol;
    useFactory: (ConfigService: ConfigService) => void;
    inject: (typeof ConfigService)[];
};
