import { EntityAbstract, IProject, ProjectPriority } from 'shared';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'project' })
@Index(['companyId'])
export class Project extends EntityAbstract implements IProject {
  @Column('uuid')
  companyId: string;

  @Column({ length: 255 })
  name: string;

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
