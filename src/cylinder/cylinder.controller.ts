import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { CylinderService } from './cylinder.service';
import { CylinderPropsDto } from './cylinder.dto';
import { toRes } from 'src/common/toRes.common';
import { MetricsInterceptor } from 'src/common/metrics.interceptor';

@Controller('cylinder')
export class CylinderController {
  private readonly logger = new Logger(CylinderController.name);
  constructor(private readonly cylinderService: CylinderService) {}
  @UseInterceptors(MetricsInterceptor)
  @Get('area')
  @UsePipes(new ValidationPipe())
  async getArea(
    @Query() cylinderProps: CylinderPropsDto,
  ): Promise<{ data: number }> {
    const result = await this.cylinderService.getArea(cylinderProps);
    this.logger.log('This is test to check');
    return toRes<number>(result);
  }
}
