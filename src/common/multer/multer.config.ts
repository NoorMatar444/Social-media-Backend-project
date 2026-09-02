import multer from 'multer';
import { StorageApproachEnum } from '../enums/multer.enum';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const allowedFileFormats = {
  video: ['video/mp4', 'video/avi', 'video/mov'],
  image: ['image/jpeg', 'image/png', 'image/gif'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  pdf: ['application/pdf'],
};

export function multerOptions({
  allowedFormat = allowedFileFormats.image,
  storageApproach = StorageApproachEnum.MEMORY,
  fileSize,
}: {
  allowedFormat: string[];
  storageApproach: StorageApproachEnum;
  fileSize: number;
}): MulterOptions {
  const storage =
    storageApproach === StorageApproachEnum.MEMORY
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination(req, file, cb) {
            cb(null, tmpdir());
          },
          filename(req, file, cb) {
            cb(null, `${randomUUID()}_${file.originalname}`);
          },
        });
  const fileFilter: MulterOptions['fileFilter'] = (req, file, callBack) => {
    if (!allowedFormat.includes(file.mimetype)) {
      callBack(new BadRequestException('file type not valid'), false);
    }
  };
  return {
    storage,
    limits: {
      fileSize: fileSize * 1024 * 1024,
    },
    fileFilter,
  };
}
