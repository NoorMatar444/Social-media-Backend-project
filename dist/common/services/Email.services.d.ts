import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail({ from, to, subject, text, }: {
        from?: string;
        to: string;
        subject: string;
        text: string;
    }): Promise<any>;
}
