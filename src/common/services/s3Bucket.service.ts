import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { StorageApproachEnum } from '../enums/multer.enum';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'node:fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3BucketService {
  private client: S3Client;
  private BucketName: string;
  constructor(ConfigService: ConfigService) {
    this.BucketName = ConfigService.getOrThrow<string>('S3_BUCKET_NAME');
    this.client = new S3Client({
      region: ConfigService.getOrThrow<string>('Region'),
      credentials: {
        accessKeyId: ConfigService.getOrThrow<string>('AccessKeyId'),
        secretAccessKey: ConfigService.getOrThrow<string>('SecretAccessKey'),
      },
    });
  }
  async uploadFile({
    file,
    path,
  }: {
    file: Express.Multer.File;
    path: string;
  }) {
    const key = `${file.originalname}-${path}-${randomUUID()}-${file.mimetype}`;
    const command = new PutObjectCommand({
      Bucket: this.BucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.client.send(command);
    return key;
  }
  async uploadLargeFile({
    file,
    path,
    storageApproach,
  }: {
    file: Express.Multer.File;
    path: string;
    storageApproach: StorageApproachEnum;
  }) {
    const key = `${file.originalname}-${path}-${randomUUID()}-${file.mimetype}`;
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.BucketName,
        Key: key,
        Body:
          storageApproach === StorageApproachEnum.DISK
            ? createReadStream(file.path)
            : file.buffer,
        ContentType: file.mimetype,
      },
    });
    const uploadedFile = await upload.done();
    return uploadedFile.Key;
  }
  async uploadFiles({
    files,
    path,
    storageApproach,
  }: {
    files: Express.Multer.File[];
    path: string;
    storageApproach: StorageApproachEnum;
  }) {
    return Promise.all(
      files.map((file) =>
        storageApproach === StorageApproachEnum.MEMORY
          ? this.uploadFile({ file, path })
          : this.uploadLargeFile({ file, path, storageApproach }),
      ),
    );
  }
  async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.BucketName,
      Key: key,
    });
    return await this.client.send(command);
  }
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.BucketName,
      Key: key,
    });
    return await this.client.send(command);
  }
  async deleteFiles(keys: string[]) {
    const command = new DeleteObjectsCommand({
      Bucket: this.BucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });
    return await this.client.send(command);
  }
  async listFolderKeys(Prefix: string) {
    const command = new ListObjectsCommand({
      Bucket: this.BucketName,
      Prefix,
    });
    return this.client.send(command);
  }
  async createPresignedUploadFile({
    path,
    originalName,
    contentType,
  }: {
    path: string;
    originalName: string;
    contentType: string;
  }) {
    const key = `${path}-${randomUUID()}-${originalName}`;
    const command = new PutObjectCommand({
      Bucket: this.BucketName,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return { url, key };
  }
  async createPresignedGetFile({ Key }: { Key: string }) {
    const command = new GetObjectCommand({
      Bucket: this.BucketName,
      Key,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: 3600,
    });
  }
}
