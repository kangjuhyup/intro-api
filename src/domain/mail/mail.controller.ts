import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailRequest } from './dto/request/send.request';
import { HttpResponse } from '../../dto/response.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(@Body() dto: SendMailRequest): Promise<HttpResponse<any>> {
    const data = await this.mailService.send(dto).catch((err) => {
      throw err;
    });
    return {
      result: true,
      data,
    };
  }
}
