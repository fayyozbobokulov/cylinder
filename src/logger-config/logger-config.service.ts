import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LogLevel } from './logger-config.dto';

@Injectable()
export class LoggerConfigService {
  constructor(private readonly logger: PinoLogger) {}

  changeLogLevel(level: LogLevel) {
    try {
      this.logger.setContext('LoggerConfigService');
      this.logger.info(`Changing log level to ${level}`);
      this.logger.logger.level = level;
    } catch (err) {
      this.logger.error('Failed to change log level', err);
    }
  }
}
