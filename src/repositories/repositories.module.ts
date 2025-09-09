import { Module } from '@nestjs/common';
import { PrismaService } from '@/_config/database/prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { AttachmentsRepository } from './attachments.repository';
import { ArtisanApplicationsRepository } from './artisan-applications.repository';

@Module({
  providers: [
    PrismaService,
    UsersRepository,
    AttachmentsRepository,
    ArtisanApplicationsRepository,
  ],
  exports: [PrismaService,
    UsersRepository,
    AttachmentsRepository,
    ArtisanApplicationsRepository,
  ],
})
export class RepositoriesModule {}
