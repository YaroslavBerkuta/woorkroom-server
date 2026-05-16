import { EntityAbstract } from 'shared';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'project_link' })
@Index(['projectId'])
export class ProjectLink extends EntityAbstract {
  @Column('uuid')
  projectId: string;

  @Column()
  url: string;

  @Column({ length: 255, nullable: true })
  title?: string;
}
