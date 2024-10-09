import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
