import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards.js';
import { LibraryService } from './library.service.js';

@ApiTags('Library')
@Controller('library')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LibraryController {
    constructor(private libraryService: LibraryService) { }

    @Get()
    @ApiOperation({ summary: 'Get user library (purchased software)' })
    getUserLibrary(@Req() req) {
        return this.libraryService.getUserLibrary(req.user.id);
    }
}
