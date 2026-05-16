import { EntityAbstract, IProject, ProjectPriority, ProjectStatus } from 'shared';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity({ name: 'project' })
@Index(['companyId'])
@Unique(['companyId', 'slug'])
export class Project extends EntityAbstract implements IProject {
  @Column('uuid')
  companyId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  starts?: string;

  @Column({ type: 'date', nullable: true })
  deadline?: string;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    nullable: true,
  })
  priority?: ProjectPriority;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true })
  image?: string;
}
