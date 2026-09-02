"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3BucketService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_crypto_1 = require("node:crypto");
const multer_enum_1 = require("../enums/multer.enum");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const node_fs_1 = require("node:fs");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3BucketService = class S3BucketService {
    client;
    BucketName;
    constructor(ConfigService) {
        this.BucketName = ConfigService.getOrThrow('S3_BUCKET_NAME');
        this.client = new client_s3_1.S3Client({
            region: ConfigService.getOrThrow('Region'),
            credentials: {
                accessKeyId: ConfigService.getOrThrow('AccessKeyId'),
                secretAccessKey: ConfigService.getOrThrow('SecretAccessKey'),
            },
        });
    }
    async uploadFile({ file, path, }) {
        const key = `${file.originalname}-${path}-${(0, node_crypto_1.randomUUID)()}-${file.mimetype}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.BucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.client.send(command);
        return key;
    }
    async uploadLargeFile({ file, path, storageApproach, }) {
        const key = `${file.originalname}-${path}-${(0, node_crypto_1.randomUUID)()}-${file.mimetype}`;
        const upload = new lib_storage_1.Upload({
            client: this.client,
            params: {
                Bucket: this.BucketName,
                Key: key,
                Body: storageApproach === multer_enum_1.StorageApproachEnum.DISK
                    ? (0, node_fs_1.createReadStream)(file.path)
                    : file.buffer,
                ContentType: file.mimetype,
            },
        });
        const uploadedFile = await upload.done();
        return uploadedFile.Key;
    }
    async uploadFiles({ files, path, storageApproach, }) {
        return Promise.all(files.map((file) => storageApproach === multer_enum_1.StorageApproachEnum.MEMORY
            ? this.uploadFile({ file, path })
            : this.uploadLargeFile({ file, path, storageApproach })));
    }
    async getFile(key) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.BucketName,
            Key: key,
        });
        return await this.client.send(command);
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.BucketName,
            Key: key,
        });
        return await this.client.send(command);
    }
    async deleteFiles(keys) {
        const command = new client_s3_1.DeleteObjectsCommand({
            Bucket: this.BucketName,
            Delete: {
                Objects: keys.map((key) => ({ Key: key })),
            },
        });
        return await this.client.send(command);
    }
    async listFolderKeys(Prefix) {
        const command = new client_s3_1.ListObjectsCommand({
            Bucket: this.BucketName,
            Prefix,
        });
        return this.client.send(command);
    }
    async createPresignedUploadFile({ path, originalName, contentType, }) {
        const key = `${path}-${(0, node_crypto_1.randomUUID)()}-${originalName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.BucketName,
            Key: key,
            ContentType: contentType,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: 3600 });
        return { url, key };
    }
    async createPresignedGetFile({ Key }) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.BucketName,
            Key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn: 3600,
        });
    }
};
exports.S3BucketService = S3BucketService;
exports.S3BucketService = S3BucketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3BucketService);
//# sourceMappingURL=s3Bucket.service.js.map