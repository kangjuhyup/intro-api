import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { MailService } from './mail.service';
import { HttpResponse } from '../../dto/response.dto';
import { VerifyMailRequest } from './dto/request/verify.request';
import { VerifyMailResponse } from './dto/response/verify.response';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('verify')
  verify(@Query() dto: VerifyMailRequest): HttpResponse<VerifyMailResponse> {
    const data = this.mailService.verify(dto);
    return {
      result: true,
      data,
    };
  }
}
