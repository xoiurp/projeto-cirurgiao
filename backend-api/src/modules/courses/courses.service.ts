import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from '@prisma/client';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Criar um novo curso
   */
  async create(instructorId: string, createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      // Gerar slug a partir do título
      const slug = this.generateSlug(createCourseDto.title);

      // Verificar se o slug já existe
      const existingCourse = await this.prisma.course.findUnique({
        where: { slug },
      });

      if (existingCourse) {
        throw new BadRequestException('Um curso com este título já existe');
      }

      const course = await this.prisma.course.create({
        data: {
          title: createCourseDto.title,
          description: createCourseDto.description,
          thumbnail: createCourseDto.thumbnail,
          price: createCourseDto.price,
          isPublished: createCourseDto.isPublished,
          slug,
          instructor: {
            connect: { id: instructorId },
          },
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          modules: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      this.logger.log(`Course created: ${course.id}`);

      return course;
    } catch (error) {
      this.logger.error('Error creating course', error);
      throw error;
    }
  }

  /**
   * Listar todos os cursos
   */
  async findAll(includeUnpublished = false): Promise<Course[]> {
    const where = includeUnpublished ? {} : { isPublished: true };

    return this.prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
          include: {
            videos: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Listar cursos de um instrutor específico
   */
  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        instructorId,
      },
      include: {
        modules: {
          orderBy: {
            order: 'asc',
          },
          include: {
            videos: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Buscar curso por ID
   */
  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
          include: {
            videos: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  /**
   * Buscar curso por slug
   */
  async findBySlug(slug: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
          include: {
            videos: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  /**
   * Atualizar curso
   */
  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Verificar se o curso existe
    await this.findOne(id);

    try {
      // Se o título foi alterado, gerar novo slug
      let slug: string | undefined;
      if (updateCourseDto.title) {
        slug = this.generateSlug(updateCourseDto.title);

        // Verificar se o novo slug já existe (exceto para o curso atual)
        const existingCourse = await this.prisma.course.findFirst({
          where: {
            slug,
            NOT: {
              id,
            },
          },
        });

        if (existingCourse) {
          throw new BadRequestException('Um curso com este título já existe');
        }
      }

      const course = await this.prisma.course.update({
        where: { id },
        data: {
          ...updateCourseDto,
          ...(slug && { slug }),
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          modules: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      this.logger.log(`Course updated: ${course.id}`);

      return course;
    } catch (error) {
      this.logger.error(`Error updating course ${id}`, error);
      throw error;
    }
  }

  /**
   * Deletar curso
   */
  async remove(id: string): Promise<void> {
    // Verificar se o curso existe
    await this.findOne(id);

    try {
      await this.prisma.course.delete({
        where: { id },
      });

      this.logger.log(`Course deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting course ${id}`, error);
      throw new BadRequestException('Erro ao deletar curso');
    }
  }

  /**
   * Publicar/despublicar curso
   */
  async togglePublish(id: string): Promise<Course> {
    const course = await this.findOne(id);

    return this.prisma.course.update({
      where: { id },
      data: {
        isPublished: !course.isPublished,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  /**
   * Gerar slug a partir do título
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  }

  /**
   * Verificar se usuário é instrutor do curso
   */
  async isInstructor(courseId: string, userId: string): Promise<boolean> {
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    return !!course;
  }
}
