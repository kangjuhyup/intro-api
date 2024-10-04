import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentRequest } from './dto/request/add.comment.request';
import { GetCommentsRequest } from './dto/request/get.comments.request';
import { HttpResponse } from 'src/dto/response.dto';
import { GetCommentsResponse } from './dto/response/get.comments.response';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @Query() dto: GetCommentsRequest,
  ): Promise<HttpResponse<GetCommentsResponse>> {
    const data = await this.commentService.getComments(dto);
    return {
      result: true,
      data,
    };
  }

  @Post()
  addComment(@Body() dto: AddCommentRequest) {
    const data = this.commentService.addComment(dto).catch((err) => {
      throw err;
    });
    return {
      result: true,
      data,
    };
  }
}
