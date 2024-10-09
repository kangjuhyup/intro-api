import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { YN } from '../../common/enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly user: Repository<UserEntity>,
  ) {}

  createUser(
    address: string,
    name: string,
    fileId: number,
    creator: string,
    company?: string,
  ): UserEntity {
    return this.user.create({
      address,
      name,
      company,
      fileId,
      creator,
      updator: creator,
    });
  }

  async selectUser(address: string): Promise<UserEntity> {
    return await this.user.findOne({
      where: {
        useYn: YN.Y,
        address,
      },
    });
  }

  async selectUserMany(): Promise<UserEntity[]> {
    return await this.user.find({
      where: {
        useYn: YN.Y,
      },
    });
  }

  async insertUser(user: UserEntity): Promise<InsertResult> {
    return await this.user.insert(user);
  }
}
