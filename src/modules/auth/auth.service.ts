import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { phoneNumber: registerDto.phone },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Email or phone already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

// Create new user
    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phone,  // Map 'phone' to 'phoneNumber'
      passwordHash: hashedPassword,
      role: 'user'
    });
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: user.userId, email: user.email };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    delete user.passwordHash;

    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.userId, email: user.email };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    delete user.passwordHash;

    return {
      user,
      token,
    };
  }

  async validateUser(userId: number) {
    return await this.userRepository.findOne({
      where: { userId },
    });
  }
}