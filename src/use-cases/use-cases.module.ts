import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { RepositoriesModule } from '@/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [
    CreateUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
  ],
})
export class UseCasesModule {}
