import { Controller, Post, Body } from '@nestjs/common';
import { LoggerConfigService } from './logger-config.service';
import { LogLevel } from './logger-config.dto';

@Controller('logger')
export class LoggerConfigController {
  constructor(private readonly loggerConfigService: LoggerConfigService) {}

  @Post('level')
  changeLogLevel(
    @Body('level')
    level: LogLevel,
  ) {
    this.loggerConfigService.changeLogLevel(level);
  }
}
