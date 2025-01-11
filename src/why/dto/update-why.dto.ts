import { PartialType } from '@nestjs/swagger';
import { CreateWhyDto } from './create-why.dto';

export class UpdateWhyDto extends PartialType(CreateWhyDto) {}
