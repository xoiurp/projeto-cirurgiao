import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudflareStreamService } from './cloudflare-stream.service';
import { CloudflareR2Service } from './cloudflare-r2.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudflareStreamService, CloudflareR2Service],
  exports: [CloudflareStreamService, CloudflareR2Service],
})
export class CloudflareModule {}
