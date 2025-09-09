import { Injectable } from '@nestjs/common';
import {
  ArtisanApplication, FormStatus, ApplicationType, RequestStatus,
} from '@prisma/client';
import { PrismaService } from '@/_config/database/prisma/prisma.service';

export interface CreateArtisanApplicationData {
  userId: string;
  formStatus: FormStatus;
  type: ApplicationType;
  rawMaterial: string[];
  technique: string[];
  finalityClassification: string[];
  bio?: string;
  sicab?: string;
  sicabRegistrationDate?: Date;
  sicabValidUntil?: Date;
}

export interface UpdateArtisanApplicationData {
  formStatus?: FormStatus;
  rawMaterial?: string[];
  technique?: string[];
  finalityClassification?: string[];
  bio?: string;
  sicab?: string;
  sicabRegistrationDate?: Date;
  sicabValidUntil?: Date;
  updatedAt?: Date;
}

@Injectable()
export class ArtisanApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArtisanApplicationData): Promise<ArtisanApplication> {
    return this.prisma.artisanApplication.create({
      data,
      include: {
        userRequesting: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<ArtisanApplication | null> {
    return this.prisma.artisanApplication.findUnique({
      where: { id },
      include: {
        userRequesting: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Attachment: true,
      },
    });
  }

  async findPendingByUserId(userId: string): Promise<ArtisanApplication | null> {
    return this.prisma.artisanApplication.findFirst({
      where: {
        userId,
        status: RequestStatus.PENDING,
      },
    });
  }

  async findByUserId(userId: string): Promise<ArtisanApplication[]> {
    return this.prisma.artisanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        Attachment: true,
      },
    });
  }

  async findPostponedByUserId(userId: string): Promise<ArtisanApplication | null> {
    return this.prisma.artisanApplication.findFirst({
      where: {
        userId,
        formStatus: FormStatus.POSTPONED,
        status: RequestStatus.PENDING,
      },
    });
  }

  async update(id: string, data: UpdateArtisanApplicationData): Promise<ArtisanApplication> {
    return this.prisma.artisanApplication.update({
      where: { id },
      data,
      include: {
        userRequesting: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findPendingApplications(): Promise<ArtisanApplication[]> {
    return this.prisma.artisanApplication.findMany({
      where: {
        status: RequestStatus.PENDING,
        formStatus: FormStatus.SUBMITTED,
      },
      include: {
        userRequesting: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Attachment: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
