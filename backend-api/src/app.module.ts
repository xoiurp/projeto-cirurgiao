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
  ],
})
export class AppModule {}
