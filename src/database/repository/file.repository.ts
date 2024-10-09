import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entity/file.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileEntity) private readonly file: Repository<FileEntity>,
  ) {}

  createFile(path: string, creator: string): FileEntity {
    return this.file.create({
      path,
      creator,
      updator: creator,
    });
  }

  async insertFile(file: FileEntity): Promise<InsertResult> {
    return this.file.insert(file);
  }
}
