import { Module } from '@nestjs/common';
import { ForumCategoriesService } from './forum-categories.service';
import { ForumCategoriesController } from './forum-categories.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ForumCategoriesController],
  providers: [ForumCategoriesService],
  exports: [ForumCategoriesService],
})
export class ForumCategoriesModule {}
