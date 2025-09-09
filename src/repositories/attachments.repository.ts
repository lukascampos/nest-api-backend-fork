import { Injectable } from '@nestjs/common';
import { Attachment } from '@prisma/client';
import { PrismaService } from '@/_config/database/prisma/prisma.service';

export interface CreateAttachmentData {
  userId?: string | null;
  artisanApplicationId?: string | null;
  fileType: string;
  fileSize: bigint;
}

@Injectable()
export class AttachmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAttachmentData): Promise<Attachment> {
    return this.prisma.attachment.create({
      data: {
        userId: data.userId,
        artisanApplicationId: data.artisanApplicationId,
        fileType: data.fileType,
        fileSize: data.fileSize,
      },
    });
  }

  async findById(id: string): Promise<Attachment | null> {
    return this.prisma.attachment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        artisanApplication: {
          select: {
            id: true,
            status: true,
            formStatus: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByArtisanApplicationId(artisanApplicationId: string): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({
      where: { artisanApplicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Novo método para vincular attachments à aplicação
  async linkToArtisanApplication(
    attachmentIds: string[],
    artisanApplicationId: string,
  ): Promise<void> {
    await this.prisma.attachment.updateMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        artisanApplicationId,
      },
    });
  }

  // ✅ Método para desvincular attachments (útil para cancelamentos)
  async unlinkFromArtisanApplication(attachmentIds: string[]): Promise<void> {
    await this.prisma.attachment.updateMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        artisanApplicationId: null,
      },
    });
  }

  // ✅ Buscar attachments órfãos (sem aplicação, para limpeza)
  async findOrphanAttachmentsByUser(userId: string): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({
      where: {
        userId,
        artisanApplicationId: null,
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Mais de 24h
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
