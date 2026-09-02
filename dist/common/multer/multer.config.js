"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedFileFormats = void 0;
exports.multerOptions = multerOptions;
const multer_1 = __importDefault(require("multer"));
const multer_enum_1 = require("../enums/multer.enum");
const node_os_1 = require("node:os");
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
exports.allowedFileFormats = {
    video: ['video/mp4', 'video/avi', 'video/mov'],
    image: ['image/jpeg', 'image/png', 'image/gif'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    pdf: ['application/pdf'],
};
function multerOptions({ allowedFormat = exports.allowedFileFormats.image, storageApproach = multer_enum_1.StorageApproachEnum.MEMORY, fileSize, }) {
    const storage = storageApproach === multer_enum_1.StorageApproachEnum.MEMORY
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, (0, node_os_1.tmpdir)());
            },
            filename(req, file, cb) {
                cb(null, `${(0, node_crypto_1.randomUUID)()}_${file.originalname}`);
            },
        });
    const fileFilter = (req, file, callBack) => {
        if (!allowedFormat.includes(file.mimetype)) {
            callBack(new common_1.BadRequestException('file type not valid'), false);
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
//# sourceMappingURL=multer.config.js.map