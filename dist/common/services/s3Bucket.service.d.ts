import { ConfigService } from '@nestjs/config';
import { StorageApproachEnum } from '../enums/multer.enum';
export declare class S3BucketService {
    private client;
    private BucketName;
    constructor(ConfigService: ConfigService);
    uploadFile({ file, path, }: {
        file: Express.Multer.File;
        path: string;
    }): Promise<string>;
    uploadLargeFile({ file, path, storageApproach, }: {
        file: Express.Multer.File;
        path: string;
        storageApproach: StorageApproachEnum;
    }): Promise<string | undefined>;
    uploadFiles({ files, path, storageApproach, }: {
        files: Express.Multer.File[];
        path: string;
        storageApproach: StorageApproachEnum;
    }): Promise<(string | undefined)[]>;
    getFile(key: string): Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    deleteFile(key: string): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    deleteFiles(keys: string[]): Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput>;
    listFolderKeys(Prefix: string): Promise<import("@aws-sdk/client-s3").ListObjectsCommandOutput>;
    createPresignedUploadFile({ path, originalName, contentType, }: {
        path: string;
        originalName: string;
        contentType: string;
    }): Promise<{
        url: string;
        key: string;
    }>;
    createPresignedGetFile({ Key }: {
        Key: string;
    }): Promise<string>;
}
