import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FileColumn } from './column/file.column';
import { BaseEntity } from './base.entity';

@Entity({
  name: FileColumn.table,
})
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: FileColumn.fileId })
  fileId: number;
  @Column({ name: FileColumn.path })
  path: string;
}
