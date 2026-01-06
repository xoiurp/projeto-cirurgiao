import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { SaveProgressDto } from './dto/save-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * POST /api/v1/progress
   * Salvar progresso de um vídeo
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async saveProgress(
    @GetUser('userId') userId: string,
    @Body() saveProgressDto: SaveProgressDto,
  ) {
    return this.progressService.saveProgress(userId, saveProgressDto);
  }

  /**
   * GET /api/v1/progress/video/:videoId
   * Buscar progresso de um vídeo específico
   */
  @Get('video/:videoId')
  async getVideoProgress(
    @GetUser('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    const progress = await this.progressService.getVideoProgress(userId, videoId);
    return progress || { watched: false, completed: false, watchTime: 0 };
  }

  /**
   * GET /api/v1/progress/course/:courseId
   * Buscar progresso de todos os vídeos de um curso
   */
  @Get('course/:courseId')
  async getCourseProgress(
    @GetUser('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getCourseProgress(userId, courseId);
  }

  /**
   * POST /api/v1/progress/video/:videoId/complete
   * Marcar vídeo como completo
   */
  @Post('video/:videoId/complete')
  @HttpCode(HttpStatus.OK)
  async markAsCompleted(
    @GetUser('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.progressService.markAsCompleted(userId, videoId);
  }

  /**
   * POST /api/v1/progress/video/:videoId/incomplete
   * Marcar vídeo como não completo
   */
  @Post('video/:videoId/incomplete')
  @HttpCode(HttpStatus.OK)
  async markAsIncomplete(
    @GetUser('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.progressService.markAsIncomplete(userId, videoId);
  }

  /**
   * GET /api/v1/progress/summary
   * Obter resumo de progresso do usuário em todos os cursos
   */
  @Get('summary')
  async getUserProgressSummary(@GetUser('userId') userId: string) {
    return this.progressService.getUserProgressSummary(userId);
  }

  /**
   * GET /api/v1/progress/enrolled-courses
   * Buscar cursos em que o usuário está matriculado
   */
  @Get('enrolled-courses')
  async getEnrolledCourses(@GetUser('userId') userId: string) {
    return this.progressService.getEnrolledCourses(userId);
  }
}
