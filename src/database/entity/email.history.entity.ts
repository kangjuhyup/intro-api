import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { YN } from '../../common/enum';
import { UserEntity } from './user.entity';
import { EmailHistoryColumn } from './column/email.history.column';

@Entity({ name: EmailHistoryColumn.table })
export class EmailHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: EmailHistoryColumn.historyId })
  historyId: number;

  @Column({ name: EmailHistoryColumn.address })
  address: string;

  @Column({ name: EmailHistoryColumn.verifyYn, default: YN.N })
  verifyYn: YN;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
