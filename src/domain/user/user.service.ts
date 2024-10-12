import { Injectable } from '@nestjs/common';
import { FileRepository } from '../../database/repository/file.repository';
import { UserRepository } from '../../database/repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async getUser(address: string) {
    return await this.userRepository.selectUser(address);
  }

  async addUser(
    address: string,
    name: string,
    avartar: string,
    company?: string,
  ) {
    const file = this.fileRepository.createFile(avartar, UserService.name);
    await this.fileRepository.insertFile(file);
    await this.userRepository.insertUser(
      this.userRepository.createUser(
        address,
        name,
        file.fileId,
        UserService.name,
        company,
      ),
    );
  }
}
