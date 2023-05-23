import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CylinderPropsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  height: number;
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  radius: number;
}
