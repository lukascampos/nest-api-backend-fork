import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { AuthenticateUseCase } from './authenticate.use-case';
import { SearchUsersUseCase } from './search-users.use-case';
import { InitiateArtisanApplicationUseCase } from './initiate-artisan-application.use-case';
import { CompleteArtisanApplicationUseCase } from './complete-artisan-application.use-case';
import { GetArtisanApplicationDetailsUseCase } from './get-artisan-application-details.use-case';
import { AttachmentsModule } from '@/_modules/attachments/attachments.module';

@Module({
  imports: [RepositoriesModule, AttachmentsModule],
  providers: [
    AuthenticateUseCase,
    CompleteArtisanApplicationUseCase,
    CreateUserUseCase,
    GetArtisanApplicationDetailsUseCase,
    InitiateArtisanApplicationUseCase,
    SearchUsersUseCase,
  ],
  exports: [
    AuthenticateUseCase,
    CompleteArtisanApplicationUseCase,
    CreateUserUseCase,
    GetArtisanApplicationDetailsUseCase,
    InitiateArtisanApplicationUseCase,
    SearchUsersUseCase,
  ],
})
export class UseCasesModule {}
