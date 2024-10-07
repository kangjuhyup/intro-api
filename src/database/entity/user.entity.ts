import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { EmailHistoryEntity } from './email.history.entity';
import { CommentEntity } from './comment.entity';
import { UserColumn } from './column/user.column';
import { BaseEntity } from './base.entity';

@Entity({ name : UserColumn.table })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ name : UserColumn.address })
  address: string;

  @Column({ name : UserColumn.name })
  name: string;

  @Column({ name : UserColumn.company, nullable: true })
  company?: string;

  @OneToMany(() => EmailHistoryEntity, (emailHistory) => emailHistory.user, {
    nullable: true,
  })
  @JoinColumn({ name: UserColumn.address })
  emailHistories?: EmailHistoryEntity[];

  @OneToOne(() => CommentEntity, (comment) => comment.user, {
    nullable: true,
  })
  @JoinColumn({ name: UserColumn.address })
  comment?: CommentEntity;
}
