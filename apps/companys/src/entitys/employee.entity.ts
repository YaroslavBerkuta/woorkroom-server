import { EntityAbstract, IEmployee, UserRole, UserStatus } from 'shared';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity({ name: 'employee' })
@Index(['userId'])
@Index(['companyId'])
@Unique(['userId', 'companyId'])
export class Employee extends EntityAbstract implements IEmployee {
  @Column('uuid')
  companyId: string;

  @Column({ type: 'uuid' })
  userId: string;

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
}
