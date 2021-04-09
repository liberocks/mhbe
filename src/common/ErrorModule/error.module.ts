import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ErrorService } from './error.service';

@Module({
  imports: [ConfigModule],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
