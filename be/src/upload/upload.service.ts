import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    private supabaseUrl: string;
    private supabaseKey: string;
    private bucket: string;

    constructor(private config: ConfigService) {
        this.supabaseUrl = this.config.get<string>('SUPABASE_URL', '');
        this.supabaseKey = this.config.get<string>('SUPABASE_KEY', '');
        this.bucket = this.config.get<string>('SUPABASE_BUCKET', 'uploads');
    }

    async uploadFile(
        file: { originalname: string; buffer: Buffer; mimetype: string },
        folder: 'screenshots' | 'thumbnails' | 'installers',
    ): Promise<string> {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;

        // In production: upload to Supabase Storage
        // const { data, error } = await supabase.storage
        //   .from(this.bucket)
        //   .upload(fileName, file.buffer, { contentType: file.mimetype });

        // Mock: return a placeholder URL
        return `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${fileName}`;
    }
}
