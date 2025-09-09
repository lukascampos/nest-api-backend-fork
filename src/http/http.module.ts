import { Module } from '@nestjs/common';
import { UseCasesModule } from '@/use-cases/use-cases.module';
import { CreateUserController } from './controllers/create-user.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { SearchUsersController } from './controllers/search-users.controller';
import { InitiateArtisanApplicationController } from './controllers/initiate-artisan-application.controller';
import { CompleteArtisanApplicationController } from './controllers/complete-artisan-application.controller';
import { GetArtisanApplicationDetailsController } from './controllers/get-artisan-application-details.controller';
import { GetAllArtisanApplicationsController } from './controllers/get-all-artisan-applications.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [
    AuthenticateController,
    CompleteArtisanApplicationController,
    CreateUserController,
    GetAllArtisanApplicationsController,
    GetArtisanApplicationDetailsController,
    InitiateArtisanApplicationController,
    SearchUsersController,
  ],
})
export class HttpModule {}
