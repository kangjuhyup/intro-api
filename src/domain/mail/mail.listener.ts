import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailVerified } from 'src/event/dto/email.verified';
import { MailService } from './mail.service';
import { EventType } from 'src/common/enum';

@Injectable()
export class MailListener {
  constructor(private readonly mailService: MailService) {}
  @OnEvent(EventType.EMAIL_VERIFIED)
  handleEmailVerified(event: EmailVerified) {
    this.mailService.verifyEmailHistory(event.getHistoryId);
  }
}
