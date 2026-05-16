import { IMediaFile } from 'shared';

export interface IGrpcMediaService {
  getFileUrl(fileId: string): Promise<string>;
  deleteFile(fileId: string): Promise<boolean>;
}
