import { YN } from '../../common/enum';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseColumn } from './column/base.column';

export class BaseEntity {
  @Column({ name: BaseColumn.useYn, default: YN.Y })
  useYn: YN;

  @Column({ name: BaseColumn.creator })
  creator: string;

  @CreateDateColumn({ name: BaseColumn.createdAt })
  createdAt: Date;

  @Column({ name: BaseColumn.updator })
  updator: string;

  @UpdateDateColumn({ name: BaseColumn.updatedAt })
  updatedAt: Date;
}
