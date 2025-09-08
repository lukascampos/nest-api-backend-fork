import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { AuthenticateUseCase } from './authenticate.use-case';

@Module({
  imports: [RepositoriesModule],
  providers: [
    AuthenticateUseCase,
    CreateUserUseCase,
  ],
  exports: [
    AuthenticateUseCase,
    CreateUserUseCase,
  ],
})
export class UseCasesModule {}
