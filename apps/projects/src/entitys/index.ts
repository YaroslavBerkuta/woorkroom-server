export * from './project.entity';
export * from './project-member.entity';
export * from './project-file.entity';
export * from './project-link.entity';

import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectFile } from './project-file.entity';
import { ProjectLink } from './project-link.entity';

export const entities = [Project, ProjectMember, ProjectFile, ProjectLink];
