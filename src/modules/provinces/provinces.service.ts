import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { CreateProvinceDto } from './dto/create-province.dto';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  // Province methods
  async createProvince(createProvinceDto: CreateProvinceDto) {
    const province = this.provinceRepository.create(createProvinceDto);
    return await this.provinceRepository.save(province);
  }

  async findAllProvinces() {
    return await this.provinceRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOneProvince(id: number) {
    const province = await this.provinceRepository.findOne({
      where: { provinceId: id },
      relations: ['cities'],
    });

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    return province;
  }

  // City methods
  async createCity(createCityDto: CreateCityDto) {
    // Verify province exists
    const province = await this.provinceRepository.findOne({
      where: { provinceId: createCityDto.provinceId },
    });

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    const city = this.cityRepository.create(createCityDto);
    return await this.cityRepository.save(city);
  }

  async findCitiesByProvince(provinceId: number) {
    // Verify province exists
    const province = await this.provinceRepository.findOne({
      where: { provinceId },
    });

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    return await this.cityRepository.find({
      where: { provinceId },
      order: { name: 'ASC' },
    });
  }

  async findAllCities() {
    return await this.cityRepository.find({
      relations: ['province'],
      order: { name: 'ASC' },
    });
  }

  async findOneCity(id: number) {
    const city = await this.cityRepository.findOne({
      where: { cityId: id },
      relations: ['province'],
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }
}