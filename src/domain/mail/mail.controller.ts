import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { MailService } from './mail.service';
import { VerifyMailRequest } from './dto/request/verify.request';
import { ConfigService } from '@nestjs/config';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  @Get('verify')
  @Redirect()
  async verify(@Query() dto: VerifyMailRequest) {
    await this.mailService.verify(dto);
    return {
      url: this.config.get<string>('PAGE_URL'),
    };
  }
}
