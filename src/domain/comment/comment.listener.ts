import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailVerified } from 'src/event/dto/email.verified';
import { CommentService } from './comment.service';
import { EventType } from 'src/common/enum';

@Injectable()
export class CommentListener {
  constructor(private readonly commentService: CommentService) {}
  @OnEvent(EventType.EMAIL_VERIFIED)
  handleEmailVerified(event: EmailVerified) {
    this.commentService.confirmComment(
      event.getAddress,
      event.getComment,
      event.getHistoryId,
    );
  }
}
