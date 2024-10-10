import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentRequest } from './dto/request/add.comment.request';
import { GetCommentsRequest } from './dto/request/get.comments.request';
import { HttpResponse } from 'src/dto/response.dto';
import { GetCommentsResponse } from './dto/response/get.comments.response';
import { interval, Observable, map, takeWhile } from 'rxjs';
@Controller('comment')
export class CommentController {
  private logger = new Logger(CommentController.name);
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @Query() dto: GetCommentsRequest,
  ): Promise<HttpResponse<GetCommentsResponse>> {
    const data = await this.commentService.getComments(dto).catch((err) => {
      throw err;
    });
    return {
      result: true,
      data,
    };
  }

  @Post()
  async addComment(
    @Body() dto: AddCommentRequest,
  ): Promise<HttpResponse<boolean>> {
    const data = await this.commentService.addComment(dto).catch((err) => {
      throw err;
    });
    return {
      result: true,
      data,
    };
  }

  @Sse('observe')
  commentSession(@Query('email') email: string): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        const commentExists = this.commentService.getComment(email);
        return { data: { confirm: !commentExists } };
      }),
      takeWhile(({ data }) => !data.confirm),
    );
  }
}
