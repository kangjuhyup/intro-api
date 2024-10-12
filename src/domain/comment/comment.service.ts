import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AddCommentRequest } from './dto/request/add.comment.request';
import { MailService } from '../../domain/mail/mail.service';
import { GetCommentsRequest } from './dto/request/get.comments.request';
import { GetCommentsResponse } from './dto/response/get.comments.response';
import { ConfigService } from '@nestjs/config';
import { CommentRepository } from '../../database/repository/comment.repository';
import { RedisClientService } from '../../redis/redis.service';

interface RedisComment {
  historyId: number;
  name: string;
  avartar: string;
  body: string;
  company: string;
  verify: boolean;
}

@Injectable()
export class CommentService {
  private logger = new Logger(ConfigService.name);

  constructor(
    @Inject(forwardRef(() => MailService))
    private readonly mail: MailService,
    private readonly commentRepisotry: CommentRepository,
    private readonly redis: RedisClientService,
  ) {}

  async getComments({
    limit,
    skip,
  }: GetCommentsRequest): Promise<GetCommentsResponse> {
    return {
      count: await this.commentRepisotry.selectCommentCount(),
      comments: (
        await this.commentRepisotry.selectCommentMany(limit, skip)
      ).map((comment) => ({
        avartar: comment.user.file.path,
        name: comment.user.name,
        company: comment.user.company,
        body: comment.comment,
        createdAt: comment.createdAt,
      })),
    };
  }

  async addComment({
    email,
    name,
    avartar,
    comment,
    company,
  }: AddCommentRequest): Promise<boolean> {
    const exist: RedisComment = await this.redis.get<RedisComment>(email);
    if (exist) {
      if (exist.verify)
        throw new ConflictException('이미 댓글을 등록하였습니다.');
      throw new ConflictException('댓글이 인증대기 중 입니다.');
    }

    const { historyId } = await this.mail.send({ to: email });
    await this.redis.set(
      email,
      {
        historyId,
        name,
        avartar,
        body: comment,
        company,
        verify: false,
      },
      600,
    );

    return true;
  }

  async getComment(email: string): Promise<RedisComment> {
    return this.redis.get<RedisComment>(email);
  }

  async confirmComment(
    email: string,
    comment: string,
    emailHistoryId: number,
  ): Promise<boolean> {
    await this.commentRepisotry.insertComment(
      this.commentRepisotry.createComment(
        email,
        comment,
        emailHistoryId,
        CommentService.name,
      ),
    );
    const existed = await this.redis.get<RedisComment>(email);
    this.redis.set(email, {
      ...existed,
      verify: true,
    });
    return true;
  }
}
