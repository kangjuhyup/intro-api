import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AddCommentRequest } from './dto/request/add.comment.request';
import { MailService } from '../../domain/mail/mail.service';
import { GetCommentsRequest } from './dto/request/get.comments.request';
import { GetCommentsResponse } from './dto/response/get.comments.response';
import { ConfigService } from '@nestjs/config';
import { CommentRepository } from 'src/database/repository/comment.repository';

@Injectable()
export class CommentService {
  private logger = new Logger(ConfigService.name);
  private unVeiriedComments = new Map<
    string,
    {
      historyId: number;
      avartar: string;
      name: string;
      body: string;
      company?: string;
    }
  >();

  constructor(
    @Inject(forwardRef(() => MailService))
    private readonly mail: MailService,
    private readonly commentRepisotry: CommentRepository,
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

  //TODO : Redis 로 저장소 변경 필요
  async addComment({
    email,
    name,
    avartar,
    comment,
    company,
  }: AddCommentRequest): Promise<boolean> {
    if (this.unVeiriedComments.has(email)) return false;

    const { historyId } = await this.mail.send({ to: email });

    this.unVeiriedComments.set(email, {
      historyId,
      name,
      avartar,
      body: comment,
      company,
    });
    return true;
  }

  getComment(email: string) {
    return this.unVeiriedComments.get(email);
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
    this.unVeiriedComments.delete(email);
    return true;
  }
}
