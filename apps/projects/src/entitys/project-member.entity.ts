import { EntityAbstract, IProjectMember, ProjectMemberRole } from 'shared';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity({ name: 'project_member' })
@Index(['projectId'])
@Index(['employeeId'])
@Unique(['projectId', 'employeeId', 'role'])
export class ProjectMember extends EntityAbstract implements IProjectMember {
  @Column('uuid')
  projectId: string;

  @Column('uuid')
  employeeId: string;

  @Column({ type: 'enum', enum: ProjectMemberRole })
  role: ProjectMemberRole;
}
