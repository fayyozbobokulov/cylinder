import { IsString } from 'class-validator';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export class LoggerConfigDto {
  @IsString()
  level: LogLevel;
}
