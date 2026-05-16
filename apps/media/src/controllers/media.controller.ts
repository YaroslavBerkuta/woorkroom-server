import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GrpcMethod } from '@nestjs/microservices';
import { memoryStorage } from 'multer';
import { MediaService } from '../services';

@Controller('media')
export class MediaController {
  constructor(
    @Inject(MediaService.name)
    private readonly mediaService: MediaService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.mediaService.uploadFile(file, folder);
  }

  @GrpcMethod('MediaService', 'GetFileUrl')
  getFileUrl(data: { fileId: string }) {
    return { url: this.mediaService.getFileUrl(data.fileId) };
  }

  @GrpcMethod('MediaService', 'DeleteFile')
  async deleteFile(data: { fileId: string }) {
    const value = await this.mediaService.deleteFile(data.fileId);
    return { value };
  }
}
