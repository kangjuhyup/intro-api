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
import { interval, Observable, map, takeWhile, switchMap, from } from 'rxjs';
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
  commentSession(
    @Query('email') email: string,
  ): Observable<{ data: { confirm: boolean }; stop: boolean }> {
    return interval(1000).pipe(
      switchMap(() =>
        from(this.commentService.getComment(email)).pipe(
          map((comment) => {
            if (!comment) return { data: { confirm: false }, stop: true }; // comment가 없으면 stop 플래그 설정
            if (comment.verify) return { data: { confirm: true }, stop: true }; // verify가 true면 스트림 종료 플래그 설정
            return { data: { confirm: false }, stop: false }; // 아직 verify되지 않은 경우
          }),
        ),
      ),
      takeWhile(({ stop }) => !stop, true), // stop 플래그가 true가 될 때까지 스트림 유지
    );
  }
}
