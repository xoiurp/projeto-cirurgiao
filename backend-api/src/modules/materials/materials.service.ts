import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(videoId: string, createMaterialDto: CreateMaterialDto) {
    // Verificar se o vídeo existe
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    // Obter a maior ordem atual
    const maxOrder = await this.prisma.videoMaterial.aggregate({
      where: { videoId },
      _max: { order: true },
    });

    const newOrder = (maxOrder._max.order || 0) + 1;

    return this.prisma.videoMaterial.create({
      data: {
        ...createMaterialDto,
        videoId,
        order: createMaterialDto.order ?? newOrder,
      },
    });
  }

  async findAllByVideo(videoId: string) {
    return this.prisma.videoMaterial.findMany({
      where: { videoId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const material = await this.prisma.videoMaterial.findUnique({
      where: { id },
      include: {
        video: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    const material = await this.prisma.videoMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    return this.prisma.videoMaterial.update({
      where: { id },
      data: updateMaterialDto,
    });
  }

  async remove(id: string) {
    const material = await this.prisma.videoMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    await this.prisma.videoMaterial.delete({
      where: { id },
    });

    return { message: 'Material removido com sucesso' };
  }

  async reorder(videoId: string, materialIds: string[]) {
    // Atualizar a ordem de cada material
    const updates = materialIds.map((id, index) =>
      this.prisma.videoMaterial.update({
        where: { id },
        data: { order: index + 1 },
      })
    );

    await this.prisma.$transaction(updates);

    return this.findAllByVideo(videoId);
  }
}
