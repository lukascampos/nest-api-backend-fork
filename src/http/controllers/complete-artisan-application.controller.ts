import {
  Controller, UseGuards, Post, Param, Body,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from '@/_modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/_modules/auth/jwt/jwt-auth.guard';
import { TokenPayload } from '@/_modules/auth/jwt/jwt.strategy';
import { CompleteArtisanApplicationUseCase } from '@/use-cases/complete-artisan-application.use-case';
import { CompleteArtisanApplicationDto } from '../dtos/complete-artisan-application.dto';
import { ApplicationAlreadySubmittedError } from '@/use-cases/errors/application-already-submitted.error';
import { ApplicationNotFoundError } from '@/use-cases/errors/application-not-found.error';
import { InvalidAttachmentError } from '@/use-cases/errors/invalid-attachment.error';
import { UnauthorizedApplicationAccessError } from '@/use-cases/errors/unauthorized-application-access.error';

@Controller('artisan-applications')
@UseGuards(JwtAuthGuard)
export class CompleteArtisanApplicationController {
  constructor(
    private readonly completeArtisanApplicationUseCase: CompleteArtisanApplicationUseCase,
  ) {}

  @Post(':id/complete')
  async handle(
    @Param('id') applicationId: string,
    @Body() body: CompleteArtisanApplicationDto,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const result = await this.completeArtisanApplicationUseCase.execute({
      userId: currentUser.sub,
      applicationId,
      data: {
        ...body,
        sicabRegistrationDate: new Date(body.sicabRegistrationDate),
        sicabValidUntil: new Date(body.sicabValidUntil),
      },
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ApplicationNotFoundError:
          throw new NotFoundException(error.message);
        case UnauthorizedApplicationAccessError:
          throw new ForbiddenException(error.message);
        case ApplicationAlreadySubmittedError:
          throw new BadRequestException(error.message);
        case InvalidAttachmentError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException('Erro ao completar solicitação');
      }
    }

    return result.value;
  }
}
