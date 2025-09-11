import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { AuthenticateUseCase } from './authenticate.use-case';
import { SearchUsersUseCase } from './search-users.use-case';
import { InitiateArtisanApplicationUseCase } from './initiate-artisan-application.use-case';
import { CompleteArtisanApplicationUseCase } from './complete-artisan-application.use-case';
import { GetArtisanApplicationDetailsUseCase } from './get-artisan-application-details.use-case';
import { AttachmentsModule } from '@/_modules/attachments/attachments.module';
import { GetAllArtisanApplicationsUseCase } from './get-all-artisan-applications.use-case';
import { ModerateArtisanApplicationUseCase } from './moderate-artisan-application.use-case';

@Module({
  imports: [RepositoriesModule, AttachmentsModule],
  providers: [
    AuthenticateUseCase,
    CompleteArtisanApplicationUseCase,
    CreateUserUseCase,
    GetAllArtisanApplicationsUseCase,
    GetArtisanApplicationDetailsUseCase,
    InitiateArtisanApplicationUseCase,
    ModerateArtisanApplicationUseCase,
    SearchUsersUseCase,
  ],
  exports: [
    AuthenticateUseCase,
    CompleteArtisanApplicationUseCase,
    CreateUserUseCase,
    GetAllArtisanApplicationsUseCase,
    GetArtisanApplicationDetailsUseCase,
    InitiateArtisanApplicationUseCase,
    ModerateArtisanApplicationUseCase,
    SearchUsersUseCase,
  ],
})
export class UseCasesModule {}
