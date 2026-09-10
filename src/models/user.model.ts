import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from 'src/common/enums/user.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  userName!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({
    type: String,
    select: false,
    required: function (this: User) {
      return this.provider === ProviderEnum.SYSTEM;
    },
  })
  password!: string;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.MALE })
  gender!: GenderEnum;

  @Prop({ type: String })
  phone!: string;

  @Prop({ type: Date })
  DOB!: Date;

  @Prop({ type: String, enum: ProviderEnum, default: ProviderEnum.SYSTEM })
  provider!: ProviderEnum;

  @Prop({
    type: String,
    unique: true,
    sparse: true, // unique only when googleId exists
    required: function (this: User) {
      return this.provider === ProviderEnum.GOOGLE;
    },
  })
  googleId?: string;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.USER })
  role!: RoleEnum;

  @Prop({ type: String })
  profilePicture!: string;

  @Prop({ type: [String] })
  coverPicture!: string[];

  @Prop({ type: Date })
  changeCreditTime!: Date;

  @Prop({ type: Boolean, default: false })
  confirmEmail!: boolean;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}
export type HydratedUser = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);
const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);
export default UserModel;
