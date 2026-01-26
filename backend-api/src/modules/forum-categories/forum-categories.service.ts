import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ForumCategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova categoria
   */
  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.forumCategory.create({
      data: createCategoryDto,
    });
  }

  /**
   * Listar todas as categorias
   */
  async findAll() {
    return this.prisma.forumCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { topics: true },
        },
      },
    });
  }

  /**
   * Buscar categoria por ID
   */
  async findOne(id: string) {
    const category = await this.prisma.forumCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { topics: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  /**
   * Atualizar categoria
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.forumCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * Deletar categoria
   */
  async remove(id: string) {
    await this.findOne(id); // Verifica se existe

    // Verifica se há tópicos na categoria
    const topicsCount = await this.prisma.forumTopic.count({
      where: { categoryId: id },
    });

    if (topicsCount > 0) {
      throw new Error(
        'Não é possível deletar uma categoria que contém tópicos',
      );
    }

    return this.prisma.forumCategory.delete({
      where: { id },
    });
  }
}
