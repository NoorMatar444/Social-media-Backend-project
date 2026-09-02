import { PrivacyEnum } from "../../common/enums/post.enum";
export declare class CreatePostDto {
    content?: string;
    tags?: string[];
    privacy?: PrivacyEnum;
}
export declare class UpdatePostDto {
    content?: string;
    tags?: string[];
    privacy?: PrivacyEnum;
}
export declare class RemoveAttachmentsDto {
    attachmentKey: string[];
}
