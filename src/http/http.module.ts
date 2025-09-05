import { Module } from '@nestjs/common';
import { UseCasesModule } from '@/use-cases/use-cases.module';
import { CreateUserController } from './controllers/create-user.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [
    CreateUserController,
  ],
})
export class HttpModule {}
