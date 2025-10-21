import { Controller, Get, Param, Query, Post, Body, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('count/:productId')
  @ApiOperation({ summary: 'Get favorites count for a product' })
  @ApiParam({ name: 'productId', type: Number })
  async count(@Param('productId') productId: string) {
    const count = await this.favoritesService.countByProduct(Number(productId));
    return { count };
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Check if a user favorited a product' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async check(
    @Param('productId') productId: string,
    @Query('userId') userId?: string,
  ) {
    const pid = Number(productId);
    const uid = userId !== undefined ? Number(userId) : NaN;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { favorited: false };
    }
    const favorited = await this.favoritesService.isFavorited(uid, pid);
    return { favorited };
  }

  @Post()
  @ApiOperation({ summary: 'Add product to favorites' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async add(
    @Body('productId') productId: number,
    @Query('userId') userId?: string,
  ) {
    const pid = Number(productId);
    const uid = userId !== undefined ? Number(userId) : NaN;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { created: false };
    }
    return this.favoritesService.addFavorite(uid, pid);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove product from favorites' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async remove(
    @Query('productId') productId: string,
    @Query('userId') userId?: string,
  ) {
    const pid = Number(productId);
    const uid = userId !== undefined ? Number(userId) : NaN;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { removed: false };
    }
    return this.favoritesService.removeFavorite(uid, pid);
  }

  @Delete('product/:productId')
  @ApiOperation({ summary: 'Remove product from favorites by path param' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async removeByProduct(
    @Param('productId') productId: string,
    @Query('userId') userId?: string,
  ) {
    const pid = Number(productId);
    const uid = userId !== undefined ? Number(userId) : NaN;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { removed: false };
    }
    return this.favoritesService.removeFavorite(uid, pid);
  }

  @Get('my-favorites')
  @ApiOperation({ summary: 'Get favorites for current user' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  async myFavorites(@Query('userId') userId?: string) {
    const uid = userId !== undefined ? Number(userId) : NaN;
    if (!Number.isFinite(uid)) {
      return { data: [], total: 0 };
    }
    const list = await this.favoritesService.getUserFavorites(uid);
    return { data: list, total: list.length };
  }
}
