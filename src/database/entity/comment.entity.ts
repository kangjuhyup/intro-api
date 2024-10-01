import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { CommentColumn } from './column/comment.column';

@Entity({ name: CommentColumn.table })
export class CommentEntity extends BaseEntity {
  @PrimaryColumn({ name: CommentColumn.address })
  address: string;

  @Column({ name: CommentColumn.comment })
  comment: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
