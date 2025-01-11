import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        username: true,
        email: true,
        occupation: true,
        createdAt: true,
        whyStatements: true,
        savedQuotes: true,
        favoritePersonalities: true,
        fistBumps: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { tempCodes: true },
    });
  }

  async createUser(user: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.prisma.user.update({
      where: { userId: id },
      data: user,
    });
  }
}
