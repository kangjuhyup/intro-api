import { Controller, Get } from '@nestjs/common';
import { BlogService } from './blog.service';
import { HttpResponse } from 'src/dto/response.dto';
import { GetArticleResponse } from './dto/response/get.article';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getArticles(): Promise<HttpResponse<GetArticleResponse>> {
    const data = await this.blogService.getArticles().catch((err) => {
      throw err;
    });
    return {
      result: true,
      data,
    };
  }
}
