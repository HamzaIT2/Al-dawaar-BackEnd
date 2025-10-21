import { Controller, Post, Param, UseInterceptors, UploadedFiles, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Upload images for a product' })
  uploadProductImages(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.imagesService.uploadForProduct(productId, images);
  }
}
