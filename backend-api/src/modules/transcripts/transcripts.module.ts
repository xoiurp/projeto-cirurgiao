import { Module } from '@nestjs/common';
import { TranscriptsService } from './transcripts.service';
import { TranscriptsController } from './transcripts.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [TranscriptsController],
  providers: [TranscriptsService],
  exports: [TranscriptsService],
})
export class TranscriptsModule {}
