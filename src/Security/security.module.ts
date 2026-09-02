import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityServices } from './security.service';

@Module({
  imports: [ConfigModule],
  providers: [SecurityServices],
  exports: [SecurityServices],
})
export class SecurityModule {}
