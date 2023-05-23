import { Module } from '@nestjs/common';
import { CylinderController } from './cylinder/cylinder.controller';
import { CylinderService } from './cylinder/cylinder.service';
import { NatsService } from './nats/nats.service';
import { MathService } from './math/math.service';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { Response, Request } from 'express';
import { LoggerConfigService } from './logger-config/logger-config.service';
import { LoggerConfigController } from './logger-config/logger-config.controller';
import { HealthModule } from './health/health.module';

@Module({
  controllers: [CylinderController, LoggerConfigController],
  providers: [
    AppService,
    CylinderService,
    NatsService,
    MathService,
    LoggerConfigService,
  ],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customProps: (req: Request, res: Response) => ({
          context: 'HTTP',
        }),
        level: process.env.LOG_LEVEL || 'debug',
        useLevel: 'debug',
      },
    }),
    HealthModule,
  ],
})
export class AppModule {}
