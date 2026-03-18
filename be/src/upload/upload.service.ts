import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    async uploadFile(
        file: { originalname: string; buffer: Buffer; mimetype: string },
        folder: 'screenshots' | 'thumbnails' | 'installers',
    ): Promise<string> {
        const originalNameSafe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${originalNameSafe}`;
        const uploadDir = path.join(process.cwd(), 'uploads', folder);
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, file.buffer);

        // Store relative path in DB
        return `uploads/${folder}/${fileName}`;
    }
}
