import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import type { HydratedUser } from 'src/models/user.model';
import {
  ChangePasswordDto,
  DeleteAccountDto,
  RemoveCoverPictureDto,
  UpdatePhoneDto,
  UpdateProfileDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  GetMyProfile(@CurrentUser() user: HydratedUser) {
    return this.userService.getMyProfile(user._id.toString());
  }

  @Patch('me/update-profile')
  @UseGuards(AuthGuard)
  UpdateProfile(
    @CurrentUser() user: HydratedUser,
    @Body() body: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user._id.toString(), body);
  }

  @Patch('me/phone')
  @UseGuards(AuthGuard)
  UpdatePhone(@CurrentUser() user: HydratedUser, @Body() body: UpdatePhoneDto) {
    return this.userService.updatePhone(user._id.toString(), body.phone);
  }

  @Patch('me/password')
  @UseGuards(AuthGuard)
  ChangePassword(
    @CurrentUser() user: HydratedUser,
    @Body() body: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user._id.toString(), body);
  }

  @Post('me/profile-picture')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  UploadProfilePicture(
    @CurrentUser() user: HydratedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadProfilePicture(user._id.toString(), file);
  }

  @Delete('me/profile-picture')
  @UseGuards(AuthGuard)
  RemoveProfilePicture(@CurrentUser() user: HydratedUser) {
    return this.userService.removeProfilePicture(user._id.toString());
  }

  @Post('me/cover-pictures')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  UploadCoverPictures(
    @CurrentUser() user: HydratedUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.userService.uploadCoverPictures(user._id.toString(), files);
  }

  @Delete('me/cover-pictures')
  @UseGuards(AuthGuard)
  RemoveCoverPicture(
    @CurrentUser() user: HydratedUser,
    @Body() body: RemoveCoverPictureDto,
  ) {
    return this.userService.removeCoverPicture(
      user._id.toString(),
      body.pictureKey,
    );
  }

  @Patch('me/deactivate')
  @UseGuards(AuthGuard)
  DeactivateAccount(@CurrentUser() user: HydratedUser) {
    return this.userService.deactivateAccount(user._id.toString());
  }

  @Delete('me/delete')
  @UseGuards(AuthGuard)
  DeleteAccount(
    @CurrentUser() user: HydratedUser,
    @Body() body: DeleteAccountDto = {},
  ) {
    return this.userService.deleteAccount(user._id.toString(), body.password);
  }

  @Get('id/:id')
  GetPublicProfile(@Param('id') id: string) {
    return this.userService.getPublicProfile(id);
  }

  @Get(':userName')
  GetUserByUserName(@Param('userName') userName: string) {
    return this.userService.getUserByUserName(userName);
  }
}
