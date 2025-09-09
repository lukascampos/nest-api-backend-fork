import {
  Controller, Post, Body, UseGuards,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/_modules/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/_modules/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/_modules/auth/jwt/jwt.strategy';
import { InitiateArtisanApplicationUseCase } from '@/use-cases/initiate-artisan-application.use-case';
import { InitiateArtisanApplicationDto } from '../dtos/initiate-artisan-application-dto';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found.error';
import { PendingApplicationAlreadyExistsError } from '@/use-cases/errors/pendind-application-already-exists.error';
import { UserAlreadyArtisanError } from '@/use-cases/errors/user-already-artisan.error';

@Controller('artisan-applications')
@UseGuards(JwtAuthGuard)
export class InitiateArtisanApplicationController {
  constructor(
    private readonly initiateArtisanApplicationUseCase: InitiateArtisanApplicationUseCase,
  ) {}

  @Post('initiate')
  async handle(
    @Body() body: InitiateArtisanApplicationDto,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const result = await this.initiateArtisanApplicationUseCase.execute({
      userId: currentUser.sub,
      wantsToCompleteNow: body.wantsToCompleteNow,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case PendingApplicationAlreadyExistsError:
          throw new ConflictException(error.message);
        case UserAlreadyArtisanError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
