export * from './project.entity';
export * from './project-member.entity';

import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';

export const entities = [Project, ProjectMember];
