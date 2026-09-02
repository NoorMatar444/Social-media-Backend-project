import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PrivacyEnum } from 'src/common/enums/post.enum';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(PrivacyEnum)
  privacy?: PrivacyEnum;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(PrivacyEnum)
  privacy?: PrivacyEnum;
}

export class RemoveAttachmentsDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  attachmentKey!: string[];
}
