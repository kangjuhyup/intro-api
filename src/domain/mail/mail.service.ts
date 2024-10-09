import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SendMailRequest } from './dto/request/send.request';
import { SendMailResponse } from './dto/response/send.response';
import { verifyTemplate } from './template';
import { ConfigService } from '@nestjs/config';
import { VerifyMailRequest } from './dto/request/verify.request';
import { CommentService } from '../comment/comment.service';
import { EmailHistoryRepsitory } from 'src/database/repository/email.history.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailVerified } from 'src/event/dto/email.verified';
import { UserService } from '../user/user.service';
import { EventType } from 'src/common/enum';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    @Inject(forwardRef(() => CommentService))
    private readonly comment: CommentService,
    private readonly user: UserService,
    private event: EventEmitter2,
    private readonly emailHistoryRepository: EmailHistoryRepsitory,
  ) {}

  async send({ to }: SendMailRequest): Promise<SendMailResponse> {
    this.logger.debug(`send : ${to}`);
    const user = await this.user.getUser(to);
    if (user) throw new BadRequestException('이미 댓글을 등록한 사용자입니다.');
    const history = this.emailHistoryRepository.createEmailHistory(
      to,
      MailService.name,
    );
    await this.emailHistoryRepository.insertEmailHistory(history);
    await this.mailer.sendMail({
      to,
      subject: '[강주협]댓글 인증 메일',
      text: '소중한 댓글 감사합니다.',
      html: verifyTemplate(
        this.config.get<string>('VERIFY_URL'),
        to,
        history.historyId,
      ),
    });
    this.logger.debug(`메일 전송 성공`);
    return { historyId: history.historyId, sendedAt: new Date() };
  }

  async verify({ email, historyId }: VerifyMailRequest) {
    this.logger.debug(`verify email : ${email} , historyId : ${historyId}`);
    const comment = this.comment.getComment(email);
    if (!comment)
      throw new ForbiddenException('존재하지 않는 인증메일 입니다.');
    this.logger.debug(`comment => ${JSON.stringify(comment)}`);
    if (comment.historyId !== historyId) {
      this.logger.debug(
        `historyId => ${typeof historyId} , comment.hisotryId => ${typeof comment.historyId}`,
      );
      throw new BadRequestException('만료된 이메일 인증입니다.');
    }
    this.event.emit(
      EventType.EMAIL_VERIFIED,
      new EmailVerified({
        historyId,
        address: email,
        name: comment.name,
        avartar: comment.avartar,
        comment: comment.body,
        company: comment.company,
      }),
    );
  }

  async verifyEmailHistory(historyId: number) {
    this.emailHistoryRepository.updateEmailHistoryVerify(historyId);
  }
}
