import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import * as grpc from 'woorkroom/grpc';
import { GqlSessionAuthGuard } from '../../guards';
import { AuditEventModel } from '../models/audit-event.model';

@Resolver(() => AuditEventModel)
export class AuditResolver {
  constructor(
    @Inject(grpc.GrpcAuditService.name)
    private readonly grpcAuditService: grpc.IGrpcAuditService,
  ) {}

  @UseGuards(GqlSessionAuthGuard)
  @Query(() => [AuditEventModel])
  async auditEvents(
    @Args('resourceId', { type: () => String }) resourceId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ): Promise<AuditEventModel[]> {
    const result = await this.grpcAuditService.getAuditEvents({
      resourceId,
      limit,
      offset,
    });
    return result.events;
  }
}
