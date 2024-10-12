import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepository } from '../../../database/repository/comment.repository';
import { RedisClientService } from '../../../redis/redis.service';
import { ConflictException } from '@nestjs/common';
import { CommentService } from '../comment.service';
import { MailService } from '../../../domain/mail/mail.service';
import { CommentEntity } from 'src/database/entity/comment.entity';

describe('댓글 서비스 테스트', () => {
  let commentService: CommentService;
  let mailService: MailService;
  let commentRepository: CommentRepository;
  let redisClientService: RedisClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: MailService,
          useValue: {
            send: jest.fn().mockResolvedValue({ historyId: 1 }),
          },
        },
        {
          provide: CommentRepository,
          useValue: {
            selectCommentMany: jest.fn(),
            selectCommentCount: jest.fn(),
            insertComment: jest.fn(),
            createComment: jest.fn(),
          },
        },
        {
          provide: RedisClientService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    mailService = module.get<MailService>(MailService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    redisClientService = module.get<RedisClientService>(RedisClientService);
  });

  it('댓글을 성공적으로 추가한다', async () => {
    const addCommentRequest = {
      email: 'test@example.com',
      name: '테스트 이름',
      avartar: 'path/to/avatar',
      comment: '테스트 댓글',
      company: '테스트 회사',
    };

    jest.spyOn(redisClientService, 'get').mockResolvedValue(null);
    const result = await commentService.addComment(addCommentRequest);

    expect(mailService.send).toHaveBeenCalledWith({ to: 'test@example.com' });
    expect(redisClientService.set).toHaveBeenCalled();
    expect(result).toEqual(true);
  });

  it('이미 댓글이 존재하면 에러를 던진다', async () => {
    const existingComment = {
      historyId: 1,
      name: '테스트 이름',
      avartar: 'path/to/avatar',
      body: '테스트 댓글',
      company: '테스트 회사',
      verify: false,
    };

    jest.spyOn(redisClientService, 'get').mockResolvedValue(existingComment);

    await expect(
      commentService.addComment({
        email: 'test@example.com',
        name: '테스트 이름',
        avartar: 'path/to/avatar',
        comment: '테스트 댓글',
        company: '테스트 회사',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('댓글 목록을 성공적으로 가져온다', async () => {
    const getCommentsRequest = { limit: 10, skip: 0 };
    const commentList = [
      {
        address: 'test@test.com',
        emailHistoryId: 1,
        useYn: 'Y',
        comment: 'Test comment',
        createdAt: new Date(),
        user: {
          name: '',
          file: {
            path: '',
          },
        },
        creator: '',
        updator: '',
        updatedAt: new Date(),
      },
    ] as CommentEntity[];

    jest
      .spyOn(commentRepository, 'selectCommentMany')
      .mockResolvedValue(commentList);
    jest.spyOn(commentRepository, 'selectCommentCount').mockResolvedValue(1);

    const result = await commentService.getComments(getCommentsRequest);

    expect(result.count).toEqual(1);
    expect(result.comments.length).toEqual(1);
  });

  it('댓글을 성공적으로 확인한다', async () => {
    const email = 'test@example.com';
    const redisComment = {
      historyId: 1,
      name: '테스트 이름',
      avartar: 'path/to/avatar',
      body: '테스트 댓글',
      company: '테스트 회사',
      verify: false,
    };

    jest.spyOn(redisClientService, 'get').mockResolvedValue(redisComment);

    const result = await commentService.confirmComment(email, '테스트 댓글', 1);

    expect(result).toEqual(true);
    expect(redisClientService.set).toHaveBeenCalledWith(email, {
      ...redisComment,
      verify: true,
    });
  });
});
