import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/models/comment.model';
import { DbRepo } from './Db.repo';

@Injectable()
export class CommentRepo extends DbRepo<Comment> {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }
}
