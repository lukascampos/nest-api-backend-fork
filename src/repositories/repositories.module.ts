import { Module } from '@nestjs/common';
import { PrismaService } from '@/_config/database/prisma/prisma.service';
import { UsersRepository } from './users.repository';

@Module({
  providers: [PrismaService, UsersRepository],
  exports: [PrismaService, UsersRepository],
})
export class RepositoriesModule {}
