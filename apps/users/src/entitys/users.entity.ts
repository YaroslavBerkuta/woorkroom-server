import { EntityAbstract, IUser } from 'shared';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Profiles } from './profile.entity';

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

  @OneToMany(() => Profiles, (profile) => profile.user, { onDelete: 'CASCADE' })
  profiles: Profiles[];
}
