import {
  Controller,
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

const IMAGE_ONLY_FOLDERS = ['avatars', 'logos'];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req: { body: Record<string, string> }, file, cb) => {
        const folder = _req.body?.folder ?? 'uploads';
        if (
          IMAGE_ONLY_FOLDERS.includes(folder) &&
          !file.mimetype.startsWith('image/')
        ) {
          return cb(
            new BadRequestException(
              'Only image files are allowed for this folder',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
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
