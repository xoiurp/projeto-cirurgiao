import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';

@Controller()
@UseGuards(FirebaseAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Criar uma nova nota para um vídeo
   * POST /videos/:videoId/notes
   */
  @Post('videos/:videoId/notes')
  async create(
    @Param('videoId') videoId: string,
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.notesService.create(videoId, userId, createNoteDto);
  }

  /**
   * Listar notas do usuário para um vídeo
   * GET /videos/:videoId/notes
   */
  @Get('videos/:videoId/notes')
  async findByVideo(
    @Param('videoId') videoId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.notesService.findByVideo(videoId, userId);
  }

  /**
   * Contar notas do usuário para um vídeo
   * GET /videos/:videoId/notes/count
   */
  @Get('videos/:videoId/notes/count')
  async countByVideo(
    @Param('videoId') videoId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.notesService.countByVideo(videoId, userId);
  }

  /**
   * Listar todas as notas do usuário
   * GET /notes
   */
  @Get('notes')
  async findAllByUser(
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.id;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.notesService.findAllByUser(userId, limitNumber);
  }

  /**
   * Buscar uma nota específica
   * GET /notes/:noteId
   */
  @Get('notes/:noteId')
  async findOne(
    @Param('noteId') noteId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.notesService.findOne(noteId, userId);
  }

  /**
   * Atualizar uma nota
   * PUT /notes/:noteId
   */
  @Put('notes/:noteId')
  async update(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.notesService.update(noteId, userId, updateNoteDto);
  }

  /**
   * Excluir uma nota
   * DELETE /notes/:noteId
   */
  @Delete('notes/:noteId')
  async delete(
    @Param('noteId') noteId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.notesService.delete(noteId, userId);
  }
}
