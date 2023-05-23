import { Controller, Post, Body } from '@nestjs/common';
import { LoggerConfigService } from './logger-config.service';
import { LogLevel } from './logger-config.dto';
import { PinoLogger } from 'nestjs-pino';

@Controller('logger')
export class LoggerConfigController {
  constructor(private readonly loggerConfigService: LoggerConfigService) {}

  @Post('level')
  changeLogLevel(
    @Body('level')
    level: LogLevel,
  ) {
    // PinoLogger.root.level = level;
    // return null;
    this.loggerConfigService.changeLogLevel(level);
  }
}
