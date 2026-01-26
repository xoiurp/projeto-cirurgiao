import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('courses')
@UseGuards(FirebaseAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Criar novo curso (apenas ADMIN e INSTRUCTOR)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(req.user.userId, createCourseDto);
  }

  /**
   * Listar todos os cursos
   */
  @Get()
  findAll(@Request() req, @Query('includeUnpublished') includeUnpublished?: string) {
    // ADMIN sempre vê todos os cursos (publicados e não publicados)
    // Outros usuários veem apenas publicados
    const showUnpublished = req.user.role === Role.ADMIN;
    return this.coursesService.findAll(showUnpublished);
  }

  /**
   * Listar cursos do instrutor logado
   */
  @Get('my-courses')
  @UseGuards(RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  findMyCourses(@Request() req) {
    return this.coursesService.findByInstructor(req.user.userId);
  }

  /**
   * Buscar curso por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  /**
   * Buscar curso por slug
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  /**
   * Atualizar curso (apenas instrutor do curso ou ADMIN)
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req,
  ) {
    // Verificar se o usuário é o instrutor do curso ou ADMIN
    if (req.user.role !== Role.ADMIN) {
      const isInstructor = await this.coursesService.isInstructor(id, req.user.userId);
      if (!isInstructor) {
        throw new ForbiddenException('Você não tem permissão para editar este curso');
      }
    }

    return this.coursesService.update(id, updateCourseDto);
  }

  /**
   * Deletar curso (apenas instrutor do curso ou ADMIN)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    // Verificar se o usuário é o instrutor do curso ou ADMIN
    if (req.user.role !== Role.ADMIN) {
      const isInstructor = await this.coursesService.isInstructor(id, req.user.userId);
      if (!isInstructor) {
        throw new ForbiddenException('Você não tem permissão para deletar este curso');
      }
    }

    await this.coursesService.remove(id);
    return { message: 'Curso deletado com sucesso' };
  }

  /**
   * Publicar/despublicar curso (apenas instrutor do curso ou ADMIN)
   */
  @Patch(':id/toggle-publish')
  @UseGuards(RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  async togglePublish(@Param('id') id: string, @Request() req) {
    // Verificar se o usuário é o instrutor do curso ou ADMIN
    if (req.user.role !== Role.ADMIN) {
      const isInstructor = await this.coursesService.isInstructor(id, req.user.userId);
      if (!isInstructor) {
        throw new ForbiddenException('Você não tem permissão para publicar/despublicar este curso');
      }
    }

    return this.coursesService.togglePublish(id);
  }
}
