import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntroDataSource } from './datasource/intro.datasource';

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
  ],
})
export class DatabaseModule {}
