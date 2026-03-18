import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, Req, Res, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards.js';
import { ProductsService } from './products.service.js';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products (with optional search/filter/sort/pagination)' })
    findAll(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('sort') sort?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.productsService.findAll({ search, category, sort, page: Number(page || 1), limit: Number(limit || 24) });
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all product categories' })
    getCategories() {
        return this.productsService.getCategories();
    }

    @Get('featured')
    @ApiOperation({ summary: 'Get featured products' })
    getFeatured() {
        return this.productsService.getFeatured();
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending products' })
    getTrending() {
        return this.productsService.getTrending();
    }

    @Get('category/:name')
    @ApiOperation({ summary: 'Get products by category name' })
    getByCategory(@Param('name') name: string) {
        return this.productsService.getByCategory(name);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    findById(@Param('id') id: string) {
        return this.productsService.findById(id);
    }

    @Get(':id/versions')
    @ApiOperation({ summary: 'Get product versions' })
    getVersions(@Param('id') id: string) {
        return this.productsService.getVersions(id);
    }

    @Get('developer/analytics')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get developer analytics' })
    getDeveloperAnalytics(@Req() req: any) {
        return this.productsService.getDeveloperAnalytics(req.user.id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create product (admin/developer)' })
    create(@Req() req: any, @Body() body: {
        name: string;
        description: string;
        price: number;
        thumbnail?: string;
        categoryId: string;
        developerId?: string;
        releaseDate?: Date;
    }) {
        const developerId = req.user.role === 'ADMIN' && body.developerId 
            ? body.developerId 
            : req.user.id;
        
        return this.productsService.create({ ...body, developerId });
    }

    @Post(':id/versions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create product version (admin/developer)' })
    createVersion(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: { version: string; downloadUrl: string; fileSize?: number; changelog?: string },
    ) {
        return this.productsService.createVersion(id, req.user.id, req.user.role, body);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product (admin/developer)' })
    update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.productsService.update(id, req.user.id, req.user.role, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product (admin)' })
    delete(@Req() req: any, @Param('id') id: string) {
        return this.productsService.delete(id, req.user.id, req.user.role);
    }

    @Get(':id/versions/:versionId/download')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Secure product download' })
    async download(
        @Req() req: any,
        @Param('id') id: string,
        @Param('versionId') versionId: string,
        @Res() res: Response
    ) {
        const filePath = await this.productsService.downloadVersion(id, versionId, req.user.id);
        const absolutePath = path.join(process.cwd(), filePath);
        
        if (!fs.existsSync(absolutePath)) {
            throw new NotFoundException('File not found on server');
        }
        
        const stat = fs.statSync(absolutePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(absolutePath)}"`);
        
        const fileStream = fs.createReadStream(absolutePath);
        fileStream.pipe(res);
    }
}
