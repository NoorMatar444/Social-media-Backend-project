import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageApproachEnum } from '../enums/multer.enum';
import { allowedFileFormats, multerOptions } from './multer.config';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () =>
        multerOptions({
          allowedFormat: allowedFileFormats.image,
          storageApproach: StorageApproachEnum.MEMORY,
          fileSize: 5,
        }),
    }),
  ],
  exports: [MulterModule],
})
export class CustomMulterModule {}
