import { Injectable } from '@nestjs/common';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CommentEntity } from '../entity/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common/enum';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly comment: Repository<CommentEntity>,
  ) {}

  createComment(address: string, comment: string): CommentEntity {
    return this.comment.create({
      address,
      comment,
    });
  }

  async selectCommentCount(): Promise<number> {
    return await this.comment.count({
      where: {
        useYn: YN.Y,
      },
    });
  }

  async selectCommentMany(
    limit?: number,
    skip?: number,
  ): Promise<CommentEntity[]> {
    return await this.comment.find({
      where: {
        useYn: YN.Y,
      },
      relations: {
        user: true,
        file: true,
      },
      take: limit,
      skip: skip,
    });
  }

  async insertComment(comment: CommentEntity): Promise<InsertResult> {
    return await this.comment.insert(comment);
  }

  async deleteComment(address: string): Promise<UpdateResult> {
    return await this.comment.update(
      { useYn: YN.N },
      {
        address,
      },
    );
  }

  async updateComment(address: string, comment: string): Promise<UpdateResult> {
    return await this.comment.update(
      { comment, updator: address },
      { address },
    );
  }
}
