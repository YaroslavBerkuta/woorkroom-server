import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { extname } from 'path';
import type { Readable } from 'stream';
import type { IMediaFile } from 'shared';

@Injectable()
export class MediaService implements OnModuleInit {
  private readonly logger = new Logger(MediaService.name);
  private client: Minio.Client;
  private bucket: string;
  private publicUrl: string;
  private fileBaseUrl: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.bucket =
      this.configService.get<string>('minio.bucket') || 'woorkroom-media';
    this.publicUrl =
      this.configService.get<string>('minio.publicUrl') ||
      'http://localhost:9000';
    const httpPort = this.configService.get<number>('media.httpPort') || 3001;
    this.fileBaseUrl =
      this.configService.get<string>('media.fileBaseUrl') ||
      `http://localhost:${httpPort}/media/file`;

    const useSSL = this.configService.get<boolean>('minio.useSSL') ?? false;
    const configuredPort = this.configService.get<number>('minio.port');
    // S3 з SSL не потребує явного порту (443 за замовчуванням)
    const port =
      useSSL && configuredPort === 443 ? undefined : configuredPort || 9000;

    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('minio.endpoint') || 'localhost',
      ...(port !== undefined && { port }),
      useSSL,
      region: this.configService.get<string>('minio.region') || 'eu-north-1',
      accessKey:
        this.configService.get<string>('minio.accessKey') || 'woorkroom',
      secretKey:
        this.configService.get<string>('minio.secretKey') || 'woorkroom',
    });

    await this.initBucket();
  }

  private async initBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        const policy = JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`],
            },
          ],
        });
        await this.client.setBucketPolicy(this.bucket, policy);
        this.logger.log(
          `Bucket '${this.bucket}' created with public read policy`,
        );
      } else {
        this.logger.log(`Connected to bucket '${this.bucket}'`);
      }
    } catch (e) {
      this.logger.error('Failed to init MinIO bucket', e);
    }
  }

  private extFromMimetype(mime: string): string {
    const base = mime.split(';')[0].trim();
    const map: Record<string, string> = {
      'audio/webm': '.webm',
      'video/webm': '.webm',
      'audio/ogg': '.ogg',
      'video/ogg': '.ogv',
      'audio/mp4': '.m4a',
      'video/mp4': '.mp4',
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        '.docx',
    };
    return map[base] ?? '.bin';
  }

  private mimetypeFromExt(ext: string): string {
    const map: Record<string, string> = {
      '.webm': 'video/webm',
      '.mp4': 'video/mp4',
      '.m4a': 'audio/mp4',
      '.ogg': 'audio/ogg',
      '.ogv': 'video/ogg',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    return map[ext.toLowerCase()] ?? 'application/octet-stream';
  }

  private detectContentType(buffer: Buffer, declaredMime: string): string {
    const base = declaredMime.split(';')[0].trim().toLowerCase();
    const isGeneric =
      !base || base === 'text/plain' || base === 'application/octet-stream';

    if (!isGeneric) return base;

    // WebM / EBML magic: 1A 45 DF A3
    if (
      buffer[0] === 0x1a &&
      buffer[1] === 0x45 &&
      buffer[2] === 0xdf &&
      buffer[3] === 0xa3
    ) {
      return 'video/webm';
    }
    // MP4 / M4A: ftyp box at offset 4
    if (
      buffer[4] === 0x66 &&
      buffer[5] === 0x74 &&
      buffer[6] === 0x79 &&
      buffer[7] === 0x70
    ) {
      return 'video/mp4';
    }
    // OGG: OggS magic
    if (
      buffer[0] === 0x4f &&
      buffer[1] === 0x67 &&
      buffer[2] === 0x67 &&
      buffer[3] === 0x53
    ) {
      return 'audio/ogg';
    }
    // MP3: ID3 or sync bytes
    if (
      (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
      (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
    ) {
      return 'audio/mpeg';
    }

    return base || 'application/octet-stream';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<IMediaFile> {
    const fileId = v4();
    const isImage = file.mimetype.startsWith('image/');
    const ext =
      extname(file.originalname).toLowerCase() ||
      this.extFromMimetype(file.mimetype);
    const contentType = this.detectContentType(file.buffer, file.mimetype);

    const objectName = `${folder}/${fileId}${ext}`;
    let webpUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.buffer.length,
      { 'Content-Type': contentType },
    );

    if (isImage) {
      const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 85 })
        .toBuffer();
      const webpName = `${folder}/${fileId}.webp`;
      await this.client.putObject(
        this.bucket,
        webpName,
        webpBuffer,
        webpBuffer.length,
        { 'Content-Type': 'image/webp' },
      );
      webpUrl = `${this.fileBaseUrl}/${webpName}`;

      const thumbBuffer = await sharp(file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();
      const thumbName = `${folder}/thumbs/${fileId}.webp`;
      await this.client.putObject(
        this.bucket,
        thumbName,
        thumbBuffer,
        thumbBuffer.length,
        { 'Content-Type': 'image/webp' },
      );
      thumbnailUrl = `${this.fileBaseUrl}/${thumbName}`;
    }

    this.logger.log(`Uploaded ${objectName}`);

    return {
      fileId: objectName,
      url: `${this.fileBaseUrl}/${objectName}`,
      webpUrl,
      thumbnailUrl,
      mimetype: contentType,
      size: file.buffer.length,
    };
  }

  async streamFile(
    objectName: string,
  ): Promise<{ stream: Readable; contentType: string; size: number }> {
    try {
      const stat = await this.client.statObject(this.bucket, objectName);
      const ext = extname(objectName);
      const contentType =
        this.mimetypeFromExt(ext) !== 'application/octet-stream'
          ? this.mimetypeFromExt(ext)
          : ((stat.metaData?.['content-type'] as string | undefined) ??
            'application/octet-stream');
      const stream = await this.client.getObject(this.bucket, objectName);
      return { stream, contentType, size: stat.size };
    } catch {
      throw new NotFoundException(`File not found: ${objectName}`);
    }
  }

  getFileUrl(fileId: string): string {
    return `${this.fileBaseUrl}/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.client.removeObject(this.bucket, fileId);

      const parts = fileId.split('/');
      const filename = parts.pop();
      const folder = parts.join('/');
      await this.client
        .removeObject(this.bucket, `${folder}/thumbs/${filename}`)
        .catch(() => {});

      this.logger.log(`Deleted ${fileId}`);
      return true;
    } catch (e) {
      this.logger.error(`Failed to delete ${fileId}`, e);
      return false;
    }
  }
}
