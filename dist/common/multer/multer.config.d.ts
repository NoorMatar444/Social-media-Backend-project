import { StorageApproachEnum } from '../enums/multer.enum';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export declare const allowedFileFormats: {
    video: string[];
    image: string[];
    audio: string[];
    pdf: string[];
};
export declare function multerOptions({ allowedFormat, storageApproach, fileSize, }: {
    allowedFormat: string[];
    storageApproach: StorageApproachEnum;
    fileSize: number;
}): MulterOptions;
