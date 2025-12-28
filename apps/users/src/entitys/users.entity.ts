import { EntityAbstract, IUser } from 'shared';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'users' })
@Index(['email'])
@Index(['phoneNumber'])
export class Users extends EntityAbstract implements IUser {
  @Column({ unique: true, length: 255, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phoneNumber: string;
}
