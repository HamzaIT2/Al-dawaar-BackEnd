import { Controller, Get, Param, Query, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get('count/:productId')
  @ApiOperation({ summary: 'Get favorites count for a product' })
  @ApiParam({ name: 'productId', type: Number })
  async count(@Param('productId') productId: string) {
    const count = await this.favoritesService.countByProduct(Number(productId));
    return { count };
  }

  @Get('check/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check if the current user favorited a product' })
  @ApiParam({ name: 'productId', type: Number })
  async check(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    const pid = Number(productId);
    const uid = user?.userId;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { favorited: false };
    }
    const favorited = await this.favoritesService.isFavorited(uid, pid);
    return { favorited };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add product to favorites for current user' })
  async add(
    @Body('productId') productId: number,
    @CurrentUser() user: User,
  ) {
    const pid = Number(productId);
    const uid = user?.userId;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { created: false };
    }
    return this.favoritesService.addFavorite(uid, pid);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove product from favorites for current user' })
  async remove(
    @Query('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    const pid = Number(productId);
    const uid = user?.userId;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { removed: false };
    }
    return this.favoritesService.removeFavorite(uid, pid);
  }

  @Delete('product/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove product from favorites by path param for current user' })
  @ApiParam({ name: 'productId', type: Number })
  async removeByProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    const pid = Number(productId);
    const uid = user?.userId;
    if (!Number.isFinite(pid) || !Number.isFinite(uid)) {
      return { removed: false };
    }
    return this.favoritesService.removeFavorite(uid, pid);
  }

  @Get('my-favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get favorites for current authenticated user' })
  async myFavorites(@CurrentUser() user: User) {
    const uid = user?.userId;
    if (!Number.isFinite(uid)) {
      return { data: [], total: 0 };
    }
    const list = await this.favoritesService.getUserFavorites(uid);
    // map Favorite records to their Product relation so client gets products array
    const products = list.map((fav) => fav.product).filter((p) => !!p);
    return { data: products, total: products.length };
  }
}
