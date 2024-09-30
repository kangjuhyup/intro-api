import { forwardRef, Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [forwardRef(() => MailModule)],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
