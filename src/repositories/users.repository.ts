import { Injectable } from '@nestjs/common';
import { User, Roles } from '@prisma/client';
import { PrismaService } from '@/_config/database/prisma/prisma.service';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  socialName?: string;
  phone: string;
  cpf?: string;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        profile: {
          cpf,
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        profile: {
          phone,
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async save(data: CreateUserData): Promise<User> {
    const { phone, cpf, ...userData } = data;

    return this.prisma.user.upsert({
      where: { email: data.email },
      create: {
        ...userData,
        roles: [Roles.USER],
        profile: {
          create: {
            phone,
            cpf,
          },
        },
      },
      update: {
        ...userData,
        profile: {
          upsert: {
            create: {
              phone,
              cpf,
            },
            update: {
              phone,
              cpf,
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }
}
