import { EntityAbstract } from 'shared';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'project_file' })
@Index(['projectId'])
export class ProjectFile extends EntityAbstract {
  @Column('uuid')
  projectId: string;

  @Column()
  url: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 127, nullable: true })
  mimeType?: string;

  @Column({ type: 'int', nullable: true })
  size?: number;
}
