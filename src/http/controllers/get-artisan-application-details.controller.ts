import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Roles as PrismaRoles } from '@prisma/client';
import { JwtAuthGuard } from '@/_modules/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/_modules/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/_modules/auth/jwt/jwt.strategy';
import { GetArtisanApplicationDetailsUseCase } from '@/use-cases/get-artisan-application-details.use-case';
import { Roles } from '@/_modules/auth/decorators/roles.decorator';
import { ApplicationNotFoundError } from '@/use-cases/errors/application-not-found.error';

@Controller('artisan-applications')
@UseGuards(JwtAuthGuard)
export class GetArtisanApplicationDetailsController {
  constructor(
    private readonly getArtisanApplicationDetailsUseCase: GetArtisanApplicationDetailsUseCase,
  ) {}

  @Get(':id')
  @Roles(PrismaRoles.MODERATOR)
  async handleOwn(
    @Param('id') applicationId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const result = await this.getArtisanApplicationDetailsUseCase.execute({
      applicationId,
      userId: currentUser.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ApplicationNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
