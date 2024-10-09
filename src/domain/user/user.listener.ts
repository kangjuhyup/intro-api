import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailVerified } from 'src/event/dto/email.verified';
import { UserService } from './user.service';
import { EventType } from 'src/common/enum';

@Injectable()
export class UserListener {
  constructor(private readonly userService: UserService) {}

  @OnEvent(EventType.EMAIL_VERIFIED)
  handleEmailVerified(event: EmailVerified) {
    this.userService.addUser(
      event.getAddress,
      event.getName,
      event.getAvartar,
      event.getCompany,
    );
  }
}
