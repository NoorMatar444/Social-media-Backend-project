import { Injectable } from '@nestjs/common';
import { DbRepo } from './Db.repo';
import { Post } from 'src/models/post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostRepo extends DbRepo<Post> {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {
    super(postModel);
  }
}
