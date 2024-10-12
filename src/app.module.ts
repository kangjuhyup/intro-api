import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './domain/mail/mail.module';
import { CommentModule } from './domain/comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from './common/exception/interceptor';
import { BlogModule } from './domain/blog/blog.module';
import { RedisClientModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      global: true,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: true,
    }),
    RedisClientModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PWD'),
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    DatabaseModule,
    MailModule,
    CommentModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
