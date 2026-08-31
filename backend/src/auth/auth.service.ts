import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: any) {
    const { companyName, name, email, phone, password, industry, country } = data;

    // Check if user/company already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Company and User in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const company = await prisma.company.create({
        data: {
          name: companyName,
          email: email, // Company contact email
          phone: phone,
          industry: industry,
          country: country,
        },
      });

      const user = await prisma.user.create({
        data: {
          companyId: company.id,
          name: name,
          email: email,
          phone: phone,
          passwordHash: hashedPassword,
          role: 'OWNER',
        },
      });

      return { company, user };
    });

    // Generate JWT token
    const payload = { sub: result.user.id, email: result.user.email, role: result.user.role, companyId: result.company.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        companyId: result.company.id
      }
    };
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, companyId: user.companyId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      }
    };
  }
}
