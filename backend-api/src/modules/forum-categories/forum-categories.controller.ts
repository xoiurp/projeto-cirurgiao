import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ForumCategoriesService } from './forum-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('forum-categories')
@UseGuards(FirebaseAuthGuard)
export class ForumCategoriesController {
  constructor(
    private readonly forumCategoriesService: ForumCategoriesService,
  ) {}

  /**
   * Criar nova categoria (apenas ADMIN)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.forumCategoriesService.create(createCategoryDto);
  }

  /**
   * Listar todas as categorias (público)
   */
  @Get()
  findAll() {
    return this.forumCategoriesService.findAll();
  }

  /**
   * Buscar categoria por ID (público)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumCategoriesService.findOne(id);
  }

  /**
   * Atualizar categoria (apenas ADMIN)
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.forumCategoriesService.update(id, updateCategoryDto);
  }

  /**
   * Deletar categoria (apenas ADMIN)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.forumCategoriesService.remove(id);
  }
}
