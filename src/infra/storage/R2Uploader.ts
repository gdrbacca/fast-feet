import { Uploader, UploadParams } from "@/domain/fast_feet_main/application/storage/uploader";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Uploader implements Uploader {
    private client: S3Client
    
    constructor(private envService: EnvService) {
        this.client = new S3Client({
            endpoint: `https://${envService.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
                accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: envService.get("AWS_SECRET_ACCESS_KEY"),
            }

        })
    }

    async upload(params: UploadParams): Promise<{ url: string; }> {
        const fileId = randomUUID()
        const uniqueFileName = `${fileId}-${params.fileName}`

        await this.client.send(new PutObjectCommand({
            Bucket: this.envService.get('AWS_BUCKET_NAME'),
            Key: uniqueFileName,
            ContentType: params.fileType,
            Body: params.body
        }))

        return {
            url: uniqueFileName
        }
    }
}