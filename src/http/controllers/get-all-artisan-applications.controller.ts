import {
  Controller, UseGuards, Get, Query, BadRequestException,
} from '@nestjs/common';
import { Roles as PrismaRoles } from '@prisma/client';
import { JwtAuthGuard } from '@/_modules/auth/jwt/jwt-auth.guard';
import { RolesGuard } from '@/_modules/auth/roles/roles.guard';
import { GetAllArtisanApplicationsQueryDto } from '../dtos/get-all-artisan-applications.dto';
import { Roles } from '@/_modules/auth/decorators/roles.decorator';
import { GetAllArtisanApplicationsUseCase } from '@/use-cases/get-all-artisan-applications';

@Controller('artisan-applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetAllArtisanApplicationsController {
  constructor(
    private getAllArtisanApplicationsUseCase: GetAllArtisanApplicationsUseCase,
  ) {}

  @Get()
  @Roles(PrismaRoles.ADMIN, PrismaRoles.MODERATOR)
  async handle(@Query() query: GetAllArtisanApplicationsQueryDto) {
    const {
      type, status, formStatus, search,
    } = query;

    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const result = await this.getAllArtisanApplicationsUseCase.execute({
      type,
      status,
      formStatus,
      page,
      limit,
      search,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }
}
