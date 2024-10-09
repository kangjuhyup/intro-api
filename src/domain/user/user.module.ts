import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserListener } from './user.listener';

@Module({
  providers: [UserService, UserListener],
  exports: [UserService],
})
export class UserModule {}
