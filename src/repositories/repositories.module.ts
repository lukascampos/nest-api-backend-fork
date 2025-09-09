import { Module } from '@nestjs/common';
import { PrismaService } from '@/_config/database/prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { AttachmentsRepository } from './attachments.repository';

@Module({
  providers: [PrismaService, UsersRepository, AttachmentsRepository],
  exports: [PrismaService, UsersRepository, AttachmentsRepository],
})
export class RepositoriesModule {}
