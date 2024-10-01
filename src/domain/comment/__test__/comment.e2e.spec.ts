import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommentModule } from '../comment.module';
import { MailModule } from '../../../domain/mail/mail.module';
import { AppModule } from '../../../app.module';
import { ConfigModule } from '@nestjs/config';
import { AddCommentRequest } from '../dto/request/add.comment.request';

describe('Comment (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AppModule,
        CommentModule,
        MailModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[POST] /comment', () => {
    const body: AddCommentRequest = {
      email: 'fog0510@gmail.com',
      name: '강주협',
      comment: '가나다',
      avartar: 'abc',
    };
    return request(app.getHttpServer())
      .post('/comment')
      .send(body)
      .expect(201)
      .expect({
        result: true,
        data: {},
      });
  });
});
