import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AddCommentRequest } from './dto/request/add.comment.request';
import { MailService } from '../../domain/mail/mail.service';
import { GetCommentsRequest } from './dto/request/get.comments.request';
import { GetCommentsResponse } from './dto/response/get.comments.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  private logger = new Logger(ConfigService.name);
  private unVeiriedComments = new Map<
    string,
    {
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
  ) {}

  getComments({ limit, skip }: GetCommentsRequest): GetCommentsResponse {
    const slicedComments =
      skip < this.comments.length
        ? this.comments.slice(skip, skip + limit)
        : [];
    this.logger.debug(`getComments => ${JSON.stringify(slicedComments)}`);
    return {
      count: this.comments.length,
      comments: slicedComments,
    };
  }

  async addComment({
    email,
    name,
    avartar,
    comment,
  }: AddCommentRequest): Promise<boolean> {
    if (this.unVeiriedComments.has(email)) return false;

    await this.mail.send({ to: email });

    this.unVeiriedComments.set(email, {
      name,
      avartar,
      body: comment,
    });
    return true;
  }

  confirmComment(email: string): boolean {
    this.logger.debug(`confirmComment email => ${email}`);
    if (!this.unVeiriedComments.has(email)) return false;
    this.comments.push({
      ...this.unVeiriedComments.get(email),
      company: 'test',
      createdAt: new Date(),
    });
    this.logger.debug(`push comments`);
    this.unVeiriedComments.delete(email);
    return true;
  }
}
