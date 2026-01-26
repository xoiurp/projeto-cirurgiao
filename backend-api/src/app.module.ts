import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CloudflareModule } from './modules/cloudflare/cloudflare.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ModulesModule } from './modules/modules/modules.module';
import { VideosModule } from './modules/videos/videos.module';
import { ProgressModule } from './modules/progress/progress.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { UploadModule } from './modules/upload/upload.module';
import { LikesModule } from './modules/likes/likes.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { NotesModule } from './modules/notes/notes.module';
import { TranscriptsModule } from './modules/transcripts/transcripts.module';
import { ForumCategoriesModule } from './modules/forum-categories/forum-categories.module';
import { ForumModule } from './modules/forum/forum.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    FirebaseModule, // Firebase Admin SDK
    AuthModule,
    UsersModule,
    CloudflareModule,
    CoursesModule,
    ModulesModule,
    VideosModule,
    ProgressModule,
    UploadModule,
    LikesModule,
    MaterialsModule,
    NotesModule,
    TranscriptsModule,
    ForumCategoriesModule,
    ForumModule,
  ],
})
export class AppModule {}
