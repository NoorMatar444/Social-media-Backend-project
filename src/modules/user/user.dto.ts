import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderEnum } from 'src/common/enums/user.enum';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'userName can only contain letters, numbers, and underscores',
  })
  userName?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  DOB?: Date;
}
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  newPassword!: string;
}

export class UpdatePhoneDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class RemoveCoverPictureDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  pictureKey!: string[];
}

export class DeleteAccountDto {
  @IsOptional()
  @IsString()
  password?: string;
}
