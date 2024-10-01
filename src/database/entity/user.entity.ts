import { YN } from '../../common/enum';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EmailHistoryEntity } from './email.history.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  address: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  company?: string;

  @OneToMany(() => EmailHistoryEntity, (emailHistory) => emailHistory.user, {
    nullable: true,
  })
  emailHistories?: EmailHistoryEntity[];
}
