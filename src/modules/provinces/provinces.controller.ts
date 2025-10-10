import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProvincesService } from './provinces.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';


@ApiTags('Provinces & Cities')
@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  // Province endpoints
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new province (for seeding data - requires authentication)' })
  @ApiResponse({ status: 201, description: 'Province successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createProvince(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provincesService.createProvince(createProvinceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Iraqi provinces (18 governorates)' })
  @ApiResponse({ status: 200, description: 'Provinces retrieved successfully' })
  findAllProvinces() {
    return this.provincesService.findAllProvinces();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single province by ID with its cities' })
  @ApiResponse({ status: 200, description: 'Province found' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  findOneProvince(@Param('id') id: number) {
    return this.provincesService.findOneProvince(id);
  }

  @Get(':id/cities')
  @ApiOperation({ summary: 'Get all cities in a specific province' })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  findCitiesByProvince(@Param('id') id: number) {
    return this.provincesService.findCitiesByProvince(id);
  }

  // City endpoints
  @Post('cities')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new city (for seeding data - requires authentication)' })
  @ApiResponse({ status: 201, description: 'City successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.provincesService.createCity(createCityDto);
  }

  @Get('cities/all')
  @ApiOperation({ summary: 'Get all cities in Iraq' })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  findAllCities() {
    return this.provincesService.findAllCities();
  }
}