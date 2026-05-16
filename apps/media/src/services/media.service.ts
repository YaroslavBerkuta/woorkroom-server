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

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<IMediaFile> {
    const fileId = v4();
    const isImage = file.mimetype.startsWith('image/');

    let buffer = file.buffer;
    let mimetype = file.mimetype;
    let ext = extname(file.originalname).toLowerCase();
    let thumbnailUrl: string | undefined;

    if (isImage) {
      buffer = await sharp(file.buffer).webp({ quality: 85 }).toBuffer();
      mimetype = 'image/webp';
      ext = '.webp';

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

    const objectName = `${folder}/${fileId}${ext}`;
    await this.client.putObject(
      this.bucket,
      objectName,
      buffer,
      buffer.length,
      { 'Content-Type': mimetype },
    );

    this.logger.log(`Uploaded ${objectName}`);

    return {
      fileId: objectName,
      url: `${this.publicUrl}/${this.bucket}/${objectName}`,
      thumbnailUrl,
      mimetype,
      size: buffer.length,
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
