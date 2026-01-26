import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService, LikeStatus } from './likes.service';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';

@Controller('videos')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  /**
   * GET /videos/:videoId/likes
   * Obter status de likes de um vídeo
   */
  @Get(':videoId/likes')
  @UseGuards(FirebaseAuthGuard)
  async getLikeStatus(
    @Param('videoId') videoId: string,
    @Request() req: any,
  ): Promise<LikeStatus> {
    const userId = req.user?.id;
    return this.likesService.getLikeStatus(videoId, userId);
  }

  /**
   * POST /videos/:videoId/like
   * Curtir um vídeo
   */
  @Post(':videoId/like')
  @UseGuards(FirebaseAuthGuard)
  async likeVideo(
    @Param('videoId') videoId: string,
    @Request() req: any,
  ): Promise<LikeStatus> {
    const userId = req.user.id;
    return this.likesService.likeVideo(videoId, userId);
  }

  /**
   * DELETE /videos/:videoId/like
   * Descurtir um vídeo
   */
  @Delete(':videoId/like')
  @UseGuards(FirebaseAuthGuard)
  async unlikeVideo(
    @Param('videoId') videoId: string,
    @Request() req: any,
  ): Promise<LikeStatus> {
    const userId = req.user.id;
    return this.likesService.unlikeVideo(videoId, userId);
  }

  /**
   * POST /videos/:videoId/like/toggle
   * Toggle like (curtir/descurtir)
   */
  @Post(':videoId/like/toggle')
  @UseGuards(FirebaseAuthGuard)
  async toggleLike(
    @Param('videoId') videoId: string,
    @Request() req: any,
  ): Promise<LikeStatus> {
    const userId = req.user.id;
    return this.likesService.toggleLike(videoId, userId);
  }
}
