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
import { FileEntity } from './file.entity';
import { FileColumn } from './column/file.column';

@Entity({ name: UserColumn.table })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ name: UserColumn.address, type: 'varchar' })
  address: string;

  @Column({ name: UserColumn.name })
  name: string;

  @Column({ name: UserColumn.company, nullable: true })
  company?: string;

  @Column({ name: UserColumn.fileId })
  fileId: number;

  @OneToMany(() => EmailHistoryEntity, (emailHistory) => emailHistory.user, {
    nullable: true,
  })
  emailHistories?: EmailHistoryEntity[];

  @OneToOne(() => CommentEntity, (comment) => comment.user, {
    nullable: true,
  })
  @JoinColumn({ name: UserColumn.address })
  comment?: CommentEntity;

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: FileColumn.fileId })
  file: FileEntity;
}
