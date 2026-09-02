import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { randomInt } from 'crypto';

@Injectable()
export class SecurityServices {
  constructor(private readonly ConfigService: ConfigService) {}
  hashOperation({
    data,
    saltOrRounds = Number(this.ConfigService.get<string>('SALT_OR_ROUNDS')),
  }: {
    data: string | Buffer;
    saltOrRounds: string | number | undefined;
  }) {
    return bcrypt.hash(data, saltOrRounds);
  }

  compareOperation({
    data,
    encrypted,
  }: {
    data: string | Buffer | undefined;
    encrypted: string | undefined;
  }) {
    return bcrypt.compare(data as string, encrypted as string);
  }

  encryptPhone({ phone }: { phone: string }): string {
    const key = this.ConfigService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      throw new BadRequestException("ENCRYPTION_KEY doesn't exist");
    }
    return CryptoJS.AES.encrypt(phone, key).toString();
  }
  decryptPhone({ encryptedPhone }: { encryptedPhone: string }): string {
    const key = this.ConfigService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      throw new BadRequestException("ENCRYPTION_KEY doesn't exist");
    }
    const bytes = CryptoJS.AES.decrypt(encryptedPhone, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  generateOtp({ length = 6 }: { length?: number } = {}): string {
    if (length < 4 || length > 10) {
      throw new BadRequestException('OTP length must be between 4 and 10');
    }

    const min = 10 ** (length - 1);
    const max = 10 ** length;

    return randomInt(min, max).toString();
  }
}
