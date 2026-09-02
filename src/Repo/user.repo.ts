import { Injectable } from '@nestjs/common';
import { DbRepo } from './Db.repo';
import { User } from 'src/models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepo extends DbRepo<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
