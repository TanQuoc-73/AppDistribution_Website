import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards.js';
import { ProductsService } from './products.service.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all products (with optional search/filter/sort)' })
    findAll(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('sort') sort?: string,
    ) {
        return this.productsService.findAll({ search, category, sort });
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

    @Get('category/:slug')
    @ApiOperation({ summary: 'Get products by category slug' })
    getByCategory(@Param('slug') slug: string) {
        return this.productsService.getByCategory(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findById(id);
    }

    @Get(':id/versions')
    @ApiOperation({ summary: 'Get product versions' })
    getVersions(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.getVersions(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create product (admin/developer)' })
    create(@Body() body: {
        name: string;
        description: string;
        price: number;
        image?: string;
        screenshots?: string[];
        categoryId: number;
        developerId: number;
    }) {
        return this.productsService.create(body);
    }

    @Post(':id/versions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create product version (admin/developer)' })
    createVersion(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { version: string; downloadUrl: string; fileSize?: number; changelog?: string },
    ) {
        return this.productsService.createVersion(id, body);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DEVELOPER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product (admin/developer)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.productsService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product (admin)' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.delete(id);
    }
}
