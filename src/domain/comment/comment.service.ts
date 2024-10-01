import {
  BadRequestException,
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
    }
  >();

  //TODO: 데이터베이스로 변경 필요
  private comments: {
    avartar: string;
    name: string;
    company: string;
    body: string;
    createdAt: Date;
  }[] = [
    {
      avartar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: '강주협',
      company: '더즌(주)',
      body: '반가워요',
      createdAt: new Date(),
    },
  ];

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
        avartar: comment.file.path,
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
  }: AddCommentRequest): Promise<boolean> {
    if (this.unVeiriedComments.has(email)) return false;

    const { historyId } = await this.mail.send({ to: email });

    this.unVeiriedComments.set(email, {
      historyId,
      name,
      avartar,
      body: comment,
    });
    return true;
  }

  confirmComment(email: string, historyId: number): boolean {
    this.logger.debug(`confirmComment email => ${email}`);
    if (!this.unVeiriedComments.has(email)) return false;
    const comment = this.unVeiriedComments.get(email);
    if (comment.historyId !== historyId)
      throw new BadRequestException('만료된 이메일 인증입니다.');
    this.comments.push({
      ...comment,
      company: 'test',
      createdAt: new Date(),
    });
    this.logger.debug(`push comments`);
    this.unVeiriedComments.delete(email);
    return true;
  }
}
