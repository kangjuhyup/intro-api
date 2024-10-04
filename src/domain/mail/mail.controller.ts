import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { MailService } from './mail.service';
import { HttpResponse } from '../../dto/response.dto';
import { VerifyMailRequest } from './dto/request/verify.request';
import { VerifyMailResponse } from './dto/response/verify.response';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('verify')
  async verify(
    @Query() dto: VerifyMailRequest,
  ): Promise<HttpResponse<VerifyMailResponse>> {
    const data = await this.mailService.verify(dto);
    return {
      result: true,
      data,
    };
  }
}
