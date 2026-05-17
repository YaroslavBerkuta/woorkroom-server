import { Injectable, Scope, Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
import * as grpc from 'woorkroom/grpc';
import { IProjectFile, IProjectLink } from 'shared';

@Injectable({ scope: Scope.REQUEST })
export class ProjectDataloaderService {
  public readonly filesLoader: DataLoader<string, IProjectFile[]>;
  public readonly linksLoader: DataLoader<string, IProjectLink[]>;

  constructor(
    @Inject(grpc.GrpcProjectsService.name)
    private readonly grpcProjectsService: grpc.IGrpcProjectsService,
  ) {
    this.filesLoader = new DataLoader<string, IProjectFile[]>(
      async (projectIds) => {
        const files = await this.grpcProjectsService.getProjectFilesBatch([
          ...projectIds,
        ]);
        const grouped = new Map<string, IProjectFile[]>();
        for (const file of files) {
          const bucket = grouped.get(file.projectId) ?? [];
          bucket.push(file);
          grouped.set(file.projectId, bucket);
        }
        return projectIds.map((id) => grouped.get(id) ?? []);
      },
    );

    this.linksLoader = new DataLoader<string, IProjectLink[]>(
      async (projectIds) => {
        const links = await this.grpcProjectsService.getProjectLinksBatch([
          ...projectIds,
        ]);
        const grouped = new Map<string, IProjectLink[]>();
        for (const link of links) {
          const bucket = grouped.get(link.projectId) ?? [];
          bucket.push(link);
          grouped.set(link.projectId, bucket);
        }
        return projectIds.map((id) => grouped.get(id) ?? []);
      },
    );
  }
}
