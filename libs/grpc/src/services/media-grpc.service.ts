import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import type { IGrpcMediaService } from '../types';

interface FileUrlResponse {
  url: string;
}

interface BoolResponse {
  value: boolean;
}

interface MediaGrpcClient {
  getFileUrl(data: { fileId: string }): Observable<FileUrlResponse>;
  deleteFile(data: { fileId: string }): Observable<BoolResponse>;
}

@Injectable()
export class GrpcMediaService implements IGrpcMediaService, OnModuleInit {
  static readonly name = 'GrpcMediaService';

  private client: MediaGrpcClient;

  constructor(
    @Inject('MEDIA_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.grpcClient.getService<MediaGrpcClient>('MediaService');
  }

  async getFileUrl(fileId: string): Promise<string> {
    const res = await lastValueFrom(this.client.getFileUrl({ fileId }));
    return res.url;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const res = await lastValueFrom(this.client.deleteFile({ fileId }));
    return res.value;
  }
}
