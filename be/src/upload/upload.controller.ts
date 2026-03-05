import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards.js';
import { UploadService } from './upload.service.js';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'DEVELOPER')
@ApiBearerAuth()
export class UploadController {
    constructor(private uploadService: UploadService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload file (screenshot, thumbnail, or installer)' })
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: any,
        @Query('type') type: 'screenshots' | 'thumbnails' | 'installers',
    ) {
        const url = await this.uploadService.uploadFile(file, type || 'screenshots');
        return { url };
    }
}
