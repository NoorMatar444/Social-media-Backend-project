import { Injectable } from '@nestjs/common';
import { DbRepo } from './Db.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Follow } from 'src/models/follow.model';
import { Model, QueryFilter } from 'mongoose';

@Injectable()
export class FollowRepo extends DbRepo<Follow> {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {
    super(followModel);
  }
  async countDocument({ filter }: { filter?: QueryFilter<Follow> }) {
    return await this.followModel.countDocuments(filter);
  }
}
