import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import type { Response } from 'express';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

@Controller()
export class MediaProxyController {
  private readonly mediaInternalUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.mediaInternalUrl =
      this.config.get<string>('media.internalUrl') || 'http://media:3001';
  }

  @Get('media/file/*')
  async streamFile(@Param('0') path: string, @Res() res: Response) {
    const upstream = await this.http.axiosRef.get(
      `${this.mediaInternalUrl}/media/file/${path}`,
      { responseType: 'stream' },
    );
    res.setHeader('Content-Type', upstream.headers['content-type'] ?? 'application/octet-stream');
    if (upstream.headers['content-length']) {
      res.setHeader('Content-Length', upstream.headers['content-length']);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    upstream.data.pipe(res);
  }

  @Post('media/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async proxyUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) throw new BadRequestException('File is required');

    const formData = new FormData();
    formData.append('file', new Blob([file.buffer as unknown as ArrayBuffer], { type: file.mimetype }), file.originalname);
    if (folder) formData.append('folder', folder);

    const response = await this.http.axiosRef.post(
      `${this.mediaInternalUrl}/media/upload`,
      formData,
    );
    return response.data;
  }
}
