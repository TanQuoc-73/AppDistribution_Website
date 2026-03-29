import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductVersionsService } from './product-versions.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin-product-versions')
@Controller('admin/products/:productId/versions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'developer')
@ApiBearerAuth()
export class AdminProductVersionsController {
  constructor(private readonly versionsService: ProductVersionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all versions for a product' })
  list(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.versionsService.listByProduct(productId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new version for a product' })
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateVersionDto,
  ) {
    return this.versionsService.create(productId, dto);
  }
}

@ApiTags('admin-product-versions')
@Controller('admin/versions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'developer')
@ApiBearerAuth()
export class AdminVersionsController {
  constructor(private readonly versionsService: ProductVersionsService) {}

  @Patch(':versionId')
  @ApiOperation({ summary: 'Update a product version' })
  update(
    @Param('versionId', ParseUUIDPipe) versionId: string,
    @Body() dto: UpdateVersionDto,
  ) {
    return this.versionsService.update(versionId, dto);
  }

  @Delete(':versionId')
  @ApiOperation({ summary: 'Delete a product version' })
  remove(@Param('versionId', ParseUUIDPipe) versionId: string) {
    return this.versionsService.remove(versionId);
  }

  @Post(':versionId/set-latest')
  @ApiOperation({ summary: 'Set a version as latest' })
  setLatest(@Param('versionId', ParseUUIDPipe) versionId: string) {
    return this.versionsService.setLatest(versionId);
  }
}
