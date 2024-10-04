import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntroDataSource } from './datasource/intro.datasource';
import { UserEntity } from './entity/user.entity';
import { CommentEntity } from './entity/comment.entity';
import { EmailHistoryEntity } from './entity/email.history.entity';
import { UserRepository } from './repository/user.repository';
import { EmailHistoryRepsitory } from './repository/email.history.repository';
import { CommentRepository } from './repository/comment.repository';
import { FileRepository } from './repository/file.repository';
import { FileEntity } from './entity/file.entity';

const repository = [
  UserRepository,
  EmailHistoryRepsitory,
  CommentRepository,
  FileRepository,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        await IntroDataSource.initialize();
        return IntroDataSource.options;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      CommentEntity,
      EmailHistoryEntity,
      FileEntity,
    ]),
  ],
  providers: [...repository],
  exports: [...repository],
})
export class DatabaseModule {}
