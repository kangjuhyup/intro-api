import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { GetArticleResponse } from './dto/response/get.article';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class BlogService {
  private logger = new Logger(BlogService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  async getArticles(): Promise<GetArticleResponse> {
    const { data } = await firstValueFrom(
      this.http.get(this.config.get<string>('BLOG_URL')).pipe(
        catchError((err: AxiosError) => {
          this.logger.error(err.response.data);
          throw new ForbiddenException('블로그 게시글을 조회할 수 없습니다.');
        }),
      ),
    );
    const parsedData = await parseStringPromise(data, { explicitArray: false });

    const articles = parsedData.rss.channel.item.map((item) => ({
      title: item.title,
      link: item.link,
    }));

    return {
      count: articles.length,
      article: articles,
    };
  }
}
