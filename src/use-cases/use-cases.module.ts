import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { AuthenticateUseCase } from './authenticate.use-case';
import { SearchUsersUseCase } from './search-users.use-case';
import { InitiateArtisanApplicationUseCase } from './initiate-artisan-application.use-case';
import { CompleteArtisanApplicationUseCase } from './complete-artisan-application.use-case';

@Module({
  imports: [RepositoriesModule],
  providers: [
    AuthenticateUseCase,
    CompleteArtisanApplicationUseCase,
    CreateUserUseCase,
    InitiateArtisanApplicationUseCase,
    SearchUsersUseCase,
  ],
  exports: [
    AuthenticateUseCase,
    CompleteArtisanApplicationUseCase,
    CreateUserUseCase,
    InitiateArtisanApplicationUseCase,
    SearchUsersUseCase,
  ],
})
export class UseCasesModule {}
