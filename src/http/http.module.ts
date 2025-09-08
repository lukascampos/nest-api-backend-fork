import { Module } from '@nestjs/common';
import { UseCasesModule } from '@/use-cases/use-cases.module';
import { CreateUserController } from './controllers/create-user.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { SearchUsersController } from './controllers/search-users.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [
    AuthenticateController,
    CreateUserController,
    SearchUsersController,
  ],
})
export class HttpModule {}
