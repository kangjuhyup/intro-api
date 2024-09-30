import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../mail/mail.service';
import { CommentService } from '../comment.service';
import { AddCommentRequest } from '../dto/request/add.comment.request';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../../../domain/mail/mail.module';
import { MailerService } from '@nestjs-modules/mailer';

describe('CommentService', () => {
  let service: CommentService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CommentService,
        {
          provide: MailService,
          useValue: {
            send: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
      exports: [],
    }).compile();

    service = module.get<CommentService>(CommentService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComments', () => {
    it('페이지네이션 테스트', () => {
      service['comments'] = [
        {
          avartar: 'avatar1',
          name: '홍길동',
          company: '더즌',
          body: 'Comment 1',
          createdAt: new Date(),
        },
        {
          avartar: 'avatar2',
          name: '임꺽정',
          company: '캐리버스',
          body: 'Comment 2',
          createdAt: new Date(),
        },
        {
          avartar: 'avatar3',
          name: '박명수',
          company: '크립토',
          body: 'Comment 3',
          createdAt: new Date(),
        },
      ];

      const result = service.getComments({ limit: 2, skip: 1 });

      expect(result.comments.length).toBe(2);
      expect(result.count).toBe(3);
    });

    it('페이지네이션 skip 초과 테스트', () => {
      service['comments'] = [
        {
          avartar: 'avatar1',
          name: '홍길동',
          company: '더즌',
          body: 'Comment 1',
          createdAt: new Date(),
        },
        {
          avartar: 'avatar2',
          name: '임꺽정',
          company: '캐리버스',
          body: 'Comment 2',
          createdAt: new Date(),
        },
        {
          avartar: 'avatar3',
          name: '박명수',
          company: '크립토',
          body: 'Comment 3',
          createdAt: new Date(),
        },
      ];

      const result = service.getComments({ limit: 2, skip: 5 });

      expect(result.comments.length).toBe(0);
      expect(result.count).toBe(3);
    });
  });

  describe('addComment', () => {
    it('코멘트 추가 테스트', async () => {
      const addCommentRequest: AddCommentRequest = {
        email: 'test@test.com',
        name: '유재석',
        avartar: 'avatar1',
        comment: 'test',
      };

      const result = await service.addComment(addCommentRequest);

      expect(result).toBe(true);
      expect(service['unVeiriedComments'].has(addCommentRequest.email)).toBe(
        true,
      );
      expect(mailService.send).toHaveBeenCalledWith({ to: 'test@test.com' });
    });

    it('이미 존재하는 이메일 코멘트 추가 테스트', async () => {
      const addCommentRequest: AddCommentRequest = {
        email: 'test@test.com',
        name: '유재석',
        avartar: 'avatar1',
        comment: 'test',
      };

      service['unVeiriedComments'].set(addCommentRequest.email, {
        name: '박명수',
        avartar: 'avatar1',
        body: 'test',
      });

      const result = await service.addComment(addCommentRequest);

      expect(result).toBe(false);
      expect(mailService.send).not.toHaveBeenCalled();
    });
  });

  describe('confirmComment', () => {
    it('미인증 코멘트 인증', () => {
      const email = 'test@test.com';
      service['unVeiriedComments'].set(email, {
        name: '유재석',
        avartar: 'avatar1',
        body: 'test',
      });

      const result = service.confirmComment(email);

      expect(result).toBe(true);
      expect(service['comments'].length).toBe(1);
      expect(service['unVeiriedComments'].has(email)).toBe(false);
      expect(service.getComments({ limit: 10, skip: 0 })).toEqual({
        count: 1,
        comments: [
          expect.objectContaining({
            name: '유재석',
          }),
        ],
      });
    });

    it('미인증 코멘트가 없을경우 테스트', () => {
      const result = service.confirmComment('noperson@test.com');

      expect(result).toBe(false);
    });
  });
});
