import { IProfile, UserRole, UserStatus } from 'shared';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Users } from './users.entity';

@Entity({ name: 'profiles' })
@Index(['userId'])
@Index(['companyId'])
@Unique(['userId', 'companyId'])
export class Profiles implements IProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @ManyToOne(() => Users, (user) => user.profiles)
  user: Users;
}
