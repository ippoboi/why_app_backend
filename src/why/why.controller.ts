import { Controller } from '@nestjs/common';
import { WhyService } from './why.service';

@Controller('why')
export class WhyController {
  constructor(private readonly whyService: WhyService) {}
}
