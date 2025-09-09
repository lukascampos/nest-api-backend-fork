import { ApplicationType, RequestStatus, FormStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsOptional, IsEnum, IsInt, Min, IsString,
} from 'class-validator';

export class GetAllArtisanApplicationsQueryDto {
  @IsOptional()
  @IsEnum(ApplicationType)
    type?: ApplicationType;

  @IsOptional()
  @IsEnum(RequestStatus)
    status?: RequestStatus;

  @IsOptional()
  @IsEnum(FormStatus)
    formStatus?: FormStatus;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
    page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
    limit?: number;

  @IsOptional()
  @IsString()
    search?: string;
}
