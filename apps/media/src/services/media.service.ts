import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { extname } from 'path';
import type { IMediaFile } from 'shared';

@Injectable()
export class MediaService implements OnModuleInit {
  private readonly logger = new Logger(MediaService.name);
  private client: Minio.Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.bucket =
      this.configService.get<string>('minio.bucket') || 'woorkroom-media';
    this.publicUrl =
      this.configService.get<string>('minio.publicUrl') ||
      'http://localhost:9000';

    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('minio.endpoint') || 'localhost',
      port: this.configService.get<number>('minio.port') || 9000,
      useSSL: this.configService.get<boolean>('minio.useSSL') ?? false,
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    };
    return map[base] ?? '.bin';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<IMediaFile> {
    const fileId = v4();
    const isImage = file.mimetype.startsWith('image/');
    const ext = extname(file.originalname).toLowerCase() || this.extFromMimetype(file.mimetype);
    const contentType = file.mimetype.split(';')[0].trim();

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
      webpUrl = `${this.publicUrl}/${this.bucket}/${webpName}`;

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
      thumbnailUrl = `${this.publicUrl}/${this.bucket}/${thumbName}`;
    }

    this.logger.log(`Uploaded ${objectName}`);

    return {
      fileId: objectName,
      url: `${this.publicUrl}/${this.bucket}/${objectName}`,
      webpUrl,
      thumbnailUrl,
      mimetype: contentType,
      size: file.buffer.length,
    };
  }

  getFileUrl(fileId: string): string {
    return `${this.publicUrl}/${this.bucket}/${fileId}`;
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
