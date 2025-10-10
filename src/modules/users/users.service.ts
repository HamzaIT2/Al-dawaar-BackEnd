import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const [users, total] = await this.userRepository.findAndCount({
      where: { isActive: true },
      relations: ['province', 'city'],
      select: {
        userId: true,
        username: true,
        fullName: true,
        fullNameAr: true,
        profileImage: true,
        isVerified: true,
        ratingAverage: true,
        totalSales: true,
        createdAt: true,
        // Exclude sensitive fields
        email: false,
        phoneNumber: false,
        passwordHash: false,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { userId: id, isActive: true },
      relations: ['province', 'city', 'products'],
      select: {
        userId: true,
        username: true,
        fullName: true,
        fullNameAr: true,
        profileImage: true,
        address: true,
        isVerified: true,
        ratingAverage: true,
        totalSales: true,
        createdAt: true,
        // Exclude sensitive fields
        email: false,
        phoneNumber: false,
        passwordHash: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
      relations: ['province', 'city', 'products'],
      select: {
        userId: true,
        username: true,
        fullName: true,
        fullNameAr: true,
        profileImage: true,
        address: true,
        isVerified: true,
        ratingAverage: true,
        totalSales: true,
        createdAt: true,
        // Exclude sensitive fields
        email: false,
        phoneNumber: false,
        passwordHash: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getProfile(userId: number) {
    // Get full profile including sensitive data (for the user themselves)
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['province', 'city'],
      select: {
        userId: true,
        username: true,
        email: true,
        fullName: true,
        fullNameAr: true,
        phoneNumber: true,
        profileImage: true,
        address: true,
        isVerified: true,
        isActive: true,
        ratingAverage: true,
        totalSales: true,
        createdAt: true,
        updatedAt: true,
        // Exclude only password
        passwordHash: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    // Users can only update their own profile
    if (currentUser.userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.userRepository.findOne({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    // Return updated user without sensitive data
    delete user.passwordHash;
    return user;
  }

  async deactivate(id: number, currentUser: User) {
    // Users can only deactivate their own account
    if (currentUser.userId !== id) {
      throw new ForbiddenException('You can only deactivate your own account');
    }

    const user = await this.userRepository.findOne({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    await this.userRepository.save(user);

    return { message: 'Account deactivated successfully' };
  }
}