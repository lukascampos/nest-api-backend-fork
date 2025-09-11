import { Module } from '@nestjs/common';
import { PrismaService } from '@/_config/database/prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { AttachmentsRepository } from './attachments.repository';
import { ArtisanApplicationsRepository } from './artisan-applications.repository';
import { ArtisanProfilesRepository } from './artisan-profiles.repository';

@Module({
  providers: [
    PrismaService,
    UsersRepository,
    AttachmentsRepository,
    ArtisanApplicationsRepository,
    ArtisanProfilesRepository,
  ],
  exports: [PrismaService,
    UsersRepository,
    AttachmentsRepository,
    ArtisanApplicationsRepository,
    ArtisanProfilesRepository,
  ],
})
export class RepositoriesModule {}
