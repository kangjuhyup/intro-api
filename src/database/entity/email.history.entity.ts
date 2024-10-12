import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { YN } from '../../common/enum';
import { UserEntity } from './user.entity';
import { EmailHistoryColumn } from './column/email.history.column';
import { CommentEntity } from './comment.entity';

@Entity({ name: EmailHistoryColumn.table })
export class EmailHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: EmailHistoryColumn.historyId,
    type: 'int',
  })
  historyId: number;

  @Column({ name: EmailHistoryColumn.address })
  address: string;

  @Column({ name: EmailHistoryColumn.verifyYn, default: YN.N })
  verifyYn: YN;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: EmailHistoryColumn.address })
  user: UserEntity;

  @OneToOne(() => CommentEntity, { nullable: true })
  @JoinColumn({ name: EmailHistoryColumn.historyId })
  comment?: CommentEntity;
}
