import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { CommentColumn } from './column/comment.column';
import { EmailHistoryColumn } from './column/email.history.column';
import { EmailHistoryEntity } from './email.history.entity';
import { FileColumn } from './column/file.column';
import { FileEntity } from './file.entity';

@Entity({ name: CommentColumn.table })
export class CommentEntity extends BaseEntity {
  @PrimaryColumn({ name: CommentColumn.address })
  address: string;

  @Column({ name: CommentColumn.comment })
  comment: string;

  @Column({ name: EmailHistoryColumn.historyId })
  emailHistoryId: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: CommentColumn.address })
  user: UserEntity;

  @OneToOne(() => EmailHistoryEntity)
  @JoinColumn({ name: EmailHistoryColumn.historyId })
  emailHistory: EmailHistoryEntity;
}
