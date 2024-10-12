import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailHistoryEntity } from '../entity/email.history.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { YN } from '../../common/enum';

@Injectable()
export class EmailHistoryRepsitory {
  constructor(
    @InjectRepository(EmailHistoryEntity)
    private readonly emailHistory: Repository<EmailHistoryEntity>,
  ) {}

  createEmailHistory(address: string, creator: string): EmailHistoryEntity {
    return this.emailHistory.create({
      address,
      creator,
      updator: creator,
    });
  }

  async insertEmailHistory(
    emailHistory: EmailHistoryEntity,
  ): Promise<InsertResult> {
    return this.emailHistory.insert(emailHistory);
  }

  async updateEmailHistoryVerify(historyId: number): Promise<UpdateResult> {
    return this.emailHistory.update(
      {
        verifyYn: YN.Y,
      },
      {
        historyId,
      },
    );
  }
}
