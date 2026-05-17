export * from '@/entitys/project.entity';
export * from '@/entitys/project-member.entity';

import { Project } from '@/entitys/project.entity';
import { ProjectMember } from '@/entitys/project-member.entity';

export const entities = [Project, ProjectMember];
