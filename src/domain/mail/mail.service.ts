import { MailerService } from '@nestjs-modules/mailer';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { SendMailRequest } from './dto/request/send.request';
import { SendMailResponse } from './dto/response/send.response';
import { verifyTemplate } from './template';
import { ConfigService } from '@nestjs/config';
import { VerifyMailRequest } from './dto/request/verify.request';
import { CommentService } from '../comment/comment.service';
import { VerifyMailResponse } from './dto/response/verify.response';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    @Inject(forwardRef(() => CommentService))
    private readonly comment: CommentService,
  ) {}

  async send({ to }: SendMailRequest): Promise<SendMailResponse> {
    this.logger.debug(`send : ${to}`);
    await this.mailer.sendMail({
      to,
      subject: '[강주협]댓글 인증 메일',
      text: '소중한 댓글 감사합니다.',
      html: verifyTemplate(this.config.get<string>('VERIFY_URL'), to),
    });
    this.logger.debug(`메일 전송 성공`);
    return { sendedAt: new Date() };
  }

  verify({ email }: VerifyMailRequest): VerifyMailResponse {
    const result = this.comment.confirmComment(email);
    this.logger.debug(`verify result => ${result}`);
    return { verify: result };
  }
}
