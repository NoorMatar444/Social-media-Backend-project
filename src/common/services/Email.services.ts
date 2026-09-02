import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService
          .get<string>('GMAIL_APP_PASSWORD')
          ?.replace(/\s/g, ''),
      },
    });
  }
  sendEmail({
    from,
    to,
    subject,
    text,
  }: {
    from?: string;
    to: string;
    subject: string;
    text: string;
  }) {
    return this.transporter.sendMail({
      from: from ?? this.configService.get<string>('GMAIL_USER'),
      to,
      subject,
      text,
    });
  }
}
