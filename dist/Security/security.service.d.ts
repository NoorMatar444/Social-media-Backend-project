import { ConfigService } from '@nestjs/config';
export declare class SecurityServices {
    private readonly ConfigService;
    constructor(ConfigService: ConfigService);
    hashOperation({ data, saltOrRounds, }: {
        data: string | Buffer;
        saltOrRounds: string | number | undefined;
    }): Promise<string>;
    compareOperation({ data, encrypted, }: {
        data: string | Buffer | undefined;
        encrypted: string | undefined;
    }): Promise<boolean>;
    encryptPhone({ phone }: {
        phone: string;
    }): string;
    decryptPhone({ encryptedPhone }: {
        encryptedPhone: string;
    }): string;
    generateOtp({ length }?: {
        length?: number;
    }): string;
}
