import { Module } from '@nestjs/common';
import { WhyService } from './why.service';
import { WhyController } from './why.controller';

@Module({
  controllers: [WhyController],
  providers: [WhyService],
})
export class WhyModule {}
