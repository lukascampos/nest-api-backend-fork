import {
  Controller,
  UseGuards,
  Patch,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Roles as PrismaRoles } from '@prisma/client';
import { JwtAuthGuard } from '@/_modules/auth/jwt/jwt-auth.guard';
import { RolesGuard } from '@/_modules/auth/roles/roles.guard';
import { Roles } from '@/_modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/_modules/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/_modules/auth/jwt/jwt.strategy';
import { ModerateArtisanApplicationUseCase } from '@/use-cases/moderate-artisan-application.use-case';
import { ModerateArtisanApplicationDto } from '../dtos/moderate-artisan-application.dto';

@Controller('artisan-applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModerateArtisanApplicationController {
  constructor(
    private moderateArtisanApplicationUseCase: ModerateArtisanApplicationUseCase,
  ) {}

  @Patch(':id/moderate')
  @Roles(PrismaRoles.ADMIN, PrismaRoles.MODERATOR)
  async handle(
    @Param('id') id: string,
    @Body() body: ModerateArtisanApplicationDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const { status, rejectionReason } = body;
    const reviewerId = user.sub;

    const result = await this.moderateArtisanApplicationUseCase.execute({
      applicationId: id,
      status,
      rejectionReason,
      reviewerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return { message: 'Solicitação moderada com sucesso' };
  }
}
