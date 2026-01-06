import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
import { Module } from '@prisma/client';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar um novo módulo
   */
  async create(courseId: string, createModuleDto: CreateModuleDto): Promise<Module> {
    try {
      // Verificar se o curso existe
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new NotFoundException('Curso não encontrado');
      }

      // Verificar se já existe um módulo com a mesma ordem
      const existingModule = await this.prisma.module.findFirst({
        where: {
          courseId,
          order: createModuleDto.order,
        },
      });

      if (existingModule) {
        throw new BadRequestException('Já existe um módulo com esta ordem neste curso');
      }

      const module = await this.prisma.module.create({
        data: {
          ...createModuleDto,
          courseId,
        },
        include: {
          videos: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      this.logger.log(`Module created: ${module.id} for course ${courseId}`);

      return module;
    } catch (error) {
      this.logger.error('Error creating module', error);
      throw error;
    }
  }

  /**
   * Listar todos os módulos de um curso
   */
  async findAll(courseId: string): Promise<Module[]> {
    // Verificar se o curso existe
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return this.prisma.module.findMany({
      where: {
        courseId,
      },
      include: {
        videos: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            videos: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  /**
   * Buscar módulo por ID
   */
  async findOne(id: string): Promise<Module> {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        videos: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado');
    }

    return module;
  }

  /**
   * Atualizar módulo
   */
  async update(id: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    // Verificar se o módulo existe
    const existingModule = await this.findOne(id);

    try {
      // Se a ordem foi alterada, verificar se não conflita com outro módulo
      if (updateModuleDto.order !== undefined && updateModuleDto.order !== existingModule.order) {
        const conflictingModule = await this.prisma.module.findFirst({
          where: {
            courseId: existingModule.courseId,
            order: updateModuleDto.order,
            NOT: {
              id,
            },
          },
        });

        if (conflictingModule) {
          throw new BadRequestException('Já existe um módulo com esta ordem neste curso');
        }
      }

      const module = await this.prisma.module.update({
        where: { id },
        data: updateModuleDto,
        include: {
          videos: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      this.logger.log(`Module updated: ${module.id}`);

      return module;
    } catch (error) {
      this.logger.error(`Error updating module ${id}`, error);
      throw error;
    }
  }

  /**
   * Deletar módulo
   */
  async remove(id: string): Promise<void> {
    // Verificar se o módulo existe
    await this.findOne(id);

    try {
      await this.prisma.module.delete({
        where: { id },
      });

      this.logger.log(`Module deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting module ${id}`, error);
      throw new BadRequestException('Erro ao deletar módulo');
    }
  }

  /**
   * Reordenar módulos de um curso
   */
  async reorder(courseId: string, reorderDto: ReorderModulesDto): Promise<Module[]> {
    // Verificar se o curso existe
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    try {
      // Atualizar a ordem de cada módulo
      await Promise.all(
        reorderDto.modules.map((item) =>
          this.prisma.module.update({
            where: { id: item.id },
            data: { order: item.order },
          }),
        ),
      );

      this.logger.log(`Modules reordered for course ${courseId}`);

      // Retornar os módulos atualizados
      return this.findAll(courseId);
    } catch (error) {
      this.logger.error(`Error reordering modules for course ${courseId}`, error);
      throw new BadRequestException('Erro ao reordenar módulos');
    }
  }

  /**
   * Verificar se módulo pertence a um curso específico
   */
  async belongsToCourse(moduleId: string, courseId: string): Promise<boolean> {
    const module = await this.prisma.module.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
    });

    return !!module;
  }

  /**
   * Obter próximo número de ordem disponível para um curso
   */
  async getNextOrder(courseId: string): Promise<number> {
    const lastModule = await this.prisma.module.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
    });

    return lastModule ? lastModule.order + 1 : 0;
  }
}
